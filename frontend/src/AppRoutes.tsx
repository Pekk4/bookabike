import { Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import BookingCalendar from './components/BookingCalendar';
import MyBookings from './components/MyBookings';
import EditBookings from './pages/EditBookings';

import CreateBookings from './pages/CreateBookings';
import AdminBookings from './pages/AdminBookings';
import TestBody from './pages/TestBody';

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        {/*<Route path="/calendar" element={<BookingCalendar />} />*/}
        {/*<Route path="/calendar" element={<CreateBookings />} />*/}
        <Route path="/calendar" element={<AdminBookings />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/edit-booking" element={<EditBookings />} />
        <Route path="/me" element={<TestBody />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
