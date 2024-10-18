// Proposito: Nos permite actualizar un proveedor existente

import supabase from "../../utils/supabase";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonUpdateSupplier({
  supplierUpdated,
  supplierId,
  onClose,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const handleUpdateSupplier = async () => {
    try {
      const { error } = await supabase
        .from("supplier")
        .update(supplierUpdated)
        .eq("id", supplierId);

      if (error) {
        console.error("Error al actualizar el proveedor: ", error);
        showNotification("Error al actualizar el proveedor", "error");
      } else {
        showNotification(
          "El proveedor fue actualizado correctamente",
          "success"
        );
        onClose();
        onUpdate();
      }
    } catch (error) {
      console.error("Error al actualizar el proveedor: ", error);
    }
  };

  return (
    <button
      className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none"
      onClick={handleUpdateSupplier}
    >
      Modificar
    </button>
  );
}
