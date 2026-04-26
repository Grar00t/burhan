/*
 * constraint_solver.h — NIYAH Linear Constraint Solver
 */
#ifndef NIYAH_CONSTRAINT_SOLVER_H
#define NIYAH_CONSTRAINT_SOLVER_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#define NIYAH_CSP_MAX_VARS 128
#define NIYAH_CSP_MAX_CONSTRAINTS 256
#define NIYAH_CSP_MAX_TERMS 16

typedef enum {
    NIYAH_CSP_LE,  /* <= */
    NIYAH_CSP_GE,  /* >= */
    NIYAH_CSP_EQ   /* == */
} NiyahCspOp;

typedef struct {
    int64_t num;
    int64_t den;
} NiyahCspRat;

typedef struct {
    NiyahCspRat coeffs[NIYAH_CSP_MAX_TERMS];
    uint32_t var_ids[NIYAH_CSP_MAX_TERMS];
    uint32_t n_terms;
    NiyahCspOp op;
    NiyahCspRat bound;
} NiyahCspConstraint;

typedef struct {
    NiyahCspConstraint constraints[NIYAH_CSP_MAX_CONSTRAINTS];
    uint32_t count;
    uint32_t n_vars;
} NiyahCspSystem;

/* Rational arithmetic */
NiyahCspRat niyah_csp_rat(int64_t num, int64_t den);
NiyahCspRat niyah_csp_rat_add(NiyahCspRat a, NiyahCspRat b);
NiyahCspRat niyah_csp_rat_sub(NiyahCspRat a, NiyahCspRat b);
NiyahCspRat niyah_csp_rat_mul(NiyahCspRat a, NiyahCspRat b);
NiyahCspRat niyah_csp_rat_div(NiyahCspRat a, NiyahCspRat b);
NiyahCspRat niyah_csp_rat_neg(NiyahCspRat a);
int         niyah_csp_rat_cmp(NiyahCspRat a, NiyahCspRat b);
bool        niyah_csp_rat_eq(NiyahCspRat a, NiyahCspRat b);
double      niyah_csp_rat_to_double(NiyahCspRat r);

/* System management */
void niyah_csp_init(NiyahCspSystem *sys, uint32_t n_vars);
bool niyah_csp_add(NiyahCspSystem *sys, NiyahCspConstraint c);

/* Solver */
bool niyah_csp_feasible(const NiyahCspSystem *sys);
bool niyah_csp_solve(const NiyahCspSystem *sys, NiyahCspRat *values);

/* Test */
int niyah_csp_smoke(void);

#ifdef __cplusplus
}
#endif

#endif
