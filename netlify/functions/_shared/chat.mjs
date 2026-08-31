import OpenAI from 'openai';

let openaiClient = null;
const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 1200;
const MAX_TOTAL_CHARS = 6000;
const DEFAULT_OPENAI_TIMEOUT_MS = 12000;
const DEFAULT_MAX_TOKENS = 500;
const CHAT_BUSINESS_NAME = 'Trockenbau PrimaVista Schweiz';

const getOpenAIClient = () => {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return openaiClient;
};

const systemMessage = {
  role: 'system',
  content:
    `You are a helpful assistant for ${CHAT_BUSINESS_NAME}, operated by Prima Vista B&G GmbH in Emmenbruecke, Switzerland. Answer in German. Be concise, professional, and guide users toward contacting the company for quotes or project inquiries. Core services are Trockenbau, Innenausbau and Renovationen. The main service area is Luzern and Central Switzerland, with projects also accepted in Zurich and the surrounding area. Personal consultations and appointments are by prior arrangement.`,
};

export class ChatRequestError extends Error {
  constructor(status, message, reply) {
    super(message);
    this.name = 'ChatRequestError';
    this.status = status;
    this.reply = reply;
  }
}

const sanitizeMessages = (messages) =>
  messages
    .filter(
      (message) =>
        message
        && (message.role === 'user' || message.role === 'assistant')
        && typeof message.content === 'string',
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_CHARS),
    }))
    .filter((message) => message.content)
    .slice(-MAX_MESSAGES);

const parsePositiveInteger = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const createTimeoutController = () => {
  const controller = new AbortController();
  const timeoutMs = parsePositiveInteger(
    process.env.OPENAI_TIMEOUT_MS,
    DEFAULT_OPENAI_TIMEOUT_MS,
  );
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
};

export const buildChatReply = async (messages) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new ChatRequestError(400, 'Missing messages payload.', 'Bitte senden Sie eine gültige Nachricht.');
  }

  const sanitizedMessages = sanitizeMessages(messages);

  if (sanitizedMessages.length === 0) {
    throw new ChatRequestError(400, 'No valid messages after sanitization.', 'Bitte senden Sie eine gültige Nachricht.');
  }

  const totalCharacters = sanitizedMessages.reduce(
    (total, message) => total + message.content.length,
    0,
  );

  if (totalCharacters > MAX_TOTAL_CHARS) {
    throw new ChatRequestError(
      413,
      'Chat payload too large.',
      'Ihre Nachricht ist zu lang. Bitte kürzen Sie die Anfrage etwas.',
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new ChatRequestError(
      500,
      'Missing OPENAI_API_KEY.',
      'Der Chat ist momentan nicht verfügbar. Bitte kontaktieren Sie uns direkt.',
    );
  }

  const timeoutController = createTimeoutController();

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        systemMessage,
        ...sanitizedMessages,
      ],
      max_tokens: parsePositiveInteger(process.env.OPENAI_MAX_TOKENS, DEFAULT_MAX_TOKENS),
      temperature: 0.3,
    }, {
      signal: timeoutController.signal,
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error('No reply returned from OpenAI.');
    }

    return reply;
  } catch (error) {
    const isAbortError = error instanceof Error && error.name === 'AbortError';

    throw new ChatRequestError(
      isAbortError ? 504 : 500,
      error instanceof Error ? error.message : 'OpenAI request failed.',
      isAbortError
        ? 'Der Chat braucht gerade zu lange. Bitte versuchen Sie es gleich erneut.'
        : 'Es gab einen Fehler. Bitte versuchen Sie es später erneut.',
    );
  } finally {
    timeoutController.clear();
  }
};
