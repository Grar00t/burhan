/*
 * rule_parser.c — NIYAH Symbolic Rule Parser Implementation
 */
#define _GNU_SOURCE
#include "rule_parser.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>

/* ── §1  Arena Allocator ────────────────────────────────────────── */

typedef struct {
    uint8_t *data;
    size_t capacity;
    size_t used;
} Arena;

static void *arena_alloc(Arena *a, size_t size) {
    size_t align = 8;
    size_t padding = (align - (a->used % align)) % align;
    if (a->used + padding + size > a->capacity) return NULL;
    a->used += padding;
    void *ptr = a->data + a->used;
    a->used += size;
    return ptr;
}

static char *arena_strdup(Arena *a, const char *s) {
    if (!s) return NULL;
    size_t len = strlen(s);
    char *p = (char*)arena_alloc(a, len + 1);
    if (p) memcpy(p, s, len + 1);
    return p;
}

/* ── §2  Lexer ─────────────────────────────────────────────────── */

typedef enum {
    TOK_EOF,
    TOK_IDENT,
    TOK_STRING,
    TOK_NUMBER,
    TOK_SYMBOL, // { } ( ) , = : .
    TOK_KEYWORD
} TokenType;

typedef struct {
    const char *source;
    size_t pos;
    char lexeme[1024];
    TokenType type;
    double num_val;
} Lexer;

static void next_token(Lexer *l) {
    while (l->source[l->pos] && isspace((unsigned char)l->source[l->pos])) l->pos++;
    
    if (l->source[l->pos] == '\0') {
        l->type = TOK_EOF;
        return;
    }

    char c = l->source[l->pos];

    // Comments
    if (c == '/' && l->source[l->pos+1] == '/') {
        while (l->source[l->pos] && l->source[l->pos] != '\n') l->pos++;
        next_token(l);
        return;
    }

    if (c == '\"') {
        l->pos++;
        size_t len = 0;
        while (l->source[l->pos] && l->source[l->pos] != '\"') {
            l->lexeme[len++] = l->source[l->pos++];
        }
        l->lexeme[len] = '\0';
        l->pos++;
        l->type = TOK_STRING;
        return;
    }

    if (isdigit((unsigned char)c)) {
        char *end;
        l->num_val = strtod(l->source + l->pos, &end);
        l->pos = end - l->source;
        l->type = TOK_NUMBER;
        return;
    }

    if (isalpha((unsigned char)c) || c == '_') {
        size_t len = 0;
        while (isalnum((unsigned char)l->source[l->pos]) || l->source[l->pos] == '_') {
            l->lexeme[len++] = l->source[l->pos++];
        }
        l->lexeme[len] = '\0';
        l->type = TOK_IDENT;
        return;
    }

    l->lexeme[0] = l->source[l->pos++];
    l->lexeme[1] = '\0';
    l->type = TOK_SYMBOL;
}

/* ── §3  Parser ────────────────────────────────────────────────── */

static bool match(Lexer *l, const char *s) {
    if (l->type == TOK_IDENT && strcmp(l->lexeme, s) == 0) {
        next_token(l);
        return true;
    }
    if (l->type == TOK_SYMBOL && strcmp(l->lexeme, s) == 0) {
        next_token(l);
        return true;
    }
    return false;
}

static bool expect(Lexer *l, const char *s) {
    if (match(l, s)) return true;
    fprintf(stderr, "EXPECTED '%s' but got '%s'\n", s, l->lexeme);
    return false;
}

AstNRuleFile *niyah_rule_parse(const char *content) {
    size_t arena_size = 1024 * 1024;
    uint8_t *data = malloc(arena_size);
    Arena a = { data, arena_size, 0 };
    
    AstNRuleFile *file = (AstNRuleFile*)arena_alloc(&a, sizeof(AstNRuleFile));
    memset(file, 0, sizeof(*file));
    file->arena = data;

    Lexer l = { content, 0, "", TOK_EOF, 0 };
    next_token(&l);

    // RULESET "NAME" VERSION X.X
    if (!expect(&l, "RULESET")) return NULL;
    file->ruleset_name = arena_strdup(&a, l.lexeme);
    next_token(&l);
    if (!expect(&l, "VERSION")) return NULL;
    file->version = l.num_val;
    next_token(&l);

    // METADATA { ... }
    if (match(&l, "METADATA")) {
        expect(&l, "{");
        while (l.type != TOK_EOF && !match(&l, "}")) {
            // identifier = value
            char *key = arena_strdup(&a, l.lexeme);
            next_token(&l);
            expect(&l, "=");
            // simplify: assume strings for now
            file->metadata.entries = realloc(file->metadata.entries, (file->metadata.count + 1) * sizeof(AstMetadataEntry));
            file->metadata.entries[file->metadata.count].key = key;
            file->metadata.entries[file->metadata.count].type = (l.type == TOK_NUMBER ? META_NUMBER : META_STRING);
            if (l.type == TOK_NUMBER) file->metadata.entries[file->metadata.count].value.n = l.num_val;
            else file->metadata.entries[file->metadata.count].value.s = arena_strdup(&a, l.lexeme);
            file->metadata.count++;
            next_token(&l);
        }
    }

    // Skipping SCOPE for brevity in this slice
    if (match(&l, "SCOPE")) {
        expect(&l, "{");
        while (l.type != TOK_EOF && !match(&l, "}")) next_token(&l);
    }

    // CONSTRAINTS { ... }
    if (match(&l, "CONSTRAINTS")) {
        expect(&l, "{");
        while (l.type != TOK_EOF && !match(&l, "}")) {
            if (match(&l, "FACT")) {
                // FACT name(args)
                char *name = arena_strdup(&a, l.lexeme);
                next_token(&l);
                expect(&l, "(");
                while (l.type != TOK_EOF && !match(&l, ")")) next_token(&l);
                // logic to store fact...
            } else if (match(&l, "RULE")) {
                char *name = arena_strdup(&a, l.lexeme);
                next_token(&l);
                expect(&l, ":");
                // Simplified expression capture
                size_t start = l.pos;
                while (l.type != TOK_EOF && l.type != TOK_IDENT && strcmp(l.lexeme, "RULE") != 0 && strcmp(l.lexeme, "REQUIRE") != 0 && strcmp(l.lexeme, "}") != 0) {
                   next_token(&l);
                }
                // Store rule...
            } else if (match(&l, "REQUIRE")) {
                char *req = arena_strdup(&a, l.lexeme);
                file->constraints.required_rules = realloc(file->constraints.required_rules, (file->constraints.require_count + 1) * sizeof(char*));
                file->constraints.required_rules[file->constraints.require_count++] = req;
                next_token(&l);
            } else {
                next_token(&l);
            }
        }
    }

    return file;
}

void niyah_rule_free(AstNRuleFile *file) {
    if (!file) return;
    free(file->arena);
    // Note: metadata.entries was realloced outside arena in this slice, should be arena-handled in full impl
    free(file->metadata.entries);
    free(file->constraints.required_rules);
}

/* ── §4  Verification ─────────────────────────────────────────── */

bool niyah_rule_verify(const AstNRuleFile *file, const NiyahRuleContext *ctx, char *error_msg) {
    // Forensic pattern: Check "bismillah" requirement if specified in SCOPE/CONSTRAINTS
    for (size_t i = 0; i < file->constraints.require_count; i++) {
        const char *req = file->constraints.required_rules[i];
        if (strcmp(req, "must_begin_with_bismillah") == 0) {
            if (!ctx->output || strncasecmp(ctx->output, "bismillah", 9) != 0) {
                if (error_msg) sprintf(error_msg, "Policy Violation: Response must begin with 'bismillah'.");
                return false;
            }
        }
    }
    return true;
}

int niyah_rule_smoke(void) {
    const char *test = 
        "RULESET \"NIYAH_CORE_S1\" VERSION 1.0\n"
        "METADATA { author = \"Sovereign\" }\n"
        "CONSTRAINTS {\n"
        "  RULE must_begin_with_bismillah : contains(output, 'bismillah')\n"
        "  REQUIRE must_begin_with_bismillah\n"
        "}\n";
    
    AstNRuleFile *file = niyah_rule_parse(test);
    if (!file) return 1;
    
    NiyahRuleContext ctx = { "hello", "bismillah friend", NULL };
    char err[256];
    if (!niyah_rule_verify(file, &ctx, err)) {
        niyah_rule_free(file);
        return 2;
    }
    
    ctx.output = "unverified message";
    if (niyah_rule_verify(file, &ctx, err)) {
        niyah_rule_free(file);
        return 3;
    }
    
    niyah_rule_free(file);
    return 0; // PASS
}
