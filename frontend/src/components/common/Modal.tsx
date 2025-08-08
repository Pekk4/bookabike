import clsx from 'clsx';
import Button from '@mui/material/Button';

import { ModalButtonMode } from '../../types';

interface ModalProps {
  content: React.ReactNode;
  buttonMode?: ModalButtonMode;
  confirmHandler?: () => void;
  closingHandler?: () => void;
  errorMode?: boolean;
}

const Modal = ({
  content,
  buttonMode = ModalButtonMode.NoButtons, // What kind of buttons to show (none/"ok"/"yes|no"/"close")
  confirmHandler, // Handler for "Yes" button
  closingHandler, // Handler for closing the modal
  errorMode = false, // If modal is about errors, use red scheme
}: ModalProps) => {
  if (content === null) return null;

  // Base class for modal styles
  const baseClass = clsx(
    'px-20',
    'py-14',
    'bg-white',
    'rounded-lg',
    'font-bold',
    'text-center',
    'flex',
    'flex-col',
    'items-center',
    'justify-center'
  );

  // Extend base class with colors depending on errorMode
  const modalClass = clsx(baseClass, {
    'text-orange-500 black shadow-[0_0_24px_0_rgba(255,255,255,0.9)]': !errorMode,
    'text-red-500 shadow-[0_0_24px_0_rgba(255,0,0,0.9)]': errorMode,
  });

  // Same for button colors
  const modalButtonClass = clsx({
    '!bg-orange-500 hover:!bg-orange-600': !errorMode,
    '!bg-red-500 hover:!bg-red-600': errorMode,
  });

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
      onClick={closingHandler}
    >
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        {content}
        {buttonMode === ModalButtonMode.YesNoButtons && confirmHandler && closingHandler && (
          <div className="flex flex-row items-center justify-center">
            <div className="mt-14 mx-6">
              <Button
                variant="contained"
                size="medium"
                onClick={confirmHandler}
                //className={modalButtonClass}
              >
                Kyllä
              </Button>
            </div>
            <div className="mt-14 mx-6">
              <Button
                variant="contained"
                size="medium"
                onClick={closingHandler}
                //className={modalButtonClass}
              >
                Ei
              </Button>
            </div>
          </div>
        )}
        {buttonMode === ModalButtonMode.OkButton && closingHandler && (
          <div className="mt-14">
            <Button
              variant="contained"
              size="medium"
              onClick={closingHandler}
              //className={modalButtonClass}
            >
              OK
            </Button>
          </div>
        )}
        {buttonMode === ModalButtonMode.CloseButton && closingHandler && (
          <div className="mt-14">
            <Button
              variant="contained"
              size="medium"
              onClick={closingHandler}
              //className={modalButtonClass}
            >
              Sulje
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
