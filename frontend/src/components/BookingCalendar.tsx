import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import CircularProgress from '@mui/material/CircularProgress';

import './BookingCalendar.css';

import Modal from './Modal';
import { useBookingService } from '../services/bookingService';

import { Booking, ModalButtonMode } from '../types';

import buildDatesSet from '../utils/buildDatesSet';

import useBookingCreation from '../hooks/useBookingCreation';

interface BookingCalendarProps {
  // TODO: delete?
  bookingToEdit?: Booking;
}

const BookingCalendar = ({ bookingToEdit }: BookingCalendarProps) => {
  // Hooks for fetching and creating bookings
  const { getAllBookedDates, createBooking } = useBookingService();
  // States for date selection
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  // Booked dates state
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());

  const resetCalendar = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const { handleBooking } = useBookingCreation(resetCalendar);

  //const bookingToEdit = useLocation().state?.booking;

  //useEffect(() => {
  //  // AD HOC placeholder shit // TODO: clean up
  //  const fetchBookings = async () => {
  //    try {
  //      const { data } = await getAllBookedDates();
  //
  //      if (data) {
  //        const datesSet = new Set<string>(data);
  //        setBookedDates(datesSet);
  //      }
  //    } catch (error) {
  //      // TODO: handle properly
  //      console.log('Error with fetching bookings: ', error);
  //    }
  //  };
  //  fetchBookings();
  //  // eslint-disable-next-line react-hooks/exhaustive-deps
  //}, []);

  const isDateClickable = (date: Date): boolean => {
    // All dates are clickable until the start date is selected
    if (!startDate) return true;

    const maxDate = new Date(startDate);
    // Max booking range is 3 days from the start date
    maxDate.setDate(startDate.getDate() + 3); // TODO: consider parameterizing the limit

    return date >= startDate && date <= maxDate;
  };

  const handleDateClick = (date: Date) => {
    if (!startDate) {
      setStartDate(date);
    } else if (isDateClickable(date)) {
      // Second click - set end date if it's within the valid range
      if (date.getTime() !== startDate.getTime()) {
        setEndDate(date);
        handleBooking(startDate, date);
      } else {
        // Clicked on the same date again, reset selection
        // TODO: not very smooth atm
        resetCalendar();
      }
    }
  };

  return (
    <div>
      <div className="w-screen h-screen bg-gray-100 grid grid-rows-6 ">
        <div className="border-2 border-black"></div>
        <div className="border-2 border-blue-700 row-span-4 row-start-2 flex justify-center items-center m-auto w-1/2 h-full relative">
          <div className="top-0 absolute">
            {/* TODO: improve this */}
            {startDate && !endDate && <p>Now select an end date (up to 3 days after start date)</p>}
          </div>
          <Calendar
            locale="fi-FI"
            onClickDay={handleDateClick}
            //tileDisabled={({ date }) => startDate !== null && !isDateClickable(date)}
            tileDisabled={({ date }) => {
              // Disable if date is in bookedDates set
              if (bookedDates.has(date.toDateString())) return true;
              // Also disable if not in allowed range, as before
              return startDate !== null && !isDateClickable(date);
            }}
            // Set date outside the range to be unclickable
            tileClassName={({ date }) => {
              // Set classnames for CSS styling to highlight the allowed range of dates
              if (startDate && date.toDateString() === startDate.toDateString()) {
                return 'start-date';
              }
              if (endDate && date.toDateString() === endDate.toDateString()) {
                return 'end-date';
              }
              // Example of coloring tiles
              if (date.getDay() === 0) return 'sunday-tile';
              if (date.getDay() === 6) return 'saturday-tile';
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

export default BookingCalendar;
