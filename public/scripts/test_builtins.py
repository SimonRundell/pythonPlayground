# Test script: Python Standard Library
# No packages need installing — these modules are part of Python itself.
# Tests: math, random, statistics, datetime, collections, itertools, string
# Expected output: results printed to the Console.

import math
import random
import statistics
import datetime
import collections
import itertools
import string

print("=" * 40)
print("  Python Standard Library — functionality test")
print("=" * 40)

# --- math ---
print("\n[ math ]")
print(f"  π  = {math.pi:.10f}")
print(f"  e  = {math.e:.10f}")
print(f"  √144 = {math.sqrt(144)}")
print(f"  10! = {math.factorial(10):,}")
print(f"  log₂(1024) = {math.log2(1024):.0f}")
print(f"  sin(90°) = {math.sin(math.radians(90)):.1f}")

# --- random ---
print("\n[ random ]")
random.seed(42)
nums = [random.randint(1, 100) for _ in range(10)]
print(f"  10 random ints (seed 42): {nums}")
print(f"  choice: {random.choice(nums)}")
sample = random.sample(nums, 4)
print(f"  sample of 4: {sample}")
shuffled = nums[:]
random.shuffle(shuffled)
print(f"  shuffled:     {shuffled}")
print(f"  uniform(0,1): {random.uniform(0, 1):.4f}")
print(f"  gauss(50,10): {random.gauss(50, 10):.2f}")

# --- statistics ---
print("\n[ statistics ]")
data = [23, 45, 12, 67, 34, 89, 56, 23, 45, 67, 34, 78]
print(f"  Data:    {data}")
print(f"  mean:    {statistics.mean(data):.2f}")
print(f"  median:  {statistics.median(data)}")
print(f"  mode:    {statistics.mode(data)}")
print(f"  stdev:   {statistics.stdev(data):.2f}")
print(f"  variance:{statistics.variance(data):.2f}")

# --- datetime ---
print("\n[ datetime ]")
now = datetime.datetime.now()
print(f"  Now:           {now.strftime('%Y-%m-%d  %H:%M:%S')}")
print(f"  Day of week:   {now.strftime('%A')}")
xmas = datetime.date(now.year, 12, 25)
today = datetime.date.today()
delta = xmas - today
print(f"  Days to Christmas: {delta.days}")

# --- collections ---
print("\n[ collections ]")
words  = "to be or not to be that is the question to be".split()
counts = collections.Counter(words)
print(f"  Counter top-3: {counts.most_common(3)}")
dq = collections.deque([1, 2, 3], maxlen=5)
dq.appendleft(0)
dq.append(4)
print(f"  deque (maxlen=5): {list(dq)}")
od = collections.OrderedDict([('a', 1), ('b', 2), ('c', 3)])
print(f"  OrderedDict: {dict(od)}")

# --- itertools ---
print("\n[ itertools ]")
letters = list(itertools.islice(itertools.cycle('ABC'), 9))
print(f"  cycle 'ABC' × 9: {letters}")
pairs = list(itertools.combinations('ABCD', 2))
print(f"  C(4,2) combinations: {pairs}")
chains = list(itertools.chain([1, 2], [3, 4], [5]))
print(f"  chain:  {chains}")

# --- string ---
print("\n[ string ]")
print(f"  ascii_uppercase: {string.ascii_uppercase}")
print(f"  digits:          {string.digits}")
secret = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
print(f"  random 12-char password: {secret}")

print("\n✓ Standard library test complete.")
