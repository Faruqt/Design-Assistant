import tiktoken
import os


def calculate_token(text):
    enc = tiktoken.get_encoding("cl100k_base")
    tokens = enc.encode(text)

    print(f"Total tokens: {len(tokens)}")


with open("metadata.txt", "r") as file:
    sample_text = file.read()
    calculate_token(sample_text)


# def retrieve_full_design(query, index):
#     """Finds the best-matching design and reconstructs its full text."""
#     response = client.embeddings.create(model="text-embedding-ada-002", input=query)
#     query_embedding = response.data[0].embedding

#     query_index_results = index.query(
#         vector=query_embedding,
#         top_k=5,
#         namespace="designs",
#         filter={"is_first_chunk": True},
#     )

#     if not query_index_results["matches"]:
#         return None

#     print("Length of query_index_results", len(query_index_results["matches"]))

#     # Select the best-matching design
#     selected_match = query_index_results["matches"][0]
#     # print(f"Selected Match: {selected_match}")
#     record_id = selected_match["id"]
#     # matched_design_id = selected_match["metadata"]["design_id"]
#     # print(f"Matched Design ID: {matched_design_id}")

#     # Retrieve all chunks for the matched design
#     full_results = index.query(
#         id=record_id,
#         top_k=1000,
#         include_metadata=True,
#         namespace="designs",
#         # filter={"design_id": {"$eq": matched_design_id}},
#     )

#     # Sort by chunk_id to reconstruct text properly
#     sorted_chunks = sorted(
#         full_results["matches"], key=lambda x: x["metadata"]["chunk_id"]
#     )

#     print(f"Retrieved {len(sorted_chunks)} chunks for designs related to {record_id}")

#     # Reconstruct full text
#     full_text = " ".join([chunk["metadata"]["text"] for chunk in sorted_chunks])

#     return full_text
