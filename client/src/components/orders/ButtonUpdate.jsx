import supabase from "../../utils/supabase";
import React, { useContext } from 'react';
import {ConfirmationDataContext} from "../../contexts/ConfirmationData"

export default function ButtonUpdate({ orderUpdated, orderId, onClose, onUpdate }) {

  const { showNotification } = useContext(ConfirmationDataContext);

  const handleUpdateOrder = async () => {
    try {
      const { error } = await supabase
        .from("order")
        .update(orderUpdated)
        .eq("id", orderId);

      if (error) {
        console.error("Error: ", error);
        showNotification("Error al actualizar la orden", "error");
      } else {
        showNotification("Orden actualizada correctamente", "success");
        onClose();
        onUpdate();
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <button className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none" onClick={handleUpdateOrder}>
      Modificar
    </button>
  );
}
