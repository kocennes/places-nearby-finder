import { useState } from 'react';
import './SearchForm.css';

/**
 * Kullanıcının arama parametrelerini girdiği form bileşeni.
 *
 * Props:
 *   onSearch(params) → arama yapılınca App.js'deki handleSearch'ü tetikler
 *   loading          → istek süresince butonu devre dışı bırakmak için
 */
function SearchForm({ onSearch, loading }) {
  // Her input alanı için ayrı state — controlled component pattern
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');

  // Form gönderilmeden önce gösterilecek validation hata mesajı
  const [validationError, setValidationError] = useState('');

  /**
   * Form gönderilmeden önce değerlerin geçerliliğini kontrol eder.
   * Hata varsa mesaj döndürür, geçerliyse null döner.
   */
  const validate = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseInt(radius, 10);

    // Enlem -90 ile 90 arasında olmalı (dünya sınırları)
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return 'Enlem -90 ile 90 arasında olmalıdır.';
    }
    // Boylam -180 ile 180 arasında olmalı (dünya sınırları)
    if (isNaN(lon) || lon < -180 || lon > 180) {
      return 'Boylam -180 ile 180 arasında olmalıdır.';
    }
    // Google Places API maksimum 50000 metre yarıçap kabul eder
    if (isNaN(rad) || rad < 1 || rad > 50000) {
      return 'Yarıçap 1 ile 50000 metre arasında olmaldır.';
    }
    return null;
  };

  /**
   * Form submit edildiğinde çalışır.
   * Validation geçerse üst bileşene (App.js) parsed değerleri iletir.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError('');
    // String olan input değerlerini sayıya dönüştürüp gönder
    onSearch({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseInt(radius, 10),
    });
  };

  /**
   * Tarayıcının Geolocation API'sini kullanarak kullanıcının mevcut
   * konumunu alır ve latitude/longitude alanlarını otomatik doldurur.
   */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setValidationError('Tarayıcınz konum özelliğini desteklemiyor.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // toFixed(6) ile 6 ondalık basamağa yuvarlar (metre düzeyinde hassasiyet)
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
      },
      () => setValidationError('Konumunuz alınamadı.')
    );
  };

  return (
    <div className="search-card">
      <h2>Yakın Yer Ara</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-row">

          {/* Enlem input'u — step="any" ondalıklı sayı girişine izin verir */}
          <div className="form-group">
            <label htmlFor="latitude">Enlem</label>
            <input
              id="latitude"
              type="number"
              step="any"
              placeholder="e.g. 41.0082"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>

          {/* Boylam input'u */}
          <div className="form-group">
            <label htmlFor="longitude">Boylam</label>
            <input
              id="longitude"
              type="number"
              step="any"
              placeholder="e.g. 28.9784"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>

          {/* Yarıçap input'u — min/max HTML validation ile de destekleniyor */}
          <div className="form-group">
            <label htmlFor="radius">Yarıçap (metre)</label>
            <input
              id="radius"
              type="number"
              placeholder="e.g. 1000"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              required
              min="1"
              max="50000"
            />
          </div>
        </div>

        {/* Validation hatası varsa form altında göster */}
        {validationError && (
          <p className="validation-error">{validationError}</p>
        )}

        <div className="form-actions">
          {/* Geolocation butonu — koordinatları otomatik doldurur */}
          <button type="button" className="btn-secondary" onClick={useCurrentLocation}>
            Konumumu Kullan
          </button>

          {/* Submit butonu — istek süresince disabled kalır, çift gönderimi önler */}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Aranıyor...' : 'Ara'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
