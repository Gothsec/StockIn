import { useState } from "react";
import ReportMoves from "../components/reports/ReportMoves";
import ReportProducts from "../components/reports/ReportProducts";

export default function Reports() {
  const [reportActive, setReportActive] = useState(null);

  // Función para obtener el título del reporte
  const getReportTitle = () => {
    if (reportActive === "move") return "Reportes movimientos";
    if (reportActive === "product") return "Reportes productos";
    return "Reportes";
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header con título y botón volver */}
      <div className="flex justify-between items-center p-6 bg-white">
        <h1 className="font-bold text-4xl">{getReportTitle()}</h1>
        {reportActive && (
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-300"
            onClick={() => setReportActive(null)} // Restablece el estado
          >
            Volver
          </button>
        )}
      </div>

      {/* Contenedor principal */}
      <div className="flex-grow flex justify-center items-center relative">
        {/* Botones de selección */}
        {!reportActive && (
          <div className="flex space-x-6">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg w-48 h-12 hover:bg-blue-700 transition-all duration-300"
              onClick={() => setReportActive("move")}
            >
              Movimientos
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg w-48 h-12 hover:bg-blue-700 transition-all duration-300"
              onClick={() => setReportActive("product")}
            >
              Productos
            </button>
          </div>
        )}

        {/* Renderizado de reportes */}
        {reportActive && (
          <div className="absolute top-6 left-6">
            {reportActive === "move" && <ReportMoves />}
            {reportActive === "product" && <ReportProducts />}
          </div>
        )}
      </div>
    </div>
  );
}
