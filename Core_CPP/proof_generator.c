/*
 * proof_generator.c — NIYAH Forensic Proof System (SHA-256)
 * Public domain implementation of SHA-256 (FIPS 180-4)
 */
#include "proof_generator.h"
#include <string.h>
#include <stdio.h>

#define CH(x,y,z) (((x) & (y)) ^ (~(x) & (z)))
#define MAJ(x,y,z) (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))
#define ROTR(x,n) (((x) >> (n)) | ((x) << (32 - (n))))
#define SIG0(x) (ROTR(x, 2) ^ ROTR(x, 13) ^ ROTR(x, 22))
#define SIG1(x) (ROTR(x, 6) ^ ROTR(x, 11) ^ ROTR(x, 25))
#define sig0(x) (ROTR(x, 7) ^ ROTR(x, 18) ^ ((x) >> 3))
#define sig1(x) (ROTR(x, 17) ^ ROTR(x, 19) ^ ((x) >> 10))

static const uint32_t K[64] = {
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
};

static void transform(NiyahSha256Ctx *ctx) {
    uint32_t w[64], a, b, c, d, e, f, g, h, t1, t2;
    for (int i = 0; i < 16; i++) {
        w[i] = ((uint32_t)ctx->buffer[i*4] << 24) | ((uint32_t)ctx->buffer[i*4+1] << 16) |
               ((uint32_t)ctx->buffer[i*4+2] << 8) | (uint32_t)ctx->buffer[i*4+3];
    }
    for (int i = 16; i < 64; i++) w[i] = sig1(w[i-2]) + w[i-7] + sig0(w[i-15]) + w[i-16];
    a = ctx->state[0]; b = ctx->state[1]; c = ctx->state[2]; d = ctx->state[3];
    e = ctx->state[4]; f = ctx->state[5]; g = ctx->state[6]; h = ctx->state[7];
    for (int i = 0; i < 64; i++) {
        t1 = h + SIG1(e) + CH(e, f, g) + K[i] + w[i];
        t2 = SIG0(a) + MAJ(a, b, c);
        h = g; g = f; f = e; e = d + t1; d = c; c = b; b = a; a = t1 + t2;
    }
    ctx->state[0] += a; ctx->state[1] += b; ctx->state[2] += c; ctx->state[3] += d;
    ctx->state[4] += e; ctx->state[5] += f; ctx->state[6] += g; ctx->state[7] += h;
}

void niyah_sha256_init(NiyahSha256Ctx *ctx) {
    ctx->state[0] = 0x6a09e667; ctx->state[1] = 0xbb67ae85; ctx->state[2] = 0x3c6ef372; ctx->state[3] = 0xa54ff53a;
    ctx->state[4] = 0x510e527f; ctx->state[5] = 0x9b05688c; ctx->state[6] = 0x1f83d9ab; ctx->state[7] = 0x5be0cd19;
    ctx->count = 0;
}

void niyah_sha256_update(NiyahSha256Ctx *ctx, const uint8_t *data, size_t len) {
    for (size_t i = 0; i < len; i++) {
        ctx->buffer[ctx->count % 64] = data[i];
        ctx->count++;
        if (ctx->count % 64 == 0) transform(ctx);
    }
}

void niyah_sha256_final(NiyahSha256Ctx *ctx, uint8_t hash[32]) {
    uint64_t bitlen = ctx->count * 8;
    niyah_sha256_update(ctx, (const uint8_t[]){0x80}, 1);
    while (ctx->count % 64 != 56) niyah_sha256_update(ctx, (const uint8_t[]){0x00}, 1);
    for (int i = 7; i >= 0; i--) niyah_sha256_update(ctx, (const uint8_t[]){(uint8_t)(bitlen >> (i * 8))}, 1);
    for (int i = 0; i < 8; i++) {
        hash[i*4]   = (uint8_t)(ctx->state[i] >> 24); hash[i*4+1] = (uint8_t)(ctx->state[i] >> 16);
        hash[i*4+2] = (uint8_t)(ctx->state[i] >> 8);  hash[i*4+3] = (uint8_t)ctx->state[i];
    }
}

void niyah_sha256(const uint8_t *data, size_t len, uint8_t out[32]) {
    NiyahSha256Ctx ctx;
    niyah_sha256_init(&ctx);
    niyah_sha256_update(&ctx, data, len);
    niyah_sha256_final(&ctx, out);
}

void niyah_proof_generate(const char *prompt, const char *output, const char *rule_file_content, uint8_t proof[32]) {
    NiyahSha256Ctx ctx;
    niyah_sha256_init(&ctx);
    if(prompt) niyah_sha256_update(&ctx, (const uint8_t*)prompt, strlen(prompt));
    if(output) niyah_sha256_update(&ctx, (const uint8_t*)output, strlen(output));
    if(rule_file_content) niyah_sha256_update(&ctx, (const uint8_t*)rule_file_content, strlen(rule_file_content));
    niyah_sha256_final(&ctx, proof);
}

int niyah_proof_save(const char *path, const uint8_t proof[32], const char *prompt, const char *output, const char *rule_file_content) {
    FILE *f = fopen(path, "w");
    if(!f) return -1;
    fprintf(f, "NIYAH-PROOF-V1\n");
    fprintf(f, "hash: ");
    for(int i=0; i<32; i++) fprintf(f, "%02x", proof[i]);
    fprintf(f, "\nprompt: %s\n", prompt ? prompt : "");
    fprintf(f, "output: %s\n", output ? output : "");
    fprintf(f, "rules: %s\n", rule_file_content ? rule_file_content : "");
    fclose(f);
    return 0;
}

int niyah_proof_smoke(void) {
    uint8_t h[32];
    niyah_sha256((const uint8_t*)"abc", 3, h);
    static const uint8_t expected[32] = {
        0xba,0x78,0x16,0xbf,0x8f,0x01,0xcf,0xea,0x41,0x41,0x40,0xde,0x5d,0xae,0x22,0x23,
        0xb0,0x03,0x61,0xa3,0x96,0x17,0x7a,0x9c,0xb4,0x10,0xff,0x61,0xf2,0x00,0x15,0xad
    };
    return memcmp(h, expected, 32) == 0 ? 0 : 1;
}

#ifdef PROOF_STANDALONE_TEST
int main() {
    if(niyah_proof_smoke() == 0) printf("PROOF SMOKE PASS\n");
    else printf("PROOF SMOKE FAIL\n");
}
#endif
