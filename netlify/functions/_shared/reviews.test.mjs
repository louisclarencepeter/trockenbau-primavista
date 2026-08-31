import test from 'node:test';
import assert from 'node:assert/strict';
import { getGoogleReviews, ReviewsRequestError } from './reviews.mjs';

const REVIEW_ENV_KEYS = [
  'GOOGLE_REVIEWS_ENABLED',
  'GOOGLE_PLACE_ID',
  'GOOGLE_PLACES_API_KEY',
];

const resetReviewEnv = () => {
  for (const key of REVIEW_ENV_KEYS) {
    delete process.env[key];
  }
};

test('keeps Google reviews disabled unless explicitly enabled', async () => {
  resetReviewEnv();

  await assert.rejects(
    () => getGoogleReviews(),
    (error) => {
      assert.ok(error instanceof ReviewsRequestError);
      assert.equal(error.status, 503);
      assert.match(error.message, /not enabled/i);
      return true;
    },
  );
});

test('rejects the Frankfurt Bauprojekte Place ID', async () => {
  resetReviewEnv();
  process.env.GOOGLE_REVIEWS_ENABLED = 'true';
  process.env.GOOGLE_PLACE_ID = 'ChIJJ6jmeYlLly0RavRvS28Sln8';
  process.env.GOOGLE_PLACES_API_KEY = 'test-key';

  await assert.rejects(
    () => getGoogleReviews(),
    (error) => {
      assert.ok(error instanceof ReviewsRequestError);
      assert.equal(error.status, 503);
      assert.match(error.message, /different business/i);
      return true;
    },
  );
});

test('requires Google Places credentials after reviews are enabled', async () => {
  resetReviewEnv();
  process.env.GOOGLE_REVIEWS_ENABLED = 'true';

  await assert.rejects(
    () => getGoogleReviews(),
    (error) => {
      assert.ok(error instanceof ReviewsRequestError);
      assert.equal(error.status, 500);
      assert.match(error.message, /not configured/i);
      return true;
    },
  );
});

test.after(() => {
  resetReviewEnv();
});
