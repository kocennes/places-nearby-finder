import { useState } from 'react';
import axios from 'axios';
import SearchForm from './components/SearchForm';
import PlacesMap from './components/PlacesMap';
import PlacesList from './components/PlacesList';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8070';

function App() {
  const [places, setPlaces] = useState([]);
  const [center, setCenter] = useState({ lat: 41.0082, lng: 28.9784 });
  const [radius, setRadius] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async ({ latitude, longitude, radius: nextRadius }) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${API_BASE}/api/nearby`, {
        params: { latitude, longitude, radius: nextRadius },
      });

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
