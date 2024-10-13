import supabase from "../../utils/supabase";

export default function ButtonUpdate({ productUpdated, productId, onClose }) {
  const handleUpdateProduct = async () => {
    try {
      const { error } = await supabase
        .from("product")
        .update(productUpdated)
        .eq("id", productId);

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
    <button className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none" onClick={handleUpdateProduct}>
      Modificar
    </button>
  );
}
