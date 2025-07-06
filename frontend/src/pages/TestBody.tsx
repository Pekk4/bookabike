import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import BookingCard from '../components/BookingCard';

const testBooking = {
  id: 1,
  startDate: new Date('2023-10-01'),
  endDate: new Date('2023-10-02'),
  userId: '666',
  status: 'confirmed',
};

const CreateBookings = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <BookingCard booking={testBooking} />
    </div>
  );
};

export default CreateBookings;
