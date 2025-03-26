import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 4); // Jump 4 days ahead
    setDate(newDate);
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={date} // Ensure only the "jumped" date is active
        tileClassName={({ date: tileDate }) =>
          tileDate.toDateString() === date.toDateString() ? "highlighted-day" : ""
        }
      />
      <p>Selected Date: {date.toDateString()}</p>

      {/* Move styles into a regular style tag */}
      <style>
        {`
          .react-calendar__tile--active {
            background: none !important;
            color: inherit !important;
          }

          .highlighted-day {
            background-color: #4caf50 !important;
            color: white !important;
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  );
};

export default CustomCalendar;
