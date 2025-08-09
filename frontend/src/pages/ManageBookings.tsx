import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { useAdminService } from '@services/adminService';
import useModal from '@hooks/useModal';
import BookingsManager from '@components/common/BookingsManager';
import ReasonForm from '@components/admin/ReasonForm';
import BookingActions from '@components/admin/BookingActions';
import ViewSwitchBar from '@components/admin/ViewSwitchBar';
import BookingsCalendar from '@components/admin/BookingsCalendar';
import { getBookingStatusOrder } from '@utils/status';
// TODO: fix status as b
import { UserDataBooking, BookingStatus as b } from '@types';

/**
 * ManageBookings page is a wrapper component that allows admins to manage bookings.
 *
 * It fetches all bookings and displays them in a table or calendar view,
 * allowing admins to approve, reject, or revoke bookings.
 * The bookings are fetched via the admin service.
 */
const ManageBookings = () => {
  const location = useLocation();
  const { showModal, hideModal } = useModal();
  const { getAllBookings, updateBookingStatus } = useAdminService();
  const [bookings, setBookings] = useState<UserDataBooking[]>([]);
  const [isCalendarView, setIsCalendarView] = useState<boolean>(false);

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
  }, [location.pathname, getAllBookings]);

  const toggleView = () => {
    setIsCalendarView((prev) => !prev);
  };

  //useEffect(() => {
  //  if (bookings.length > 0) {
  //    console.log('Bookings:', Array.from(bookings));
  //    //console.log('Bookings length:', bookings.length);
  //  }
  //}, [bookings]);

  const confirmApprove = (booking: UserDataBooking) =>
    confirmAction(booking, 'Haluatko varmasti vahvistaa varauksen?', 'approve');

  const confirmRevoke = (booking: UserDataBooking) =>
    buildReasonForm(booking, 'Haluatko varmasti perua varauksen?', 'revoke');

  const confirmReject = (booking: UserDataBooking) =>
    buildReasonForm(booking, 'Haluatko varmasti hylätä varauksen?', 'reject');

  const buildReasonForm = (booking: UserDataBooking, message: string, action: string) => {
    const form = (
      <>
        <p>{message}</p>
        <br />
        <ReasonForm
          onSubmit={(reason: string) => handleAction(booking, action, reason)}
          onCancel={() => hideModal()}
          label="Lyhyt perustelu:"
        />
      </>
    );
    confirmAction(booking, form, action);
  };

  const confirmAction = (booking: UserDataBooking, message: React.ReactNode, action: string) => {
    showModal(
      message,
      action === 'approve' ? 'ask' : '',
      () => handleAction(booking, action),
      () => hideModal()
    );
  };

  const handleAction = async (booking: UserDataBooking, action: string, reason?: string) => {
    showModal(<CircularProgress color="inherit" />);

    const statusOrder = getBookingStatusOrder(true);

    try {
      let response;

      switch (action) {
        case 'approve':
          response = await updateBookingStatus(booking.id, b.Confirmed);
          break;
        case 'reject':
          response = await updateBookingStatus(booking.id, b.Rejected, reason);
          break;
        case 'revoke':
          response = await updateBookingStatus(booking.id, b.Revoked, reason);
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
      // TODO: handle properly
      console.error('Error updating booking:', error);
    }
    hideModal();
  };

  if (isCalendarView) {
    return (
      <>
        <BookingsCalendar
          bookings={bookings}
          renderActions={(booking) => (
            <BookingActions
              booking={booking as UserDataBooking}
              onApprove={confirmApprove}
              onRevoke={confirmRevoke}
              onReject={confirmReject}
            />
          )}
        />
        <ViewSwitchBar isCalendarView={isCalendarView} onToggleView={toggleView} />
      </>
    );
  }

  return (
    <>
      <BookingsManager
        bookings={bookings}
        renderActions={(booking) => (
          <BookingActions
            booking={booking as UserDataBooking}
            onApprove={confirmApprove}
            onRevoke={confirmRevoke}
            onReject={confirmReject}
          />
        )}
        showUserColumn={true} // Show user column in the bookings manager
      />
      <ViewSwitchBar isCalendarView={isCalendarView} onToggleView={toggleView} />
    </>
  );
};

export default ManageBookings;
