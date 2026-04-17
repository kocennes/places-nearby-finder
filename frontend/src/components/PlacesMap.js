import { useCallback, useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
  InfoWindow,
} from '@react-google-maps/api';
import './PlacesMap.css';

// Harita container boyutu — inline style olarak GoogleMap bileşenine verilir
const MAP_CONTAINER_STYLE = { width: '100%', height: '500px' };

/**
 * Google Maps üzerinde arama sonuçlarını gösteren bileşen.
 *
 * Props:
 *   places  → gösterilecek yer listesi (her birinin geometry.location.lat/lng'si var)
 *   center  → haritanın odaklandığı merkez koordinat { lat, lng }
 *   radius  → mavi yarıçap dairesinin boyutu (metre)
 */
function PlacesMap({ places, center, radius }) {
  // Tıklanan pin'in bilgilerini tutar, InfoWindow bu state ile açılıp kapanır
  const [selectedPlace, setSelectedPlace] = useState(null);

  /**
   * useJsApiLoader: Google Maps JavaScript SDK'sını lazy load eder.
   * Bileşen render olmadan önce script yüklenmiş olmak zorunda değil,
   * isLoaded true olduğunda harita render edilir.
   */
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  // useCallback: harita yüklenince çalışacak fonksiyon, gereksiz re-render engeller
  const onMapLoad = useCallback(() => {}, []);

  // API key hatalıysa veya ağ yoksa hata mesajı göster
  if (loadError) {
    return (
      <div className="map-error">
        Google Harita yüklenemdi. .env dosyasındaki API anahtarını kontrol edin.
      </div>
    );
  }

  // Script henüz yüklenmediyse yükleniyor mesajı göster
  if (!isLoaded) {
    return <div className="map-loading">Harita yükleniyor...</div>;
  }

  return (
    <div className="map-card">
      <h2>Harita <span className="place-count">({places.length} yer)</span></h2>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={14}
        onLoad={onMapLoad}
      >
        {/* Arama merkezi — mavi nokta ile diğer pinlerden ayırt edilir */}
        <Marker
          position={center}
          title="Arama Merkezi"
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          }}
        />

        {/* Arama yarıçapını görsel olarak haritada gösteren daire */}
        <Circle
          center={center}
          radius={radius}
          options={{
            fillColor: '#0f3460',
            fillOpacity: 0.08,      // hafif şeffaf dolgu
            strokeColor: '#0f3460',
            strokeOpacity: 0.5,
            strokeWeight: 1.5,
          }}
        />

        {/* Her yer için haritaya kırmızı pin ekle */}
        {places.map((place) => (
          <Marker
            key={place.place_id}
            position={{
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
            }}
            title={place.name}
            // Pin'e tıklanınca o yer selectedPlace state'ine atanır
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {/*
          Bir pin'e tıklandığında o yerin üzerinde bilgi baloncuğu açar.
          selectedPlace null ise hiçbir şey render edilmez.
        */}
        {selectedPlace && (
          <InfoWindow
            position={{
              lat: selectedPlace.geometry.location.lat,
              lng: selectedPlace.geometry.location.lng,
            }}
            // Baloncuğun X butonuna basılınca selectedPlace sıfırlanır, kapanır
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="info-window">
              <strong>{selectedPlace.name}</strong>
              <p>{selectedPlace.vicinity}</p>
              {selectedPlace.rating && (
                <p>Puan: {selectedPlace.rating} / 5</p>
              )}
              {selectedPlace.opening_hours && (
                <p>{selectedPlace.opening_hours.open_now ? 'Şu an açık' : 'Kapalı'}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default PlacesMap;
