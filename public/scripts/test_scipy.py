# Test script: SciPy
# Install SciPy from the Packages button before running.
# Expected output: statistics and optimisation results in the Console.

import numpy as np
from scipy import stats, optimize, interpolate

print("=" * 40)
print("  SciPy — functionality test")
print("=" * 40)

# --- Descriptive stats ---
scores = [65, 72, 58, 81, 74, 69, 88, 77, 63, 70, 85, 71]
print(f"\nTest scores: {scores}")
print(f"  n={len(scores)}, mean={np.mean(scores):.2f}, "
      f"median={np.median(scores):.1f}, std={np.std(scores, ddof=1):.2f}")

# --- t-test: is the mean significantly different from 70? ---
t_stat, p = stats.ttest_1samp(scores, popmean=70)
print(f"\nOne-sample t-test  (H₀: mean = 70)")
print(f"  t = {t_stat:.3f},  p = {p:.4f}")
print(f"  Result: {'Reject H₀ — mean is significantly ≠ 70'
        if p < 0.05 else 'Fail to reject H₀ — no significant difference'}")

# --- Normal distribution ---
dist = stats.norm(loc=70, scale=12)
print(f"\nNormal distribution (μ=70, σ=12):")
print(f"  P(score > 85) = {1 - dist.cdf(85):.4f}")
print(f"  Top-10% threshold = {dist.ppf(0.90):.1f}")

# --- Optimisation ---
def rosenbrock(xy):
    x, y = xy
    return (1 - x)**2 + 100 * (y - x**2)**2

result = optimize.minimize(rosenbrock, [0, 0], method='Nelder-Mead')
print(f"\nOptimise Rosenbrock function (minimum at (1, 1)):")
print(f"  Found minimum at x={result.x[0]:.4f}, y={result.x[1]:.4f}")
print(f"  f(min) = {result.fun:.6f}")

# --- Interpolation ---
x_pts = np.array([0, 1, 2, 3, 4, 5], dtype=float)
y_pts = np.array([0, 0.8, 0.9, 0.1, -0.8, -1.0])
f_interp = interpolate.interp1d(x_pts, y_pts, kind='cubic')
print(f"\nCubic interpolation at x=2.5: {f_interp(2.5):.4f}")

print("\n✓ SciPy test complete.")
