import { StockInLogo } from "../assets/StokinLogo";
import { SalesIcon } from "../assets/SalesIcon";
import { EmployeeIcon } from "../assets/EmployeeIcon";
import { ReportIcon } from "../assets/ReportIcon";
import { ProductIcon } from "../assets/ProductIcon";
import { DashboardIcon } from "../assets/DashboardIcon";
import { LogoutIcon } from "../assets/LogoutIcon";
import { OrdersIcon } from "../assets/OrdersIcon";

// Hola

const navAdminItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Productos", icon: <ProductIcon /> },
  { text: "Pedidos", icon: <OrdersIcon /> },
  { text: "Empleados", icon: <EmployeeIcon /> },
  { text: "Reportes", icon: <ReportIcon /> },
  { text: "Ventas", icon: <SalesIcon /> },
];

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Productos", icon: <ProductIcon /> },
  { text: "Pedidos", icon: <OrdersIcon /> },
  { text: "Ventas", icon: <SalesIcon /> },
];

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/signin';
};

export default function Nav() {
  const role = localStorage.getItem('role');

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
        <span className="font-bold text-xs uppercase inline-block ml-4 mb-2 text-blue-200 md:block md:ml-6">
          {role === 'admin' ? 'Admin' : 'Empleado'}
        </span>
      </div>
      <ul className="flex flex-col justify-between h-full flex-1">
        <div>
          {role === 'employee' &&
            navItems.map((item, index) => (
              <li
                key={index}
                className="px-6 py-3 mb-1 rounded-lg text-blue-100 font-medium flex items-center gap-3 text-base transition-colors hover:bg-blue-700 hover:text-white cursor-pointer"
              >
                {item.icon}
                <span className="hidden md:inline">{item.text}</span>
              </li>
            ))}

          {role === 'admin' &&
            navAdminItems.map((item, index) => (
              <li
                key={index}
                className="px-6 py-3 mb-1 rounded-lg text-blue-100 font-medium flex items-center gap-3 text-base transition-colors hover:bg-blue-700 hover:text-white cursor-pointer"
              >
                {item.icon}
                <span className="hidden md:inline">{item.text}</span>
              </li>
            ))}
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
