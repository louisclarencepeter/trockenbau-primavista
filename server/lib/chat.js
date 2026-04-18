import OpenAI from 'openai';
import process from 'process';

const systemMessage = {
  role: 'system',
  content:
    'You are a helpful assistant for Prima Vista B&G GmbH in Emmenbruecke, Switzerland. Answer in German. Be concise, professional, and guide users toward contacting the company for quotes or project inquiries. Services include Trockenbau, Sanierung und Renovierung, Fenster and Innenausbau.',
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
    .slice(-12);

export const buildChatReply = async (messages) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new ChatRequestError(400, 'Missing messages payload.', 'Bitte senden Sie eine gültige Nachricht.');
  }

  const sanitizedMessages = sanitizeMessages(messages);

  if (sanitizedMessages.length === 0) {
    throw new ChatRequestError(400, 'No valid messages after sanitization.', 'Bitte senden Sie eine gültige Nachricht.');
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new ChatRequestError(
      500,
      'Missing OPENAI_API_KEY.',
      'Der Chat ist momentan nicht verfügbar. Bitte kontaktieren Sie uns direkt.',
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        systemMessage,
        ...sanitizedMessages,
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error('No reply returned from OpenAI.');
    }

    return reply;
  } catch (error) {
    throw new ChatRequestError(
      500,
      error instanceof Error ? error.message : 'OpenAI request failed.',
      'Es gab einen Fehler. Bitte versuchen Sie es später erneut.',
    );
  }
};
