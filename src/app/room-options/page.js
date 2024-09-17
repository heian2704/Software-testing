'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { rooms, roomAvailability } from '/Users/heian/Downloads/HotelBookingApp/HotelBookingApp/hotel-booking-app/src/data/rooms.js';

export default function RoomOptions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [unavailableRooms, setUnavailableRooms] = useState([]);
  const [error, setError] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [maxGuestsFilter, setMaxGuestsFilter] = useState('All');
  const [priceRangeFilter, setPriceRangeFilter] = useState('All');

  useEffect(() => {
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);

      // Filter rooms based on availability
      const available = rooms.filter(room => {
        const isAvailable = Object.keys(roomAvailability).every(date => {
          const dateObj = new Date(date);
          if (dateObj >= startDate && dateObj <= endDate) {
            return roomAvailability[date].includes(room.id);
          }
          return true;
        });
        return isAvailable;
      });

      const unavailable = rooms.filter(room => {
        const isUnavailable = Object.keys(roomAvailability).some(date => {
          const dateObj = new Date(date);
          if (dateObj >= startDate && dateObj <= endDate) {
            return !roomAvailability[date].includes(room.id);
          }
          return false;
        });
        return isUnavailable;
      });

      // Apply filters
      const filteredAvailable = applyFilters(available);
      const filteredUnavailable = applyFilters(unavailable);

      if (filteredAvailable.length === 0) {
        setError('No rooms available for the selected dates.');
      } else {
        setAvailableRooms(filteredAvailable);
        setUnavailableRooms(filteredUnavailable);
        setError('');
      }
    }
  }, [checkIn, checkOut, roomTypeFilter, maxGuestsFilter, priceRangeFilter]);

  const applyFilters = (roomsList) => {
    return roomsList.filter(room => {
      const typeMatch = roomTypeFilter === 'All' || room.name.includes(roomTypeFilter);
      const guestsMatch = maxGuestsFilter === 'All' || room.maxGuests <= parseInt(maxGuestsFilter, 10);
      const priceMatch = priceRangeFilter === 'All' || (room.price >= parseFloat(priceRangeFilter.split('-')[0]) && room.price <= parseFloat(priceRangeFilter.split('-')[1]));

      return typeMatch && guestsMatch && priceMatch;
    });
  };

  const handleBooking = (roomId) => {
    router.push(`/payment?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-black">Available Rooms</h1>

        <div className="mb-4 flex gap-4">
          <select
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="border px-3 py-2 rounded-md text-black"
          >
            <option value="All">All Room Types</option>
            <option value="Standard Room">Standard Room</option>
            <option value="Deluxe Room">Deluxe Room</option>
            <option value="Suite">Suite</option>
            <option value="VIP Suite">VIP Suite</option>
            <option value="Luxury Suite">Luxury Suite</option>
            <option value="Penthouse Suite">Penthouse Suite</option>
            <option value="Presidential Suite">Presidential Suite</option>
            <option value="Family Room">Family Room</option>
            <option value="Executive Suite">Executive Suite</option>
            <option value="Honeymoon Suite">Honeymoon Suite</option>
          </select>
          
          <select
            value={maxGuestsFilter}
            onChange={(e) => setMaxGuestsFilter(e.target.value)}
            className="border px-3 py-2 rounded-md text-black"
          >
            <option value="All">Max Guests</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10</option>
          </select>

          <select
            value={priceRangeFilter}
            onChange={(e) => setPriceRangeFilter(e.target.value)}
            className="border px-3 py-2 rounded-md text-black"
          >
            <option value="All">Price Range</option>
            <option value="0-100">$0 - $100</option>
            <option value="101-200">$101 - $200</option>
            <option value="201-300">$201 - $300</option>
            <option value="301-400">$301 - $400</option>
            <option value="401-500">$401 - $500</option>
            <option value="500-1000">$500 - $1000</option>
          </select>
        </div>

        {error && <div className="mb-4 text-red-500">{error}</div>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableRooms.map(room => (
            <div key={room.id} className="bg-gray-200 p-4 rounded-md shadow-lg">
              <h2 className="text-lg font-semibold text-black">{room.name}</h2>
              <p className="text-black">Price: ${room.price} per night</p>
              <p className="text-black">Max Guests: {room.maxGuests}</p>
              <button
                onClick={() => handleBooking(room.id)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mt-2"
              >
                Book Now
              </button>
            </div>
          ))}
          {availableRooms.length === 0 && !error && (
            <p className="mt-4 text-black">No rooms available for the selected dates.</p>
          )}
        </div>

        {unavailableRooms.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-red-500">Unavailable Rooms</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="w-full bg-gray-200 border-b">
                  <th className="py-2 px-4 text-left text-black">Room Type</th>
                  <th className="py-2 px-4 text-left text-black">Price</th>
                  <th className="py-2 px-4 text-left text-black">Max Guests</th>
                  <th className="py-2 px-4 text-left text-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {unavailableRooms.map(room => (
                  <tr key={room.id} className="border-b">
                    <td className="py-2 px-4 text-black">{room.name}</td>
                    <td className="py-2 px-4 text-black">${room.price} per night</td>
                    <td className="py-2 px-4 text-black">{room.maxGuests}</td>
                    <td className="py-2 px-4 text-red-500">Unavailable</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
