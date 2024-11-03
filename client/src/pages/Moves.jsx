// proposito: Nos permite mostrar y gestionar los movimientos del stock

import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import MessageConfirmation from "../components/MessageConfirmation";
import AddIcon from "../assets/AddIcon";
import MoveRow from "../components/moves/MoveRow";
import { ModalMove } from "../components/moves/ModalMove";

export default function MovesPage() {
  const [moves, setMoves] = useState([]);
  const [searchMove, setSearchMove] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
    MoveId: "",
    option: "",
  });
  const [windowsModal, setWindowsModal] = useState(false);
  const [error, setError] = useState(null);
  const tipos = ["Entrada", "Salida"];

  const abrirCerrarModal = (
    titleModal,
    buttonText,
    onClickFunction,
    MoveId = "",
    option = ""
  ) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
      MoveId: MoveId,
      option,
    });
    setWindowsModal((prev) => !prev);
  };

  const fetchMoves = async () => {
    const { data, error } = await supabase
      .from("move")
      .select(
        `
        id, 
        quantity,
        type,
        product:product_id(name)  -- JOIN con la tabla product para obtener el nombre
      `
      )
      .eq("state", true);

    if (error) {
      console.error("Error fetching moves: ", error);
      setError("Error al cargar los movimientos.");
      setMoves([]);
    } else {
      setMoves(data || []);
      setError(null);
    }
  };

  useEffect(() => {
    fetchMoves();
  }, []);

  const filteredMoves = moves.filter((moves) => {
    if (!moves.product?.name) return false;
    return (
      (selectedType === "" || moves.type === selectedType) &&
      (searchMove === "" ||
        moves.product.name.toLowerCase().includes(searchMove.toLowerCase()))
    );
  });

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <header className="pb-8">
          <h1 className="font-bold text-4xl">Movimientos</h1>
          <div className="flex items-center mt-4">
            <select
              className="w-52 border border-gray-400 rounded-lg h-9 px-2 mr-4"
              onChange={(e) => setSelectedType(e.target.value)}
              value={selectedType}
            >
              <option value="">Todos los tipos</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <input
              className="flex-grow border border-gray-400 h-9 rounded-lg pl-3"
              type="search"
              placeholder="Buscar moviemiento"
              onChange={(e) => setSearchMove(e.target.value)}
            />
            <button
              className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg w-48 h-9 ml-4 hover:bg-blue-700 transition-all duration-300 ease"
              onClick={() => abrirCerrarModal("Nuevo Movimiento", "", "create")}
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
                <th className="py-2 text-left px-4">Nombre Producto</th>
                <th className="py-2 text-left px-2">Cantidad</th>
                <th className="py-2 text-center px-4">Tipo</th>
                <th className="py-2 text-left px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredMoves.map((move, index) => (
                <MoveRow
                key={move.id}
                id={move.id}
                name={move.product.name}
                quantity={move.quantity}
                type={move.type}
                className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                onUpdate={fetchMoves}
              />))}
            </tbody>
          </table>
        </div>
      </div>

      {windowsModal && (
        <ModalMove
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          moveId={modalProps.MoveId}
          option={modalProps.option}
          onUpdate={fetchMoves}
        />
      )}
    </div>
  );
}
