import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { useBookingService } from '@services/bookingService';
import useModal from '@hooks/useModal';
import BookingsManager from '@components/common/BookingsManager';
import BookingActions from '@components/user/BookingActions';
import { getBookingStatusOrder } from '@utils/status';
import { Booking, BookingStatus as b } from '@types';

/**
 * MyBookings page is a wrapper component that allows users to view and manage their bookings.
 *
 * It fetches all user bookings and displays them in a list,
 * allowing users to book new dates, cancel, or delete existing bookings.
 * The bookings are fetched via the booking service.
 */
const MyBookings = () => {
  const { showModal, hideModal } = useModal();
  const location = useLocation();
  const { getUserBookings, deleteBooking, updateBooking } = useBookingService();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hasActiveBookings, setHasActiveBookings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await getUserBookings();

        if (data) {
          setBookings(data);
          setHasActiveBookings(
            data.some((booking) => booking.status === b.Pending || booking.status === b.Confirmed)
          );
        }
      } catch (error) {
        console.log('Error with fetching bookings: ', error);
      }
    };
    fetchBookings();
  }, [location.pathname, getUserBookings]);

  const confirmBookNow = (booking: Booking) =>
    confirmAction(booking, 'Haluatko varmasti vahvistaa varauksen?', 'book');

  const confirmDelete = (booking: Booking) =>
    confirmAction(booking, 'Haluatko varmasti poistaa varauksen?', 'delete');

  const confirmCancel = (booking: Booking) =>
    confirmAction(booking, 'Haluatko varmasti perua varauksen?', 'cancel');

  const confirmAction = (booking: Booking, message: string, action: string) => {
    showModal(
      message,
      'ask',
      () => handleAction(booking, action),
      () => hideModal()
    );
  };

  const handleAction = async (booking: Booking, action: string) => {
    showModal(<CircularProgress color="inherit" />);

    const statusOrder = getBookingStatusOrder();

    try {
      if (action === 'delete') {
        await deleteBooking(booking.id);
        setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      } else {
        booking.startDate = new Date(booking.startDate); // Ensure startDate is a Date object
        booking.endDate = new Date(booking.endDate);

        if (action === 'cancel') {
          booking.status = b.Canceled;
        } else if (action === 'book') {
          booking.status = b.Pending;
        }

        const { data: updatedBooking } = await updateBooking(booking);

        setBookings((prev) =>
          prev
            .map((b) => (b.id === booking.id ? updatedBooking : b))
            .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
        );
        setHasActiveBookings(
          bookings.some((booking) => booking.status === b.Pending || booking.status === b.Confirmed)
        );
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
    hideModal();
  };

  const handleEditBooking = (booking: Booking) => {
    navigate('/edit-booking', { state: { booking } });
    hideModal();
  };

  return (
    <BookingsManager
      bookings={bookings}
      renderActions={(booking) => (
        <BookingActions
          booking={booking as Booking}
          hasActiveBookings={hasActiveBookings}
          onBookNow={confirmBookNow}
          onDelete={confirmDelete}
          onCancel={confirmCancel}
          onEdit={handleEditBooking}
        />
      )}
    />
  );
};

export default MyBookings;
