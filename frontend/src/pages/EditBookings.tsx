import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useBookingService } from '@services/bookingService';
import BookingCalendar from '@components/user/BookingCalendar';

const getDatesInRange = (start: string, end: string): string[] => {
  const dates: string[] = [];
  const current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    dates.push(current.toDateString());
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

/**
 * EditBookings page is a wrapper component that allows users to edit an existing booking.
 *
 * It fetches all booked dates and excludes the dates of the booking being edited,
 * allowing users to select new dates for the booking.
 * The booked dates are fetched via the booking service.
 */
const EditBookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getAllBookedDates } = useBookingService();
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const bookingToEdit = location.state?.booking;

  useEffect(() => {
    if (!bookingToEdit) {
      navigate('/me');
    }
  }, [bookingToEdit, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await getAllBookedDates();

        if (data && bookingToEdit) {
          const datesSet = new Set<string>(data);
          const editableDates = getDatesInRange(bookingToEdit.startDate, bookingToEdit.endDate);

          editableDates.forEach((date) => datesSet.delete(date));
          setBookedDates(datesSet);
        }
      } catch (error) {
        // TODO: handle properly
        console.log('Error with fetching bookings: ', error);
      }
    };
    fetchBookings();
    //// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingToEdit, getAllBookedDates]);

  if (!bookingToEdit) return null;

  return (
    <>
      <BookingCalendar bookedDates={bookedDates} bookingToUpdate={bookingToEdit} />
    </>
  );
};

export default EditBookings;
