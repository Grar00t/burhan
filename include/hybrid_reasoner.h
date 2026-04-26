/*
 * hybrid_reasoner.h — NIYAH Symbolic Reasoning Engine
 */
#ifndef NIYAH_HYBRID_REASONER_H
#define NIYAH_HYBRID_REASONER_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#define NIYAH_SYM_NAME_MAX 64
#define NIYAH_SYM_MAX_ARITY 8
#define NIYAH_SYM_MAX_DEPTH 50

typedef enum {
    NIYAH_SYM_ATOM,
    NIYAH_SYM_VAR,
    NIYAH_SYM_COMPOUND
} NiyahSymTermKind;

typedef struct NiyahSymTerm {
    NiyahSymTermKind kind;
    char name[NIYAH_SYM_NAME_MAX];
    uint32_t arity;
    struct NiyahSymTerm **args;
} NiyahSymTerm;

typedef struct {
    char var_name[NIYAH_SYM_NAME_MAX];
    NiyahSymTerm *binding;
} NiyahSymBinding;

typedef struct {
    NiyahSymBinding *bindings;
    uint32_t count;
    uint32_t capacity;
} NiyahSymSubst;

typedef struct {
    NiyahSymTerm *head;
    NiyahSymTerm **body;
    uint32_t body_len;
} NiyahSymClause;

typedef struct {
    NiyahSymClause *clauses;
    uint32_t count;
    uint32_t capacity;
} NiyahSymKB;

/* Term management */
NiyahSymTerm *niyah_sym_atom(const char *name);
NiyahSymTerm *niyah_sym_var(const char *name);
NiyahSymTerm *niyah_sym_compound(const char *functor, NiyahSymTerm **args, uint32_t arity);
NiyahSymTerm *niyah_sym_term_clone(const NiyahSymTerm *t);
void          niyah_sym_term_free(NiyahSymTerm *t);
bool          niyah_sym_term_equal(const NiyahSymTerm *a, const NiyahSymTerm *b);

/* Substitution management */
void          niyah_sym_subst_init(NiyahSymSubst *s);
void          niyah_sym_subst_free(NiyahSymSubst *s);
NiyahSymTerm *niyah_sym_subst_lookup(const NiyahSymSubst *s, const char *var_name);
void          niyah_sym_subst_bind(NiyahSymSubst *s, const char *var_name, NiyahSymTerm *binding);
NiyahSymTerm *niyah_sym_subst_apply(const NiyahSymSubst *s, const NiyahSymTerm *t);
NiyahSymSubst niyah_sym_subst_clone(const NiyahSymSubst *s);

/* Unification */
bool          niyah_sym_unify(const NiyahSymTerm *a, const NiyahSymTerm *b, NiyahSymSubst *s);

/* Knowledge Base */
NiyahSymKB   *niyah_sym_kb_alloc(void);
void          niyah_sym_kb_free(NiyahSymKB *kb);
void          niyah_sym_kb_add_fact(NiyahSymKB *kb, NiyahSymTerm *head);
void          niyah_sym_kb_add_rule(NiyahSymKB *kb, NiyahSymTerm *head, NiyahSymTerm **body, uint32_t body_len);

/* Querying */
bool          niyah_sym_query(const NiyahSymKB *kb, const NiyahSymTerm *goal, NiyahSymSubst *result, uint32_t max_depth);

/* Test */
int           niyah_sym_smoke(void);

#ifdef __cplusplus
}
#endif

#endif
