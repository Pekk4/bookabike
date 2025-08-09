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
        // TODO: handle properly
        console.log('Error with fetching bookings: ', error);
      }
    };
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <BookingCalendar bookedDates={bookedDates} />
    </>
  );
};

export default CreateBookings;
