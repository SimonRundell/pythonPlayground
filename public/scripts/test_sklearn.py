# Test script: scikit-learn
# Install scikit-learn from the Packages button before running.
# Expected output: model accuracy and classification report in the Console.

from sklearn.datasets import make_classification, make_regression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import numpy as np

print("=" * 40)
print("  scikit-learn — functionality test")
print("=" * 40)

# --- Classification ---
print("\n[ Logistic Regression — Classification ]")
X_c, y_c = make_classification(n_samples=300, n_features=5,
                                n_informative=3, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X_c, y_c, test_size=0.25, random_state=42)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

clf = LogisticRegression(random_state=42, max_iter=500)
clf.fit(X_train_s, y_train)
y_pred = clf.predict(X_test_s)

print(f"  Train size: {len(X_train)}, Test size: {len(X_test)}")
print(f"  Test accuracy: {accuracy_score(y_test, y_pred):.2%}")
print("\n  Classification report:")
print(classification_report(y_test, y_pred,
                             target_names=['Class 0', 'Class 1'],
                             indent=4))

# --- Regression ---
print("[ Linear Regression ]")
X_r, y_r = make_regression(n_samples=200, n_features=3,
                             noise=15, random_state=42)
X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(
    X_r, y_r, test_size=0.25, random_state=42)
reg = LinearRegression()
reg.fit(X_train_r, y_train_r)
r2 = reg.score(X_test_r, y_test_r)
print(f"  R² on test set: {r2:.4f}")
print(f"  Coefficients:   {reg.coef_.round(3)}")

# --- Cross-validation ---
cv_scores = cross_val_score(clf, X_train_s, y_train, cv=5)
print(f"\n[ 5-fold Cross-validation (Logistic Regression) ]")
print(f"  Fold scores: {cv_scores.round(3)}")
print(f"  Mean: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

print("\n✓ scikit-learn test complete.")
