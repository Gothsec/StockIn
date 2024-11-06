import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonUpdate({
  warehouseUpdated,
  warehouseId,
  onClose,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  // Validación de la bodega
  const validateWarehouse = async () => {
    const requiredFields = ["name", "address", "responsible", "phone_number"];
    for (const field of requiredFields) {
      if (!warehouseUpdated[field]) {
        showNotification("Todos los campos son requeridos.", "error");
        return false;
      }
    }
    return true;
  };

  // Función de actualización de la bodega
  const handleUpdateWarehouse = async () => {
    if (!(await validateWarehouse())) return;

    try {
      const { error } = await supabase
        .from("warehouse")
        .update(warehouseUpdated)
        .eq("id", warehouseId);

      if (error) {
        console.error("Error: ", error);
        showNotification("Error al actualizar la bodega", "error");
        return;
      }

      showNotification("Bodega actualizada correctamente", "success");
      onClose(); // Cerrar el modal
      onUpdate(); // Actualizar la lista de bodegas
    } catch (error) {
      console.error("Error: ", error);
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
