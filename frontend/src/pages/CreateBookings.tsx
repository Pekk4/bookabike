import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useBookingService } from '@services/bookingService';
import BookingCalendar from '@components/user/BookingCalendar';

/**
 * CreateBookings page is a wrapper component, that renders a booking calendar
 * for users to make bookings.
 *
 * It fetches all booked dates and passes them to the BookingCalendar component.
 * The booked dates are fetched via the booking service.
 */
const CreateBookings = () => {
  const location = useLocation();
  const { getAllBookedDates } = useBookingService();
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await getAllBookedDates();

        if (data) {
          const datesSet = new Set<string>(data);
          setBookedDates(datesSet);
        }
      } catch (error) {
        console.log('Error with fetching bookings: ', error);
      }
    };
    fetchBookings();
  }, [location.pathname, getAllBookedDates]);

  return (
    <>
      <BookingCalendar bookedDates={bookedDates} />
    </>
  );
};

export default CreateBookings;
