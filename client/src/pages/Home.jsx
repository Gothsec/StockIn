import Nav from "../components/Nav";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProductsPage from "../pages/Products";
import SuppliersPage from "../pages/Supplier";
import Dashboard from "../pages/Dashboard";
import WarehousesPage from "../pages/Warehouse";
import MovesPage from "../pages/Moves";
import NotFound from "../pages/NotFound";
import EmployeesPage from "../pages/Employees";
import Reports from "../pages/Reports";

export default function Home() {
  const location = useLocation();

  const role = localStorage.getItem("role");
  const validPaths = ["/dashboard", "/productos", "/movimientos", "/proveedores", "/bodegas", "/empleados", "/reportes"];
  const showNav = validPaths.includes(location.pathname);

  return (
    <div className="flex h-screen">
      {showNav && <Nav />}
      <div className={`flex-grow ${!showNav ? "w-full" : ""}`}>
        <Routes>
          <Route
            path="/"
            element={
              role === "employee" ? (
                <Navigate to="/productos" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              role === "admin" ? <Dashboard /> : <Navigate to="/productos" replace />
            }
          />

          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/movimientos" element={<MovesPage />} />
          <Route path="/proveedores" element={<SuppliersPage />} />
          <Route path="/bodegas" element={<WarehousesPage />} />
          <Route path="/empleados" element={<EmployeesPage />} />
          <Route path="/reportes" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
