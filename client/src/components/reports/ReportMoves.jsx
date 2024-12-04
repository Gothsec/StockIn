import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import ReportMoveRow from "./ReportMoveRow";
import DownloadButton from "./DownloadButton";

export default function ReportMoves() {
  const hoy = new Date().toLocaleDateString("en-CA");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [productSelect, setProductSelect] = useState("");
  const [warehouseSelect, setWarehouseSelect] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [bodegas, setBodegas] = useState([]);
  const [moves, setMoves] = useState([]);
  const [productos, setProductos] = useState([]);
  const [opcionesFiltradas, setOpcionesFiltradas] = useState([]);

  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const tipos = ["Mayor cantidad", "Menor cantidad"];
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [totalRecords, setTotalRecords] = useState(0);
  const lastPage = Math.ceil(totalRecords / itemsPerPage);

  const [activeFilters, setActiveFilters] = useState({
    fechaDesde: "",
    fechaHasta: hoy,
    productSelect: "",
    warehouseSelect: "",
    selectedType: "",
  });
  const [movesExcel, setMovesExcel] = useState([]);

  const fetchMoves = async (limit = 10, offset = 0, filters = null) => {
    try {
      const start = offset;
      const end = offset + limit - 1;

      const appliedFilters = filters || activeFilters;

      let query = supabase
        .from("move")
        .select(
          `
          id,
          quantity,
          type,
          date,
          product:product_id(name),
          warehouse:warehouse_id(name),
          user:user_id(name)
        `,
          { count: "exact" }
        )
        .eq("state", true);

      if (appliedFilters.productSelect) {
        let productId = null;
        const { data, error } = await supabase
          .from("product")
          .select("id")
          .eq("name", appliedFilters.productSelect)
          .single();

        if (!error) {
          productId = data.id;
          query = query.eq("product_id", productId);
        }
      }

      if (appliedFilters.warehouseSelect) {
        query = query.eq("warehouse_id", appliedFilters.warehouseSelect);
      }

      if (appliedFilters.fechaDesde) {
        query = query.gte("date", appliedFilters.fechaDesde);
      }

      if (appliedFilters.fechaHasta) {
        query = query.lte("date", appliedFilters.fechaHasta);
      }

      if (appliedFilters.selectedType) {
        const ascending = appliedFilters.selectedType === "Menor cantidad";
        query = query.order("quantity", { ascending });
      } else {
        query = query.order("id", { ascending: false });
      }

      const {data: dataExcel, error: errorDataExcel} = await query;
      if (errorDataExcel) throw errorDataExcel;

      setMovesExcel(dataExcel || []);

      query = query.range(start, end);

      const { data, error, count } = await query;

      if (error) throw error;

      setMoves(data || []);
      setTotalRecords(count || 0);
      setError(null);
    } catch (err) {
      console.error("Error fetching moves: ", err);
      setError("Error al cargar los movimientos.");
      setMoves([]);
    }
  };

  const fetchProductos = async () => {
    const { data, error } = await supabase
      .from("product")
      .select("*")
      .eq("state", true);

    if (error) {
      console.error("Error fetching products: ", error);
      return;
    }
    setProductos(data || []);
    setOpcionesFiltradas(data || []);
  };

  const handlePageChange = (newPage) => {
    const offset = (newPage - 1) * itemsPerPage;
    fetchMoves(itemsPerPage, offset);
    setCurrentPage(newPage);
  };

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setProductSelect(valor);

    setMostrarOpciones(valor.length > 0);

    const filtrado = productos.filter((producto) => {
      return producto.name.toLowerCase().includes(valor.toLowerCase());
    });

    setOpcionesFiltradas(filtrado);
  };

  const handleSelectOption = (producto) => {
    setProductSelect(producto.name);
    setMostrarOpciones(false);
  };

  const fetchBodegas = async () => {
    const { data, error } = await supabase
      .from("warehouse")
      .select("*")
      .eq("state", true);

    if (error) {
      console.error("Error al obtener bodegas: ", error);
      return;
    }
    setBodegas(data || []);
  };

  const limpiarFiltros = () => {
    const defaultFilters = {
      fechaDesde: "",
      fechaHasta: hoy,
      productSelect: "",
      warehouseSelect: "",
      selectedType: "",
    };
    setFechaDesde("");
    setFechaHasta("");
    setProductSelect("");
    setWarehouseSelect("");
    setSelectedType("");
    setActiveFilters(defaultFilters);
    fetchMoves(itemsPerPage, 0, defaultFilters);
    setCurrentPage(1);
  };

  const aplicarFiltros = () => {
    const newFilters = {
      fechaDesde,
      fechaHasta,
      productSelect,
      warehouseSelect,
      selectedType,
    };
    setActiveFilters(newFilters);
    fetchMoves(itemsPerPage, 0, newFilters);
    setCurrentPage(1);
    console.log("datos filtrados: ", movesExcel);
  };

  useEffect(() => {
    fetchBodegas();
    fetchProductos();
    fetchMoves();
  }, []);

  return (
    <div className="flex space-x-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center space-x-6">
          <div className="relative w-64">
            <label
              htmlFor="Producto"
              className="text-sm font-medium text-gray-700"
            >
              Producto
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Buscar producto..."
              value={productSelect}
              onChange={handleInputChange}
            />
            {mostrarOpciones && opcionesFiltradas.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-60 overflow-y-auto">
                {opcionesFiltradas.map((producto, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                    onClick={() => handleSelectOption(producto)}
                  >
                    {producto.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="Bodegas"
              className="text-sm font-medium text-gray-700"
            >
              Bodegas
            </label>
            <select
              name="Bodegas"
              id="Bodegas"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              onChange={(e) => setWarehouseSelect(e.target.value)}
              value={warehouseSelect}
            >
              <option value="">Seleccione una bodega</option>
              {bodegas.map((bodega) => (
                <option key={bodega.id} value={bodega.id}>
                  {bodega.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="movimientos"
              className="text-sm font-medium text-gray-700"
            >
              Movimientos
            </label>
            <select
              className="w-52 border border-gray-400 rounded-lg h-9 px-2 mr-4"
              onChange={(e) => setSelectedType(e.target.value)}
              value={selectedType}
            >
              <option value="">Selecciona una opción</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="desde"
              className="text-sm font-medium text-gray-700"
            >
              Desde
            </label>
            <input
              name="desde"
              id="desde"
              type="date"
              className="mt-1 p-2 border rounded-md"
              onChange={(e) => setFechaDesde(e.target.value)}
              value={fechaDesde}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="hasta"
              className="text-sm font-medium text-gray-700"
            >
              Hasta
            </label>
            <input
              name="hasta"
              id="hasta"
              type="date"
              className="mt-1 p-2 border rounded-md"
              value={fechaHasta || hoy}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
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
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-slate-200 sticky top-0 left-0">
                <th className="py-2 text-left px-4">Producto</th>
                <th className="py-2 text-center px-8">Cantidad</th>
                <th className="py-2 text-center px-8">Fecha</th>
                <th className="py-2 text-center px-8">Tipo</th>
                <th className="py-2 text-center px-8">Bodega</th>
                <th className="py-2 text-center px-8">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {moves.map((move, index) => (
                <ReportMoveRow
                  key={move.id}
                  name={move.product.name}
                  quantity={move.quantity}
                  date={move.date}
                  type={move.type}
                  warehouse={move.warehouse}
                  user={move.user}
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
            <DownloadButton data={movesExcel} />
          </div>
        </div>
      </div>
    </div>
  );
}
