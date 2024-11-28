import supabase from "../utils/supabase";

export const signUpWihtEmail = async (data) => {
    let result;
    try {
        const result = await supabase.auth.signUp (data)
        return result
    } catch (error) {
        console.log(error)
    }
    return result
}

export const updateUser = async (data) => {
    try {
        const {error} = await supabase
            .from("user")
            .insert(data)
        if (error) {
            console.log("Error al ingresar al usuario: ", error);   
            return false;
        }
    } catch (error) {
        console.log("error en la función updateUser", error)
    }
}