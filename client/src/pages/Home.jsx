import Nav from "../components/Nav";
import { Routes, Route, useLocation } from "react-router-dom";
import ProductsPage from "../pages/Products";
import SuppliersPage from "../pages/Supplier";
import Dashboard from "../pages/Dashboard";
import WarehousesPage from "../pages/Warehouse";
import MovesPage from "../pages/Moves";
import NotFound from "../pages/NotFound";

export default function Home() {
  const location = useLocation();

  const validPaths = ["/dashboard", "/productos", "/movimientos", "/proveedores", "/bodegas"];

  const showNav = validPaths.includes(location.pathname);

  return (
    <div className="flex h-screen">
      {showNav && <Nav />}
      <div className={`flex-grow ${!showNav ? "w-full" : ""}`}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/movimientos" element={<MovesPage />} />
          <Route path="/proveedores" element={<SuppliersPage />} />
          <Route path="/bodegas" element={<WarehousesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
