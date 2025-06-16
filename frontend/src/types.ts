export interface Booking {
  id: number;
  startDate: Date;
  endDate: Date;
  status: string;
  userId?: string | null; // Is this ever null?
}

export type NewBooking = Omit<Booking, 'id' | 'status'>;

export type PublicBooking = Omit<Booking, 'id' | 'status' | 'userId'>;

export enum ModalButtonMode {
  NoButtons = 'noButtons',
  OkButton = 'okButton',
  YesNoButtons = 'yesNoButtons',
}
