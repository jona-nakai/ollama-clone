import { useEffect, useRef, useState } from 'react';
import './app.css'

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

  // function for sending a message to the computer and updating setMessages
  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    // updating setMessages with user message
    const userMessage = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // updating setMessages with bot message
    // wait 300 milliseconds and then send the response
    setTimeout(() => {
      const botMessage = { id: Date.now(), role: 'bot', text: `You said ${text}` };
      setMessages(prev => [...prev, botMessage]);
    }, 300);
  }

  return (
    <div className="chat">
      {/* message history */}
      <main className="chat__messages">
        {/* making every message in the messages array into a div */}
        {messages.map((m) => (
          <div key={m.id} className={`message-${m.role}`}>
            <div className="message__bubble">{m.text}</div>
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
        />
        {/* chat send button */}
        <button 
          className="chat__send"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          {/* Replace with arrow later */}
          Send
        </button>
      </footer>
    </div>
  );
};