import { useEffect, useRef, useState } from 'react';
import './Chatbot.scss';
import { MessageCircle, Send, X } from 'lucide-react';

function Chatbot() {
  const promptMessages = [
    'Haben Sie Fragen?',
    'Wie können wir helfen?',
    'Schnelle Hilfe zu Ihrem Projekt',
    'Infos zum Ablauf und zur Anfrage',
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hallo! Wie kann ich Ihnen helfen?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const messagesRef = useRef(null);

  useEffect(() => {
    const container = messagesRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setPromptIndex((currentIndex) => (currentIndex + 1) % promptMessages.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [isOpen, promptMessages.length]);

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
        aria-expanded={isOpen}
        aria-controls="chatbot-panel"
        aria-label="Chat öffnen"
      >
        {!isOpen ? (
          <span className="chatbot__teaser" aria-hidden="true">
            <span
              key={promptMessages[promptIndex]}
              className="chatbot__teaser-text"
            >
              {promptMessages[promptIndex]}
            </span>
          </span>
        ) : null}
        <span className="chatbot__toggle-icon">
          <MessageCircle size={26} strokeWidth={2.2} />
        </span>
      </button>

      <div className="chatbot__panel" aria-hidden={!isOpen} id="chatbot-panel">
        <div className="chatbot__header">
          <div className="chatbot__header-copy">
            <span className="chatbot__eyebrow">Prima Vista Support</span>
            <strong>Wie können wir helfen?</strong>
            <span>Schnelle Hilfe zu Leistungen, Ablauf und Ihrer Anfrage.</span>
          </div>

          <button
            className="chatbot__close"
            onClick={() => setIsOpen(false)}
            type="button"
            aria-label="Chat schließen"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
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
            {loading ? '...' : <Send size={16} strokeWidth={2.4} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
