import { ProductFile } from "../components/ProductFile";
import Nav from "../components/Nav";
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
        setProducts(result);
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = (e) => {
    if (e) e.preventDefault();
    fetchProducts(); // Actualiza la lista de productos después de agregar uno nuevo
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="flex max-h-screen overflow-hidden">
      <Nav />
      <div className="py-6 px-10 w-full flex flex-col">
        <header className="flex mb-5 justify-between items-baseline border-b border pb-8">
          <h1 className="font-bold text-4xl">Productos</h1>
          <div className="flex gap-4">
            <input
              className="border border-gray-400 w-96 pl-2 rounded-md"
              type="search"
              placeholder="Buscar producto"
              onChange={(e) => setSearchProduct(e.target.value)}
            />
            <button className="bg-slate-400 py-1 px-2 rounded-md text-white hover:bg-slate-600">
              Buscar
            </button>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto border border-gray-600">
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-gray-200 sticky top-0 left-0">
                <th className="py-2 text-left px-4">Nombre</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <ProductFile
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  onUpdate={fetchProducts} // Agrega la función de actualización
                />
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="bg-yellow-500 py-1 px-2 rounded-md text-white hover:bg-yellow-600 mt-2 ml-auto"
          onClick={() =>
            abrirCerrarModal("Nuevo Producto", "Crear", handleAddProduct)
          }
        >
          Agregar Producto
        </button>
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
