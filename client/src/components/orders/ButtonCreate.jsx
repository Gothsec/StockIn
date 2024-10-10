import supabase from "../../utils/supabase";

export default function ButtonCreate({ newOrder, onClose }) {
  const handleCreateOrder = async () => {
    try {
      const { error } = await supabase
        .from("order")
        .insert([newOrder])
        .single();

      if (error) {
        console.error("Error al crear la orden: ", error);
      } else {
        onClose();
        window.location.reload();
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
