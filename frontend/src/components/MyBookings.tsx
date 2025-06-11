import { useState, useEffect } from 'react';

import { useBookingService } from '../services/bookingService';
import useKeycloak from '../hooks/useKeycloak';

import { Booking } from '../types';

const MyBookings = () => {
  const { getBookingsByUserId } = useBookingService();
  const { keycloak } = useKeycloak();

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = keycloak?.idTokenParsed?.sub;
        if (!userId) return;
        const { data } = await getBookingsByUserId(userId);
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="h-screen w-screen grid grid-rows-3 justify-center items-center text-center">
      <div>
        <p className="text-xl font-bold">Book a bike!</p>
      </div>
      <div>
        {bookings &&
          bookings.map((booking, index) => (
            <div key={index} className="border p-4 m-2">
              <p>Booking ID: {index}</p>
              <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
              <p>User ID: {booking.userId}</p>
            </div>
          ))}
        {bookings.length === 0 && <p>{'No bookings yet :('}</p>}
      </div>
      <div>
        <p>Placeholder</p>
      </div>
    </div>
  );
};

export default MyBookings;
