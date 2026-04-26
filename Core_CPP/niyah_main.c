/*
 * niyah_main.c — NIYAH CLI Entry Point
 */
#include "niyah_core.h"
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(int argc, char **argv) {
    (void)argc; (void)argv;
    printf("╔══════════════════════════════════════════════════════════════════╗\n");
    printf("║  NIYAH v3.0  Sovereign AI Engine                                 ║\n");
    printf("╚══════════════════════════════════════════════════════════════════╝\n");
    
    srand((unsigned int)time(NULL));
    
    printf("Running smoke tests...\n");
    int fail = niyah_smoke();
    if (fail == 0) {
        printf("[OK] All tests passed.\n");
    } else {
        printf("[FAIL] %d tests failed.\n", fail);
    }
    
    return fail;
}
