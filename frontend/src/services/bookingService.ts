import axios from 'axios';

import { apiBaseUrl } from '../constants';
import useKeycloak from '../hooks/useKeycloak';

import { Booking, NewBooking } from '../types';

export const useBookingService = () => {
  const { keycloak } = useKeycloak();

  const buildHeader = async () => {
    if (!keycloak) throw new Error('Keycloak instance is not available');

    // Ensure the token is still valid
    await keycloak.updateToken(30);

    return {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    };
  };

  const getAllBookings = async () => {
    const config = await buildHeader();

    return await axios.get<NewBooking[]>(`${apiBaseUrl}/booking`, config);
  };

  const getAllBookedDates = async () => {
    const config = await buildHeader();

    return await axios.get<Date[]>(`${apiBaseUrl}/booking/dates`, config);
  };

  const createBooking = async (booking: NewBooking) => {
    const config = await buildHeader();
    const payload = {
      startDate: booking.startDate.toDateString(),
      endDate: booking.endDate.toDateString(),
      // userId will most likely be handled from the JWT
      //userId: keycloak?.idTokenParsed?.sub,
    };

    return await axios.post<Booking>(`${apiBaseUrl}/booking`, payload, config);
  };

  // Possibly unnecessary??
  const getBookingsByUserId = async (userId: string) => {
    const config = await buildHeader();

    // TODO: fix end point naming
    return await axios.get<Booking[]>(`${apiBaseUrl}/booking?user=${userId}`, config);
  };

  const deleteBooking = async (bookingId: number) => {
    const config = await buildHeader();

    //return await axios.delete(`${apiBaseUrl}/booking/${bookingId}`, config);
    return Promise.resolve({ status: 200, data: { message: 'Booking deleted successfully', bookingId } });
  };

  return {
    getAllBookings,
    getAllBookedDates,
    createBooking,
    getBookingsByUserId, // TBD
    deleteBooking,
  };
};
