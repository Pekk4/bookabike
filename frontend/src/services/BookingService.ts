import axios from 'axios';

import { apiBaseUrl } from '../constants';

import { Booking } from '../types';

const getAll = async () => {
  //  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);
  //
  //  return data;
  return [
    {
      startDate: new Date('2025-06-10'),
      endDate: new Date('2025-06-13'),
      userId: 'user123',
    },
    {
      startDate: new Date('2025-06-23'),
      endDate: new Date('2025-06-27'),
      userId: 'user123',
    },
  ] as Booking[]; // Mock data for testing purposes
};

const create = async (object: Booking) => {
  //const { data } = await axios.post<Booking>(`${apiBaseUrl}/bookings`, object);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Return the same object
  return object;

  //return data;
};

//const getById = async (id: string) => {
//  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
//
//  return data;
//};

export default {
  getAll,
  create,
  //getById,
};
