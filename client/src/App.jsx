import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import { ConfirmationProvider } from "./contexts/ConfirmationData";
import supabase from "./utils/supabase";

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
    
      if (session) {
        const role = session.user.user_metadata.role || localStorage.getItem("role");
        setUserRole(role);
      }
      setIsSessionLoaded(true);
    };    

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const role =
            localStorage.getItem("role") || session.user.user_metadata.role;
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (!isSessionLoaded)
    return (
      <div className="flex justify-center items-center h-12">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
      </div>
    );

  return (
    <ConfirmationProvider>
      <Router>
        <Routes>
          <Route
            path="/login/*"
            element={userRole ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/*"
            element={
              userRole ? <Home role={userRole} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </ConfirmationProvider>
  );
}
