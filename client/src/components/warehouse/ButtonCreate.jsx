// Propósito: Nos permite crear una nueva bodega

import supabase from "../../utils/supabase";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonCreateWarehouse({ newWarehouse, onClose, onUpdate }) {
  const { showNotification } = useContext(ConfirmationDataContext);

  // Función para validar los campos
  const validateFields = () => {
    // Verificar que todos los campos obligatorios estén completos
    if (
      !newWarehouse.name ||
      !newWarehouse.address ||
      !newWarehouse.state ||
      !newWarehouse.id_user ||
      !newWarehouse.cant_max_product ||
      !newWarehouse.cant_actual
    ) {
      showNotification("Todos los campos son obligatorios", "error");
      return false;
    }

    // Verificar que los campos numéricos tengan valores válidos
    if (
      isNaN(newWarehouse.cant_max_product) ||
      isNaN(newWarehouse.cant_actual)
    ) {
      showNotification("Por favor, ingrese valores numéricos válidos", "error");
      return false;
    }

    // Verificar que los valores numéricos sean mayores que 0
    if (
      newWarehouse.cant_max_product <= 0 ||
      newWarehouse.cant_actual < 0 // puede ser 0, ya que puede no haber productos
    ) {
      showNotification("La capacidad máxima debe ser mayor que 0 y la capacidad actual no puede ser negativa", "error");
      return false;
    }

    return true;
  };

  const handleCreateWarehouse = async () => {
    // Validar antes de intentar crear la bodega
    if (!validateFields()) {
      return; // No continuar si la validación falla
    }

    try {
      const { error } = await supabase
        .from("warehouse") // Asegúrate de que este sea el nombre correcto de tu tabla
        .insert([newWarehouse])
        .single();

      if (error) {
        console.error("Error al crear la bodega: ", error);
        showNotification("Error al crear la bodega", "error");
      } else {
        showNotification("La bodega fue creada correctamente", "success");
        onClose();
        onUpdate();
      }
    } catch (error) {
      console.error("Error al crear la bodega: ", error);
    }
  };

  return (
    <button
      className="bg-blue-500 text-white py-1 px-3 rounded-md"
      onClick={handleCreateWarehouse}
    >
      Crear
    </button>
  );
}
