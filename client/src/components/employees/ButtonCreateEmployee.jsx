import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import { signUpWihtEmail, insertUser } from "../../services/auth";

export default function ButtonCreateEmployee({
  newEmployee,
  onClose,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const validateEmployee = async () => {
    if (
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.password ||
      !newEmployee.phone_number
    ) {
      showNotification("Todos los campos son requeridos.", "error");
      return false;
    }

    if (!/^\d{10}$/.test(newEmployee.phone_number)) {
      showNotification("El número de teléfono debe tener 10 dígitos.", "error");
      return false;
    }

    const { data: existingUsers, error } = await supabase
      .from("user")
      .select("email")
      .eq("state", true);

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

    if (newEmployee.password.length < 8) {
      showNotification("La contraseña debe tener al menos 8 caracteres.", "error");
      return false;
    }

    return true;
  };

  const handleCreateEmployee = async () => {
    if (!(await validateEmployee())) return;

    let email = newEmployee.email;
    let password = newEmployee.password;
    const result = await signUpWihtEmail({email, password})
    console.log("resultado de la función signUpWihtEmail", result)
    if (result){
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
      const resultInsertUser =await insertUser(data);
      if (resultInsertUser) {
        showNotification("Empleado creado correctamente.", "success");
        onUpdate();
        onClose();
      }
    } else {
      showNotification("Error al crear el empleado.", "error");
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




