import './PlacesList.css';

/**
 * Verilen rating değerini dolu/boş yıldızlarla görsel olarak sunar.
 * Örnek: 3.7 → ★★★★☆ (Math.round ile 4'e yuvarlanır)
 */
function StarRating({ rating }) {
  const stars = Math.round(rating);
  return (
    <span className="stars" title={`${rating} / 5`}>
      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      <span className="rating-value"> {rating}</span>
    </span>
  );
}

/**
 * Tek bir yeri kart olarak gösteren bileşen.
 * Fotoğraf, isim, adres, puan, açık/kapalı durumu ve yer tiplerini içerir.
 */
function PlaceCard({ place }) {
  /*
   * Google Places API fotoğraf doğrudan URL döndürmez, photo_reference döndürür.
   * Bu referansı Places Photo API URL'sine dönüştürüyoruz.
   * Fotoğraf yoksa null atanır, img tag'i render edilmez.
   */
  const photoUrl = place.photos?.[0]
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=120&photoreference=${place.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    : null;

  return (
    <div className="place-card">
      {/* Fotoğraf sadece varsa gösterilir, loading="lazy" sayfanın ilk yükünü hızlandırır */}
      {photoUrl && (
        <img className="place-photo" src={photoUrl} alt={place.name} loading="lazy" />
      )}
      <div className="place-info">
        <h3 className="place-name">{place.name}</h3>
        <p className="place-address">{place.vicinity}</p>

        <div className="place-meta">
          {/* Rating opsiyonel — bazı yerler puanlanmamış olabilir */}
          {place.rating && <StarRating rating={place.rating} />}

          {/* opening_hours opsiyonel — Google her yer için bunu döndürmez */}
          {place.opening_hours && (
            <span className={`open-status ${place.opening_hours.open_now ? 'open' : 'closed'}`}>
              {place.opening_hours.open_now ? 'Açık' : 'Kapalı'}
            </span>
          )}

          {/* price_level: 0=ücretsiz, 1=$, 2=$$, 3=$$$, 4=$$$$ */}
          {place.price_level !== undefined && (
            <span className="price-level">{'$'.repeat(place.price_level + 1)}</span>
          )}
        </div>

        {/* Yer tipleri: Google "restaurant", "fast_food" gibi döndürür.
            İlk 3 tanesi gösterilir, kart taşmasın diye.
            Alt çizgiler boşluğa çevrilir: "fast_food" → "fast food" */}
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

/**
 * Bulunan tüm yerleri kart grid'i olarak listeleyen bileşen.
 * Liste boşsa hiçbir şey render etmez.
 */
function PlacesList({ places }) {
  if (places.length === 0) return null;

  return (
    <div className="places-list-section">
      <h2>Sonuçlar <span className="place-count">({places.length} yer bulundu)</span></h2>
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
