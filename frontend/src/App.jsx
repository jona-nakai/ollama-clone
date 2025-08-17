import { useEffect, useRef, useState } from 'react';
import './App.css'
import arrowImage from './assets/arrow.png';

export default function App() {
  // initialize message history and current user input
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  // create so we can point to the bottom of the chat history
  // ex: scroll to the bottom when a new chat is sent
  const endRef = useRef(null);

  // if messages is different compared to the last render, scroll to the bottom (endRef)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages]);

  // listening for enter key to send message
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // handle text input area resizing
  const handleTextareaResize = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 195) + 'px'
  }

  // function for sending a message to the computer and updating setMessages
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    // updating setMessages with user message
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

   try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.1:8b',
          messages: [...messages, userMessage]
        })
      });

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }

      // Ollama /api/chat returns:
      // { "message": { "role": "assistant", "content": "..." }, ... }
      const data = await res.json() ?? { role: 'assistant', content: '(no reply)' };
      const botMessage = data.message ?? { role: 'assistant', content: '(no reply)' };

      setMessages(prev => [...prev, botMessage]);
   } catch(err) {
      const errorMessage = {role: 'assistant', content: `Error: ${err.message}`};
      setMessages(prev => [...prev, errorMessage]);
   }
  }

  return (
    <div className="chat">
      {/* message history */}
      <main className="chat__messages">
        {/* making every message in the messages array into a div */}
        {messages.map((m, i) => (
          <div key={i} className={`message-${m.role}`}>
            <div className="message__bubble">{m.content}</div>
          </div>
        ))}
        <div ref={endRef} />
      </main>

      <footer className="chat__inputbar">
        {/* chat input */}
        <textarea 
          className="chat__input"
          value={input}
          placeholder="Send a message"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onInput={handleTextareaResize}
          rows={1}
        />
        <div className="chat__buttons">
          <div className="chat__model">
            llama3
          </div>
          {/* chat send button */}
          <button 
            className="chat__send"
            onClick={sendMessage}
            disabled={!input.trim()}
          >
            <img className="arrow_image" src={arrowImage} />
          </button>
        </div>
      </footer>
    </div>
  );
};