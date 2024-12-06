// Propósito: Nos permite mostrar y gestionar los productos

import { useEffect, useState } from "react";
import ProductRow from "../components/products/ProductRow";
import { ModalProduct } from "../components/products/ModalProduct";
import supabase from "../utils/supabase";
import MessageConfirmation from "../components/MessageConfirmation";
import AddIcon from "../assets/AddIcon";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
    productId: "",
    option: "",
  });
  const [windowsModal, setWindowsModal] = useState(false);
  const [error, setError] = useState(null);

  const abrirCerrarModal = (
    titleModal,
    buttonText,
    onClickFunction,
    productId = "",
    option = ""
  ) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
      productId,
      option,
    });
    setWindowsModal((prev) => !prev);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("product")
      .select("id, name, quantity, minimum_quantity, brand, state")
      .eq("state", true)
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching products: ", error);
      setError("Error al cargar los productos.");
      setProducts([]);
    } else {
      const updatedProducts = data.map((product) => ({
        ...product,
        isLowStock: product.quantity <= product.minimum_quantity,
      }));
      setProducts(updatedProducts || []);
      setError(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const lowStockProducts = filteredProducts.filter(
    (product) => product.isLowStock
  );

  const productsToDisplay = showLowStock ? lowStockProducts : filteredProducts;

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <div className="flex justify-between items-center pb-4">
          <h1 className="font-bold text-4xl">Productos</h1>
          {lowStockProducts.length > 0 && (
            <div className="text-sm text-red-600 font-semibold">
              Tienes {lowStockProducts.length} producto(s) bajo en stock.
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pb-4">
          <div className="">
            <button
              className={`py-1 px-3 rounded-tr-none rounded-br-none rounded-lg border transition-colors duration-300 border-blue-500 ${
                showLowStock
                  ? "bg-white text-blue-500"
                  : "bg-blue-500 text-white"
              }`}
              onClick={() => setShowLowStock(false)}
            >
              Stock completo
            </button>
            <button
              className={`py-1 px-3 rounded-tl-none rounded-bl-none rounded-lg border transition-colors duration-300  border-blue-500 ${
                showLowStock
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
              onClick={() => setShowLowStock(true)}
            >
              Bajos en stock
            </button>
          </div>
  
          <input
            className="flex-auto border border-gray-400 h-9 rounded-lg pl-3 ml-4"
            type="search"
            placeholder="Buscar producto"
            onChange={(e) => setSearchProduct(e.target.value)}
          />
          <button
            className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg w-48 h-9 ml-4 hover:bg-blue-700 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Nuevo producto", "", "create")}
          >
            <AddIcon />
          </button>
        </div>
        <MessageConfirmation />
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-slate-200 sticky top-0 left-0">
                <th className="py-2 text-left px-4">Nombre</th>
                <th className="py-2 text-center px-40">Stock actual</th>
                <th className="py-2 text-center px-2">Marca</th>
                <th className="py-2 text-center px-10"></th>
              </tr>
            </thead>
            <tbody>
              {productsToDisplay.map((product, index) => (
                <ProductRow
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  quantity={product.quantity}
                  brand={product.brand}
                  isLowStock={product.isLowStock}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  onUpdate={fetchProducts}
                />
              ))}
            </tbody>
          </table>
        </div>

        {windowsModal && (
          <ModalProduct
            open={windowsModal}
            onClose={() => setWindowsModal(false)}
            title={modalProps.titleModal}
            productId={modalProps.productId}
            option={modalProps.option}
            onUpdate={fetchProducts}
          />
        )}
      </div>
    </div>
  );
}


