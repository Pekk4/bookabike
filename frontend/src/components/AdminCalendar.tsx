import { useEffect, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';

import './AdminCalendar.css';

import BookingCard from './BookingCard';
import useModal from '../hooks/useModal';
import { getCapitalizedMonth } from '../utils/date';

import { UserDataBooking } from '../types';

interface AdminCalendarProps {
  bookings: UserDataBooking[];
}

const AdminCalendar = ({ bookings }: AdminCalendarProps) => {
  const { showModal } = useModal();
  const [monthHeader, setMonthHeader] = useState<string>('');
  const bookedDates = new Set<string>();
  const dateToBookingMap = new Map<string, UserDataBooking>();

  useEffect(() => {
    const now = new Date();
    setMonthHeader(getCapitalizedMonth(now, 'fi-FI'));
  }, []);

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
      showModal(<BookingCard booking={booking} />, 'ok');
      return;
    }
  };

  const handleStartDateChange: CalendarProps['onActiveStartDateChange'] = ({
    activeStartDate,
    view,
  }) => {
    if (view === 'month' && activeStartDate) {
      setMonthHeader(getCapitalizedMonth(activeStartDate, 'fi-FI'));
    } else if (view === 'year') {
      // Show just the current month in the header, if we go further views
      const now = new Date();
      setMonthHeader(getCapitalizedMonth(now, 'fi-FI'));
    }
  };

  return (
    <div>
      <div className="w-screen h-screen bg-gray-100 grid grid-rows-6 ">
        <div className="border-2 border-black"></div>
        <div className="border-2 border-blue-700 row-span-4 row-start-2 flex justify-center items-center m-auto w-1/2 h-full relative">
          <div className="top-0 absolute">
            <h2 className="text-2xl font-bold text-center mb-4">{monthHeader}</h2>
          </div>
          <Calendar
            locale="fi-FI"
            onClickDay={handleDateClick}
            onActiveStartDateChange={handleStartDateChange}
            tileClassName={({ date }) => {
              if (bookedDates.has(date.toDateString())) return 'booked-tile';
              return null;
            }}
          />
        </div>
        <div className="row-start-6 flex justify-center items-start border-2 border-orange-500">
          <p>Click a date to select it</p>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;
