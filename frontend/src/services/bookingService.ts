import axios from 'axios';

import { apiBaseUrl } from '../constants';
import useKeycloak from '../hooks/useKeycloak';

import { BaseBooking, Booking } from '../types';

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

    //return await axios.get<PublicBooking[]>(`${apiBaseUrl}/calendar`, config);
    return await axios.get<string[]>(`${apiBaseUrl}/calendar`, config);
  };

  const createBooking = async (booking: BaseBooking) => {
    const config = await buildHeader();
    const payload = {
      startDate: booking.startDate.toDateString(),
      endDate: booking.endDate.toDateString(),
    };

    //throw new Error('This is a placeholder error for testing purposes');
    // TODO: delete
    //await new Promise((resolve) => setTimeout(resolve, 2000));

    return await axios.post<Booking>(`${apiBaseUrl}/booking`, payload, config);
  };

  const getUserBookings = async () => {
    const config = await buildHeader();

    return await axios.get<Booking[]>(`${apiBaseUrl}/me`, config);
  };

  const deleteBooking = async (bookingId: number) => {
    const config = await buildHeader();

    return await axios.delete(`${apiBaseUrl}/booking/${bookingId}`, config);

    //return Promise.resolve({
    //  status: 200,
    //  data: { message: 'Booking deleted successfully', bookingId },
    //});
  };

  const updateBooking = async (booking: BaseBooking & { bookingId: number }) => {
    const config = await buildHeader();

    const payload = {
      startDate: booking.startDate.toDateString(),
      endDate: booking.endDate.toDateString(),
    };
    const id = booking.bookingId;

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
