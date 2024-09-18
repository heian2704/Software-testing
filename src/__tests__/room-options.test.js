// RoomOptions.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import RoomOptions from './room-options';
import { rooms, roomAvailability } from '../data/rooms';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock rooms data
const mockRooms = [
  { id: 1, name: 'Standard Room', price: 100, maxGuests: 2 },
  { id: 2, name: 'Deluxe Room', price: 200, maxGuests: 3 },
];

const mockRoomAvailability = {
  '2024-01-01': [1], // Room 1 is available on this date
  '2024-01-02': [1], // Room 1 is available on this date
  '2024-01-03': [2], // Room 2 is available on this date
};

// Mock useRouter to simulate query params
useRouter.mockReturnValue({
  push: jest.fn(),
  query: { checkIn: '2024-01-01', checkOut: '2024-01-03' },
});

jest.mock('../../data/rooms', () => ({
  rooms: mockRooms,
  roomAvailability: mockRoomAvailability,
}));

describe('RoomOptions Component', () => {
  test('renders RoomOptions and checks availability logic', async () => {
    render(<RoomOptions />);

    // Wait for rooms to be filtered and rendered
    await waitFor(() => {
      const roomElements = screen.getAllByText(/Price: \$/);
      expect(roomElements).toHaveLength(1); // Only one available room
    });

    // Check the first available room's name and price
    const roomName = screen.getByText('Standard Room');
    const roomPrice = screen.getByText('Price: $100 per night');
    expect(roomName).toBeInTheDocument();
    expect(roomPrice).toBeInTheDocument();
  });

  test('displays an error message when no rooms are available', async () => {
    useRouter.mockReturnValue({
      push: jest.fn(),
      query: { checkIn: '2024-01-05', checkOut: '2024-01-06' }, // No rooms available on these dates
    });

    render(<RoomOptions />);

    await waitFor(() => {
      const errorMessage = screen.getByText('No rooms available for the selected dates.');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('handles booking button click correctly', async () => {
    const mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush,
      query: { checkIn: '2024-01-01', checkOut: '2024-01-03' },
    });

    render(<RoomOptions />);

    // Wait for the room to appear
    await waitFor(() => {
      const bookButton = screen.getByText('Book Now');
      fireEvent.click(bookButton);
    });

    // Expect router.push to have been called with the correct URL
    expect(mockPush).toHaveBeenCalledWith('/payment?roomId=1&checkIn=2024-01-01&checkOut=2024-01-03');
  });

  test('applies filters correctly (room type, guests, price)', async () => {
    render(<RoomOptions />);

    // Change room type filter
    fireEvent.change(screen.getByDisplayValue('All Room Types'), {
      target: { value: 'Deluxe Room' },
    });

    // Check the available rooms after filtering by type
    await waitFor(() => {
      const roomName = screen.getByText('Deluxe Room');
      expect(roomName).toBeInTheDocument();
    });

    // Change max guests filter
    fireEvent.change(screen.getByDisplayValue('Max Guests'), {
      target: { value: '3' },
    });

    await waitFor(() => {
      const roomGuests = screen.getByText('Max Guests: 3');
      expect(roomGuests).toBeInTheDocument();
    });

    // Change price range filter
    fireEvent.change(screen.getByDisplayValue('Price Range'), {
      target: { value: '101-200' },
    });

    await waitFor(() => {
      const roomPrice = screen.getByText('Price: $200 per night');
      expect(roomPrice).toBeInTheDocument();
    });
  });
});
