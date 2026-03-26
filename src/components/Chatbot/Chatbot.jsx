import { useEffect, useRef, useState } from 'react';
import './Chatbot.scss';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hallo! Wie kann ich Ihnen helfen?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    const container = messagesRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Fehler. Bitte später erneut versuchen.' },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className={`chatbot${isOpen ? ' chatbot--open' : ''}`}>
      <button
        className="chatbot__toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        {isOpen ? 'Chat schliessen' : 'Chat starten'}
      </button>

      <div className="chatbot__panel" aria-hidden={!isOpen}>
        <div className="chatbot__header">
          <strong>Prima Vista Chat</strong>
          <span>Schnelle Hilfe zu Leistungen und Anfrage</span>
        </div>

        <div className="chatbot__messages" ref={messagesRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot__message chatbot__message--${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="chatbot__input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Nachricht schreiben..."
          />
          <button onClick={sendMessage} disabled={loading} type="button">
            {loading ? '...' : 'Senden'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
