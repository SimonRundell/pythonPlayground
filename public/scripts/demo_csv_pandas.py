# Demo: Reading a CSV file and analysing it with Pandas + Matplotlib
#
# HOW TO USE THIS DEMO
# --------------------
# 1. Click the  +  tab button above the editor and load  students.csv
#    (it should appear as a second tab in your workspace).
# 2. Switch back to this file and click  ▶ Run.
#
# The CSV file is automatically available as  students.csv  because all
# workspace files are written to the Python working directory before running.
# Install Pandas and Matplotlib from the  📦 Packages  button first.

import pandas as pd
import matplotlib.pyplot as plt

# ── 1. Load ──────────────────────────────────────────────────────────────────
df = pd.read_csv('students.csv')

print("=" * 50)
print("  Student Results — CSV Demo")
print("=" * 50)

print(f"\nLoaded {len(df)} student records with columns: {list(df.columns)}")

# ── 2. Preview ───────────────────────────────────────────────────────────────
print("\nFirst 5 rows:")
print(df.head().to_string(index=False))

# ── 3. Descriptive statistics ────────────────────────────────────────────────
numeric = df[['Maths', 'English', 'Science', 'ICT']]

print("\nDescriptive statistics:")
print(numeric.describe().round(1).to_string())

# ── 4. Derived columns ───────────────────────────────────────────────────────
df['Average'] = numeric.mean(axis=1).round(1)

print("\nStudent averages (sorted):")
ranked = df[['Name', 'Average', 'Grade']].sort_values('Average', ascending=False)
print(ranked.to_string(index=False))

# ── 5. Grade distribution ────────────────────────────────────────────────────
print("\nGrade distribution:")
print(df['Grade'].value_counts().sort_index().to_string())

# ── 6. Best subject per student ──────────────────────────────────────────────
df['Best Subject'] = numeric.idxmax(axis=1)
print("\nEach student's strongest subject:")
print(df[['Name', 'Best Subject']].to_string(index=False))

# ── 7. Visualise ─────────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(11, 4.5))
fig.suptitle('Student Results Analysis', fontsize=13, fontweight='bold')

# Bar chart — average score per student
axes[0].barh(ranked['Name'], ranked['Average'], color='steelblue')
axes[0].axvline(ranked['Average'].mean(), color='coral', linestyle='--',
                label=f"Class mean ({ranked['Average'].mean():.1f})")
axes[0].set_xlabel('Average score')
axes[0].set_title('Average Score by Student')
axes[0].legend(fontsize=8)

# Bar chart — class average per subject
subject_means = numeric.mean().round(1)
colours = ['#3b82f6', '#8b5cf6', '#22c55e', '#f97316']
axes[1].bar(subject_means.index, subject_means.values, color=colours)
axes[1].set_ylim(0, 100)
axes[1].set_ylabel('Class average')
axes[1].set_title('Class Average by Subject')
for i, (subj, val) in enumerate(subject_means.items()):
    axes[1].text(i, val + 1, str(val), ha='center', fontsize=9)

plt.tight_layout()
plt.show()

print("\n✓ CSV + Pandas demo complete — check the Graphics tab for charts.")
