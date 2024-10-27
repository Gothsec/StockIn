import { useEffect, useState } from "react";
import ButtonCreate from "./ButtonCreateWarehouse";
import ButtonUpdate from "./ButtonUpdateWarehouse";
import supabase from "../../utils/supabase";

export function ModalWarehouse({
  title,
  option,
  onClose,
  warehouseId,
  onUpdate,
}) {
  const [warehouseInfo, setWarehouseInfo] = useState({
    name: "",
    address: "",
    cant_max_product: "",
    cant_actual: "",
    responsible: "",
    email: "", // Agregado para el email
    phone_number: "", // Agregado para el teléfono
  });

  const handleGetWarehouseInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("warehouse")
        .select("*")
        .eq("id", warehouseId)
        .single();

      if (error) {
        console.error("Error al obtener información de la bodega: ", error);
        return;
      } else {
        setWarehouseInfo(data);
      }
    } catch (error) {
      console.error("Error al obtener información de la bodega: ", error);
    }
  };

  useEffect(() => {
    if (warehouseId) {
      handleGetWarehouseInfo();
    }
  }, [warehouseId]);

  const newWarehouse = {
    name: warehouseInfo.name,
    address: warehouseInfo.address,
    cant_max_product: warehouseInfo.cant_max_product,
    cant_actual: warehouseInfo.cant_actual,
    responsible: warehouseInfo.responsible,
    email: warehouseInfo.email,
    phone_number: warehouseInfo.phone_number,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-8 shadow-lg overflow-auto">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>

        <div className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre de la Bodega
            </label>
            <input
              name="name"
              id="name"
              type="text"
              className="mt-1 p-2 border rounded-md"
              readOnly={option === "info"}
              value={warehouseInfo.name}
              onChange={(e) =>
                setWarehouseInfo({ ...warehouseInfo, name: e.target.value })
              }
              required={option === "create" || option === "update"}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Dirección
            </label>
            <input
              name="address"
              id="address"
              type="text"
              className="mt-1 p-2 border rounded-md"
              readOnly={option === "info"}
              value={warehouseInfo.address}
              onChange={(e) =>
                setWarehouseInfo({ ...warehouseInfo, address: e.target.value })
              }
              required={option === "create" || option === "update"}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="responsible"
              className="text-sm font-medium text-gray-700"
            >
              Responsable de la Bodega
            </label>
            <input
              name="responsible"
              id="responsible"
              type="text"
              className="mt-1 p-2 border rounded-md"
              readOnly={option === "info"}
              value={warehouseInfo.responsible}
              onChange={(e) =>
                setWarehouseInfo({
                  ...warehouseInfo,
                  responsible: e.target.value,
                })
              }
              required={option === "create" || option === "update"}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              name="email"
              id="email"
              type="email"
              className="mt-1 p-2 border rounded-md"
              readOnly={option === "info"}
              value={warehouseInfo.email}
              onChange={(e) =>
                setWarehouseInfo({ ...warehouseInfo, email: e.target.value })
              }
              required={option === "create" || option === "update"}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="phone_number"
              className="text-sm font-medium text-gray-700"
            >
              Teléfono
            </label>
            <input
              name="phone_number"
              id="phone_number"
              type="tel"
              className="mt-1 p-2 border rounded-md"
              readOnly={option === "info"}
              value={warehouseInfo.phone_number}
              onChange={(e) =>
                setWarehouseInfo({
                  ...warehouseInfo,
                  phone_number: e.target.value,
                })
              }
              required={option === "create" || option === "update"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="cant_max_product"
                className="text-sm font-medium text-gray-700"
              >
                Cantidad Máxima de Productos
              </label>
              <input
                name="cant_max_product"
                id="cant_max_product"
                type="number"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={warehouseInfo.cant_max_product}
                onChange={(e) =>
                  setWarehouseInfo({
                    ...warehouseInfo,
                    cant_max_product: e.target.value,
                  })
                }
                required={option === "create" || option === "update"}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="cant_actual"
                className="text-sm font-medium text-gray-700"
              >
                Cantidad Actual de Productos
              </label>
              <input
                name="cant_actual"
                id="cant_actual"
                type="number"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={warehouseInfo.cant_actual}
                onChange={(e) =>
                  setWarehouseInfo({
                    ...warehouseInfo,
                    cant_actual: e.target.value,
                  })
                }
                required={option === "create" || option === "update"}
              />
            </div>
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
              warehouseUpdated={warehouseInfo}
              warehouseId={warehouseId}
              onClose={onClose}
              onUpdate={onUpdate}
            />
          ) : (
            <ButtonCreate
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
