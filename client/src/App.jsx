// Proposito: Es el componente principal de la aplicación y redirije a la página de inicio o 
// la página de inicio de sesión dependiendo del rol del usuario

import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./components/Login";
import { ConfirmationProvider } from "./contexts/ConfirmationData";

export default function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  return (
    <>
      <ConfirmationProvider>
        {userRole ? <Home /> : <Login />}
      </ConfirmationProvider>
    </>
  );
}
