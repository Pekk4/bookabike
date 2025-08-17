import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { UserDataBooking, BookingStatus } from '@types';

interface BookingActionsProps {
  booking: UserDataBooking;
  onApprove: (booking: UserDataBooking) => void;
  onRevoke: (booking: UserDataBooking) => void;
  onReject: (booking: UserDataBooking) => void;
}

/**
 * Renders action buttons based on the booking status.
 * - Pending: Approve or Reject
 * - Confirmed: Revoke
 *
 * @param booking - The booking data object
 * @param onApprove - Handler for approving a pending booking
 * @param onRevoke - Handler for revoking a confirmed booking
 * @param onReject - Handler for rejecting a pending booking
 */
const BookingActions = ({ booking, onApprove, onRevoke, onReject }: BookingActionsProps) => {
  switch (booking.status) {
    case BookingStatus.Pending:
      return (
        <>
          <Button
            variant="contained"
            color="success"
            size="small"
            style={{ marginRight: 8 }}
            startIcon={<CheckIcon />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling to parent elements
              onApprove(booking);
            }}
          >
            Hyväksy
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onReject(booking);
            }}
          >
            Hylkää
          </Button>
        </>
      );
    case BookingStatus.Confirmed:
      return (
        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<CloseIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onRevoke(booking);
          }}
        >
          Peru
        </Button>
      );
    default:
      return null;
  }
};

export default BookingActions;
