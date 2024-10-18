// proposito: Nos permite mostrar una ventana modal que se puede utilizar para crear, actualizar o
// ver la información de un producto	

import { useEffect, useState } from "react";
import ButtonCreate from "./ButtonCreate";
import ButtonUpdate from "./ButtonUpdate";
import supabase from "../../utils/supabase";

export function ModalProduct({ title, option, onClose, productId, onUpdate }) {
  const [productInfo, setProductInfo] = useState({
    name: "",
    quantity: "",
    cost_price: "",
    public_price: "",
    gain: "",
    category: "",
    minimum_quantity: "",
    brand: "",
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
    handleGetProductInfo();
  }, [productId]);

  useEffect(() => {
    const gain =
      parseFloat(productInfo.public_price) - parseFloat(productInfo.cost_price);
    if (!isNaN(gain)) {
      setProductInfo({ ...productInfo, gain: gain.toFixed(2) });
    }
  }, [productInfo.cost_price, productInfo.public_price]);

  const newProduct = {
    name: productInfo.name,
    quantity: productInfo.quantity,
    cost_price: productInfo.cost_price,
    public_price: productInfo.public_price,
    gain: productInfo.gain,
    category: productInfo.category,
    minimum_quantity: productInfo.minimum_quantity,
    brand: productInfo.brand,
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 p-10 flex items-center justify-center">
      <div className="w-[800px] min-h-[100px] bg-white relative rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-bold mb-4">{title}</h1>

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

          <div className="my-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Cantidad inicial
            </label>
            <input
              name="quantity"
              id="quantity"
              type="number"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={productInfo.quantity}
              onChange={(e) =>
                setProductInfo({ ...productInfo, quantity: e.target.value })
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
                setProductInfo({ ...productInfo, public_price: e.target.value })
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
    </div>
  );
}
