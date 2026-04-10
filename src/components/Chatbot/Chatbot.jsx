import { useEffect, useId, useRef, useState } from 'react';
import './Chatbot.scss';
import { MessageCircle, Send, X } from 'lucide-react';

const createMessage = (role, content) => ({
  id:
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
  role,
  content,
});

function Chatbot() {
  const panelId = useId();
  const inputId = useId();
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [messages, setMessages] = useState([
    createMessage('assistant', 'Hallo! Wie kann ich Ihnen helfen?'),
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const container = messagesRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isOpen, loading]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const updateViewport = () => {
      if (!window.visualViewport) {
        document.documentElement.style.setProperty('--chatbot-vh', `${window.innerHeight}px`);
        return;
      }

      const viewportHeight = window.visualViewport.height;
      const layoutHeight = window.innerHeight;
      const keyboardLikelyOpen = layoutHeight - viewportHeight > 120;

      document.documentElement.style.setProperty('--chatbot-vh', `${viewportHeight}px`);
      setIsKeyboardOpen(keyboardLikelyOpen);
    };

    updateViewport();

    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    window.visualViewport?.addEventListener('resize', updateViewport);
    window.visualViewport?.addEventListener('scroll', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      window.visualViewport?.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('scroll', updateViewport);
    };
  }, []);

  const sendMessage = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || loading) {
      return;
    }

    const userMessage = createMessage('user', trimmedInput);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      const reply =
        typeof data?.reply === 'string' && data.reply.trim()
          ? data.reply.trim()
          : 'Keine Antwort erhalten. Bitte später erneut versuchen.';

      setMessages((prev) => [...prev, createMessage('assistant', reply)]);
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage('assistant', 'Fehler. Bitte später erneut versuchen.'),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage();

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const closeChat = () => {
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div
      className={`chatbot${isOpen ? ' chatbot--open' : ''}${
        isKeyboardOpen ? ' chatbot--keyboard-open' : ''
      }`}
    >
      <button
        className="chatbot__toggle"
        onClick={toggleChat}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? 'Chat schließen' : 'Chat öffnen'}
      >
        <span className="chatbot__toggle-icon">
          <MessageCircle size={26} strokeWidth={2.2} />
        </span>
      </button>

      {isOpen ? (
        <div
          className="chatbot__panel"
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${panelId}-title`}
        >
          <div className="chatbot__header">
            <div className="chatbot__header-copy">
              <span className="chatbot__eyebrow">Prima Vista Support</span>
              <strong id={`${panelId}-title`}>Wie können wir helfen?</strong>
              <span>Schnelle Hilfe zu Leistungen, Ablauf und Ihrer Anfrage.</span>
            </div>

            <button
              className="chatbot__close"
              onClick={closeChat}
              type="button"
              aria-label="Chat schließen"
            >
              <X size={18} strokeWidth={2.4} />
            </button>
          </div>

          <div
            className="chatbot__messages"
            ref={messagesRef}
            aria-live="polite"
            aria-label="Chatverlauf"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot__message chatbot__message--${msg.role}`}
              >
                {msg.content}
              </div>
            ))}

            {loading ? (
              <div className="chatbot__message chatbot__message--assistant chatbot__message--typing">
                <span className="chatbot__typing" aria-label="Antwort wird geladen">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            ) : null}
          </div>

          <form className="chatbot__input" onSubmit={handleSubmit}>
            <label className="chatbot__sr-only" htmlFor={inputId}>
              Nachricht schreiben
            </label>

            <input
              id={inputId}
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Nachricht schreiben..."
              autoComplete="off"
              enterKeyHint="send"
            />

            <button
              disabled={loading || !input.trim()}
              type="submit"
              aria-label="Nachricht senden"
            >
              <Send size={16} strokeWidth={2.4} />
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export default Chatbot;
