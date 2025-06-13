import { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

import { useBookingService } from '../services/bookingService';
import useKeycloak from '../hooks/useKeycloak';
import Modal from './Modal';

import { Booking, ModalButtonMode } from '../types';

const MyBookings = () => {
  const { getBookingsByUserId } = useBookingService();
  const { keycloak } = useKeycloak();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [modalMessage, setModalMessage] = useState<React.ReactNode>(null);
  const [modalButtonMode, setModalButtonMode] = useState<ModalButtonMode>(
    ModalButtonMode.NoButtons
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = keycloak?.idTokenParsed?.sub;
        if (!userId) return;
        const { data } = await getBookingsByUserId(userId);
        if (!data) return;
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBookingClick = (booking: Booking) => {
    setModalMessage(
      <>
        <Typography variant="h5">
          {(() => {
            const month = new Date(booking.startDate).toLocaleString('fi-FI', {
              month: 'long',
            });
            // voi vittu sentään
            return month.charAt(0).toUpperCase() + month.slice(1);
          })()}
        </Typography>
        <Typography className="p-3" variant="body2">
          Aloitus: {new Date(booking.startDate).toLocaleDateString('fi-FI')}
        </Typography>
        <Typography className="p3" variant="body2">
          Palautus: {new Date(booking.endDate).toLocaleDateString('fi-FI')}
        </Typography>
      </>
    );
  };

  const handleModalClose = () => {
    setModalMessage(null);
  };

  return (
    <div className="h-screen w-screen grid grid-rows-6 justify-center items-center text-center">
      <Modal message={modalMessage} mode={modalButtonMode} cancelHandler={handleModalClose} />
      <div>
        <p className="text-xl font-bold">Omat varaukseni</p>
      </div>
      <div className="row-span-2">
        {bookings &&
          bookings.map((booking, index) => (
            <Card onClick={() => {handleBookingClick(booking)}} key={index} sx={{ maxWidth: 345, ':hover': { boxShadow: 10, cursor: 'pointer' } }}>
              <CardContent>
                <Typography className="px-20 py-3" variant="h5" component="div">
                  {(() => {
                    const month = new Date(booking.startDate).toLocaleString('fi-FI', {
                      month: 'long',
                    });
                    // voi vittu sentään
                    return month.charAt(0).toUpperCase() + month.slice(1);
                  })()}
                </Typography>
                <Typography className="p-1.5" variant="body2">
                  Aloitus: {new Date(booking.startDate).toLocaleDateString('fi-FI')}
                </Typography>
                {/*<Typography variant="body2" color="text.secondary">*/}
                <Typography className="p-1.5" variant="body2">
                  Palautus: {new Date(booking.endDate).toLocaleDateString('fi-FI')}
                </Typography>
                <Typography className="p-1.5" variant="body2">
                  Status: {booking.status}
                </Typography>
              </CardContent>
            </Card>
          ))}
        {bookings.length === 0 && <p>{'No bookings yet :('}</p>}
      </div>
      <div>
        <p className="text-xl font-bold">Omat toiveeni</p>
      </div>
    </div>
  );
};

export default MyBookings;
