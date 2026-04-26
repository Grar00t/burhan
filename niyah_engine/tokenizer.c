/*
 * tokenizer.c — Niyah Tokenizer C99
 * يدعم العربية + القرآن + C/Assembly/Perl
 * Pure C99 — zero external deps
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <ctype.h>

static int is_arabic(uint32_t c) {
    return (c >= 0x0600 && c <= 0x06FF) ||
           (c >= 0x0750 && c <= 0x077F) ||
           (c >= 0x08A0 && c <= 0x08FF) ||
           (c >= 0xFB50 && c <= 0xFDFF) ||
           (c >= 0xFE70 && c <= 0xFEFF);
}

#define MAX_VOCAB 65536
#define HASH_SIZE 131072

typedef struct {
    char token[64];
    uint32_t hash;
    uint32_t id;
} TokenEntry;

static TokenEntry vocab[MAX_VOCAB];
static uint32_t vocab_size = 0;
static int32_t hash_table[HASH_SIZE];

static uint32_t hash_str(const char *str) {
    uint32_t h = 5381;
    int c;
    while ((c = *str++)) h = ((h << 5) + h) + c;
    return h;
}

static void add_token(const char *s) {
    if (vocab_size >= MAX_VOCAB) return;
    uint32_t h_val = hash_str(s);
    strncpy(vocab[vocab_size].token, s, 63);
    vocab[vocab_size].token[63] = '\0';
    vocab[vocab_size].hash = h_val;
    vocab[vocab_size].id = vocab_size;
    
    uint32_t h = h_val % HASH_SIZE;
    while (hash_table[h] != -1) h = (h + 1) % HASH_SIZE;
    hash_table[h] = vocab_size;
    
    vocab_size++;
}

static int32_t find_token(const char *s) {
    uint32_t h_val = hash_str(s);
    uint32_t h = h_val % HASH_SIZE;
    while (hash_table[h] != -1) {
        TokenEntry *entry = &vocab[hash_table[h]];
        if (entry->hash == h_val && strcmp(entry->token, s) == 0) return entry->id;
        h = (h + 1) % HASH_SIZE;
    }
    return -1;
}

void tokenizer_init(void) {
    vocab_size = 0;
    for (int i = 0; i < HASH_SIZE; i++) hash_table[i] = -1;
    
    add_token("<BOS>");
    add_token("<EOS>");
    add_token("<PAD>");
    add_token("<UNK>");
    for (int i = 0; i < 10; i++) {
        char buf[4];
        sprintf(buf, "%d", i);
        add_token(buf);
    }
    add_token("("); add_token(")"); add_token("{"); add_token("}");
    add_token(";"); add_token("="); add_token("+"); add_token("-");
    add_token("*"); add_token("/"); add_token("#"); add_token(".");
}

uint32_t tokenizer_encode(const char *text, uint32_t *tokens, uint32_t max_len) {
    uint32_t pos = 0;
    const char *p = text;
    if (pos < max_len) tokens[pos++] = 0; /* BOS */

    while (*p && pos < max_len - 1) {
        if (isspace((unsigned char)*p)) { p++; continue; }

        /* Arabic / Quran character */
        if ((unsigned char)*p >= 0xC0) {
            uint32_t uc = 0;
            const unsigned char *s = (const unsigned char *)p;
            if (s[0] < 0xE0) {
                if (!s[1]) break;
                uc = ((s[0]&0x1F)<<6) | (s[1]&0x3F);
                p += 2;
            } else if (s[0] < 0xF0) {
                if (!s[1] || !s[2]) break;
                uc = ((s[0]&0x0F)<<12) | ((s[1]&0x3F)<<6) | (s[2]&0x3F);
                p += 3;
            } else {
                if (!s[1] || !s[2] || !s[3]) break;
                uc = ((s[0]&0x07)<<18) | ((s[1]&0x3F)<<12) | ((s[2]&0x3F)<<6) | (s[3]&0x3F);
                p += 4;
            }
            if (is_arabic(uc)) {
                tokens[pos++] = 1000 + (uc % 5000);
                continue;
            }
            tokens[pos++] = 6000 + (uc % 10000); /* other unicode */
            continue;
        }

        /* punctuation */
        if (ispunct((unsigned char)*p)) {
            char sym[2] = {*p, '\0'};
            int32_t id = find_token(sym);
            tokens[pos++] = (id == -1) ? 3 : (uint32_t)id;
            p++;
            continue;
        }

        /* English / C code word */
        char word[64] = {0};
        int i = 0;
        while (*p && !isspace((unsigned char)*p) && !ispunct((unsigned char)*p) && i < 63) {
            word[i++] = *p++;
        }
        if (i > 0) {
            int32_t id = find_token(word);
            tokens[pos++] = (id == -1) ? 3 : (uint32_t)id;
        }
    }
    if (pos < max_len) tokens[pos++] = 1; /* EOS */
    return pos;
}

void tokenizer_free(void) { vocab_size = 0; }
