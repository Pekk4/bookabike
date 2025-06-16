import axios from 'axios';

import { apiBaseUrl } from '../constants';
import useKeycloak from '../hooks/useKeycloak';

import { Booking, NewBooking, PublicBooking } from '../types';

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

  // This will be dedicated for admin use only
  const getAllBookings = async () => {
    const config = await buildHeader();

    return await axios.get<Booking[]>(`${apiBaseUrl}/booking`, config);
  };

  const getAllBookedDates = async () => {
    const config = await buildHeader();

    return await axios.get<PublicBooking[]>(`${apiBaseUrl}/calendar`, config);
  };

  const createBooking = async (booking: NewBooking) => {
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
    //const config = await buildHeader();
    //return await axios.delete(`${apiBaseUrl}/booking/${bookingId}`, config);

    return Promise.resolve({
      status: 200,
      data: { message: 'Booking deleted successfully', bookingId },
    });
  };

  return {
    getAllBookings,
    getAllBookedDates,
    createBooking,
    getUserBookings,
    deleteBooking,
  };
};
