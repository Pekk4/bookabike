import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useBookingService } from '../services/bookingService';
import AdminCalendar from '../components/AdminCalendar';

import { Booking } from '../types';

const AdminBookings = () => {
  const location = useLocation();
  const { getAllBookings } = useBookingService();
  const [bookings, setBookings] = useState<Booking[]>([]);

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

  //useEffect(() => {
  //  if (bookedDates.size > 0) {
  //    console.log('bookedDates:', Array.from(bookedDates));
  //  }
  //}, [bookedDates]);

  return (
    <>
      <AdminCalendar bookings={bookings} />
    </>
  );
};

export default AdminBookings;
