# CLAUDE.md — NIYAH Sovereign Development Guidelines

## Project Vision
NIYAH is a high-performance, sovereign AI engine. Development must prioritize **Objective Logic**, **Performance**, and **Security**. We avoid "emotional AI" tropes and focus on technical excellence.

## Technical Standards
- **Language**: Pure C99 for the core engine. C++17 for high-level wrappers. TypeScript/React for the Command Center UI.
- **Memory**: No `malloc`/`free` in the hot path. Use the `NiyahModel` memory pool.
- **Performance**: All matrix operations must be SIMD-accelerated (AVX2/NEON).
- **Sovereignty**: Ensure zero leakage of PII. All external API calls must be scrubbed by the local Phalanx layer.

## Code Style
- **C**: Use `uint32_t`, `size_t`, and explicit types. Follow the `niyah_` prefix convention.
- **React**: Use Framer Motion for cinematic transitions. Maintain the "Ultra-Dark Cyber-Sovereign" aesthetic.
- **Documentation**: Always include SHA-256 hashes for forensic evidence and technical reports.

## Command Center Aesthetic
- **Colors**: Obsidian Black (#0a0a0a), Electric Blue, Neon Purple.
- **Typography**: Inter/Satoshi for UI, JetBrains Mono for data.
- **Vibe**: Apple Vision Pro + Military Command Center + Blade Runner 2049.

---
*Sovereignty is not a feature; it is the foundation.*
