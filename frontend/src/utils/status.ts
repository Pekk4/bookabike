import { statusTranslations } from '@constants';
import { BookingStatus } from '@types';

export const getBookingStatusOrder = (isAdmin: boolean = false): Record<string, number> => {
  if (isAdmin) {
    return {
      [BookingStatus.Pending]: 1,
      [BookingStatus.Confirmed]: 2,
      [BookingStatus.Canceled]: 3,
      [BookingStatus.Revoked]: 4,
      [BookingStatus.Rejected]: 5,
    };
  } else {
    return {
      [BookingStatus.Confirmed]: 1,
      [BookingStatus.Pending]: 2,
      [BookingStatus.Wished]: 3,
      [BookingStatus.Canceled]: 4,
      [BookingStatus.Revoked]: 5,
      [BookingStatus.Rejected]: 6,
    };
  }
};

export const getStatusColor = (status: string): React.CSSProperties | undefined => {
  switch (status) {
    case BookingStatus.Pending:
      //return { backgroundColor: '#ed6c02', color: '#fff' }; // orange
      return { backgroundColor: '#ff8904', color: '#fff' }; // orange
    case BookingStatus.Confirmed:
      return { backgroundColor: '#2e7d32', color: '#fff' }; // green
    case BookingStatus.Canceled:
      return { backgroundColor: '#888888', color: '#fff' }; // grey
    case BookingStatus.Revoked:
      return { backgroundColor: '#888888', color: '#fff' }; // grey
    case BookingStatus.Rejected:
      return { backgroundColor: '#d32f2f', color: '#fff' }; // red
    case BookingStatus.Wished:
      return { backgroundColor: '#D8CDEA', color: '#222' }; // light purple
    default:
      return undefined;
  }
};

export const getStatusTranslation = (status: string): string => {
  return statusTranslations[status.toLowerCase()] || status;
};
