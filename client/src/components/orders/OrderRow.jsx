import React from "react";

export function OrderRow({ name, id, className, onDelete }) {
  const handleDelete = () => {
    onDelete(id);
  };

  const handleDeleteOrder = () => {
    fetch(`http://localhost:3000/delete-order/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== id)
          );
        } else {
          console.error("No se pudo eliminar el pedido.");
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
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
            onClick={handleDeleteOrder}
          >
            Eliminar
          </button>
          <button
            className="py-1 px-2 bg-green-500 text-white"
            onClick={() =>
              abrirCerrarModal("Modificar Producto", "Modificar", () =>
                console.log("Función del botón clickeada")
              )
            }
          >
            Editar
          </button>
          <button
            className="py-1 px-2 bg-blue-500 text-white"
            onClick={() =>
              abrirCerrarModal("Información Producto", "Mostrar", () =>
                console.log("Función del botón clickeada")
              )
            }
          >
            Info
          </button>
        </td>
      </tr>
    </>
  );
}
