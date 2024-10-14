import supabase from "../../utils/supabase";
import React, { useContext } from 'react';
import {ConfirmationDataContext} from "../../contexts/ConfirmationData"


export default function ButtonCreate({ newProduct, onClose, onUpdate }) {
  
  const { showNotification } = useContext(ConfirmationDataContext);
  
  const handleCreateProduct = async () => {
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
    <button className="bg-blue-500 text-white py-1 px-3 rounded-md" onClick={handleCreateProduct}>
      Crear
    </button>
  );
}
