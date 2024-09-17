// src/data/room-data.js

// List of rooms with their details
export const rooms = [
  { id: '1', name: 'Standard Room', price: 100, maxGuests: 2 },
  { id: '2', name: 'Standard Room', price: 100, maxGuests: 2 },
  { id: '3', name: 'Standard Room', price: 100, maxGuests: 2 },
  { id: '4', name: 'Standard Room', price: 100, maxGuests: 2 },
  { id: '5', name: 'Deluxe Room', price: 150, maxGuests: 3 },
  { id: '6', name: 'Deluxe Room', price: 150, maxGuests: 3 },
  { id: '7', name: 'Suite', price: 250, maxGuests: 4 },
  { id: '8', name: 'Suite', price: 250, maxGuests: 4 },
  { id: '9', name: 'VIP Suite', price: 300, maxGuests: 5 },
  { id: '10', name: 'Luxury Suite', price: 400, maxGuests: 6 },
  { id: '11', name: 'Penthouse Suite', price: 500, maxGuests: 8 },
  { id: '12', name: 'Presidential Suite', price: 600, maxGuests: 10 },
  { id: '13', name: 'Family Room', price: 200, maxGuests: 4 },
  { id: '14', name: 'Executive Suite', price: 350, maxGuests: 4 },
  { id: '15', name: 'Honeymoon Suite', price: 450, maxGuests: 2 },
];

// Room availability data with a mix of available and unavailable dates in September 2024
export const roomAvailability = {
  '2024-09-17': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'], // All rooms available
  '2024-09-18': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'], // All rooms available
  '2024-09-19': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'], // All rooms available
  '2024-09-20': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'], // All rooms available
  '2024-09-21': ['1', '2', '3', '5', '6', '7', '9', '10', '13', '14'], // Some rooms unavailable
  '2024-09-22': ['1', '3', '4', '5', '7', '8', '9', '10', '13', '14'], // Some rooms unavailable
  '2024-09-23': ['1', '2', '4', '5', '6', '7', '8', '9', '13', '14', '15'], // Some rooms unavailable
  '2024-09-24': ['1', '2', '3', '5', '6', '7', '9', '10', '13', '15'], // Some rooms unavailable
  '2024-09-25': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '13', '14', '15'], // Mix of available and unavailable
  '2024-09-26': ['1', '2', '3', '4', '5', '7', '8', '9', '10', '13', '14'], // Mix of available and unavailable
  '2024-09-27': ['1', '2', '4', '5', '6', '8', '9', '10', '13', '15'], // Mix of available and unavailable
  '2024-09-28': ['1', '3', '4', '5', '6', '8', '10', '13', '14', '15'], // Mix of available and unavailable
  '2024-09-29': ['1', '2', '4', '5', '7', '8', '10', '13', '15'], // Mix of available and unavailable
  '2024-09-30': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'], // All rooms available
};
