import { useState } from "react";
import ModalWidows from "./ModalWindows";

export function ProductRow({ name, id, className, onUpdate }) {
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
    productInfo: {}
  });
  const [windowsModal, setWindowsModal] = useState(false);

  const abrirCerrarModal = (titleModal, buttonText, onClickFunction, productInfo) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
      productInfo
    });
    setWindowsModal(!windowsModal);
  };

  const eliminationProduct = () => {
    fetch(`http://localhost:3000/elimination-product/${id}`, {
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

  // setea los valores del abrirCerrarModal
  const setOnClose = () => {abrirCerrarModal("", "", () => {})}

  const getProductById = (id) => {
    // Verifica que el id es válido
    if (!id) {
      console.error('No se proporcionó un ID de producto válido.');
      return;
    }
    fetch(`http://localhost:3000/get-product/${id}`) // Endpoint para obtener el producto específico
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((result) => {
        abrirCerrarModal(
          "Información Producto",
          "Mostrar",
          setOnClose,
          result
        );
      })
      .catch((error) => {
        console.error("Error al obtener información del producto: ", error);
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
            onClick={eliminationProduct}
          >
            Eliminar
          </button>
          <button 
            className="py-1 px-2 bg-green-500 text-white"
            onClick={() => abrirCerrarModal("Modificar Producto", "Modificar", )}
          >
            Editar
          </button>

          <button 
            className="py-1 px-2 bg-blue-500 text-white"
            onClick={() => getProductById(id)}
          >
            Info
          </button>

        </td>
      
      <ModalWidows
        open={windowsModal}
        onClose={() => abrirCerrarModal("", "", () => {})}
        titleModal={modalProps.titleModal}
        buttonText={modalProps.buttonText}
        onClickFunction={modalProps.onClickFunction}
        productInfo={modalProps.productInfo} // Pasa la información del producto al modal
      />
    </tr>
    </>
  );
}
