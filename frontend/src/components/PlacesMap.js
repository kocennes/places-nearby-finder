import React, { useCallback, useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
  InfoWindow,
} from '@react-google-maps/api';
import './PlacesMap.css';

const MAP_CONTAINER_STYLE = { width: '100%', height: '500px' };

function PlacesMap({ places, center, radius }) {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  const onMapLoad = useCallback(() => {}, []);

  if (loadError) {
    return (
      <div className="map-error">
        Google Maps failed to load. Check your API key in .env file.
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="map-loading">Loading map...</div>;
  }

  return (
    <div className="map-card">
      <h2>Map View <span className="place-count">({places.length} places)</span></h2>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={14}
        onLoad={onMapLoad}
      >
        {/* Search origin marker */}
        <Marker
          position={center}
          title="Search Center"
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          }}
        />

        {/* Radius circle */}
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

        {/* Place markers */}
        {places.map((place) => (
          <Marker
            key={place.place_id}
            position={{
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
            }}
            title={place.name}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {/* Info window for selected place */}
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
              {selectedPlace.rating && (
                <p>Rating: {selectedPlace.rating} / 5</p>
              )}
              {selectedPlace.opening_hours && (
                <p>{selectedPlace.opening_hours.open_now ? 'Open now' : 'Closed'}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default PlacesMap;
