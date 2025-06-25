import { CircularProgress } from '@mui/material';
import useKeycloak from '../hooks/useKeycloak';
import useModal from '../hooks/useModal';

//import BookingCalendar from './BookingCalendar';
import MyBookings from './MyBookings';

const HomeDemo = () => {
  const { authenticated, keycloak } = useKeycloak();

  //console.log(keycloak?.tokenParsed); // DELETE
  //console.log('access token should be here: ');
  //console.log(keycloak?.token);

  //const testHook = useModal();

  //testHook.showModal(
  //  <div>
  //    <p>Modal content goes here!</p>
  //    <p>Keycloak user: {keycloak?.idTokenParsed.preferred_username}</p>
  //  </div>
  //);

  const { showModal } = useModal();

  const handleButtonClick = () => {
    showModal(<CircularProgress color="inherit" />, 'ok');
  };

  const doDelete = () => {
    console.log('Booking deleted successfully'); // Placeholder for delete logic
    // Here you would typically call your delete booking service
    // For example: bookingService.deleteBooking(bookingId);
  };

  const handleDelete = () => {
    showModal(
      "Are you sure you want to delete this booking?",
      "ask",
      () => {
        // This runs when "Yes" is clicked
        doDelete();
      },
      () => {
        // This runs when "No" is clicked
        // Optionally close modal or do something else
      }
    );
  };

  return (
    <div className="h-screen w-screen grid grid-rows-3 justify-center items-center text-center">
      <div>{/*<p className="text-xl font-bold">Book a bike!</p>*/}</div>
      {/*<div><button onClick={handleButtonClick}>Show Modal</button></div>*/}
      <div><button onClick={handleDelete}>Show Modal</button></div>
      {authenticated ? (
        <div>
          {/*<BookingCalendar userId={keycloak?.idTokenParsed?.sub} />*/}
          {/*<BookingCalendar />*/}
          {/*<MyBookings />*/}
          <p>Hello, {keycloak?.idTokenParsed.preferred_username}!</p>
        </div>
      ) : (
        <div className="">
          <p>Kirjaudu sisään varataksesi moottoripyörän!</p>
        </div>
      )}
      <div>{/*<p>Placeholder</p>*/}</div>
    </div>
  );
};

export default HomeDemo;
