import { useState, useContext } from "react";
import supabase from "../../utils/supabase";
import { ModalWarehouse } from "./ModalWarehouse";
import ConfirmationModal from "./ConfirmationModal";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import InfoIcon from "../../assets/InfoIcon";
import EditIcon from "../../assets/EditIcon";
import DeleteIcon from "../../assets/DeleteIcon";

export default function WarehouseRow ({
  name,
  responsible,
  cant_actual,
  id,
  className,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [windowsModal, setWindowsModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    warehouseId: "",
    option: "",
  });

  const [validateElimination, setValidateElimination] = useState(false);
  const [countAsociateProducts, setCountAsociateProducts] = useState(0);
  const [validationCompleted, setValidationCompleted] = useState(false);

  const abrirCerrarModal = (titleModal, warehouseId, option) => {
    setModalProps({
      titleModal,
      warehouseId,
      option,
    });
    setWindowsModal(!windowsModal);
  };

  const validationDelete = async () => {
    try {
      const { data, error } = await supabase
        .from("warehouse_product")
        .select("*")
        .eq("id_warehouse", id)
        .gt("stock", 0);

      if (error) {
        console.error("Error al validar la eliminación de la bodega: ", error);
        return { isValid: false, count: 0 };
      }

      if (data.length > 0) {
        return { isValid: false, count: data.length };
      }
      return { isValid: true, count: 0 };
    } catch (err) {
      console.error("Error en la validación:", err);
      return { isValid: false, count: 0 };
    }
  };

  const confirmDelete = async () => {
    const result = await validationDelete();

    setValidateElimination(result.isValid);
    setCountAsociateProducts(result.count);
    setValidationCompleted(true);
    setConfirmModalOpen(true); // Solo abre el modal después de la validación
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("warehouse")
        .update({ state: false })
        .eq("id", id);

      if (error) {
        showNotification("Error al eliminar la bodega", "error");
        console.error("Error eliminando la bodega:", error.message);
      } else {
        showNotification(
          "La bodega ha sido eliminada correctamente",
          "success"
        );
        onUpdate();
      }
    } catch (error) {
      console.error("Error al eliminar la bodega:", error);
    }
    setConfirmModalOpen(false); // Cierra el modal al finalizar
  };

  return (
    <>
      <tr className={`${className} text-left border-b`}>
        <td className="p-3">{name}</td>
        <td className="p-3">{responsible}</td>
        <td className="p-3 text-center">{cant_actual}</td>
        <td className="p-3 flex gap-2 justify-end">
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Información bodega", id, "info")}
          >
            <InfoIcon />
          </button>
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Modificar bodega", id, "update")}
          >
            <EditIcon />
          </button>
          <button
            className="text-red-400 px-3 rounded-lg flex items-center hover:text-red-600 transition-all duration-300 ease"
            onClick={confirmDelete}
          >
            <DeleteIcon />
          </button>
        </td>
      </tr>

      {windowsModal && (
        <ModalWarehouse
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          warehouseId={modalProps.warehouseId}
          option={modalProps.option}
          onUpdate={onUpdate}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen && validationCompleted}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        warehouseName={name}
        type={validateElimination}
        countAsociateProducts={countAsociateProducts}
      />
    </>
  );
};
