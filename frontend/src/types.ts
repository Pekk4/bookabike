export interface Booking {
  startDate: Date;
  endDate: Date;
  userId?: string | null;
}

export enum ModalButtonMode {
  NoButtons = 'noButtons',
  OkButton = 'okButton',
  YesNoButtons = 'yesNoButtons',
}
