import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Reviews.scss';

function StarRating({ rating }) {
  return (
    <div className="reviews__stars" role="img" aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          strokeWidth={0}
          aria-hidden="true"
          fill={i <= rating ? 'var(--color-accent)' : 'var(--color-border-card)'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <article
      className="reviews__card reviews__reveal"
    >
      <Quote size={28} className="reviews__quote-icon" strokeWidth={1.5} />
      <p className="reviews__review-text">{review.text}</p>
      <div className="reviews__author">
        {review.profilePhoto && (
          <img
            src={review.profilePhoto}
            alt=""
            className="reviews__avatar"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}
        <div>
          <span className="reviews__author-name">{review.author}</span>
          <div className="reviews__author-meta">
            <StarRating rating={review.rating} />
            <span className="reviews__time">{review.relativeTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function Reviews() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const { sectionRef, isVisible } = useScrollReveal({
    once: false,
  });

  useEffect(() => {
    fetch('/api/reviews', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error || !data) return null;

  const displayReviews = data.reviews
    .filter((r) => r.text && r.rating >= 4)
    .slice(0, 4);

  if (displayReviews.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`reviews section${isVisible ? ' reviews--visible' : ''}`}
      id="bewertungen"
    >
      <div className="container">
        <div className="reviews__header">
          <span className="reviews__eyebrow reviews__reveal">KUNDENSTIMMEN</span>
          <h2 className="reviews__title reviews__reveal">
            Das sagen unsere Kunden
          </h2>
          <div className="reviews__summary reviews__reveal">
            <div className="reviews__rating-badge">
              <Star size={22} strokeWidth={0} fill="var(--color-accent)" />
              <span className="reviews__rating-value">{data.rating.toFixed(1)}</span>
            </div>
            <p className="reviews__rating-text">
              Basierend auf {data.totalReviews} Google-Bewertungen
            </p>
          </div>
        </div>

        <div className="reviews__grid">
          {displayReviews.map((review) => (
            <ReviewCard
              key={`${review.author}-${review.relativeTime}-${review.rating}`}
              review={review}
            />
          ))}
        </div>

        <div className="reviews__cta reviews__reveal">
          {data.reviewsUrl ? (
            <a
              href={data.reviewsUrl}
              target="_blank"
              rel="noreferrer"
              className="reviews__link"
            >
              Alle Bewertungen auf Google ansehen
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
