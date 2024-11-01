// Proposito: Nos permite actualizar un pedido existente

import supabase from "../../utils/supabase";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonUpdate({
  moveUpdated,
  moveId,
  onClose,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const handleUpdateMove = async () => {
    try {
      const { error } = await supabase
        .from("move")
        .update(moveUpdated)
        .eq("id", moveId);

      if (error) {
        console.error("Error: ", error);
        showNotification("Error al actualizar el movimiento", "error");
      } else {
        showNotification("Movimiento actualizado correctamente", "success");
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
      onClick={handleUpdateMove}
    >
      Modificar
    </button>
  );
}
