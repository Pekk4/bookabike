import { useLocation, useNavigate, useParams } from 'react-router-dom';

import BookingCalendar from '../components/BookingCalendar';

const CreateBookings = () => {
  //const { id } = useParams<{ id: string }>();
  //const location = useLocation();
  //const bookingToEdit = location.state?.booking;
  //const navigate = useNavigate();
  //
  //if (!bookingToEdit) {
  //  navigate('/my-bookings');
  //  return null;
  //}

  return (
    <>
      <BookingCalendar />
    </>
  );
};

export default CreateBookings;
