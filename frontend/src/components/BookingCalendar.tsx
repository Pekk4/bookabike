import { useState } from "react";
import Calendar from "react-calendar";

import "./BookingCalendar.css";

const BookingCalendar = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const isDateClickable = (date: Date): boolean => {
    // Normalize dates for comparison
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
  
    return currentDate >= startDateTime && currentDate <= maxDate;
  };

  const handleDateClick = (date: Date) => {
    if (!startDate) {
      setStartDate(date);
    } else if (isDateClickable(date)) {
      // Second click - set end date if it's within the valid range
      if (date.getTime() !== startDate.getTime()) {
        setEndDate(date);
      } else {
        // Clicked on the same date again, reset selection
        resetCalendar();
      }
    }
  };

  const resetCalendar = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="w-screen h-screen bg-gray-100 grid grid-rows-6 ">
      <div className="border-2 border-black"></div>
      <div className="border-2 border-blue-700 row-span-4 row-start-2 flex justify-center items-center m-auto w-1/2 h-full relative">
        <div className="top-0 absolute">
          {/* <h1>Booking Calendar</h1> */}
          {startDate && !endDate && (
            <p>Now select an end date (up to 3 days after start date)</p>
          )}
          {startDate && endDate && (
            <div>
              <p>
                Booking: {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
              </p>
              <button onClick={resetCalendar}>Reset Selection</button>
            </div>
          )}
        </div>
        <Calendar
          locale="fi-FI"
          onClickDay={handleDateClick}
          tileDisabled={({ date }) => startDate !== null && !isDateClickable(date)}
          // Set date outside the range to be unclickable
          tileClassName={({ date }) => {
            // Set classnames for CSS styling to highlight the allowed range of dates
            if (startDate && date.toDateString() === startDate.toDateString()) {
              return "start-date";
            }
            if (endDate && date.toDateString() === endDate.toDateString()) {
              return "end-date";
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
  );
};

export default BookingCalendar;
