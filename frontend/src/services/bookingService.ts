import axios from 'axios';

import { apiBaseUrl } from '../constants';
import useKeycloak from '../hooks/useKeycloak';

import { Booking } from '../types';

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

    return await axios.get<Booking[]>(`${apiBaseUrl}/booking`, config);
  };

  const createBooking = async (object: Booking) => {
    const config = await buildHeader();
    const payload = {
      startDate: object.startDate.toDateString(),
      endDate: object.endDate.toDateString(),
      userId: keycloak?.idTokenParsed?.sub,
    };

    return await axios.post<Booking>(`${apiBaseUrl}/booking`, payload, config);
  };

  const getBookingsByUserId = async (userId: string) => {
    const config = await buildHeader();

    // TODO: fix end point naming
    return await axios.get<Booking[]>(`${apiBaseUrl}/booking?user=${userId}`, config);
  };

  return {
    getAllBookings,
    createBooking,
    getBookingsByUserId,
  };
};
