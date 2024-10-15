import { useEffect, useState } from "react";
import SupplierRow from "../components/suppliers/SupplierRow";
import { ModalSupplier } from "../components/suppliers/ModalSupplier";
import supabase from "../utils/supabase";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
    supplierId: "",
    option: "",
  });
  const [windowsModal, setWindowsModal] = useState(false);
  const [error, setError] = useState(null);

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
      .select(`id, name, email, phone_number, city`)
      .eq("state", true);

    if (error) {
      console.error("Error fetching suppliers: ", error);
      setError("Error al cargar los proveedores.");
      setSuppliers([]);
    } else {
      setSuppliers(data || []);
      setError(null);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const onUpdate = (e) => {
    if (e) e.preventDefault();
    fetchSuppliers();
  };

  const filteredSuppliers = Array.isArray(suppliers)
    ? suppliers.filter((supplier) => {
        if (!supplier.name) return false;
        if (searchSupplier === "") return true;
        return supplier.name
          .toLowerCase()
          .includes(searchSupplier.toLowerCase());
      })
    : [];

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
        </header>

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
                <th className="py-2 text-left px-4">Correo Electrónico</th>
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
                  email={supplier.email} // Agregar email aquí
                  phone_number={supplier.phone_number} // Agregar phone_number aquí
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
        />
      )}
    </div>
  );
}
