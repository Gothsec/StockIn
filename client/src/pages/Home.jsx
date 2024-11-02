import Nav from "../components/Nav";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "../pages/Products";
import SuppliersPage from "../pages/Supplier";
import Dashboard from "../pages/Dashboard";
import WarehousesPage from "../pages/Warehouse";
import MovesPage from "../pages/Moves";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/movimientos" element={<MovesPage />} />
          <Route path="/proveedores" element={<SuppliersPage />} />
          <Route path="/bodegas" element={<WarehousesPage />} />
        </Routes>
      </div>
    </div>
  );
}
