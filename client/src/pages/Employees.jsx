import { useEffect, useState } from "react";
import EmployeeRow from "../components/employees/EmployeeRow";
import { ModalEmployee } from "../components/employees/ModalEmployee";
import supabase from "../utils/supabase";
import MessageConfirmation from "../components/MessageConfirmation";
import AddIcon from "../assets/AddIcon";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    userId: "",
    option: "",
  });
  const [windowsModal, setWindowsModal] = useState(false);
  const [error, setError] = useState(null);

  const toggleModal = (titleModal, userId = "", option = "") => {
    setModalProps({ titleModal, userId, option });
    setWindowsModal((prev) => !prev);
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("id, name, email, phone_number, user_type, state")
        .eq("user_type", "employee")
        .eq("state", true)
        .order("id", {ascending: false});

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

  useEffect(() => {
    fetchEmployees();
  }, []);

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
          <input
            className="flex-auto border border-gray-400 h-9 rounded-lg pl-3"
            type="search"
            placeholder="Buscar por nombre"
            aria-label="Buscar por nombre"
            onChange={(e) => setSearchName(e.target.value)}
          />

          <button
            className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg w-48 h-9 ml-4 hover:bg-blue-700 transition-all duration-300 ease"
            onClick={() => toggleModal("Nuevo empleado", "", "create")}
          >
            <AddIcon />
          </button>
        </header>

        <MessageConfirmation />

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-slate-200 sticky top-0 left-0">
                <th className="py-2 text-left px-4">Nombre</th>
                <th className="py-2 text-center px-4">Email</th>
                <th className="py-2 text-center px-4">Teléfono</th>
                <th className="py-2 text-center px-4"></th>
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
                  onUpdate={fetchEmployees}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
