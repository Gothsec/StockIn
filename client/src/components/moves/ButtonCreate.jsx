// Proposito: Nos permite crear un movimiento nuevo

import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonCreate({ newMove, onClose, onUpdate }) {
  const { showNotification } = useContext(ConfirmationDataContext);

  // Validación de los campos antes de enviar el formulario
  const validateMove = () => {
    // Verificar si los campos necesarios están llenos
    if (!newMove.product_id || !newMove.warehouse_id || !newMove.date || !newMove.type || !newMove.quantity) {
      showNotification("Todos los campos son requeridos.", "error");
      console.log(newMove)
      return false;
    }

    // Validar que la cantidad sea mayor a 0
    if (newMove.quantity <= 0) {
      showNotification("La cantidad debe ser mayor a 0.", "error");
      return false;
    }

    return true;
  };

  // Función para crear la orden
  const handleCreateMove = async () => {
    // Validamos los datos antes de enviarlos a la base de datos
    if (!validateMove()) return;

    try {
      const { error } = await supabase
        .from("move")
        .insert([newMove])
        .single();

      if (error) {
        console.error("Error al crear la orden: ", error);
        showNotification("Error al crear el pedido", "error");
      } else {
        showNotification("El movimiento fue creado correctamente", "success");
        onClose(); // Cerramos el modal
        onUpdate(); // Actualizamos el listado o la vista donde se necesita
      }
    } catch (error) {
      console.error("Error al crear el movimiento: ", error);
      showNotification("Hubo un error al crear el movimiento", "error");
    }
  };

  return (
    <button
      className="bg-blue-500 text-white py-1 px-3 rounded-md"
      onClick={handleCreateMove}
    >
      Crear
    </button>
  );
}
