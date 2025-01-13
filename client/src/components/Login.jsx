import { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import Home from "../pages/Home";
import PasswordRecoveryDialog from "../components/ForgotPassword";
import Banner from "../../public/login-banner.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage("Email o contraseña incorrectos.");
      setLoginSuccessful(false);
    } else {
      const userId = data.user.id;

      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("id, name, user_type, state")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("Error obteniendo información del usuario:", userError);
      } else if (!userData.state) {
        setErrorMessage("El usuario no existe o no tiene permiso para ingresar.");
        setLoginSuccessful(false);
      } else {
        const userRole = userData.user_type;
        const userName = userData.name;
        const id_user = userData.id;

        if (rememberMe) {
          localStorage.setItem("role", userRole);
          localStorage.setItem("name", userName);
          localStorage.setItem("email", email);
          localStorage.setItem("id_user", id_user);
        } else {
          localStorage.setItem("role", userRole);
          localStorage.setItem("name", userName);
          sessionStorage.setItem("email", email);
          localStorage.setItem("id_user", id_user);
        }

        setLoginSuccessful(true);
        setErrorMessage("");
        window.location.reload();
      }
    }
  };

  return (
    <>
      {loginSuccessful ? (
        <Home />
      ) : (
        <div className="flex px-4 items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="hidden md:block">
                <img
                  src={Banner}
                  alt="Login illustration"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-11 flex flex-col justify-center">
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-gray-800">
                    Bienvenido a StockIn
                  </h1>
                  <p className="text-gray-600">Ingresa con tu cuenta</p>
                </div>
                <form method="post" className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Correo
                    </label>
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                        <path d="M3 7l9 6l9 -6" />
                      </svg>
                      <input
                        id="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-1 block w-full px-4 pl-10 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-700 focus:border-blue-700 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                        <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                      </svg>
                      <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        onChange={(event) => setPassword(event.target.value)}
                        className="mt-1 block w-full px-4 pl-10 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex justify-between items-center mt-5">
                      <div className="flex items-center ml-3">
                        <input
                          id="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-gray-900 cursor-pointer"
                        >
                          Recuerdame
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDialogOpen(true)}
                        className="inline-block text-sm text-blue-600 ml-2 mr-3 cursor-pointer hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  </div>
                  {errorMessage && (
                    <div className="text-red-500 ml-2 mt-3 text-sm">
                      {errorMessage}
                    </div>
                  )}
                  <button
                    onClick={handleLogin}
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ingresar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDialogOpen && (
        <PasswordRecoveryDialog onClose={() => setIsDialogOpen(false)} />
      )}
    </>
  );
}
