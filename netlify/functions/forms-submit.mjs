import { submitForm, FormSubmissionError } from './_shared/forms.mjs';
import { errorResponse, jsonResponse, readJsonBody } from './_shared/http.mjs';

export default async (request) => {
  if (request.method !== 'POST') {
    return errorResponse(405, 'Method not allowed.');
  }

  const body = await readJsonBody(request);

  if (!body) {
    return errorResponse(400, 'Invalid JSON body.');
  }

  try {
    const result = await submitForm({
      formName: body.formName,
      submission: body.submission,
    });

    return jsonResponse(result.spam ? 202 : 200, result);
  } catch (error) {
    if (error instanceof FormSubmissionError) {
      return errorResponse(error.status, error.message);
    }

    console.error('[forms-submit] Form submission failed', error);
    return errorResponse(500, 'Form submission failed.');
  }
};

export const config = {
  path: '/api/forms/submit',
};
