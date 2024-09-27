import { ProductRow } from "../components/ProductRow";
import { useEffect, useState } from "react";
import ModalWidows from "../components/ModalWindows";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
  });
  const [windowsModal, setWindowsModal] = useState(false);

  const abrirCerrarModal = (titleModal, buttonText, onClickFunction) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
    });
    setWindowsModal(!windowsModal);
  };

  const fetchProducts = () => {
    fetch("http://localhost:3000/read-product", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (Array.isArray(result)) {
          setProducts(result);
        } else {
          console.error("Unexpected result format:", result);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onUpdate = (e) => {
    if (e) e.preventDefault();
    fetchProducts(); // Lista todos los productos activos que hay en la bd, dando el efecto de actualización
  };

  const filteredProducts = Array.isArray(products) ? products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  ) : [];  

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <header className="flex justify-between items-baseline pb-8">
          <h1 className="font-bold text-4xl">Productos</h1>
          <input
            className="flex-auto border border-gray-400 h-9 rounded-xl pl-2 ml-9"
            type="search"
            placeholder="Buscar producto"
            onChange={(e) => setSearchProduct(e.target.value)}
          />
          <button
            className="bg-blue-500 py-1 px-2 rounded-xl text-white hover:bg-blue-600 mt-3 w-48 h-9 ml-9"
            onClick={() =>
              abrirCerrarModal("Nuevo Producto", "Crear", onUpdate)
            }
          >
            Agregar Producto
          </button>
        </header>

        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-gray-200 sticky top-0 left-0">
                <th className="py-2 text-left px-4">Nombre</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <ProductRow
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  onUpdate={fetchProducts}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalWidows
        open={windowsModal}
        onClose={() => abrirCerrarModal("", "", () => {})}
        titleModal={modalProps.titleModal}
        buttonText={modalProps.buttonText}
        onClickFunction={(e) => {
          modalProps.onClickFunction(e);
          setWindowsModal(false); // Cierra el modal después de ejecutar la función
        }}
      />
    </div>
  );
}
