import React, { useEffect } from 'react';

export function ProductFile({name, id}) {

  const deleteRow = () => {
    const row = document.getElementById(`row-${id}`);
    row.remove();
  }
  

  return (
    <tr id={`row-${id}`} className="w-full border border-black px-2">
      <td>{name}</td>
      <td>
        <button className="text-red-500" onClick={deleteRow}>Eliminar</button>
        <button>Editar</button>
        <button>Info</button>
      </td>
    </tr>
  );
}
