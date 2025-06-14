import { Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import BookingCalendar from './components/BookingCalendar';
import MyBookings from './components/MyBookings';

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<BookingCalendar />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
