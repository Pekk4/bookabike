import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';

import { Booking, BookingStatus as b } from '@types';

interface BookingActionsProps {
  booking: Booking;
  hasActiveBookings: boolean;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  onBookNow: (booking: Booking) => void;
}

/**
 * Renders action buttons based on the booking status.
 * - Pending: Edit or Delete
 * - Confirmed: Cancel or Edit
 * - Wished: Book Now or Delete
 * - Canceled/Rejected/Revoked: Delete
 *
 * @param booking - The booking data object
 * @param hasActiveBookings - Boolean indicating if the user has active bookings
 * @param onEdit - Handler for editing a booking
 * @param onDelete - Handler for deleting a booking
 * @param onCancel - Handler for canceling a booking
 * @param onBookNow - Handler for booking immediately from a wish list
 */
const BookingActions = ({
  booking,
  hasActiveBookings,
  onEdit,
  onDelete,
  onCancel,
  onBookNow,
}: BookingActionsProps) => {
  switch (booking.status) {
    case b.Pending:
      return (
        <>
          <Button
            variant="contained"
            color="success"
            size="small"
            style={{ marginRight: 8 }}
            startIcon={<CheckIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(booking);
            }}
          >
            Muokkaa
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(booking);
            }}
          >
            Poista
          </Button>
        </>
      );
    case b.Confirmed:
      return (
        <>
          <Button
            variant="contained"
            color="success"
            size="small"
            style={{ marginRight: 8 }}
            startIcon={<CheckIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(booking);
            }}
          >
            Muokkaa
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={() => onCancel(booking)}
          >
            Peru
          </Button>
        </>
      );
    case b.Wished:
      return (
        <>
          <Button
            variant="contained"
            color="success"
            size="small"
            style={{ marginRight: 8 }}
            startIcon={<EventIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onBookNow(booking);
            }}
            disabled={hasActiveBookings}
          >
            Varaa
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(booking);
            }}
          >
            Poista
          </Button>
        </>
      );
    case b.Canceled:
    case b.Rejected:
    case b.Revoked:
      return (
        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<CloseIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(booking);
          }}
        >
          Poista
        </Button>
      );
    default:
      return null;
  }
};

export default BookingActions;
