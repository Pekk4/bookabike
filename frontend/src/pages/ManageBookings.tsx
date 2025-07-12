import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { useAdminService } from '../services/adminService';
import useModal from '../hooks/useModal';
import BookingsManager from '../components/BookingsManager';
import { getBookingStatusOrder } from '../utils/statusOrder';

import { UserDataBooking, BookingStatus as b } from '../types';

const ManageBookings = () => {
  const location = useLocation();
  const { showModal, hideModal } = useModal();
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

  //useEffect(() => {
  //  if (bookings.length > 0) {
  //    //console.log('Bookings:', Array.from(bookings));
  //    console.log('Bookings length:', bookings.length);
  //  }
  //}, [bookings]);

  const confirmApprove = (booking: UserDataBooking) =>
    confirmAction(booking, 'Haluatko varmasti vahvistaa varauksen?', 'approve');

  const confirmReject = (booking: UserDataBooking) =>
    confirmAction(booking, 'Haluatko varmasti hylätä varauksen?', 'reject');

  const confirmRevoke = (booking: UserDataBooking) =>
    confirmAction(booking, 'Haluatko varmasti perua varauksen?', 'revoke');

  const confirmAction = (booking: UserDataBooking, message: string, action: string) => {
    showModal(
      message,
      'ask',
      () => handleAction(booking, action),
      () => hideModal()
    );
  };

  const handleAction = async (booking: UserDataBooking, action: string) => {
    showModal(<CircularProgress color="inherit" />);
    const statusOrder = getBookingStatusOrder(true);

    try {
      let response;

      switch (action) {
        case 'approve':
          response = await updateBookingStatus(booking.id, b.Confirmed);
          break;
        case 'reject':
          response = await updateBookingStatus(booking.id, b.Rejected);
          break;
        case 'revoke':
          response = await updateBookingStatus(booking.id, b.Revoked);
          break;
        default:
          // TODO: handle properly
          throw new Error('Unknown action');
      }

      const updatedBooking = response.data;
      setBookings((prev) =>
        prev
          .map((b) => (b.id === booking.id ? updatedBooking : b))
          .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
      );
    } catch (error) {
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
                  onClick={() => confirmApprove(booking as UserDataBooking)}
                >
                  Hyväksy
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<CloseIcon />}
                  onClick={() => confirmReject(booking as UserDataBooking)}
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
                onClick={() => confirmRevoke(booking as UserDataBooking)}
              >
                Peru
              </Button>
            )}
          </>
        )}
        showUserColumn={true} // Show user column in the bookings manager
      />
    </>
  );
};

export default ManageBookings;
