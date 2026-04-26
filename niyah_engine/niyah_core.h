/*
 * niyah_core.h — NIYAH Sovereign Inference Engine v3.0
 * نحن ورثة الخوارزمي — لا يوجد مستحيل في الدنيا
 */
#ifndef NIYAH_CORE_H
#define NIYAH_CORE_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#include <float.h>

#ifdef __cplusplus
extern "C" {
#endif

#define NIYAH_MAGIC     UINT32_C(0x4E595148)   /* "NYQH" */
#define NIYAH_VER       UINT32_C(0x0005)
#define NIYAH_MAX_CTX   UINT32_C(8192)
#define NIYAH_MAX_VOCAB UINT32_C(131072)

typedef enum {
    NIYAH_QTYPE_F32 = 0,
    NIYAH_QTYPE_Q8_0 = 1,
    NIYAH_QTYPE_Q4_0 = 2,
} NiyahQType;

typedef struct {
    uint32_t magic;
    uint32_t version;
    uint32_t embed_dim;
    uint32_t n_heads;
    uint32_t n_kv_heads;    /* GQA: kv heads (≤ n_heads) */
    uint32_t n_layers;
    uint32_t ffn_mult;      /* ffn_hidden = embed_dim * ffn_mult */
    uint32_t vocab_size;
    uint32_t ctx_len;
    float    rope_theta;
    float    rope_scale;    /* RoPE scaling factor */
    float    rms_eps;
    uint32_t qtype;         /* NiyahQType */
    uint32_t use_gpu;       /* 1 if GPU acceleration is enabled */
    uint8_t  _pad[12];      /* pad to 64 bytes total */
} NiyahConfig;

typedef struct {
    void *wq; void *wk; void *wv; void *wo;
    void *w_gate; void *w_up; void *w_down;
    float *rms_att; float *rms_ffn;
    // GPU pointers
    void *d_wq; void *d_wk; void *d_wv; void *d_wo;
    void *d_w_gate; void *d_w_up; void *d_w_down;
    float *d_rms_att; float *d_rms_ffn;
} NiyahLayer;

typedef struct {
    NiyahConfig  cfg;
    NiyahLayer  *layers;
    float *token_embed;
    float *rms_final;
    float *lm_head;
    float *kv_k;
    float *kv_v;
    float *scratch;
    float *_logits;
    void  *_pool;
    size_t _pool_bytes;
    uint32_t head_dim;
    uint32_t kv_dim;
    uint32_t ffn_dim;
    // GPU pointers for model-level weights
    float *d_token_embed;
    float *d_rms_final;
    float *d_lm_head;
    float *d_scratch;
} NiyahModel;

typedef struct {
    float   *m; float *v;
    uint32_t step;
    float    lr; float beta1; float beta2; float eps; float wd;
    size_t   n_weights;
} NiyahAdam;

typedef struct {
    float temperature;
    float top_p;
    uint64_t seed;
} NiyahSampler;

NiyahModel *niyah_alloc(const NiyahConfig *cfg);
void        niyah_free (NiyahModel *m);
int         niyah_save(const NiyahModel *m, const char *path);
int         niyah_load(NiyahModel **out,    const char *path);
float      *niyah_forward(NiyahModel *m, uint32_t token, uint32_t pos);
uint32_t    niyah_sample(const float *logits, uint32_t vocab_size, NiyahSampler *s);
float       niyah_train_step(NiyahModel *m, NiyahAdam *opt, const uint32_t *tokens, uint32_t n);
NiyahAdam  *niyah_adam_alloc(const NiyahModel *m);
void        niyah_adam_free (NiyahAdam *opt);
const char *niyah_simd_name(void);
size_t      niyah_param_count(const NiyahModel *m);
int         niyah_smoke(void);

#ifdef __cplusplus
}
#endif
#endif
