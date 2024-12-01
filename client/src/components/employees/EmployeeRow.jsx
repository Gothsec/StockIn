import { useState, useContext } from "react";
import supabase from "../../utils/supabase";
import { ModalEmployee } from "./ModalEmployee";
import ConfirmationModal from "./ConfirmationModal";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import InfoIcon from "../../assets/InfoIcon";
import EditIcon from "../../assets/EditIcon";
import DeleteIcon from "../../assets/DeleteIcon";

export default function EmployeeRow({
  name,
  email,
  phone_number,
  id,
  className,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [windowsModal, setWindowsModal] = useState(false); // Controla si el modal está abierto
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    userId: "",
    option: "",
  });

  const abrirCerrarModal = (titleModal, userId, option) => {
    setModalProps({
      titleModal,
      userId,
      option,
    });
    setWindowsModal(true); // Cambiar directamente el estado para abrir el modal
  };

  // Eliminar empleado
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("user")
        .update({ state: false })
        .eq("id", id);

      if (error) {
        showNotification("Error al eliminar el empleado", "error");
        console.error("Error eliminando el empleado:", error.message);
      } else {
        showNotification("El empleado ha sido eliminado correctamente", "success");
        onUpdate();
      }
    } catch (error) {
      console.error("Error al eliminar el empleado:", error);
      showNotification("Error al eliminar el empleado", "error");
    }
  };

  // Confirmación de eliminación
  const confirmDelete = () => {
    handleDelete();
    setConfirmModalOpen(false);
  };

  return (
    <>
      <tr className={`${className} text-left border-b`}>
        <td className="p-3">{name}</td>
        <td className="p-3 text-center">{email}</td>
        <td className="p-3 text-center">{phone_number}</td>
        <td className="p-3 justify-end flex text-center">
          {/* Botón de información */}
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Información del usuario", id, "info")}
          >
            <InfoIcon />
          </button>

          {/* Botón de editar */}
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Modificar usuario", id, "update")}
          >
            <EditIcon />
          </button>

          {/* Botón de eliminar */}
          <button
            className="text-red-400 px-3 rounded-lg flex items-center hover:text-red-600 transition-all duration-300 ease"
            onClick={() => setConfirmModalOpen(true)}
          >
            <DeleteIcon />
          </button>
        </td>
      </tr>

      {/* Modal de información o edición */}
      {windowsModal && (
        <ModalEmployee
          title={modalProps.titleModal}
          employeeId={modalProps.userId} // Cambiado de userId
          option={modalProps.option}
          onClose={() => setWindowsModal(false)} // Cerrar el modal
          onUpdate={onUpdate}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        userName={name}
      />
    </>
  );
}



