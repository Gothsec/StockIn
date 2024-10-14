import supabase from "../../utils/supabase";
import { useState } from "react";
import { ModalOrder } from "./ModalOrder";
import ConfirmationModal from "./ConfirmationModal";
import React, { useContext } from 'react';
import {ConfirmationDataContext} from "../../contexts/ConfirmationData"

export default function OrderRow({ name, quantity, id, className, onUpdate }) {

  const { showNotification } = useContext(ConfirmationDataContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [windowsModal, setWindowsModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    orderId: "",
    option: "",
  });

  const abrirCerrarModal = (titleModal, orderId, option) => {
    setModalProps({
      titleModal,
      orderId,
      option,
    });
    setWindowsModal(!windowsModal);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("order")
        .update({ state: false })
        .eq("id", id);

      if (error) {
        showNotification("Error al eliminar el pedido", "error");
        console.error("Error eliminando el pedido:", error.message);
      } else {
        showNotification("El pedido ha sido eliminado correctamente", "success");
        onUpdate();
      }
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  const confirmDelete = () => {
    handleDelete();
    setConfirmModalOpen(false);
  };

  return (
    <>
      <tr className={`${className} text-left border-b`}>
        <td className="p-3">{name}</td>
        <td className="p-3 text-center">{quantity}</td>
        <td className="p-3 flex gap-2 justify-end">
          <button
            className="py-1 px-2 bg-red-500 text-white rounded-md"
            onClick={() => setConfirmModalOpen(true)}
          >
            Eliminar
          </button>
          <button
            className="py-1 px-2 bg-green-500 text-white rounded-md"
            onClick={() => abrirCerrarModal("Modificar Pedido", id, "update")}
          >
            Editar
          </button>
          <button
            className="py-1 px-2 bg-blue-500 text-white rounded-md"
            onClick={() => abrirCerrarModal("Información Pedido", id, "info")}
          >
            Info
          </button>
        </td>
      </tr>

      {windowsModal && (
        <ModalOrder
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          orderId={modalProps.orderId}
          option={modalProps.option}
          onUpdate={onUpdate}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        orderName={name}
      />
    </>
  );
}
