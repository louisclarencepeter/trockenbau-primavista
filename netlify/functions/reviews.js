import process from 'process';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
let cache = { data: null, timestamp: 0 };

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=86400',
  };

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Google Places not configured' }),
    };
  }

  // Return cached data if fresh
  if (cache.data && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return { statusCode: 200, headers, body: JSON.stringify(cache.data) };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&reviews_sort=newest&language=de&key=${apiKey}`;
    const response = await fetch(url);
    const json = await response.json();

    if (json.status !== 'OK') {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: `Google API error: ${json.status}` }),
      };
    }

    const { rating, user_ratings_total, reviews } = json.result;

    const data = {
      rating,
      totalReviews: user_ratings_total,
      reviews: (reviews || []).map((r) => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text,
        relativeTime: r.relative_time_description,
        profilePhoto: r.profile_photo_url,
      })),
    };

    cache = { data, timestamp: Date.now() };

    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
