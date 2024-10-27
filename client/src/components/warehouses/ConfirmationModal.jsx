const ConfirmationModal = ({ isOpen, onClose, onConfirm, warehouseName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold">
          ¿Estás seguro de eliminar la bodega "{warehouseName}"?
        </h2>
        <div className="flex justify-end mt-4">
          <button
            className="py-1 px-2 bg-gray-300 text-black rounded-md mr-2"
            onClick={onClose}
          >
            Volver
          </button>
          <button
            className="py-1 px-2 bg-red-500 text-white rounded-md"
            onClick={onConfirm}
          >
            Sí, estoy seguro
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
