// Propósito: Nos permite mostrar una ventana modal para crear, actualizar o ver la información de una bodega

import { useEffect, useState } from "react";
import ButtonCreateWarehouse from "./ButtonCreateWarehouse";
import ButtonUpdateWarehouse from "./ButtonUpdateWarehouse";
import supabase from "../../utils/supabase";

export function ModalWarehouse({ title, option, onClose, warehouseId, onUpdate }) {
  const [warehouseInfo, setWarehouseInfo] = useState({
    name: "",
    address: "",
    state: "",
    id_user: "",
    cant_max_product: "",
    cant_actual: "",
  });

  const handleGetWarehouseInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("warehouse")
        .select("*")
        .eq("id", warehouseId)
        .single();

      if (error) {
        console.error("Error al obtener la información de la bodega: ", error);
        return;
      } else {
        setWarehouseInfo(data);
      }
    } catch (error) {
      console.error("Error al obtener la información de la bodega: ", error);
    }
  };

  useEffect(() => {
    if (warehouseId) handleGetWarehouseInfo();
  }, [warehouseId]);

  const newWarehouse = {
    name: warehouseInfo.name,
    address: warehouseInfo.address,
    state: warehouseInfo.state,
    id_user: warehouseInfo.id_user,
    cant_max_product: warehouseInfo.cant_max_product,
    cant_actual: warehouseInfo.cant_actual,
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 p-10 flex items-center justify-center">
      <div className="w-[800px] min-h-[100px] bg-white relative rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-bold mb-4">{title}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={warehouseInfo.name}
              onChange={(e) =>
                setWarehouseInfo({ ...warehouseInfo, name: e.target.value })
              }
              readOnly={option === "info"}
              required={option !== "info"}
            />
          </div>

          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={warehouseInfo.address}
              onChange={(e) =>
                setWarehouseInfo({ ...warehouseInfo, address: e.target.value })
              }
              readOnly={option === "info"}
              required={option !== "info"}
            />
          </div>

          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={warehouseInfo.state}
              onChange={(e) =>
                setWarehouseInfo({ ...warehouseInfo, state: e.target.value })
              }
              readOnly={option === "info"}
              required={option !== "info"}
            />
          </div>

          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">
              Usuario Responsable (ID)
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={warehouseInfo.id_user}
              onChange={(e) =>
                setWarehouseInfo({ ...warehouseInfo, id_user: e.target.value })
              }
              readOnly={option === "info"}
              required={option !== "info"}
            />
          </div>

          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">
              Capacidad Máxima
            </label>
            <input
              type="number"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={warehouseInfo.cant_max_product}
              onChange={(e) =>
                setWarehouseInfo({
                  ...warehouseInfo,
                  cant_max_product: e.target.value,
                })
              }
              readOnly={option === "info"}
              required={option !== "info"}
            />
          </div>

          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">
              Cantidad Actual
            </label>
            <input
              type="number"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={warehouseInfo.cant_actual}
              onChange={(e) =>
                setWarehouseInfo({ ...warehouseInfo, cant_actual: e.target.value })
              }
              readOnly={option === "info"}
              required={option !== "info"}
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
            <ButtonUpdateWarehouse
              warehouseUpdated={warehouseInfo}
              warehouseId={warehouseId}
              onClose={onClose}
              onUpdate={onUpdate}
            />
          ) : (
            <ButtonCreateWarehouse
              newWarehouse={newWarehouse}
              onClose={onClose}
              onUpdate={onUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
