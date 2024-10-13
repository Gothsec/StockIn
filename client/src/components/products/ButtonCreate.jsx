import supabase from "../../utils/supabase";

export default function ButtonCreate({ newProduct, onClose }) {
  const handleCreateProduct = async () => {
    try {
      const { error } = await supabase
        .from("product")
        .insert([newProduct])
        .single();

      if (error) {
        console.error("Error al crear el producto: ", error);
      } else {
        onClose();
        window.location.reload();
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
