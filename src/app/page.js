'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { unavailableDates } from '../data/unavailable-dates'; // Adjust path as needed

export default function Home() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];

    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates.');
      return;
    }

    if (new Date(checkIn) < new Date(today)) {
      setError('Invalid date selection. Check-in date cannot be in the past.');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError('Check-out date must be after the check-in date.');
      return;
    }

    const minStayDays = 1;
    const stayDuration = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    if (stayDuration < minStayDays) {
      setError(`Minimum stay of ${minStayDays} nights required.`);
      return;
    }

    // Find unavailable dates in the selected range
    const unavailableInRange = unavailableDates.filter(date => {
      const unavailableDate = new Date(date);
      return (
        unavailableDate >= new Date(checkIn) && unavailableDate <= new Date(checkOut)
      );
    });

    if (unavailableInRange.length > 0) {
      const formattedDates = unavailableInRange.map(date => new Date(date).toLocaleDateString()).join(', ');
      setError(`The following dates are unavailable due to maintenance: ${formattedDates}. Please choose different dates.`);
      return;
    }

    router.push(`/room-options?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-xl font-bold">Hotel Luxe</div>
          <div>
            <a href="/" className="hover:underline">Home</a>
            <a href="/about" className="ml-4 hover:underline">About Us</a>
            <a href="/contact" className="ml-4 hover:underline">Contact</a>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative min-h-screen flex items-center justify-center text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10">
            <h1 className="text-3xl font-bold mb-6 text-black">Book Your Stay with Us</h1>
            <p className="text-lg mb-6 text-black">Select your check-in and check-out dates to find the perfect room for your stay.</p>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <div className="mb-4">
              <label className="block text-sm mb-2 text-black">Check-in Date:</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border px-3 py-2 rounded-md text-black bg-gray-200"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm mb-2 text-black">Check-out Date:</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn}
                className="w-full border px-3 py-2 rounded-md text-black bg-gray-200"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
