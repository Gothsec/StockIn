import { useEffect, useState } from "react";
import WarehouseRow from "../components/warehouses/WarehouseRow"; // Adaptado para bodegas
import { ModalWarehouse } from "../components/warehouses/ModalWarehouse"; // Adaptado para bodegas
import supabase from "../utils/supabase";
import MessageConfirmation from "../components/MessageConfirmation";
import AddIcon from "../assets/AddIcon";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [searchWarehouse, setSearchWarehouse] = useState("");
  const [showLowCapacity, setShowLowCapacity] = useState(false);
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
    warehouseId: "",
    option: "",
  });
  const [windowsModal, setWindowsModal] = useState(false);
  const [error, setError] = useState(null);

  const abrirCerrarModal = (
    titleModal,
    buttonText,
    onClickFunction,
    warehouseId = "",
    option = ""
  ) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
      warehouseId,
      option,
    });
    setWindowsModal((prev) => !prev);
  };

  const fetchWarehouses = async () => {
    const { data, error } = await supabase
      .from("warehouse")
      .select("id, name, address, cant_actual, cant_max_product, state")
      .eq("state", true);

    if (error) {
      console.error("Error fetching warehouses: ", error);
      setError("Error al cargar las bodegas.");
      setWarehouses([]);
    } else {
      const updatedWarehouses = data.map((warehouse) => ({
        ...warehouse,
        isLowCapacity: warehouse.cant_actual >= warehouse.cant_max_product,
      }));
      setWarehouses(updatedWarehouses || []);
      setError(null);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(searchWarehouse.toLowerCase())
  );

  const lowCapacityWarehouses = filteredWarehouses.filter(
    (warehouse) => warehouse.isLowCapacity
  );

  const warehousesToDisplay = showLowCapacity
    ? lowCapacityWarehouses
    : filteredWarehouses;

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <div className="flex justify-between items-center pb-4">
          <h1 className="font-bold text-4xl">Bodegas</h1>
          {lowCapacityWarehouses.length > 0 && (
            <div className="text-sm text-red-600 font-semibold">
              Tienes {lowCapacityWarehouses.length} bodega(s) en capacidad máxima.
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pb-4">
          <div className="space-x-4">
            <button
              className={`py-1 px-3 rounded-lg border transition-colors duration-300 ${
                showLowCapacity
                  ? "bg-white text-blue-500 border-blue-500"
                  : "bg-blue-500 text-white"
              }`}
              onClick={() => setShowLowCapacity(false)}
            >
              Capacidad completa
            </button>
            <button
              className={`py-1 px-3 rounded-lg border transition-colors duration-300 ${
                showLowCapacity
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 border-blue-500"
              }`}
              onClick={() => setShowLowCapacity(true)}
            >
              Máxima capacidad
            </button>
          </div>

          <input
            className="flex-auto border border-gray-400 h-9 rounded-lg pl-3 ml-9"
            type="search"
            placeholder="Buscar bodega"
            onChange={(e) => setSearchWarehouse(e.target.value)}
          />
          <button
            className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg w-48 h-9 ml-9 hover:bg-blue-700 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Nueva Bodega", "", "create")}
          >
            <AddIcon />
          </button>
        </div>
        <MessageConfirmation />
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-slate-200 sticky top-0 left-0">
                <th className="py-2 text-left px-4">Nombre</th>
                <th className="py-2 text-center px-40">Dirección</th>
                <th className="py-2 text-center px-2">Stock Actual</th>
                <th className="py-2 text-center px-10"></th>
              </tr>
            </thead>
            <tbody>
              {warehousesToDisplay.map((warehouse, index) => (
                <WarehouseRow
                  key={warehouse.id}
                  id={warehouse.id}
                  name={warehouse.name}
                  address={warehouse.address}
                  cant_actual={warehouse.cant_actual}
                  isLowCapacity={warehouse.isLowCapacity}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  onUpdate={fetchWarehouses}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {windowsModal && (
        <ModalWarehouse
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          warehouseId={modalProps.warehouseId}
          option={modalProps.option}
          onUpdate={fetchWarehouses}
        />
      )}
    </div>
  );
}
