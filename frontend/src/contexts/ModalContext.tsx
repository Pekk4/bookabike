import React, { createContext, useState } from 'react';

import { ModalButtonMode } from '@types';

interface ModalContextProps {
  content: React.ReactNode;
  buttonMode: ModalButtonMode;
  showModal: (
    modalContent: React.ReactNode,
    buttons?: string,
    confirmHandler?: () => void,
    cancelHandler?: () => void,
    errorMode?: boolean
  ) => void;
  hideModal: () => void;
  confirmHandler?: () => void;
  cancelHandler?: () => void;
  errorMode?: boolean;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [buttonMode, setButtonMode] = useState<ModalButtonMode>(ModalButtonMode.NoButtons);
  const [errorMode, setErrorMode] = useState<boolean>(false);
  const [confirmHandler, setConfirmHandler] = useState<(() => void) | undefined>(undefined);
  const [cancelHandler, setCancelHandler] = useState<(() => void) | undefined>(undefined);

  const showModal = (
    modalContent: React.ReactNode,
    buttons?: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    errorMode?: boolean
  ) => {
    switch (buttons) {
      // ad hoc stuff, TODO: clean up
      case 'ok':
        setButtonMode(ModalButtonMode.OkButton);
        break;
      case 'ask':
        setButtonMode(ModalButtonMode.YesNoButtons);
        break;
      case 'close':
        setButtonMode(ModalButtonMode.CloseButton);
        break;
      default:
        setButtonMode(ModalButtonMode.NoButtons);
        break;
    }
    setContent(modalContent);
    setConfirmHandler(() => onConfirm); // store the handler
    setCancelHandler(() => onCancel);
    setErrorMode(errorMode ?? false);
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
        errorMode,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
