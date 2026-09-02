import { getApiUrl } from './api.js';
import { isAcceptedEnquiry, trackAcceptedEnquiry } from './analytics.js';

const FORM_SUBMISSION_ENDPOINT = getApiUrl('/api/forms/submit');
const successfulFormSubmissions = new WeakMap();

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

const getTrackingKey = async (form, submission) => {
  const key = submission.confirmation_request_id;
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    return key;
  }

  // Keep only a one-way fingerprint in this form's memory, never raw form values.
  // The real request ID and notification workflow remain unchanged.
  const signature = JSON.stringify(Object.entries(submission)
    .filter(([name]) => name !== 'confirmation_request_id')
    .sort(([left], [right]) => left.localeCompare(right)));
  try {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(signature));
    const fingerprint = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
    const previous = successfulFormSubmissions.get(form);
    if (previous?.fingerprint === fingerprint) {
      return previous.key;
    }

    successfulFormSubmissions.set(form, { fingerprint, key });
  } catch {
    // A blocked crypto API must not prevent tracking a confirmed submission.
  }

  return key;
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

  try {
    const result = await response.json();
    const enquiry = { httpStatus: response.status, formName, result };
    if (isAcceptedEnquiry(enquiry)) {
      const trackingKey = await getTrackingKey(form, submission);
      trackAcceptedEnquiry({ ...enquiry, trackingKey });
    }
  } catch {
    // Preserve the existing form outcome if tracking or response parsing fails.
  }

  return submission;
};
