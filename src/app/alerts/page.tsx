"use client";

import { useState, useEffect } from 'react';
import { AlertCircle, MapPin, ArrowLeft } from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Link from 'next/link';

interface FirePoint {
  latitude: number;
  longitude: number;
  confidence: number;
  acquisition_date: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const isValidCoordinate = (num: any): boolean => {
  return typeof num === 'number' && !isNaN(num) && isFinite(num);
};

export default function AlertsPage() {
  const [wildfires, setWildfires] = useState<FirePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  const fetchWildfireData = async (latitude: number, longitude: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/wildfires?lat=${latitude}&lng=${longitude}`);
      const data = await response.json();

      if (data.status === 'success' && Array.isArray(data.data)) {
        const validWildfires = data.data.filter((fire: FirePoint) =>
          isValidCoordinate(fire.latitude) &&
          isValidCoordinate(fire.longitude)
        );
        setWildfires(validWildfires);
      } else {
        setError('Invalid data received from server');
      }
    } catch (error) {
      setError('Failed to fetch wildfire data');
      console.error('Error fetching wildfire data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          fetchWildfireData(latitude, longitude);
        },
        (error) => {
          console.error('Error obtaining geolocation:', error);
          setError('Unable to retrieve your location');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:text-orange-600 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-semibold">Active Alerts Near You</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg mb-8">
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && mapCenter && (
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={10}
                options={{
                  mapTypeId: 'terrain',
                  mapTypeControl: true
                }}
              >
                {!isLoading && wildfires.map((fire, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: fire.latitude,
                      lng: fire.longitude
                    }}
                    icon={{
                      path: window.google?.maps.SymbolPath.CIRCLE || 'CIRCLE',
                      fillColor: '#ff0000',
                      fillOpacity: 0.7,
                      scale: 8,
                      strokeColor: '#ff0000',
                      strokeWeight: 1,
                    }}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
          {isLoading ? (
            <p className="text-gray-600">Loading alerts...</p>
          ) : wildfires.length > 0 ? (
            <div className="space-y-4">
              {wildfires.slice(0, 5).map((fire, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-medium">Wildfire Detection</p>
                  <p className="text-sm text-gray-600">
                    Location: {fire.latitude.toFixed(2)}°N, {fire.longitude.toFixed(2)}°W
                  </p>
                  <p className="text-sm text-gray-600">
                    Detected: {new Date(fire.acquisition_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent alerts to display.</p>
          )}
        </div>
      </main>
    </div>
  );
}
