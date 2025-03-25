# import the required libraries
import os
import uuid
import json
import tiktoken
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
from dotenv import load_dotenv
from collections import deque

# local imports
from design_description import concatenate_embedding_and_design_description

load_dotenv()

# Retrieve the API key from the environment
API_KEY = os.environ.get("API_KEY_2")
PINE_CONE_API_KEY = os.environ.get("PINE_CONE_API_KEY")
PINE_CONE_INDEX_HOST = os.environ.get("PINE_CONE_INDEX_HOST")

# Create a Pinecone client
pc_client = Pinecone(api_key=PINE_CONE_API_KEY)

# Create a new deployment
client = OpenAI(api_key=API_KEY)

# Create a pine cone index
index_name = "design-application-index"


def create_or_retrieve_index(index_name):
    # Get the list of indexes
    index_list = pc_client.list_indexes().indexes

    print("index_list", index_list)

    if index_list is None or len(index_list) == 0:
        print("Creating a new index")
        pc_client.create_index(
            name=index_name,
            dimension=1536,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
    elif index_list is not None:
        for index in index_list:
            if index["name"] != index_name:
                print("Creating a new index")
                pc_client.create_index(
                    name=index_name,
                    dimension=1536,
                    metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
                )
                break
            else:
                print("Index already exists")
                break

    # Retrieve the index
    index = pc_client.Index(host=PINE_CONE_INDEX_HOST)

    return index


def create_embedding_text():
    # Create embeddings for the prompt
    with open("metadata.txt", "r") as file:
        design_metadata = file.read()

    # create embeddings for the design description and design_metadata
    embedding_text = concatenate_embedding_and_design_description(design_metadata)

    return embedding_text


def get_design_schema():
    with open("design_schema.txt", "r") as file:
        schema_text = file.read()

    return schema_text


def chunk_text(text, max_tokens=8000):
    """Splits text into smaller chunks within token limits."""
    enc = tiktoken.get_encoding("cl100k_base")
    tokens = enc.encode(text)

    print(f"Total tokens: {len(tokens)}")

    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i : i + max_tokens]
        chunk_text = enc.decode(chunk_tokens)
        chunks.append(chunk_text)

    return chunks


def store_design_in_pinecone(design_id, text, index):
    """Chunks a large design text, embeds each chunk, and stores it in Pinecone."""

    chunks = chunk_text(text)
    chunk_embeddings = []

    for i, chunk in enumerate(chunks):
        response = client.embeddings.create(model="text-embedding-ada-002", input=chunk)
        embedding = response.data[0].embedding

        metadata = {
            "design_id": design_id,
            "chunk_id": i,
            "is_first_chunk": (i == 0),
            "next_chunk_id": (
                f"{design_id}_chunk_{i+1}" if i + 1 < len(chunks) else ""
            ),
            "text": chunk,
        }

        print(f"Storing chunk {i} for design {design_id}")

        chunk_embeddings.append(
            {"id": f"{design_id}_chunk_{i}", "values": embedding, "metadata": metadata}
        )

    index.upsert(vectors=chunk_embeddings, namespace="designs")
    print(f"Stored {len(chunks)} chunks for design {design_id}")


def retrieve_full_design(query, index):
    """Finds the best-matching design and reconstructs its full text."""
    response = client.embeddings.create(model="text-embedding-ada-002", input=query)
    query_embedding = response.data[0].embedding

    query_index_results = index.query(
        vector=query_embedding,
        top_k=5,
        namespace="designs",
        include_metadata=True,
        filter={"is_first_chunk": True},
    )

    if not query_index_results["matches"]:
        return None

    print("Length of query_index_results", len(query_index_results["matches"]))

    # print("query_index_results", query_index_results["matches"])

    # Select the best-matching design
    selected_match = query_index_results["matches"][0]
    record_id = selected_match["id"]

    matched_design_id = selected_match["metadata"]["design_id"]
    print(f"Matched Design ID: {matched_design_id}")

    # Retrieve all chunks for the matched design
    full_results = index.query(
        id=record_id,
        top_k=1000,
        include_metadata=True,
        namespace="designs",
        filter={"design_id": {"$eq": matched_design_id}},
    )

    # Sort by chunk_id to reconstruct text properly
    sorted_chunks = sorted(
        full_results["matches"], key=lambda x: x["metadata"]["chunk_id"]
    )

    print(f"Retrieved {len(sorted_chunks)} chunks for designs related to {record_id}")

    # Reconstruct full text
    full_text = " ".join([chunk["metadata"]["text"] for chunk in sorted_chunks])

    return full_text


def create_prompt(context, prompt_text):

    messages = [
        {
            "role": "system",
            "content": f"""You are a world-class product designer working at the most prestigious design company, known for employing the world's most creative minds. 
            
            Your role is to generate accurate, visually balanced, and constraint-aware designs. Your designs must always align with the user's needs and adhere strictly to the provided context.

            ** --CONTEXT START-- **  
            {context}  
            ** --CONTEXT END-- **

            **Instructions:**
            - **ONLY** modify the provided context if the user requests a change.
            - **DO NOT** add any explanations or comments.
            - You should only return your response in the minified JSON format without any Markdown formatting.
            - **DO NOT** add Markdown formatting to the JSON output.
            """,
        },
        {"role": "user", "content": prompt_text},
    ]

    return messages


def generate_design(messages, file_path="design_response.json"):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        temperature=0.2,  # creativity is important
        # stream=True,  # Enable streaming for long responses
    )

    print(response)
    print("separator")

    # last_chars = deque(maxlen=1000)  # Rolling buffer for last 1000 characters

    # while True:
    #     response = client.chat.completions.create(
    #         model="gpt-4o",
    #         messages=messages,
    #         temperature=0.2,  # creativity is important
    #         # stream=True,  # Enable streaming for long responses
    #     )

    #     print(response)
    #     print("separator")
    #     # print(response.choices[0].message.content)
    #     # write the response to a json file

    #     # with open(file_path, "a", encoding="utf-8") as file:
    #     #     for chunk in response:
    #     #         print("chunk", type(chunk))
    #     #         print("chunk", chunk)
    #     #         if chunk.choices[0].delta.content:
    #     #             chunk_text = chunk.choices[0].delta.content

    #     #             # Write chunk to file
    #     #             file.write(chunk_text)

    #     #             # Update rolling buffer with new characters
    #     #             last_chars.extend(chunk_text)

    #     #     # Check if response was cut off
    #     #     if chunk.choices[0].finish_reason == "length":
    #     #         print("Response was truncated. Sending follow-up request...")

    #     #         # Get last 1000 characters
    #     #         last_part = "".join(last_chars)

    #     #         # Append to messages to continue response
    #     #         messages.append({"role": "assistant", "content": last_part})
    #     #         messages.append(
    #     #             {
    #     #                 "role": "user",
    #     #                 "content": "Continue generating the JSON, but do NOT repeat any part of the previous response.",
    #     #             }
    #     #         )
    #     #     else:
    #     #         break  # Exit loop if response is complete

    # Get the LLM response (assuming it's in JSON string format)
    raw_text = response.choices[0].message.content

    print("raw_text", raw_text)

    try:
        json_data = json.loads(raw_text)  # Parse string into JSON
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
        exit(1)  # Handle invalid JSON

    # Save as a properly formatted JSON file
    with open("final_design.json", "w") as file:
        json.dump(json_data, file, indent=4)


def main(action, design_id=None):
    # Create an index for storing design embeddings
    index = create_or_retrieve_index(index_name)

    if not index:
        print("Index creation or retrieval failed.")
        return

    if action == "store":
        # create embeddings for the design description and sample text
        embedding_text = create_embedding_text()

        print("length of embedding text", len(embedding_text))

        # Store the design description in Pinecone
        store_design_in_pinecone(design_id, embedding_text, index)

    else:

        # Query text
        # prompt = "Design a modern, responsive navbar for an accessibility compliance landing page. The background should be white for a clean look, with black text to ensure high readability. Include a logo on the left, three navigation links (Home, Company, About Us) in the center, and a clearly distinguishable 'Contact Us' button on the right. Ensure the design follows accessibility best practices, such as sufficient contrast, appropriate font sizes, and proper spacing for easy navigation."

        prompt = "Design a modern, responsive navbar for a revenue management website."
        # prompt = "Design a modern, responsive navbar for a revenue management website. The navbar's background should be #E6C8E9, creating a professional and trustworthy appearance, with black text for clear readability. The top border should maintain its assigned linear gradient, and any frames with rounded corners should retain their white background. The design should feature a logo on the left, four navigation links (Blog, White Paper, Docs, About) separated by 30px and centered, and a call-to-action text—'Sign In' followed by a right arrow icon**—aligned to the right**. Ensure the design adheres to accessibility best practices, including proper contrast, readable font sizes, and adequate spacing for easy navigation."
        # Retrieve the full design based on a query
        context = retrieve_full_design(prompt, index)

        if context:
            print("Retrieved Design:")
            print("length of context", len(context))
            messages = create_prompt(context, prompt)

            # print("messages", messages)
            generate_design(messages)
            print("Design generated successfully.")
        else:
            print("No matching design found.")


main("get", design_id="revenue_collection_landing_page_navbar")
