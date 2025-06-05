import { useState } from 'react';
import Calendar from 'react-calendar';
import CircularProgress from '@mui/material/CircularProgress';

import './BookingCalendar.css';

import Modal from './Modal';
import BookingService from '../services/BookingService';

import { ModalButtonMode } from '../types';

const BookingCalendar = () => {
  // States for date selection
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  // Modal states
  const [modalMessage, setModalMessage] = useState<React.ReactNode>(null);
  const [modalButtonMode, setModalButtonMode] = useState<ModalButtonMode>(
    ModalButtonMode.NoButtons
  );

  const isDateClickable = (date: Date): boolean => {
    // Normalize dates for comparison
    // TODO: investigate if really necessary, corner cases etc
    const normalizeDate = (d: Date): Date => {
      const normalized = new Date(d);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    // All dates are clickable until the start date is selected
    if (!startDate) return true;

    const currentDate = normalizeDate(date);
    const startDateTime = normalizeDate(startDate);
    const maxDate = new Date(startDateTime);
    // Max booking range is 3 days from the start date
    maxDate.setDate(startDateTime.getDate() + 3);
    // TODO: consider parameterizing the limit

    return currentDate >= startDateTime && currentDate <= maxDate;
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

  const handleBooking = (start: Date | null, end: Date | null) => {
    const startFormatted = start?.toLocaleDateString();
    const endFormatted = end?.toLocaleDateString();

    if (startFormatted && endFormatted) {
      setModalButtonMode(ModalButtonMode.YesNoButtons);
      setModalMessage(`Varataanko: ${startFormatted} - ${endFormatted}?`);
    } else {
      setModalMessage('Please select a start and end date.');
      // TODO: handle this better
    }
  };

  const resetCalendar = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleConfirm = async () => {
    // Sketch for booking confirmation
    // To be improved...
    if (!startDate || !endDate) return;

    setModalButtonMode(ModalButtonMode.NoButtons);
    setModalMessage(<CircularProgress color="inherit" />);

    const booking = await BookingService.create({
      startDate: startDate,
      endDate: endDate,
      userId: crypto.randomUUID(),
    });

    console.log('Booking confirmed:', booking);

    setModalButtonMode(ModalButtonMode.OkButton);
    setModalMessage(
      <div>
        <p>Varaus onnistui!</p>
        <p>
          Varattu: {String(booking.startDate)} - {String(booking.endDate)}
        </p>
      </div>
    );

    resetCalendar();
  };

  const handleCancel = () => {
    resetCalendar();
    setModalMessage(null);
  };

  return (
    <div>
      <Modal
        message={modalMessage}
        mode={modalButtonMode}
        confirmHandler={handleConfirm}
        cancelHandler={handleCancel}
      />
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
            tileDisabled={({ date }) => startDate !== null && !isDateClickable(date)}
            // Set date outside the range to be unclickable
            tileClassName={({ date }) => {
              // Set classnames for CSS styling to highlight the allowed range of dates
              if (startDate && date.toDateString() === startDate.toDateString()) {
                return 'start-date';
              }
              if (endDate && date.toDateString() === endDate.toDateString()) {
                return 'end-date';
              }
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
