import {
  ALLOWED_FORM_NAMES,
  ConfirmationRequestError,
  normalizeSubmission,
  processConfirmationRequest,
  readText,
} from './confirmations.js';

const REQUIRED_FIELDS = {
  contact: ['name', 'email', 'message'],
  calculator: ['name', 'email', 'package', 'room_size', 'total'],
  anfrage: ['name', 'email', 'service'],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class FormSubmissionError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'FormSubmissionError';
    this.status = status;
  }
}

const validateRequiredFields = (formName, submission) => {
  const missingFields = (REQUIRED_FIELDS[formName] || []).filter((field) => !readText(submission, field));

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }

  return '';
};

export const submitForm = async ({ formName, submission }) => {
  const normalizedFormName = typeof formName === 'string' ? formName.trim() : '';
  const normalizedSubmission = normalizeSubmission(submission);

  if (!normalizedSubmission || !ALLOWED_FORM_NAMES.includes(normalizedFormName)) {
    throw new FormSubmissionError(400, 'Invalid submission payload.');
  }

  if (readText(normalizedSubmission, 'bot-field')) {
    return {
      status: 'accepted',
      formName: normalizedFormName,
      spam: true,
      emails: null,
      submissionId: null,
    };
  }

  const missingRequiredFieldsMessage = validateRequiredFields(normalizedFormName, normalizedSubmission);

  if (missingRequiredFieldsMessage) {
    throw new FormSubmissionError(400, missingRequiredFieldsMessage);
  }

  if (!EMAIL_PATTERN.test(readText(normalizedSubmission, 'email'))) {
    throw new FormSubmissionError(400, 'A valid email address is required.');
  }

  if (!readText(normalizedSubmission, 'confirmation_requested')) {
    normalizedSubmission.confirmation_requested = 'yes';
  }

  let emailResult;

  try {
    emailResult = await processConfirmationRequest({
      formName: normalizedFormName,
      submission: normalizedSubmission,
    });
  } catch (error) {
    if (error instanceof ConfirmationRequestError) {
      throw new FormSubmissionError(error.status, error.message);
    }

    throw error;
  }

  if (emailResult.internalNotification?.status !== 'sent') {
    throw new FormSubmissionError(
      503,
      'Form delivery is not configured correctly. Set EMAIL_NOTIFICATION_TO plus valid email provider credentials on the server.',
    );
  }

  return {
    status: 'accepted',
    formName: normalizedFormName,
    spam: false,
    emails: emailResult,
    submissionId: readText(normalizedSubmission, 'confirmation_request_id') || null,
  };
};
