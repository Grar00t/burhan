/*
 * tokenizer.c — UTF-8 BPE Tokenizer for NIYAH
 */
#include "tokenizer.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#define MAX_TOKEN_LEN 256

typedef struct {
    char *str;
    uint32_t id;
} TokenEntry;

struct Tokenizer {
    TokenEntry *vocab;
    uint32_t size;
};

Tokenizer *tokenizer_alloc(uint32_t size) {
    Tokenizer *t = malloc(sizeof(Tokenizer));
    t->size = size;
    t->vocab = calloc(size, sizeof(TokenEntry));
    return t;
}

void tokenizer_free(Tokenizer *t) {
    for (uint32_t i = 0; i < t->size; i++) free(t->vocab[i].str);
    free(t->vocab);
    free(t);
}

void tokenizer_set(Tokenizer *t, uint32_t id, const char *str) {
    if (id >= t->size) return;
    free(t->vocab[id].str);
    t->vocab[id].str = strdup(str);
    t->vocab[id].id = id;
}

uint32_t tokenizer_encode(Tokenizer *t, const char *text, uint32_t *tokens, uint32_t max_tokens) {
    // Naive character-level tokenizer for demonstration
    uint32_t count = 0;
    const char *p = text;
    while (*p && count < max_tokens) {
        // Attempt to match longest prefix in vocab
        uint32_t best_id = 0; // Default to <UNK> if vocab starts at 1
        size_t best_len = 0;
        
        for (uint32_t i = 0; i < t->size; i++) {
            if (t->vocab[i].str) {
                size_t len = strlen(t->vocab[i].str);
                if (len > best_len && strncmp(p, t->vocab[i].str, len) == 0) {
                    best_id = t->vocab[i].id;
                    best_len = len;
                }
            }
        }
        
        if (best_len > 0) {
            tokens[count++] = best_id;
            p += best_len;
        } else {
            // Raw byte fallback or skip
            p++;
        }
    }
    return count;
}

void tokenizer_decode(Tokenizer *t, const uint32_t *tokens, uint32_t n, char *out) {
    out[0] = '\0';
    for (uint32_t i = 0; i < n; i++) {
        if (tokens[i] < t->size && t->vocab[tokens[i]].str) {
            strcat(out, t->vocab[tokens[i]].str);
        }
    }
}
