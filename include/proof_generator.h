/*
 * proof_generator.h — NIYAH Forensic Proof System
 */
#ifndef NIYAH_PROOF_GENERATOR_H
#define NIYAH_PROOF_GENERATOR_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    uint32_t state[8];
    uint64_t count;
    uint8_t buffer[64];
} NiyahSha256Ctx;

void niyah_sha256_init(NiyahSha256Ctx *ctx);
void niyah_sha256_update(NiyahSha256Ctx *ctx, const uint8_t *data, size_t len);
void niyah_sha256_final(NiyahSha256Ctx *ctx, uint8_t hash[32]);

/* One-shot */
void niyah_sha256(const uint8_t *data, size_t len, uint8_t out[32]);

/* Proof format */
void niyah_proof_generate(const char *prompt, const char *output, const char *rule_file_content, uint8_t proof[32]);
int niyah_proof_save(const char *path, const uint8_t proof[32], const char *prompt, const char *output, const char *rule_file_content);

/* Test */
int niyah_proof_smoke(void);

#ifdef __cplusplus
}
#endif

#endif
