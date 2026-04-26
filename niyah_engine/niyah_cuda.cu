#include "niyah_core.h"
#include <cuda_runtime.h>
#include <device_launch_parameters.h>
#include <stdio.h>

#define CUDA_CHECK(err) \
    if (err != cudaSuccess) { \
        fprintf(stderr, "CUDA Error: %s at %s:%d\n", cudaGetErrorString(err), __FILE__, __LINE__); \
        exit(EXIT_FAILURE); \
    }

__global__ void rmsnorm_kernel(float* out, const float* x, const float* w, int n, float eps) {
    extern __shared__ float sdata[];
    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;

    float val = (i < n) ? x[i] : 0.0f;
    sdata[tid] = val * val;
    __syncthreads();

    // Reduction in shared memory
    for (int s = blockDim.x / 2; s > 0; s >>= 1) {
        if (tid < s) sdata[tid] += sdata[tid + s];
        __syncthreads();
    }

    float ss = sdata[0];
    float scale = 1.0f / sqrtf(ss / (float)n + eps);
    if (i < n) out[i] = x[i] * scale * w[i];
}

__global__ void matvec_kernel(float* y, const float* A, const float* x, int R, int C) {
    int r = blockIdx.x * blockDim.x + threadIdx.x;
    if (r >= R) return;

    float dot = 0.0f;
    for (int c = 0; c < C; c++) {
        dot += A[r * C + c] * x[c];
    }
    y[r] = dot;
}

extern "C" void niyah_cuda_matvec(float* y, const float* A, const float* x, int R, int C) {
    int threads = 256;
    int blocks = (R + threads - 1) / threads;
    matvec_kernel<<<blocks, threads>>>(y, A, x, R, C);
    CUDA_CHECK(cudaGetLastError());
}

extern "C" void niyah_cuda_rmsnorm(float* out, const float* x, const float* w, int n, float eps) {
    int threads = 256;
    int blocks = (n + threads - 1) / threads;
    rmsnorm_kernel<<<blocks, threads, threads * sizeof(float)>>>(out, x, w, n, eps);
    CUDA_CHECK(cudaGetLastError());
}

extern "C" void* niyah_cuda_malloc(size_t size) {
    void* ptr;
    CUDA_CHECK(cudaMalloc(&ptr, size));
    return ptr;
}

extern "C" void niyah_cuda_free(void* ptr) {
    if (ptr) CUDA_CHECK(cudaFree(ptr));
}

extern "C" void niyah_cuda_memcpy_h2d(void* dst, const void* src, size_t size) {
    CUDA_CHECK(cudaMemcpy(dst, src, size, cudaMemcpyHostToDevice));
}

extern "C" void niyah_cuda_memcpy_d2h(void* dst, const void* src, size_t size) {
    CUDA_CHECK(cudaMemcpy(dst, src, size, cudaMemcpyDeviceToHost));
}
