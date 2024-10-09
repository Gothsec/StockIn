import supabase from "../../utils/supabase";

export default function ButtonUpdate({ orderUpdated, orderId, onClose }) {
  const handleUpdateOrder = async () => {
    try {
      const { error } = await supabase
        .from("order")
        .update(orderUpdated)
        .eq("id", orderId);

      if (error) {
        console.error("Error: ", error);
      } else {
        onClose();
        window.location.reload();
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
