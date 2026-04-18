import { getApiUrl } from './api';

const FORM_SUBMISSION_ENDPOINT = getApiUrl('/api/forms/submit');

const createConfirmationRequestId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `confirmation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const formDataToObject = (formData) => {
  const entries = [];

  formData.forEach((value, key) => {
    entries.push([key, typeof value === 'string' ? value.trim() : '']);
  });

  return Object.fromEntries(entries);
};

export const submitProjectForm = async ({ form, formName }) => {
  const formData = new FormData(form);

  if (!formData.get('confirmation_request_id')) {
    formData.set('confirmation_request_id', createConfirmationRequestId());
  }

  const submission = formDataToObject(formData);

  const response = await fetch(FORM_SUBMISSION_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formName,
      submission,
    }),
  });

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`);
  }

  return submission;
};
