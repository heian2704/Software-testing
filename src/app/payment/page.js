'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { rooms, roomAvailability } from '../../data/rooms';

export default function Payment() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPage />
    </Suspense>
  );
}

function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState(searchParams.get('roomId') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [totalCost, setTotalCost] = useState(0); // New state to hold the total cost

  // Calculate number of nights between checkIn and checkOut
  const calculateNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  };

  // Calculate total cost when roomId, checkIn, or checkOut changes
  useEffect(() => {
    if (roomId && checkIn && checkOut) {
      const selectedRoom = rooms.find((room) => room.id === roomId);
      if (selectedRoom) {
        const nights = calculateNights(checkIn, checkOut);
        setTotalCost(selectedRoom.price * nights);
      }
    }
  }, [roomId, checkIn, checkOut]);

  const validateForm = () => {
    const newErrors = {};
    
    // Check for empty fields
    if (!cardNumber) newErrors.cardNumber = 'Card number is required.';
    if (!expiryMonth || !expiryYear) newErrors.expiryDate = 'Expiry date is required.';
    if (!cvv) newErrors.cvv = 'CVV is required.';

    // Example validation for card number (simple format check)
    if (cardNumber && !/^\d{9}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Card number must be 9 digits.';
    }

    // Example validation for CVV (simple format check)
    if (cvv && !/^\d{3}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate successful payment
      setPaymentSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push('/');
      }, 2000); // Redirect after 2 seconds
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-black">Payment</h1>

        {paymentSuccess ? (
          <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-md mb-4">
            <p className="text-center text-black">Payment successful! Your booking is confirmed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="roomId" className="block text-sm font-medium text-black">Room ID</label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="border px-3 py-2 rounded-md w-full border-gray-300 text-black"
                disabled
              />
            </div>

            <div className="mb-4">
              <label htmlFor="checkIn" className="block text-sm font-medium text-black">Check-In</label>
              <input
                type="text"
                id="checkIn"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border px-3 py-2 rounded-md w-full border-gray-300 text-black"
                disabled
              />
            </div>

            <div className="mb-4">
              <label htmlFor="checkOut" className="block text-sm font-medium text-black">Check-Out</label>
              <input
                type="text"
                id="checkOut"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border px-3 py-2 rounded-md w-full border-gray-300 text-black"
                disabled
              />
            </div>

            <div className="mb-4">
              <label htmlFor="totalCost" className="block text-sm font-medium text-black">Total Cost</label>
              <input
                type="text"
                id="totalCost"
                value={`$${totalCost}`}
                className="border px-3 py-2 rounded-md w-full border-gray-300 text-black"
                disabled
              />
            </div>

            <div className="mb-4">
              <label htmlFor="cardNumber" className="block text-sm font-medium text-black">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className={`border px-3 py-2 rounded-md w-full ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} text-black`}
              />
              {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
            </div>

            <div className="mb-4 flex gap-4">
              <div className="w-1/2">
                <label htmlFor="expiryMonth" className="block text-sm font-medium text-black">Expiry Month</label>
                <select
                  id="expiryMonth"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  className={`border px-3 py-2 rounded-md w-full ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} text-black`}
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month.toString().padStart(2, '0')}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
              </div>

              <div className="w-1/2">
                <label htmlFor="expiryYear" className="block text-sm font-medium text-black">Expiry Year</label>
                <select
                  id="expiryYear"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  className={`border px-3 py-2 rounded-md w-full ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} text-black`}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="cvv" className="block text-sm font-medium text-black">CVV</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className={`border px-3 py-2 rounded-md w-full ${errors.cvv ? 'border-red-500' : 'border-gray-300'} text-black`}
              />
              {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Complete Payment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
