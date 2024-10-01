import { useState } from "react";
import supabase from "../utils/supabase";
import ModalWindows from "./ModalWindows";

export default function ProductRow({ name, id, className, onUpdate }) {
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
    productInfo: {},
  });
  const [windowsModal, setWindowsModal] = useState(false);

  const abrirCerrarModal = (
    titleModal,
    buttonText,
    onClickFunction,
    productInfo
  ) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
      productInfo,
    });
    setWindowsModal(!windowsModal);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("product")
      .update({ state: false })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar el estado del producto: ", error);
    } else {
      if (onUpdate) onUpdate();
    }
  };

  const getProductById = async (id, option) => {
    if (!id) {
      console.error("No se proporcionó un ID de producto válido.");
      return;
    }

    const { data, error } = await supabase
      .from("product")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error al obtener información del producto: ", error);
      return;
    }

    if (option === "update") {
      abrirCerrarModal(
        "Información Producto",
        "Modificar",
        () => handleUpdate(data),
        data
      );
    } else {
      abrirCerrarModal("Información Producto", "Mostrar", () => {}, data);
    }
  };

  const handleUpdate = async (productData) => {
    if (!productData.id) {
      console.error("ID de producto no está definido para la actualización.");
      return;
    }

    const { error } = await supabase
      .from("product")
      .update(productData)
      .eq("id", productData.id);

    if (error) {
      console.error("Error actualizando producto: ", error);
    } else {
      if (onUpdate) onUpdate();
    }

    abrirCerrarModal("", "", () => {}, {});
  };

  return (
    <>
      <tr
        id={id}
        className={`flex justify-between items-center w-full ${className}`}
      >
        <td className="p-3">{name}</td>
        <td className="flex justify-between p-3 w-[25%]">
          <button
            className="py-1 px-2 bg-red-500 text-white rounded-md"
            onClick={handleDelete}
          >
            Eliminar
          </button>
          <button
            className="py-1 px-2 bg-green-500 text-white rounded-md"
            onClick={() => getProductById(id, "update")}
          >
            Editar
          </button>
          <button
            className="py-1 px-2 bg-blue-500 text-white rounded-md"
            onClick={() => getProductById(id, "read")}
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
        productInfo={modalProps.productInfo}
        productId={id}
      />
    </>
  );
}
