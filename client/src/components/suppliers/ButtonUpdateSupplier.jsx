// Propósito: Nos permite actualizar un proveedor existente

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

  // Función para validar los campos
  const validateFields = () => {
    // Verificar que todos los campos obligatorios estén completos
    if (
      !supplierUpdated.name ||
      !supplierUpdated.phone_number ||
      !supplierUpdated.email ||
      !supplierUpdated.address || // Asegúrate de incluir los campos correctos
      !supplierUpdated.city
    ) {
      showNotification("Todos los campos son obligatorios", "error");
      return false;
    }

    // Validar el formato del número de teléfono (ejemplo: 10 dígitos)
    if (!/^\d{10}$/.test(supplierUpdated.phone_number)) {
      showNotification("El número de teléfono debe tener 10 dígitos.", "error");
      return false;
    }

    // Validar el formato del correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(supplierUpdated.email)) {
      showNotification("El correo electrónico no es válido.", "error");
      return false;
    }

    return true;
  };

  const handleUpdateSupplier = async () => {
    // Validar antes de intentar actualizar el proveedor
    if (!validateFields()) {
      return; // No continuar si la validación falla
    }

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
      showNotification("Hubo un error al actualizar el proveedor", "error");
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
