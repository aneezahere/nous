"use client";

import { JSX, useState, useEffect } from 'react';
import { ArrowLeft, Phone, AlertCircle, Hospital, Users, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  icon: 'phone' | 'hospital' | 'community' | 'government';
  category: 'emergency' | 'medical' | 'community' | 'government';
}

export default function ContactsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'emergency' | 'medical' | 'community' | 'government'>('all');
  const [userLocation, setUserLocation] = useState<string>('Unknown');
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);

  // Emergency Contacts Data
  const contacts: EmergencyContact[] = [
    {
      name: "Emergency Services",
      number: "911",
      description: "For immediate emergency response",
      icon: "phone",
      category: "emergency"
    },
    {
      name: "Fire Department",
      number: "911",
      description: "Local fire department hotline",
      icon: "phone",
      category: "emergency"
    },
    {
      name: "Regional Hospital",
      number: "911",
      description: "24/7 Emergency medical services",
      icon: "hospital",
      category: "medical"
    },
    {
      name: "Evacuation Center",
      number: "311",
      description: "Community evacuation information",
      icon: "community",
      category: "community"
    },
    {
      name: "Emergency Management",
      number: "311",
      description: "City emergency management office",
      icon: "government",
      category: "government"
    }
  ];

  // Get Icon for each category
  const getIcon = (iconType: string): JSX.Element => {
    switch (iconType) {
      case 'phone':
        return <Phone className="h-5 w-5" />;
      case 'hospital':
        return <Hospital className="h-5 w-5" />;
      case 'community':
        return <Users className="h-5 w-5" />;
      case 'government':
        return <Building2 className="h-5 w-5" />;
      default:
        return <Phone className="h-5 w-5" />;
    }
  };

  // Filter contacts based on selected category
  const filteredContacts = selectedCategory === 'all' 
    ? contacts 
    : contacts.filter(contact => contact.category === selectedCategory);

  // Get category style for the contact
  const getCategoryStyle = (category: string): string => {
    switch (category) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'medical':
        return 'bg-blue-100 text-blue-800';
      case 'community':
        return 'bg-green-100 text-green-800';
      case 'government':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Use the Geolocation API to get the user's location and then reverse geocode it using Google Maps Geocoding API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY;

          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
              const city = data.results[0]?.address_components.find((component: { types: string[] }) => component.types.includes("locality"))?.long_name || "Unknown";
              setUserLocation(city);
              setLoadingLocation(false);
            })
            .catch(() => {
              setUserLocation("Unknown");
              setLoadingLocation(false);
            });
        },
        () => {
          setUserLocation("Unknown");
          setLoadingLocation(false);
        }
      );
    } else {
      setUserLocation("Unknown");
      setLoadingLocation(false);
    }
  }, []);

  if (loadingLocation) {
    return <div>Loading your location...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:text-orange-600 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-semibold">Emergency Contacts</h1>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{userLocation}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Emergency Alert */}
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Important Notice</h3>
              <p className="mt-1 text-red-700">
                Always call 911 first in case of immediate danger or life-threatening emergencies.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-orange-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-orange-50'
            }`}
          >
            All Contacts
          </button>
          {['emergency', 'medical', 'community', 'government'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as 'emergency' | 'medical' | 'community' | 'government')}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                selectedCategory === category 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-orange-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${getCategoryStyle(contact.category)}`}>
                  {getIcon(contact.icon)}
                </div>
                <div>
                  <h3 className="font-semibold">{contact.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{contact.category}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{contact.description}</p>
              <a
                href={`tel:${contact.number}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Phone className="h-4 w-4" />
                {contact.number}
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
