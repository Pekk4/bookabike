import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const BookingCalendar: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[] | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);

  // Handler for clicking a date
  const handleDateClick = (date: Date) => {
    if (!isSelecting) {
      // Start selection
      setIsSelecting(true);
      setStartDate(date);
      setSelectedDates([date]); // Start with the initial date
    } else if (startDate) {
      // End selection
      const adjustedEndDate = new Date(startDate);
      adjustedEndDate.setDate(startDate.getDate() + 3); // Force end date to be 3 days ahead
      const range = calculateDateRange(startDate, adjustedEndDate);
      setSelectedDates(range);
      setIsSelecting(false); // Exit selection mode
      setStartDate(null);
    }
  };

  // Handler for hovering over a date
  const handleDateHover = (date: Date) => {
    if (isSelecting && startDate) {
      const range = calculateDateRange(startDate, date);
      setSelectedDates(range);
    }
  };

  // Utility function to calculate the range of dates between two dates
  const calculateDateRange = (start: Date, end: Date): Date[] => {
    const range: Date[] = [];
    const current = new Date(start);
    const increment = start <= end ? 1 : -1; // Handle reverse selection
    let daysCount = 0;

    while (
      ((increment > 0 && current <= end) || (increment < 0 && current >= end)) &&
      daysCount < 4 // Limit to a maximum of 4 days (inclusive of start date)
    ) {
      range.push(new Date(current));
      current.setDate(current.getDate() + increment);
      daysCount++;
    }

    return range;
  };

  return (
    <div>
      <Calendar
        locale="fi-Fi"
        onClickDay={(date) => handleDateClick(date)} // Handle date click
        tileClassName={({ date }) => {
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
        tileContent={({ date }) => (
          <div
            onMouseEnter={() => handleDateHover(date)} // Handle hover
            style={{ height: '100%', width: '100%' }}
          />
        )}
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