from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from pydantic import BaseModel
from typing import Literal, List
import httpx

app = FastAPI()

# give permission to vite to make requests to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# define what role a message can come from
Role = Literal['system', 'user', 'assistant']

# define a chat message
class ChatMessage(BaseModel):
    role: Role
    content: str

# define a chat request
class ChatReq(BaseModel):
    model: str
    messages: List[ChatMessage]

# ping backend
@app.get("/ping")
def ping():
    return {'ok': True}

# api for sending and receiving message from ollama local api
@app.post("/chat")
async def chat(req: ChatReq):
    try:
        async with httpx.AsyncClient(timeout=90) as client:
            r = await client.post(
                "http://localhost:11434/api/chat",
                json={
                    "model": req.model, 
                    "messages": [m.model_dump() for m in req.messages], 
                    "stream": False}
            )
            r.raise_for_status()
            return r.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Ollama Error: {e}")