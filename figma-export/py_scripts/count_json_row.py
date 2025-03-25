import json 

# Function to count the number of rows (objects) in a nested JSON structure
def count_rows(data):
    count = 0

    def traverse(node):
        nonlocal count
        count += 1  # Count current node

        if isinstance(node, dict) and "children" in node:
            for child in node["children"]:
                traverse(child)

    for item in data:
        traverse(item)

    return count

# Count the number of rows in the JSON structure
with open("design_metadata.json") as f:
    json_data = json.load(f)
    num_rows = count_rows(json_data)
    print(f"Total number of rows: {num_rows}")
