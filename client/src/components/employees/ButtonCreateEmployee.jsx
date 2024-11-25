import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonCreateEmployee({
  newEmployee,
  onClose,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  // Función para validar los datos del empleado
  const validateEmployee = async () => {
    // Verificar si los campos necesarios están llenos
    if (
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.phone_number ||
      !newEmployee.user_type
    ) {
      showNotification("Todos los campos son requeridos.", "error");
      return false;
    }

    // Validar que el número de teléfono sea un valor válido
    if (!/^\d{10}$/.test(newEmployee.phone_number)) {
      showNotification("El número de teléfono debe tener 10 dígitos.", "error");
      return false;
    }

    // Validar que el correo electrónico no esté registrado ya
    const { data: existingUsers, error } = await supabase
      .from("user")
      .select("email")
      .eq("state", true); // Filtrar solo usuarios activos

    if (error) {
      console.error("Error al verificar correos de usuarios: ", error);
      return false;
    }

    const lowerCaseEmail = newEmployee.email.toLowerCase();
    const isEmailTaken = existingUsers.some(
      (user) => user.email.toLowerCase() === lowerCaseEmail
    );

    if (isEmailTaken) {
      showNotification("El correo electrónico ya está registrado.", "error");
      return false;
    }

    return true;
  };

  // Función para crear el empleado
  const handleCreateEmployee = async () => {
    // Validamos los datos antes de enviarlos a la base de datos
    if (!(await validateEmployee())) return;

    // Preparamos los datos para la inserción sin incluir el campo "id"
    const { name, email, phone_number, user_type, state } = newEmployee;
    
    const newEmployeeData = {
      name,
      email,
      phone_number,
      user_type,
      state,
    };

    try {
      // Insertamos el nuevo empleado, sin enviar el campo "id" ya que es auto-generado
      const { error } = await supabase
        .from("user")
        .insert([newEmployeeData])
        .single();

      if (error) {
        console.error("Error al crear el usuario:", error.message);
        showNotification(`Error al crear el usuario: ${error.message}`, "error");
      } else {
        showNotification("El usuario fue creado correctamente", "success");
        onClose(); // Cerramos el modal
        onUpdate(); // Actualizamos el listado o la vista donde se necesita
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      showNotification("Hubo un error al crear el usuario", "error");
    }
  };

  return (
    <button
      className="bg-blue-500 text-white py-1 px-3 rounded-md"
      onClick={handleCreateEmployee}
    >
      Crear
    </button>
  );
}




