import OpenAI from 'openai';
import process from 'process';

const systemMessage = {
  role: 'system',
  content:
    'You are a helpful assistant for Trockenbau Prima Vista in Frankfurt. Answer in German. Be concise, professional, and guide users toward contacting the company for quotes or project inquiries. Services include Trockenbau, Sanierung und Renovierung, Fenster, and Innenausbau.',
};

export const handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({
          reply: 'Methode nicht erlaubt.',
        }),
      };
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY');

      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: 'Der Chat ist momentan nicht verfügbar. Bitte kontaktieren Sie uns direkt.',
        }),
      };
    }

    const parsedBody = JSON.parse(event.body || '{}');
    const messages = Array.isArray(parsedBody.messages) ? parsedBody.messages : null;

    if (!messages || messages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          reply: 'Bitte senden Sie eine gültige Nachricht.',
        }),
      };
    }

    const sanitizedMessages = messages
      .filter(
        (message) =>
          message &&
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string'
      )
      .slice(-12);

    if (sanitizedMessages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          reply: 'Bitte senden Sie eine gültige Nachricht.',
        }),
      };
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        systemMessage,
        ...sanitizedMessages,
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: completion.choices[0].message.content,
      }),
    };
  } catch (error) {
    console.error('Chat function error', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: 'Es gab einen Fehler. Bitte versuchen Sie es später erneut.',
      }),
    };
  }
};
