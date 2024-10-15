import { useEffect, useState } from "react";
import ButtonCreate from "./ButtonCreateSupplier";
import ButtonUpdate from "./ButtonUpdateSupplier";
import supabase from "../../utils/supabase";

export function ModalSupplier({ title, option, onClose, supplierId }) {
  const [supplierInfo, setSupplierInfo] = useState({
    name: "",
    phone_number: "",
    email: "",
    address: "",
    city: "",
    state: true,
  });

  const handleGetSupplierInfo = async () => {
    if (!supplierId) {
      console.error("No se proporcionó un ID de proveedor válido.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("supplier")
        .select("*")
        .eq("id", supplierId)
        .single();

      if (error) {
        console.error("Error al obtener información del proveedor: ", error);
        return;
      } else {
        setSupplierInfo(data);
      }
    } catch (error) {
      console.error("Error al obtener información del proveedor: ", error);
    }
  };

  useEffect(() => {
    if (supplierId) handleGetSupplierInfo();
  }, [supplierId]);

  const newSupplier = {
    name: supplierInfo.name,
    phone_number: supplierInfo.phone_number,
    email: supplierInfo.email,
    address: supplierInfo.address,
    city: supplierInfo.city,
    state: supplierInfo.state,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-8 shadow-lg overflow-auto">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>

        <div className="space-y-6">
          {/* Campos del proveedor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                name="name"
                id="name"
                type="text"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={supplierInfo.name}
                onChange={(e) =>
                  setSupplierInfo({ ...supplierInfo, name: e.target.value })
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
                type="text"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={supplierInfo.phone_number}
                onChange={(e) =>
                  setSupplierInfo({
                    ...supplierInfo,
                    phone_number: e.target.value,
                  })
                }
                required={option === "create" || option === "update"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Correo Electrónico
              </label>
              <input
                name="email"
                id="email"
                type="email"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={supplierInfo.email}
                onChange={(e) =>
                  setSupplierInfo({ ...supplierInfo, email: e.target.value })
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
                value={supplierInfo.address}
                onChange={(e) =>
                  setSupplierInfo({ ...supplierInfo, address: e.target.value })
                }
                required={option === "create" || option === "update"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="city"
                className="text-sm font-medium text-gray-700"
              >
                Ciudad
              </label>
              <input
                name="city"
                id="city"
                type="text"
                className="mt-1 p-2 border rounded-md"
                readOnly={option === "info"}
                value={supplierInfo.city}
                onChange={(e) =>
                  setSupplierInfo({ ...supplierInfo, city: e.target.value })
                }
                required={option === "create" || option === "update"}
              />
            </div>

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="state"
                className="mr-2"
                checked={supplierInfo.state}
                onChange={(e) =>
                  setSupplierInfo({ ...supplierInfo, state: e.target.checked })
                }
                disabled={option === "info"}
              />
              <label
                htmlFor="state"
                className="text-sm font-medium text-gray-700"
              >
                Activo
              </label>
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
              supplierUpdated={supplierInfo}
              supplierId={supplierId}
              onClose={onClose}
            />
          ) : (
            <ButtonCreate newSupplier={newSupplier} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}
