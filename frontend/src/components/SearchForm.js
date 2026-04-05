import React, { useState } from 'react';
import './SearchForm.css';

function SearchForm({ onSearch, loading }) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');
  const [validationError, setValidationError] = useState('');

  const validate = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseInt(radius, 10);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return 'Latitude must be between -90 and 90.';
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      return 'Longitude must be between -180 and 180.';
    }
    if (isNaN(rad) || rad < 1 || rad > 50000) {
      return 'Radius must be between 1 and 50000 meters.';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError('');
    onSearch({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseInt(radius, 10),
    });
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setValidationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
      },
      () => setValidationError('Unable to retrieve your location.')
    );
  };

  return (
    <div className="search-card">
      <h2>Search Nearby Places</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
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
            <label htmlFor="longitude">Longitude</label>
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
            <label htmlFor="radius">Radius (meters)</label>
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

        {validationError && (
          <p className="validation-error">{validationError}</p>
        )}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={useCurrentLocation}>
            Use My Location
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
