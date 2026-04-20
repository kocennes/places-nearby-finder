import './PlacesList.css';

// Verilen rating değerini dolu/boş yıldızlarla gösterir. Örnek: 3.7 → ★★★★☆
function StarRating({ rating }) {
  const stars = Math.round(rating);
  return (
    <span className="stars" title={`${rating} / 5`}>
      {'\u2605'.repeat(stars)}{'\u2606'.repeat(5 - stars)}
      <span className="rating-value"> {rating}</span>
    </span>
  );
}

/**
 * Tek bir yeri kart olarak gösteren bileşen.
 * Fotoğraf, isim, adres, puan, açık/kapalı durumu ve yer tiplerini içerir.
 */
function PlaceCard({ place }) {
  // Google doğrudan URL değil photo_reference döndürür, biz Places Photo API URL'sine çeviriyoruz
  const photoUrl = place.photos?.[0]
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=120&photoreference=${place.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    : null;

  return (
    <div className="place-card">
      {/* loading="lazy" sayfanın ilk yükünü hızlandırır */}
      {photoUrl && <img className="place-photo" src={photoUrl} alt={place.name} loading="lazy" />}
      <div className="place-info">
        <h3 className="place-name">{place.name}</h3>
        <p className="place-address">{place.vicinity}</p>

        <div className="place-meta">
          {place.rating && <StarRating rating={place.rating} />}

          {place.opening_hours && (
            <span className={`open-status ${place.opening_hours.open_now ? 'open' : 'closed'}`}>
              {place.opening_hours.open_now ? 'Acik' : 'Kapali'}
            </span>
          )}

          {/* price_level: 0=ücretsiz, 1=$, 2=$$, 3=$$$, 4=$$$$ */}
          {place.price_level !== undefined && (
            <span className="price-level">{'$'.repeat(place.price_level + 1)}</span>
          )}
        </div>

        {/* İlk 3 tip gösterilir, kart taşmasın diye. Alt çizgi boşluğa çevrilir: fast_food → fast food */}
        {place.types?.length > 0 && (
          <div className="place-types">
            {place.types.slice(0, 3).map((type) => (
              <span key={type} className="type-badge">
                {type.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Liste boşsa hiçbir şey render etmez
function PlacesList({ places }) {
  if (places.length === 0) return null;

  return (
    <div className="places-list-section">
      <h2>
        Sonuclar <span className="place-count">({places.length} yer bulundu)</span>
      </h2>
      {/* Her yer için benzersiz place_id key olarak kullanılır */}
      <div className="places-grid">
        {places.map((place) => (
          <PlaceCard key={place.place_id} place={place} />
        ))}
      </div>
    </div>
  );
}

export default PlacesList;
