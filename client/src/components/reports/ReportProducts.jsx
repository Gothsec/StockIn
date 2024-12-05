import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import ReportProductsRow from "./ReportProductsRow";
import DownloadButtonP from "./DownloadButtonP";

export default function ReportProducts() {
  const tiposGanancia = ["Mayor ganancia", "Menor ganancia"];
  const [tipoGanaciaSelect, setTipoGananciaSelect] = useState("");
  const tiposRentabilidad = ["Mayor rentabilidad", "Menor rentabilidad"];
  const [tipoRentabilidadSelect, setTipoRentabilidadSelect] = useState("");
  const tipoStock = ["Mayor stock", "Menor stock"];
  const [tipoStockSelect, setTipoStockSelect] = useState("");
  const tipoFlujo = ["Mayor flujo", "Menor flujo"];
  const [tipoFlujoSelect, setTipoFlujoSelect] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [productExcel, setProductExcel] = useState([]);
  const [error, setError] = useState(null);

  const [totalRecords, setTotalRecords] = useState(0);
  const lastPage = Math.ceil(totalRecords / itemsPerPage);

  const [productos, setProductos] = useState([]);

  const [activeFilters, setActiveFilters] = useState({
    tipoGanaciaSelect: "",
    tipoRentabilidadSelect: "",
    tipoStockSelect: "",
    tipoFlujoSelect: "",
  });

  const fetchProductos = async (limit = 10, offset = 0, filters = null) => {
    try {
      const appliedFilters = filters || activeFilters;
  
      // Hacer la consulta sin paginación para obtener todos los productos
      let query = supabase
        .from("product")
        .select(
          `id,
           name,
           quantity,
           cost_price,
           public_price,
           gain
          `,
          { count: "exact" }
        )
        .eq("state", true);
  
      // Filtros aplicables en la base de datos
      if (appliedFilters.tipoStockSelect) {
        query = query.order("quantity", {
          ascending: appliedFilters.tipoStockSelect === "Menor stock",
        });
      }
      if (appliedFilters.tipoGanaciaSelect) {
        query = query.order("gain", {
          ascending: appliedFilters.tipoGanaciaSelect === "Menor ganancia",
        });
      }
  
      // Obtener todos los productos sin paginación
      const { data: productosBase, error: errorProductosBase } = await query;
  
      if (errorProductosBase) throw errorProductosBase;
  
      // Obtener todos los movimientos relacionados con los productos
      const productIds = productosBase.map((p) => p.id);
      const { data: movimientos, error: errorMovimientos } = await supabase
        .from("move")
        .select("product_id, quantity, type")
        .in("product_id", productIds);
  
      if (errorMovimientos) throw errorMovimientos;
  
      // Realizar los cálculos de Generado, Rentabilidad y Flujo antes de aplicar la paginación
      const productosConDatos = productosBase.map((producto) => {
        const movimientosProducto = movimientos.filter(
          (m) => m.product_id === producto.id
        );
  
        const totalSalida = movimientosProducto
          .filter((m) => m.type === "Salida")
          .reduce((acc, curr) => acc + curr.quantity, 0);
        const generado = totalSalida * producto.gain || 0;
  
        const flujo = movimientosProducto.length;
  
        const rentabilidad =
          ((producto.public_price - producto.cost_price) / producto.public_price) *
          100;
  
        return {
          ...producto,
          generado,
          flujo,
          rentabilidad: parseFloat(rentabilidad.toFixed(1)), // Asegura tipo numérico
        };
      });
  
      // Guardar los productos completos con los cálculos en productExcel
      setProductExcel(productosConDatos || []);
  
      // Filtros aplicables en el cliente
      let productosFiltrados = [...productosConDatos];
  
      // Ordenar por flujo si se seleccionó
      if (appliedFilters.tipoFlujoSelect) {
        productosFiltrados.sort((a, b) => {
          return appliedFilters.tipoFlujoSelect === "Menor flujo"
            ? a.flujo - b.flujo
            : b.flujo - a.flujo;
        });
      }
  
      // Ordenar por rentabilidad si se seleccionó
      if (appliedFilters.tipoRentabilidadSelect) {
        productosFiltrados.sort((a, b) => {
          return appliedFilters.tipoRentabilidadSelect === "Menor rentabilidad"
            ? a.rentabilidad - b.rentabilidad
            : b.rentabilidad - a.rentabilidad;
        });
      }
  
      // Aplicar paginación si es necesario
      const start = offset;
      const end = offset + limit - 1;
      productosFiltrados = productosFiltrados.slice(start, end);
  
      // Establecer los productos paginados en el estado
      setProductos(productosFiltrados);
      setTotalRecords(productosConDatos.length); // El total de registros es el de todos los productos
      setError(null);
  
    } catch (err) {
      console.error("Error fetching product: ", err);
      setError("Error al cargar los productos.");
      setProductos([]);
    }
  };
  

  const handlePageChange = (newPage) => {
    const offset = (newPage - 1) * itemsPerPage;
    fetchProductos(itemsPerPage, offset);
    setCurrentPage(newPage);
  };

  const limpiarFiltros = () => {
    const defaultFilters = {
      tipoGanaciaSelect: "",
      tipoRentabilidadSelect: "",
      tipoStockSelect: "",
      tipoFlujoSelect: "",
    };
    setTipoGananciaSelect("");
    setTipoRentabilidadSelect("");
    setTipoStockSelect("");
    setTipoFlujoSelect("");
    setActiveFilters(defaultFilters);
    fetchProductos(itemsPerPage, 0, defaultFilters);
    setCurrentPage(1);
  };

  const aplicarFiltros = () => {
    const newFilters = {
      tipoGanaciaSelect,
      tipoRentabilidadSelect,
      tipoStockSelect,
      tipoFlujoSelect,
    };
    setActiveFilters(newFilters);
    fetchProductos(itemsPerPage, 0, newFilters);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="flex space-x-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex flex-col">
            <label
              htmlFor="ganancia"
              className="text-sm font-medium text-gray-700"
            >
              ganancia
            </label>
            <select
              className="w-52 border border-gray-400 rounded-lg h-9 px-2 mr-4"
              onChange={(e) => setTipoGananciaSelect(e.target.value)}
              value={tipoGanaciaSelect}
            >
              <option value="">Selecciona una opción</option>
              {tiposGanancia.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="rentabilidad"
              className="text-sm font-medium text-gray-700"
            >
              rentabilidad
            </label>
            <select
              className="w-52 border border-gray-400 rounded-lg h-9 px-2 mr-4"
              onChange={(e) => setTipoRentabilidadSelect(e.target.value)}
              value={tipoRentabilidadSelect}
            >
              <option value="">Selecciona una opción</option>
              {tiposRentabilidad.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="stock"
              className="text-sm font-medium text-gray-700"
            >
              Stock
            </label>
            <select
              className="w-52 border border-gray-400 rounded-lg h-9 px-2 mr-4"
              onChange={(e) => setTipoStockSelect(e.target.value)}
              value={tipoStockSelect}
            >
              <option value="">Selecciona una opción</option>
              {tipoStock.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="flujo"
              className="text-sm font-medium text-gray-700"
            >
              Flujo
            </label>
            <select
              className="w-52 border border-gray-400 rounded-lg h-9 px-2 mr-4"
              onChange={(e) => setTipoFlujoSelect(e.target.value)}
              value={tipoFlujoSelect}
            >
              <option value="">Selecciona una opción</option>
              {tipoFlujo.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              className="mt-6 p-2 border bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
              onClick={aplicarFiltros}
            >
              Aplicar
            </button>
          </div>
          <div className="flex flex-col justify-end">
            <button
              className="mt-6 p-2 border bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition-all duration-300 ease"
              onClick={() => limpiarFiltros()}
            >
              Limpiar
            </button>
          </div>
        </div>
        <div className="w-full lg:w-11/12 mx-auto overflow-x-auto border rounded-lg">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-slate-200">
                <th className="py-2 text-left px-4">Producto</th>
                <th className="py-2 text-center px-4">Cantidad</th>
                <th className="py-2 text-center px-4">Costo</th>
                <th className="py-2 text-center px-4">Público</th>
                <th className="py-2 text-center px-4">Ganancia</th>
                <th className="py-2 text-center px-4">Generado</th>
                <th className="py-2 text-center px-4">Rentabilidad</th>
                <th className="py-2 text-center px-4">Flujo</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <ReportProductsRow
                  key={producto.id}
                  name={producto.name}
                  quantity={producto.quantity}
                  costPrice={producto.cost_price}
                  publicPrice={producto.public_price}
                  gain={producto.gain}
                  generado={producto.generado}
                  flujo={producto.flujo}
                  rentabilidad={producto.rentabilidad}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4 space-x-4 w-full">
          <button
            className="p-2 border bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            Primeros
          </button>
          <button
            className="p-2 border bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button
            className="p-2 border bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
          >
            Siguiente
          </button>
          <button
            className="p-2 border bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handlePageChange(lastPage)}
            disabled={currentPage === lastPage}
          >
            Últimos
          </button>
          <div className="flex justify-end">
            <DownloadButtonP data={productExcel} />
          </div>
        </div>
      </div>
    </div>
  );
}
