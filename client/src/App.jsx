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

  return <>
    <ConfirmationProvider>
      {userRole ? <Home /> : <Login />}
    </ConfirmationProvider>
 </>;
}
