export interface Booking {
  startDate: Date;
  endDate: Date;
  status: string;
  userId?: string | null;
}

export enum ModalButtonMode {
  NoButtons = 'noButtons',
  OkButton = 'okButton',
  YesNoButtons = 'yesNoButtons',
}
