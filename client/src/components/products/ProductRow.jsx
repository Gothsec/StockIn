// Propósito: Nos permite mostrar una tabla de productos y gestionar sus acciones

import supabase from "../../utils/supabase";
import { useState } from "react";
import { ModalProduct } from "./ModalProduct";
import ConfirmationModal from "./ConfirmationModal";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import DeleteIcon from "../../assets/DeleteIcon";
import EditIcon from "../../assets/EditIcon";
import InfoIcon from "../../assets/InfoIcon";

export default function ProductRow({
  name,
  quantity,
  id,
  brand,
  className,
  onUpdate,
  isLowStock, // Añadir esta línea
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [windowsModal, setWindowsModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    productId: "",
    option: "",
  });

  const abrirCerrarModal = (titleModal, productId, option) => {
    setModalProps({
      titleModal,
      productId,
      option,
    });
    setWindowsModal(!windowsModal);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("product")
        .update({ state: false })
        .eq("id", id);

      if (error) {
        console.error("Error eliminando el producto:", error.message);
        showNotification("Error al eliminar el producto", "error");
      } else {
        showNotification(
          "El producto ha sido eliminado correctamente",
          "success"
        );
        onUpdate();
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const confirmDelete = () => {
    handleDelete();
    setConfirmModalOpen(false);
  };

  return (
    <>
      <tr
        id={id}
        className={className}
        style={{
          color: isLowStock ? 'red' : 'black', // Cambiar color de texto a rojo si está bajo en stock
          fontWeight: isLowStock ? 'bold' : 'normal', // Negrita si está bajo en stock
        }}
      >
        <td className="p-3">{name}</td>
        <td className="p-3 text-center">{quantity}</td>
        <td className="p-3 text-center">{brand}</td>
        <td className="p-3 justify-end flex text-center">
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Información producto", id, "info")}
          >
            <InfoIcon />
          </button>
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Modificar producto", id, "update")}
          >
            <EditIcon />
          </button>
          <button
            className="text-red-400 px-3 rounded-lg flex items-center hover:text-red-600 transition-all duration-300 ease"
            onClick={() => setConfirmModalOpen(true)}
          >
            <DeleteIcon />
          </button>
        </td>
      </tr>

      {windowsModal && (
        <ModalProduct
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          productId={modalProps.productId}
          option={modalProps.option}
          onUpdate={onUpdate}
        />
      )}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        productName={name}
      />
    </>
  );
}


