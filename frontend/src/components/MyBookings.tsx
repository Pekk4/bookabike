import { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

import { useBookingService } from '../services/bookingService';
import useKeycloak from '../hooks/useKeycloak';
import Modal from './Modal';
import EditOrDeleteBar from './EditOrDeleteBar';

import { Booking, ModalButtonMode } from '../types';
//import { Booking } from '../types';

const MyBookings = () => {
  const { getBookingsByUserId, deleteBooking } = useBookingService();
  const { keycloak } = useKeycloak();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [modalMessage, setModalMessage] = useState<React.ReactNode>(null);
  const [modalButtonMode, setModalButtonMode] = useState<ModalButtonMode>(
    ModalButtonMode.NoButtons
  );
  const [modalConfirmAction, setModalConfirmAction] = useState<() => void>(() => {});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = keycloak?.idTokenParsed?.sub;
        if (!userId) return;
        // Fetching will most likely change later
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

  const handleModalClose = () => {
    setModalMessage(null);
    setModalButtonMode(ModalButtonMode.NoButtons);
  };

  const handleDeleteClick = (id: number) => {
    setModalButtonMode(ModalButtonMode.YesNoButtons);
    setModalMessage('Haluatko varmasti poistaa varauksesi?');
    setModalConfirmAction(() => () => {
      handleDeleteBooking(id);
    });
  };

  const handleEditBooking = () => {
    // placeholder/sketch
    console.log('Edit button clicked');
    handleModalClose();
  };

  const handleDeleteBooking = async (id: number) => {
    try {
      await deleteBooking(id);
      // TODO: clean this shit up
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
      handleModalClose();
    } catch (error) {
      // TODO: handle properly
      console.error('Error deleting booking:', error);
      setModalMessage('Varauksen poistaminen epäonnistui.');
    }
  };

  const handleBookingClick = (booking: Booking) => {
    setModalMessage(
      <div className="">
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
        <EditOrDeleteBar
          onEdit={handleEditBooking}
          onDelete={() => {
            handleDeleteClick(booking.id);
          }}
        />
      </div>
    );
  };

  return (
    <div className="h-screen w-screen grid grid-rows-6 justify-center items-center text-center">
      <Modal
        message={modalMessage}
        mode={modalButtonMode}
        confirmHandler={modalConfirmAction}
        cancelHandler={handleModalClose}
      />
      <div></div>
      <div className="row-span-2">
        <Typography variant="h5" component="div">
          Omat varaukseni
        </Typography>
        {bookings &&
          bookings
            .filter((booking) => booking.status !== 'wished')
            .map((booking) => (
              <Card
                key={booking.id}
                onClick={() => {
                  handleBookingClick(booking);
                }}
                sx={{
                  maxWidth: 345,
                  ':hover': {
                    boxShadow: '0 4px 20px 0 #ff9800',
                    cursor: 'pointer',
                  },
                  border: '1px solid #ff9800',
                }}
              >
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
        {bookings.filter((booking) => booking.status !== 'wished').length === 0 && (
          <p>{'No bookings yet :('}</p>
        )}
      </div>
      <div>
        <p className="text-xl font-bold">Omat toiveeni</p>
        {bookings &&
          bookings
            .filter((booking) => booking.status === 'wished')
            .map((booking) => (
              <Card
                key={booking.id}
                onClick={() => {
                  handleBookingClick(booking);
                }}
                sx={{
                  maxWidth: 345,
                  ':hover': {
                    boxShadow: '0 4px 20px 0 #2196f3',
                    cursor: 'pointer',
                  },
                  border: '1px solid #2196f3',
                }}
              >
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
        {bookings.filter((booking) => booking.status === 'wished').length === 0 && (
          <p>{'No wished bookings yet :('}</p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
