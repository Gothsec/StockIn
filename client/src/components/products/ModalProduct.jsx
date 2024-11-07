import { useEffect, useState } from "react";
import ButtonCreate from "./ButtonCreate";
import ButtonUpdate from "./ButtonUpdate";
import supabase from "../../utils/supabase";

export function ModalProduct({ title, option, onClose, productId, onUpdate }) {
  const [productInfo, setProductInfo] = useState({
    name: "",
    quantity: 0,
    cost_price: "",
    public_price: "",
    gain: "",
    category: "",
    minimum_quantity: "",
    brand: "",
    content: "",
    id_supplier: "",
  });

  const categories = [
    "Cuidado del cabello",
    "Cuidado de la barba",
    "Cuidado de la piel",
    "Herramientas de corte",
    "Maquillaje y cosmética",
    "Cuidado de uñas",
    "Fragancias y colonias",
    "Accesorios",
  ];

  const [supplier, setSupplier] = useState([]);

  const fetchSupplierNames = async () => {
    try {
      const { data, error } = await supabase
        .from("supplier")
        .select("*")
        .eq("state", "TRUE");

      if (error) {
        console.error("Error: ", error);
      } else {
        if (data) {
          setSupplier(data);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    fetchSupplierNames();
  }, []);

  const handleGetProductInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("product")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error al obtener información del producto: ", error);
        return;
      } else {
        setProductInfo(data);
      }
    } catch (error) {
      console.error("Error al obtener información del producto: ", error);
    }
  };

  useEffect(() => {
    if (productId) {
      handleGetProductInfo();
    }
  }, [productId]);

  useEffect(() => {
    const gain =
      parseFloat(productInfo.public_price) - parseFloat(productInfo.cost_price);
    if (!isNaN(gain)) {
      setProductInfo({ ...productInfo, gain: gain.toFixed(0) });
    }
  }, [productInfo.cost_price, productInfo.public_price]);

  const newProduct = {
    name: productInfo.name,
    quantity: 0, // cantidad de productos
    cost_price: productInfo.cost_price,
    public_price: productInfo.public_price,
    gain: productInfo.gain,
    category: productInfo.category,
    minimum_quantity: productInfo.minimum_quantity,
    brand: productInfo.brand,
    content: productInfo.content, // contenido del producto
    id_supplier: productInfo.id_supplier, // id del proveedor
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 p-10 flex items-center justify-center">
      {option !== "info" ? (
        <div className="w-[800px] min-h-[100px] bg-white relative rounded-lg shadow-lg p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{title}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="my-4 col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                name="name"
                id="name"
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={productInfo.name}
                onChange={(e) =>
                  setProductInfo({ ...productInfo, name: e.target.value })
                }
                readOnly={option === "info"}
                required={option === "create" || option === "update"}
              />
            </div>

            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">
                Precio costo
              </label>
              <input
                name="cost_price"
                id="cost_price"
                type="number"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={productInfo.cost_price}
                onChange={(e) =>
                  setProductInfo({ ...productInfo, cost_price: e.target.value })
                }
                required={option === "create" || option === "update"}
                readOnly={option === "info"}
              />
            </div>

            <div className="my-4 col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Precio público
              </label>
              <input
                name="public_price"
                id="public_price"
                type="number"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={productInfo.public_price}
                onChange={(e) =>
                  setProductInfo({
                    ...productInfo,
                    public_price: e.target.value,
                  })
                }
                required={option === "create" || option === "update"}
                readOnly={option === "info"}
              />
            </div>

            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">
                Ganancia
              </label>
              <input
                name="gain"
                id="gain"
                type="number"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={productInfo.gain}
                readOnly
              />
            </div>

            <div className="my-4 col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <select
                name="category"
                id="category"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={productInfo.category}
                onChange={(e) =>
                  setProductInfo({ ...productInfo, category: e.target.value })
                }
                required={option === "create" || option === "update"}
                disabled={option === "info"}
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">
                Cantidad mínima
              </label>
              <input
                name="minimum_quantity"
                id="minimum_quantity"
                type="number"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={productInfo.minimum_quantity}
                onChange={(e) =>
                  setProductInfo({
                    ...productInfo,
                    minimum_quantity: e.target.value,
                  })
                }
                required={option === "create" || option === "update"}
                readOnly={option === "info"}
              />
            </div>

            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">
                Marca
              </label>
              <input
                name="brand"
                id="brand"
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={productInfo.brand}
                onChange={(e) =>
                  setProductInfo({ ...productInfo, brand: e.target.value })
                }
                required={option === "create" || option === "update"}
                readOnly={option === "info"}
              />
            </div>

            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">
                Contenido
              </label>
              <input
                name="content"
                id="content"
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={productInfo.content}
                onChange={(e) =>
                  setProductInfo({ ...productInfo, content: e.target.value })
                }
                required={option === "create" || option === "update"}
                readOnly={option === "info"}
              />
            </div>

            <div className="my-4 col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Proveedor
              </label>
              <select
                name="id_supplier"
                id="supplier"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={productInfo.id_supplier}
                onChange={(e) =>
                  setProductInfo({
                    ...productInfo,
                    id_supplier: e.target.value,
                  })
                }
                required={option === "create" || option === "update"}
                disabled={option === "info"}
              >
                <option value="">Seleccione un proveedor</option>
                {supplier.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            {option === "info" && (
              <div className="my-4 col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad
                </label>
                <input
                  name="quantity"
                  id="quantity"
                  type="number"
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  value={productInfo.quantity}
                  readOnly
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none"
              onClick={onClose}
            >
              Volver
            </button>
            {option === "info" ? null : option === "update" ? (
              <ButtonUpdate
                productUpdated={productInfo}
                productId={productId}
                onClose={onClose}
                onUpdate={onUpdate}
              />
            ) : (
              <ButtonCreate
                newProduct={newProduct}
                onClose={onClose}
                onUpdate={onUpdate}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="w-[400px] min-h-[100px] bg-white relative rounded-lg shadow-lg p-6 flex flex-col gap-4">

          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
            Detalles del producto
          </h2>
          
          <div className="flex justify-between items-center">
            <span className="font-semibold">Nombre:</span>
            <span className="text-gray-700">{productInfo.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Categoría:</span>
            <span className="text-gray-700">{productInfo.category}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Marca:</span>
            <span className="text-gray-700">{productInfo.brand}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Proveedor:</span>
            <span className="text-gray-700">
              {supplier.find((sup) => sup.id === productInfo.id_supplier)
                ?.name || "Proveedor no encontrado"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Cantidad:</span>
            <span className="text-gray-700">{productInfo.quantity}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Cantidad mínima:</span>
            <span className="text-gray-700">
              {productInfo.minimum_quantity}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Contenido:</span>
            <span className="text-gray-700">{productInfo.content}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Precio costo:</span>
            <span className="text-gray-700">{productInfo.cost_price} $</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Precio público:</span>
            <span className="text-gray-700">{productInfo.public_price} $</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Ganancia:</span>
            <span className="text-gray-700">{productInfo.gain} $</span>
          </div>

          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none"
              onClick={onClose}
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
