// Proposito: Nos permite crear un producto nuevo

import supabase from "../../utils/supabase";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonCreate({ newProduct, onClose, onUpdate }) {
  const { showNotification } = useContext(ConfirmationDataContext);

  // Función para validar los campos
  const validateFields = () => {
    // Verificar que todos los campos obligatorios estén completos
    if (
      !newProduct.name ||
      !newProduct.quantity ||
      !newProduct.cost_price ||
      !newProduct.public_price ||
      !newProduct.category ||
      !newProduct.minimum_quantity ||
      !newProduct.brand
    ) {
      showNotification("Todos los campos son obligatorios", "error");
      return false;
    }

    // Verificar que los campos numéricos tengan valores válidos
    if (
      isNaN(newProduct.quantity) ||
      isNaN(newProduct.cost_price) ||
      isNaN(newProduct.public_price) ||
      isNaN(newProduct.minimum_quantity)
    ) {
      showNotification("Por favor, ingrese valores numéricos válidos", "error");
      return false;
    }

    // Verificar que los valores numéricos sean mayores que 0
    if (
      newProduct.quantity <= 0 ||
      newProduct.cost_price <= 0 ||
      newProduct.public_price <= 0 ||
      newProduct.minimum_quantity <= 0
    ) {
      showNotification("Los valores deben ser mayores que 0", "error");
      return false;
    }

    // Verificar que la ganancia sea válida
    const gain = parseFloat(newProduct.public_price) - parseFloat(newProduct.cost_price);
    if (gain < 0) {
      showNotification("La ganancia no puede ser negativa", "error");
      return false;
    }

    return true;
  };

  const handleCreateProduct = async () => {
    // Validar antes de intentar crear el producto
    if (!validateFields()) {
      return; // No continuar si la validación falla
    }

    try {
      const { error } = await supabase
        .from("product")
        .insert([newProduct])
        .single();

      if (error) {
        console.error("Error al crear el producto: ", error);
        showNotification("Error al crear el producto", "error");
      } else {
        showNotification("El producto fue creado correctamente", "success");
        onClose();
        onUpdate();
      }
    } catch (error) {
      console.error("Error al crear el producto: ", error);
    }
  };

  return (
    <button
      className="bg-blue-500 text-white py-1 px-3 rounded-md"
      onClick={handleCreateProduct}
    >
      Crear
    </button>
  );
}
