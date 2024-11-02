import { StockInLogo } from "../assets/StokinLogo";
import { EmployeeIcon } from "../assets/EmployeeIcon.jsx";
import { ReportIcon } from "../assets/ReportIcon.jsx";
import { ProductIcon } from "../assets/ProductIcon.jsx";
import { DashboardIcon } from "../assets/DashboardIcon.jsx";
import { WarehouseIcon } from "../assets/WarehouseIcon.jsx";
import { MovesIcon } from "../assets/MovesIcon.jsx";
import { LogoutIcon } from "../assets/LogoutIcon.jsx";
import SupplierIcon from "../assets/SupplierIcon";
import { Link } from "react-router-dom";
import supabase from "../utils/supabase";

const navAdminItems = [
  { text: "Vista general", icon: <DashboardIcon />, href: "/dashboard" },
  { text: "Productos", icon: <ProductIcon />, href: "/productos" },
  { text: "Movimientos", icon: <MovesIcon />, href: "/movimientos" },
  { text: "Bodegas", icon: <WarehouseIcon />, href: "/bodegas" },
  { text: "Proveedores", icon: <SupplierIcon />, href: "/proveedores" },
  { text: "Empleados", icon: <EmployeeIcon /> },
  { text: "Reportes", icon: <ReportIcon /> },
];

const navItems = [
  { text: "Productos", icon: <ProductIcon />, href: "/productos" },
  { text: "Movimientos", icon: <MovesIcon />, href: "/movimientos" },
  { text: "Proveedores", icon: <SupplierIcon />, href: "/proveedores" },
];

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error al cerrar sesión:", error);
  } else {
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    window.location.href = "/login";
  }
};

export default function Nav() {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  return (
    <nav className="bg-blue-600 w-min h-screen pt-6 px-1 flex flex-col transition-all duration-300 md:w-60">
      <div>
        <div className="flex items-center ml-5 mb-4 md:ml-6">
          <StockInLogo color="#fff" width="35px" />
          <span className="ml-2 mb-1 hidden text-white font-bold text-2xl md:block">
            StockIn
          </span>
        </div>
        <hr className="mb-4 w-[90%] mx-auto border-blue-200" />
        <span className="font-bold text-xs uppercase inline-block ml-4 mb-2 text-blue-200 md:block">
          {name}
        </span>
      </div>
      <ul className="flex flex-col justify-between h-full flex-1">
        <div>
          {(role === "employee" ? navItems : navAdminItems).map(
            (item, index) => (
              <li key={index} className="px-6 py-3 mb-1 rounded-lg text-blue-100 font-medium flex items-center gap-3 text-base transition-colors hover:bg-blue-700 hover:text-white cursor-pointer">
                {item.href ? (
                  <Link to={item.href} className="flex items-center gap-3">
                    {item.icon}
                    <span className="hidden md:inline">{item.text}</span>
                  </Link>
                ) : (
                  <>
                    {item.icon}
                    <span className="hidden md:inline">{item.text}</span>
                  </>
                )}
              </li>
            )
          )}
        </div>
        <li onClick={handleLogout} className="px-6 py-3 mb-1 rounded-lg text-white font-medium flex items-center gap-3 text-base transition-colors hover:bg-red-500 hover:text-white cursor-pointer">
          <LogoutIcon />
          <span className="hidden md:inline">Cerrar sesión</span>
        </li>
      </ul>
    </nav>
  );
}
