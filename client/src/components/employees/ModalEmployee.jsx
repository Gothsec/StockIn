import { useEffect, useState } from "react";
import ButtonCreate from "./ButtonCreateEmployee";
import ButtonUpdate from "./ButtonUpdateEmployee";
import supabase from "../../utils/supabase";
import { capitalizeFirstLetter } from "../../utils/textUtils";

export function ModalEmployee({
  title,
  option,
  onClose,
  employeeId,
  onUpdate,
}) {
  const [employeeInfo, setEmployeeInfo] = useState({
    name: "",
    email: "",
    phone_number: "",
    user_type: "",
    state: true,
  });

  // Obtener la información del empleado si el ID está definido (para actualizar)
  const handleGetEmployeeInfo = async () => {
    if (!employeeId) return;

    try {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", employeeId)
        .single();

      if (error) {
        console.error("Error al obtener la información del empleado:", error);
      } else {
        setEmployeeInfo(data);
      }
    } catch (error) {
      console.error("Error al obtener la información del empleado:", error);
    }
  };

  // Ejecutar la función para obtener la información del empleado al cargar el modal
  useEffect(() => {
    if (employeeId && (option === "info" || option === "update")) {
      handleGetEmployeeInfo();
    } else if (option === "create") {
      // Resetear employeeInfo para crear un nuevo empleado
      setEmployeeInfo({
        name: "",
        email: "",
        phone_number: "",
        user_type: "",
        state: true,
      });
    }
  }, [employeeId, option]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal para crear o actualizar */}
      {option !== "info" ? (
        <div className="bg-white rounded-lg w-full max-w-4xl p-8 shadow-lg overflow-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                id="name"
                type="text"
                className="mt-1 p-2 border rounded-md"
                value={employeeInfo.name}
                onChange={(e) =>
                  setEmployeeInfo({
                    ...employeeInfo,
                    name: capitalizeFirstLetter(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                className="mt-1 p-2 border rounded-md"
                value={employeeInfo.email}
                onChange={(e) =>
                  setEmployeeInfo({ ...employeeInfo, email: e.target.value })
                }
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
                id="phone_number"
                type="tel"
                className="mt-1 p-2 border rounded-md"
                maxLength={10}
                value={employeeInfo.phone_number}
                onChange={(e) =>
                  setEmployeeInfo({
                    ...employeeInfo,
                    phone_number: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="user_type"
                className="text-sm font-medium text-gray-700"
              >
                Tipo de usuario
              </label>
              <select
                id="user_type"
                className="mt-1 p-2 border rounded-md"
                value={employeeInfo.user_type}
                onChange={(e) =>
                  setEmployeeInfo({
                    ...employeeInfo,
                    user_type: e.target.value,
                  })
                }
              >
                <option value="">Selecciona un tipo de usuario</option>
                <option value="Administrador">Administrador</option>
                <option value="Empleado">Empleado</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="state"
                className="text-sm font-medium text-gray-700"
              >
                Estado
              </label>
              <select
                id="state"
                className="mt-1 p-2 border rounded-md"
                value={employeeInfo.state}
                onChange={(e) =>
                  setEmployeeInfo({
                    ...employeeInfo,
                    state: e.target.value === "true",
                  })
                }
              >
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Volver
            </button>
            {option === "create" && (
              <ButtonCreate
                newEmployee={employeeInfo}
                onClose={onClose}
                onUpdate={onUpdate}
              />
            )}
            {option === "update" && (
              <ButtonUpdate
                userUpdated={employeeInfo}
                userId={employeeId}
                onClose={onClose}
                onUpdate={onUpdate}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Detalles del Empleado
          </h2>
          <div className="mb-2">
            <strong>Nombre:</strong> {employeeInfo.name}
          </div>
          <div className="mb-2">
            <strong>Correo Electrónico:</strong> {employeeInfo.email}
          </div>
          <div className="mb-2">
            <strong>Teléfono:</strong> {employeeInfo.phone_number}
          </div>
          <div className="mb-2">
            <strong>Estado:</strong>{" "}
            {employeeInfo.state ? "Activo" : "Inactivo"}
          </div>
          <button
            className="mt-4 px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
