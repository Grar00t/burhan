/*
 * tokenizer.h — NIYAH UTF-8 Tokenizer API
 */
#ifndef NIYAH_TOKENIZER_H
#define NIYAH_TOKENIZER_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct Tokenizer Tokenizer;

Tokenizer *tokenizer_alloc(uint32_t size);
void       tokenizer_free(Tokenizer *t);
void       tokenizer_set(Tokenizer *t, uint32_t id, const char *str);
uint32_t   tokenizer_encode(Tokenizer *t, const char *text, uint32_t *tokens, uint32_t max_tokens);
void       tokenizer_decode(Tokenizer *t, const uint32_t *tokens, uint32_t n, char *out);

#ifdef __cplusplus
}
#endif

#endif
