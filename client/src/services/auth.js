import supabaseAdmin from "../utils/supabaseAdmin";
import supabase from "../utils/supabase";

export const signUpWihtEmail = async (data) => {
  let result;
  try {
    const result = await supabase.auth.signUp(data);
    return result;
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const insertUser = async (data) => {
  let result;
  try {
    result = await supabase.from("user").insert(data);
  } catch (error) {
    console.log("error en la función insertUser", error);
  }
  return result;
};

// servicio para actualizar el usuario en la tabla User de Auth

export const updateUserAuth = async (userId, email, password) => {

    try {
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { email, password } // Pasa el email y/o password como propiedades
        );

        if (error) {
            console.error("Error al actualizar el usuario en la tabla Auth:", error);
            console.log("Detalles del intento:", { userId, email, password });
            return {
                success: false,
                message: "Error al actualizar el usuario",
                error: error.message, // Devuelve el mensaje del error para el manejo en otros lugares
            };
        }

        return {
            success: true,
            message: "Usuario actualizado correctamente",
            data, // Retorna la información del usuario actualizado
        };
    } catch (err) {
        console.error("Error inesperado:", err);
        return {
            success: false,
            message: "Error inesperado al actualizar el usuario",
            error: err.message, // Detalles del error inesperado
        };
    }
};
