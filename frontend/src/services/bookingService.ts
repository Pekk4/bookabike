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
      ...object,
      startDate: object.startDate.toDateString(),
      endDate: object.endDate.toDateString(),
    };

    return await axios.post<Booking>(`${apiBaseUrl}/booking`, payload, config);
  };

  return { getAllBookings, createBooking };
};
