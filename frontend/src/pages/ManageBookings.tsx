import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import { useAdminService } from '../services/adminService';
import useModal from '../hooks/useModal';

import { UserDataBooking, BookingStatus as b } from '../types';
import BookingsManager from '../components/BookingsManager';

const ManageBookings = () => {
  const { showModal, hideModal } = useModal();
  const location = useLocation();
  const { getAllBookings, updateBookingStatus } = useAdminService();
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
  //  if (bookings.length > 0) {
  //    console.log('Bookings:', Array.from(bookings));
  //  }
  //}, [bookings]);

  const handleConfirm = (bookingId: number) => {
    showModal(
      'Haluatko varmasti vahvistaa varauksen?',
      'ask',
      () => handleUpdate(bookingId, b.Confirmed),
      () => hideModal()
    );
  };

  const handleReject = (bookingId: number) => {
    showModal(
      'Haluatko varmasti hylätä varauksen?',
      'ask',
      () => handleUpdate(bookingId, b.Canceled),
      () => hideModal()
    );
  };

  const handleUpdate = async (bookingId: number, status: b) => {
    showModal(<CircularProgress color="inherit" />);

    try {
      const { data: updatedBooking } = await updateBookingStatus(bookingId, status);

      const statusOrder: Record<string, number> = {
        [b.Pending]: 1,
        [b.Confirmed]: 2,
        [b.Canceled]: 3,
      };

      setBookings((prev) =>
        prev
          .map((booking) => (booking.id === bookingId ? updatedBooking : booking))
          .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
      );
    } catch (error) {
      // TODO: handle properly
      console.error('Error updating booking:', error);
    }

    hideModal();
  };

  return (
    <>
      <BookingsManager bookings={bookings} onAccept={handleConfirm} onReject={handleReject} />
    </>
  );
};

export default ManageBookings;
