import { useState } from "react";
import supabase from "../../utils/supabase";
import ModalWindows from "./ModalWindows";

export default function OrderRow({ description, id, className, onUpdate }) {
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
    orderInfo: {},
  });
  const [windowsModal, setWindowsModal] = useState(false);

  const abrirCerrarModal = (
    titleModal,
    buttonText,
    onClickFunction,
    orderInfo
  ) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
      orderInfo,
    });
    setWindowsModal(!windowsModal);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("order")
      .update({ state: false })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar el estado del pedido: ", error);
    } else {
      if (onUpdate) onUpdate();
    }
  };

  const getOrderById = async (id, option) => {
    if (!id) {
      console.error("No se proporcionó un ID de producto válido.");
      return;
    }

    const { data, error } = await supabase
      .from("order")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error al obtener información del pedido: ", error);
      return;
    }

    if (option === "update") {
      abrirCerrarModal(
        "Información Pedido",
        "Modificar",
        () => handleUpdate(data),
        data
      );
    } else {
      abrirCerrarModal("Información Producto", "Mostrar", () => {}, data);
    }
  };

  const handleUpdate = async (orderData) => {
    if (!id) {
      console.error("ID de pedido no está definido para la actualización.");
      return;
    }

    const { error } = await supabase
      .from("order")
      .update(orderData)
      .eq("id", id);

    if (error) {
      console.error("Error actualizando pedido: ", error);
    } else {
      if (onUpdate) onUpdate();
    }

    abrirCerrarModal("", "", () => {}, {});
  };

  return (
    <>
      <tr
        id={`${id}`}
        className={`flex justify-between items-center w-full ${className}`}
      >
        <td className="p-3">{description}</td>
        <td className="flex justify-between p-3 w-[25%]">
          <button
            className="py-1 px-2 bg-red-500 text-white rounded-md"
            onClick={handleDelete}
          >
            Eliminar
          </button>
          <button
            className="py-1 px-2 bg-green-500 text-white rounded-md"
            onClick={() => getOrderById(id, "update")}
          >
            Editar
          </button>
          <button
            className="py-1 px-2 bg-blue-500 text-white rounded-md"
            onClick={() => getOrderById(id, "read")}
          >
            Info
          </button>
        </td>
      </tr>
      <ModalWindows
        open={windowsModal}
        onClose={() => abrirCerrarModal("", "", () => {}, {})}
        titleModal={modalProps.titleModal}
        buttonText={modalProps.buttonText}
        onClickFunction={modalProps.onClickFunction}
        orderInfo={modalProps.orderInfo}
        orderId={id}
      />
    </>
  );
}