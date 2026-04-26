#ifndef NIYAH_CUDA_H
#define NIYAH_CUDA_H

#ifdef __cplusplus
extern "C" {
#endif

void niyah_cuda_matvec(float* y, const float* A, const float* x, int R, int C);
void niyah_cuda_rmsnorm(float* out, const float* x, const float* w, int n, float eps);

void* niyah_cuda_malloc(size_t size);
void  niyah_cuda_free(void* ptr);
void  niyah_cuda_memcpy_h2d(void* dst, const void* src, size_t size);
void  niyah_cuda_memcpy_d2h(void* dst, const void* src, size_t size);

#ifdef __cplusplus
}
#endif

#endif
