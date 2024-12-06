import * as XLSX from "xlsx";

function DownloadButtonP({data}) {
  const hoy = new Date().toLocaleDateString("en-CA");

  const exportToExcel = (data, fileName) => {
    const formattedData = data.map((item) => ({
      Producto: item.name,
      Cantidad: item.quantity,
      Precio_costo: item.cost_price,
      Precio_publico: item.public_price,
      Ganancia: item.gain,
      Generado: item.generado,
      Rentabilidad: item.rentabilidad,
      Flujo: item.flujo
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleDownload = () => {
    exportToExcel(data, `Reporte productos - ${hoy}`);
  };

  return (
    <button onClick={handleDownload} className="download-btn bg-gray-700 text-white p-2 rounded hover:bg-gray-600">
      Descargar Excel
    </button>
  );
};
export default DownloadButtonP