// función: Nos permite mostrar y gestionar los proveedores

import { useEffect, useState } from "react";
import SupplierRow from "../components/suppliers/SupplierRow";
import { ModalSupplier } from "../components/suppliers/ModalSupplier";
import supabase from "../utils/supabase";
import MessageConfirmation from "../components/MessageConfirmation";
import AddIcon from "../assets/AddIcon";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
    supplierId: "",
    option: "",
  });
  const [windowsModal, setWindowsModal] = useState(false);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);

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
      setCities([...new Set(data.map((supplier) => supplier.city))]);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) => {
    if (!supplier.name) return false;
    return (
      (selectedCity === "" || supplier.city === selectedCity) &&
      (searchSupplier === "" ||
        supplier.name.toLowerCase().includes(searchSupplier.toLowerCase()))
    );
  });

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <header className="pb-8">
          <h1 className="font-bold text-4xl">Proveedores</h1>
          <div className="flex items-center mt-4">
            <select
              className="w-52 border border-gray-400 rounded-lg h-9 px-2 mr-4"
              onChange={(e) => setSelectedCity(e.target.value)}
              value={selectedCity}
            >
              <option value="">Todas las ciudades</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <input
              className="flex-grow border border-gray-400 h-9 rounded-lg pl-3"
              type="search"
              placeholder="Buscar proveedor"
              onChange={(e) => setSearchSupplier(e.target.value)}
            />
            <button
              className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg w-48 h-9 ml-4 hover:bg-blue-700 transition-all duration-300 ease"
              onClick={() => abrirCerrarModal("Nuevo proveedor", "", "create")}
            >
              <AddIcon />
            </button>
          </div>
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
                <th className="py-2 text-left px-4">Nombre del proveedor</th>
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

