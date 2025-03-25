import os
import json

figma_json = None

with open("designs/revenue/revenue_collection.json") as f:
    figma_json = json.load(f)

if figma_json:
    with open("sample_design.txt", "w") as file:
        json.dump(figma_json, file, separators=(",", ":"))
