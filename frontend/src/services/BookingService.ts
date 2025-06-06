import axios from 'axios';

import { apiBaseUrl } from '../constants';

import { Booking } from '../types';

const getAll = async () => {
  const { data } = await axios.get<Booking[]>(`${apiBaseUrl}/booking`);

  return data;
};

const create = async (object: Booking) => {
  // TODO: handle timezone concerns
  // Currently JSON conversion turns Date objects into ISO strings
  // which may cause corner cases with timezones
  console.log('Creating booking with object:', object);

  //console.log('Sending payload:', object);

  const { data } = await axios.post<Booking>(`${apiBaseUrl}/booking`, object);

  //await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

  console.log('Received data:', data);

  return {
    ...data,
    // Convert startDate and endDate back to Date objects // TODO: check
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
  } as Booking;
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
