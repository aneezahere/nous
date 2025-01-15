"use client";

import { AlertCircle, Shield, Route, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-6xl font-bold text-center text-gray-900 mb-6">
        Wildsave
        </h1>
        <p className="text-xl text-center text-gray-700 mb-12 max-w-2xl mx-auto">
          Real-time alerts and safety information to protect you and your loved ones during wildfire emergencies.
        </p>

        {/* Quick Emergency Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/alerts" 
            className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
                <p className="text-gray-600">Check current wildfire alerts in your area</p>
              </div>
            </div>
          </Link>

          <Link href="/preparedness"
            className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Preparedness</h3>
                <p className="text-gray-600">Emergency checklists and safety quizzes</p>
              </div>
            </div>
          </Link>

          <Link href="/routes"
            className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                <Route className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Evacuation Routes</h3>
                <p className="text-gray-600">Find safe evacuation paths</p>
              </div>
            </div>
          </Link>

          <Link href="/contacts"
            className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
                <p className="text-gray-600">Quick access to emergency services</p>
              </div>
            </div>
          </Link>
        </div>

        {/* AI Assistant Link */}
        <div className="mt-12 text-center">
          <Link 
            href="/chat"
            className="inline-flex items-center px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <span className="mr-2">Talk to our AI Assistant</span>
            <AlertCircle className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}