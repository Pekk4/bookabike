import clsx from "clsx";

interface ModalProps {
  message: string | null;
  isError?: boolean;
}

const Modal = ({ message, isError = false }: ModalProps) => {
  if (message === null) {
    return null
  };

  // Base class for modal styles
  const baseClass = clsx(
    "p-20",
    "bg-white",
    "rounded-xl",
    "border-2",
    "font-bold",
    "text-center",
    "shadow-2xl",    
  );

  const modalClass = clsx(baseClass, {
    "text-[#00b100] border-[#2ee700]": !isError, // Add green by default
    "text-[#ff0000] border-[#c40000]": isError, // Otherwise add red
    // TODO: most likely there will be more colours than just two
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className={modalClass}>
            {message}
        </div>
    </div>
  );
};

export default Modal
