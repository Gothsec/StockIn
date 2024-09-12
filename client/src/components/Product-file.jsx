/*import { useEffect, useState } from "react";
import ModalWidows from "../components/ModalWindows";
*/
/*
const [modalProps, setModalProps] = useState({
  titleModal: "",
  buttonText: "",
  onClickFunction: () => {},
});
const [windowsModal, setWindowsModal] = useState(false);
*/
/*
const abrirCerrarModal = (titleModal, buttonText, onClickFunction) => {
  console.log("Modal props:", { titleModal, buttonText, onClickFunction });
  setModalProps({
    titleModal,
    buttonText,
    onClickFunction,
  });
  setWindowsModal(!windowsModal);
};
*/

export function ProductFile({ name, id, className }) {
  const deleteProduct = () => {
    fetch(`http://localhost:3000/remove-product/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((response) => response.json())
    .then((result) => {
      if (result.message === "Product deleted successfully") {
        window.location.reload();
      } else {
        console.error('Failed to delete product:', result.message);
      }
    });
  };

  return (
    <tr
      id={`${id}`}
      className={`flex justify-between items-center w-full ${className}`}
    >
      <td className="p-3">{name}</td>
      <td className="flex justify-between p-3 w-[25%]">
        <button
          className="py-1 px-2 bg-red-500 text-white"
          onClick={deleteProduct}
        >
          Eliminar
        </button>
        <button className="py-1 px-2 bg-green-500 text-white">Editar</button>
        <button className="py-1 px-2 bg-blue-500 text-white"  /*onClick={() => abrirCerrarModal("Modificar Producto", "Modificar", () => console.log("Función del botón clickeada"))} */>Info</button>
      </td>
    </tr>/*,
    <ModalWidows
      open={windowsModal}
      onClose={() => abrirCerrarModal("", "", () => {})}
      titleModal={modalProps.titleModal}
      buttonText={modalProps.buttonText}
      onClickFunction={modalProps.onClickFunction}
  />*/
  );
}
