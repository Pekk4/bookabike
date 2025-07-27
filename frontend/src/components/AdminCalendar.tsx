import Calendar from 'react-calendar';

import './AdminCalendar.css';
import BookingCard from './BookingCard';
import useModal from '../hooks/useModal';

import { UserDataBooking } from '../types';

interface AdminCalendarProps {
  bookings: UserDataBooking[];
  renderActions: (booking: UserDataBooking) => React.ReactNode;
}

const AdminCalendar = ({ bookings, renderActions }: AdminCalendarProps) => {
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
      showModal(<BookingCard booking={booking} renderActions={renderActions as (booking: UserDataBooking) => React.ReactNode} showUserDetails={true} />, 'ok');
      return;
    }
  };

  return (
    <div className="admin-calendar flex h-full justify-center items-center m-auto">
      <Calendar
        locale="fi-FI"
        onClickDay={handleDateClick}
        tileClassName={({ date, view }) => {
          // Highlight bookings only in day view
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

export default AdminCalendar;
