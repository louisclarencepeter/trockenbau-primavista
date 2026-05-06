import test from 'node:test';
import assert from 'node:assert/strict';
import { submitForm, FormSubmissionError } from '../lib/forms.js';

const validContact = {
  name: 'Anna Beispiel',
  email: 'anna@example.com',
  message: 'Hallo, ich hätte eine Frage.',
};

const expectFormError = async (input, status, messageMatch) => {
  await assert.rejects(
    () => submitForm(input),
    (error) => {
      assert.ok(error instanceof FormSubmissionError, 'expected FormSubmissionError');
      assert.equal(error.status, status);
      if (messageMatch) {
        assert.match(error.message, messageMatch);
      }
      return true;
    },
  );
};

test('rejects unknown form names', async () => {
  await expectFormError(
    { formName: 'unknown', submission: validContact },
    400,
    /Invalid submission payload/,
  );
});

test('rejects missing submission payload', async () => {
  await expectFormError(
    { formName: 'contact', submission: null },
    400,
    /Invalid submission payload/,
  );
});

test('honeypot bot-field returns spam:true without throwing', async () => {
  const result = await submitForm({
    formName: 'contact',
    submission: { ...validContact, 'bot-field': 'gotcha' },
  });

  assert.equal(result.spam, true);
  assert.equal(result.status, 'accepted');
  assert.equal(result.emails, null);
});

test('rejects when required fields are missing', async () => {
  await expectFormError(
    { formName: 'contact', submission: { name: 'Anna' } },
    400,
    /Missing required fields/,
  );
});

test('rejects malformed email', async () => {
  await expectFormError(
    { formName: 'contact', submission: { ...validContact, email: 'not-an-email' } },
    400,
    /valid email/i,
  );
});

test('rejects oversized regular field (>1000 chars)', async () => {
  await expectFormError(
    {
      formName: 'contact',
      submission: { ...validContact, name: 'x'.repeat(1001) },
    },
    413,
    /name.*exceeds/,
  );
});

test('accepts long-text field up to 5000 chars but rejects beyond', async () => {
  await expectFormError(
    {
      formName: 'contact',
      submission: { ...validContact, message: 'x'.repeat(5001) },
    },
    413,
    /message.*exceeds/,
  );
});

test('honeypot check runs after length validation', async () => {
  // Oversized payload should fail with 413 even when bot-field is set
  await expectFormError(
    {
      formName: 'contact',
      submission: { ...validContact, name: 'x'.repeat(1001), 'bot-field': 'gotcha' },
    },
    413,
  );
});
