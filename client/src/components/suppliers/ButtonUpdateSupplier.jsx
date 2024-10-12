import supabase from "../../utils/supabase";

export default function ButtonUpdateSupplier({ supplierUpdated, supplierId, onClose }) {
  const handleUpdateSupplier = async () => {
    try {
      const { error } = await supabase
        .from("supplier")
        .update(supplierUpdated)
        .eq("id", supplierId);

      if (error) {
        console.error("Error al actualizar el proveedor: ", error);
      } else {
        onClose();
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Error al actualizar el proveedor: ", error);
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
