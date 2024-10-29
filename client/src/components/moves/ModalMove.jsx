// proposito: Nos permite mostrar una ventana modal que se puede utilizar para crear, actualizar o
// ver la información de un pedido

import { useEffect, useState } from "react";
import ButtonCreate from "./ButtonCreate";
import ButtonUpdate from "./ButtonUpdate";
import supabase from "../../utils/supabase";

export function ModalMove({ title, option, onClose, orderId, onUpdate }) {
  const [productsList, setProductsList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [orderInfo, setOrderInfo] = useState({
    product_id: "",
    quantity: "",
    content: "",
    supplier_id: "",
    date: "",
    description: "",
  });

  const handleGetProducts = async () => {
    try {
      const { data, error } = await supabase.from("product").select("*");

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
        .eq("state", true);

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
    try {
      const { data, error } = await supabase
        .from("order")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) {
        console.error("Error al obtener información de la orden: ", error);
        return;
      } else {
        setOrderInfo(data);
      }
    } catch (error) {
      console.error("Error al obtener información de la orden: ", error);
    }
  };

  useEffect(() => {
    handleGetOrderInfo();
  }, [orderId]);

  const newOrder = {
    product_id: orderInfo.product_id,
    quantity: orderInfo.quantity,
    content: orderInfo.content,
    supplier_id: orderInfo.supplier_id,
    date: orderInfo.date,
    description: orderInfo.description,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-8 shadow-lg overflow-auto">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>

        <div className="space-y-6">
          {/* Product, Quantity, and Content in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="product"
                className="text-sm font-medium text-gray-700"
              >
                Producto
              </label>
              <select
                name="product_id"
                id="product"
                className="mt-1 p-2 border rounded-md"
                disabled={option === "info"}
                value={orderInfo.product_id}
                onChange={(e) =>
                  setOrderInfo({ ...orderInfo, product_id: e.target.value })
                }
                required={option === "create" || option === "update"}
              >
                <option value="">Selecciona un producto</option>
                {productsList.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="quantity"
                className="text-sm font-medium text-gray-700"
              >
                Cantidad
              </label>
              <input
                name="quantity"
                id="quantity"
                type="number"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={orderInfo.quantity}
                onChange={(e) =>
                  setOrderInfo({ ...orderInfo, quantity: e.target.value })
                }
                required={option === "create" || option === "update"}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="content"
                className="text-sm font-medium text-gray-700"
              >
                Contenido
              </label>
              <input
                name="content"
                id="content"
                type="text"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={orderInfo.content}
                onChange={(e) =>
                  setOrderInfo({ ...orderInfo, content: e.target.value })
                }
                required={option === "create" || option === "update"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="supplier"
                className="text-sm font-medium text-gray-700"
              >
                Proveedor
              </label>
              <select
                name="supplier_id"
                id="supplier"
                className="mt-1 p-2 border rounded-md"
                disabled={option === "info"}
                value={orderInfo.supplier_id}
                onChange={(e) =>
                  setOrderInfo({ ...orderInfo, supplier_id: e.target.value })
                }
                required={option === "create" || option === "update"}
              >
                <option value="">Selecciona un proveedor</option>
                {suppliersList.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="date"
                className="text-sm font-medium text-gray-700"
              >
                Fecha
              </label>
              <input
                name="date"
                id="date"
                type="date"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={orderInfo.date}
                onChange={(e) =>
                  setOrderInfo({ ...orderInfo, date: e.target.value })
                }
                required={option === "create" || option === "update"}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <textarea
              name="description"
              id="description"
              className="mt-1 p-2 border rounded-md"
              readOnly={option === "info"}
              value={orderInfo.description}
              onChange={(e) =>
                setOrderInfo({ ...orderInfo, description: e.target.value })
              }
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
            <ButtonUpdate
              orderUpdated={orderInfo}
              orderId={orderId}
              onClose={onClose}
              onUpdate={onUpdate}
            />
          ) : (
            <ButtonCreate
              newOrder={newOrder}
              onClose={onClose}
              onUpdate={onUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
