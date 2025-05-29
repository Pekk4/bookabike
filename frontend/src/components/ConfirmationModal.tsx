import clsx from 'clsx';

interface ModalProps {
  message: string | null;
  yesHandler: () => void;
  noHandler: () => void;
  isError?: boolean;
}

const Modal = ({ message, yesHandler, noHandler, isError = false }: ModalProps) => {
  if (message === null) {
    return null;
  }

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
    'text-[#00b100] border-[#2ee700]': !isError, // Add green by default
    'text-[#ff0000] border-[#c40000]': isError, // Otherwise add red
    // TODO: most likely there will be more colours than just two
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className={modalClass}>
        {message}
        <div className="flex flex-row items-center justify-center">
          <button
            onClick={() => yesHandler()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-4"
          >
            Yes
          </button>
          <button
            onClick={() => noHandler()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-4"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
