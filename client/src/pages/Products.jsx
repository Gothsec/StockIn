import ProductRow from "../components/ProductRow";
import { useEffect, useState } from "react";
import ModalWindows from "../components/ModalWindows";
import supabase from "../utils/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
  });
  const [windowsModal, setWindowsModal] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false); 
  const [error, setError] = useState(null);

  const abrirCerrarModal = (titleModal, buttonText, onClickFunction) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
    });
    setWindowsModal((prev) => !prev);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("product")
      .select("id, name, quantity, minimum_quantity, brand, state")
      .eq("state", true);

    if (error) {
      console.error("Error fetching products: ", error);
      setError("Error al cargar los productos.");
      setProducts([]);
    } else {
      const updatedProducts = data.map((product) => ({
        ...product,
        isLowStock: product.quantity <= product.minimum_quantity,
      }));
      setProducts(updatedProducts|| []);
      setError(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onUpdate = (e) => {
    if (e) e.preventDefault();
    fetchProducts();
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchProduct.toLowerCase())
      )
    : [];

    const lowStockProducts = filteredProducts.filter(
      (product) => product.isLowStock
  );

  const productsToDisplay = showLowStock ? lowStockProducts : filteredProducts; // Condicional para mostrar productos

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <div className="pb-4">
          <h1 className="font-bold text-4xl">Productos</h1>
          {lowStockProducts.length > 0 && (
            <div className="text-sm text-red-600 font-semibold pt-2">
              Tienes {lowStockProducts.length} producto(s) bajo en stock.
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pb-4">
          {/* Botones de filtro */}
          <div className="space-x-4">
            <button
              className={`py-1 px-3 rounded border transition-colors duration-300 ${showLowStock ? "bg-blue-500 text-white border-blue-500 hover:bg-white hover:text-blue-500 hover:border-blue-500" : "bg-blue-500 text-white border-blue-500 hover:bg-white hover:text-blue-500 hover:border-blue-500"}`}
              onClick={() => setShowLowStock(false)}
            >
              Stock completo
            </button>
            <button
               className={`py-1 px-3 rounded border transition-colors duration-300 ${showLowStock ? "bg-red-500 text-white border-red-500 hover:bg-white hover:text-red-500 hover:border-red-500" : "bg-red-500 text-white border-red-500 hover:bg-white hover:text-red-500 hover:border-red-500"}`}
               onClick={() => setShowLowStock(true)}
            >
               Bajos en stock
            </button>
          </div>


          <input
            className="flex-auto border border-gray-400 h-9 rounded-xl pl-2 ml-9"
            type="search"
            placeholder="Buscar producto"
            onChange={(e) => setSearchProduct(e.target.value)}
          />
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-2xl transition-all duration-300 ease-in-out transform hover:bg-white hover:text-indigo-900 border-2 border-indigo-600 mt-3 w-48 h-11 ml-9"
            onClick={() =>
              abrirCerrarModal("Nuevo Producto", "Crear", onUpdate)
            }
          >
            Agregar Producto
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-gray-200 sticky top-0 left-0">
                <th className="py-2 text-left px-4">Nombre</th>
                <th className="py-2 text-left px-40">Stock Actual</th>
                <th className="py-2 text-left px-2">Marca</th>
                <th className="py-2 text-left px-10"></th>
              </tr>
            </thead>
            <tbody>
              {productsToDisplay.map((product, index) => (
                <ProductRow
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  quantity={product.quantity}
                  minimum_quantity={product.minimum_quantity}
                  brand={product.brand}
                  isLowStock={product.isLowStock}
                  onUpdate={fetchProducts}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalWindows
        open={windowsModal}
        onClose={() => abrirCerrarModal("", "", () => {})}
        titleModal={modalProps.titleModal}
        buttonText={modalProps.buttonText}
        onClickFunction={(e) => {
          modalProps.onClickFunction(e);
          setWindowsModal(false);
        }}
      />
    </div>
  );
}
