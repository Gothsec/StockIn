// Propósito: Actualizar una bodega existente

import supabase from "../../utils/supabase";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonUpdateWarehouse({
  warehouseUpdated,
  warehouseId,
  onClose,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  // Función para actualizar la bodega
  const handleUpdateWarehouse = async () => {
    try {
      const { error } = await supabase
        .from("warehouse")
        .update(warehouseUpdated)
        .eq("id", warehouseId);

      if (error) {
        console.error("Error al actualizar la bodega: ", error);
        showNotification("Error al actualizar la bodega", "error");
      } else {
        showNotification("La bodega fue actualizada correctamente", "success");
        onClose(); // Cerrar el modal
        onUpdate(); // Actualizar la lista o vista
      }
    } catch (error) {
      console.error("Error al actualizar la bodega: ", error);
      showNotification("Hubo un error al actualizar la bodega", "error");
    }
  };

  return (
    <button
      className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none"
      onClick={handleUpdateWarehouse}
    >
      Modificar
    </button>
  );
}
