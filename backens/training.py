import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle

# Load CSV
df = pd.read_csv("marks.csv")

# Features
X = df[['study_hours', 'attendance',
        'previous_marks', 'sleep_hours']]

# Target
y = df['final_marks']

# Train model
model = LinearRegression()
model.fit(X, y)

print("Model trained!")

# Save
with open("marks_model.pkl", "wb") as file:
    pickle.dump(model, file)

print("Model saved!")