import supabase from "../../utils/supabase";
import React, { useContext } from 'react';
import {ConfirmationDataContext} from "../../contexts/ConfirmationData"

export default function ButtonCreateSupplier({ newSupplier, onClose, onUpdate }) {
  
  const { showNotification } = useContext(ConfirmationDataContext);
  
  const handleCreateSupplier = async () => {
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
        onClose();
        onUpdate();
      }
    } catch (error) {
      console.error("Error al crear el proveedor: ", error);
    }
  };

  return (
    <button className="bg-blue-500 text-white py-1 px-3 rounded-md" onClick={handleCreateSupplier}>
      Crear
    </button>
  );
}
