import { useState } from "react";
import ReportMoves from "../components/reports/ReportMoves";
import ReportProducts from "../components/reports/ReportProducts";

export default function Reports() {
  const [reportActive, setReportActive] = useState(null);

  const getReportTitle = () => {
    if (reportActive === "move") return "Reportes movimientos";
    if (reportActive === "product") return "Reportes productos";
    return "Reportes";
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-6 bg-white">
        <h1 className="font-bold text-4xl">{getReportTitle()}</h1>
        {reportActive && (
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-300"
            onClick={() => setReportActive(null)}
          >
            Volver
          </button>
        )}
      </div>

      <div className="flex-grow flex justify-center items-center relative">
        {!reportActive && (
          <div className="flex space-x-6">
            <button
              className="bg-blue-600 text-white py-4 px-8 rounded-lg w-64 h-16 text-xl hover:bg-blue-700 transition-all duration-300"
              onClick={() => setReportActive("move")}
            >
              Movimientos
            </button>
            <button
              className="bg-blue-600 text-white py-4 px-8 rounded-lg w-64 h-16 text-xl hover:bg-blue-700 transition-all duration-300"
              onClick={() => setReportActive("product")}
            >
              Productos
            </button>
          </div>
        )}

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
