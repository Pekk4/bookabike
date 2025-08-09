import Calendar from 'react-calendar';

import '@components/admin/BookingsCalendar.css';
import BookingCard from '@components/common/BookingCard';
import useModal from '@hooks/useModal';
import { BookingEntry, UserDataBooking } from '@types';

interface BookingsCalendarProps {
  bookings: UserDataBooking[];
  renderActions: (booking: BookingEntry) => React.ReactNode;
}

/**
 * Renders a calendar for admin to inspect & manage bookings.
 *
 * @param bookings - Array of bookings to display on the calendar.
 * @param renderActions - Function to render booking actions for each booking.
 */
const BookingsCalendar = ({ bookings, renderActions }: BookingsCalendarProps) => {
  const { showModal } = useModal();
  const bookedDates = new Set<string>();
  const dateToBookingMap = new Map<string, UserDataBooking>();

  bookings.forEach((booking) => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const current = new Date(start);

    while (current <= end) {
      bookedDates.add(current.toDateString());
      dateToBookingMap.set(current.toDateString(), booking);
      current.setDate(current.getDate() + 1);
    }
  });

  const handleDateClick = (date: Date) => {
    const booking = dateToBookingMap.get(date.toDateString());

    if (booking) {
      showModal(
        <BookingCard booking={booking} renderActions={renderActions} showUserDetails={true} />,
        'close'
      );
      return;
    }
  };

  return (
    <div className="admin-calendar flex h-full justify-center items-center m-auto">
      <Calendar
        locale="fi-FI"
        onClickDay={handleDateClick}
        tileClassName={({ date, view }) => {
          // Highlight bookings only in a day view, not in other views
          if (view !== 'month') return null;
          // Highlight booked dates
          if (bookedDates.has(date.toDateString())) return 'booked-tile';
          return null;
        }}
        className={'shadow-slate-500 shadow-sm'}
      />
    </div>
  );
};

export default BookingsCalendar;
