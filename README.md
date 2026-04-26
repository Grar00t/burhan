# BURHĀN — Sovereign AI Hub

> **فَذَانِكَ بُرْهَانَانِ مِن رَّبِّكَ** — *سورة القصص: 32*

Saudi Arabia's strategic Sovereign AI Hub orchestrating **Operation Black Hole** — the forensic dismantling of the **DRAGON403** fraudulent network targeting Saudi and GCC users.

**Case Reference:** `EPID0011034` · **IC3:** `RF26030165360C` · **FTC:** `#199332032`

---

## What is BURHĀN?

BURHĀN (Arabic: *قاطع الدليل* — "decisive proof") is a sovereign forensic command surface that fuses three layers:

| Layer | Stack | Purpose |
|---|---|---|
| **Inference Core** | Pure C99/C++17, AVX2/NEON SIMD, optional CUDA | Local, deterministic LLM inference with mathematical guarantees |
| **Symbolic Reasoner** | C11, Robinson unification + backward chaining | Provable logic over forensic facts; zero hallucination |
| **Proof Generator** | SHA-256 (FIPS 180-4) from scratch | Cryptographic anchoring of every conclusion |
| **Sovereign UI** | React 19 · Vite 6 · TypeScript 5.8 · Tailwind v4 | Cinematic forensic command center |
| **Phalanx Guard** | Rust | Real-time PII scrubbing and threat surface monitoring |

This is not a wrapper. The C99 core stands alone — same architecture family as LLaMA / Mistral (RMSNorm + RoPE + SwiGLU) but with zero external dependencies and zero telemetry.

---

## Core Capabilities

- **Pure C99 Inference Kernel** — zero-dependency engine for portability and audit.
- **SIMD-Optimized** — hand-crafted AVX2/FMA (x86) and NEON (ARM64) kernels.
- **Sovereign Memory Pool** — single-pool allocator, predictable memory, no fragmentation.
- **Quantization** — F32, Q8_0, Q4_0 weight formats.
- **Arabic-First NLP** — native Najdi, Hijazi, Levantine, and Classical Arabic tokenization.
- **Hybrid Reasoning** — symbolic Prolog-like engine alongside neural inference.
- **Cryptographic Proof** — every output is hash-anchored against rule-set + input + output.
- **Three-Lobe Architecture** — Sensory · Cognitive · Executive separation of concerns.

---

## Why BURHĀN?

1. **Objective logic, not emotional approximation.** The hybrid layer constrains neural output against a symbolic rule base. Outputs that cannot be proven are not emitted.
2. **100 % local execution.** Your forensic data never leaves your sovereign node. The Phalanx scrubber pre-filters PII even when remote relays are used.
3. **Mathematically provable.** The `proof_generator` SHA-anchors prompt, output, and rule-file content. The chain is auditable and tamper-evident.
4. **Built for evidentiary use.** Every UI artifact maps to a forensic artifact (IOC, wallet, hash, AS-number) referenced in the DRAGON403 master brief.

---

## Repository Layout

```
burhan/
├── Core_CPP/             # C99 / C++17 inference + reasoning core
│   ├── niyah_core.c      # AVX2/NEON SIMD inference kernel
│   ├── hybrid_reasoner.c # Robinson unification, backward chaining
│   ├── constraint_solver.c
│   ├── proof_generator.c # SHA-256 forensic anchoring
│   ├── rule_parser.c
│   └── ...
├── niyah_engine/         # CUDA kernels + tokenizer
├── include/              # Public headers
├── bench/                # Benchmark harness
├── phalanx/              # Rust PII scrubber + threat monitor
├── scripts/              # Build scripts (GCC, training data prep)
├── src/                  # React 19 + TypeScript UI
│   ├── components/       # Forensic dossier, mission control, panels
│   ├── lib/              # NiyahEngine, KSPIKEEngine, WathqClient
│   ├── services/         # forensicService
│   └── core/             # niyah-engine TS bindings
└── server.ts             # Express + WebSocket sovereign uplink
```

---

## Build

### C/C++ inference core

```bash
# x86 with AVX2 + FMA
gcc -O3 -mavx2 -mfma Core_CPP/niyah_core.c Core_CPP/niyah_main.c -o niyah -lm

# ARM64 with NEON
gcc -O3 Core_CPP/niyah_core.c Core_CPP/niyah_main.c -o niyah -lm
```

### Web UI

```bash
npm install
npm run dev      # Dev server on :3000
npm run build    # Production build to dist/
npm run preview  # Preview build
npm run lint     # tsc --noEmit
npm run test     # vitest
```

---

## Operation Black Hole / DRAGON403 — Forensic Anchors

| Indicator | Value |
|---|---|
| Forensic hash | `falla_admin.js` SHA-256 `71bf18bf6be88fc7afb4a0d5ae668148d0f75f080ec9e6a6956776bc865ad88d` |
| Cash-out wallet | `TCHFcsY7VqTq35c9zZPzKo7JtfNYVAryfu` |
| Mixer wallet | `Tf7rkg7L6TuTtyMGs5xe1dJEPsOyggnhLa` |
| CSAM-linked wallet | `TuSCebQRIvNR3qzAReKfJ7LtSjoUY8gqeJ` |
| Threat AS | `AS139341` (Tencent Cloud, Singapore) |
| Publisher | `com.iyinguo.*` |
| Apps in network | 70+ |
| TRC-20 wallets traced | 33 |
| IOCs across 7 categories | 50 |
| Per-victim loss range | SAR 300,000 – 1,500,000 (USD 80,000 – 400,000) |

These are the **authoritative numbers** in the federal master brief. Public-facing surfaces summarize them.

---

## License

AGPL-3.0. See `LICENSE`.

---

## Author

**Sulaiman Al-Shammari** (أبو خوارزم)
GraTech Solutions LLC (KHAWRIZM) · Riyadh
admin@gratech.sa · S@khawrizm.com

---

> *نحن ورثة الخوارزمي — البرهان لا يحتاج إذناً.*
