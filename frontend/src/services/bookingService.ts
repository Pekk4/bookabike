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

  const buildHeader = async () => {
    if (!keycloak) throw new Error('Keycloak instance is not available');

    // Ensure the token is still valid
    await keycloak.updateToken(30);

    return {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    };
  };

  const getAllBookedDates = async () => {
    const config = await buildHeader();

    return await axios.get<string[]>(`${apiBaseUrl}/calendar`, config);
  };

  const createBooking = async (booking: BaseBooking) => {
    const config = await buildHeader();
    const payload = {
      startDate: booking.startDate.toDateString(),
      endDate: booking.endDate.toDateString(),
    };

    return await axios.post<Booking>(`${apiBaseUrl}/booking`, payload, config);
  };

  const getUserBookings = async () => {
    const config = await buildHeader();

    return await axios.get<Booking[]>(`${apiBaseUrl}/me`, config);
  };

  const deleteBooking = async (bookingId: number) => {
    const config = await buildHeader();

    return await axios.delete(`${apiBaseUrl}/booking/${bookingId}`, config);
  };

  const updateBooking = async (booking: Booking) => {
    const config = await buildHeader();

    const payload = {
      startDate: booking.startDate.toDateString(),
      endDate: booking.endDate.toDateString(),
      status: booking.status,
    };
    const id = booking.id;

    return await axios.put<Booking>(`${apiBaseUrl}/booking/${id}`, payload, config);
  };

  return {
    getAllBookedDates,
    createBooking,
    getUserBookings,
    deleteBooking,
    updateBooking,
  };
};
