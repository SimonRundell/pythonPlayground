# Test script: SymPy
# Install SymPy from the Packages button before running.
# Expected output: symbolic maths results in the Console.

import sympy as sp

print("=" * 40)
print(f"  SymPy {sp.__version__} — functionality test")
print("=" * 40)

x, y, t = sp.symbols('x y t')

# --- Algebra ---
expr = x**3 - 2*x**2 + x - 5
print(f"\nExpression:  f(x) = {expr}")
print(f"  f(3)     = {expr.subs(x, 3)}")
print(f"  Expanded = {sp.expand(expr)}")

# --- Differentiation ---
print(f"\nDifferentiation:")
print(f"  f'(x)  = {sp.diff(expr, x)}")
print(f"  f''(x) = {sp.diff(expr, x, 2)}")

# --- Integration ---
print(f"\nIntegration:")
print(f"  ∫ x²  dx      = {sp.integrate(x**2, x)}")
print(f"  ∫₀¹ x² dx     = {sp.integrate(x**2, (x, 0, 1))}")
print(f"  ∫ sin(x) dx   = {sp.integrate(sp.sin(x), x)}")

# --- Solving equations ---
solutions = sp.solve(x**2 - 5*x + 6, x)
print(f"\nSolve  x² − 5x + 6 = 0:  x = {solutions}")

quadratic = sp.solve(2*x**2 + 3*x - 2, x)
print(f"Solve  2x² + 3x − 2 = 0: x = {quadratic}")

# --- Factoring & expanding ---
poly = (x + 2)**3
print(f"\n(x+2)³  expanded = {sp.expand(poly)}")
print(f"  factored back  = {sp.factor(sp.expand(poly))}")

# --- Limits ---
print(f"\nLimits:")
print(f"  lim(x→0) sin(x)/x  = {sp.limit(sp.sin(x)/x, x, 0)}")
print(f"  lim(x→∞) (1+1/x)^x = {sp.limit((1 + 1/x)**x, x, sp.oo)}")

# --- Series expansion ---
print(f"\nTaylor series of sin(x) around x=0 (order 7):")
print(f"  {sp.series(sp.sin(x), x, 0, 7)}")

print("\n✓ SymPy test complete.")
