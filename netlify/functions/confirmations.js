import process from 'process';

const COMPANY_NAME = 'Trockenbau Prima Vista';
const COMPANY_EMAIL = 'info@trockenbau-primavista.ch';
const COMPANY_PHONE = '+41 78 265 93 32';
const COMPANY_WEBSITE = 'https://trockenbau-primavista.ch';

const getEnv = (name) => {
  const netlifyValue = globalThis.Netlify?.env?.get?.(name);

  if (typeof netlifyValue === 'string' && netlifyValue.length > 0) {
    return netlifyValue;
  }

  if (typeof process !== 'undefined' && typeof process.env?.[name] === 'string') {
    return process.env[name];
  }

  return '';
};

const isTruthy = (value) => ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const readText = (submission, key) => {
  const value = submission?.[key];

  return typeof value === 'string' ? value.trim() : '';
};

const buildContactSummary = (submission) => {
  const message = readText(submission, 'message') || 'Keine Nachricht angegeben.';

  return [
    ['Name', readText(submission, 'name')],
    ['E-Mail', readText(submission, 'email')],
    ['Telefon', readText(submission, 'phone') || 'Nicht angegeben'],
    ['Nachricht', message],
  ];
};

const buildAnfrageSummary = (submission) => {
  const addOns = readText(submission, 'add_ons') || 'keine';
  const message = readText(submission, 'message') || 'Keine zusätzliche Nachricht angegeben.';

  return [
    ['Name', readText(submission, 'name')],
    ['E-Mail', readText(submission, 'email')],
    ['Telefon', readText(submission, 'phone') || 'Nicht angegeben'],
    ['Postleitzahl', readText(submission, 'plz') || 'Nicht angegeben'],
    ['Leistung', readText(submission, 'service')],
    ['Extras', addOns],
    ['Raumgröße', readText(submission, 'room_size')],
    ['Zeitplan', readText(submission, 'zeitplan')],
    ['Nachricht', message],
  ];
};

const buildCalculatorSummary = (submission) => {
  const addOns = readText(submission, 'add_ons') || 'keine';
  const message = readText(submission, 'message') || 'Keine zusätzliche Nachricht angegeben.';

  return [
    ['Name', readText(submission, 'name')],
    ['E-Mail', readText(submission, 'email')],
    ['Telefon', readText(submission, 'phone') || 'Nicht angegeben'],
    ['Paket', readText(submission, 'package')],
    ['Raumgröße', readText(submission, 'room_size')],
    ['Menge', readText(submission, 'quantity')],
    ['Optionen', addOns],
    ['Material netto', readText(submission, 'material_net')],
    ['Montage netto', readText(submission, 'montage_net')],
    ['Zwischensumme netto', readText(submission, 'subtotal_net')],
    ['MwSt.', readText(submission, 'vat')],
    ['Gesamtsumme', readText(submission, 'total')],
    ['Zusammenfassung', readText(submission, 'summary')],
    ['Nachricht', message],
  ];
};

const buildSummaryMarkup = (rows) =>
  rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #d7d0c4;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #d7d0c4;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

const buildSummaryText = (rows) =>
  rows
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');

const getTemplates = (formName, submission) => {
  const customerName = readText(submission, 'name') || 'Guten Tag';

  if (formName === 'anfrage') {
    const summary = buildAnfrageSummary(submission);

    return {
      confirmation: {
        subject: 'Ihre Anfrage bei Trockenbau Prima Vista',
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1d232b;">
            <p>Hallo ${escapeHtml(customerName)},</p>
            <p>vielen Dank fuer Ihre Anfrage an ${COMPANY_NAME}. Ihre Angaben sind bei uns eingegangen.</p>
            <p>Wir pruefen Ihr Projekt und melden uns so schnell wie moeglich persoenlich bei Ihnen.</p>
            <table style="border-collapse:collapse;margin:24px 0;width:100%;max-width:680px;">
              ${buildSummaryMarkup(summary)}
            </table>
            <p>Bei Rueckfragen antworten Sie einfach auf diese E-Mail oder rufen Sie uns an: <a href="tel:${COMPANY_PHONE.replaceAll(' ', '')}">${COMPANY_PHONE}</a>.</p>
            <p>Freundliche Gruesse<br>${COMPANY_NAME}</p>
          </div>
        `,
        text: [
          `Hallo ${customerName},`,
          '',
          `vielen Dank fuer Ihre Anfrage an ${COMPANY_NAME}. Ihre Angaben sind bei uns eingegangen.`,
          'Wir pruefen Ihr Projekt und melden uns so schnell wie moeglich persoenlich bei Ihnen.',
          '',
          buildSummaryText(summary),
          '',
          `Rueckfragen: ${COMPANY_EMAIL} | ${COMPANY_PHONE}`,
        ].join('\n'),
      },
      internal: {
        subject: `Neue Anfrage (Assistent) von ${readText(submission, 'name') || readText(submission, 'email')}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1d232b;">
            <p>Es ist eine neue Anfrage ueber den Anfrageassistenten eingegangen.</p>
            <table style="border-collapse:collapse;margin:24px 0;width:100%;max-width:680px;">
              ${buildSummaryMarkup(summary)}
            </table>
          </div>
        `,
        text: [
          'Neue Anfrage ueber den Anfrageassistenten',
          '',
          buildSummaryText(summary),
        ].join('\n'),
      },
    };
  }

  if (formName === 'contact') {
    const summary = buildContactSummary(submission);

    return {
      confirmation: {
        subject: 'Ihre Anfrage bei Trockenbau Prima Vista',
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1d232b;">
            <p>Hallo ${escapeHtml(customerName)},</p>
            <p>vielen Dank für Ihre Nachricht an ${COMPANY_NAME}. Ihre Anfrage ist bei uns eingegangen.</p>
            <p>Wir prüfen Ihr Anliegen und melden uns so schnell wie möglich persönlich bei Ihnen.</p>
            <table style="border-collapse:collapse;margin:24px 0;width:100%;max-width:680px;">
              ${buildSummaryMarkup(summary)}
            </table>
            <p>Falls Sie weitere Informationen ergänzen möchten, antworten Sie einfach auf diese E-Mail oder kontaktieren Sie uns direkt unter <a href="tel:${COMPANY_PHONE.replaceAll(' ', '')}">${COMPANY_PHONE}</a>.</p>
            <p>Freundliche Grüsse<br>${COMPANY_NAME}</p>
          </div>
        `,
        text: [
          `Hallo ${customerName},`,
          '',
          `vielen Dank fuer Ihre Nachricht an ${COMPANY_NAME}. Ihre Anfrage ist bei uns eingegangen.`,
          'Wir pruefen Ihr Anliegen und melden uns so schnell wie moeglich persoenlich bei Ihnen.',
          '',
          buildSummaryText(summary),
          '',
          `Rueckfragen: ${COMPANY_EMAIL} | ${COMPANY_PHONE}`,
        ].join('\n'),
      },
      internal: {
        subject: `Neue Kontaktanfrage von ${readText(submission, 'name') || readText(submission, 'email')}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1d232b;">
            <p>Es ist eine neue Kontaktanfrage ueber die Website eingegangen.</p>
            <table style="border-collapse:collapse;margin:24px 0;width:100%;max-width:680px;">
              ${buildSummaryMarkup(summary)}
            </table>
          </div>
        `,
        text: [
          'Neue Kontaktanfrage ueber die Website',
          '',
          buildSummaryText(summary),
        ].join('\n'),
      },
    };
  }

  const summary = buildCalculatorSummary(submission);

  return {
    confirmation: {
      subject: 'Ihre Kalkulator-Anfrage bei Trockenbau Prima Vista',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1d232b;">
          <p>Hallo ${escapeHtml(customerName)},</p>
          <p>vielen Dank fuer Ihre Anfrage ueber unseren Trockenbau-Kalkulator.</p>
          <p>Wir haben Ihre Auswahl erhalten und prüfen die Angaben. Anschliessend melden wir uns mit einer persoenlichen Rueckmeldung bei Ihnen.</p>
          <table style="border-collapse:collapse;margin:24px 0;width:100%;max-width:680px;">
            ${buildSummaryMarkup(summary)}
          </table>
          <p>Sie koennen bei Rueckfragen jederzeit direkt auf diese E-Mail antworten oder uns unter <a href="mailto:${COMPANY_EMAIL}">${COMPANY_EMAIL}</a> erreichen.</p>
          <p>Freundliche Gruesse<br>${COMPANY_NAME}</p>
        </div>
      `,
      text: [
        `Hallo ${customerName},`,
        '',
        `vielen Dank fuer Ihre Anfrage ueber unseren Trockenbau-Kalkulator.`,
        'Wir haben Ihre Auswahl erhalten und pruefen die Angaben.',
        'Anschliessend melden wir uns mit einer persoenlichen Rueckmeldung bei Ihnen.',
        '',
        buildSummaryText(summary),
        '',
        `Rueckfragen: ${COMPANY_EMAIL} | ${COMPANY_PHONE}`,
      ].join('\n'),
    },
    internal: {
      subject: `Neue Kalkulator-Anfrage von ${readText(submission, 'name') || readText(submission, 'email')}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1d232b;">
          <p>Es ist eine neue Kalkulator-Anfrage ueber die Website eingegangen.</p>
          <table style="border-collapse:collapse;margin:24px 0;width:100%;max-width:680px;">
            ${buildSummaryMarkup(summary)}
          </table>
        </div>
      `,
      text: [
        'Neue Kalkulator-Anfrage ueber die Website',
        '',
        buildSummaryText(summary),
      ].join('\n'),
    },
  };
};

const sendWithResend = async ({
  apiKey,
  from,
  to,
  subject,
  html,
  text,
  replyTo,
  bcc,
}) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text,
      reply_to: replyTo || undefined,
      bcc: bcc || undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend email send failed: ${response.status} ${errorText}`);
  }

  return response.json();
};

const sendWithBrevo = async ({
  apiKey,
  from,
  to,
  subject,
  html,
  text,
  replyTo,
  bcc,
}) => {
  const body = {
    sender: { email: from },
    to: to.map((email) => ({ email })),
    subject,
    htmlContent: html,
    textContent: text,
  };

  if (replyTo) {
    body.replyTo = { email: replyTo };
  }

  if (bcc && bcc.length > 0) {
    body.bcc = bcc.map((email) => ({ email }));
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo email send failed: ${response.status} ${errorText}`);
  }

  return response.json();
};

const sendEmail = ({ provider, apiKey, ...rest }) => {
  if (provider === 'brevo') return sendWithBrevo({ apiKey, ...rest });
  if (provider === 'resend') return sendWithResend({ apiKey, ...rest });
  throw new Error(`Unsupported provider: ${provider}`);
};

export default async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  const provider = getEnv('EMAIL_PROVIDER');
  const emailEnabled = isTruthy(getEnv('EMAIL_CONFIRMATIONS_ENABLED'));
  const customerFrom = getEnv('EMAIL_FROM');
  const customerReplyTo = getEnv('EMAIL_REPLY_TO') || COMPANY_EMAIL;
  const notificationRecipient = getEnv('EMAIL_NOTIFICATION_TO');
  const notificationBcc = getEnv('EMAIL_NOTIFICATION_BCC');

  let payload;

  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  const formName = typeof payload?.formName === 'string' ? payload.formName : '';
  const submission = payload?.submission && typeof payload.submission === 'object'
    ? payload.submission
    : null;

  if (!submission || (formName !== 'contact' && formName !== 'calculator' && formName !== 'anfrage')) {
    return jsonResponse({ error: 'Invalid submission payload.' }, 400);
  }

  if (!isTruthy(readText(submission, 'confirmation_requested'))) {
    return jsonResponse({ status: 'skipped', reason: 'Confirmation not requested.' }, 202);
  }

  const recipientEmail = readText(submission, 'email');

  if (!recipientEmail) {
    return jsonResponse({ error: 'Recipient email is required.' }, 400);
  }

  if (!emailEnabled || !provider || !customerFrom) {
    return jsonResponse({
      status: 'skipped',
      reason: 'Email confirmation is not configured yet.',
    }, 202);
  }

  if (provider !== 'resend' && provider !== 'brevo') {
    return jsonResponse({
      status: 'skipped',
      reason: `Unsupported provider: ${provider}`,
    }, 202);
  }

  const apiKeyEnvVar = provider === 'brevo' ? 'BREVO_API_KEY' : 'RESEND_API_KEY';
  const providerApiKey = getEnv(apiKeyEnvVar);

  if (!providerApiKey) {
    return jsonResponse({
      status: 'skipped',
      reason: `${apiKeyEnvVar} is missing.`,
    }, 202);
  }

  const { confirmation, internal } = getTemplates(formName, submission);
  const result = {
    status: 'sent',
    confirmation: null,
    internalNotification: null,
  };

  const clientReplyTo = readText(submission, 'email') || customerReplyTo;

  result.confirmation = await sendEmail({
    provider,
    apiKey: providerApiKey,
    from: customerFrom,
    to: [recipientEmail],
    subject: confirmation.subject,
    html: confirmation.html,
    text: confirmation.text,
    replyTo: customerReplyTo,
    bcc: notificationBcc ? [notificationBcc] : undefined,
  });

  if (notificationRecipient) {
    result.internalNotification = await sendEmail({
      provider,
      apiKey: providerApiKey,
      from: customerFrom,
      to: [notificationRecipient],
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      replyTo: clientReplyTo,
    });
  }

  return jsonResponse(result, 200);
};

export const config = {
  path: '/api/confirmations',
  method: ['POST'],
};
