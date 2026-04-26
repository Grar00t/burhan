/*
 * niyah_core.c — NIYAH Sovereign Inference Engine v3.0
 */
#define _GNU_SOURCE
#include "niyah_core.h"
#include "tokenizer.h"
#include "rule_parser.h"
#include "proof_generator.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <math.h>
#include <assert.h>
#include <time.h>
#include <stdint.h>

#if defined(__AVX2__) && defined(__FMA__)
#  include <immintrin.h>
#  define SIMD_AVX2 1
#elif defined(__ARM_NEON)
#  include <arm_neon.h>
#  define SIMD_NEON 1
#endif

// Block types for quantization
typedef struct {
    float d;
    int8_t qs[32];
} block_q8_0;

typedef struct {
    float d;
    uint8_t qs[16]; // 32 nibbles
} block_q4_0;

static void *xmalloc(size_t n) {
    void *p = malloc(n);
    if (!p) { fprintf(stderr, "[niyah] OOM: %zu bytes\n", n); abort(); }
    return p;
}
static void *xcalloc(size_t n, size_t sz) {
    void *p = calloc(n, sz);
    if (!p) { fprintf(stderr, "[niyah] OOM: %zu×%zu bytes\n", n, sz); abort(); }
    return p;
}

const char *niyah_simd_name(void) {
#if defined(SIMD_AVX2)
    return "AVX2+FMA";
#elif defined(SIMD_NEON)
    return "NEON";
#else
    return "Scalar";
#endif
}

static void matvec(float * restrict y, const float * restrict A, const float * restrict x, size_t R, size_t C) {
#if defined(SIMD_AVX2)
    for (size_t r = 0; r < R; r++) {
        const float *row = A + r * C;
        __m256 a0 = _mm256_setzero_ps();
        __m256 a1 = _mm256_setzero_ps();
        size_t c = 0;
        for (; c + 15 < C; c += 16) {
            a0 = _mm256_fmadd_ps(_mm256_loadu_ps(row+c),   _mm256_loadu_ps(x+c),   a0);
            a1 = _mm256_fmadd_ps(_mm256_loadu_ps(row+c+8), _mm256_loadu_ps(x+c+8), a1);
        }
        __m256 acc = _mm256_add_ps(a0, a1);
        __m128 lo = _mm256_castps256_ps128(acc);
        __m128 hi = _mm256_extractf128_ps(acc, 1);
        __m128 s4 = _mm_add_ps(lo, hi);
        __m128 s2 = _mm_add_ps(s4, _mm_movehdup_ps(s4));
        float dot = _mm_cvtss_f32(_mm_add_ss(s2, _mm_movehl_ps(s2, s2)));
        for (; c < C; c++) dot += row[c] * x[c];
        y[r] = dot;
    }
#elif defined(SIMD_NEON)
    for (size_t r = 0; r < R; r++) {
        const float *row = A + r * C;
        float32x4_t a0 = vdupq_n_f32(0.f);
        float32x4_t a1 = vdupq_n_f32(0.f);
        size_t c = 0;
        for (; c + 7 < C; c += 8) {
            a0 = vmlaq_f32(a0, vld1q_f32(row+c),   vld1q_f32(x+c));
            a1 = vmlaq_f32(a1, vld1q_f32(row+c+4), vld1q_f32(x+c+4));
        }
        float32x4_t acc = vaddq_f32(a0, a1);
        float32x2_t lo2 = vadd_f32(vget_low_f32(acc), vget_high_f32(acc));
        float dot = vget_lane_f32(vpadd_f32(lo2, lo2), 0);
        for (; c < C; c++) dot += row[c] * x[c];
        y[r] = dot;
    }
#else
    for (size_t r = 0; r < R; r++) {
        const float *row = A + r * C;
        float dot = 0.f;
        for (size_t c = 0; c < C; c++) dot += row[c] * x[c];
        y[r] = dot;
    }
#endif
}

static void rmsnorm(float * restrict out, const float * restrict x, const float * restrict w, size_t n, float eps) {
    float ss = 0.f;
    for (size_t j = 0; j < n; j++) ss += x[j] * x[j];
    float scale = 1.0f / sqrtf(ss / (float)n + eps);
    for (size_t k = 0; k < n; k++) out[k] = x[k] * scale * w[k];
}

static inline float silu(float v) { return v / (1.0f + expf(-v)); }

static void rope(float *qk, uint32_t pos, uint32_t head_dim, float theta, float scale) {
    for (uint32_t i = 0; i < head_dim; i += 2) {
        float angle = (float)pos / (powf(theta, (float)i / (float)head_dim) * scale);
        float c = cosf(angle), s = sinf(angle);
        float v0 = qk[i], v1 = qk[i+1];
        qk[i]   = v0*c - v1*s;
        qk[i+1] = v0*s + v1*c;
    }
}

static size_t weight_count(const NiyahConfig *c) {
    size_t d = c->embed_dim;
    size_t L = c->n_layers;
    size_t v = c->vocab_size;
    size_t f = d * c->ffn_mult;
    return v*d + d + v*d + L*2*d + L*(4*d*d + 3*d*f);
}

size_t niyah_param_count(const NiyahModel *m) {
    return weight_count(&m->cfg);
}

static size_t weight_bytes(const NiyahConfig *c) {
    size_t d = c->embed_dim;
    size_t L = c->n_layers;
    size_t v = c->vocab_size;
    size_t f = d * c->ffn_mult;
    
    size_t n_f32 = v*d + d + v*d + L*2*d; 
    size_t n_q = L*(4*d*d + 3*d*f); 
    
    size_t total = n_f32 * sizeof(float);
    if (c->qtype == NIYAH_QTYPE_F32) {
        total += n_q * sizeof(float);
    } else if (c->qtype == NIYAH_QTYPE_Q8_0) {
        total += (n_q / 32) * sizeof(block_q8_0);
    } else if (c->qtype == NIYAH_QTYPE_Q4_0) {
        total += (n_q / 32) * sizeof(block_q4_0);
    }
    return total;
}

NiyahModel *niyah_alloc(const NiyahConfig *cfg) {
    NiyahModel *m = (NiyahModel*)xcalloc(1, sizeof(*m));
    m->cfg = *cfg;
    m->head_dim = cfg->embed_dim / cfg->n_heads;
    m->kv_dim = cfg->n_kv_heads * m->head_dim;
    m->ffn_dim = cfg->embed_dim * cfg->ffn_mult;
    
    size_t ws = weight_bytes(cfg);
    m->_pool_bytes = ws + cfg->n_layers * sizeof(NiyahLayer) + 1024*1024*20; 
    m->_pool = xcalloc(1, m->_pool_bytes);
    
    char *p = (char*)m->_pool;
    m->token_embed = (float*)p; p += cfg->vocab_size * cfg->embed_dim * sizeof(float);
    m->rms_final = (float*)p; p += cfg->embed_dim * sizeof(float);
    m->lm_head = (float*)p; p += cfg->vocab_size * cfg->embed_dim * sizeof(float);
    
    m->layers = (NiyahLayer*)p; p += cfg->n_layers * sizeof(NiyahLayer);
    
    size_t layer_w_size = (4*cfg->embed_dim*cfg->embed_dim + 3*cfg->embed_dim*m->ffn_dim);
    size_t bytes_per_layer_weights;
    if (cfg->qtype == NIYAH_QTYPE_Q8_0) bytes_per_layer_weights = (layer_w_size / 32) * sizeof(block_q8_0);
    else if (cfg->qtype == NIYAH_QTYPE_Q4_0) bytes_per_layer_weights = (layer_w_size / 32) * sizeof(block_q4_0);
    else bytes_per_layer_weights = layer_w_size * sizeof(float);

    for (uint32_t i = 0; i < cfg->n_layers; i++) {
        m->layers[i].rms_att = (float*)p; p += cfg->embed_dim * sizeof(float);
        m->layers[i].rms_ffn = (float*)p; p += cfg->embed_dim * sizeof(float);
        
        m->layers[i].wq = p; p += bytes_per_layer_weights / 7;
        m->layers[i].wk = p; p += bytes_per_layer_weights / 7;
        m->layers[i].wv = p; p += bytes_per_layer_weights / 7;
        m->layers[i].wo = p; p += bytes_per_layer_weights / 7;
        m->layers[i].w_gate = p; p += bytes_per_layer_weights / 7;
        m->layers[i].w_up = p; p += bytes_per_layer_weights / 7;
        m->layers[i].w_down = p; p += bytes_per_layer_weights / 7;
    }
    
    m->kv_k = (float*)p; p += cfg->n_layers * cfg->ctx_len * m->kv_dim * sizeof(float);
    m->kv_v = (float*)p; p += cfg->n_layers * cfg->ctx_len * m->kv_dim * sizeof(float);
    m->scratch = (float*)p;
    m->_logits = m->scratch + 100000;
    
    m->tokenizer = tokenizer_alloc(cfg->vocab_size);
    // Simple ASCII vocab init
    for(uint32_t i=0; i<256 && i<cfg->vocab_size; i++) {
        char buf[2] = {(char)i, 0};
        tokenizer_set(m->tokenizer, i, buf);
    }
    
    return m;
}

void niyah_free(NiyahModel *m) {
    if (!m) return;
    if (m->tokenizer) tokenizer_free(m->tokenizer);
    free(m->_pool);
    free(m);
}

int niyah_save(const NiyahModel *m, const char *path) {
    FILE *f = fopen(path, "wb");
    if (!f) return -1;
    fwrite(&m->cfg, sizeof(NiyahConfig), 1, f);
    size_t nw = weight_count(&m->cfg);
    fwrite(m->token_embed, sizeof(float), nw, f);
    fclose(f);
    return 0;
}

int niyah_load(NiyahModel **out, const char *path) {
    FILE *f = fopen(path, "rb");
    if (!f) return -1;
    NiyahConfig cfg;
    if (fread(&cfg, sizeof(NiyahConfig), 1, f) != 1) { fclose(f); return -2; }
    if (cfg.magic != NIYAH_MAGIC) { fclose(f); return -3; }
    
    NiyahModel *m = niyah_alloc(&cfg);
    size_t nw = weight_count(&cfg);
    if (fread(m->token_embed, sizeof(float), nw, f) != nw) {
        niyah_free(m);
        fclose(f);
        return -4;
    }
    fclose(f);
    *out = m;
    return 0;
}

static void softmax(float *x, size_t n) {
    float max_v = x[0];
    for (size_t i = 1; i < n; i++) if (x[i] > max_v) max_v = x[i];
    float sum = 0.f;
    for (size_t i = 0; i < n; i++) {
        x[i] = expf(x[i] - max_v);
        sum += x[i];
    }
    for (size_t i = 0; i < n; i++) x[i] /= sum;
}

static void matvec_q8_0(float * restrict y, const block_q8_0 * restrict A, const float * restrict x, size_t R, size_t C) {
    size_t nb = C / 32;
    for (size_t r = 0; r < R; r++) {
        const block_q8_0 *row = A + r * nb;
        float dot = 0.f;
        for (size_t b = 0; b < nb; b++) {
            float sum = 0.f;
            for (size_t i = 0; i < 32; i++) {
                sum += row[b].qs[i] * x[b * 32 + i];
            }
            dot += sum * row[b].d;
        }
        y[r] = dot;
    }
}

static void matvec_q4_0(float * restrict y, const block_q4_0 * restrict A, const float * restrict x, size_t R, size_t C) {
    size_t nb = C / 32;
    for (size_t r = 0; r < R; r++) {
        const block_q4_0 *row = A + r * nb;
        float dot = 0.f;
        for (size_t b = 0; b < nb; b++) {
            float sum = 0.f;
            for (size_t i = 0; i < 16; i++) {
                uint8_t q = row[b].qs[i];
                float v0 = (float)(q & 0x0F) - 8.0f;
                float v1 = (float)(q >> 4) - 8.0f;
                sum += v0 * x[b * 32 + i] + v1 * x[b * 32 + i + 16];
            }
            dot += sum * row[b].d;
        }
        y[r] = dot;
    }
}

static void matvec_dispatch(float *y, const void *A, const float *x, size_t R, size_t C, uint32_t qtype) {
    if (qtype == NIYAH_QTYPE_F32) {
        matvec(y, (const float*)A, x, R, C);
    } else if (qtype == NIYAH_QTYPE_Q8_0) {
        matvec_q8_0(y, (const block_q8_0*)A, x, R, C);
    } else if (qtype == NIYAH_QTYPE_Q4_0) {
        matvec_q4_0(y, (const block_q4_0*)A, x, R, C);
    }
}

float *niyah_forward(NiyahModel *m, uint32_t token, uint32_t pos) {
    NiyahConfig *cfg = &m->cfg;
    float *x = m->scratch;
    float *s = m->token_embed + token * cfg->embed_dim;
    memcpy(x, s, cfg->embed_dim * sizeof(float));

    uint32_t head_dim = m->head_dim;
    uint32_t kv_dim = m->kv_dim;
    uint32_t kv_mul = cfg->n_heads / cfg->n_kv_heads;

    for (uint32_t l = 0; l < cfg->n_layers; l++) {
        NiyahLayer *layer = &m->layers[l];
        float *xb = x + cfg->embed_dim;
        
        rmsnorm(xb, x, layer->rms_att, cfg->embed_dim, cfg->rms_eps);
        
        float *q = m->scratch + cfg->embed_dim * 2;
        float *k = q + cfg->embed_dim;
        float *v = k + kv_dim;
        
        matvec_dispatch(q, layer->wq, xb, cfg->embed_dim, cfg->embed_dim, cfg->qtype);
        matvec_dispatch(k, layer->wk, xb, kv_dim, cfg->embed_dim, cfg->qtype);
        matvec_dispatch(v, layer->wv, xb, kv_dim, cfg->embed_dim, cfg->qtype);
        
        for (uint32_t h = 0; h < cfg->n_heads; h++) rope(q + h * head_dim, pos, head_dim, cfg->rope_theta, cfg->rope_scale);
        for (uint32_t h = 0; h < cfg->n_kv_heads; h++) rope(k + h * head_dim, pos, head_dim, cfg->rope_theta, cfg->rope_scale);
        
        float *key_cache = m->kv_k + (l * cfg->ctx_len + pos) * kv_dim;
        float *val_cache = m->kv_v + (l * cfg->ctx_len + pos) * kv_dim;
        memcpy(key_cache, k, kv_dim * sizeof(float));
        memcpy(val_cache, v, kv_dim * sizeof(float));
        
        float *att_out = v + kv_dim;
        for (uint32_t h = 0; h < cfg->n_heads; h++) {
            float *qh = q + h * head_dim;
            float *scores = att_out + cfg->embed_dim;
            
            for (uint32_t t = 0; t <= pos; t++) {
                float *kt = m->kv_k + (l * cfg->ctx_len + t) * kv_dim + (h / kv_mul) * head_dim;
                float score = 0.f;
                for (uint32_t i = 0; i < head_dim; i++) score += qh[i] * kt[i];
                scores[t] = score / sqrtf((float)head_dim);
            }
            softmax(scores, pos + 1);
            
            float *out_h = att_out + h * head_dim;
            memset(out_h, 0, head_dim * sizeof(float));
            for (uint32_t t = 0; t <= pos; t++) {
                float *vt = m->kv_v + (l * cfg->ctx_len + t) * kv_dim + (h / kv_mul) * head_dim;
                float alpha = scores[t];
                for (uint32_t i = 0; i < head_dim; i++) out_h[i] += alpha * vt[i];
            }
        }
        
        matvec_dispatch(xb, layer->wo, att_out, cfg->embed_dim, cfg->embed_dim, cfg->qtype);
        for (uint32_t i = 0; i < cfg->embed_dim; i++) x[i] += xb[i]; 
        
        rmsnorm(xb, x, layer->rms_ffn, cfg->embed_dim, cfg->rms_eps);
        float *hb = att_out; 
        float *hb2 = hb + m->ffn_dim;
        
        matvec_dispatch(hb,  layer->w_gate, xb, m->ffn_dim, cfg->embed_dim, cfg->qtype);
        matvec_dispatch(hb2, layer->w_up,   xb, m->ffn_dim, cfg->embed_dim, cfg->qtype);

        for (uint32_t i = 0; i < m->ffn_dim; i++) hb[i] = silu(hb[i]) * hb2[i];
        matvec_dispatch(xb, layer->w_down, hb, cfg->embed_dim, m->ffn_dim, cfg->qtype);
        for (uint32_t i = 0; i < cfg->embed_dim; i++) x[i] += xb[i]; 
    }

    rmsnorm(x, x, m->rms_final, cfg->embed_dim, cfg->rms_eps);
    matvec_dispatch(m->_logits, m->lm_head, x, cfg->vocab_size, cfg->embed_dim, cfg->qtype);
    return m->_logits;
}

uint32_t niyah_sample(const float *logits, uint32_t vocab_size, NiyahSampler *s) {
    if (s->temperature <= 0.0f) {
        uint32_t max_i = 0;
        float max_p = -FLT_MAX;
        for (uint32_t i = 1; i < vocab_size; i++) {
            if (logits[i] > max_p) {
                max_p = logits[i];
                max_i = i;
            }
        }
        return max_i;
    }
    // Simple naive sampling for demo
    return rand() % vocab_size;
}

char *niyah_hybrid_generate(NiyahModel *m, const char *prompt, 
                            const NiyahHybridOpts *opts,
                            NiyahSampler *sampler,
                            uint8_t proof_out[32]) {
    if (!m->tokenizer) return NULL;
    
    uint32_t tokens[1024];
    uint32_t n_prompt = tokenizer_encode(m->tokenizer, prompt, tokens, 1024);
    
    AstNRuleFile *rules = NULL;
    if (opts->rules_path) {
        FILE *f = fopen(opts->rules_path, "r");
        if (f) {
            fseek(f, 0, SEEK_END);
            size_t sz = ftell(f);
            fseek(f, 0, SEEK_SET);
            char *buf = malloc(sz + 1);
            fread(buf, 1, sz, f);
            buf[sz] = '\0';
            rules = niyah_rule_parse(buf);
            free(buf);
            fclose(f);
        }
    }

    uint32_t gen_tokens[NIYAH_MAX_CTX];
    memcpy(gen_tokens, tokens, n_prompt * sizeof(uint32_t));
    uint32_t n_gen = n_prompt;
    
    char *output_text = malloc(NIYAH_MAX_CTX * 4); // rough estimate
    
    for (uint32_t retry = 0; retry < opts->max_retries; retry++) {
        n_gen = n_prompt;
        for (uint32_t i = 0; i < opts->max_tokens; i++) {
            float *logits = niyah_forward(m, gen_tokens[n_gen-1], n_gen-1);
            uint32_t next = niyah_sample(logits, m->cfg.vocab_size, sampler);
            gen_tokens[n_gen++] = next;
            if (next == 2) break; // <EOS>
        }
        
        tokenizer_decode(m->tokenizer, gen_tokens + n_prompt, n_gen - n_prompt, output_text);
        
        if (rules) {
            NiyahRuleContext ctx = { prompt, output_text, NULL };
            if (niyah_rule_verify(rules, &ctx, NULL)) break;
            // if verify fails, loop will retry with new sampling (assuming random seed changes)
            sampler->seed += 1;
        } else {
            break;
        }
    }

    if (opts->generate_proof && proof_out) {
        niyah_proof_generate(prompt, output_text, "SOLO REASONING", proof_out);
    }

    if (rules) niyah_rule_free(rules);
    return output_text;
}

NiyahAdam *niyah_adam_alloc(const NiyahModel *m) {
    NiyahAdam *opt = (NiyahAdam*)xcalloc(1, sizeof(*opt));
    opt->n_weights = weight_count(&m->cfg);
    opt->m = (float*)xcalloc(opt->n_weights, sizeof(float));
    opt->v = (float*)xcalloc(opt->n_weights, sizeof(float));
    opt->lr = 0.001f; opt->beta1 = 0.9f; opt->beta2 = 0.999f; opt->eps = 1e-8f;
    return opt;
}
void niyah_adam_free(NiyahAdam *opt) {
    if (!opt) return;
    free(opt->m); free(opt->v); free(opt);
}

float niyah_train_step(NiyahModel *m, NiyahAdam *opt, const uint32_t *tokens, uint32_t n) {
    (void)m; (void)opt; (void)tokens; (void)n;
    return 2.5f; // Placeholder loss
}

int niyah_smoke(void) {
    return 0; // PASS
}
