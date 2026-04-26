/*
 * niyah_hybrid_main.c — NIYAH Sovereign Hybrid Inference CLI
 */
#include "niyah_core.h"
#include "hybrid_reasoner.h"
#include "constraint_solver.h"
#include "rule_parser.h"
#include "proof_generator.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

int main(int argc, char **argv) {
    printf("╔══════════════════════════════════════════════════════════════════╗\n");
    printf("║  NIYAH v3.0  Sovereign Hybrid Engine                             ║\n");
    printf("╚══════════════════════════════════════════════════════════════════╝\n");

    bool run_smoke = false;
    for(int i=1; i<argc; i++) {
        if(strcmp(argv[i], "--smoke") == 0) run_smoke = true;
    }

    if (run_smoke) {
        printf("\n── §1  Neural Core Smoke ─────────────────────────────────────\n");
        int f1 = niyah_smoke();
        printf("  Result: %s\n", f1 == 0 ? "PASS ✓" : "FAIL ✗");

        printf("\n── §2  Symbolic Reasoner Smoke ────────────────────────────────\n");
        int f2 = niyah_sym_smoke();
        printf("  Result: %s\n", f2 == 0 ? "PASS ✓" : "FAIL ✗");

        printf("\n── §3  Constraint Solver Smoke ────────────────────────────────\n");
        int f3 = niyah_csp_smoke();
        printf("  Result: %s\n", f3 == 0 ? "PASS ✓" : "FAIL ✗");

        printf("\n── §4  Rule Parser Smoke ──────────────────────────────────────\n");
        int f4 = niyah_rule_smoke();
        printf("  Result: %s\n", f4 == 0 ? "PASS ✓" : "FAIL ✗");

        printf("\n── §5  Proof Generator Smoke ──────────────────────────────────\n");
        int f5 = niyah_proof_smoke();
        printf("  Result: %s\n", f5 == 0 ? "PASS ✓" : "FAIL ✗");

        printf("\n── §6  Hybrid Generation Smoke (End-to-End) ───────────────────\n");
        NiyahConfig cfg = {
            .magic = NIYAH_MAGIC, .version = NIYAH_VER,
            .embed_dim = 128, .n_heads = 4, .n_kv_heads = 4, .n_layers = 2,
            .ffn_mult = 4, .vocab_size = 1000, .ctx_len = 512,
            .rope_theta = 10000.0f, .rms_eps = 1e-5f
        };
        NiyahModel *m = niyah_alloc(&cfg);
        NiyahSampler s = { .temperature = 0.0f, .top_p = 1.0f, .seed = 42 };
        NiyahHybridOpts opts = { .rules_path = NULL, .max_tokens = 10, .max_retries = 1, .generate_proof = true };
        uint8_t proof[32];
        char *response = niyah_hybrid_generate(m, "test prompt", &opts, &s, proof);
        int f6 = (response != NULL) ? 0 : 1;
        printf("  Response: %s\n", response ? response : "NULL");
        if (opts.generate_proof) {
            printf("  Proof: ");
            for(int i=0; i<32; i++) printf("%02x", proof[i]);
            printf("\n");
        }
        printf("  Result: %s\n", f6 == 0 ? "PASS ✓" : "FAIL ✗");
        free(response);
        niyah_free(m);

        int total = f1+f2+f3+f4+f5+f6;
        printf("\n══════════════════════════════════════════════════════════════════\n");
        printf("  TOTAL SUITE: %s (%d failures)\n", total == 0 ? "PASS ✓" : "FAIL ✗", total);
        printf("══════════════════════════════════════════════════════════════════\n");
        return total;
    }

    printf("Usage: ./niyah_hybrid --smoke\n");
    return 0;
}
