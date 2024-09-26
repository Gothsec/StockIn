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

  // Trae todos los productos activos de la bd
  const fetchProducts = () => {
    fetch("http://localhost:3000/read-product", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (Array.isArray(result)) { // Comprobacion de que lo que se obtenga sea un array
          setProducts(result);
        } else {
          console.error("Unexpected result format:", result);
          setProducts([]); // Establecer productos como un array vacío si el formato es inesperado
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
        <header className="flex mb-5 justify-between items-baseline pb-8">
          <h1 className="font-bold text-4xl">Productos</h1>
          <input
            className="flex-auto border border-gray-400 h-9 pl-2 rounded-lg ml-4"
            type="search"
            placeholder="Buscar producto"
            onChange={(e) => setSearchProduct(e.target.value)}
          />
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
                // se llama el componente ProductRow para mostrar la lista de productos
                <ProductRow
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  onUpdate={fetchProducts} // se le Asigna la función que lista los productos de la bd, dando un efecto de actualización
                />
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="bg-yellow-500 py-1 px-2 rounded-md text-white hover:bg-yellow-600 mt-2 ml-auto"
          onClick={() =>
            abrirCerrarModal("Nuevo Producto", "Crear", onUpdate)
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
