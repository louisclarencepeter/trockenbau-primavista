const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const BLOCKED_PLACE_IDS = new Set([
  // Prima Vista Bauprojekte in Frankfurt; it is not the Swiss Trockenbau business.
  'ChIJJ6jmeYlLly0RavRvS28Sln8',
]);

let cache = {
  data: null,
  timestamp: 0,
};

export class ReviewsRequestError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ReviewsRequestError';
    this.status = status;
  }
}

export const getGoogleReviews = async () => {
  const reviewsEnabled = process.env.GOOGLE_REVIEWS_ENABLED?.trim().toLowerCase() === 'true';
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();

  if (!reviewsEnabled) {
    throw new ReviewsRequestError(503, 'Google reviews not enabled.');
  }

  if (BLOCKED_PLACE_IDS.has(placeId)) {
    throw new ReviewsRequestError(503, 'Configured Google Place ID belongs to a different business.');
  }

  if (!apiKey || !placeId) {
    throw new ReviewsRequestError(500, 'Google Places not configured.');
  }

  if (cache.data && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&reviews_sort=newest&language=de&key=${apiKey}`;
  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    throw new ReviewsRequestError(response.status, `Google API request failed with status ${response.status}.`);
  }

  if (json.status !== 'OK') {
    throw new ReviewsRequestError(502, `Google API error: ${json.status}`);
  }

  const { rating, user_ratings_total, reviews } = json.result;

  const data = {
    rating,
    totalReviews: user_ratings_total,
    reviewsUrl: `https://search.google.com/local/reviews?placeid=${placeId}`,
    reviews: (reviews || []).map((review) => ({
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      relativeTime: review.relative_time_description,
      profilePhoto: review.profile_photo_url,
    })),
  };

  cache = {
    data,
    timestamp: Date.now(),
  };

  return data;
};
