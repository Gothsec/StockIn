// Proposito: Nos permite manejar la navegación entre las diferentes páginas del sitio web

import Nav from "../components/Nav";
import ProductsPage from "../pages/Products";
import SuppliersPage from "./Supplier";
import Dashboard from "./Dashboard";
import MovesPage from "./Moves";

export default function Home() {
  const currentPath = window.location.pathname;

  const Page = () => {
    switch (currentPath) {
      case "/dashboard":
        return <Dashboard />;
      case "/productos":
        return <ProductsPage />;
      case "/movimientos":
        return <MovesPage />;
      case "/proveedores":
        return <SuppliersPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex-grow">{Page()}</div>
    </div>
  );
}
