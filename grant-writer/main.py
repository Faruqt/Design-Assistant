# import the required libraries
import os
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Retrieve the API key from the environment
API_KEY = os.environ.get("API_KEY")
PINE_CONE_API_KEY = os.environ.get("PINE_CONE_API_KEY")

# Create a Pinecone client
pc_client = Pinecone(api_key=PINE_CONE_API_KEY)

# Create a new deployment
client = OpenAI(
    api_key=API_KEY
)

# Create a pine cone index
index_name = "grant-application-index"

# Get the list of indexes
index_list = pc_client.list_indexes().indexes

print(index_list)

if index_list is None or len(index_list) == 0:
    print("Creating a new index")
    pc_client.create_index(name=index_name, dimension=1536, metric="cosine", spec=ServerlessSpec(cloud="aws", region="us-east-1") )
elif index_list is not None:
    for index in index_list:
        if index["name"] != index_name:
            print("Creating a new index")
            pc_client.create_index(name=index_name, dimension=1536, metric="cosine", spec=ServerlessSpec(cloud="aws", region="us-east-1") )
            break
        else:
            print("Index already exists")
            break

# Retrieve the index
index = pc_client.Index(index_name)

# Create embeddings for the prompt
sample_text = """
Subject: Grant Application for Clean Energy Development Fund 2025

Dear Grant Committee,

On behalf of ABC Innovations, we are pleased to submit our application for the Clean Energy Development Fund 2025. Our diverse experience and commitment to advancing renewable energy initiatives align seamlessly with the Fund's objectives.

1. **Describe your company’s mission and core activities.**

ABC Innovations is at the forefront of the renewable energy industry, dedicated to our mission of creating sustainable power solutions for rural communities. Since our inception, we have consistently focused on deploying efficient and affordable solar power systems to underserved regions. Our core activities include the development, installation, and maintenance of renewable energy systems specifically tailored to meet the unique needs of rural communities. Our dedication is evidenced by the successful deployment of solar systems to over 50 villages, positively impacting more than 10,000 lives. We take pride in our ability to deliver innovative solutions that not only provide immediate benefits but also foster long-term sustainability.

2. **How will this grant funding support your company’s growth?**

The Clean Energy Development Fund 2025 grant of $100,000 will be pivotal in scaling our operations and enhancing our impact on rural communities. The funding will enable ABC Innovations to expand our current projects by investing in research and development to optimize our solar technologies and improve their affordability and efficiency. Moreover, it will allow us to increase our outreach and operational framework to reach additional villages currently lacking access to reliable energy. The infusion of funds will also enhance our ability to train local technicians, ensuring communities gain more autonomy and contributing to local job creation and economic growth. Ultimately, this grant will be instrumental in accelerating our growth trajectory and broadening our impact.

3. **What is the potential impact of your project on the target communities?**

Our projects are specifically designed to address and solve energy access issues in the most underserved regions, fundamentally transforming these communities. With the support of the Clean Energy Development Fund 2025, ABC Innovations will be able to implement cutting-edge solar solutions that promise to elevate the quality of life, promote educational opportunities through reliable lighting, and improve health outcomes by reducing reliance on kerosene lamps and other hazardous energy sources. The grant will empower us to foster economic development within these rural areas by facilitating the establishment of small businesses and encouraging agricultural efficiency through powered equipment. By providing dependable and renewable energy, we aim to create an environment where these communities can thrive sustainably.

We are deeply appreciative of the committee's consideration and the opportunity presented by the Clean Energy Development Fund 2025. ABC Innovations is eager to continue driving positive change and delivering valuable contributions to renewable energy advancements in rural areas.

Thank you for considering our application. We look forward to the prospect of collaborating to further our shared vision of sustainable energy solutions for developing regions.

Sincerely,

Joshua Billing
CEO
ABC Innovations  
"""
response = client.embeddings.create(
    model="text-embedding-ada-002",
    input=sample_text
)
embedding = response.data[0].embedding

# Insert the data into the pine cone index
index.upsert(vectors = [{"id": "id1", "values": embedding, "metadata": {"text": sample_text}}], namespace="grant-application")


query_text = "New grant application for funding a renewable energy project."
query_response = client.embeddings.create(
    model="text-embedding-ada-002",
    input=query_text
)
query_embedding = query_response.data[0].embedding


print('mezzi')

# query the pine cone index for similar queries
query_index_results = index.query(vector=query_embedding, 
                        top_k=3, # return top 3 results
                        include_metadata=True, # include metadata in the response,
                        namespace="grant-application"
                        ) if index else None

# print(query_index_results)

# Step 5: Extract relevant context (metadata or text) from Pinecone results
# You can format the retrieved results into a context for the OpenAI API
context = "\n\n".join([match['metadata']['text'] for match in query_index_results.get('matches', [])])

print("context", context)

company_details = """
Company Name: Brighter Future Solar
Industry: Renewable Energy
Mission: To provide affordable and sustainable energy solutions to underserved communities.
Achievements: Winner of the 2024 Clean Energy Innovation Award.
Annual Revenue: $10.5 Billion
"""

grant_details = """
Grant Name: Solar Energy Innovation Fund
Objective: Supporting innovative renewable energy projects in developing regions.
Funding Amount: $250,000
Deadline: 2nd December 2025
Eligibility: Startups focused on sustainable energy solutions.
"""

questions = """
1. Describe your company’s mission and core activities.
2. How will this grant funding support your company’s growth?
3. What is the potential impact of your project on the target communities?
"""

prompt = f"""
Given the following examples of successful grant applications, as a professional grant application writer your task is to generate a draft grant application for the company below, answering the provided questions based on the company and grant details.

--- Context ---
{context}

--- Company Details: ---
{company_details}

--- Grant Details: ---
{grant_details}

--- Answer the following questions: ---
{questions}

Write in a formal, professional tone. Focus on the company's strengths and alignment with the grant objectives. Please generate a grant application draft of 300-500 words using the context and details provided.
"""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are an expert grant application writer."},
        {"role": "user", "content": prompt}
    ],
    max_tokens=500,
    temperature=0.2, # focus is on professional writing not creativity
)

print(response)
print("separator")
print(response.choices[0].message.content)
