import test from 'node:test';
import assert from 'node:assert/strict';
import { processConfirmationRequest, ConfirmationRequestError } from './confirmations.mjs';

const EMAIL_ENV_KEYS = [
  'EMAIL_CONFIRMATIONS_ENABLED',
  'EMAIL_FROM',
  'EMAIL_REPLY_TO',
  'EMAIL_NOTIFICATION_TO',
  'EMAIL_NOTIFICATION_BCC',
  'RESEND_API_KEY',
];

const baseContact = () => ({
  name: 'Anna Beispiel',
  email: 'anna@example.com',
  message: 'Hallo, ich hätte eine Frage.',
  confirmation_requested: 'yes',
});

const setEnv = (overrides) => {
  for (const key of EMAIL_ENV_KEYS) {
    delete process.env[key];
  }
  for (const [key, value] of Object.entries(overrides)) {
    process.env[key] = value;
  }
};

const installFetchMock = (responder) => {
  const calls = [];
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, init) => {
    const body = init?.body ? JSON.parse(init.body) : null;
    const call = { url, init, body };
    calls.push(call);
    const response = await responder(call, calls.length - 1);
    return response;
  };

  return {
    calls,
    restore: () => {
      globalThis.fetch = originalFetch;
    },
  };
};

const okResendResponse = (id = 'resend-id') =>
  new Response(JSON.stringify({ id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

const failResendResponse = (status = 500, message = 'boom') =>
  new Response(message, { status });

// Silence the expected console output from confirmations.mjs during tests.
const silenceConsole = () => {
  const originalLog = console.log;
  const originalError = console.error;
  console.log = () => {};
  console.error = () => {};
  return () => {
    console.log = originalLog;
    console.error = originalError;
  };
};

test('rejects unknown form names', async () => {
  await assert.rejects(
    () => processConfirmationRequest({ formName: 'nope', submission: baseContact() }),
    (error) => {
      assert.ok(error instanceof ConfirmationRequestError);
      assert.equal(error.status, 400);
      return true;
    },
  );
});

test('rejects when confirmation requested but recipient email is missing', async () => {
  await assert.rejects(
    () =>
      processConfirmationRequest({
        formName: 'contact',
        submission: { ...baseContact(), email: '' },
      }),
    (error) => {
      assert.ok(error instanceof ConfirmationRequestError);
      assert.equal(error.status, 400);
      assert.match(error.message, /Recipient email/);
      return true;
    },
  );
});

test('skips everything when EMAIL_FROM is missing', async () => {
  setEnv({
    EMAIL_CONFIRMATIONS_ENABLED: 'true',
    RESEND_API_KEY: 'rk_test',
    EMAIL_NOTIFICATION_TO: 'info@trockenbau-primavista.ch',
  });
  const mock = installFetchMock(() => okResendResponse());

  try {
    const result = await processConfirmationRequest({
      formName: 'contact',
      submission: baseContact(),
    });

    assert.equal(result.status, 'skipped');
    assert.equal(result.confirmation.status, 'skipped');
    assert.match(result.confirmation.reason, /EMAIL_FROM is missing/);
    assert.equal(result.internalNotification.status, 'skipped');
    assert.match(result.internalNotification.reason, /EMAIL_FROM is missing/);
    assert.equal(mock.calls.length, 0);
  } finally {
    mock.restore();
  }
});

test('skips everything when RESEND_API_KEY is missing', async () => {
  setEnv({
    EMAIL_CONFIRMATIONS_ENABLED: 'true',
    EMAIL_FROM: 'Prima Vista <hello@trockenbau-primavista.ch>',
    EMAIL_NOTIFICATION_TO: 'info@trockenbau-primavista.ch',
  });
  const mock = installFetchMock(() => okResendResponse());

  try {
    const result = await processConfirmationRequest({
      formName: 'contact',
      submission: baseContact(),
    });

    assert.equal(result.status, 'skipped');
    assert.match(result.confirmation.reason, /RESEND_API_KEY is missing/);
    assert.match(result.internalNotification.reason, /RESEND_API_KEY is missing/);
    assert.equal(mock.calls.length, 0);
  } finally {
    mock.restore();
  }
});

test('sends both customer confirmation and internal notification when fully configured', async () => {
  setEnv({
    EMAIL_CONFIRMATIONS_ENABLED: 'true',
    EMAIL_FROM: 'Prima Vista <hello@trockenbau-primavista.ch>',
    EMAIL_REPLY_TO: 'info@trockenbau-primavista.ch',
    EMAIL_NOTIFICATION_TO: 'info@trockenbau-primavista.ch',
    RESEND_API_KEY: 'rk_test',
  });

  const restoreConsole = silenceConsole();
  const mock = installFetchMock(() => okResendResponse());

  try {
    const result = await processConfirmationRequest({
      formName: 'contact',
      submission: baseContact(),
    });

    assert.equal(result.status, 'sent');
    assert.equal(result.confirmation.status, 'sent');
    assert.equal(result.confirmation.recipient, 'anna@example.com');
    assert.equal(result.internalNotification.status, 'sent');
    assert.equal(result.internalNotification.recipient, 'info@trockenbau-primavista.ch');
    assert.equal(mock.calls.length, 2);

    // Both calls hit the Resend API with Bearer auth.
    for (const call of mock.calls) {
      assert.equal(call.url, 'https://api.resend.com/emails');
      assert.equal(call.init.method, 'POST');
      assert.equal(call.init.headers.Authorization, 'Bearer rk_test');
      assert.equal(call.init.headers['Content-Type'], 'application/json');
    }

    const [customerCall, internalCall] = mock.calls;

    // Customer confirmation
    assert.deepEqual(customerCall.body.to, ['anna@example.com']);
    assert.equal(customerCall.body.from, 'Prima Vista <hello@trockenbau-primavista.ch>');
    assert.equal(customerCall.body.reply_to, 'info@trockenbau-primavista.ch');
    assert.equal(customerCall.body.subject, 'Ihre Anfrage bei Trockenbau PrimaVista Schweiz');
    assert.match(customerCall.body.html, /Anna Beispiel/);
    assert.match(customerCall.body.html, /Trockenbau PrimaVista Schweiz/);
    assert.match(customerCall.body.text, /Anna Beispiel/);
    assert.match(customerCall.body.text, /Trockenbau PrimaVista Schweiz/);

    // Internal notification: From rewritten with customer name + form label;
    // Reply-To set to the customer's address so replies go straight back.
    assert.deepEqual(internalCall.body.to, ['info@trockenbau-primavista.ch']);
    assert.equal(internalCall.body.from, 'Anna Beispiel via Kontakt <hello@trockenbau-primavista.ch>');
    assert.equal(internalCall.body.reply_to, 'anna@example.com');
    assert.match(internalCall.body.subject, /Neue Kontaktanfrage von Anna Beispiel/);
    assert.deepEqual(internalCall.body.bcc, []);
  } finally {
    mock.restore();
    restoreConsole();
  }
});

test('skips customer confirmation when EMAIL_CONFIRMATIONS_ENABLED is false but still sends internal', async () => {
  setEnv({
    EMAIL_CONFIRMATIONS_ENABLED: 'false',
    EMAIL_FROM: 'hello@trockenbau-primavista.ch',
    EMAIL_NOTIFICATION_TO: 'info@trockenbau-primavista.ch',
    RESEND_API_KEY: 'rk_test',
  });

  const restoreConsole = silenceConsole();
  const mock = installFetchMock(() => okResendResponse());

  try {
    const result = await processConfirmationRequest({
      formName: 'contact',
      submission: baseContact(),
    });

    assert.equal(result.status, 'sent');
    assert.equal(result.confirmation.status, 'skipped');
    assert.match(result.confirmation.reason, /EMAIL_CONFIRMATIONS_ENABLED is false/);
    assert.equal(result.internalNotification.status, 'sent');
    assert.equal(mock.calls.length, 1);
    assert.deepEqual(mock.calls[0].body.to, ['info@trockenbau-primavista.ch']);
  } finally {
    mock.restore();
    restoreConsole();
  }
});

test('skips customer confirmation when not requested but still sends internal', async () => {
  setEnv({
    EMAIL_CONFIRMATIONS_ENABLED: 'true',
    EMAIL_FROM: 'hello@trockenbau-primavista.ch',
    EMAIL_NOTIFICATION_TO: 'info@trockenbau-primavista.ch',
    RESEND_API_KEY: 'rk_test',
  });

  const restoreConsole = silenceConsole();
  const mock = installFetchMock(() => okResendResponse());

  try {
    const result = await processConfirmationRequest({
      formName: 'contact',
      submission: { ...baseContact(), confirmation_requested: 'no' },
    });

    assert.equal(result.status, 'sent');
    assert.equal(result.confirmation.status, 'skipped');
    assert.match(result.confirmation.reason, /not requested/i);
    assert.equal(result.internalNotification.status, 'sent');
    assert.equal(mock.calls.length, 1);
  } finally {
    mock.restore();
    restoreConsole();
  }
});

test('skips internal notification when EMAIL_NOTIFICATION_TO is empty', async () => {
  setEnv({
    EMAIL_CONFIRMATIONS_ENABLED: 'true',
    EMAIL_FROM: 'hello@trockenbau-primavista.ch',
    RESEND_API_KEY: 'rk_test',
  });

  const restoreConsole = silenceConsole();
  const mock = installFetchMock(() => okResendResponse());

  try {
    const result = await processConfirmationRequest({
      formName: 'contact',
      submission: baseContact(),
    });

    assert.equal(result.status, 'sent');
    assert.equal(result.confirmation.status, 'sent');
    assert.equal(result.internalNotification.status, 'skipped');
    assert.match(result.internalNotification.reason, /EMAIL_NOTIFICATION_TO is empty/);
    assert.equal(mock.calls.length, 1);
    assert.deepEqual(mock.calls[0].body.to, ['anna@example.com']);
  } finally {
    mock.restore();
    restoreConsole();
  }
});

test('returns status=partial when one of two sends fails', async () => {
  setEnv({
    EMAIL_CONFIRMATIONS_ENABLED: 'true',
    EMAIL_FROM: 'hello@trockenbau-primavista.ch',
    EMAIL_NOTIFICATION_TO: 'info@trockenbau-primavista.ch',
    RESEND_API_KEY: 'rk_test',
  });

  const restoreConsole = silenceConsole();
  // First call (customer) ok, second (internal) fails.
  const mock = installFetchMock((_, index) =>
    index === 0 ? okResendResponse() : failResendResponse(500, 'rate limited'),
  );

  try {
    const result = await processConfirmationRequest({
      formName: 'contact',
      submission: baseContact(),
    });

    assert.equal(result.status, 'partial');
    assert.equal(result.confirmation.status, 'sent');
    assert.equal(result.internalNotification.status, 'failed');
    assert.match(result.internalNotification.reason, /rate limited/);
  } finally {
    mock.restore();
    restoreConsole();
  }
});

test('includes BCC when EMAIL_NOTIFICATION_BCC is set', async () => {
  setEnv({
    EMAIL_CONFIRMATIONS_ENABLED: 'true',
    EMAIL_FROM: 'hello@trockenbau-primavista.ch',
    EMAIL_NOTIFICATION_TO: 'info@trockenbau-primavista.ch',
    EMAIL_NOTIFICATION_BCC: 'archive@trockenbau-primavista.ch',
    RESEND_API_KEY: 'rk_test',
  });

  const restoreConsole = silenceConsole();
  const mock = installFetchMock(() => okResendResponse());

  try {
    await processConfirmationRequest({
      formName: 'contact',
      submission: baseContact(),
    });

    const [, internalCall] = mock.calls;
    assert.deepEqual(internalCall.body.bcc, ['archive@trockenbau-primavista.ch']);
  } finally {
    mock.restore();
    restoreConsole();
  }
});

test('calculator form renders calculator-specific subject and totals', async () => {
  setEnv({
    EMAIL_CONFIRMATIONS_ENABLED: 'true',
    EMAIL_FROM: 'hello@trockenbau-primavista.ch',
    EMAIL_NOTIFICATION_TO: 'info@trockenbau-primavista.ch',
    RESEND_API_KEY: 'rk_test',
  });

  const restoreConsole = silenceConsole();
  const mock = installFetchMock(() => okResendResponse());

  try {
    await processConfirmationRequest({
      formName: 'calculator',
      submission: {
        name: 'Max Muster',
        email: 'max@example.com',
        package: 'Premium',
        room_size: '25',
        total: 'CHF 1’234.50',
        confirmation_requested: 'yes',
      },
    });

    const [customerCall, internalCall] = mock.calls;
    assert.equal(
      customerCall.body.subject,
      'Ihre Kalkulator-Anfrage bei Trockenbau PrimaVista Schweiz',
    );
    assert.match(customerCall.body.html, /CHF 1’234\.50/);
    assert.match(internalCall.body.subject, /Neue Kalkulator-Anfrage von Max Muster/);
    assert.equal(internalCall.body.from, 'Max Muster via Kalkulator <hello@trockenbau-primavista.ch>');
  } finally {
    mock.restore();
    restoreConsole();
  }
});

test('anfrage form uses Anfrage label in internal From and subject', async () => {
  setEnv({
    EMAIL_CONFIRMATIONS_ENABLED: 'true',
    EMAIL_FROM: 'hello@trockenbau-primavista.ch',
    EMAIL_NOTIFICATION_TO: 'info@trockenbau-primavista.ch',
    RESEND_API_KEY: 'rk_test',
  });

  const restoreConsole = silenceConsole();
  const mock = installFetchMock(() => okResendResponse());

  try {
    await processConfirmationRequest({
      formName: 'anfrage',
      submission: {
        name: 'Lea Bau',
        email: 'lea@example.com',
        service: 'Trockenbau',
        confirmation_requested: 'yes',
      },
    });

    const [, internalCall] = mock.calls;
    assert.match(internalCall.body.subject, /Neue Anfrage \(Assistent\) von Lea Bau/);
    assert.equal(internalCall.body.from, 'Lea Bau via Anfrage <hello@trockenbau-primavista.ch>');
  } finally {
    mock.restore();
    restoreConsole();
  }
});

test('HTML-escapes user-supplied values in the customer confirmation', async () => {
  setEnv({
    EMAIL_CONFIRMATIONS_ENABLED: 'true',
    EMAIL_FROM: 'hello@trockenbau-primavista.ch',
    EMAIL_NOTIFICATION_TO: 'info@trockenbau-primavista.ch',
    RESEND_API_KEY: 'rk_test',
  });

  const restoreConsole = silenceConsole();
  const mock = installFetchMock(() => okResendResponse());

  try {
    await processConfirmationRequest({
      formName: 'contact',
      submission: {
        ...baseContact(),
        name: '<script>alert(1)</script>',
        message: 'Hallo & willkommen',
      },
    });

    const [customerCall] = mock.calls;
    assert.match(customerCall.body.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.doesNotMatch(customerCall.body.html, /<script>alert\(1\)<\/script>/);
    assert.match(customerCall.body.html, /Hallo &amp; willkommen/);
  } finally {
    mock.restore();
    restoreConsole();
  }
});
