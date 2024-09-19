import { useState } from "react";
import ModalWidows from "./ModalWindows";

export function ProductFile({ name, id, className, onUpdate }) {
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
  });
  const [windowsModal, setWindowsModal] = useState(false);

  const abrirCerrarModal = (titleModal, buttonText, onClickFunction) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
    });
    setWindowsModal(!windowsModal);
  };

  const updateProduct = () => {
    fetch(`http://localhost:3000/update-product/${id}`, {
      method: "PATCH", // Usar PATCH para actualizar parcialmente el recurso
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estado: "inactivo", // El campo que se va a actualizar
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "Product updated successfully") { // Mensaje de éxito para la actualización
          if (onUpdate) onUpdate(); // Actualiza la lista de productos después de la actualización
        } else {
          console.error('Failed to update product:', result.message);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
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
            onClick={updateProduct}
          >
            Eliminar
          </button>
          <button className="py-1 px-2 bg-green-500 text-white"
          onClick={() => abrirCerrarModal("Modificar Producto", "Modificar", () => console.log("Función del botón clickeada"))}>Editar</button>
          <button className="py-1 px-2 bg-blue-500 text-white"
          onClick={() => abrirCerrarModal("Información Producto", "Mostrar", () => console.log("Función del botón clickeada"))} >Info</button>
        </td>
      
      <ModalWidows
        open={windowsModal}
        onClose={() => abrirCerrarModal("", "", () => {})}
        titleModal={modalProps.titleModal}
        buttonText={modalProps.buttonText}
        onClickFunction={modalProps.onClickFunction}
      />
    </tr>
    </>
  );
}
