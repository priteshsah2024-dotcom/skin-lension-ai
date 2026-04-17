import sys
import random

# check if image path is provided
if len(sys.argv) < 2:
    print("No image provided")
    sys.exit()

image_path = sys.argv[1]

# simulate prediction
predictions = [
    "Benign - Low Risk",
    "Malignant - High Risk",
    "Needs Further Medical Check"
]
result = random.choice(predictions)

print(result)