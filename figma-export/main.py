import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

FIGMA_ACCESS_TOKEN = os.environ.get("FIGMA_ACCESS_TOKEN")
FILE_ID = "noV2jNk7syqoka9Ck3zsJG"
NODE_ID = "273:2925"

url = f"https://api.figma.com/v1/files/{FILE_ID}?ids={NODE_ID}"
headers = {"X-Figma-Token": FIGMA_ACCESS_TOKEN}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    design_data = response.json()
    with open("figma_design.json", "w") as file:
        json.dump(design_data, file, indent=4)
    print("✅ Design JSON exported successfully!")
else:
    print(f"❌ Error: {response.status_code}", response.text)
