import json 

ignored_properties = ["id",  "children", "scrollBehavior", "characterStyleOverrides", "styleOverrideTable", "effects", "layoutVersion", "interactions"]

def traverse_nodes(node):
    # Extract properties dynamically, excluding ignored ones
    metadata = {key: value for key, value in node.items() if key not in ignored_properties}

    # Recursively process children, if any
    if "children" in node:
        metadata["children"] = [traverse_nodes(child) for child in node["children"]]

    return metadata

def extract_design_metadata(figma_json):
    """
    Extract metadata from the Figma JSON file.
    """
    elements = []
    
    # Locate the main canvas and traverse its children
    for child in figma_json["document"]["children"]:
        if child["type"] == "CANVAS":
            for node in child["children"]:
                elements.append(traverse_nodes(node))

    return elements



# Read the downloaded Figma JSON file
with open("figma_design.json") as f:
    figma_json = json.load(f)

design_elements = extract_design_metadata(figma_json)
with open("design_metadata.json", "w") as file:
    json.dump(design_elements, file, indent=4)

print("✅ Design metadata extracted successfully!")
