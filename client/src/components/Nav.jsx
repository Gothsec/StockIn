import { StockInLogo } from "./Stokin-logo"
import { SalesIcon } from "./Sales-icon"
import { EmployeeIcon } from "./Employee-icon"
import { ReportIcon } from "./Report-icon"
import { ProductIcon } from "./Product-icon"
import { DashboardIcon } from "./Dashboard-icon"

const options = ["Dashboard", "Productos", "Gestion de empleados", "Reportes", "Ventas"]
const icons = [<DashboardIcon/>, <ProductIcon/>, <EmployeeIcon/>, <ReportIcon/>, <SalesIcon/>]

export default function Nav() {
  return (
    <nav className="bg-blue-600 w-[20%] h-[100vh] py-5 px-1">
      <div className="flex items-center ml-4 mb-5">
        <StockInLogo color="#fff"/>
        <span className="ml-1 inline-block text-white font-bold text-3xl">StockIn</span>
      </div>
      <ul>
        {
          options.map((option, index) => (
            <li className="px-4 py-3 rounded-lg text-white flex items-center gap-3 text-lg hover:bg-blue-700">{icons[index]}{option}</li>
          ))
        }
      </ul>
    </nav>
  )
}