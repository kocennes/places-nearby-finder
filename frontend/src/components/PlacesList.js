import React from 'react';
import './PlacesList.css';

function StarRating({ rating }) {
  const stars = Math.round(rating);
  return (
    <span className="stars" title={`${rating} / 5`}>
      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      <span className="rating-value"> {rating}</span>
    </span>
  );
}

function PlaceCard({ place }) {
  const photoUrl = place.photos?.[0]
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=120&photoreference=${place.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    : null;

  return (
    <div className="place-card">
      {photoUrl && (
        <img className="place-photo" src={photoUrl} alt={place.name} loading="lazy" />
      )}
      <div className="place-info">
        <h3 className="place-name">{place.name}</h3>
        <p className="place-address">{place.vicinity}</p>
        <div className="place-meta">
          {place.rating && <StarRating rating={place.rating} />}
          {place.opening_hours && (
            <span className={`open-status ${place.opening_hours.open_now ? 'open' : 'closed'}`}>
              {place.opening_hours.open_now ? 'Açık' : 'Kapalı'}
            </span>
          )}
          {place.price_level !== undefined && (
            <span className="price-level">{'$'.repeat(place.price_level + 1)}</span>
          )}
        </div>
        {place.types?.length > 0 && (
          <div className="place-types">
            {place.types.slice(0, 3).map((t) => (
              <span key={t} className="type-badge">{t.replace(/_/g, ' ')}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlacesList({ places }) {
  if (places.length === 0) return null;

  return (
    <div className="places-list-section">
      <h2>Sonuçlar <span className="place-count">({places.length} yer bulundu)</span></h2>
      <div className="places-grid">
        {places.map((place) => (
          <PlaceCard key={place.place_id} place={place} />
        ))}
      </div>
    </div>
  );
}

export default PlacesList;
