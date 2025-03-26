import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DateRangePicker: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [proposedRangeEnd, setProposedRangeEnd] = useState<Date | null>(null);
  const [activeDate, setActiveDate] = useState<Date | null>(null);
  const [key, setKey] = useState<number>(0); // Add a key to force re-render

  const handleDateClick = (date: Date) => {
    if (!startDate) {
      // First click: Set the start date and propose a 4-day range
      setStartDate(date);
      const proposedEnd = new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000);
      setProposedRangeEnd(proposedEnd);
      setEndDate(null);
      setActiveDate(date); // Highlight the start date initially
    } else {
      const maxEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
      
      if (date > maxEndDate) {
        // If date is beyond max range, force a re-render to clear the default selection
        setEndDate(maxEndDate);
        setActiveDate(maxEndDate);
        setKey(prev => prev + 1); // Force re-render by changing the key
      } else {
        setEndDate(date);
        setActiveDate(date);
      }
    }
  };

  const isInRange = (date: Date): boolean => {
    if (startDate && endDate) {
      return date >= startDate && date <= endDate;
    }
    if (startDate && proposedRangeEnd) {
      return date >= startDate && date <= proposedRangeEnd;
    }
    return false;
  };

  return (
    <div>
      <h1>Select a Date Range</h1>
      <Calendar
        key={key} // Add key to force re-render when needed
        onClickDay={handleDateClick}
        value={activeDate}
        tileClassName={({ date, view }) => {
          if (view === 'month' && isInRange(date)) {
            return 'in-range';
          }
          if (activeDate && date.getTime() === activeDate.getTime()) {
            return 'active-date';
          }
          return '';
        }}
        showNeighboringMonth={false} // Helps with selection clarity
      />
      <div>
        <p>Start Date: {startDate?.toLocaleDateString() || 'None'}</p>
        <p>End Date: {endDate?.toLocaleDateString() || 'None'}</p>
        <p>Proposed Range End: {proposedRangeEnd?.toLocaleDateString() || 'None'}</p>
      </div>
      <style>
      {`
        .in-range {
          background-color: #c3e6cb;
        }
        .active-date {
          background-color: #007bff;
          color: white;
          border-radius: 50%;
        }
        /* Override default selection styling */
        /*.react-calendar__tile--active {
          background: inherit;
          color: inherit;
        }*/
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: inherit;
        }
      `}
      </style>
    </div>
  );
};

export default DateRangePicker;