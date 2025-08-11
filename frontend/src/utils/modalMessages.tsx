import LoadingView from '@components/common/LoadingView';

/**
 * Utility functions for modal messages stored in a centralized file.
 */
export const getLoadingSpinner = () => <LoadingView inModal />;

export const getBookingConfirmationMessage = (start: string, end: string) => (
  <div>
    <p>
      Varataanko: {start} - {end}?
    </p>
  </div>
);

export const getBookingUpdateConfirmationMessage = (start: string, end: string) => (
  <div>
    <p>
      Päivitetäänkö varaus: {start} - {end}?
    </p>
  </div>
);

export const getBookingSuccessMessage = (start: string, end: string) => (
  <div>
    <p>Varaus onnistui!</p>
    <p>
      Varattu: {start} - {end}
    </p>
  </div>
);

export const getBookingUpdateSuccessMessage = () => (
  <div>
    <p>Varauksen päivittäminen onnistui!</p>
  </div>
);

export const getBookingErrorMessage = () => (
  <div>
    <p>Varauksen luominen epäonnistui. Yritä uudelleen.</p>
  </div>
);

export const getBookingUpdateErrorMessage = () => (
  <div>
    <p>Varauksen päivittäminen epäonnistui. Yritä uudelleen.</p>
  </div>
);

export const getPleaseLoginMessage = () => (
  <div>
    <p>Kirjaudu sisään nähdäksesi tämän sivun.</p>
  </div>
);

export const getConfirmApproveBookingMessage = () => (
  <div>
    <p>Haluatko varmasti vahvistaa varauksen?</p>
  </div>
);

export const getConfirmRevokeBookingMessage = () => (
  <div>
    <p>Haluatko varmasti perua varauksen?</p>
  </div>
);

export const getConfirmRejectBookingMessage = () => (
  <div>
    <p>Haluatko varmasti hylätä varauksen?</p>
  </div>
);

export const getConfirmDeleteBookingMessage = () => (
  <div>
    <p>Haluatko varmasti poistaa varauksen?</p>
  </div>
);

export const getConfirmCancelBookingMessage = () => (
  <div>
    <p>Haluatko varmasti perua varauksen?</p>
  </div>
);

export const getConfirmBookNowMessage = () => (
  <div>
    <p>Haluatko varmasti vahvistaa varauksen?</p>
  </div>
);
