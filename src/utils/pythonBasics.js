/**
 * @file pythonBasics.js - Beginner Python curriculum content for the
 * Python Basics drawer: a systematic walkthrough from "What is a variable?"
 * through to a first look at NumPy, Pandas and Matplotlib.
 *
 * Written for absolute-beginner Further Education students (NCFE Level 2
 * and the early stages of BTec/T-Level programming units).
 *
 * Each topic follows the same shape as utils/algorithms.js so both content
 * sets can be browsed with the shared TeachingDrawer component:
 *   { id, title, category, description, teachingNotes, illustration?, code, challenges }
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */

export const BASICS_CATEGORIES = [
  'Basics',
  'Logic',
  'Loops',
  'Collections',
  'Functions & Errors',
  'Files',
  'Data Science',
]

export const BASICS_TOPICS = [

  // ── Basics ─────────────────────────────────────────────────────────────────

  {
    id: 1,
    title: 'What is a variable?',
    category: 'Basics',
    description: 'Create named variables to store data, then read the value back by using its name.',
    teachingNotes: [
      'A variable is a labelled box in the computer\'s memory that holds a value.',
      'Python doesn\'t need you to declare a type — the type is decided by the value you assign (this is called dynamic typing).',
      'Variable names should be descriptive: age is far more helpful than a.',
      'Use = to assign a value. == is used later for comparing two things, which is different.',
      'Variable names can\'t start with a number or contain spaces — use snake_case, e.g. first_name.',
    ],
    illustration: `<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="150" height="60" rx="8" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2"/>
      <text x="95" y="22" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="13" fill="#0c4a6e">age</text>
      <text x="95" y="68" text-anchor="middle" font-family="Courier New, monospace" font-size="20" fill="#0c4a6e">16</text>
      <rect x="220" y="30" width="160" height="60" rx="8" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2"/>
      <text x="300" y="22" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="13" fill="#0c4a6e">name</text>
      <text x="300" y="68" text-anchor="middle" font-family="Courier New, monospace" font-size="18" fill="#0c4a6e">"Ada"</text>
      <text x="200" y="110" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#64748b">age = 16          name = "Ada"</text>
    </svg>`,
    code: `# A variable is created the moment you assign it a value
name = "Ada"
age = 16
year_group = "Level 2"

print(name)
print(age)
print(year_group)

# Variables can be changed (re-assigned) at any time
age = age + 1
print("Next year you will be", age)`,
    challenges: [
      {
        id: '1a',
        title: 'Three Facts',
        description: 'Create three variables about yourself — a favourite colour, a favourite number, and a true/false fact — then print them in a full sentence each.',
        code: `# TODO: create three variables about yourself
favourite_colour = ""
favourite_number = 0
likes_python = True

# TODO: print a sentence for each one using print()
`,
      },
      {
        id: '1b',
        title: 'Swap Challenge',
        description: 'Swap the values held by a and b using a third variable, without typing 5 or 9 anywhere except the first two lines.',
        code: `a = 5
b = 9

# TODO: swap the values of a and b using a third variable
# Hint: temp = a  then  a = b  then  b = temp

print("a is now", a)
print("b is now", b)`,
      },
    ],
  },

  {
    id: 2,
    title: 'Data types & casting',
    category: 'Basics',
    description: 'Explore Python\'s core data types — int, float, str, bool — and convert between them using casting.',
    teachingNotes: [
      'type(x) tells you what kind of data a variable currently holds.',
      'int = whole number, float = decimal number, str = text, bool = True/False.',
      'input() always returns a str, even if the user types a number — you must cast it before doing maths with it.',
      'Casting functions: int(\'7\'), float(\'3.5\'), str(42), bool(0).',
      'Casting text that isn\'t a valid number, e.g. int(\'hello\'), raises a ValueError and crashes the program.',
    ],
    illustration: `<svg viewBox="0 0 420 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="90" height="50" rx="25" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2"/>
      <text x="55" y="40" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#0c4a6e">int</text>
      <text x="55" y="58" text-anchor="middle" font-family="Courier New, monospace" font-size="13" fill="#0c4a6e">42</text>
      <rect x="115" y="20" width="90" height="50" rx="25" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
      <text x="160" y="40" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#14532d">float</text>
      <text x="160" y="58" text-anchor="middle" font-family="Courier New, monospace" font-size="13" fill="#14532d">3.14</text>
      <rect x="220" y="20" width="90" height="50" rx="25" fill="#fef3c7" stroke="#eab308" stroke-width="2"/>
      <text x="265" y="40" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#713f12">str</text>
      <text x="265" y="58" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#713f12">"hi"</text>
      <rect x="325" y="20" width="90" height="50" rx="25" fill="#fce7f3" stroke="#ec4899" stroke-width="2"/>
      <text x="370" y="40" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#831843">bool</text>
      <text x="370" y="58" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#831843">True</text>
      <text x="210" y="90" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#64748b">Four data types you will use constantly</text>
    </svg>`,
    code: `whole_number   = 42
decimal_number = 3.14
some_text      = "Level 2 Computing"
is_finished    = False

print(type(whole_number))
print(type(decimal_number))
print(type(some_text))
print(type(is_finished))

# input() always returns a string — cast it to use it as a number
age_text = input("How old are you? ")
age = int(age_text)
print(f"In 5 years you will be {age + 5}")`,
    challenges: [
      {
        id: '2a',
        title: 'Temperature Converter',
        description: 'Ask the user for a temperature in Celsius, cast it to a float, then convert and print it in Fahrenheit using F = C * 9/5 + 32.',
        code: `celsius_text = input("Temperature in Celsius: ")

# TODO: cast celsius_text to a float
# TODO: convert to Fahrenheit using F = C * 9/5 + 32
# TODO: print the result
`,
      },
      {
        id: '2b',
        title: 'Fix the Crash',
        description: 'This program crashes with a TypeError. Work out why, then fix it using the correct cast.',
        code: `price_text = input("Price in pounds: ")
total = price_text + 5   # crashes — fix this line

print(f"Total with delivery: £{total}")`,
      },
    ],
  },

  {
    id: 3,
    title: 'Numbers & operators',
    category: 'Basics',
    description: 'Perform calculations with Python\'s arithmetic operators, including integer division and the modulus operator.',
    teachingNotes: [
      '+ - * / are the standard arithmetic operators. / always returns a float, even if the answer is a whole number.',
      '// is integer (floor) division — it throws away any remainder.',
      '% is the modulus operator — it returns the remainder of a division. It\'s the classic way to test odd/even: n % 2 == 0.',
      '** is used for powers, e.g. 2 ** 3 means "2 to the power of 3" and evaluates to 8.',
      'Python follows the normal order of operations (BIDMAS/BODMAS) — use brackets to control what happens first.',
    ],
    code: `total_pence = 437

pounds  = total_pence // 100   # integer division — whole pounds
pence   = total_pence % 100    # modulus — the pence left over
print(f"£{pounds}.{pence:02d}")

# ** for powers
print("2 cubed is", 2 ** 3)

# BIDMAS — brackets control the order
print(2 + 3 * 4)      # 14 — multiplication happens first
print((2 + 3) * 4)     # 20 — brackets force addition first

number = int(input("Enter a whole number: "))
if number % 2 == 0:
    print("That's even")
else:
    print("That's odd")`,
    challenges: [
      {
        id: '3a',
        title: 'Change Calculator',
        description: 'Ask for a price and the amount tendered (both in pence, as whole numbers), then calculate the change and print it as pounds and pence using // and %.',
        code: `price    = int(input("Price in pence: "))
tendered = int(input("Amount paid in pence: "))

# TODO: work out the change in pence
# TODO: split the change into pounds and pence using // and %
# TODO: print it nicely, e.g. "Change: £3.20"
`,
      },
      {
        id: '3b',
        title: 'Coin Breakdown',
        description: 'Given an amount in pence, work out the fewest number of £2, £1 and 50p coins needed using // and %, repeating the process for each coin.',
        code: `amount = int(input("Amount in pence: "))

twos = amount // 200
amount = amount % 200

# TODO: repeat the pattern above for £1 (100p) then 50p coins
# TODO: print how many of each coin is needed
`,
      },
    ],
  },

  {
    id: 4,
    title: 'Strings & f-strings',
    category: 'Basics',
    description: 'Build and format text using string concatenation, f-strings, indexing, slicing and common string methods.',
    teachingNotes: [
      'Strings can be joined with + (concatenation) but every piece must already be a string.',
      'f-strings (f"...") let you drop variables straight into text using {curly braces} — no casting needed for printing.',
      'Useful string methods: .upper(), .lower(), .strip(), .replace(), .split().',
      'Strings are indexed from 0: name[0] is the first character. Negative indices count from the end: name[-1] is the last.',
      'len(text) tells you how many characters are in a string. Slicing text[0:3] returns the first three characters.',
    ],
    code: `first_name = "Ada"
last_name  = "Lovelace"

# f-strings are the modern, readable way to build text
greeting = f"Hello, {first_name} {last_name}!"
print(greeting)

# Indexing and slicing
print(first_name[0])       # 'A' — first character
print(first_name[-1])      # 'a' — last character
print(last_name[0:4])      # 'Love' — first four characters

# Useful methods
print(last_name.upper())
print(f"Full name is {len(first_name) + len(last_name)} characters long")`,
    challenges: [
      {
        id: '4a',
        title: 'Initials Generator',
        description: 'Ask for a first name and a last name, then print the initials in capitals, e.g. "A.L." — using indexing and .upper().',
        code: `first_name = input("First name: ")
last_name  = input("Last name: ")

# TODO: build the initials using first_name[0] and last_name[0]
# TODO: make sure they're capital letters, then print them like "A.L."
`,
      },
      {
        id: '4b',
        title: 'Username Generator',
        description: 'Build a username from the first three letters of a name plus their age, all lower case, e.g. "Ada" + 16 → "ada16". Use slicing, .lower() and an f-string.',
        code: `name = input("Name: ")
age  = input("Age: ")

# TODO: take the first 3 letters of name using slicing
# TODO: make them lower case with .lower()
# TODO: combine with age using an f-string and print the username
`,
      },
    ],
  },

  {
    id: 5,
    title: 'print() and input()',
    category: 'Basics',
    description: 'Control how text appears in the console with print(), and collect information from the user with input().',
    teachingNotes: [
      'print() can take multiple values separated by commas — it automatically adds a space between them.',
      'The sep and end keyword arguments change the separator between values, and what\'s printed at the very end (the default end is a new line).',
      'input("prompt") shows a message and waits for the user to respond — in this Playground it opens a pop-up dialog instead of a terminal line.',
      'Whatever the user types is returned as a str, ready to be cast if you need it as a number.',
    ],
    code: `# Multiple values, automatic spacing
print("Score:", 7, "out of", 10)

# Custom separator and end
print(1, 2, 3, 4, 5, sep=" -> ")
print("Loading", end="")
print("...", end="")
print(" done!")

# input() always pauses and waits for a response
name = input("What's your name? ")
mood = input("How are you feeling today? ")
print(f"Nice to meet you, {name}. Glad you're feeling {mood}!")`,
    challenges: [
      {
        id: '5a',
        title: 'Mad Libs',
        description: 'Collect a noun, an adjective and a verb using three input() calls, then print a silly sentence combining all three with an f-string.',
        code: `noun      = input("Give me a noun: ")
adjective = input("Give me an adjective: ")
verb      = input("Give me a verb (ending in -ing): ")

# TODO: print a silly sentence using all three, e.g.
# "The {adjective} {noun} was {verb} across the playground!"
`,
      },
      {
        id: '5b',
        title: 'Custom Separator',
        description: 'Print the numbers 1 to 5 on a single line, separated by " -> ", using one print() call and the sep keyword argument.',
        code: `# TODO: print 1, 2, 3, 4, 5 on one line separated by " -> "
# Hint: print(1, 2, 3, 4, 5, sep=...)
`,
      },
    ],
  },

  // ── Logic ──────────────────────────────────────────────────────────────────

  {
    id: 6,
    title: 'Booleans & comparison operators',
    category: 'Logic',
    description: 'Use True/False values and comparison operators to test conditions before you meet if statements.',
    teachingNotes: [
      'A bool is either True or False (capital letters, no quotes).',
      'Comparison operators == != > < >= <= each compare two values and produce a bool.',
      'and, or and not combine or invert boolean conditions — and needs both sides True, or needs just one.',
      'Comparisons can be chained: 0 <= mark <= 100 checks a range in a single, readable expression.',
    ],
    code: `mark = 72

print(mark == 72)          # True — equal to
print(mark != 100)         # True — not equal to
print(mark >= 50)          # True — greater than or equal to

is_pass  = mark >= 40
is_merit = mark >= 60
print("Pass:", is_pass)
print("Pass and Merit:", is_pass and is_merit)

# Chained comparison — checks a range in one go
print(0 <= mark <= 100)`,
    challenges: [
      {
        id: '6a',
        title: 'Range Checker',
        description: 'Ask the user for a whole number and print True or False for whether it lies between 1 and 10 inclusive — using a single chained comparison, no if statement needed.',
        code: `number = int(input("Enter a number: "))

# TODO: print True/False using a chained comparison, e.g. 1 <= number <= 10
`,
      },
      {
        id: '6b',
        title: 'Entry Flags',
        description: 'Given has_ticket and is_over_18, print whether entry is allowed. Entry needs a ticket, and either being over 18 or accompanied (use the accompanied flag too).',
        code: `has_ticket   = True
is_over_18   = False
accompanied  = True

# TODO: work out entry_allowed using and / or / not
# entry needs a ticket, AND (over 18 OR accompanied)
entry_allowed = None
print("Entry allowed:", entry_allowed)`,
      },
    ],
  },

  {
    id: 7,
    title: 'if / elif / else',
    category: 'Logic',
    description: 'Direct your program down different paths using if, elif and else to make decisions.',
    teachingNotes: [
      'Python runs the first indented block whose condition is True, then skips the rest of the chain.',
      'elif ("else if") checks another condition, but only if every condition above it was False.',
      'else is the catch-all for when nothing else matched — it never has its own condition.',
      'Indentation is not optional in Python — it\'s how Python knows which lines belong inside the if block.',
    ],
    code: `age = int(input("Enter your age: "))

if age < 5:
    price = 0
elif age < 16:
    price = 4
elif age < 65:
    price = 8
else:
    price = 5

print(f"Cinema ticket price: £{price}")

# else never has a condition of its own
day = input("Is today a Tuesday? (yes/no): ")
if day.lower() == "yes":
    print("Tuesdays are half price!")
else:
    print("Full price today.")`,
    challenges: [
      {
        id: '7a',
        title: 'Student Discount',
        description: 'Extend the ticket pricing example to also ask "Are you a student? (yes/no)" and take £1 off the price if so — but only for the 16-64 price band.',
        code: `age = int(input("Enter your age: "))

if age < 5:
    price = 0
elif age < 16:
    price = 4
elif age < 65:
    price = 8
else:
    price = 5

# TODO: ask if they're a student and apply a £1 discount when age band is 16-64

print(f"Cinema ticket price: £{price}")`,
      },
      {
        id: '7b',
        title: 'Rock, Paper, Scissors',
        description: 'Play one round of Rock, Paper, Scissors against the computer. The computer\'s move is chosen randomly for you — use if/elif/else to work out who wins.',
        code: `import random

options = ["rock", "paper", "scissors"]
computer = random.choice(options)
player = input("rock, paper or scissors? ").lower()

print(f"Computer chose {computer}")

# TODO: use if/elif/else to compare player vs computer and print the result
# Remember: rock beats scissors, scissors beats paper, paper beats rock
`,
      },
    ],
  },

  // ── Loops ──────────────────────────────────────────────────────────────────

  {
    id: 9,
    title: 'for loops',
    category: 'Loops',
    description: 'Repeat an action a set number of times, or once for every item in a list, using a for loop.',
    teachingNotes: [
      'for item in list: runs the indented block once per item, giving you that item each time round.',
      'range(5) produces the numbers 0, 1, 2, 3, 4 — perfect for repeating something a fixed number of times.',
      'range(start, stop, step) lets you control where counting begins, ends, and the size of each jump.',
      'Use enumerate(list) when you need both the position (index) and the value inside the loop.',
    ],
    illustration: `<svg viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg">
      <path d="M 340 25 A 50 20 0 1 1 339 24" fill="none" stroke="#8b5cf6" stroke-width="2.5" marker-end="url(#arrow)"/>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#8b5cf6"/>
        </marker>
      </defs>
      <text x="340" y="10" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#5b21b6">repeat</text>
      <rect x="20"  y="50" width="60" height="50" rx="6" fill="#ede9fe" stroke="#8b5cf6" stroke-width="2"/>
      <rect x="90"  y="50" width="60" height="50" rx="6" fill="#ede9fe" stroke="#8b5cf6" stroke-width="3"/>
      <rect x="160" y="50" width="60" height="50" rx="6" fill="#ede9fe" stroke="#8b5cf6" stroke-width="2"/>
      <rect x="230" y="50" width="60" height="50" rx="6" fill="#ede9fe" stroke="#8b5cf6" stroke-width="2"/>
      <text x="50"  y="80" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#5b21b6">"Amy"</text>
      <text x="120" y="80" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#5b21b6">"Bo"</text>
      <text x="190" y="80" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#5b21b6">"Cai"</text>
      <text x="260" y="80" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#5b21b6">"Dev"</text>
      <text x="120" y="42" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#8b5cf6">current item ↑</text>
      <text x="150" y="118" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#64748b">for name in students:</text>
    </svg>`,
    code: `students = ["Amy", "Bo", "Cai", "Dev"]

for name in students:
    print(f"Good morning, {name}!")

# range() for a fixed number of repeats
for i in range(1, 6):
    print(f"5 x {i} = {5 * i}")

# enumerate() when you need the position too
for index, name in enumerate(students):
    print(f"{index + 1}. {name}")`,
    challenges: [
      {
        id: '9a',
        title: 'Times Table Generator',
        description: 'Ask the user for a number, then print its times table from 1 to 12 using a for loop and range().',
        code: `number = int(input("Which times table? "))

# TODO: use for i in range(1, 13): to print the times table
`,
      },
      {
        id: '9b',
        title: 'Total and Average',
        description: 'Given a list of test scores, use a for loop to add them all up, then calculate and print the average. Don\'t use the built-in sum() function.',
        code: `scores = [56, 72, 81, 64, 90, 47]
total = 0

# TODO: loop through scores, adding each one to total
# TODO: calculate the average (total / number of scores)
# TODO: print both the total and the average
`,
      },
    ],
  },

  {
    id: 10,
    title: 'while loops',
    category: 'Loops',
    description: 'Repeat a block of code for as long as a condition stays True — ideal when you don\'t know in advance how many repeats you\'ll need.',
    teachingNotes: [
      'while condition: keeps looping as long as the condition evaluates to True.',
      'Something inside the loop must eventually make the condition False, or you\'ll create an infinite loop.',
      'break immediately exits a loop early. continue skips the rest of the current repeat and jumps to the next one.',
      'while loops are perfect for input validation: keep asking until the answer is actually valid.',
    ],
    code: `# Keep asking until a positive number is entered
number = int(input("Enter a positive number: "))
while number <= 0:
    print("That's not positive — try again.")
    number = int(input("Enter a positive number: "))
print(f"Thanks! You entered {number}")

# A simple countdown using break
count = 5
while True:
    print(count)
    count -= 1
    if count == 0:
        print("Liftoff!")
        break`,
    challenges: [
      {
        id: '10a',
        title: 'PIN Validator',
        description: 'Keep asking for a 4-digit PIN until it matches "1234", giving the user a maximum of 3 attempts. Print "Access granted" or "Account locked" as appropriate.',
        code: `correct_pin = "1234"
attempts = 0

# TODO: use a while loop that keeps asking for a PIN
# TODO: stop after 3 attempts (use break) or when the PIN is correct
`,
      },
      {
        id: '10b',
        title: 'Guess the Number',
        description: 'The computer picks a random number between 1 and 20. Loop asking the player to guess, printing "Too high" / "Too low" until they get it right.',
        code: `import random

secret = random.randint(1, 20)

# TODO: use a while loop to keep asking for guesses
# TODO: print "Too high" or "Too low" using if/elif
# TODO: when the guess is correct, print a message and stop the loop
`,
      },
    ],
  },

  // ── Collections ────────────────────────────────────────────────────────────

  {
    id: 8,
    title: 'Lists',
    category: 'Collections',
    description: 'Store multiple values in a single ordered, changeable list, and access items by their index.',
    teachingNotes: [
      'Square brackets create a list: fruits = ["apple", "banana", "cherry"].',
      'Lists are indexed from 0. fruits[0] is "apple". Negative indices count from the end: fruits[-1] is the last item.',
      'Lists are mutable: fruits.append("mango") adds an item; fruits.remove("banana") deletes a matching one.',
      'len(fruits) gives the number of items. The in keyword checks membership: "apple" in fruits.',
      'Slicing fruits[1:3] returns a new list containing items 1 up to (but not including) 3.',
    ],
    illustration: `<svg viewBox="0 0 400 110" xmlns="http://www.w3.org/2000/svg">
      <text x="55"  y="18" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#166534">0</text>
      <text x="125" y="18" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#166534">1</text>
      <text x="195" y="18" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#166534">2</text>
      <text x="265" y="18" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#166534">3</text>
      <rect x="25"  y="25" width="60" height="50" rx="6" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
      <rect x="95"  y="25" width="60" height="50" rx="6" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
      <rect x="165" y="25" width="60" height="50" rx="6" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
      <rect x="235" y="25" width="60" height="50" rx="6" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
      <text x="55"  y="55" text-anchor="middle" font-family="Courier New, monospace" font-size="11" fill="#14532d">"apple"</text>
      <text x="125" y="55" text-anchor="middle" font-family="Courier New, monospace" font-size="10" fill="#14532d">"banana"</text>
      <text x="195" y="55" text-anchor="middle" font-family="Courier New, monospace" font-size="10" fill="#14532d">"cherry"</text>
      <text x="265" y="55" text-anchor="middle" font-family="Courier New, monospace" font-size="10" fill="#14532d">"mango"</text>
      <text x="155" y="98" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#64748b">fruits[0] is "apple"   ·   fruits[-1] is "mango"</text>
    </svg>`,
    code: `fruits = ["apple", "banana", "cherry"]

print(fruits[0])        # apple
print(fruits[-1])        # cherry — last item

fruits.append("mango")
print(fruits)

fruits.remove("banana")
print(fruits)

print(len(fruits))
print("cherry" in fruits)
print(fruits[0:2])       # slice — first two items`,
    challenges: [
      {
        id: '8a',
        title: 'Shopping List Manager',
        description: 'Start with a small shopping list, add two more items using input(), remove one item by name, then print the final list.',
        code: `shopping = ["milk", "bread", "eggs"]

# TODO: add two items using input() and .append()
# TODO: remove one item using .remove()

print("Final list:", shopping)`,
      },
      {
        id: '8b',
        title: 'List Stats',
        description: 'Given a list of test scores, print the number of scores, the total, the highest and the lowest — using len(), sum(), max() and min().',
        code: `scores = [56, 72, 81, 64, 90, 47]

# TODO: print len(scores), sum(scores), max(scores) and min(scores)
# with a helpful label in front of each one
`,
      },
    ],
  },

  {
    id: 11,
    title: 'Dictionaries',
    category: 'Collections',
    description: 'Store and look up data using meaningful key:value pairs instead of numeric indices.',
    teachingNotes: [
      'Curly braces with key:value pairs create a dictionary: student = {"name": "Ada", "age": 16}.',
      'Look up a value with its key: student["name"]. A missing key raises a KeyError — use .get() to avoid crashing.',
      'Add or change an entry with dict[key] = value. Delete one with del dict[key].',
      'for key in dict: loops over the keys; dict.items() gives you both the key and value together.',
    ],
    illustration: `<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="15" width="100" height="35" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
      <text x="70" y="38" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#7f1d1d">"name"</text>
      <path d="M124 32 L166 32" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow2)"/>
      <defs><marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8"/></marker></defs>
      <rect x="170" y="15" width="100" height="35" rx="6" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2"/>
      <text x="220" y="38" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#0c4a6e">"Ada"</text>

      <rect x="20" y="65" width="100" height="35" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
      <text x="70" y="88" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#7f1d1d">"age"</text>
      <path d="M124 82 L166 82" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow2)"/>
      <rect x="170" y="65" width="100" height="35" rx="6" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2"/>
      <text x="220" y="88" text-anchor="middle" font-family="Courier New, monospace" font-size="12" fill="#0c4a6e">16</text>

      <text x="330" y="55" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#64748b">key</text>
      <text x="330" y="88" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#64748b">→ value</text>
    </svg>`,
    code: `student = {"name": "Ada", "age": 16, "course": "Level 2 Computing"}

print(student["name"])
print(student.get("age"))

# .get() with a default avoids crashing on a missing key
print(student.get("email", "no email on file"))

student["age"] = 17          # update an existing key
student["grade"] = "Merit"   # add a brand new key

for key, value in student.items():
    print(f"{key}: {value}")`,
    challenges: [
      {
        id: '11a',
        title: 'Contact Book Entry',
        description: 'Build a dictionary for a contact using input() for name, phone and email, then print a formatted "contact card" using an f-string.',
        code: `contact = {}

# TODO: fill contact with "name", "phone" and "email" from input()
# TODO: print a neat multi-line contact card using an f-string
`,
      },
      {
        id: '11b',
        title: 'Word Counter',
        description: 'Given a fixed list of words, build a dictionary that counts how many times each word appears.',
        code: `words = ["python", "code", "python", "loop", "code", "python"]
counts = {}

# TODO: loop through words
# TODO: if the word is already a key, add 1 to its count
# TODO: if not, add it to the dictionary with a count of 1

print(counts)`,
      },
    ],
  },

  {
    id: 12,
    title: 'Tuples & Sets',
    category: 'Collections',
    description: 'Use tuples for fixed, ordered data and sets for collections of unique, unordered values.',
    teachingNotes: [
      'A tuple uses round brackets: point = (3, 7). Tuples are ordered but immutable — they cannot be changed once created.',
      'Tuples are often used for values that belong together and shouldn\'t change, like an (x, y) coordinate or an RGB colour.',
      'A set uses curly braces with no colons: colours = {"red", "green", "blue"}. Sets automatically remove duplicates.',
      'Sets are unordered — you can\'t rely on item position — but they\'re very fast for checking membership and de-duplicating a list.',
    ],
    code: `# Tuples — fixed, ordered, can't be changed
point = (3, 7)
x, y = point   # unpacking — pulls the tuple apart into two variables
print(f"x is {x}, y is {y}")

rgb = (255, 0, 128)
print(f"Red: {rgb[0]}  Green: {rgb[1]}  Blue: {rgb[2]}")

# Sets — unique, unordered
colours = {"red", "green", "blue", "red"}   # duplicate "red" is dropped
print(colours)
print(len(colours))

# A common trick: use a set to remove duplicates from a list
raw_list = [1, 2, 2, 3, 3, 3, 4]
unique_list = list(set(raw_list))
print(unique_list)`,
    challenges: [
      {
        id: '12a',
        title: 'Unpack a Tuple',
        description: 'Given a tuple of RGB values, unpack it into r, g, b variables and print a sentence describing the colour.',
        code: `colour = (34, 139, 34)

# TODO: unpack colour into r, g, b
# TODO: print an f-string like "This colour has red=34, green=139, blue=34"
`,
      },
      {
        id: '12b',
        title: 'Remove Duplicates',
        description: 'Given a list of class register entries with repeats, use a set to remove the duplicates and print the unique list of names.',
        code: `register = ["Amy", "Bo", "Amy", "Cai", "Bo", "Dev"]

# TODO: convert register to a set, then back to a list
# TODO: print the de-duplicated list
`,
      },
    ],
  },

  // ── Functions & Errors ─────────────────────────────────────────────────────

  {
    id: 13,
    title: 'Functions',
    category: 'Functions & Errors',
    description: 'Package reusable blocks of code into functions that accept parameters and return results.',
    teachingNotes: [
      'def function_name(parameters): starts a function definition; the indented block below is its body.',
      'return sends a value back to wherever the function was called — it also immediately ends the function.',
      'Parameters are placeholders in the definition; arguments are the actual values you pass in when you call it.',
      'Default parameter values, e.g. def greet(name="friend"):, make an argument optional.',
      'Writing a function once and calling it many times avoids repeating the same code (DRY — Don\'t Repeat Yourself).',
    ],
    illustration: `<svg viewBox="0 0 400 110" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 55 L110 55" stroke="#dc2626" stroke-width="2.5" marker-end="url(#arrow3)"/>
      <defs><marker id="arrow3" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#dc2626"/></marker></defs>
      <text x="65" y="42" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#7f1d1d">arguments</text>
      <text x="65" y="72" text-anchor="middle" font-family="Courier New, monospace" font-size="11" fill="#7f1d1d">5, 3</text>

      <rect x="115" y="20" width="150" height="70" rx="8" fill="#fee2e2" stroke="#ef4444" stroke-width="2.5"/>
      <text x="190" y="48" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="12" fill="#7f1d1d">function</text>
      <text x="190" y="68" text-anchor="middle" font-family="Courier New, monospace" font-size="11" fill="#7f1d1d">add(a, b)</text>

      <path d="M270 55 L360 55" stroke="#dc2626" stroke-width="2.5" marker-end="url(#arrow3)"/>
      <text x="320" y="42" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="11" fill="#7f1d1d">return</text>
      <text x="320" y="72" text-anchor="middle" font-family="Courier New, monospace" font-size="11" fill="#7f1d1d">8</text>
    </svg>`,
    code: `def area_of_rectangle(width, height):
    area = width * height
    return area

print(area_of_rectangle(4, 5))
print(area_of_rectangle(10, 2))

# A default parameter value makes the argument optional
def greet(name="friend"):
    return f"Hello, {name}!"

print(greet("Ada"))
print(greet())`,
    challenges: [
      {
        id: '13a',
        title: 'Temperature Function',
        description: 'Write a function celsius_to_fahrenheit(c) that returns the converted value, then call it with three different test values and print each result.',
        code: `def celsius_to_fahrenheit(c):
    # TODO: return the Fahrenheit equivalent using F = C * 9/5 + 32
    pass

# TODO: call the function with 0, 20 and 100, printing each result
`,
      },
      {
        id: '13b',
        title: 'Grade Function',
        description: 'Turn the grade-boundary if/elif/else logic into a reusable function get_grade(mark) that returns the letter grade, then test it with a few marks.',
        code: `def get_grade(mark):
    # TODO: use if/elif/else to work out and return a grade string
    # 90+ = "A*", 80+ = "A", 70+ = "B", 60+ = "C", 50+ = "D", else "U"
    pass

for test_mark in [95, 82, 63, 40]:
    print(test_mark, "->", get_grade(test_mark))`,
      },
    ],
  },

  {
    id: 14,
    title: 'try / except error handling',
    category: 'Functions & Errors',
    description: 'Catch and handle errors gracefully instead of letting your program crash.',
    teachingNotes: [
      'Code that might fail goes inside a try block; the except block only runs if an error occurs.',
      'Naming the exception type, e.g. except ValueError:, lets you handle specific problems differently from others.',
      'else runs only if the try block succeeded with no error; finally always runs, whether there was an error or not.',
      'Catching an error is not the same as ignoring it — always tell the user (or log) what went wrong.',
    ],
    code: `try:
    age = int(input("Enter your age: "))
    print(f"In 10 years you'll be {age + 10}")
except ValueError:
    print("That wasn't a whole number!")
else:
    print("Thanks, that worked first time.")
finally:
    print("Done trying.")

# Catching more than one type of error
try:
    a = int(input("First number: "))
    b = int(input("Second number: "))
    print(a / b)
except ValueError:
    print("Please enter whole numbers only.")
except ZeroDivisionError:
    print("Can't divide by zero!")`,
    challenges: [
      {
        id: '14a',
        title: 'Safe Divider',
        description: 'Ask for two numbers and divide them, catching both a ValueError (bad input) and a ZeroDivisionError (dividing by zero) with a clear message for each.',
        code: `# TODO: wrap the input and division in a try block
# TODO: except ValueError -> print a message about invalid numbers
# TODO: except ZeroDivisionError -> print a message about dividing by zero
`,
      },
      {
        id: '14b',
        title: 'Retry Loop',
        description: 'Combine a while loop with try/except to keep asking for a whole number until the user actually gives you one, instead of crashing on the first bad entry.',
        code: `# TODO: use "while True:" with a try/except inside
# TODO: on success, break out of the loop
# TODO: on ValueError, print a message and loop again
`,
      },
    ],
  },

  // ── Files ──────────────────────────────────────────────────────────────────

  {
    id: 15,
    title: 'Reading & writing files',
    category: 'Files',
    description: 'Save data permanently by writing it to a file, and load it back later by reading the file\'s contents.',
    teachingNotes: [
      'open(filename, mode) opens a file — "w" writes (and overwrites), "a" appends, "r" reads.',
      'Always close a file when you\'re done — or better, use with open(...) as f: which closes it automatically, even if an error occurs.',
      'f.write(text) writes a string to the file. f.read() reads the whole file as one string; f.readlines() gives you a list of lines.',
      'In this Playground, files your program writes appear as new tabs in the workspace once the program finishes running.',
    ],
    code: `# Writing to a file — "w" mode overwrites any existing content
with open("notes.txt", "w") as f:
    f.write("Python Playground notes\\n")
    f.write("Files persist inside the workspace.\\n")

# Reading it back
with open("notes.txt", "r") as f:
    contents = f.read()
print(contents)

# Appending adds to the end without erasing what's already there
with open("notes.txt", "a") as f:
    f.write("This line was appended.\\n")`,
    challenges: [
      {
        id: '15a',
        title: 'Class Register',
        description: 'Ask for 3 student names using input() in a loop, writing each one on its own line to register.txt using append mode, then read the whole file back and print it.',
        code: `# TODO: loop 3 times, asking for a name each time
# TODO: open "register.txt" in append mode and write each name on its own line
# TODO: afterwards, open it again in read mode and print the whole file
`,
      },
      {
        id: '15b',
        title: 'Line Counter',
        description: 'Write a short multi-line poem to a file, then reopen it and use readlines() plus len() to report how many lines it has.',
        code: `poem = """Roses are red,
Violets are blue,
Python is fun,
And so, apparently, are you."""

# TODO: write poem to "poem.txt"
# TODO: reopen it, use f.readlines() to get a list of lines
# TODO: print how many lines the file has using len()
`,
      },
    ],
  },

  // ── Data Science ───────────────────────────────────────────────────────────

  {
    id: 16,
    title: 'Intro to NumPy, Pandas & Matplotlib',
    category: 'Data Science',
    description: 'Take your first steps with Python\'s most popular data-science libraries — fast maths, tables of data, and charts.',
    teachingNotes: [
      'Install NumPy, Pandas and Matplotlib first using the 📦 Packages button before running this example.',
      'NumPy arrays are like lists but built for fast maths: array * 2 multiplies every element at once, with no loop needed.',
      'Pandas DataFrames store data in labelled rows and columns, like a spreadsheet — perfect for working with CSV files.',
      'Matplotlib\'s plt.plot() and plt.bar() draw charts; plt.show() sends the finished chart to the Graphics tab.',
      'These libraries build on everything you\'ve already learned — variables, lists, loops and functions all still apply.',
    ],
    code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# NumPy — fast maths on whole arrays at once
scores = np.array([56, 72, 81, 64, 90])
print("Mean:", scores.mean())
print("Doubled:", scores * 2)

# Pandas — labelled rows and columns, like a spreadsheet
data = {
    "Subject": ["Maths", "Computing", "English"],
    "Grade":   [7, 9, 6],
}
df = pd.DataFrame(data)
print(df)

# Matplotlib — turn the DataFrame into a chart
plt.bar(df["Subject"], df["Grade"])
plt.title("My Grades")
plt.ylabel("Grade")
plt.show()`,
    challenges: [
      {
        id: '16a',
        title: 'NumPy Stats',
        description: 'Create a NumPy array containing 10 test scores of your choosing, then print the mean, highest and lowest using .mean(), .max() and .min().',
        code: `import numpy as np

scores = np.array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])  # TODO: replace with 10 real scores

# TODO: print scores.mean(), scores.max() and scores.min() with labels
`,
      },
      {
        id: '16b',
        title: 'Plot Your Own Data',
        description: 'Build a small Pandas DataFrame with 5 subjects and grades of your own, then plot a bar chart with plt.bar() and add a title.',
        code: `import pandas as pd
import matplotlib.pyplot as plt

# TODO: build a dictionary with "Subject" and "Grade" lists (5 of each)
# TODO: turn it into a DataFrame with pd.DataFrame(...)
# TODO: plot it with plt.bar(), add a title, then plt.show()
`,
      },
    ],
  },

]
