import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import { useBookingService } from '@services/bookingService';
import BookingCalendar, { BookingCalendarHandle } from '@components/user/BookingCalendar';
import useModal from '@hooks/useModal';
import { dateLocale } from '@constants';
import {
  getBookingUpdateConfirmationMessage,
  getBookingUpdateSuccessMessage,
  getLoadingSpinner,
  getBookingErrorMessage,
} from '@utils/modalMessages';
import { Booking } from '@types';

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
 * It also handles the booking update process and all necessary dialogs.
 */
const EditBookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getAllBookedDates, updateBooking } = useBookingService();
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const { showModal, hideModal } = useModal();
  const bookingToEdit = location.state?.booking;
  const calendarRef = useRef<BookingCalendarHandle>(null);

  useEffect(() => {
    if (!bookingToEdit) {
      navigate('/my-bookings');
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
        console.log('Error with fetching bookings: ', error);
      }
    };
    fetchBookings();
  }, [bookingToEdit, getAllBookedDates]);

  if (!bookingToEdit) return null;

  const handleUpdateBooking = (start: Date, end: Date, booking: Booking) => {
    const startFormatted = start.toLocaleDateString(dateLocale);
    const endFormatted = end.toLocaleDateString(dateLocale);

    showModal(
      getBookingUpdateConfirmationMessage(startFormatted, endFormatted),
      'ask',
      () => onConfirm(start, end, booking),
      onCancel
    );
  };

  const onConfirm = async (start: Date, end: Date, booking: Booking) => {
    showModal(getLoadingSpinner());

    booking.startDate = start;
    booking.endDate = end;

    try {
      const { data } = await updateBooking(booking);

      if (data) {
        showModal(getBookingUpdateSuccessMessage(), 'ok', undefined, onSuccess);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      showModal(getBookingErrorMessage(), 'ok', undefined, undefined, true);
    }
  };

  const onCancel = () => {
    calendarRef.current?.resetSelections();
    hideModal();
  };

  const onSuccess = () => {
    navigate('/my-bookings');
  };

  return (
    <>
      <BookingCalendar
        ref={calendarRef}
        bookedDates={bookedDates}
        updateHandler={handleUpdateBooking}
        bookingToUpdate={bookingToEdit}
      />
    </>
  );
};

export default EditBookings;
