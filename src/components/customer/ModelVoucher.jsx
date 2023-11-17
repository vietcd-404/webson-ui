import { useEffect, useRef } from "react";

const ModelVoucher = ({ isOpen, closeModal, title, content }) => {
  const modalRef = useRef();

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center overlay  ">
          <div className="fixed inset-0 bg-gray-600 opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-lg z-50 w-[400px]">
            <div className="flex justify-between  mb-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeModal}
              >
                Thoát
              </button>
            </div>
            <div className="overflow-auto h-[400px]">{content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModelVoucher;
