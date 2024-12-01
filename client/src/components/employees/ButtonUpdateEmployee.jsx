// Propósito: Nos permite actualizar un empleado existente
import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import {updateUserAuth} from "../../services/auth";

export default function ButtonUpdate({
  userUpdated,
  userId,
  onClose,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const validateUserUpdate = async () => {
    // Verificar si los campos necesarios están llenos
    if (
      !userUpdated.name ||
      !userUpdated.email ||
      !userUpdated.phone_number ||
      !userUpdated.user_type
    ) {
      showNotification("Todos los campos son requeridos.", "error");
      return false;
    }

    // Validar que el número de teléfono sea un valor válido
    if (!/^\d{10}$/.test(userUpdated.phone_number)) {
      showNotification("El número de teléfono debe tener 10 dígitos.", "error");
      return false;
    }

    // Verificar si ya existe otro usuario con el mismo correo (ignorando mayúsculas/minúsculas)
    const { data: existingUsers, error } = await supabase
      .from("user")
      .select("email")
      .neq("id", userId) // Asegurarse de que no se compare con el usuario que se está actualizando
      .eq("state", true);

    if (error) {
      console.error("Error al verificar correos de usuarios: ", error);
      return false;
    }

    const lowerCaseEmail = userUpdated.email.toLowerCase();
    const isEmailTaken = existingUsers.some(
      (user) => user.email.toLowerCase() === lowerCaseEmail
    );

    if (isEmailTaken) {
      showNotification("El correo electrónico ya está registrado.", "error");
      return false;
    }

    return true;
  };

  // Función de actualización de usuario
  const handleUpdateUser = async () => {
    if (!(await validateUserUpdate())) return;

    let email = userUpdated.email;
    let password = userUpdated.password;
    const result = await updateUserAuth( userId, email, password)
    console.log(result)
    if (result) {
      const userUp = {
        name: userUpdated.name,
        phone_number: userUpdated.phone_number,
        email: email,
        password: password,
        user_type: 'employee',
        state: true,
      }
      try {
        const { error } = await supabase
          .from("user")
          .update(userUp)
          .eq("id", userId);
  
        if (error) {
          console.error("Error: ", error);
          showNotification("Error al actualizar el usuario", "error");
          return;
        }
  
        showNotification("Usuario actualizado correctamente", "success");
        onClose(); // Cerrar el modal
        onUpdate(); // Actualizar la lista de usuarios
      } catch (error) {
        console.error("Error: ", error);
        showNotification("Hubo un error al actualizar el usuario", "error");
      }
    }
  };

  return (
    <button
      className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none"
      onClick={handleUpdateUser}
    >
      Modificar
    </button>
  );
}
