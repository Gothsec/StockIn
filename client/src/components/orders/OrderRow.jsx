export function OrderRow({ name, id, className }) {
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
