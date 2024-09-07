import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const BookingCalendar: React.FC = () => {
  // Define the state for selected dates as an array of Date or null
  const [selectedDates, setSelectedDates] = useState<Date[] | null>(null);

  // Handler for date selection
  const handleDateChange = (date: Date | Date[]) => {
    if (Array.isArray(date)) {
      return; // If the user selects a range, ignore it
    }

    // Calculate the next three days after the selected day
    const secondDay = new Date(date);
    secondDay.setDate(secondDay.getDate() + 1);

    const thirdDay = new Date(date);
    thirdDay.setDate(thirdDay.getDate() + 2);

    const fourthDay = new Date(date);
    fourthDay.setDate(fourthDay.getDate() + 3);

    // Set the selected dates as an array
    setSelectedDates([date, secondDay, thirdDay, fourthDay]);
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={selectedDates ?? undefined} // Handle case where selectedDates is null
        selectRange={false} // Disable range selection as we're manually handling it
        tileClassName={({ date, view }) => {
          // Add a class to highlight the selected range
          if (
            selectedDates &&
            selectedDates.some(
              (d) =>
                date.getFullYear() === d.getFullYear() &&
                date.getMonth() === d.getMonth() &&
                date.getDate() === d.getDate()
            )
          ) {
            return 'highlight';
          }
          return null;
        }}
      />
      <style>
        {`
          .highlight {
            background: #90ee90;
          }
        `}
      </style>
    </div>
  );
};

export default BookingCalendar;
