import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useAdminService } from '../services/adminService';
import AdminCalendar from '../components/AdminCalendar';

import { UserDataBooking } from '../types';

const AdminBookings = () => {
  const location = useLocation();
  const { getAllBookings } = useAdminService();
  const [bookings, setBookings] = useState<UserDataBooking[]>([]);

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

  //useEffect(() => {
  //  if (bookedDates.size > 0) {
  //    console.log('bookedDates:', Array.from(bookedDates));
  //  }
  //}, [bookedDates]);

  //useEffect(() => {
  //  if (bookings.length > 0) {
  //    console.log('Bookings:', Array.from(bookings));
  //  }
  //}, [bookings]);

  return (
    <>
      <AdminCalendar bookings={bookings} />
    </>
  );
};

export default AdminBookings;
