import { useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { useBookingService } from '../services/bookingService';
import useModal from './useModal';

const useBookingCreation = (resetCalendar: () => void) => {
  const { createBooking } = useBookingService();
  const { showModal, hideModal } = useModal();

  const startDateRef = useRef<Date | null>(null);
  const endDateRef = useRef<Date | null>(null);

  const handleBooking = (start: Date | null, end: Date | null) => {
    const startFormatted = start?.toLocaleDateString();
    const endFormatted = end?.toLocaleDateString();

    // TODO
    console.log('Booking dates before confirming modal:', startFormatted, endFormatted);

    if (startFormatted && endFormatted) {
      startDateRef.current = start;
      endDateRef.current = end;
      showModal(
        `Varataanko: ${startFormatted} - ${endFormatted}?`,
        'ask',
        handleConfirmBooking,
        handleCancelBooking
      );
    } else {
      // TODO: handle this situation
      console.log('placeholder');
    }
  };

  const handleConfirmBooking = async () => {
    const startDate = startDateRef.current;
    const endDate = endDateRef.current;

    if (startDate && endDate) {
      console.log('Confirming booking with dates:', startDate, endDate); // DELETE
      showModal(<CircularProgress color="inherit" />);

      try {
        const { data } = await createBooking({
          startDate,
          endDate,
        });

        // TODO: handle successful booking
        const booking = data;
        console.log('Booking confirmed:', booking); // DELETE later

        const bookingStartDate = new Date(booking.startDate).toLocaleDateString();
        const bookingEndDate = new Date(booking.endDate).toLocaleDateString();

        showModal('Varaus onnistui!', 'ok');
      } catch (error) {
        console.error('Error confirming booking:', error);
        showModal('Varauksen luominen epäonnistui. Yritä uudelleen.', 'error');
      }
    } else {
      // TODO: handle this situation
      console.log('Please select both start and end dates.');
    }
  };

  const handleCancelBooking = () => {
    resetCalendar();
    hideModal();
  };

  return { handleBooking };
};

export default useBookingCreation;
