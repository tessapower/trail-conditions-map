import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
// Fix for default markers in React-Leaflet
import L, { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const AUSTIN_CENTER: LatLngExpression = [30.2672, -97.7431];
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

// Sample trail data for testing
const sampleTrails = [
  {
    id: 1,
    name: 'Barton Creek Greenbelt',
    position: [30.264, -97.8147] as LatLngExpression,
    difficulty: 'Intermediate',
    status: 'Open',
    lastUpdated: '2 hours ago',
  },
  {
    id: 2,
    name: 'Walnut Creek Trail',
    position: [30.3588, -97.6897] as LatLngExpression,
    difficulty: 'Beginner',
    status: 'Open',
    lastUpdated: '1 hour ago',
  },
  {
    id: 3,
    name: 'St. Edwards Park',
    position: [30.2297, -97.8814] as LatLngExpression,
    difficulty: 'Advanced',
    status: 'Needs Update',
    lastUpdated: '6 hours ago',
  },
];

const TrailMap: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={AUSTIN_CENTER}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="© MapTiler © OpenStreetMap contributors"
          url={`https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
        />
        {sampleTrails.map((trail) => (
          <Marker key={trail.id} position={trail.position}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{trail.name}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Difficulty:</strong> {trail.difficulty}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong>
                  <span
                    className={`ml-1 px-2 py-1 rounded text-xs ${
                      trail.status === 'Open'
                        ? 'bg-green-100 text-green-800'
                        : trail.status === 'Closed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {trail.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {trail.lastUpdated}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TrailMap;
