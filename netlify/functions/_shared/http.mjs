export const jsonResponse = (status, body, extraHeaders = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });

export const errorResponse = (status, message, extra = {}, headers = {}) =>
  jsonResponse(status, { error: message, ...extra }, headers);

export const readJsonBody = async (request) => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};
