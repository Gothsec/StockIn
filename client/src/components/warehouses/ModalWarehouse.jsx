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
    responsible: "", // Cambiado para almacenar el ID
    phone_number: "",
  });
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios

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

  const handleGetUsers = async () => {
    try {
      const { data, error } = await supabase.from("user").select("*"); // Obtenemos todos los usuarios

      if (error) {
        console.error("Error al obtener usuarios: ", error);
        return;
      }
      setUsers(data); // Guardamos los usuarios en el estado
    } catch (error) {
      console.error("Error al obtener usuarios: ", error);
    }
  };

  useEffect(() => {
    if (warehouseId) {
      handleGetWarehouseInfo();
    }
    handleGetUsers(); // Cargar usuarios al abrir el modal
  }, [warehouseId]);

  const newWarehouse = {
    name: warehouseInfo.name,
    address: warehouseInfo.address,
    cant_max_product: warehouseInfo.cant_max_product,
    responsible: warehouseInfo.responsible, // Ahora se espera que sea el ID del responsable
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
            <select
              name="responsible"
              id="responsible"
              className="mt-1 p-2 border rounded-md"
              value={warehouseInfo.responsible}
              onChange={(e) =>
                setWarehouseInfo({
                  ...warehouseInfo,
                  responsible: e.target.value, // Guardamos el ID seleccionado
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
                  cant_max_product: parseInt(e.target.value) || 0,
                })
              }
              required={option === "create" || option === "update"}
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
