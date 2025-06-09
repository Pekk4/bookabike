import useKeycloak from '../hooks/useKeycloak';

import BookingCalendar from './BookingCalendar';

const HomeDemo = () => {
  const { keycloak, authenticated, admin } = useKeycloak();

  //console.log(keycloak?.tokenParsed); // DELETE
  console.log('access token should be here: ');
  console.log(keycloak?.token);
  return (
    <div className="h-screen w-screen grid grid-rows-3 justify-center items-center text-center">
      <div>
        <p className="text-xl font-bold">Book a bike!</p>
      </div>
      {authenticated ? (
        <div>
          <BookingCalendar userId={keycloak?.idTokenParsed?.sub} />
        </div>
      ) : (
        <div className="">
          <p>Kirjaudu sisään varataksesi moottoripyörän!</p>
        </div>
      )}
      <div>
        <p>Placeholder</p>
      </div>
    </div>
  );
};

export default HomeDemo;
