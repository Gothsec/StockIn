//Esta es la pagina empleados



import { useEffect, useState } from "react";
import EmployeeRow from "../components/employees/EmployeeRow"; // Componente para mostrar cada empleado
import { ModalEmployee } from "../components/employees/ModalEmployee"; // Modal para crear/editar empleados
import supabase from "../utils/supabase";
import MessageConfirmation from "../components/MessageConfirmation";
import AddIcon from "../assets/AddIcon";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]); // Estado para los empleados
  const [searchName, setSearchName] = useState(""); // Filtro por nombre
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    userId: "",
    option: "",
  });
  const [windowsModal, setWindowsModal] = useState(false); // Controla la visibilidad del modal
  const [error, setError] = useState(null); // Estado para errores

  // Función para abrir o cerrar el modal
  const toggleModal = (titleModal, userId = "", option = "") => {
    setModalProps({ titleModal, userId, option });
    setWindowsModal((prev) => !prev);
  };

  // Función para traer los empleados desde la tabla "user"
  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("user") // Asegúrate de que este sea el nombre correcto de la tabla
        .select("id, name, email, phone_number, user_type, state")
        .eq("user_type", "employee") // Filtrar solo usuarios de tipo empleado
        .eq("state", true); // Filtrar solo empleados activos

      if (error) {
        throw error;
      }

      setEmployees(data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching employees: ", error.message);
      setError("Error al cargar los empleados.");
      setEmployees([]);
    }
  };

  // Ejecuta fetchEmployees al montar el componente
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filtrar empleados por nombre
  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((employee) =>
        searchName === ""
          ? true
          : employee.name?.toLowerCase().includes(searchName.toLowerCase())
      )
    : [];

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <h1 className="font-bold text-4xl mb-4">Empleados</h1>

        <header className="flex justify-between items-center pb-4">
          {/* Campo de búsqueda */}
          <input
            className="flex-auto border border-gray-400 h-9 rounded-lg pl-3"
            type="search"
            placeholder="Buscar por empleado"
            aria-label="Buscar por empleado"
            onChange={(e) => setSearchName(e.target.value)}
          />

          {/* Botón para añadir empleado */}
          <button
            className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg w-48 h-9 ml-4 hover:bg-blue-700 transition-all duration-300 ease"
            onClick={() => toggleModal("Nuevo empleado", "", "create")}
          >
            <AddIcon />
            <span className="ml-2">Añadir</span>
          </button>
        </header>

        {/* Mensaje de confirmación */}
        <MessageConfirmation />

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Tabla de empleados */}
        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-slate-200 sticky top-0 left-0">
                <th className="py-2 text-left px-2">Nombre</th>
                <th className="py-2 text-left px-2">Email</th>
                <th className="py-2 text-left px-2">Teléfono</th>
                <th className="py-2 text-left px-2">Tipo de usuario</th>
                <th className="py-2 text-left px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <EmployeeRow
                  key={employee.id}
                  id={employee.id}
                  name={employee.name}
                  email={employee.email}
                  phone_number={employee.phone_number}
                  user_type={employee.user_type}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  onUpdate={fetchEmployees} // Refrescar lista tras actualizar
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {windowsModal && (
        <ModalEmployee
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          userId={modalProps.userId}
          option={modalProps.option}
          onUpdate={fetchEmployees}
        />
      )}
    </div>
  );
}
