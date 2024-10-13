import supabase from "../../utils/supabase";
import React, { useContext } from 'react';
import {ConfirmationDataContext} from "../../contexts/ConfirmationData"

export default function ButtonUpdate({ productUpdated, productId, onClose, onUpdate }) {
  
  const { showNotification } = useContext(ConfirmationDataContext);

  const handleUpdateProduct = async () => {
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
    }
  };

  return (
    <button className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none" onClick={handleUpdateProduct}>
      Modificar
    </button>
  );
}
