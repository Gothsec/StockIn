// Propósito: Crear una nueva bodega

import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonCreateWarehouse({ newWarehouse, onClose, onUpdate }) {
  const { showNotification } = useContext(ConfirmationDataContext);

  // Validación de los campos antes de enviar el formulario
  const validateWarehouse = () => {
    const {
      name,
      address,
      state,
      id_user,
      cant_max_product,
      cant_actual,
    } = newWarehouse;

    // Verificar si los campos requeridos están llenos
    if (!name || !address || !state || !id_user || !cant_max_product || !cant_actual) {
      showNotification("Todos los campos son requeridos.", "error");
      return false;
    }

    // Validar que las cantidades sean números
    if (isNaN(cant_max_product) || isNaN(cant_actual)) {
      showNotification("Las cantidades deben ser números.", "error");
      return false;
    }

    // Validar que `cant_actual` no supere `cant_max_product`
    if (parseInt(cant_actual) > parseInt(cant_max_product)) {
      showNotification("La cantidad actual no puede exceder la cantidad máxima.", "error");
      return false;
    }

    return true;
  };

  // Función para crear la bodega
  const handleCreateWarehouse = async () => {
    if (!validateWarehouse()) return;

    try {
      const { error } = await supabase
        .from("warehouse")
        .insert([newWarehouse])
        .single();

      if (error) {
        console.error("Error al crear la bodega: ", error);
        showNotification("Error al crear la bodega", "error");
      } else {
        showNotification("La bodega fue creada correctamente", "success");
        onClose(); // Cerrar el modal
        onUpdate(); // Actualizar la vista o el listado
      }
    } catch (error) {
      console.error("Error al crear la bodega: ", error);
      showNotification("Hubo un error al crear la bodega", "error");
    }
  };

  return (
    <button
      className="bg-green-500 text-white py-1 px-3 rounded-md"
      onClick={handleCreateWarehouse}
    >
      Crear Bodega
    </button>
  );
}
