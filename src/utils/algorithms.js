/**
 * @file algorithms.js - Algorithm teaching content from
 * "The Little Book of Algorithms 2.0" by William Lau (CC BY-NC-SA 4.0).
 *
 * Adapted for Python Playground by Simon Rundell.
 * Original work © William Lau — used with attribution under CC BY-NC-SA 4.0.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */

export const ALGORITHM_CATEGORIES = [
  'Maths',
  'Strings',
  'Iteration',
  'Selection',
  'Lists',
  'Searching',
  'Number Systems',
  'Files',
]

export const ALGORITHMS = [

  // ── Selection ──────────────────────────────────────────────────────────────

  {
    id: 1,
    title: 'Grade Boundaries',
    category: 'Selection',
    description: 'Use if/elif/else to assign a letter grade based on a student\'s percentage mark.',
    teachingNotes: [
      'Selection uses conditions to choose which block of code to execute.',
      'elif means "else if" — Python checks conditions from top to bottom and stops at the first True.',
      'The else block is a catch-all for when no condition matches.',
      'Comparison operators: == (equal to), != (not equal), > >= < <=',
    ],
    code: `mark = int(input("Enter mark (0-100): "))

if mark >= 90:
    grade = "A*"
elif mark >= 80:
    grade = "A"
elif mark >= 70:
    grade = "B"
elif mark >= 60:
    grade = "C"
elif mark >= 50:
    grade = "D"
else:
    grade = "U"

print(f"Mark: {mark}  Grade: {grade}")`,
    challenges: [
      {
        id: '1a',
        title: 'Praise Message',
        description: 'Extend the program to also print "Well done!" if the grade is A or A*, and "Keep working!" if the grade is U.',
        code: `mark = int(input("Enter mark (0-100): "))

if mark >= 90:
    grade = "A*"
elif mark >= 80:
    grade = "A"
elif mark >= 70:
    grade = "B"
elif mark >= 60:
    grade = "C"
elif mark >= 50:
    grade = "D"
else:
    grade = "U"

print(f"Mark: {mark}  Grade: {grade}")

# Add your praise / encouragement message here
`,
      },
      {
        id: '1b',
        title: 'Custom Pass Boundary',
        description: 'Let the user set their own pass mark, then report whether the student has passed or failed.',
        code: `mark     = int(input("Enter mark (0-100): "))
boundary = int(input("Enter pass mark: "))

# Use if/else to print "Pass" or "Fail"
`,
      },
    ],
  },

  {
    id: 2,
    title: 'Login System',
    category: 'Selection',
    description: 'Check a username and password against stored credentials and grant or deny access.',
    teachingNotes: [
      'String comparison with == is case-sensitive: "Admin" is not equal to "admin".',
      'The and operator requires both conditions to be True for the overall condition to be True.',
      'Never store real passwords in plain text — this is a teaching example only.',
      'Specific elif/else branches let you give informative error messages.',
    ],
    code: `STORED_USER = "admin"
STORED_PASS = "secret123"

username = input("Username: ")
password = input("Password: ")

if username == STORED_USER and password == STORED_PASS:
    print("Access granted. Welcome,", username)
elif username != STORED_USER:
    print("Access denied: unknown username.")
else:
    print("Access denied: incorrect password.")`,
    challenges: [
      {
        id: '2a',
        title: 'Three Attempts',
        description: 'Give the user three attempts to log in. Print "Account locked" if all three fail.',
        code: `STORED_USER = "admin"
STORED_PASS = "secret123"
attempts = 0
max_attempts = 3

# Use a while loop to allow up to 3 attempts
`,
      },
      {
        id: '2b',
        title: 'Case-Insensitive Username',
        description: 'Modify the login so usernames are case-insensitive ("Admin" and "ADMIN" both work).',
        code: `STORED_USER = "admin"
STORED_PASS = "secret123"

username = input("Username: ")
password = input("Password: ")

# Hint: use .lower() on the entered username before comparing
`,
      },
    ],
  },

  // ── Strings ────────────────────────────────────────────────────────────────

  {
    id: 3,
    title: 'String Reversal & Palindrome',
    category: 'Strings',
    description: 'Reverse a string using slicing, then check whether it is a palindrome.',
    teachingNotes: [
      'Strings in Python are sequences — you can index them: word[0] is the first character.',
      'Slicing: word[start:stop:step]. word[::-1] means all characters stepped backwards — i.e. reversed.',
      'len(word) returns the number of characters in the string.',
      'Strings are immutable — you cannot change a character in place; you build a new string.',
    ],
    code: `word = input("Enter a word: ")

reversed_word = word[::-1]
print(f"Original: {word}")
print(f"Reversed: {reversed_word}")

if word.lower() == reversed_word.lower():
    print(f"'{word}' IS a palindrome!")
else:
    print(f"'{word}' is NOT a palindrome.")`,
    challenges: [
      {
        id: '3a',
        title: 'Reverse Without Slicing',
        description: 'Reverse the string using a for loop and string concatenation instead of slicing.',
        code: `word = input("Enter a word: ")
reversed_word = ""

# Use a for loop to build reversed_word one character at a time
`,
      },
      {
        id: '3b',
        title: 'Sentence Palindrome',
        description: 'Check if a sentence is a palindrome, ignoring spaces and capitalisation (e.g. "Never odd or even").',
        code: `sentence = input("Enter a sentence: ")

# Remove spaces and make lower-case before checking
# Hint: sentence.replace(" ", "").lower()
`,
      },
    ],
  },

  {
    id: 4,
    title: 'Caesar Cipher',
    category: 'Strings',
    description: 'Encrypt and decrypt a message by shifting each letter a fixed number of places through the alphabet.',
    teachingNotes: [
      'ord(char) returns the ASCII code of a character; chr(num) converts a code back to a character.',
      'ord("a") = 97, ord("A") = 65. Keeping letters in range requires separate handling for upper and lower case.',
      'The modulo operator % wraps around: after Z comes A again.',
      'This is a substitution cipher historically attributed to Julius Caesar.',
    ],
    code: `def caesar_encrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            base    = ord("a") if char.islower() else ord("A")
            shifted = (ord(char) - base + shift) % 26
            result += chr(base + shifted)
        else:
            result += char  # keep spaces and punctuation unchanged
    return result

message = input("Enter message: ")
shift   = int(input("Shift amount (1-25): "))

encrypted = caesar_encrypt(message, shift)
decrypted = caesar_encrypt(encrypted, -shift)

print(f"Original:  {message}")
print(f"Encrypted: {encrypted}")
print(f"Decrypted: {decrypted}")`,
    challenges: [
      {
        id: '4a',
        title: 'Brute Force Decrypt',
        description: 'Print all 25 possible decryptions of an encrypted message so the user can spot the correct one.',
        code: `def caesar_encrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            base    = ord("a") if char.islower() else ord("A")
            result += chr(base + (ord(char) - base + shift) % 26)
        else:
            result += char
    return result

encrypted = input("Enter encrypted message: ")

# Try all 25 shifts and print each result
for shift in range(1, 26):
    pass  # replace with your code
`,
      },
      {
        id: '4b',
        title: 'ROT13',
        description: 'ROT13 is a Caesar cipher with shift 13. Apply it twice to a message — what do you notice?',
        code: `def caesar_encrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            base    = ord("a") if char.islower() else ord("A")
            result += chr(base + (ord(char) - base + shift) % 26)
        else:
            result += char
    return result

message = input("Enter message: ")

once  = caesar_encrypt(message, 13)
twice = caesar_encrypt(once, 13)

print(f"Once:  {once}")
print(f"Twice: {twice}")
`,
      },
    ],
  },

  {
    id: 5,
    title: 'Username Generator',
    category: 'Strings',
    description: 'Generate a school-style login username from a first name, surname, and year group.',
    teachingNotes: [
      '.lower() converts a string to lower case; .upper() converts to upper case.',
      'String slicing word[:n] gives the first n characters.',
      'The + operator concatenates (joins) strings together.',
      'f-strings let you embed variables directly in a string: f"Hello {name}".',
    ],
    code: `first = input("First name: ")
last  = input("Surname: ")
year  = input("Year group (e.g. 12): ")

# First initial + first 5 of surname + year group
username = first[0].lower() + last[:5].lower() + year

print(f"Generated username: {username}")`,
    challenges: [
      {
        id: '5a',
        title: 'Initials',
        description: 'Generate the student\'s initials from first name, optional middle name, and surname (e.g. "SJR").',
        code: `first  = input("First name: ")
middle = input("Middle name (or press Enter to skip): ")
last   = input("Surname: ")

# Build the initials string
# Hint: include middle initial only if middle name was entered
`,
      },
      {
        id: '5b',
        title: 'Email Address',
        description: 'Generate a school email in the format firstname.lastname@school.ac.uk (all lower case, no spaces).',
        code: `first = input("First name: ")
last  = input("Surname: ")

# Generate the email address
`,
      },
    ],
  },

  // ── Maths ──────────────────────────────────────────────────────────────────

  {
    id: 6,
    title: 'Totalling and Average',
    category: 'Maths',
    description: 'Sum a series of numbers entered by the user and calculate the mean average.',
    teachingNotes: [
      'An accumulator variable starts at 0 and increases with each iteration.',
      'A counter variable tracks how many values have been entered.',
      'Mean average = total divided by count. Always guard against dividing by zero.',
      'int() converts a string to an integer; float() converts to a decimal number.',
    ],
    code: `total = 0
count = 0

print("Enter scores one at a time. Type 'done' to finish.")

while True:
    entry = input("Score: ")
    if entry.lower() == "done":
        break
    total += int(entry)
    count += 1

if count > 0:
    average = total / count
    print(f"Total:   {total}")
    print(f"Count:   {count}")
    print(f"Average: {average:.2f}")
else:
    print("No scores were entered.")`,
    challenges: [
      {
        id: '6a',
        title: 'Min and Max',
        description: 'Extend the program to also report the highest and lowest scores entered.',
        code: `total = 0
count = 0
# Also track minimum and maximum values

print("Enter scores one at a time. Type 'done' to finish.")

while True:
    entry = input("Score: ")
    if entry.lower() == "done":
        break
    score  = int(entry)
    total += score
    count += 1
    # Update minimum and maximum here

if count > 0:
    print(f"Average: {total / count:.2f}")
    # Print min and max
`,
      },
      {
        id: '6b',
        title: 'Fixed Count',
        description: 'Rewrite using a for loop that always asks for exactly 5 scores — no "done" needed.',
        code: `total      = 0
num_scores = 5

# Use a for loop with range()
`,
      },
    ],
  },

  {
    id: 7,
    title: 'Prime Number Check',
    category: 'Maths',
    description: 'Determine whether an integer is prime by testing divisibility up to its square root.',
    teachingNotes: [
      'A prime number has exactly two factors: 1 and itself.',
      'You only need to check divisors up to the square root — larger factors always pair with a smaller one.',
      'n % d == 0 means d divides n exactly (remainder is zero).',
      '1 is NOT a prime number by mathematical definition.',
    ],
    code: `import math

def is_prime(n):
    if n < 2:
        return False
    for d in range(2, int(math.sqrt(n)) + 1):
        if n % d == 0:
            return False
    return True

number = int(input("Enter a positive integer: "))

if is_prime(number):
    print(f"{number} IS a prime number.")
else:
    print(f"{number} is NOT a prime number.")`,
    challenges: [
      {
        id: '7a',
        title: 'List All Primes',
        description: 'Print every prime number between 2 and 100.',
        code: `import math

def is_prime(n):
    if n < 2:
        return False
    for d in range(2, int(math.sqrt(n)) + 1):
        if n % d == 0:
            return False
    return True

# Loop from 2 to 100 and print each prime
`,
      },
      {
        id: '7b',
        title: 'Prime Factors',
        description: 'Print all the prime factors of a number entered by the user (e.g. 12 gives 2, 2, 3).',
        code: `number = int(input("Enter a positive integer: "))
factor = 2

print(f"Prime factors of {number}:")
# Repeatedly divide by the smallest factor
`,
      },
    ],
  },

  {
    id: 8,
    title: 'Random Number Generator',
    category: 'Maths',
    description: 'Use Python\'s random module to build a number-guessing game.',
    teachingNotes: [
      'import random gives access to Python\'s built-in random module.',
      'random.randint(a, b) returns a random integer n where a <= n <= b (both ends inclusive).',
      'random.choice(sequence) picks a random element from a list or string.',
      'Each call to randint is independent — past results do not affect future ones.',
    ],
    code: `import random

secret   = random.randint(1, 100)
attempts = 0

print("I am thinking of a number between 1 and 100.")

while True:
    guess     = int(input("Your guess: "))
    attempts += 1

    if guess < secret:
        print("Too low — try higher!")
    elif guess > secret:
        print("Too high — try lower!")
    else:
        print(f"Correct! You found it in {attempts} attempt(s).")
        break`,
    challenges: [
      {
        id: '8a',
        title: 'Limited Attempts',
        description: 'Give the player only 7 attempts. If they run out, reveal the secret number.',
        code: `import random

secret       = random.randint(1, 100)
max_attempts = 7

print(f"Guess the number (1-100). You have {max_attempts} attempts.")

# Modify the loop to limit to max_attempts
`,
      },
      {
        id: '8b',
        title: 'Dice Totals',
        description: 'Simulate rolling two six-sided dice 1000 times and print how often each possible total (2-12) appeared.',
        code: `import random

counts = {}  # dictionary to tally each total

for _ in range(1000):
    total = random.randint(1, 6) + random.randint(1, 6)
    counts[total] = counts.get(total, 0) + 1

for total in sorted(counts):
    print(f"Total {total:2d}: {counts[total]} times")
`,
      },
    ],
  },

  // ── Iteration ──────────────────────────────────────────────────────────────

  {
    id: 9,
    title: 'Count-Controlled Loop',
    category: 'Iteration',
    description: 'Use a for loop with range() to repeat an action an exact, predetermined number of times.',
    teachingNotes: [
      'for i in range(n) repeats n times, with i taking values 0, 1, 2, ... n-1.',
      'range(start, stop) goes from start up to (but not including) stop.',
      'range(start, stop, step) lets you set the step size; use a negative step to count down.',
      'Use a for loop when you know in advance exactly how many iterations are needed.',
    ],
    code: `number = int(input("Which times table? "))

print(f"\\n{number} times table:")
for i in range(1, 13):
    print(f"  {number} x {i} = {number * i}")`,
    challenges: [
      {
        id: '9a',
        title: 'Countdown',
        description: 'Print a countdown from 10 down to 1, then print "Blast off!".',
        code: `# Use range() with a negative step to count down
`,
      },
      {
        id: '9b',
        title: 'Sum of Squares',
        description: 'Ask the user for n, then calculate and display the sum of squares of all integers from 1 to n.',
        code: `n     = int(input("Enter n: "))
total = 0

# Use a for loop to accumulate the sum of squares
# e.g. for n=4: 1 + 4 + 9 + 16 = 30
`,
      },
    ],
  },

  {
    id: 10,
    title: 'Condition-Controlled Loop',
    category: 'Iteration',
    description: 'Use a while loop to repeat until a condition is met — essential for input validation.',
    teachingNotes: [
      'while condition: keeps looping as long as the condition is True.',
      'while True: with break is useful when you need the body to run at least once.',
      'Input validation ensures the program only processes acceptable data.',
      'A loop with no valid exit condition is an infinite loop — a very common bug.',
    ],
    code: `# Input validation: keep asking until a valid age is entered
while True:
    age_str = input("Enter your age (1-120): ")

    if age_str.isdigit():
        age = int(age_str)
        if 1 <= age <= 120:
            break  # valid input — exit the loop
        else:
            print("Age must be between 1 and 120.")
    else:
        print("Please enter a whole number.")

print(f"Valid age entered: {age}")`,
    challenges: [
      {
        id: '10a',
        title: 'Password Strength',
        description: 'Keep prompting until the user enters a password that is at least 8 characters long and contains at least one digit.',
        code: `while True:
    password = input("Create a password: ")

    long_enough  = len(password) >= 8
    has_digit    = any(char.isdigit() for char in password)

    if long_enough and has_digit:
        print("Password accepted!")
        break
    else:
        print("Password must be at least 8 characters and contain a digit.")
`,
      },
      {
        id: '10b',
        title: 'Menu Loop',
        description: 'Create a menu offering options 1, 2, 3 and Q (quit). Keep showing the menu until Q is chosen.',
        code: `while True:
    print("\\n--- MENU ---")
    print("1. Option One")
    print("2. Option Two")
    print("3. Option Three")
    print("Q. Quit")

    choice = input("Choose: ").upper()

    if choice == "1":
        print("You chose option one.")
    elif choice == "2":
        print("You chose option two.")
    elif choice == "3":
        print("You chose option three.")
    elif choice == "Q":
        print("Goodbye!")
        break
    else:
        print("Invalid choice — please try again.")
`,
      },
    ],
  },

  // ── Lists ──────────────────────────────────────────────────────────────────

  {
    id: 11,
    title: 'List Operations',
    category: 'Lists',
    description: 'Create and manipulate a list: add items, access elements, and calculate statistics.',
    teachingNotes: [
      'A list stores multiple values in one variable: scores = [45, 72, 88, 61].',
      'list.append(value) adds to the end; list.insert(index, value) inserts at a position.',
      'list.remove(value) removes the first matching element; del list[index] removes by position.',
      'len(), max(), min() and sum() are built-in functions that work on lists.',
    ],
    code: `scores = []

print("Enter student scores. Type 'done' to finish.")
while True:
    entry = input("Score: ")
    if entry.lower() == "done":
        break
    scores.append(int(entry))

if scores:
    print(f"\\nScores:  {scores}")
    print(f"Count:   {len(scores)}")
    print(f"Highest: {max(scores)}")
    print(f"Lowest:  {min(scores)}")
    print(f"Average: {sum(scores) / len(scores):.1f}")
else:
    print("No scores entered.")`,
    challenges: [
      {
        id: '11a',
        title: 'Trimmed Average',
        description: 'After collecting scores, remove the single highest and lowest values and print the trimmed average.',
        code: `scores = []

print("Enter at least 3 scores. Type 'done' to finish.")
while True:
    entry = input("Score: ")
    if entry.lower() == "done":
        break
    scores.append(int(entry))

if len(scores) >= 3:
    # Remove highest and lowest, then calculate average of the rest
    pass
else:
    print("Need at least 3 scores.")
`,
      },
      {
        id: '11b',
        title: 'Above Average',
        description: 'From a fixed list of scores, print only those that are above the mean average.',
        code: `scores  = [45, 72, 88, 61, 55, 91, 67, 78, 43, 85]
average = sum(scores) / len(scores)

print(f"Average: {average:.1f}")
print("Above average scores:")

# Use a for loop and if statement
`,
      },
    ],
  },

  {
    id: 12,
    title: 'Bubble Sort',
    category: 'Lists',
    description: 'Sort a list by repeatedly comparing and swapping adjacent elements that are in the wrong order.',
    teachingNotes: [
      'Bubble sort makes repeated passes through the list, "bubbling" larger values towards the end.',
      'After each pass, the largest unsorted element has settled in its correct position.',
      'Worst-case time complexity is O(n²) — slow for large lists but simple to understand.',
      'Python\'s built-in list.sort() uses Timsort (O(n log n)) and is much faster in practice.',
    ],
    code: `def bubble_sort(lst):
    n = len(lst)
    for pass_num in range(n - 1):
        swapped = False
        for i in range(n - 1 - pass_num):
            if lst[i] > lst[i + 1]:
                lst[i], lst[i + 1] = lst[i + 1], lst[i]
                swapped = True
        if not swapped:
            break  # list is already sorted — early exit
    return lst

numbers = [64, 34, 25, 12, 22, 11, 90]
print(f"Before: {numbers}")
bubble_sort(numbers)
print(f"After:  {numbers}")`,
    challenges: [
      {
        id: '12a',
        title: 'Sort Descending',
        description: 'Modify bubble sort to sort the list in descending order (largest value first).',
        code: `def bubble_sort_desc(lst):
    n = len(lst)
    for pass_num in range(n - 1):
        for i in range(n - 1 - pass_num):
            if lst[i] < lst[i + 1]:  # change comparison direction
                lst[i], lst[i + 1] = lst[i + 1], lst[i]
    return lst

numbers = [64, 34, 25, 12, 22, 11, 90]
bubble_sort_desc(numbers)
print(numbers)
`,
      },
      {
        id: '12b',
        title: 'Sort Names',
        description: 'Use bubble sort to sort a list of names into alphabetical order.',
        code: `names = ["Zara", "Alice", "Mohammed", "Priya", "Ben", "Chloe"]

# Python string comparison with > and < is alphabetical
# Apply bubble sort to the names list
`,
      },
    ],
  },

  // ── Files ──────────────────────────────────────────────────────────────────

  {
    id: 13,
    title: 'Reading from a File',
    category: 'Files',
    description: 'Open a text file and read its contents line by line.',
    teachingNotes: [
      'open(filename, "r") opens a file for reading. Always close it when done.',
      'The with open(...) as f: pattern closes the file automatically — preferred style.',
      'f.readlines() returns a list of strings (one per line, including the newline character).',
      '\\u26a0 Browser note: Python file I/O does not work here. The example uses simulated in-memory data.',
    ],
    code: `# NOTE: Python's open() does not work in this browser environment.
# In a real Python installation you would write:
#   with open("students.txt", "r") as f:
#       lines = f.readlines()
#
# Here we simulate the file contents as a Python list:

lines = [
    "Alice,85\\n",
    "Bob,72\\n",
    "Charlie,91\\n",
    "Diana,68\\n",
    "Eve,79\\n",
]

print("Reading student records:")
for line in lines:
    line  = line.strip()       # remove trailing newline/spaces
    parts = line.split(",")    # split on comma
    name  = parts[0]
    score = int(parts[1])
    print(f"  {name}: {score}")`,
    challenges: [
      {
        id: '13a',
        title: 'Top Student',
        description: 'Find and print the name and score of the student with the highest score.',
        code: `lines = [
    "Alice,85\\n",
    "Bob,72\\n",
    "Charlie,91\\n",
    "Diana,68\\n",
    "Eve,79\\n",
]

best_name  = ""
best_score = 0

# Loop through lines and track the highest score
`,
      },
      {
        id: '13b',
        title: 'Count and Average',
        description: 'Count the number of records and calculate the class average score.',
        code: `lines = [
    "Alice,85\\n",
    "Bob,72\\n",
    "Charlie,91\\n",
    "Diana,68\\n",
    "Eve,79\\n",
]

total = 0
count = 0

# Process each line and accumulate total and count
`,
      },
    ],
  },

  {
    id: 14,
    title: 'Writing to a File',
    category: 'Files',
    description: 'Write data to a text file, and append new records without overwriting existing ones.',
    teachingNotes: [
      'open(filename, "w") creates or overwrites a file; open(filename, "a") appends to it.',
      'f.write(text) does not add a newline automatically — include "\\n" yourself.',
      '\\u26a0 Browser note: Python file I/O does not work here. The example prints to the console instead.',
      'Always use the with statement in real Python to guarantee the file is closed after writing.',
    ],
    code: `# NOTE: Python's open() does not work in this browser environment.
# In a real Python installation you would write:
#   with open("scores.txt", "a") as f:
#       f.write(f"{name},{score}\\n")
#
# Here we simulate the file as a list and print the result:

output_buffer = []  # simulates file contents in memory

def write_record(name, score):
    line = f"{name},{score}"
    output_buffer.append(line)
    print(f"  Written: {line}")

print("Appending records...")
write_record("Alice", 85)
write_record("Bob",   72)
write_record("Eve",   95)

print("\\nSimulated file contents:")
for line in output_buffer:
    print(" ", line)`,
    challenges: [
      {
        id: '14a',
        title: 'Interactive Records',
        description: 'Let the user enter names and scores, adding each to the buffer. Type "done" to stop, then display all records.',
        code: `output_buffer = []

print("Enter student records. Type 'done' for the name to finish.")
while True:
    name = input("Name: ")
    if name.lower() == "done":
        break
    score = input("Score: ")
    output_buffer.append(f"{name},{score}")

print("\\nSimulated file contents:")
for line in output_buffer:
    print(" ", line)
`,
      },
    ],
  },

  // ── Number Systems ─────────────────────────────────────────────────────────

  {
    id: 15,
    title: 'Decimal to Binary',
    category: 'Number Systems',
    description: 'Convert a decimal integer to binary using repeated division by 2.',
    teachingNotes: [
      'Binary (base 2) uses only 0s and 1s. Each position represents a power of 2.',
      'Algorithm: repeatedly divide by 2 — the remainders (read bottom to top) give the binary digits.',
      'The % operator gives the remainder; // performs integer (floor) division.',
      'Python\'s bin(n) does this automatically — implementing it manually shows the underlying process.',
    ],
    code: `def decimal_to_binary(n):
    if n == 0:
        return "0"
    bits = []
    while n > 0:
        bits.append(str(n % 2))   # remainder is 0 or 1
        n //= 2                    # integer divide by 2
    bits.reverse()                 # remainders were collected LSB first
    return "".join(bits)

decimal = int(input("Enter a decimal number: "))
binary  = decimal_to_binary(decimal)

print(f"Decimal: {decimal}")
print(f"Binary:  {binary}")
print(f"Check:   {bin(decimal)[2:]}")  # Python's built-in (strips "0b" prefix)`,
    challenges: [
      {
        id: '15a',
        title: '8-bit Display',
        description: 'Display the binary number with leading zeros so it always shows 8 bits (e.g. 5 appears as "00000101").',
        code: `def decimal_to_binary(n):
    if n == 0:
        return "0"
    bits = []
    while n > 0:
        bits.append(str(n % 2))
        n //= 2
    bits.reverse()
    return "".join(bits)

decimal = int(input("Enter a decimal number (0-255): "))
binary  = decimal_to_binary(decimal)

# Pad with leading zeros to 8 digits
# Hint: use .zfill(8)
`,
      },
      {
        id: '15b',
        title: 'Decimal to Hex',
        description: 'Extend the program to also convert the decimal number to hexadecimal. Display both binary and hex results.',
        code: `decimal = int(input("Enter a decimal number: "))

# Convert to binary (use your function or bin())
# Convert to hexadecimal (use hex() or implement it manually)
# Display both results
`,
      },
    ],
  },

  {
    id: 16,
    title: 'Binary to Decimal',
    category: 'Number Systems',
    description: 'Convert a binary string to its decimal value using positional place values.',
    teachingNotes: [
      'Each binary digit (bit) has a positional value: 2^0, 2^1, 2^2, ... reading right to left.',
      'Algorithm: multiply each bit by its positional power of 2 and sum the results.',
      'int("1101", 2) = 1x8 + 1x4 + 0x2 + 1x1 = 13 — Python\'s built-in does this too.',
      'Implementing it manually reinforces understanding of binary place value.',
    ],
    code: `def binary_to_decimal(binary_str):
    decimal = 0
    power   = 0
    for bit in reversed(binary_str):  # process right to left
        if bit == "1":
            decimal += 2 ** power
        power += 1
    return decimal

binary = input("Enter a binary number (e.g. 1101): ")
result = binary_to_decimal(binary)

print(f"Binary:  {binary}")
print(f"Decimal: {result}")
print(f"Check:   {int(binary, 2)}")  # Python's built-in`,
    challenges: [
      {
        id: '16a',
        title: 'Hex to Decimal',
        description: 'Write a function to convert a hexadecimal string (e.g. "1F") to decimal without using int(..., 16).',
        code: `HEX_DIGITS = "0123456789ABCDEF"

def hex_to_decimal(hex_str):
    decimal = 0
    hex_str = hex_str.upper()
    # Each position is a power of 16
    # Hint: HEX_DIGITS.index(digit) gives the digit's numeric value
    for digit in hex_str:
        decimal = decimal * 16 + HEX_DIGITS.index(digit)
    return decimal

hex_input = input("Enter a hex number (e.g. 1F): ")
print(f"Decimal: {hex_to_decimal(hex_input)}")
`,
      },
      {
        id: '16b',
        title: 'Binary Addition',
        description: 'Add two binary numbers together. Show both the binary and decimal result.',
        code: `a = input("First binary number:  ")
b = input("Second binary number: ")

# Convert each to decimal, add, then convert back to binary
dec_a   = int(a, 2)
dec_b   = int(b, 2)
total   = dec_a + dec_b
binary  = bin(total)[2:]

print(f"{a} + {b} = {binary} (decimal: {total})")
`,
      },
    ],
  },

  // ── Searching ──────────────────────────────────────────────────────────────

  {
    id: 17,
    title: 'Linear Search',
    category: 'Searching',
    description: 'Search a list by checking each element in turn until the target is found or the list is exhausted.',
    teachingNotes: [
      'Linear search works on any list — sorted or unsorted.',
      'Best case O(1): target is the first element. Worst case O(n): target is last or absent.',
      'Returns the index of the found element, or -1 (a sentinel value) if the target is not present.',
      'Python\'s in operator and list.index() both perform linear search internally.',
    ],
    code: `def linear_search(lst, target):
    for i in range(len(lst)):
        if lst[i] == target:
            return i   # found — return its position
    return -1          # target not in list

names  = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"]
target = input("Search for: ")

index = linear_search(names, target)

if index != -1:
    print(f"Found '{target}' at position {index}.")
else:
    print(f"'{target}' was not found in the list.")`,
    challenges: [
      {
        id: '17a',
        title: 'Count Occurrences',
        description: 'Modify linear search to count how many times the target appears in the list (not just the first position).',
        code: `def count_occurrences(lst, target):
    count = 0
    for item in lst:
        if item == target:
            count += 1
    return count

numbers = [3, 7, 2, 7, 8, 7, 1, 9, 7, 4]
target  = int(input("Search for: "))
print(f"'{target}' appears {count_occurrences(numbers, target)} time(s).")
`,
      },
      {
        id: '17b',
        title: 'Count Comparisons',
        description: 'Modify linear search to also return how many comparisons were made before the result was reached.',
        code: `def linear_search_counted(lst, target):
    comparisons = 0
    for i in range(len(lst)):
        comparisons += 1
        if lst[i] == target:
            return i, comparisons
    return -1, comparisons

numbers = [64, 34, 25, 12, 22, 11, 90, 47, 58, 33]
target  = int(input("Search for: "))
index, steps = linear_search_counted(numbers, target)

if index != -1:
    print(f"Found at index {index} after {steps} comparison(s).")
else:
    print(f"Not found. Made {steps} comparison(s).")
`,
      },
    ],
  },

  {
    id: 18,
    title: 'Binary Search',
    category: 'Searching',
    description: 'Search a sorted list efficiently by repeatedly halving the search space.',
    teachingNotes: [
      'Binary search only works on a list that is already sorted.',
      'Each comparison eliminates half the remaining elements — O(log n) time complexity.',
      'For 1,000,000 items, binary search takes at most 20 comparisons; linear search up to 1,000,000.',
      'mid = (low + high) // 2 calculates the middle index of the current search range.',
    ],
    code: `def binary_search(lst, target):
    low   = 0
    high  = len(lst) - 1
    steps = 0

    while low <= high:
        steps += 1
        mid   = (low + high) // 2

        if lst[mid] == target:
            return mid, steps          # found
        elif lst[mid] < target:
            low = mid + 1              # target is in the right half
        else:
            high = mid - 1            # target is in the left half

    return -1, steps  # not found

numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(f"List: {numbers}")
target = int(input("Search for: "))

index, comparisons = binary_search(numbers, target)

if index != -1:
    print(f"Found {target} at index {index} in {comparisons} comparison(s).")
else:
    print(f"{target} not found. Took {comparisons} comparison(s).")`,
    challenges: [
      {
        id: '18a',
        title: 'Compare Search Methods',
        description: 'Generate a sorted list of 10,000 numbers and compare how many steps linear vs binary search require for the same target.',
        code: `def linear_search(lst, target):
    for i in range(len(lst)):
        if lst[i] == target:
            return i, i + 1
    return -1, len(lst)

def binary_search(lst, target):
    low, high, steps = 0, len(lst) - 1, 0
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if lst[mid] == target:
            return mid, steps
        elif lst[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1, steps

numbers = list(range(0, 20000, 2))  # 10,000 even numbers
target  = int(input("Search for an even number (0-19998): "))

li, lc = linear_search(numbers, target)
bi, bc = binary_search(numbers, target)

print(f"Linear search: index {li}, {lc} comparisons")
print(f"Binary search: index {bi}, {bc} comparisons")
`,
      },
      {
        id: '18b',
        title: 'Recursive Binary Search',
        description: 'Implement binary search using recursion instead of a while loop.',
        code: `def binary_search_recursive(lst, target, low, high):
    if low > high:
        return -1  # base case: not found

    mid = (low + high) // 2

    if lst[mid] == target:
        return mid
    elif lst[mid] < target:
        return binary_search_recursive(lst, target, mid + 1, high)
    else:
        return binary_search_recursive(lst, target, low, mid - 1)

numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target  = int(input("Search for: "))
result  = binary_search_recursive(numbers, target, 0, len(numbers) - 1)

print(f"Result: {'found at index ' + str(result) if result != -1 else 'not found'}")
`,
      },
    ],
  },

]
