const NETLIFY_FORM_ENDPOINT = '/';
const CONFIRMATION_ENDPOINT = '/api/confirmations';

const createConfirmationRequestId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `confirmation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const encodeFormData = (formData) => {
  const params = new URLSearchParams();

  formData.forEach((value, key) => {
    if (typeof value === 'string') {
      params.append(key, value);
    }
  });

  return params.toString();
};

const formDataToObject = (formData) => {
  const entries = [];

  formData.forEach((value, key) => {
    entries.push([key, typeof value === 'string' ? value.trim() : '']);
  });

  return Object.fromEntries(entries);
};

const requestConfirmationEmail = async (formName, submission) => {
  try {
    const response = await fetch(CONFIRMATION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formName,
        submission,
      }),
    });

    if (!response.ok) {
      throw new Error(`Confirmation request failed with status ${response.status}`);
    }
  } catch (error) {
    console.warn('Confirmation email request skipped or failed.', error);
  }
};

export const submitNetlifyForm = async ({ form, formName }) => {
  const formData = new FormData(form);

  formData.set('form-name', formName);

  if (!formData.get('confirmation_request_id')) {
    formData.set('confirmation_request_id', createConfirmationRequestId());
  }

  const response = await fetch(NETLIFY_FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeFormData(formData),
  });

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`);
  }

  const submission = formDataToObject(formData);

  delete submission['bot-field'];
  delete submission['form-name'];

  await requestConfirmationEmail(formName, submission);

  return submission;
};
