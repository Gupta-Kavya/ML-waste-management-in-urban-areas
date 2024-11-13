import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const LocationMap = () => {
  const [position, setPosition] = useState(null);
  const [message, setMessage] = useState('');

  // Custom marker icon to avoid marker issues in Leaflet
  const markerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  // Fetch user's current location on component mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        const { latitude, longitude } = location.coords;
        setPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        setMessage('Unable to retrieve your location');
        console.error(error);
      }
    );
  }, []);

  // Save coordinates to localStorage
  const handleConfirmLocation = () => {
    if (position) {
      localStorage.setItem('lat', position.lat);
      localStorage.setItem('long', position.lng);
      setMessage('Location saved to localStorage');
       window.location = "http://localhost:3000/"
    } else {
      setMessage('No location data available');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Your Current Location</h2>
      {message && <p className="text-center text-sm text-red-500">{message}</p>}
      
      {position ? (
        <MapContainer center={position} zoom={13} style={{ width: '100%', height: '400px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={markerIcon}>
            <Popup>You are here</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}

      <button
        onClick={handleConfirmLocation}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Confirm Location
      </button>
    </div>
  );
};

export default LocationMap;
