import supabase from "../../utils/supabase";

export default function ButtonUpdate(orderUpdated, orderId) {
  const handleUpdateOrder = async () => {
    try {
      const { data, error } = await supabase
        .from("order")
        .update(orderUpdated)
        .eq("id", orderId);

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
    <button className="bg-green-500 text-white py-1 px-3 rounded-md" onClick={handleUpdateOrder}>
      Modificar
    </button>
  );
}
