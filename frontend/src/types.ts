export interface BaseBooking {
  startDate: Date;
  endDate: Date;
}

export interface Booking extends BaseBooking {
  id: number;
  status: string;
  userId?: string;
}

// Possibly unused? 18.6.25
export interface PublicBooking extends BaseBooking {
  id: number;
}

export enum ModalButtonMode {
  NoButtons = 'noButtons',
  OkButton = 'okButton',
  YesNoButtons = 'yesNoButtons',
}
