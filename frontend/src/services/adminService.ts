import axios from 'axios';

import { apiBaseUrl } from '../constants';
import useKeycloak from '../hooks/useKeycloak';

import { AdminBooking } from '../types';

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

    return await axios.get<AdminBooking[]>(`${apiBaseUrl}/admin/booking`, config);
  };

  return {
    getAllBookings,
  };
};
