import { useCallback } from 'react';
import axios from 'axios';

import { apiBaseUrl } from '@constants';
import useKeycloak from '@hooks/useKeycloak';
import { UserDataBooking } from '@types';

/**
 * AdminService provides methods to interact with the admin API endpoints.
 * It requires Keycloak session to access the endpoints with an access token.
 * Token is checked and refreshed automatically before each request.
 *
 * @returns A custom hook to get all bookings and update booking statuses.
 */
export const useAdminService = () => {
  const { keycloak } = useKeycloak();

  const buildHeader = useCallback(async () => {
    if (!keycloak) throw new Error('Keycloak instance is not available');

    // Ensure the token is still valid
    await keycloak.updateToken(30);

    return {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    };
  }, [keycloak]);

  const getAllBookings = useCallback(async () => {
    const config = await buildHeader();

    return await axios.get<UserDataBooking[]>(`${apiBaseUrl}/admin/booking`, config);
  }, [buildHeader]);

  const updateBookingStatus = useCallback(
    async (bookingId: number, status: string, reason?: string) => {
      const config = await buildHeader();

      const payload = {
        status,
        reason: reason || undefined,
      };

      return await axios.post<UserDataBooking>(
        `${apiBaseUrl}/admin/booking/${bookingId}/edit`,
        payload,
        config
      );
    },
    [buildHeader]
  );

  return {
    getAllBookings,
    updateBookingStatus,
  };
};
