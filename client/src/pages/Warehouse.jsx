// función: Nos permite mostrar y gestionar las Bodegas
import { useEffect, useState } from "react";
import WarehouseRow from "../components/warehouses/WarehouseRow";
import { ModalWarehouse } from "../components/warehouses/ModalWarehouse";
import supabase from "../utils/supabase";
import MessageConfirmation from "../components/MessageConfirmation";
import AddIcon from "../assets/AddIcon";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]); // Estado para las bodegas
  const [searchResponsible, setSearchResponsible] = useState(""); // Filtro por responsable
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
    warehouseId: "",
    option: "",
  });
  const [windowsModal, setWindowsModal] = useState(false); // Controla la visibilidad del modal
  const [error, setError] = useState(null); // Estado para errores

  // Función para abrir o cerrar el modal
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

  // Función para traer las bodegas desde Supabase
  const fetchWarehouses = async () => {
    const { data, error } = await supabase
      .from("warehouse")
      .select(`
        id, 
        name,
        cant_actual,
        percentage_used,
        responsible (
          name
        )
      `)
      .eq("state", true); // Filtrar solo bodegas activas

    if (error) {
      console.error("Error fetching warehouses: ", error);
      setError("Error al cargar las bodegas.");
      setWarehouses([]);
    } else {
      setWarehouses(data || []);
      setError(null);
    }
  };

  // Ejecuta fetchWarehouses al montar el componente
  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Filtrar bodegas por responsable
  const filteredWarehouses = Array.isArray(warehouses)
    ? warehouses.filter((warehouse) => {
        if (searchResponsible === "") return true; // No filtrar si el campo está vacío
        return warehouse.responsible?.name
          ?.toLowerCase()
          .includes(searchResponsible.toLowerCase());
      })
    : [];

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <h1 className="font-bold text-4xl mb-4">Bodegas</h1>
        <header className="flex justify-between items-center pb-4">
          <input
            className="flex-auto border border-gray-400 h-9 rounded-lg pl-3"
            type="search"
            placeholder="Buscar por responsable"
            onChange={(e) => setSearchResponsible(e.target.value)}
          />
          <button
            className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg w-48 h-9 ml-4 hover:bg-blue-700 transition-all duration-300 ease"
            onClick={() =>
              abrirCerrarModal("Nueva bodega", "", "create")
            }
          >
            <AddIcon />
          </button>
        </header>

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
                <th className="py-2 text-left px-2">Nombre de la bodega</th>
                <th className="py-2 text-left px-2">Responsable</th>
                <th className="py-2 text-center px-2">Cantidad actual</th>
                <th className="py-2 text-left px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredWarehouses.map((warehouse, index) => (
                <WarehouseRow
                  key={warehouse.id}
                  id={warehouse.id}
                  name={warehouse.name}
                  responsible={warehouse.responsible?.name} // Mostrar el nombre del responsable
                  cant_actual={warehouse.cant_actual}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  onUpdate={fetchWarehouses} // Refrescar lista tras actualizar
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
