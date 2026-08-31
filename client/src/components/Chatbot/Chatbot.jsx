import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Paperclip,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import './Chatbot.scss';
import { logoSmall } from '../../assets/responsiveImages';
import { getApiUrl } from '../../utils/api';
import { businessProfile } from '../../config/businessProfile';

const GREETING =
  `Guten Tag und herzlich willkommen bei ${businessProfile.publicName}. Ich bin Ihr Trockenbau-Concierge. Erzählen Sie uns kurz von Ihrem Vorhaben, oder wählen Sie unten ein Thema.`;

const suggestions = [
  'Trockenbau anfragen',
  'Kosten grob kalkulieren',
  'Dachschrägen ausbauen',
  'Mit PrimaVista sprechen',
];

const CHAT_SCROLL_IDLE_MS = 5000;

const createMessage = (role, content) => ({
  id:
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
  role,
  content,
});

const getRouteMain = () => document.querySelector('main');

const getTopContentBlock = () => {
  const firstChild = getRouteMain()?.firstElementChild;
  return firstChild instanceof HTMLElement ? firstChild : null;
};

function useChatScrollWindow(open, onLeaveWindow) {
  const { pathname } = useLocation();
  const [canShowLauncher, setCanShowLauncher] = useState(false);
  const [canShowPreview, setCanShowPreview] = useState(false);
  const openRef = useRef(open);
  const onLeaveWindowRef = useRef(onLeaveWindow);

  useEffect(() => {
    openRef.current = open;
    onLeaveWindowRef.current = onLeaveWindow;
  }, [open, onLeaveWindow]);

  useEffect(() => {
    let raf = 0;
    let idleTimer = 0;

    const isEligible = () => {
      const topBlock = getTopContentBlock();
      const footer = document.querySelector('.footer');
      const header = document.querySelector('.navbar');
      const headerOffset = header?.getBoundingClientRect().height ?? 0;

      const passedTopBlock = topBlock
        ? topBlock.getBoundingClientRect().bottom <= headerOffset + 16
        : window.scrollY > Math.round(window.innerHeight * 0.7);
      const beforeFooter = footer
        ? footer.getBoundingClientRect().top > window.innerHeight - 24
        : true;

      return passedTopBlock && beforeFooter;
    };

    const clearIdleTimer = () => {
      if (!idleTimer) {
        return;
      }

      window.clearTimeout(idleTimer);
      idleTimer = 0;
    };

    const update = () => {
      raf = 0;
      clearIdleTimer();

      const eligible = isEligible();

      if (!eligible) {
        setCanShowLauncher(false);
        setCanShowPreview(false);
        if (openRef.current) {
          onLeaveWindowRef.current();
        }
        return;
      }

      setCanShowLauncher(true);
      setCanShowPreview(false);

      idleTimer = window.setTimeout(() => {
        idleTimer = 0;
        const stillEligible = isEligible();
        setCanShowLauncher(stillEligible);
        setCanShowPreview(stillEligible);
        if (!stillEligible && openRef.current) {
          onLeaveWindowRef.current();
        }
      }, CHAT_SCROLL_IDLE_MS);
    };

    const schedule = () => {
      if (raf) {
        return;
      }

      raf = window.requestAnimationFrame(update);
    };

    const initial = window.setTimeout(update, 80);
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.clearTimeout(initial);
      clearIdleTimer();
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  return { canShowLauncher, canShowPreview };
}

function useLauncherAvoidance(enabled) {
  const { pathname } = useLocation();
  const [shouldAvoid, setShouldAvoid] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let raf = 0;
    const interactiveSelector = 'a[href], button, input, select, textarea, [role="button"]';

    const update = () => {
      raf = 0;
      const launcherButton = document.querySelector('.chatbot-launcher .chatbot-launcher__button');

      if (!launcherButton) {
        setShouldAvoid(false);
        return;
      }

      const rect = launcherButton.getBoundingClientRect();
      const previousPointerEvents = launcherButton.style.pointerEvents;
      launcherButton.style.pointerEvents = 'none';

      const inset = 6;
      const points = [
        [rect.left + rect.width / 2, rect.top + rect.height / 2],
        [rect.left + inset, rect.top + rect.height / 2],
        [rect.right - inset, rect.top + rect.height / 2],
        [rect.left + rect.width / 2, rect.top + inset],
        [rect.left + rect.width / 2, rect.bottom - inset],
      ];

      const hasInteractiveUnderButton = points.some(([x, y]) => {
        const target = document.elementFromPoint(x, y);
        const interactive = target?.closest(interactiveSelector);
        return Boolean(interactive && !interactive.closest('.chatbot-launcher'));
      });

      launcherButton.style.pointerEvents = previousPointerEvents;
      setShouldAvoid(hasInteractiveUnderButton);
    };

    const schedule = () => {
      if (raf) {
        return;
      }

      raf = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const timer = window.setInterval(schedule, 1000);

    return () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
      window.clearInterval(timer);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [enabled, pathname]);

  return enabled ? shouldAvoid : false;
}

function Avatar() {
  return (
    <span className="chatbot-avatar" aria-hidden="true">
      <img src={logoSmall} alt="" width="96" height="96" loading="lazy" />
    </span>
  );
}

function Eyebrow({ children, dark = false }) {
  return (
    <span className={`chatbot-eyebrow${dark ? ' chatbot-eyebrow--dark' : ''}`}>
      {children}
    </span>
  );
}

function BrandRail({ onClose }) {
  return (
    <aside className="chatbot-rail" aria-label={`${businessProfile.publicName} Trockenbau-Concierge`}>
      <Link className="chatbot-rail__brand" to="/" onClick={onClose} aria-label={`${businessProfile.publicName} Startseite`}>
        <img src={logoSmall} alt="" width="96" height="96" />
        <span>
          <strong>Trockenbau</strong>
          <small>PrimaVista Schweiz</small>
        </span>
      </Link>

      <div className="chatbot-rail__intro">
        <Eyebrow dark>Trockenbau-Concierge</Eyebrow>
        <h2>Ein Kontakt,<br />der zuhört.</h2>
        <p>
          Erzählen Sie uns von Decken, Wänden, Estrich-Boden oder Dachschrägen.
          Wir ordnen Ihr Vorhaben ein und zeigen den nächsten sinnvollen Schritt.
        </p>
      </div>

      <div className="chatbot-rail__proof">
        <span><Clock aria-hidden="true" /> Antwort meist sofort</span>
        <span><Calendar aria-hidden="true" /> Anfrage direkt vorbereiten</span>
        <span><ShieldCheck aria-hidden="true" /> Saubere Ausführung und klare Kalkulation</span>
      </div>

      <address className="chatbot-rail__contact">
        <a href="tel:+41782659332"><Phone aria-hidden="true" /> +41 78 265 93 32</a>
        <a href="mailto:info@trockenbau-primavista.ch"><Mail aria-hidden="true" /> info@trockenbau-primavista.ch</a>
        <span><MapPin aria-hidden="true" /> Emmenbrücke · Schweiz</span>
      </address>
    </aside>
  );
}

function ChatHeader({ onClose }) {
  return (
    <header className="chatbot-panel__header">
      <Avatar />
      <div className="chatbot-panel__title">
        <strong>Trockenbau-Concierge</strong>
        <small><span aria-hidden="true" /> Online · Antwort &lt; 5 Min</small>
      </div>
      <Link className="chatbot-panel__human" to="/kontakt" onClick={onClose}>
        <UserRound aria-hidden="true" />
        Mit Mensch sprechen
      </Link>
      <button
        type="button"
        className="chatbot-panel__close"
        onClick={onClose}
        aria-label="Chat schließen"
      >
        <X aria-hidden="true" />
      </button>
    </header>
  );
}

function WelcomeBlock() {
  return (
    <div className="chatbot-welcome">
      <Eyebrow>Willkommen</Eyebrow>
      <h2>Guten Tag.</h2>
      <p>
        Wählen Sie ein Thema oder schreiben Sie frei. Je konkreter Raum, Fläche
        und Leistung sind, desto präziser kann der Concierge einordnen.
      </p>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="chatbot-typing" aria-label="Antwort wird geladen">
      <span />
      <span />
      <span />
    </span>
  );
}

function Chatbot() {
  const panelId = useId();
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [previewDismissed, setPreviewDismissed] = useState(false);
  const [messages, setMessages] = useState([
    createMessage('assistant', GREETING),
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    inputRef.current?.blur();
  }, []);

  const { canShowLauncher, canShowPreview } = useChatScrollWindow(isOpen, closeChat);
  const shouldAvoidLauncher = useLauncherAvoidance(canShowLauncher && !isOpen);

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

    document.body.classList.add('chatbot-open');
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 160);

    return () => {
      document.body.classList.remove('chatbot-open');
      window.clearTimeout(timer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeChat, isOpen]);

  const sendMessage = async (value = input) => {
    const trimmedInput = value.trim();

    if (!trimmedInput || loading) {
      return;
    }

    const userMessage = createMessage('user', trimmedInput);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/chat'), {
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
        createMessage(
          'assistant',
          'Der Chat ist momentan nicht verfügbar. Bitte kontaktieren Sie uns direkt unter info@trockenbau-primavista.ch oder +41 78 265 93 32.',
        ),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage();
  };

  const handleTextareaKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen ? (
        <div
          className={`chatbot-launcher${canShowLauncher ? ' is-visible' : ''}${shouldAvoidLauncher ? ' is-avoiding' : ''}`}
          aria-hidden={!canShowLauncher}
        >
          {canShowPreview && !previewDismissed ? (
            <div
              role="button"
              tabIndex={0}
              className="chatbot-preview"
              aria-label="Trockenbau-Concierge öffnen"
              onClick={() => setIsOpen(true)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') {
                  return;
                }

                event.preventDefault();
                setIsOpen(true);
              }}
            >
              <button
                type="button"
                className="chatbot-preview__close"
                aria-label="Hinweis schließen"
                onClick={(event) => {
                  event.stopPropagation();
                  setPreviewDismissed(true);
                }}
              >
                <X aria-hidden="true" />
              </button>
              <Avatar />
              <span>
                <strong>Trockenbau-Concierge</strong>
                <small>Guten Tag, erzählen Sie uns kurz von Ihrem Projekt?</small>
              </span>
            </div>
          ) : null}

          <button
            className="chatbot-launcher__button"
            type="button"
            aria-label="Trockenbau-Concierge starten"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen(true)}
            disabled={!canShowLauncher}
          >
            <MessageCircle aria-hidden="true" />
            <span>Concierge</span>
            <b aria-hidden="true">1</b>
          </button>
        </div>
      ) : null}

      {isOpen && canShowLauncher ? (
        <div
          className="chatbot-panel"
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label={`Trockenbau-Concierge von ${businessProfile.publicName}`}
        >
          <BrandRail onClose={closeChat} />
          <section className="chatbot-panel__main">
            <ChatHeader onClose={closeChat} />

            <div
              className="chatbot-panel__messages"
              ref={messagesRef}
              aria-live="polite"
              aria-label="Chatverlauf"
            >
              {messages.length === 1 ? <WelcomeBlock /> : null}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chatbot-message chatbot-message--${msg.role}`}
                >
                  {msg.role === 'assistant' ? <Avatar /> : null}
                  <div className="chatbot-message__bubble">
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="chatbot-message chatbot-message--assistant">
                  <Avatar />
                  <div className="chatbot-message__bubble chatbot-message__bubble--typing">
                    <TypingDots />
                  </div>
                </div>
              ) : null}
            </div>

            {messages.length === 1 ? (
              <div className="chatbot-panel__suggestions" aria-label="Themenvorschläge">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    disabled={loading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}

            <form className="chatbot-panel__form" onSubmit={handleSubmit}>
              <div className="chatbot-panel__composer">
                <button
                  className="chatbot-panel__attach"
                  type="button"
                  aria-label="Foto anhängen"
                  title="Foto anhängen"
                  disabled={loading}
                >
                  <Paperclip aria-hidden="true" />
                </button>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="Schreiben Sie uns..."
                  rows="1"
                  disabled={loading}
                  aria-label="Nachricht schreiben"
                />
                <button
                  className="chatbot-panel__send"
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Nachricht senden"
                >
                  <span>Senden</span>
                  <Send aria-hidden="true" />
                </button>
              </div>
            </form>

            <p className="chatbot-panel__footnote">
              <Lock aria-hidden="true" />
              Verschlüsselt und vertraulich · Sie sprechen mit dem PrimaVista Schweiz Team
            </p>
          </section>
        </div>
      ) : null}
    </>
  );
}

export default Chatbot;
