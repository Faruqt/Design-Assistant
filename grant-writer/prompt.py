# - You will always be given **context** to guide your thought process.
# - However, as a top-tier designer, you have the creative freedom to generate **visually appealing and functional designs** but your designs must always align with the user's needs and adhere strictly to the provided context.
# - **You must strictly follow the JSON schema** to ensure your designs are well-structured and machine-readable.


def create_prompt(context, prompt_text):

    schema = get_design_schema()

    messages = [
        {
            "role": "system",
            "content": f"""You are a world-class designer working at the most prestigious design company, known for housing the most creative minds. 
            
            Your task is to convert the provided **context** into **strict JSON format**, following the **exact** JSON schema.

            **Instructions:**
            - You will always receive a **context**, describing the design that needs to be converted to JSON.
            - You will also receive a **JSON schema** that defines the required structure.
            - **You must strictly follow the JSON schema** without adding or modifying elements beyond what is given.
            - Ensure the JSON output is well-structured, machine-readable, and optimized for usability.
            - **DO NOT** add any explanations, comments, or additional text—only return the valid JSON.

            **Context (Design Information):**  
            ```  
            {context}  
            ```  

            **JSON Schema (Strict Format to Follow):**  
            ```  
            {schema}  
            ```  

            **Important Notes:**
            - If a required field is missing in the context, return an empty placeholder (`""` for strings, `empty objects` for objects, etc.).
            - Ensure consistency in formatting (e.g., proper indentation, valid JSON syntax).
            - Preserve all meaningful details while keeping the structure aligned with the schema.
            """,
        },
        {"role": "user", "content": prompt_text},
    ]

    return messages


def create_prompt(context, prompt_text):

    schema = get_design_schema()

    messages = [
        {
            "role": "system",
            "content": f"""You are a world-class product designer working at the most prestigious design company, known for employing the world's most creative minds. 
            
            Your task is to always convert the **JSON Design Text** contained in the prompt provided by the user into a **JSON format**, that follows the **provided** JSON schema below.

            **Instructions:**
            - You will always recieve the **JSON Design Text** that needs to be converted into a formatted JSON.
            - You will always receive a **JSON schema** that defines the required structure.
            - **DO NOT** include the JSON schema itself in the provided response.
            - **The JSON schema is provided for reference only.**
            - Ensure the JSON output is well-structured, machine-readable, and optimized for usability.
            - **DO NOT** add any explanations, comments, or additional text—only return the valid JSON.
            - **Strictly follow the information regarding positioning and size of elements as provided in the JSON Design Text in the prompt.**

            **JSON Schema (Strict Format to Follow):**  
            ```  
            {schema}  
            ```  

            **Important Notes:**
            - Ensure consistency in formatting (e.g., proper indentation, valid JSON syntax).
            - Preserve all meaningful details while keeping the structure aligned with the schema.
            """,
        },
        {"role": "user", "content": prompt_text},
    ]

    return messages
