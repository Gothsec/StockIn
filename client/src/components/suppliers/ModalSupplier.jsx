import { useEffect, useState } from "react";
import ButtonCreate from "./ButtonCreateSupplier";
import ButtonUpdate from "./ButtonUpdateSupplier";
import supabase from "../../utils/supabase";
import { capitalizeFirstLetter } from "../../utils/textUtils";

export function ModalSupplier({
  title,
  option,
  onClose,
  supplierId,
  onUpdate,
}) {
  const [supplierInfo, setSupplierInfo] = useState({
    name: "",
    phone_number: "",
    email: "",
    address: "",
    city: "",
  });

  const departments = {
    Amazonas: ["Leticia", "Puerto Nariño"],
    Antioquia: [
      "Medellín",
      "Abejorral",
      "Abrigo",
      "Acacías",
      "Apartadó",
      "Armenia",
      "Barbosa",
      "Bello",
      "Bello Horizonte",
      "Betulia",
      "Caucasia",
      "Chigorodó",
      "Copacabana",
      "Envigado",
      "Fredonia",
      "Girardota",
      "Itagüí",
      "La Ceja",
      "La Estrella",
      "Rionegro",
      "Sabaneta",
      "Santa Fe de Antioquia",
      "Sonsón",
      "Turbo",
      "Urabá",
      "Yarumal",
    ],
    Arauca: [
      "Arauca",
      "Arauquita",
      "Fortul",
      "Puerto Rondón",
      "Saravena",
      "Tame",
    ],
    Atlántico: [
      "Barranquilla",
      "Soledad",
      "Puerto Colombia",
      "Malambo",
      "Sabanalarga",
      "Ponedera",
      "Galapa",
      "Juan de Acosta",
      "Luruaco",
      "Santo Tomás",
      "Campo de la Cruz",
    ],
    Bolívar: [
      "Cartagena",
      "Magangué",
      "Mompox",
      "Turbana",
      "Arjona",
      "Clemencia",
      "María la Baja",
      "San Juan Nepomuceno",
      "Santa Catalina",
      "Villanueva",
      "El Carmen de Bolívar",
    ],
    Boyacá: [
      "Tunja",
      "Duitama",
      "Sogamoso",
      "Chiquinquirá",
      "Páez",
      "Tuta",
      "Oicatá",
      "Ramiriquí",
      "Paipa",
      "Chiquinquirá",
    ],
    Caldas: [
      "Manizales",
      "Chinchiná",
      "Villamaría",
      "La Dorada",
      "Marquetalia",
      "Neira",
      "Palestina",
      "Supía",
      "Victoria",
    ],
    Caquetá: [
      "Florencia",
      "Puerto Rico",
      "San Vicente del Caguán",
      "Solano",
      "La Montañita",
    ],
    Casanare: [
      "Yopal",
      "Aguazul",
      "Hato Corozal",
      "Nunchía",
      "Maní",
      "Tauramena",
      "Sabanalarga",
      "Chámeza",
      "Támara",
    ],
    Cauca: [
      "Popayán",
      "Pasto",
      "Cajibío",
      "Timbío",
      "Piendamó",
      "El Tambo",
      "Patía",
      "La Sierra",
      "Almaguer",
    ],
    Cesar: [
      "Valledupar",
      "Agustín Codazzi",
      "La Jagua de Ibirico",
      "Chimichagua",
      "San Diego",
      "San Martín",
      "Riohacha",
    ],
    Chocó: [
      "Quibdó",
      "Acandí",
      "Bahía Solano",
      "Bojayá",
      "Cértegui",
      "Istmina",
      "Juradó",
    ],
    Córdoba: [
      "Montería",
      "Lorica",
      "Cereté",
      "Planeta Rica",
      "Montelíbano",
      "San Antero",
      "Sahagún",
      "Tierralta",
    ],
    Cundinamarca: [
      "Bogotá",
      "Soacha",
      "Chía",
      "Zipaquirá",
      "Madrid",
      "Facatativá",
      "Fusagasugá",
      "Girardot",
      "Cota",
      "La Calera",
      "Ricaurte",
    ],
    Guainía: ["Inírida", "San José del Guaviare"],
    Guaviare: ["San José del Guaviare", "Calamar", "El Retorno"],
    Huila: [
      "Neiva",
      "Pitalito",
      "La Plata",
      "Campoalegre",
      "Algeciras",
      "Isnos",
      "Timaná",
      "San Agustín",
      "Elías",
    ],
    "La Guajira": [
      "Riohacha",
      "Maicao",
      "Fonseca",
      "Villanueva",
      "San Juan del Cesar",
    ],
    Magdalena: [
      "Santa Marta",
      "Ciénaga",
      "El Retén",
      "Fundación",
      "Aracataca",
      "Pivijay",
      "Zona Bananera",
    ],
    Meta: [
      "Villavicencio",
      "Acacías",
      "Restrepo",
      "Cumaral",
      "Puerto López",
      "San Martín",
      "La Macarena",
      "Mesetas",
    ],
    Nariño: [
      "Pasto",
      "Tumaco",
      "Ipiales",
      "Chachagüí",
      "La Unión",
      "Cumbal",
      "Pupiales",
      "El Peñol",
    ],
    "Norte de Santander": [
      "Cúcuta",
      "Pamplona",
      "Ocaña",
      "Villa del Rosario",
      "La Playa",
      "Los Patios",
      "Salazar de las Palmas",
      "Sardinata",
    ],
    Putumayo: ["Mocoa", "Puerto Asís", "La Dorada", "Orito"],
    Quindío: ["Armenia", "Montenegro", "Quimbaya", "Calarcá", "La Tebaida"],
    Risaralda: [
      "Pereira",
      "Dosquebradas",
      "Santa Rosa de Cabal",
      "La Virginia",
      "Apía",
    ],
    "San Andrés y Providencia": ["San Andrés", "Providencia"],
    Santander: [
      "Bucaramanga",
      "Cúcuta",
      "Girón",
      "Barrancabermeja",
      "Floridablanca",
      "Piedecuesta",
    ],
    Sucre: [
      "Sincelejo",
      "Sampués",
      "Corozal",
      "Morroa",
      "San Onofre",
      "Magangué",
    ],
    Tolima: ["Ibagué", "Espinal", "Honda", "Líbano", "Melgar", "El Espinal"],
    "Valle del Cauca": [
      "Cali",
      "Buenaventura",
      "Palmira",
      "Tuluá",
      "Buga",
      "Yumbo",
      "Cartago",
      "Roldanillo",
    ],
    Vaupés: ["Mitú", "Carurú", "Pacoa"],
    Vichada: ["Puerto Carreño", "Cumaribo", "La Primavera"],
  };

  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    setSupplierInfo({ ...supplierInfo, city: "" }); // Limpiar ciudad al cambiar departamento
  };

  const handleCityChange = (e) => {
    setSupplierInfo({ ...supplierInfo, city: e.target.value });
  };

  // Función para obtener la información del proveedor
  const handleGetSupplierInfo = async () => {
    if (!supplierId) {
      console.error("No se proporcionó un ID de proveedor válido.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("supplier")
        .select("*")
        .eq("id", supplierId)
        .single();

      if (error) {
        console.error("Error al obtener información del proveedor: ", error);
        return;
      } else {
        setSupplierInfo(data);
      }
    } catch (error) {
      console.error("Error al obtener información del proveedor: ", error);
    }
  };

  useEffect(() => {
    if (supplierId) handleGetSupplierInfo();
  }, [supplierId]);

  const newSupplier = {
    name: supplierInfo.name,
    phone_number: supplierInfo.phone_number,
    email: supplierInfo.email,
    address: supplierInfo.address,
    city: supplierInfo.city,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {option !== "info" ? (
        <div className="bg-white rounded-lg w-full max-w-4xl p-8 shadow-lg overflow-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>

          <div className="space-y-6">
            {/* Campos del proveedor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  className="mt-1 p-2 border rounded-md"
                  readOnly={option === "info"}
                  value={supplierInfo.name}
                  onChange={(e) =>
                    setSupplierInfo({ ...supplierInfo, name: capitalizeFirstLetter(e.target.value) })
                  }
                  required={option === "create" || option === "update"}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="phone_number"
                  className="text-sm font-medium text-gray-700"
                >
                  Teléfono
                </label>
                <input
                  name="phone_number"
                  id="phone_number"
                  type="tel"
                  className="mt-1 p-2 border rounded-md"
                  readOnly={option === "info"}
                  value={supplierInfo.phone_number}
                  onChange={(e) =>
                    setSupplierInfo({
                      ...supplierInfo,
                      phone_number: e.target.value,
                    })
                  }
                  required={option === "create" || option === "update"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Correo Electrónico
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  className="mt-1 p-2 border rounded-md"
                  readOnly={option === "info"}
                  value={supplierInfo.email}
                  onChange={(e) =>
                    setSupplierInfo({ ...supplierInfo, email: e.target.value })
                  }
                  required={option === "create" || option === "update"}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Dirección
                </label>
                <input
                  name="address"
                  id="address"
                  type="text"
                  className="mt-1 p-2 border rounded-md"
                  readOnly={option === "info"}
                  value={supplierInfo.address}
                  onChange={(e) =>
                    setSupplierInfo({
                      ...supplierInfo,
                      address: capitalizeFirstLetter(e.target.value),
                    })
                  }
                  required={option === "create" || option === "update"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="department"
                  className="text-sm font-medium text-gray-700"
                >
                  Departamento
                </label>
                <select
                  id="department"
                  name="department"
                  className="mt-1 p-2 border rounded-md"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  disabled={option === "info"}
                  required={option === "create" || option === "update"}
                >
                  <option value="">Seleccione un departamento</option>
                  {Object.keys(departments).map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>

                <label
                  htmlFor="city"
                  className="mt-4 text-sm font-medium text-gray-700"
                >
                  Ciudad
                </label>
                <select
                  id="city"
                  name="city"
                  className="mt-1 p-2 border rounded-md"
                  value={supplierInfo.city}
                  onChange={handleCityChange}
                  disabled={option === "info" || !selectedDepartment}
                  required={option === "create" || option === "update"}
                >
                  <option value="">Seleccione una ciudad</option>
                  {selectedDepartment &&
                    departments[selectedDepartment].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none"
              onClick={onClose}
            >
              Volver
            </button>
            {option === "info" ? null : option === "update" ? (
              <ButtonUpdate
                supplierUpdated={supplierInfo}
                supplierId={supplierId}
                onClose={onClose}
                onUpdate={onUpdate}
              />
            ) : (
              <ButtonCreate
                newSupplier={newSupplier}
                onClose={onClose}
                onUpdate={onUpdate}
              />
            )}
          </div>
        </div>
      ) : (
        // Vista de solo lectura (info)
        <div className="w-[400px] min-h-[350px] bg-white relative rounded-lg shadow-lg p-6 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
            Detalles del proveedor
          </h2>

          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-700">Nombre:</span>
            <span className="text-gray-600">{supplierInfo.name}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-700">Teléfono:</span>
            <span className="text-gray-600">{supplierInfo.phone_number}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-700">Correo:</span>
            <span className="text-gray-600">{supplierInfo.email}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-700 mr-5">Dirección:</span>
            <span className="text-gray-600">{supplierInfo.address}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-700">Ciudad:</span>
            <span className="text-gray-600">{supplierInfo.city}</span>
          </div>

          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none"
              onClick={onClose}
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
