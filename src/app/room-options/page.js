'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { rooms, roomAvailability } from '../../data/rooms';

const RoomOptions = () => {
  const router = useRouter();
  const { query } = router;
  const searchParams = query; // Accessing query parameters

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [unavailableRooms, setUnavailableRooms] = useState([]);
  const [error, setError] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [maxGuestsFilter, setMaxGuestsFilter] = useState('All');
  const [priceRangeFilter, setPriceRangeFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const handleBooking = useCallback((roomId) => {
    router.push(`/payment?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`);
  }, [router, checkIn, checkOut]);

  const applyFilters = useCallback((roomsList) => {
    return roomsList.filter((room) => {
      const typeMatch = roomTypeFilter === 'All' || room.name.includes(roomTypeFilter);
      const guestsMatch = maxGuestsFilter === 'All' || room.maxGuests === parseInt(maxGuestsFilter, 10);
      const priceMatch = priceRangeFilter === 'All' || (room.price >= parseFloat(priceRangeFilter.split('-')[0]) && room.price <= parseFloat(priceRangeFilter.split('-')[1]));

      return typeMatch && guestsMatch && priceMatch;
    });
  }, [roomTypeFilter, maxGuestsFilter, priceRangeFilter]);

  useEffect(() => {
    if (searchParams) {
      setCheckIn(searchParams.checkIn || '');
      setCheckOut(searchParams.checkOut || '');
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);

      const available = rooms.filter((room) => {
        const isAvailable = Object.keys(roomAvailability).every((date) => {
          const dateObj = new Date(date);
          if (dateObj >= startDate && dateObj <= endDate) {
            return roomAvailability[date].includes(room.id);
          }
          return true;
        });
        return isAvailable;
      });

      const unavailable = rooms.filter((room) => {
        const isUnavailable = Object.keys(roomAvailability).some((date) => {
          const dateObj = new Date(date);
          if (dateObj >= startDate && dateObj <= endDate) {
            return !roomAvailability[date].includes(room.id);
          }
          return false;
        });
        return isUnavailable;
      });

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!router.isReady) {
    return <div>Loading...</div>;
  }

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
            <option value="1">1</option>
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
          {availableRooms.map((room) => (
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
            <ul className="list-disc pl-4">
              {unavailableRooms.map((room) => (
                <li key={room.id} className="text-black">{room.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
export default RoomOptions;