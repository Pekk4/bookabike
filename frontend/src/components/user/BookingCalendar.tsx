import { useState, forwardRef, useImperativeHandle } from 'react';
import Calendar from 'react-calendar';

import '@components/user/BookingCalendar.css';
import { maxBookingLength } from '@constants';
import { Booking } from '@types';

// Base props for both use cases (new booking and update booking)
type BookingCalendarBaseProps = {
  bookedDates: Set<string>;
  bookingToUpdate?: Booking;
};

// Props for new booking use case
type BookingCalendarNewProps = BookingCalendarBaseProps & {
  // bookingHandler is required, updateHandler should not be provided
  bookingHandler: (start: Date, end: Date) => void;
  updateHandler?: never;
};

// Props for booking update use case
type BookingCalendarUpdateProps = BookingCalendarBaseProps & {
  // updateHandler is required, bookingHandler should not be provided
  updateHandler: (start: Date, end: Date, booking: Booking) => void;
  bookingHandler?: never;
};

// Union type for both use cases
type BookingCalendarProps = BookingCalendarNewProps | BookingCalendarUpdateProps;

// Exposes resetSelections() to parent components (to be called from modal handlers)
export interface BookingCalendarHandle {
  resetSelections: () => void;
}

/**
 * Renders a calendar for users to make bookings.
 * In update mode the booking under update is removed from the view and user can select new dates.
 * useBookingProcess hook handles the booking logic and dialogs.
 *
 * @param bookedDates - Set of dates that are already booked.
 * @param bookingToUpdate - If set, update mode is enabled.
 * @param bookingHandler - Callback for new booking creation.
 * @param updateHandler - Callback for booking update.
 */
const BookingCalendar = forwardRef<BookingCalendarHandle, BookingCalendarProps>((props, ref) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // To reset selections from a parent component
  useImperativeHandle(ref, () => ({
    resetSelections() {
      setStartDate(null);
      setEndDate(null);
    },
  }));

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

        // When the both dates are set, call the appropriate handler depending on the case
        if (props.bookingToUpdate) {
          props.updateHandler?.(startDate, date, props.bookingToUpdate);
        } else {
          props.bookingHandler?.(startDate, date);
        }
      } else {
        // Clicked on the same date again, reset selection
        // (One day bookings will be implemented later...)
        setStartDate(null);
        setEndDate(null);
      }
    }
  };

  return (
    <div className="booking-calendar flex flex-col h-full justify-center items-center m-auto">
      <div
        className="
          mb-6 bg-white p-10 rounded-sm shadow-slate-500
          shadow-sm border-1 border-slate-500
        "
      >
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
          if (props.bookedDates.has(date.toDateString())) return true;
          // Also disable if not in allowed range (max booking length)
          return startDate !== null && !isDateClickable(date);
        }}
        tileClassName={({ date }) => {
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
});

export default BookingCalendar;
