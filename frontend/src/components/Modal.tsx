import clsx from 'clsx';
import Button from '@mui/material/Button';

import { ModalButtonMode } from '../types';

interface ModalProps {
  message: React.ReactNode;
  mode?: ModalButtonMode;
  confirmHandler?: () => void;
  cancelHandler?: () => void;
  //closeHandler?: () => void;
  errorMode?: boolean;
}

const Modal = ({
  message,
  mode = ModalButtonMode.NoButtons,
  confirmHandler, // Handler for "Yes" button
  cancelHandler, // Handler for "No" button
  //closeHandler, // Handler for "OK" button or modal close, maybe merged to cancelHandler later
  errorMode = false,
}: ModalProps) => {
  if (message === null) return null;

  // Base class for modal styles
  const baseClass = clsx(
    'p-20',
    'bg-white',
    'rounded-xl',
    'border-2',
    'font-bold',
    'text-center',
    'shadow-2xl',
    'flex',
    'flex-col',
    'items-center',
    'justify-center'
  );

  const modalClass = clsx(baseClass, {
    'text-[#00b100] border-[#2ee700]': !errorMode, // Add green by default
    'text-[#ff0000] border-[#c40000]': errorMode, // Otherwise add red
    // TODO: most likely there will be more colours than just two etc
  });

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={cancelHandler}
    >
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        {message}
        {mode === 'yesNoButtons' && confirmHandler && cancelHandler && (
          <div className="flex flex-row items-center justify-center">
            <div className="m-4">
              <Button variant="contained" size="medium" onClick={confirmHandler}>
                Yes
              </Button>
            </div>
            <div className="m-4">
              <Button variant="contained" size="medium" onClick={cancelHandler}>
                No
              </Button>
            </div>
          </div>
        )}
        {mode === 'okButton' && cancelHandler && (
          <Button variant="contained" size="medium" onClick={cancelHandler}>
            OK
          </Button>
        )}
      </div>
    </div>
  );
};

export default Modal;
