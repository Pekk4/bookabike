import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import { useBookingService } from '../services/bookingService';
import useModal from './useModal';
import { dateLocale } from '../constants';

import { Booking } from '../types';

const useBookingProcess = (resetCalendar: () => void) => {
  const { createBooking, updateBooking } = useBookingService();
  const { showModal, hideModal } = useModal();
  const navigate = useNavigate();

  const startDateRef = useRef<Date | null>(null);
  const endDateRef = useRef<Date | null>(null);

  const handleNewBooking = (start: Date | null, end: Date | null) => {
    const startFormatted = start?.toLocaleDateString(dateLocale);
    const endFormatted = end?.toLocaleDateString(dateLocale);

    // TODO
    console.log('Booking dates before confirming modal:', startFormatted, endFormatted);

    if (startFormatted && endFormatted) {
      startDateRef.current = start;
      endDateRef.current = end;
      showModal(
        `Varataanko: ${startFormatted} - ${endFormatted}?`,
        'ask',
        handleNewConfirmDialog,
        handleCancelDialog
      );
    } else {
      // TODO: handle this situation
      console.log('placeholder');
    }
  };

  const handleUpdateBooking = (start: Date | null, end: Date | null, booking: Booking) => {
    const startFormatted = start?.toLocaleDateString();
    const endFormatted = end?.toLocaleDateString();

    if (startFormatted && endFormatted) {
      startDateRef.current = start;
      endDateRef.current = end;
      showModal(
        `Päivitetäänkö varaus: ${startFormatted} - ${endFormatted}?`,
        'ask',
        () => handleUpdateConfirmDialog(booking),
        handleCancelDialog
      );
    } else {
      // TODO: handle this situation
      console.log('placeholder');
    }
  };

  const handleNewConfirmDialog = async () => {
    const startDate = startDateRef.current;
    const endDate = endDateRef.current;

    if (startDate && endDate) {
      showModal(<CircularProgress color="inherit" />);

      try {
        const { data } = await createBooking({
          startDate,
          endDate,
        });

        if (data) {
          // Necessary?
          const booking = data;
          const bookingStartDate = new Date(booking.startDate).toLocaleDateString();
          const bookingEndDate = new Date(booking.endDate).toLocaleDateString();
          const message = (
            <div>
              <p>Varaus onnistui!</p>
              <p>
                Varattu: {String(bookingStartDate)} - {String(bookingEndDate)}
              </p>
            </div>
          );

          // handleAfterBooking to both, confirm and cancel actions of the modal
          showModal(message, 'ok', handleAfterBooking, handleAfterBooking);
        }
      } catch (error) {
        // TODO: handle properly
        console.error('Error confirming booking:', error);
        showModal('Varauksen luominen epäonnistui. Yritä uudelleen.', 'error');
      }
    } else {
      // TODO: handle this situation
      console.log('Please select both start and end dates.');
    }
  };

  const handleUpdateConfirmDialog = async (booking: Booking) => {
    const startDate = startDateRef.current;
    const endDate = endDateRef.current;

    if (startDate && endDate) {
      showModal(<CircularProgress color="inherit" />);

      booking.startDate = startDate;
      booking.endDate = endDate;

      try {
        await updateBooking(booking);

        showModal(
          'Varauksen päivittäminen onnistui!',
          'ok',
          handleAfterBooking,
          handleAfterBooking
        );
      } catch (error) {
        // TODO: handle properly
        console.error('Error confirming booking:', error);
        showModal('Varauksen luominen epäonnistui. Yritä uudelleen.', 'error');
      }
    } else {
      // TODO: handle this situation
      console.log('Please select both start and end dates.');
    }
  };

  const handleCancelDialog = () => {
    resetCalendar();
    hideModal();
  };

  const handleAfterBooking = () => {
    navigate('/my-bookings');
    hideModal();
  };

  return { handleNewBooking, handleUpdateBooking };
};

export default useBookingProcess;

//
//
// TODO: UI shit mostly
//
//
