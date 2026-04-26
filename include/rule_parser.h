/*
 * rule_parser.h — NIYAH Symbolic Rule Parser (.nrule)
 * Defined by the EBNF and AST specification of the Khwarizm Stack.
 */
#ifndef NIYAH_RULE_PARSER_H
#define NIYAH_RULE_PARSER_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

/* ── §1  AST Types ────────────────────────────────────────────── */

typedef enum {
    AST_RULESET,
    AST_METADATA,
    AST_SCOPE,
    AST_CONSTRAINTS,
    AST_ACTIONS,
    AST_PROOFS
} AstSectionType;

typedef enum {
    META_STRING,
    META_NUMBER,
    META_BOOL
} AstMetaValueType;

typedef struct {
    char *key;
    AstMetaValueType type;
    union {
        char *s;
        double n;
        int b;
    } value;
} AstMetadataEntry;

typedef struct {
    AstMetadataEntry *entries;
    size_t count;
} AstMetadata;

typedef struct {
    char *key;
    char **values;
    size_t value_count;
} AstScopeEntry;

typedef struct {
    AstScopeEntry *entries;
    size_t count;
} AstScope;

typedef struct {
    char *name;
    char **args;
    size_t arg_count;
} AstPredicate;

typedef struct {
    AstPredicate predicate;
} AstFact;

typedef enum {
    LOGIC_AND,
    LOGIC_OR
} AstLogicOp;

typedef enum {
    EXPR_PREDICATE,
    EXPR_FUNCTION,
    EXPR_COMPARISON,
    EXPR_LOGICAL
} AstExprType;

typedef struct AstExpr {
    AstExprType type;
    union {
        AstPredicate predicate;
        struct {
            char *object;
            char *method;
            char **args;
            size_t arg_count;
        } function;
        struct {
            char *left;
            char *op;
            char *right;
        } comparison;
        struct {
            AstLogicOp op;
            struct AstExpr *left;
            struct AstExpr *right;
        } logical;
    } data;
} AstExpr;

typedef struct {
    char *name;
    char *parameter;
    AstExpr *expression;
} AstRule;

typedef struct {
    AstFact *facts;
    size_t fact_count;
    AstRule *rules;
    size_t rule_count;
    char **required_rules;
    size_t require_count;
} AstConstraints;

typedef struct {
    char *key;
    char *value;
} AstActionEntry;

typedef struct {
    AstActionEntry *entries;
    size_t count;
} AstActionBlock;

typedef struct {
    AstActionBlock on_fail;
    AstActionBlock on_pass;
} AstActions;

typedef struct {
    char *key;
    char *value;
} AstProofEntry;

typedef struct {
    AstProofEntry *entries;
    size_t count;
    char **include_fields;
    size_t include_count;
} AstProofs;

typedef struct {
    char *ruleset_name;
    double version;
    AstMetadata metadata;
    AstScope scope;
    AstConstraints constraints;
    AstActions actions;
    AstProofs proofs;
    void *arena; // single-pool allocation
} AstNRuleFile;

/* ── §2  Parser API ───────────────────────────────────────────── */

AstNRuleFile *niyah_rule_parse(const char *content);
void          niyah_rule_free(AstNRuleFile *file);

/* Verification against current context (input/output/state) */
typedef struct {
    const char *input;
    const char *output;
    uint8_t *proof_hash_out; // optional
} NiyahRuleContext;

bool niyah_rule_verify(const AstNRuleFile *file, const NiyahRuleContext *ctx, char *error_msg);

/* Validation smoke */
int niyah_rule_smoke(void);

#ifdef __cplusplus
}
#endif

#endif
