import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonCreateSupplier({
  newSupplier,
  onClose,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  // Validación de los campos antes de enviar el formulario
  const validateSupplier = () => {
    // Verificar si los campos necesarios están llenos
    if (!newSupplier.name || !newSupplier.phone_number || !newSupplier.email || !newSupplier.address || !newSupplier.city) {
      showNotification("Todos los campos son requeridos.", "error");
      return false;
    }

    // Validar que el teléfono sea un número válido (opcional, pero recomendable)
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(newSupplier.phone_number)) {
      showNotification("El teléfono debe contener solo números.", "error");
      return false;
    }

    // Validar que el email tenga el formato correcto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newSupplier.email)) {
      showNotification("El correo electrónico no tiene un formato válido.", "error");
      return false;
    }

    return true;
  };

  // Función para crear el proveedor
  const handleCreateSupplier = async () => {
    // Validamos los datos antes de enviarlos a la base de datos
    if (!validateSupplier()) return;

    try {
      const { error } = await supabase
        .from("supplier")
        .insert([newSupplier])
        .single();

      if (error) {
        console.error("Error al crear el proveedor: ", error);
        showNotification("Error al crear el proveedor", "error");
      } else {
        showNotification("El proveedor fue creado correctamente", "success");
        onClose(); // Cerramos el modal
        onUpdate(); // Actualizamos el listado o la vista donde se necesita
      }
    } catch (error) {
      console.error("Error al crear el proveedor: ", error);
      showNotification("Hubo un error al crear el proveedor", "error");
    }
  };

  return (
    <button
      className="bg-blue-500 text-white py-1 px-3 rounded-md"
      onClick={handleCreateSupplier}
    >
      Crear
    </button>
  );
}
