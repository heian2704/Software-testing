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

    const isUnavailable = unavailableDates.some(date => {
      const unavailableDate = new Date(date);
      return (
        (unavailableDate >= new Date(checkIn) && unavailableDate <= new Date(checkOut))
      );
    });

    if (isUnavailable) {
      setError('No rooms available for the selected dates due to maintenance.');
      return;
    }

    router.push(`/room-options?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-black">Select Your Dates</h1>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm mb-2 text-black">Check-in Date:</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border px-3 py-2 rounded-md text-black"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-2 text-black">Check-out Date:</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn}
            className="w-full border px-3 py-2 rounded-md text-black"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
