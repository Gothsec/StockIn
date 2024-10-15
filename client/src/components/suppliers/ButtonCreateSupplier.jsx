import supabase from "../../utils/supabase";

export default function ButtonCreateSupplier({ newSupplier, onClose }) {
  const handleCreateSupplier = async () => {
    try {
      const { error } = await supabase
        .from("supplier")
        .insert([newSupplier])
        .single();

      if (error) {
        console.error("Error al crear el proveedor: ", error);
      } else {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al crear el proveedor: ", error);
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
