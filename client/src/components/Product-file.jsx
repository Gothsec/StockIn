// import React, { useEffect } from 'react';

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
        <button className="py-1 px-2 bg-blue-500 text-white">Info</button>
      </td>
    </tr>
  );
}
