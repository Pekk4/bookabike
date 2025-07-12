import { BookingStatus } from '../types';

export const getBookingStatusOrder = (isAdmin: boolean = false): Record<string, number> => {
  if (isAdmin) {
    return {
      [BookingStatus.Pending]: 1,
      [BookingStatus.Confirmed]: 2,
      [BookingStatus.Canceled]: 3,
      [BookingStatus.Rejected]: 4,
    };
  } else {
    return {
      [BookingStatus.Confirmed]: 1,
      [BookingStatus.Pending]: 2,
      [BookingStatus.Wished]: 3,
      [BookingStatus.Canceled]: 4,
      [BookingStatus.Rejected]: 5,
    };
  }
};
