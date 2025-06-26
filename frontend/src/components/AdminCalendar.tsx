import { useState } from 'react';
import Calendar from 'react-calendar';

import './AdminCalendar.css';

import { maxBookingLength } from '../constants';
import useBookingProcess from '../hooks/useBookingProcess';
import useModal from '../hooks/useModal';

import { Booking } from '../types';
import BookingCard from './BookingCard';

interface AdminCalendarProps {
  bookings: Booking[];
}

const AdminCalendar = ({ bookings }: AdminCalendarProps) => {
  //const [startDate, setStartDate] = useState<Date | null>(null);
  //const [endDate, setEndDate] = useState<Date | null>(null);

  // ad hoc
  const bookedDates = new Set<string>(
    bookings
      .map((booking) => {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const dates: string[] = [];
        while (start <= end) {
          dates.push(start.toDateString());
          start.setDate(start.getDate() + 1);
        }
        return dates;
      })
      .flat()
  );

  // ad hoc
  const dateToBooking = new Map<string, Booking>();
  bookings.forEach((booking) => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const d = new Date(start);
    while (d <= end) {
      dateToBooking.set(d.toDateString(), booking);
      d.setDate(d.getDate() + 1);
    }
  });

  //const resetCalendar = () => {
  //  setStartDate(null);
  //  setEndDate(null);
  //};

  const { showModal } = useModal();

  const handleDateClick = (date: Date) => {
    const booking = dateToBooking.get(date.toDateString());
    if (booking) {
      showModal(<BookingCard booking={booking} />, 'ok');
      return;
    }
  };

  return (
    <div>
      <div className="w-screen h-screen bg-gray-100 grid grid-rows-6 ">
        <div className="border-2 border-black"></div>
        <div className="border-2 border-blue-700 row-span-4 row-start-2 flex justify-center items-center m-auto w-1/2 h-full relative">
          <div className="top-0 absolute">
            {/* TODO: improve this */}
            {/*startDate && !endDate && <p>Now select an end date (up to 3 days after start date)</p>*/}
          </div>
          <Calendar
            locale="fi-FI"
            onClickDay={handleDateClick}
            //tileDisabled={({ date }) => startDate !== null && !isDateClickable(date)}
            //tileDisabled={({ date }) => {
            //  // Disable if date is in bookedDates set
            //  if (bookedDates.has(date.toDateString())) return true;
            //  // Also disable if not in allowed range, as before
            //  return startDate !== null && !isDateClickable(date);
            //}}
            // Set date outside the range to be unclickable
            tileClassName={({ date }) => {
              // Set classnames for CSS styling to highlight the allowed range of dates
              //if (startDate && date.toDateString() === startDate.toDateString()) {
              //  return 'start-date';
              //}
              //if (endDate && date.toDateString() === endDate.toDateString()) {
              //  return 'end-date';
              //}
              // Example of coloring tiles
              if (bookedDates.has(date.toDateString())) return 'booked-tile';
              return null;
            }}
            //value={startDate} // TODO check this
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
