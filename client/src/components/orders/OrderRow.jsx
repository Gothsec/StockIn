import React, { useState } from "react";
import ReadUpdateOrderModal from "./ReadUpdateOrderModal";

export function OrderRow({ name, id, className, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOption, setModalOption] = useState("read");

  const handleDeleteOrder = () => {
    onDelete(id);
    fetch(`http://localhost:3000/delete-order/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Aquí deberías actualizar el estado de la lista de pedidos
        } else {
          console.error("No se pudo eliminar el pedido.");
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const openModal = (option) => {
    setModalOption(option);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <tr
        id={`${id}`}
        className={`flex justify-between items-center w-full ${className}`}
      >
        <td className="p-3">{name}</td>
        <td className="flex justify-between p-3 w-[25%]">
          <button
            className="py-1 px-2 bg-red-500 text-white"
            onClick={handleDeleteOrder}
          >
            Eliminar
          </button>
          <button
            className="py-1 px-2 bg-green-500 text-white"
            onClick={() => openModal("update")}
          >
            Editar
          </button>
          <button
            className="py-1 px-2 bg-blue-500 text-white"
            onClick={() => openModal("read")}
          >
            Info
          </button>
        </td>
      </tr>

      {isModalOpen && (
        <ReadUpdateOrderModal option={modalOption} id={id} onClose={closeModal} />
      )}
    </>
  );
}
