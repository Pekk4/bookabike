import { useCallback } from 'react';
import axios from 'axios';

import { apiBaseUrl } from '@constants';
import useKeycloak from '@hooks/useKeycloak';
import { BaseBooking, Booking } from '@types';

/**
 * BookingService provides methods to interact with the booking API endpoints.
 * It requires Keycloak session to access the endpoints with an access token.
 * Token is checked and refreshed automatically before each request.
 *
 * @returns A custom hook to get all booked dates, create, update, and delete bookings.
 */
export const useBookingService = () => {
  const { keycloak } = useKeycloak();

  const buildHeader = useCallback(async () => {
    if (!keycloak) throw new Error('Keycloak instance is not available');

    // Ensure the token is still valid
    await keycloak.updateToken(30);

    return {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    };
  }, [keycloak]);

  const getAllBookedDates = useCallback(async () => {
    const config = await buildHeader();
    return await axios.get<string[]>(`${apiBaseUrl}/calendar`, config);
  }, [buildHeader]);

  const createBooking = useCallback(
    async (booking: BaseBooking) => {
      const config = await buildHeader();
      const payload = {
        startDate: booking.startDate.toDateString(),
        endDate: booking.endDate.toDateString(),
      };

      return await axios.post<Booking>(`${apiBaseUrl}/booking`, payload, config);
    },
    [buildHeader]
  );

  const getUserBookings = useCallback(async () => {
    const config = await buildHeader();
    return await axios.get<Booking[]>(`${apiBaseUrl}/me`, config);
  }, [buildHeader]);

  const deleteBooking = useCallback(
    async (bookingId: number) => {
      const config = await buildHeader();
      return await axios.delete(`${apiBaseUrl}/booking/${bookingId}`, config);
    },
    [buildHeader]
  );

  const updateBooking = useCallback(
    async (booking: Booking) => {
      const config = await buildHeader();

      const payload = {
        startDate: booking.startDate.toDateString(),
        endDate: booking.endDate.toDateString(),
        status: booking.status,
      };
      const id = booking.id;

      return await axios.put<Booking>(`${apiBaseUrl}/booking/${id}`, payload, config);
    },
    [buildHeader]
  );

  return {
    getAllBookedDates,
    createBooking,
    getUserBookings,
    deleteBooking,
    updateBooking,
  };
};
