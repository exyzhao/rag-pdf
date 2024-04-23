import argparse
import os

from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from dataclasses import dataclass
from langchain.vectorstores.chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

CHROMA_PATH = "chroma"

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

app = Flask(__name__)
CORS(app, origins="*")

@app.route('/')
def index():
    return "Hello World"

@app.route('/api/messages', methods=['POST'])
def get_response():
    # Temp query text
    question = request.json.get('question')
    query_text = question

    # Prepare the DB
    embedding_function = OpenAIEmbeddings()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Search the DB
    results = db.similarity_search_with_relevance_scores(query_text, k=3)
    if len(results) == 0 or results[0][1] < 0.7:
        return jsonify({'response': "Unable to find matching results"}, {'sources': ""})

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)

    model = ChatOpenAI()
    response_text = model.invoke(prompt)

    if len(str(response_text).split("content='")) <= 1:
        return jsonify({'response': "Unable to find matching results"}, {'sources': ""})

    # String manipulation to strip response of metadata
    content_part = str(response_text).split("content='")[1]
    content = content_part.split("'")[0]

    sources = [doc.metadata.get("source", None) for doc, _score in results][0]

    return jsonify({'response': content}, {'sources': str(sources)})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)