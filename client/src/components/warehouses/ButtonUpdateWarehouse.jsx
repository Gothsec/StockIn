// Propósito: Nos permite actualizar una bodega

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

  const handleUpdateWarehouse = async () => {
    try {
      const { error } = await supabase
        .from("warehouse") // Asegúrate de que sea el nombre correcto de la tabla
        .update(warehouseUpdated)
        .eq("id", warehouseId);

      if (error) {
        console.error("Error: ", error);
        showNotification("Error al actualizar la bodega", "error");
      } else {
        showNotification("Bodega actualizada correctamente", "success");
        onClose();
        onUpdate();
      }
    } catch (error) {
      console.error("Error: ", error);
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
