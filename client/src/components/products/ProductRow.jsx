import supabase from "../../utils/supabase";
import { useState } from "react";
import { ModalProduct } from "./ModalProduct";
import ConfirmationModal from "./ConfirmationModal";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ProductRow({
  name,
  quantity,
  id,
  brand,
  className,
  onUpdate,
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
      <tr id={id} className={className}>
        <td className="p-3">{name}</td>
        <td className="p-3 text-center">{quantity}</td>
        <td className="p-3 text-center">{brand}</td>
        <td className="p-3 justify-end flex gap-2 text-center">
          <button
            className="py-1 px-2 bg-red-500 text-white rounded-md"
            onClick={() => setConfirmModalOpen(true)}
          >
            Eliminar
          </button>
          <button
            className="py-1 px-2 bg-green-500 text-white rounded-md"
            onClick={() => abrirCerrarModal("Modificar Producto", id, "update")}
          >
            Editar
          </button>
          <button
            className="py-1 px-2 bg-blue-500 text-white rounded-md"
            onClick={() => abrirCerrarModal("Información Producto", id, "info")}
          >
            Info
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
