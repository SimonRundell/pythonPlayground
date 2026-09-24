# Test script: lzma
# Install LZMA from the Packages button before running.
# Expected output: compression round-trip results in the Console.

import lzma

print("=" * 40)
print("  lzma — functionality test")
print("=" * 40)

text = (
    "Python Playground runs entirely in the browser using Pyodide, "
    "a full CPython interpreter compiled to WebAssembly. " * 20
)
data = text.encode('utf-8')

compressed = lzma.compress(data)
decompressed = lzma.decompress(compressed)

print(f"\nOriginal size:    {len(data):,} bytes")
print(f"Compressed size:  {len(compressed):,} bytes")
print(f"Ratio:            {len(compressed) / len(data):.1%}")
print(f"Round-trip match: {decompressed == data}")

print("\n✓ lzma test complete.")
