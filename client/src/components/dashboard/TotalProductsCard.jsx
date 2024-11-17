import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

export default function Dashboard() {
  const [totalQuantity, setTotalQuantity] = useState(null);

  useEffect(() => {
    const fetchTotalQuantity = async () => {
      const { data, error } = await supabase
        .from("product")
        .select("quantity", { count: "none" })
        .eq("state", true);

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      const total = data?.reduce((acc, product) => acc + product.quantity, 0) ?? 0;
      setTotalQuantity(total);
    };

    fetchTotalQuantity();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-slate-50 rounded-lg border-2 border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-gray-700">Total productos </h2>
        <p className="text-4xl font-bold text-blue-500">
          {totalQuantity !== null ? totalQuantity : "..."}
        </p>
      </div>
    </div>
  );
}
