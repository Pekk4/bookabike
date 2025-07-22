import { Routes, Route } from 'react-router-dom';

import HomeDemo from './components/HomeDemo3';
import ProtectedRoute from './components/ProtectedRoute';
import MyBookings from './pages/MyBookings';
import EditBookings from './pages/EditBookings';
import CreateBookings from './pages/CreateBookings';
import AdminBookings from './pages/AdminBookings';
import TestBody from './pages/TestBody';
import ManageBookings from './pages/ManageBookings';

interface AppRoutesProps {
  authenticated: boolean;
}

const AppRoutes = ({ authenticated }: AppRoutesProps) => {
  return (
    <div>
      <Routes>
        {/* Root path for everyone */}
        <Route path="/" element={<HomeDemo />} />

        {/* Everything else only for logged in users */}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <CreateBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-booking"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <EditBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/me"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <TestBody />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-bookings"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <ManageBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-bookings"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default AppRoutes;
