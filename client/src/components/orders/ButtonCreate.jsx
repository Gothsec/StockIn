import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonCreate({ newOrder, onClose, onUpdate }) {
  const { showNotification } = useContext(ConfirmationDataContext);

  // Validación de los campos antes de enviar el formulario
  const validateOrder = () => {
    // Verificar si los campos necesarios están llenos
    if (!newOrder.product_id || !newOrder.supplier_id || !newOrder.date) {
      showNotification("Todos los campos son requeridos.", "error");
      return false;
    }

    // Validar que la cantidad sea mayor a 0
    if (newOrder.quantity <= 0) {
      showNotification("La cantidad debe ser mayor a 0.", "error");
      return false;
    }

    return true;
  };

  // Función para crear la orden
  const handleCreateOrder = async () => {
    // Validamos los datos antes de enviarlos a la base de datos
    if (!validateOrder()) return;

    try {
      const { error } = await supabase
        .from("order")
        .insert([newOrder])
        .single();

      if (error) {
        console.error("Error al crear la orden: ", error);
        showNotification("Error al crear el pedido", "error");
      } else {
        showNotification("El pedido fue creado correctamente", "success");
        onClose(); // Cerramos el modal
        onUpdate(); // Actualizamos el listado o la vista donde se necesita
      }
    } catch (error) {
      console.error("Error al crear la orden: ", error);
      showNotification("Hubo un error al crear el pedido", "error");
    }
  };

  return (
    <button
      className="bg-blue-500 text-white py-1 px-3 rounded-md"
      onClick={handleCreateOrder}
    >
      Crear
    </button>
  );
}
