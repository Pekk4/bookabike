import { AdminBooking } from '../types';

interface BookingsManagerProps {
  bookings: AdminBooking[];
}

const BookingsManager = ({ bookings }: BookingsManagerProps) => {
  return bookings;
};

export default BookingsManager;
