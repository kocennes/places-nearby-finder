import { useState } from 'react';
import axios from 'axios';
import SearchForm from './components/SearchForm';
import PlacesMap from './components/PlacesMap';
import PlacesList from './components/PlacesList';
import './App.css';

// Backend URL'si environment variable'dan okunur, tanımlı değilse localhost'a düşer
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8070';

/**
 * Uygulamanın ana bileşeni. Tüm state burada tutulur ve
 * alt bileşenlere props olarak iletilir (state lifting pattern).
 *
 * Bileşen ağacı:
 *   App
 *   ├── SearchForm   → kullanıcıdan lat/lon/radius alır
 *   ├── PlacesMap    → Google Maps üzerinde sonuçları gösterir
 *   └── PlacesList   → sonuçları kart listesi olarak gösterir
 */
function App() {
  const [places, setPlaces] = useState([]);
  const [center, setCenter] = useState({ lat: 41.0082, lng: 28.9784 }); // İstanbul varsayılan
  const [radius, setRadius] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // İlk açılışta harita görünmesin diye — ilk arama yapılınca true olur
  const [searched, setSearched] = useState(false);

  const handleSearch = async ({ latitude, longitude, radius: nextRadius }) => {
    setLoading(true);
    setError(null);

    try {
      // axios params objesi query string'e otomatik dönüşür
      const { data } = await axios.get(`${API_BASE}/api/nearby`, {
        params: { latitude, longitude, radius: nextRadius },
      });

      // Google Places API yanıtı { results: [...], status: "OK" } formatında gelir
      const results = data.results || [];
      setPlaces(results);
      setCenter({ lat: latitude, lng: longitude });
      setRadius(nextRadius);
      setSearched(true);

      if (results.length === 0) {
        setError('Girdiginiz konum ve yaricap icin sonuc bulunamadi.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Yakin yerler getirilemedi. Backend baglantisini kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Yakin Yer Bulucu</h1>
        <p>Koordinat ve yaricap girerek yakinindaki yerleri kesfet</p>
      </header>

      <main className="app-main">
        <SearchForm onSearch={handleSearch} loading={loading} />

        {error && <div className="error-banner">{error}</div>}

        {searched && !error && (
          <div className="results-container">
            <PlacesMap places={places} center={center} radius={radius} />
            <PlacesList places={places} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
