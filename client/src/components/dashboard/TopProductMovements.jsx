import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

export default function TopMovements() {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopMovements = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("move")
        .select("product_id, product(name)")
        .eq("state", true);

      if (error || !data) {
        console.error("Error fetching data:", error || "No data returned");
        setLoading(false);
        return;
      }

      // Agrupa y cuenta el numero de movimientos por producto
      const productCounts = data.reduce((acc, movement) => {
        const { product_id, product } = movement;
        if (!acc[product_id]) {
          acc[product_id] = { name: product.name, count: 0 };
        }
        acc[product_id].count += 1;
        return acc;
      }, {});

      // Convierte el objeto en un array y ordena por cantidad
      const sortedProducts = Object.entries(productCounts)
        .map(([product_id, details]) => ({ product_id, ...details }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setTopProducts(sortedProducts);
      setLoading(false);
    };

    fetchTopMovements();
  }, []);

  return (
    <div className="w-2/5 p-4 bg-white border-2 border-slate-200 rounded-lg my-3">
      <h3 className="text-lg sm:text-xl font-medium text-gray-600 pb-3">
        Productos con más movimientos
      </h3>
      {loading ? (
        <div className="flex justify-center items-center h-12">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {topProducts.map((product, index) => (
            <li
              key={product.product_id}
              className={`p-2 ${
                index < 3 ? "" : ""
              } flex justify-between`}
            >
              <span className="text-gray-700">{product.name}</span>
              <span className="text-gray-500">{product.count} movimientos</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
