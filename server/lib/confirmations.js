import process from 'process';

export const ALLOWED_FORM_NAMES = ['contact', 'calculator', 'anfrage'];

const COMPANY_NAME = 'Trockenbau Prima Vista';
const COMPANY_EMAIL = 'info@trockenbau-primavista.ch';
const COMPANY_PHONE = '+41 78 265 93 32';

export class ConfirmationRequestError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ConfirmationRequestError';
    this.status = status;
  }
}

const getEnv = (name) => {
  if (typeof process.env?.[name] === 'string') {
    return process.env[name].trim();
  }

  return '';
};

const isTruthy = (value) => ['1', 'true', 'yes', 'on'].includes(String(value ?? '').trim().toLowerCase());

const getErrorMessage = (error) => (error instanceof Error ? error.message : String(error));

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const normalizeSubmission = (submission) => {
  if (!submission || typeof submission !== 'object' || Array.isArray(submission)) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(submission).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : '',
    ]),
  );
};

export const readText = (submission, key) => {
  const value = submission?.[key];
  return typeof value === 'string' ? value.trim() : '';
};

const normalizeEmailAddress = (value) => {
  const input = String(value ?? '').trim();

  if (!input) return '';

  const match = input.match(/<([^>]+)>/);
  return (match?.[1] ?? input).trim().toLowerCase();
};

const parseEmailIdentity = (value, fallbackName = '') => {
  const input = String(value ?? '').trim();

  if (!input) {
    return {
      email: '',
      name: fallbackName,
    };
  }

  const match = input.match(/^(.*?)<([^>]+)>$/);

  if (!match) {
    return {
      email: input,
      name: fallbackName,
    };
  }

  const rawName = match[1].trim().replace(/^["']|["']$/g, '').trim();

  return {
    email: match[2].trim(),
    name: rawName || fallbackName,
  };
};

const formatEmailIdentity = (value, fallbackName = '') => {
  const { email, name } = parseEmailIdentity(value, fallbackName);

  if (!email) return '';
  if (!name) return email;

  return `${name} <${email}>`;
};

const FORM_LABELS = {
  contact: 'Kontakt',
  calculator: 'Kalkulator',
  anfrage: 'Anfrage',
};

const buildInternalFrom = (baseFrom, customerName, formName) => {
  const { email } = parseEmailIdentity(baseFrom);
  const cleanName = String(customerName ?? '').replace(/["<>]/g, '').trim();

  if (!email || !cleanName) return baseFrom;

  const formLabel = FORM_LABELS[formName];
  const displayName = formLabel ? `${cleanName} via ${formLabel}` : cleanName;

  return `${displayName} <${email}>`;
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
            <p>vielen Dank fuer Ihre Nachricht an ${COMPANY_NAME}. Ihre Anfrage ist bei uns eingegangen.</p>
            <p>Wir pruefen Ihr Anliegen und melden uns so schnell wie moeglich persoenlich bei Ihnen.</p>
            <table style="border-collapse:collapse;margin:24px 0;width:100%;max-width:680px;">
              ${buildSummaryMarkup(summary)}
            </table>
            <p>Falls Sie weitere Informationen ergaenzen moechten, antworten Sie einfach auf diese E-Mail oder kontaktieren Sie uns direkt unter <a href="tel:${COMPANY_PHONE.replaceAll(' ', '')}">${COMPANY_PHONE}</a>.</p>
            <p>Freundliche Gruesse<br>${COMPANY_NAME}</p>
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
          <p>Wir haben Ihre Auswahl erhalten und pruefen die Angaben. Anschliessend melden wir uns mit einer persoenlichen Rueckmeldung bei Ihnen.</p>
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
      from: formatEmailIdentity(from, COMPANY_NAME),
      to,
      subject,
      html,
      text,
      reply_to: replyTo ? normalizeEmailAddress(replyTo) : undefined,
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
  const sender = parseEmailIdentity(from, COMPANY_NAME);
  const body = {
    sender: {
      email: sender.email,
      name: sender.name || undefined,
    },
    to: to.map((email) => ({ email })),
    subject,
    htmlContent: html,
    textContent: text,
  };

  if (replyTo) {
    const replyToIdentity = parseEmailIdentity(replyTo);

    body.replyTo = {
      email: replyToIdentity.email,
      name: replyToIdentity.name || undefined,
    };
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

const getMailConfig = () => {
  const provider = getEnv('EMAIL_PROVIDER');
  const emailEnabled = isTruthy(getEnv('EMAIL_CONFIRMATIONS_ENABLED'));
  const customerFrom = getEnv('EMAIL_FROM');
  const customerReplyTo = getEnv('EMAIL_REPLY_TO') || COMPANY_EMAIL;
  const notificationRecipient = getEnv('EMAIL_NOTIFICATION_TO');
  const notificationBcc = getEnv('EMAIL_NOTIFICATION_BCC');

  if (!provider || !customerFrom) {
    return {
      ok: false,
      reason: 'EMAIL_PROVIDER or EMAIL_FROM is missing.',
      provider,
      emailEnabled,
      customerFrom,
      customerReplyTo,
      notificationRecipient,
      notificationBcc,
      apiKey: '',
    };
  }

  if (provider !== 'resend' && provider !== 'brevo') {
    return {
      ok: false,
      reason: `Unsupported provider: ${provider}`,
      provider,
      emailEnabled,
      customerFrom,
      customerReplyTo,
      notificationRecipient,
      notificationBcc,
      apiKey: '',
    };
  }

  const apiKeyEnvVar = provider === 'brevo' ? 'BREVO_API_KEY' : 'RESEND_API_KEY';
  const apiKey = getEnv(apiKeyEnvVar);

  if (!apiKey) {
    return {
      ok: false,
      reason: `${apiKeyEnvVar} is missing.`,
      provider,
      emailEnabled,
      customerFrom,
      customerReplyTo,
      notificationRecipient,
      notificationBcc,
      apiKey,
    };
  }

  return {
    ok: true,
    reason: '',
    provider,
    emailEnabled,
    customerFrom,
    customerReplyTo,
    notificationRecipient,
    notificationBcc,
    apiKey,
  };
};

export const processConfirmationRequest = async ({ formName, submission }) => {
  const normalizedFormName = typeof formName === 'string' ? formName.trim() : '';
  const normalizedSubmission = normalizeSubmission(submission);

  if (!normalizedSubmission || !ALLOWED_FORM_NAMES.includes(normalizedFormName)) {
    throw new ConfirmationRequestError(400, 'Invalid submission payload.');
  }

  const confirmationRequested = isTruthy(readText(normalizedSubmission, 'confirmation_requested'));
  const recipientEmail = readText(normalizedSubmission, 'email');

  if (confirmationRequested && !recipientEmail) {
    throw new ConfirmationRequestError(400, 'Recipient email is required.');
  }

  const mailConfig = getMailConfig();
  const { confirmation, internal } = getTemplates(normalizedFormName, normalizedSubmission);
  const clientReplyTo = recipientEmail || mailConfig.customerReplyTo;
  const normalizedSenderEmail = normalizeEmailAddress(mailConfig.customerFrom);
  const normalizedNotificationRecipient = normalizeEmailAddress(mailConfig.notificationRecipient);
  const shouldSendCustomerConfirmation = confirmationRequested && mailConfig.emailEnabled;
  const canDeliverInternalCopy = Boolean(
    mailConfig.notificationRecipient
      && normalizedNotificationRecipient
      && normalizedNotificationRecipient !== normalizedSenderEmail,
  );
  const shouldSendInternalNotification = canDeliverInternalCopy;

  const result = {
    status: 'skipped',
    confirmation: null,
    internalNotification: null,
  };

  let sentCount = 0;
  let hasFailures = false;

  if (!mailConfig.ok) {
    result.confirmation = shouldSendCustomerConfirmation
      ? {
          status: 'skipped',
          reason: mailConfig.reason,
          recipient: recipientEmail,
        }
      : {
          status: 'skipped',
          reason: confirmationRequested
            ? 'EMAIL_CONFIRMATIONS_ENABLED is false.'
            : 'Confirmation not requested.',
          recipient: recipientEmail || null,
        };

    result.internalNotification = mailConfig.notificationRecipient
      ? {
          status: 'skipped',
          reason: mailConfig.reason,
          recipient: mailConfig.notificationRecipient,
        }
      : {
          status: 'skipped',
          reason: 'EMAIL_NOTIFICATION_TO is empty.',
          recipient: null,
        };

    return result;
  }

  console.log('[confirmations] Processing submission', {
    formName: normalizedFormName,
    provider: mailConfig.provider,
    recipientEmail: recipientEmail || null,
    confirmationRequested,
    confirmationEnabled: mailConfig.emailEnabled,
    notificationRecipient: mailConfig.notificationRecipient || null,
  });

  if (shouldSendCustomerConfirmation) {
    try {
      await sendEmail({
        provider: mailConfig.provider,
        apiKey: mailConfig.apiKey,
        from: mailConfig.customerFrom,
        to: [recipientEmail],
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
        replyTo: mailConfig.customerReplyTo,
      });

      result.confirmation = {
        status: 'sent',
        recipient: recipientEmail,
      };

      sentCount += 1;
    } catch (error) {
      hasFailures = true;
      result.confirmation = {
        status: 'failed',
        recipient: recipientEmail,
        reason: getErrorMessage(error),
      };

      console.error('[confirmations] Customer confirmation failed', {
        formName: normalizedFormName,
        recipientEmail,
        error: getErrorMessage(error),
      });
    }
  } else {
    result.confirmation = {
      status: 'skipped',
      recipient: recipientEmail || null,
      reason: confirmationRequested
        ? 'EMAIL_CONFIRMATIONS_ENABLED is false.'
        : 'Confirmation not requested.',
    };
  }

  if (shouldSendInternalNotification) {
    try {
      await sendEmail({
        provider: mailConfig.provider,
        apiKey: mailConfig.apiKey,
        from: buildInternalFrom(
          mailConfig.customerFrom,
          readText(normalizedSubmission, 'name'),
          normalizedFormName,
        ),
        to: [mailConfig.notificationRecipient],
        subject: shouldSendCustomerConfirmation ? confirmation.subject : internal.subject,
        html: shouldSendCustomerConfirmation ? confirmation.html : internal.html,
        text: shouldSendCustomerConfirmation ? confirmation.text : internal.text,
        replyTo: clientReplyTo,
        bcc: mailConfig.notificationBcc ? [mailConfig.notificationBcc] : [],
      });

      result.internalNotification = {
        status: 'sent',
        recipient: mailConfig.notificationRecipient,
        reason: shouldSendCustomerConfirmation
          ? 'Delivered as a direct copy with the customer email in Reply-To.'
          : undefined,
      };
      sentCount += 1;
    } catch (error) {
      hasFailures = true;
      result.internalNotification = {
        status: 'failed',
        recipient: mailConfig.notificationRecipient,
        reason: getErrorMessage(error),
      };

      console.error('[confirmations] Internal notification failed', {
        formName: normalizedFormName,
        notificationRecipient: mailConfig.notificationRecipient,
        error: getErrorMessage(error),
      });
    }
  } else if (mailConfig.notificationRecipient) {
    result.internalNotification = {
      status: 'skipped',
      recipient: mailConfig.notificationRecipient,
      reason: 'EMAIL_NOTIFICATION_TO matches EMAIL_FROM.',
    };
  } else {
    result.internalNotification = {
      status: 'skipped',
      recipient: null,
      reason: 'EMAIL_NOTIFICATION_TO is empty.',
    };
  }

  if (hasFailures) {
    result.status = 'partial';
  } else if (sentCount > 0) {
    result.status = 'sent';
  }

  return result;
};
