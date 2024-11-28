import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import { signUpWihtEmail, updateUser } from "../../services/auth";

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

    let email = 'empleado2@gmail.com';
    let password = 'empleado2';
    const result = await signUpWihtEmail({email, password})
    console.log(result)
    if  (result){
      const { data: { user } } = await supabase.auth.getUser()
      const name = newEmployee.name;
      const phone_number = newEmployee.phone_number;
      const user_type = 'employee';
      const state = true;
      const data = {
        id: user.id,
        name: name,
        phone_number: phone_number,
        email: email,
        password: password,
        user_type: user_type,
        state: state,
        user_id: user.id
      };
      await updateUser(data);
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




