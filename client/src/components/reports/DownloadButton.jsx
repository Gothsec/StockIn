import * as XLSX from "xlsx";

const DownloadButton = ({ data }) => {
  const hoy = new Date().toLocaleDateString("en-CA");

  const exportToExcel = (data, fileName) => {
    const formattedData = data.map((item) => ({
      Producto: item.product ? item.product.name : "",
      Bodega: item.warehouse ? item.warehouse.name : "",
      Usuario: item.user ? item.user.name : "",
      Cantidad: item.quantity,
      Tipo: item.type,
      Fecha: item.date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DatosFiltrados");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleDownload = () => {
    exportToExcel(data, `Reporte movimientos - ${hoy}`);
  };

  return (
    <button onClick={handleDownload} className="download-btn bg-gray-700 text-white p-2 rounded hover:bg-gray-600">
      Descargar Excel
    </button>
  );
};

export default DownloadButton;
