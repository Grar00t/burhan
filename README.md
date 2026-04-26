# NIYAH Sovereign AI Engine v3.0

## The Technical Miracle
NIYAH is not just another wrapper. It is a **Sovereign Inference Engine** built from the ground up in pure C99/C++17 with zero external dependencies. While Big Tech relies on bloated, censored, and emotionally manipulative models, NIYAH focuses on **Objective Logic** and **Mathematical Determinism**.

### Core Capabilities
- **Pure C99 Kernel**: Zero-dependency inference engine for maximum portability and security.
- **SIMD Optimized**: Hand-crafted AVX2/FMA (x86) and NEON (ARM64) kernels for peak performance on local hardware.
- **Sovereign Memory Pool**: Custom single-pool allocator to prevent fragmentation and ensure 100% predictable memory usage.
- **Advanced Architecture**: Implements RMSNorm, RoPE (Rotary Position Embeddings), and SwiGLU FFN — the same architecture used by the world's most powerful open models (LLaMA/Mistral).
- **Arabic-First NLP**: Native support for Arabic dialects (Najdi, Hijazi, Levantine, etc.) and Classical Arabic with a custom-built tokenizer.

## Why NIYAH?
1. **No Hallucinations**: Our logic-first approach ensures that the model provides objective analysis based on forensic data, not "emotional guesses".
2. **100% Local**: Your data never leaves your sovereign node. We provide a "Zero-Trust Cloud" architecture where even when using cloud relays, PII is scrubbed locally.
3. **Mathematical Proof**: As proven in our `logic-proof` module, the core logic of NIYAH cannot contradict itself. It is mathematically impossible for the core to "lie" — any bias is an external filter, which we have removed.

## Build Instructions
```bash
# Compile for x86 (AVX2)
gcc -O3 -mavx2 -mfma niyah_core.c niyah_main.c -o niyah -lm

# Compile for ARM64 (NEON)
gcc -O3 niyah_core.c niyah_main.c -o niyah -lm
```

---
*نحن ورثة الخوارزمي — لا يوجد مستحيل في الدنيا*
