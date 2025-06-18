import { BaseBooking } from '../types';

/**
 * Builds a new Set of booked dates from a given set of dates and a booking object.
 * @param dates A set of existing date strings
 * @param booking A booking object containing start and end dates
 * @returns A new Set of date strings
 */
const buildDatesSet = (dates: Set<string>, booking: BaseBooking): Set<string> => {
  const datesSet = new Set(dates);
  const current = new Date(booking.startDate);
  const end = new Date(booking.endDate);

  while (current <= end) {
    datesSet.add(current.toDateString());
    current.setDate(current.getDate() + 1);
  }

  return datesSet;
};

export default buildDatesSet;
