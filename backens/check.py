import pickle
import pandas as pd
import sys
import json

# Load trained model
with open("marks_model.pkl", "rb") as file:
    model = pickle.load(file)

# Read values from Node
study_hours = float(sys.argv[1])
attendance = float(sys.argv[2])
previous_marks = float(sys.argv[3])
sleep_hours = float(sys.argv[4])

# Create DataFrame
new_data = pd.DataFrame({
    "study_hours": [study_hours],
    "attendance": [attendance],
    "previous_marks": [previous_marks],
    "sleep_hours": [sleep_hours]
})

prediction = model.predict(new_data)

predicted_marks = round(float(prediction[0]), 2)

predicted_marks = max(0, min(100, predicted_marks))

print(json.dumps({
    "predicted_marks": predicted_marks
}))

