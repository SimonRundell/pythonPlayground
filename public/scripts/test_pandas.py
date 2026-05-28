# Test script: Pandas
# Install Pandas from the Packages button before running.
# Expected output: DataFrame summaries printed to the Console.

import pandas as pd

print("=" * 40)
print(f"  Pandas {pd.__version__} — functionality test")
print("=" * 40)

# --- Create DataFrame ---
data = {
    'Name':    ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'],
    'Maths':   [85, 72, 91, 68, 95, 78],
    'English': [78, 81, 88, 74, 82, 69],
    'Science': [92, 68, 95, 70, 88, 83],
    'Passed':  [True, True, True, False, True, True],
}
df = pd.DataFrame(data)
df['Average'] = df[['Maths', 'English', 'Science']].mean(axis=1).round(1)

print(f"\nDataFrame ({len(df)} rows):")
print(df.to_string(index=False))

# --- Descriptive stats ---
print("\nDescriptive statistics (numeric columns):")
print(df[['Maths', 'English', 'Science']].describe().round(1).to_string())

# --- Filtering ---
top = df[df['Average'] >= 85]
print(f"\nStudents averaging ≥ 85:")
print(top[['Name', 'Average']].to_string(index=False))

# --- GroupBy ---
df['Grade'] = pd.cut(df['Average'],
                     bins=[0, 70, 80, 90, 100],
                     labels=['D', 'C', 'B', 'A'])
print("\nGrade distribution:")
print(df['Grade'].value_counts().sort_index().to_string())

# --- Sorting ---
print("\nRanked by average (descending):")
print(df[['Name', 'Average']].sort_values('Average', ascending=False).to_string(index=False))

print("\n✓ Pandas test complete.")
