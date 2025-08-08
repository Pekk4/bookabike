import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import BookingActions from '../components/UserBookingActions';
import BookingCard from '../components/BookingCard';

import { Booking, BookingStatus } from '../types';

const testBooking = {
  id: 1,
  startDate: new Date('2023-10-01'),
  endDate: new Date('2023-10-02'),
  user: {
    id: '666',
    firstName: 'Testi',
    lastName: 'Käyttäjä',
    username: 'testikayttaja',
    email: 'testi@testi.com',
  },
  createdAt: new Date('2023-09-30T12:00:00Z'),
  status: BookingStatus.Confirmed,
};

const CreateBookings = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <BookingCard
        booking={testBooking}
        renderActions={(booking) => (
          <BookingActions
            booking={booking as Booking}
            hasActiveBookings={false}
            onBookNow={() => {}}
            onDelete={() => {}}
            onCancel={() => {}}
            onEdit={() => {}}
          />
        )}
        showUserDetails={true}
      />
    </div>
  );
};

export default CreateBookings;
