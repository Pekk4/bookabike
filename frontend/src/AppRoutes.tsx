import { Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import BookingCalendar from './components/BookingCalendar';
import MyBookings from './components/MyBookings';
import EditBookings from './pages/EditBookings';

import CreateBookings from './pages/CreateBookings';

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        {/*<Route path="/calendar" element={<BookingCalendar />} />*/}
        <Route path="/calendar" element={<CreateBookings />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/edit-booking" element={<EditBookings />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
