import { jsonResponse } from './_shared/http.mjs';

export default async () => jsonResponse(200, { ok: true });

export const config = {
  path: '/api/health',
};
