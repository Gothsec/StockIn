import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonCreateWarehouse({ newWarehouse, onClose, onUpdate }) {
  const { showNotification } = useContext(ConfirmationDataContext);

  // Validación de los campos antes de enviar el formulario
  const validateWarehouse = () => {
    // Verificar si los campos necesarios están llenos
    if (
      !newWarehouse.name ||
      !newWarehouse.address ||
      !newWarehouse.state ||
      !newWarehouse.id_user ||
      newWarehouse.cant_max_product < 0 ||
      newWarehouse.cant_actual < 0
    ) {
      showNotification("Todos los campos son requeridos.", "error");
      return false;
    }

    // Validar que las cantidades sean números no negativos
    if (newWarehouse.cant_max_product < 0 || newWarehouse.cant_actual < 0) {
      showNotification("Las cantidades deben ser mayores o iguales a cero.", "error");
      return false;
    }

    return true;
  };

  // Función para crear la bodega
  const handleCreateWarehouse = async () => {
    // Validamos los datos antes de enviarlos a la base de datos
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
        onClose(); // Cerramos el modal
        onUpdate(); // Actualizamos el listado o la vista donde se necesita
      }
    } catch (error) {
      console.error("Error al crear la bodega: ", error);
      showNotification("Hubo un error al crear la bodega", "error");
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
