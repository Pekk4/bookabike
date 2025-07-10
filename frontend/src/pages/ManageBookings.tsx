import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { useAdminService } from '../services/adminService';
import useModal from '../hooks/useModal';
import BookingsManager from '../components/BookingsManager';

import { UserDataBooking, BookingStatus as b } from '../types';

import useKeycloak from '../hooks/useKeycloak';

const ManageBookings = () => {
  const { profile } = useKeycloak();
  const { showModal, hideModal } = useModal();
  const location = useLocation();
  const { getAllBookings, updateBookingStatus } = useAdminService();
  const [bookings, setBookings] = useState<UserDataBooking[]>([]);

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
      <BookingsManager
        bookings={bookings}
        renderActions={(booking) => (
          <>
            {booking.status === b.Pending && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  style={{ marginRight: 8 }}
                  startIcon={<CheckIcon />}
                  onClick={() => handleConfirm(booking.id)}
                >
                  Hyväksy
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<CloseIcon />}
                  onClick={() => handleReject(booking.id)}
                >
                  Hylkää
                </Button>
              </>
            )}
            {booking.status === b.Confirmed && (
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<CloseIcon />}
                onClick={() => handleReject(booking.id)}
              >
                Peru
              </Button>
            )}
          </>
        )}
        user={profile}
      />
    </>
  );
};

export default ManageBookings;
