"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Route,
  Navigation,
} from "lucide-react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import Link from "next/link";

// Types for location
interface Location {
  lat: number;
  lng: number;
}

export default function EvacuationRoutesPage() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyHazards, setNearbyHazards] = useState<Array<{ lat: number, lng: number }> | null>(null); // Corrected type for hazards
  const [hasHazard, setHasHazard] = useState(false); // Flag to track if there's any hazard

  // Get user location using the Geolocation API
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting geolocation", error);
          setCurrentLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco if there's an error
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  };

  const calculateRoute = (dest: Location) => {
    if (!currentLocation) return;
    setIsLoading(true);
    setDestination(dest);
  };

  const directionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === "OK" && result) {
      setDirections(result);
    }
    setIsLoading(false);
  };

  const fetchFireData = async () => {
    const mapKey = process.env.NEXT_PUBLIC_FIRMS_MAP_KEY;

    if (!mapKey) {
      console.error("FIRMS API MAP_KEY not found.");
      return;
    }

    const apiUrl = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${mapKey}/VIIRS_SNPP_NRT/USA/1`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.text();
      
      // Parsing the CSV data into usable format
      const parsedData = data.split("\n").map(line => {
        const [latitude, longitude] = line.split(",");
        return { lat: parseFloat(latitude), lng: parseFloat(longitude) };
      }).filter((hazard) => !isNaN(hazard.lat) && !isNaN(hazard.lng)); // Filter out invalid data

      setNearbyHazards(parsedData); // Save fire data for nearby hazards
      setHasHazard(parsedData.length > 0); // Set the hazard flag based on the presence of data
    } catch (error) {
      console.error("Error fetching fire data:", error);
    }
  };

  useEffect(() => {
    getUserLocation(); // Get user's current location on page load
    fetchFireData(); // Fetch fire data from NASA FIRMS API
  }, []);

  const safeZones = [
    { name: "Emergency Shelter A", location: { lat: 37.7858, lng: -122.4008 } },
    { name: "Medical Center", location: { lat: 37.7649, lng: -122.4342 } },
    { name: "Community Center", location: { lat: 37.8044, lng: -122.4706 } },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <ArrowLeft className="h-6 w-6 hover:text-orange-600 transition-colors" />
              </Link>
              <h1 className="text-2xl font-semibold">Evacuation Routes</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            {/* Only show safe zones when there is a hazard */}
            {hasHazard && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-orange-600" />
                  Safe Zones
                </h2>
                <div className="space-y-3">
                  {safeZones.map((zone, index) => (
                    <button
                      key={index}
                      onClick={() => calculateRoute(zone.location)}
                      className="w-full p-4 text-left bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      <p className="font-medium">{zone.name}</p>
                      <p className="text-sm text-gray-600">
                        {zone.location.lat.toFixed(4)}, {zone.location.lng.toFixed(4)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Show evacuation route if there is a hazard */}
            {hasHazard && directions && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Route className="h-5 w-5 text-orange-600" />
                  Route Details
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Distance: {directions?.routes[0]?.legs[0]?.distance?.text || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {directions?.routes[0]?.legs[0]?.duration?.text || "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* Message when no hazard is detected */}
            {!hasHazard && (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <p className="text-lg font-semibold text-green-500">No threats or alarms detected. Your routes are clear.</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-[600px]">
              <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={currentLocation || { lat: 37.7749, lng: -122.4194 }} // Default to SF if location not yet set
                  zoom={13}
                >
                  {hasHazard && destination && (
                    <DirectionsService
                      options={{
                        origin: currentLocation || { lat: 37.7749, lng: -122.4194 },
                        destination: destination,
                        travelMode: google.maps.TravelMode.DRIVING,
                      }}
                      callback={directionsCallback}
                    />
                  )}
                  {directions && hasHazard && (
                    <DirectionsRenderer
                      options={{
                        directions: directions,
                      }}
                    />
                  )}

                  {/* Display nearby fire hazards if any */}
                  {hasHazard && nearbyHazards?.map((hazard, index) => (
                    <Marker
                      key={index}
                      position={hazard}
                      icon={{
                        url: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Fire_Icon.svg", // Example fire icon
                        scaledSize: new google.maps.Size(40, 40),
                      }}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
