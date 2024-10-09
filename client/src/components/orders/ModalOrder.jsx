import { useEffect, useState } from "react";
import ButtonCreate from "./ButtonCreate";
import ButtonUpdate from "./ButtonUpdate";
import supabase from "../../utils/supabase";

export function ModalOrder({ title, option, onClose, orderId }) {
  const [productsList, setProductsList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [orderInfo, setOrderInfo] = useState({
    name: "",
    quantity: "",
    content: "",
    supplier: "",
    date: "",
    description: "",
  });

  const handleGetProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("product")
        .select("*")
        .eq("state", true)

      if (error) {
        console.error("Error: ", error);
      } else {
        if (data) {
          setProductsList(data);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    handleGetProducts();
  }, []);

  const handleGetSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from("supplier")
        .select("*")
        .eq("state", true)

      if (error) {
        console.error("Error: ", error);
      } else {
        if (data) {
          setSuppliersList(data);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    handleGetSuppliers();
  }, []);

  const handleGetOrderInfo = async () => {
    if (!orderId) {
      console.error("No se proporcionó un ID de producto válido.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("order")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) {
        console.error("Error al obtener información del producto: ", error);
        return;
      } else {
        setOrderInfo(data);
      }
    } catch (error) {
      console.error("Error al obtener información del producto: ", error);
    }
  };

  useEffect(() => {
    handleGetOrderInfo();
  }, [orderId]);

  const newOrder = {
    name: orderInfo.name,
    quantity: orderInfo.quantity,
    content: orderInfo.content,
    supplier: orderInfo.supplier,
    date: orderInfo.date,
    description: orderInfo.description,
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-8 shadow-lg overflow-auto">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>

        <div className="space-y-6">
          {/* Product, Quantity, and Content in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="product" className="text-sm font-medium text-gray-700">Producto</label>
              <select
                name="productName"
                id="product"
                className="mt-1 p-2 border rounded-md"
                disabled={option === "info"}
                onChange={(e) => setOrderInfo({ ...orderInfo, name: e.target.value })}
                required={option === "create" || option === "update"}
              >
                {productsList.map((product) => (
                  <option defaultValue={orderInfo.product_id === product.id} key={product.name} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</label>
              <input
                name="quantity"
                id="quantity"
                type="number"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={option === "create" ? "" : orderInfo.quantity}
                onChange={(e) => setOrderInfo({ ...orderInfo, quantity: e.target.value })}
                required={option === "create" || option === "update"}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="content" className="text-sm font-medium text-gray-700">Content</label>
              <input
                name="content"
                id="content"
                type="text"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={option === "create" ? "" : orderInfo.content}
                onChange={(e) => setOrderInfo({ ...orderInfo, content: e.target.value })}
                required={option === "create" || option === "update"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="supplier" className="text-sm font-medium text-gray-700">Supplier</label>
              <select
                name="supplier"
                id="supplier"
                className="mt-1 p-2 border rounded-md"
                disabled={option === "info"}
                value={option === "create" ? "" : orderInfo.supplier}
                onChange={(e) => setOrderInfo({ ...orderInfo, supplier: e.target.value })}
                required={option === "create"}
              >
                {suppliersList.map((supplier) => (
                  <option defaultValue={orderInfo.supplier_id === supplier.id} key={supplier.name} value={supplier.name}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
              <input
                name="date"
                id="date"
                type="date"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={option === "create" ? "" : orderInfo.date}
                onChange={(e) => setOrderInfo({ ...orderInfo, date: e.target.value })}
                required={option === "create" || option === "update"}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              id="description"
              className="mt-1 p-2 border rounded-md"
              readOnly={option === "info"}
              value={option === "create" ? "" : orderInfo.description}
              onChange={(e) => setOrderInfo({ ...orderInfo, description: e.target.value })}
              required={option === "create" || option === "update"}
            ></textarea>
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
            <ButtonUpdate orderUpdated={orderInfo} orderId={orderId} onClose={onClose} />
          ) : (
            <ButtonCreate newOrder={newOrder} />
          )}
        </div>
      </div>
    </div>
  );
}
