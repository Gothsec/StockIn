import React, { useEffect } from 'react';

export function ProductFile(props) {

  useEffect(() => {
    const deleteButton = document.getElementById(`delete-${props.id}`);
    const row = deleteButton.closest("tr");
    deleteButton.addEventListener("click", () => {
      row.remove();
    });
  }, [props.id])
  

  return (
    <tr id={`file-${props.id}`} className="border border-black">
      <td>{props.name}</td>
      <td className="flex justify-between">
        <button id={`delete-${props.id}`}>Eliminar</button>
        <button>Editar</button>
        <button>Info</button>
      </td>
    </tr>
  );
}
