import supabase from "../../utils/supabase";

export default function ButtonCreate(newOrder) {
  const handleCreateOrder = async () => {
    try {
      const { data, error } = await supabase
        .from("product")
        .insert(newOrder)
        .single();

      if (error) {
        console.error("Error: ", error);
      } else {
        if (data) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <button className="bg-blue-500 text-white py-1 px-3 rounded-md" onClick={handleCreateOrder}>
      Crear
    </button>
  );
}
