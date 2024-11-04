// Propósito: Nos permite actualizar un producto

import supabase from "../../utils/supabase";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonUpdate({
  productUpdated,
  productId,
  onClose,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  // Función para validar los campos
  const validateFields = () => {
    // Verificar que todos los campos obligatorios estén completos
    if (
      !productUpdated.name ||
      !productUpdated.cost_price ||
      !productUpdated.public_price ||
      !productUpdated.category ||
      !productUpdated.minimum_quantity ||
      !productUpdated.brand ||
      !productUpdated.content ||
      !productUpdated.id_supplier
    ) {
      showNotification("Todos los campos son obligatorios", "error");
      return false;
    }

    // Verificar que los campos numéricos tengan valores válidos
    if (
      isNaN(productUpdated.cost_price) ||
      isNaN(productUpdated.public_price) ||
      isNaN(productUpdated.minimum_quantity)
    ) {
      showNotification("Por favor, ingrese valores numéricos válidos", "error");
      return false;
    }

    // Verificar que los valores numéricos sean mayores que 0
    if (
      productUpdated.cost_price <= 0 ||
      productUpdated.public_price <= 0 ||
      productUpdated.minimum_quantity <= 0
    ) {
      showNotification("Los valores deben ser mayores que 0", "error");
      return false;
    }

    // Verificar que la ganancia sea válida
    const gain = parseFloat(productUpdated.public_price) - parseFloat(productUpdated.cost_price);
    if (gain < 0) {
      showNotification("La ganancia no puede ser negativa", "error");
      return false;
    }

    return true;
  };

  const handleUpdateProduct = async () => {
    // Validar antes de intentar actualizar el producto
    if (!validateFields()) {
      return; // No continuar si la validación falla
    }

    try {
      const { error } = await supabase
        .from("product")
        .update(productUpdated)
        .eq("id", productId);

      if (error) {
        console.error("Error: ", error);
        showNotification("Error al actualizar el producto", "error");
      } else {
        showNotification("Producto actualizado correctamente", "success");
        onClose();
        onUpdate();
      }
    } catch (error) {
      console.error("Error: ", error);
      showNotification("Hubo un error al actualizar el producto", "error");
    }
  };

  return (
    <button
      className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none"
      onClick={handleUpdateProduct}
    >
      Modificar
    </button>
  );
}
