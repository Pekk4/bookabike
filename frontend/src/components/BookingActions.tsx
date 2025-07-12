import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Booking, BookingStatus as b } from '../types';

interface BookingActionsProps {
  booking: Booking;
  hasActiveBookings: boolean;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  onBookNow: (booking: Booking) => void;
}

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
            onClick={() => onEdit(booking)}
          >
            Muokkaa
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={() => onDelete(booking)}
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
            onClick={() => onEdit(booking)}
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
            startIcon={<CheckIcon />}
            onClick={() => onBookNow(booking)}
            disabled={hasActiveBookings}
          >
            Varaa
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={() => onDelete(booking)}
          >
            Poista
          </Button>
        </>
      );
    case b.Canceled:
      return (
        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<CloseIcon />}
          onClick={() => onDelete(booking)}
        >
          Poista
        </Button>
      );
    case b.Rejected:
      return (
        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<CloseIcon />}
          onClick={() => onDelete(booking)}
        >
          Poista
        </Button>
      );
    default:
      return null;
  }
};

export default BookingActions;
