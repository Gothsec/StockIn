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

  const validateWarehouseUpdate = async () => {
    // Verificar si los campos necesarios están llenos
    if (
      !warehouseUpdated.name ||
      !warehouseUpdated.address ||
      !warehouseUpdated.responsible ||
      !warehouseUpdated.email ||
      !warehouseUpdated.phone_number ||
      warehouseUpdated.cant_max_product < 0 ||
      warehouseUpdated.cant_actual < 0
    ) {
      showNotification("Todos los campos son requeridos.", "error");
      return false;
    }

    // Validar que las cantidades sean números no negativos
    if (
      warehouseUpdated.cant_max_product < 0 ||
      warehouseUpdated.cant_actual < 0
    ) {
      showNotification(
        "Las cantidades deben ser mayores o iguales a cero.",
        "error"
      );
      return false;
    }

    // Verificar si ya existe otra bodega con el mismo nombre (ignorando mayúsculas/minúsculas)
    const { data: existingWarehouses, error } = await supabase
      .from("warehouse")
      .select("name")
      .neq("id", warehouseId); // Asegurarse de que no se compare con la bodega que se está actualizando

    if (error) {
      console.error("Error al verificar nombres de bodega: ", error);
      return false;
    }

    const lowerCaseName = warehouseUpdated.name.toLowerCase();
    const isNameTaken = existingWarehouses.some(
      (warehouse) => warehouse.name.toLowerCase() === lowerCaseName
    );

    if (isNameTaken) {
      showNotification("El nombre de la bodega ya existe.", "error");
      return false;
    }

    return true;
  };

  const handleUpdateWarehouse = async () => {
    // Validamos los datos antes de enviarlos a la base de datos
    if (!(await validateWarehouseUpdate())) return;

    try {
      const { error } = await supabase
        .from("warehouse")
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
