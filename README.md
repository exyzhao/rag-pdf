# Retrieval-Augmented Generation for PDF

Fullstack application that uses OpenAI's API to answer questions based on the Startup Playbook by Sam Altman.


## Setup

### Backend

Install backend dependencies.

```python
cd backend
pip install -r requirements.txt
```

Create a .env file for your OpenAI API key.

```python
touch .env
```

In the `.env` file, paste in your key like so:
```python
OPENAI_API_KEY=<your-api-key-here>
```

Create the Chroma DB.

```python
python3 create_database.py
```

Start the query server.

```python
python3 query_data.py
```

To answer questions about a different PDF, replace the PDF stored in `data/Startup Playbook.pdf` and rebuild the Chroma DB.

### Frontend

Starting back at the root, install frontend dependencies.

```python
cd frontend
npm install
```

Start the React app.

```python
npm start
```


## Technologies Used

- Langchain and Chroma are used to parse, store, and query data from the PDF, with embeddings from OpenAI.
- The backend is served with Flask.
- The frontend is built with React, with styling in MaterialUI.

## Assumptions and Limitations

- Since the goal is to "ask questions to a document," one major assumption I made is that queries are independent questions that do not build off of one another, which is also less resource intensive, with only a single answer needing to be stored at a time for a given user. To reflect this, I made the chat interface not store previous answers but still store previous questions for quick access.

- Another assumption I made was that this was a proof of concept of a PDF querier, and would not be deployed at scale without changes such as caching answers or optimizing how requests are handled from multiple users. Following the advice of Paul Graham, this is "doing something that doesn't scale" to test usage.

- I deployed the application on Render, but found that since I'm on the free tier, the backend needs at least 50 seconds to wake up from inactivity, leading to high latency responses and even timing out. Since local deployment only needs around ~2.5s to generate responses, I've only published this repository.

- If I had more time, I'd scope the next feature depending on the users - either including a page and line number in the source cited, allowing for multiple PDFs, or allowing for upload of a PDF. This would depend on the use case; e.g., a researcher would likely prioritize seeing page/line numbers to quick filter through a source, whereas a student writing an essay may prefer to be able to upload mulitple PDFs to synthesize information.
