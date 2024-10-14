import supabase from "../../utils/supabase";
import React, { useContext } from 'react';
import {ConfirmationDataContext} from "../../contexts/ConfirmationData"

export default function ButtonCreate({ newOrder, onClose, onUpdate }) {
  
  const { showNotification } = useContext(ConfirmationDataContext);

  const handleCreateOrder = async () => {
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
        onClose();
        onUpdate();
      }
    } catch (error) {
      console.error("Error al crear la orden: ", error);
    }
  };

  return (
    <button className="bg-blue-500 text-white py-1 px-3 rounded-md" onClick={handleCreateOrder}>
      Crear
    </button>
  );
}
