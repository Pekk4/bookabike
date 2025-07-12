export interface BaseBooking {
  startDate: Date;
  endDate: Date;
}

export interface Booking extends BaseBooking {
  id: number;
  status: BookingStatus;
  userId: string;
  createdAt: Date;
}

// Possibly unused? 18.6.25
export interface PublicBooking extends BaseBooking {
  id: number;
}

export interface UserDataBooking extends BaseBooking {
  id: number;
  status: BookingStatus;
  user: User;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
}

export enum ModalButtonMode {
  NoButtons = 'noButtons',
  OkButton = 'okButton',
  YesNoButtons = 'yesNoButtons',
}

export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Canceled = 'canceled',
  Wished = 'wished',
  Rejected = 'rejected',
}
