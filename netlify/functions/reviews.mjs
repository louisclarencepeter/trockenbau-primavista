import { getGoogleReviews, ReviewsRequestError } from './_shared/reviews.mjs';
import { errorResponse, jsonResponse } from './_shared/http.mjs';

export default async () => {
  try {
    const data = await getGoogleReviews();
    const hasReviews = Array.isArray(data.reviews) && data.reviews.length > 0;
    const isProduction = process.env.NODE_ENV === 'production';

    return jsonResponse(200, data, {
      'Cache-Control': isProduction && hasReviews ? 'public, max-age=86400' : 'no-store',
    });
  } catch (error) {
    if (error instanceof ReviewsRequestError) {
      return errorResponse(error.status, error.message);
    }

    console.error('[reviews] Reviews request failed', error);
    return errorResponse(500, 'Bewertungen konnten nicht geladen werden.');
  }
};

export const config = {
  path: '/api/reviews',
};
