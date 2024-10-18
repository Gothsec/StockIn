import { useEffect, useState } from "react";
import SupplierRow from "../components/suppliers/SupplierRow";
import { ModalSupplier } from "../components/suppliers/ModalSupplier";
import supabase from "../utils/supabase";
import MessageConfirmation from "../components/MessageConfirmation";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [selectedCity, setSelectedCity] = useState(""); // Estado para la ciudad seleccionada
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
    supplierId: "",
    option: "",
  });
  const [windowsModal, setWindowsModal] = useState(false);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]); // Estado para las ciudades
  const [showCityFilter, setShowCityFilter] = useState(false); // Estado para mostrar/ocultar el filtro por ciudad

  const abrirCerrarModal = (
    titleModal,
    buttonText,
    onClickFunction,
    supplierId = "",
    option = ""
  ) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
      supplierId,
      option,
    });
    setWindowsModal((prev) => !prev);
  };

  const fetchSuppliers = async () => {
    const { data, error } = await supabase
      .from("supplier")
      .select(`id, name, email, phone_number, city, address`)
      .eq("state", true);

    if (error) {
      console.error("Error fetching suppliers: ", error);
      setError("Error al cargar los proveedores.");
      setSuppliers([]);
    } else {
      setSuppliers(data || []);
      setError(null);
      setCities([...new Set(data.map((supplier) => supplier.city))]); // Obtener las ciudades únicas
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const onUpdate = (e) => {
    if (e) e.preventDefault();
    fetchSuppliers();
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    if (!supplier.name) return false;
    return (
      (selectedCity === "" || supplier.city === selectedCity) && // Filtrar por ciudad
      (searchSupplier === "" ||
        supplier.name.toLowerCase().includes(searchSupplier.toLowerCase()))
    );
  });

  console.log("Proveedores: ", suppliers);
  console.log("Proveedores filtrados: ", filteredSuppliers);

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <header className="flex justify-between items-baseline pb-8">
          <h1 className="font-bold text-4xl">Proveedores</h1>
          <input
            className="flex-auto border border-gray-400 h-9 rounded-xl pl-2 ml-9"
            type="search"
            placeholder="Buscar proveedor"
            onChange={(e) => setSearchSupplier(e.target.value)}
          />
          <button
            className="bg-blue-500 rounded-xl text-white hover:bg-blue-600 mt-3 w-48 h-9 ml-9"
            onClick={() => abrirCerrarModal("Nuevo Proveedor", "", "create")}
          >
            Agregar Proveedor
          </button>
          <button
            className="bg-green-500 rounded-xl text-white hover:bg-green-600 mt-3 w-48 h-9 ml-2"
            onClick={() => setShowCityFilter(!showCityFilter)} // Alternar la visibilidad del filtro de ciudad
          >
            Filtrar por Ciudad
          </button>
        </header>
        {showCityFilter && ( // Mostrar el filtro de ciudad si está activo
          <div className="mb-4">
            <select
              className="border border-gray-400 rounded-xl h-9 pl-2"
              onChange={(e) => setSelectedCity(e.target.value)} // Actualizar la ciudad seleccionada
              value={selectedCity}
            >
              <option value="">Seleccionar Ciudad</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <button
              className="ml-2 bg-blue-500 text-white rounded-xl h-9 px-4"
              onClick={() => setSelectedCity("")} // Reiniciar el filtro de ciudad
            >
              Reiniciar Filtro
            </button>
          </div>
        )}
        <MessageConfirmation />
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-gray-200 sticky top-0 left-0">
                <th className="py-2 text-left px-4">Nombre del Proveedor</th>
                <th className="py-2 text-left px-2">Dirección</th>
                <th className="py-2 text-center px-4">Teléfono</th>
                <th className="py-2 text-left px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier, index) => (
                <SupplierRow
                  key={supplier.id}
                  id={supplier.id}
                  name={supplier.name}
                  address={supplier.address}
                  phone_number={supplier.phone_number}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  onUpdate={fetchSuppliers}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {windowsModal && (
        <ModalSupplier
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          supplierId={modalProps.supplierId}
          option={modalProps.option}
          onUpdate={fetchSuppliers}
        />
      )}
    </div>
  );
}
