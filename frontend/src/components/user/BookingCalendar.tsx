import { useState } from 'react';
import Calendar from 'react-calendar';

import './BookingCalendar.css';
import { maxBookingLength } from '../../constants';
import useBookingProcess from '../../hooks/useBookingProcess';

import { Booking } from '../../types';

interface BookingCalendarProps {
  bookedDates: Set<string>;
  bookingToUpdate?: Booking;
}

const BookingCalendar = ({ bookedDates, bookingToUpdate }: BookingCalendarProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const resetSelections = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const { handleNewBooking, handleUpdateBooking } = useBookingProcess(resetSelections);

  const isDateClickable = (date: Date): boolean => {
    // All free dates are clickable until the start date is selected
    if (!startDate) return true;

    // After that only free dates within the allowed range are clickable
    // Allowed range is start date + maxBookingLength days
    const maxDate = new Date(startDate);
    maxDate.setDate(startDate.getDate() + maxBookingLength);

    return date >= startDate && date <= maxDate;
  };

  const handleDateClick = (date: Date) => {
    // First click - set a start date
    if (!startDate) {
      setStartDate(date);
    } else if (isDateClickable(date)) {
      // Second click - set an end date, if it's within the valid range
      if (date.getTime() !== startDate.getTime()) {
        setEndDate(date);

        if (bookingToUpdate) {
          handleUpdateBooking(startDate, date, bookingToUpdate);
        } else {
          handleNewBooking(startDate, date);
        }
      } else {
        // Clicked on the same date again, reset selection
        //
        // TODO: implement one day bookings
        //
        resetSelections();
      }
    }
  };

  return (
    <div className="booking-calendar flex flex-col h-full justify-center items-center m-auto">
      <div className="mb-6 bg-white p-10 rounded-sm shadow-slate-500 shadow-sm border-1 border-slate-500">
        {!startDate && !endDate && (
          <p>Aloita varauksen tekeminen valitsemalla kalenterista vapaa aloituspäivä</p>
        )}
        {startDate && !endDate && (
          <p>Valitse seuraavaksi varauksen lopetuspäivä (varauksen maksimipituus neljä päivää)</p>
        )}
        {startDate && endDate && <p>Hyväksy tai hylkää varaus</p>}
      </div>
      <Calendar
        locale="fi-FI"
        onClickDay={handleDateClick}
        tileDisabled={({ date, view }) => {
          // Only disable tiles in a day view
          if (view !== 'month') return false;
          // Disable if date is in bookedDates set (i.e. already booked)
          if (bookedDates.has(date.toDateString())) return true;
          // Also disable if not in allowed range (max booking length)
          return startDate !== null && !isDateClickable(date);
        }}
        tileClassName={({ date }) => {
          // Set classnames for CSS styling to highlight dates
          //if (bookedDates.has(date.toDateString())) {
          //  //
          //  // TODO: check if necessary anymore, idea was to separate from disabled dates
          //  //
          //  return 'booked-date-tile';
          //}
          if (startDate && isDateClickable(date)) {
            // Highlight selectable dates when dates outside the range are disabled
            if (startDate && date.toDateString() === startDate.toDateString()) {
              return 'start-date selectable-date-tile';
            }
            if (endDate && date.toDateString() === endDate.toDateString()) {
              return 'end-date selectable-date-tile';
            }
          }
          return null;
        }}
        value={startDate && endDate ? [startDate, endDate] : startDate}
        className={'shadow-slate-500 shadow-sm'}
      />
    </div>
  );
};

export default BookingCalendar;
