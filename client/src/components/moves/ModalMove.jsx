// proposito: Nos permite mostrar una ventana modal que se puede utilizar para crear, actualizar o
// ver la información de un movimiento

import { useEffect, useState } from "react";
import ButtonCreate from "./ButtonCreate";
import ButtonUpdate from "./ButtonUpdate";
import supabase from "../../utils/supabase";

export function ModalMove({ title, option, onClose, moveId, onUpdate }) {
  const [productsList, setProductsList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const id_user = localStorage.getItem("id_user");
  const tipos = ["Entrada", "Salida"];
  const [MoveInfo, setMoveInfo] = useState({
    quantity: "",
    type: "",
    date: "",
    description: "",
    product_id: "",
    warehouse_id: "",
    user_id: id_user,
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

  const handleGetWarehouses = async () => {
    try {
      const { data, error } = await supabase
        .from("warehouse")
        .select("*")
        .eq("state", true);

      if (error) {
        console.error("Error: ", error);
      } else {
        if (data) {
          setWarehouseList(data);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    handleGetWarehouses();
  }, []);

  const handleGetMoveInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("move")
        .select("*")
        .eq("id", moveId)
        .single();

      if (error) {
        console.error("Error al obtener información del movimiento: ", error);
        return;
      } else {
        setMoveInfo(data);
      }
    } catch (error) {
      console.error("Error al obtener información del movimiento: ", error);
    }
  };

  useEffect(() => {
    handleGetMoveInfo();
  }, [moveId]);

  const newMove = {
    quantity: MoveInfo.quantity,
    type: MoveInfo.type,
    date: MoveInfo.date,
    description: MoveInfo.description,
    product_id: MoveInfo.product_id,
    warehouse_id: MoveInfo.warehouse_id,
    user_id: MoveInfo.user_id,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-8 shadow-lg overflow-auto">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>

        <div className="space-y-6">
          {/* Product, Quantity, and type in one row */}
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
                value={MoveInfo.product_id}
                onChange={(e) =>
                  setMoveInfo({ ...MoveInfo, product_id: e.target.value })
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
                value={MoveInfo.quantity}
                onChange={(e) =>
                  setMoveInfo({ ...MoveInfo, quantity: e.target.value })
                }
                required={option === "create" || option === "update"}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="content"
                className="text-sm font-medium text-gray-700"
              >
                Tipo
              </label>
              <select
                name="type"
                id="type"
                className="mt-1 p-2 border rounded-md"
                disabled={option === "info"}
                value={MoveInfo.type}
                onChange={(e) =>
                  setMoveInfo({ ...MoveInfo, type: e.target.value })
                }
                required={option === "create" || option === "update"}
              >
                <option value="">Selecciona tipo de movimiento</option>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="supplier"
                className="text-sm font-medium text-gray-700"
              >
                Bodega
              </label>
              <select
                name="bodega"
                id="bodega"
                className="mt-1 p-2 border rounded-md"
                disabled={option === "info"}
                value={MoveInfo.warehouse_id}
                onChange={(e) =>
                  setMoveInfo({ ...MoveInfo, warehouse_id: e.target.value })
                }
                required={option === "create" || option === "update"}
              >
                <option value="">Selecciona una bodega</option>
                {warehouseList.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
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
                value={MoveInfo.date}
                onChange={(e) =>
                  setMoveInfo({ ...MoveInfo, date: e.target.value })
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
              value={MoveInfo.description}
              onChange={(e) =>
                setMoveInfo({ ...MoveInfo, description: e.target.value })
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
              moveUpdated={MoveInfo}
              MoveId={moveId}
              onClose={onClose}
              onUpdate={onUpdate}
            />
          ) : (
            <ButtonCreate
              newMove={newMove}
              onClose={onClose}
              onUpdate={onUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
