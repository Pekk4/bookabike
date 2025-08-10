import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useBookingService } from '@services/bookingService';
import BookingCalendar, { BookingCalendarHandle } from '@components/user/BookingCalendar';
import useModal from '@hooks/useModal';
import { dateLocale } from '@constants';
import {
  getBookingConfirmationMessage,
  getBookingSuccessMessage,
  getLoadingSpinner,
  getBookingErrorMessage,
} from '@utils/modalMessages';

/**
 * CreateBookings page is a wrapper component, that renders a booking calendar
 * for users to make bookings.
 *
 * It fetches all booked dates and passes them to the BookingCalendar component.
 * The booked dates are fetched via the booking service.
 * It also handles the booking creation process and all necessary dialogs.
 */
const CreateBookings = () => {
  const location = useLocation();
  const { getAllBookedDates, createBooking } = useBookingService();
  const navigate = useNavigate();
  const { showModal, hideModal } = useModal();
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const calendarRef = useRef<BookingCalendarHandle>(null);

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

  const handleNewBooking = (start: Date, end: Date) => {
    const startFormatted = start.toLocaleDateString(dateLocale);
    const endFormatted = end.toLocaleDateString(dateLocale);

    showModal(
      getBookingConfirmationMessage(startFormatted, endFormatted),
      'ask',
      () => onConfirm(start, end),
      onCancel
    );
  };

  const onConfirm = async (start: Date, end: Date) => {
    showModal(getLoadingSpinner());

    try {
      const { data } = await createBooking({
        startDate: start,
        endDate: end,
      });

      if (data) {
        showModal(
          getBookingSuccessMessage(String(data.startDate), String(data.endDate)),
          'ok',
          undefined,
          onBookingSuccess
        );
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

  const onBookingSuccess = () => {
    navigate('/my-bookings');
  };

  return (
    <>
      <BookingCalendar
        ref={calendarRef}
        bookedDates={bookedDates}
        bookingHandler={handleNewBooking}
      />
    </>
  );
};

export default CreateBookings;
