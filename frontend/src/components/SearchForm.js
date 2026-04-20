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
  const [validationError, setValidationError] = useState('');

  // Form gönderilmeden önce değerlerin geçerliliğini kontrol eder
  const validate = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseInt(radius, 10);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return 'Enlem -90 ile 90 arasinda olmalidir.';
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      return 'Boylam -180 ile 180 arasinda olmalidir.';
    }
    // Google Places API maksimum 50000 metre yarıçap kabul eder
    if (isNaN(rad) || rad < 1 || rad > 50000) {
      return 'Yaricap 1 ile 50000 metre arasinda olmalidir.';
    }

    return null;
  };

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

  // Tarayıcının Geolocation API'sini kullanarak koordinatları otomatik doldurur
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setValidationError('Tarayiciniz konum ozelligini desteklemiyor.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // toFixed(6) → 6 ondalık basamak, metre düzeyinde hassasiyet
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
      },
      () => setValidationError('Konumunuz alinamadi.')
    );
  };

  return (
    <div className="search-card">
      <h2>Yakin Yer Ara</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="latitude">Enlem</label>
            {/* step="any" ondalıklı sayı girişine izin verir */}
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

          <div className="form-group">
            <label htmlFor="radius">Yaricap (metre)</label>
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

        {validationError && <p className="validation-error">{validationError}</p>}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={useCurrentLocation}>
            Konumumu Kullan
          </button>
          {/* disabled={loading} çift gönderimi engeller */}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Araniyor...' : 'Ara'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
