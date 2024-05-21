import { ReactNode, useEffect, useRef } from "react";

export type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
  children: ReactNode;
};

export default function Modal({ openModal, closeModal, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <div
      className={
        openModal
          ? "absolute top-0 left-0 w-full h-full bg-black m-0 bg-opacity-20 z-20"
          : ""
      }
    >
      <dialog
        className="flex flex-col backdrop-filter backdrop-blur-sm z-20"
        ref={ref}
        onCancel={closeModal}
      >
        {children}
        <button onClick={closeModal}>Close</button>
      </dialog>
    </div>
  );
}
