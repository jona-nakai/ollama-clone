# ollama-clone

## Prerequisites
- Python 3.10+
- Node.js 20+ and npm
- Ollama installed and running locally
  - Install: https://ollama.com
  - Start server: `ollama serve` (defaults to http://localhost:11434)
  - Pull model: `ollama pull llama3.1:8b`

## Run Project

1. Clone the server repository:

```bash
git clone <repository-url>
cd ollama-clone
```

2. Create python virtual envrionment to run backend

```bash
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

3. Start backend API

```bash
uvicorn main:app --reload --port 8000
```

4. (Optional) In a new terminal, run for health check

```bash
curl http://localhost:8000/ping
# -> {"ok": true}
```

5. In a new terminal, install frontend dependencies

```bash
cd frontend
npm install
```

6. Run dev

```bash
npm run dev
```