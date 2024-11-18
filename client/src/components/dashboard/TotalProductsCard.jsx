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

      const total =
        data?.reduce((acc, product) => acc + product.quantity, 0) ?? 0;
      setTotalQuantity(total);
    };

    fetchTotalQuantity();
  }, []);

  const isLoading = totalQuantity === null;

  return (
    <div className="flex flex-col w-1/4 bg-white rounded-lg border-2 border-slate-200 p-4 gap-2">
      <h3 className="text-xl font-medium text-gray-600 text-nowrap">
        Total productos{" "}
      </h3>
      {isLoading ? (
        <div className="flex justify-center items-center h-12">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <p className="text-2xl sm:text-3xl font-bold text-blue-500">
          {totalQuantity}
        </p>
      )}

      <span className="text-xs text-gray-500">Total de productos en stock</span>
    </div>
  );
}
