import { useState } from 'react';
import SearchForm from './components/SearchForm';
import PlacesMap from './components/PlacesMap';
import PlacesList from './components/PlacesList';
import axios from 'axios';
import './App.css';

// Backend URL'si environment variable'dan okunur.
// .env dosyasında tanımlı değilse localhost:8070'e düşer (development için)
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8070';

/**
 * Uygulamanın ana bileşeni. Tüm state burada tutulur ve
 * alt bileşenlere props olarak iletilir (state lifting).
 *
 * Bileşen ağacı:
 *   App
 *   ├── SearchForm   → kullanıcıdan lat/lon/radius alır
 *   ├── PlacesMap    → Google Maps üzerinde sonuçları gösterir
 *   └── PlacesList   → sonuçları kart listesi olarak gösterir
 */
function App() {
  // Harita ve listede gösterilecek yer listesi
  const [places, setPlaces] = useState([]);

  // Haritanın odaklandığı merkez koordinat (varsayılan: İstanbul)
  const [center, setCenter] = useState({ lat: 41.0082, lng: 28.9784 });

  // Haritadaki yarıçap dairesi için kullanılır
  const [radius, setRadius] = useState(1000);

  // Arama devam ederken buton devre dışı kalır, yükleniyor göstergesi çıkar
  const [loading, setLoading] = useState(false);

  // API veya validation hatası mesajını tutar
  const [error, setError] = useState(null);

  // İlk açılışta harita ve liste görünmesin diye, ilk arama sonrası true olur
  const [searched, setSearched] = useState(false);

  /**
   * SearchForm'dan gelen koordinat ve yarıçap ile backend'e istek atar.
   * Sonuçları state'e kaydeder, harita ve liste otomatik güncellenir.
   */
  const handleSearch = async ({ latitude, longitude, radius: r }) => {
    setLoading(true);
    setError(null);
    try {
      // axios params objesi query string'e otomatik dönüşür:
      // /api/nearby?latitude=...&longitude=...&radius=...
      const { data } = await axios.get(`${API_BASE}/api/nearby`, {
        params: { latitude, longitude, radius: r },
      });

      // Google Places API yanıtı { results: [...], status: "OK" } formatında gelir
      const results = data.results || [];
      setPlaces(results);
      setCenter({ lat: latitude, lng: longitude });
      setRadius(r);
      setSearched(true);

      // API başarılı dönse bile sonuç boş olabilir (ıssız bir alan girilmiş olabilir)
      if (results.length === 0) {
        setError('Girilen konum ve yarıçap için herhangi bir yer bulunamadı.');
      }
    } catch (err) {
      // Backend'den gelen hata mesajı varsa onu, yoksa genel mesajı göster
      setError(err.response?.data?.error || 'Yakın yerler getirilemdi. Backend bağlantısını kontorl edin.');
    } finally {
      // Hata da olsa başarı da olsa loading durumunu kapat
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Yakın Yer Bulucu</h1>
        <p>Koordinat ve yarıçap girerek yakınındaki yerleri keşfet</p>
      </header>

      <main className="app-main">
        {/* onSearch callback'i ile form buradaki handleSearch'ü tetikler */}
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* Hata varsa kırmızı banner göster */}
        {error && (
          <div className="error-banner">{error}</div>
        )}

        {/* İlk arama yapılmadan harita ve liste görünmez */}
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
