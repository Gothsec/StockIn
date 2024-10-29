// Proposito: Nos permite manejar la navegación entre las diferentes páginas del sitio web

import Nav from "../components/Nav";
import ProductsPage from "../pages/Products";
import SuppliersPage from "./Supplier";
import Dashboard from "./Dashboard";
import WarehousesPage from "./Warehouse";
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
      case "/bodegas":
        return <WarehousesPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className="hidden h-screen lg:flex">
        <Nav />
        <div className="flex-grow">{Page()}</div>
      </div>

      <div className="flex lg:hidden flex-col min-h-screen justify-center items-center px-9 gap-3">
        <h2 className="text-3xl font-bold text-center">
          Disponible solo para tablets y escritorio
        </h2>
        <p className="text-slate-500 text-center">
          Este contenido no está disponible en dispositivos móviles pequeños, ni
          tablets pequeñas.
        </p>
      </div>
    </>
  );
}
