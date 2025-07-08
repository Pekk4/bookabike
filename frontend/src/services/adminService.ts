import axios from 'axios';

import { apiBaseUrl } from '../constants';
import useKeycloak from '../hooks/useKeycloak';

import { UserDataBooking } from '../types';

export const useAdminService = () => {
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

    return await axios.get<UserDataBooking[]>(`${apiBaseUrl}/admin/booking`, config);
  };

  const updateBookingStatus = async (bookingId: number, status: string) => {
    const config = await buildHeader();

    return await axios.post(`${apiBaseUrl}/admin/booking/${bookingId}/edit`, { status }, config);
  };

  return {
    getAllBookings,
    updateBookingStatus,
  };
};
