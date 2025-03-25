import json


def main():
    with open("design_schema.txt", "r") as file:
        raw_text = file.read()

    try:
        json_data = json.loads(raw_text)  # Parse string into JSON
        print(json.dumps(json_data, indent=2))  # Pretty-print the JSON
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
        exit(1)  # Handle invalid JSON


main()
