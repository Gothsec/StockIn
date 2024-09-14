import { StockInLogo } from "../assets/Stokin-logo";
import { SalesIcon } from "../assets/Sales-icon";
import { EmployeeIcon } from "../assets/Employee-icon";
import { ReportIcon } from "../assets/Report-icon";
import { ProductIcon } from "../assets/Product-icon";
import { DashboardIcon } from "../assets/Dashboard-icon";
import { LogoutIcon } from "../assets/Logout-icon";

const navAdminItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Productos", icon: <ProductIcon /> },
  { text: "Empleados", icon: <EmployeeIcon /> },
  { text: "Reportes", icon: <ReportIcon /> },
  { text: "Ventas", icon: <SalesIcon /> },
];

// Opciones para los usuarios sin privilegios de administrador
const navItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Productos", icon: <ProductIcon /> },
  { text: "Ventas", icon: <SalesIcon /> },
];

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/signin';
};

export default function Nav() {
  const role = localStorage.getItem('role');

  return (
    <nav className="bg-blue-600 w-72 h-screen pt-6 px-1 flex flex-col">
      <div>
        <div className="flex items-center ml-6 mb-4">
          <StockInLogo color="#fff" width="35px" />
          <span className="ml-2 mb-1 inline-block text-white font-bold text-2xl">
            StockIn
          </span>
        </div>
        <hr className="mb-4 w-[90%] mx-auto border-blue-200" />
        <span className="font-bold text-xs uppercase inline-block ml-6 mb-2 text-blue-200">
          {role === 'admin' ? 'Admin' : 'Empleado'}
        </span>
      </div>
      <ul className="flex flex-col justify-between h-full flex-1">
        <div>
          {role === 'employee' && navItems.map((item, index) => (
            <li key={index} className="px-6 py-3 mb-1 rounded-lg text-blue-100 font-medium flex items-center gap-3 text-base transition-colors hover:bg-blue-700 hover:text-white cursor-pointer">
              {item.icon}
              {item.text}
            </li>
          ))}

          {role === 'admin' && navAdminItems.map((item, index) => (
            <li key={index} className="px-6 py-3 mb-1 rounded-lg text-blue-100 font-medium flex items-center gap-3 text-base transition-colors hover:bg-blue-700 hover:text-white cursor-pointer">
              {item.icon}
              {item.text}
            </li>
          ))}
        </div>
        <li onClick={handleLogout} className="px-6 py-3 mb-1 rounded-lg text-white font-medium flex items-center gap-3 text-base transition-colors hover:bg-red-500 hover:text-white cursor-pointer">
          <LogoutIcon />
          <span>Logout</span>
        </li>
      </ul>
    </nav>
  );
}
