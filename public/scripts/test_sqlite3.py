# Test script: SQLite3
# Install SQLite3 from the Packages button before running.
# Expected output: table contents and query results in the Console.
#
# IMPORTANT — in-memory database:
# Python's open() cannot write to the real filesystem in this browser-based
# environment, so this script uses ':memory:' rather than a file on disk.
# That is the normal way to use sqlite3 from Pyodide.

import sqlite3

print("=" * 40)
print("  SQLite3 — functionality test")
print("=" * 40)

conn = sqlite3.connect(':memory:')
cur = conn.cursor()

cur.execute('''
    CREATE TABLE students (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        score INTEGER NOT NULL
    )
''')

rows = [
    ('Alice',   'Maths',   85),
    ('Bob',     'Maths',   72),
    ('Charlie', 'English', 91),
    ('Diana',   'English', 68),
    ('Eve',     'Science', 95),
]
cur.executemany(
    'INSERT INTO students (name, subject, score) VALUES (?, ?, ?)', rows
)
conn.commit()

print(f"\nInserted {cur.rowcount if cur.rowcount != -1 else len(rows)} rows" )

print("\n[ All students, highest score first ]")
for row in cur.execute('SELECT name, subject, score FROM students ORDER BY score DESC'):
    print(f"  {row[0]:<10} {row[1]:<8} {row[2]}")

print("\n[ Average score per subject ]")
for subject, avg in cur.execute('''
    SELECT subject, ROUND(AVG(score), 1)
    FROM students
    GROUP BY subject
    ORDER BY subject
'''):
    print(f"  {subject:<8} {avg}")

conn.close()

print("\n✓ SQLite3 test complete.")
