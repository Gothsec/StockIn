import { useEffect, useState } from "react";
import ButtonCreate from "./ButtonCreateEmployee";
import ButtonUpdate from "./ButtonUpdateEmployee";
import supabase from "../../utils/supabase";
import { capitalizeFirstLetter } from "../../utils/textUtils";
import EyeVisable from "../../assets/EyeVisable";
import EyeUnvisable from "../../assets/EyeUnvisable";

export function ModalEmployee({
  title,
  option,
  onClose,
  employeeId,
  onUpdate,
}) {
  const [employeeInfo, setEmployeeInfo] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    user_type: "employee",
    state: true,
    user_id: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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
        phone_number: "",
        email: "",
        password: "",
        user_type: "employee",
        state: true,
        user_id: "",
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
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="p-2 pr-10 border rounded-md w-full"
                  value={employeeInfo.password}
                  onChange={(e) =>
                    setEmployeeInfo({
                      ...employeeInfo,
                      password: e.target.value,
                    })
                  }
                />
                <div
                  className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeUnvisable /> : <EyeVisable />}
                </div>
              </div>
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
        <div className="w-[400px] min-h-[100px] bg-white relative rounded-lg shadow-lg p-6 flex flex-col gap-4">

          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
            Detalles del Empleado
          </h2>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Nombre:</span>
            <span className="text-gray-700">{employeeInfo.name}</span>
          </div>    

          <div className="flex justify-between items-center">
            <span className="font-semibold">Teléfono:</span>
            <span className="text-gray-700"> {employeeInfo.phone_number}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Correo Electrónico:</span>
            <span className="text-gray-700"> {employeeInfo.email}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Contraseña:</span>
            <span className="text-gray-700"> {employeeInfo.password}</span>
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
