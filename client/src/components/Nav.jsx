import { StockInLogo } from "../assets/StokinLogo";
import { SalesIcon } from "../assets/SalesIcon";
import { EmployeeIcon } from "../assets/EmployeeIcon";
import { ReportIcon } from "../assets/ReportIcon";
import { ProductIcon } from "../assets/ProductIcon";
import { DashboardIcon } from "../assets/DashboardIcon";
import { LogoutIcon } from "../assets/LogoutIcon";
import { OrdersIcon } from "../assets/OrdersIcon";
import SupplierIcon from "../assets/SupplierIcon";
import supabase from "../utils/supabase";


const navAdminItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Productos", icon: <ProductIcon />, href: "/productos" },
  { text: "Pedidos", icon: <OrdersIcon />, href: "/pedidos" },
  { text: "Proveedores", icon: <SupplierIcon />, href: "/proveedores" },
  { text: "Empleados", icon: <EmployeeIcon /> },
  { text: "Reportes", icon: <ReportIcon /> },
  { text: "Ventas", icon: <SalesIcon /> },
];

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Productos", icon: <ProductIcon />, href: "/productos" },
  { text: "Pedidos", icon: <OrdersIcon />, href: "/pedidos" },
  { text: "Ventas", icon: <SalesIcon /> },
];

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error al cerrar sesión:", error);
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/signin";
  }
};

export default function Nav() {
  const role = localStorage.getItem("role");

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
          {role === "admin" ? "Admin" : "Empleado"}
        </span>
      </div>
      <ul className="flex flex-col justify-between h-full flex-1">
        <div>
          {(role === "employee" ? navItems : navAdminItems).map(
            (item, index) => (
              <li
                key={index}
                onClick={() => item.href && (window.location.href = item.href)}
                className="px-6 py-3 mb-1 rounded-lg text-blue-100 font-medium flex items-center gap-3 text-base transition-colors hover:bg-blue-700 hover:text-white cursor-pointer"
              >
                {item.icon}
                <span className="hidden md:inline">{item.text}</span>
              </li>
            )
          )}
        </div>
        <li
          onClick={handleLogout}
          className="px-6 py-3 mb-1 rounded-lg text-white font-medium flex items-center gap-3 text-base transition-colors hover:bg-red-500 hover:text-white cursor-pointer"
        >
          <LogoutIcon />
          <span className="hidden md:inline">Logout</span>
        </li>
      </ul>
    </nav>
  );
}
