// proposito: Nos permite mostrar una ventana modal que se puede utilizar para crear, actualizar o
// ver la información de una bodega.
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
    percentage_used: 0,
    cant_actual: 0,
    responsible: "",
    phone_number: "",
  });
  const [users, setUsers] = useState([]);

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

  // Modificar la función para obtener solo usuarios activos
  const handleGetUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("state", true); 

      if (error) {
        console.error("Error al obtener usuarios: ", error);
        return;
      }
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios: ", error);
    }
  };

  useEffect(() => {
    if (warehouseId) {
      handleGetWarehouseInfo();
    }
    handleGetUsers(); // Esto ahora obtiene solo usuarios activos
  }, [warehouseId]);

  const newWarehouse = {
    name: warehouseInfo.name,
    address: warehouseInfo.address,
    percentage_used: warehouseInfo.percentage_used,
    cant_actual: warehouseInfo.cant_actual,
    responsible: warehouseInfo.responsible,
    phone_number: warehouseInfo.phone_number,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-8 shadow-lg overflow-auto">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>

        <div className="grid grid-cols-2 gap-6">
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
            <label htmlFor="address" className="text-sm font-medium text-gray-700">
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
            <label htmlFor="responsible" className="text-sm font-medium text-gray-700">
              Responsable de la Bodega
            </label>
            <select
              name="responsible"
              id="responsible"
              className="mt-1 p-2 border rounded-md"
              value={warehouseInfo.responsible}
              onChange={(e) =>
                setWarehouseInfo({
                  ...warehouseInfo,
                  responsible: e.target.value,
                })
              }
              required={option === "create" || option === "update"}
              disabled={option === "info"}
            >
              <option value="">Seleccione un responsable</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
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
          {(option === "info" || option === "update") && (
            <div className="flex flex-col">
              <label htmlFor="percentage_used" className="text-sm font-medium text-gray-700">
                Porcentaje de uso
              </label>
              <input
                name="percentage_used"
                id="percentage_used"
                type="number"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={warehouseInfo.percentage_used}
                onChange={(e) =>
                  setWarehouseInfo({
                    ...warehouseInfo,
                    percentage_used: parseInt(e.target.value) || 0,
                  })
                }
                required={option === "create" || option === "update"}
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
