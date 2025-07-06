import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useBookingService } from '../services/bookingService';

import { AdminBooking } from '../types';
import BookingsManager from '../components/BookingsManager';

const ManageBookings = () => {
  const location = useLocation();
  const { getAllBookings } = useBookingService();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);

  //
  // To be changed to not include wished bookings
  //
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await getAllBookings();

        if (data) {
          setBookings(data);
        }
      } catch (error) {
        // TODO: handle properly
        console.log('Error with fetching bookings: ', error);
      }
    };
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <BookingsManager bookings={bookings} />
    </>
  );
};

export default ManageBookings;
