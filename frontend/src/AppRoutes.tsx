import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from '@components/common/ProtectedRoute';
import MyBookings from '@pages/MyBookings';
import EditBookings from '@pages/EditBookings';
import CreateBookings from '@pages/CreateBookings';
import ManageBookings from '@pages/ManageBookings';
import FrontPage from '@pages/FrontPage';

interface AppRoutesProps {
  authenticated: boolean;
}

/**
 * React Router component that defines the application's routes.
 */
const AppRoutes = ({ authenticated }: AppRoutesProps) => {
  return (
    <div className="h-full w-full">
      <Routes>
        {/* Root path for everyone */}
        <Route path="/" element={<FrontPage />} />

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
              <FrontPage />
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
      </Routes>
    </div>
  );
};

export default AppRoutes;
