import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useAdminService } from '../services/adminService';

import { UserDataBooking, BookingStatus as b } from '../types';
import BookingsManager from '../components/BookingsManager';

const ManageBookings = () => {
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

  const handleConfirm = (bookingId: number) => {
    handleUpdate(bookingId, b.Confirmed);
  };

  const handleReject = (bookingId: number) => {
    handleUpdate(bookingId, b.Canceled);
  };

  const handleUpdate = async (bookingId: number, status: b) => {
    try {
      const { data: updatedBooking } = await updateBookingStatus(bookingId, status);

      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updatedBooking : b)));
    } catch (error) {
      // TODO: handle properly
      console.error('Error updating booking:', error);
    }
  };

  return (
    <>
      <BookingsManager bookings={bookings} onAccept={handleConfirm} onReject={handleReject} />
    </>
  );
};

export default ManageBookings;
