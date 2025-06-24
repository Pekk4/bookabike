import React, { createContext, useState } from 'react';

import { ModalButtonMode } from '../types';

interface ModalContextProps {
  content: React.ReactNode;
  buttonMode: ModalButtonMode;
  showModal: (
    modalContent: React.ReactNode,
    buttons?: string,
    confirmHandler?: () => void,
    cancelHandler?: () => void
  ) => void;
  hideModal: () => void;
  confirmHandler?: () => void;
  cancelHandler?: () => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [buttonMode, setButtonMode] = useState<ModalButtonMode>(ModalButtonMode.NoButtons);
  const [confirmHandler, setConfirmHandler] = useState<(() => void) | undefined>(undefined);
  const [cancelHandler, setCancelHandler] = useState<(() => void) | undefined>(undefined);

  const showModal = (
    modalContent: React.ReactNode,
    buttons?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    switch (buttons) {
      // ad hoc stuff, TODO: clean up
      case 'ok':
        setButtonMode(ModalButtonMode.OkButton);
        break;
      case 'ask':
        setButtonMode(ModalButtonMode.YesNoButtons);
        break;
      default:
        setButtonMode(ModalButtonMode.NoButtons);
        break;
    }
    setContent(modalContent);
    setConfirmHandler(() => onConfirm); // store the handler
    setCancelHandler(() => onCancel);
  };

  const hideModal = () => {
    setContent(null);
    setButtonMode(ModalButtonMode.NoButtons);
    setConfirmHandler(undefined);
    setCancelHandler(undefined);
  };

  return (
    <ModalContext.Provider
      value={{
        content,
        buttonMode,
        showModal,
        hideModal,
        confirmHandler,
        cancelHandler,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
