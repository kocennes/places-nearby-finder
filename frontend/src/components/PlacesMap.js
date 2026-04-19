import { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import './PlacesMap.css';

const MAP_CONTAINER_STYLE = { width: '100%', height: '500px' };

function PlacesMap({ places, center, radius }) {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  if (loadError) {
    return <div className="map-error">Google Harita yuklenemedi. API anahtarini kontrol edin.</div>;
  }

  if (!isLoaded) {
    return <div className="map-loading">Harita yukleniyor...</div>;
  }

  return (
    <div className="map-card">
      <h2>
        Harita <span className="place-count">({places.length} yer)</span>
      </h2>
      <GoogleMap mapContainerStyle={MAP_CONTAINER_STYLE} center={center} zoom={14}>
        <Marker
          position={center}
          title="Arama Merkezi"
          icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
        />

        <Circle
          center={center}
          radius={radius}
          options={{
            fillColor: '#0f3460',
            fillOpacity: 0.08,
            strokeColor: '#0f3460',
            strokeOpacity: 0.5,
            strokeWeight: 1.5,
          }}
        />

        {places.map((place) => (
          <Marker
            key={place.place_id}
            position={{ lat: place.geometry.location.lat, lng: place.geometry.location.lng }}
            title={place.name}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {selectedPlace && (
          <InfoWindow
            position={{
              lat: selectedPlace.geometry.location.lat,
              lng: selectedPlace.geometry.location.lng,
            }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="info-window">
              <strong>{selectedPlace.name}</strong>
              <p>{selectedPlace.vicinity}</p>
              {selectedPlace.rating && <p>Puan: {selectedPlace.rating} / 5</p>}
              {selectedPlace.opening_hours && (
                <p>{selectedPlace.opening_hours.open_now ? 'Su an acik' : 'Kapali'}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default PlacesMap;
