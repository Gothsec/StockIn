import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";

function ModalWindows({
  open,
  onClose,
  titleModal,
  buttonText,
  onClickFunction,
  orderInfo,
  orderId,
}) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState("true");
  const [productId, setProductId] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    if (orderInfo) {
      setDescription(orderInfo.description || "");
      setQuantity(orderInfo.quantity?.toString() || "");
      setContent(orderInfo.content?.toString() || "");
      setState(orderInfo.state || "true");
      setProductId(orderInfo.productId || "");
    } else {
      deleteInputs();
    }
  }, [orderInfo]);

  const deleteInputs = () => {
    setDescription("");
    setQuantity("");
    setContent("");
    setState("true");
    setProductId("");
    setErrorMessages([]);
  };

  const validateForm = () => {
    let errors = [];

    if (!quantity) errors.push("La cantidad inicial es requerida.");
    if (!content) errors.push("El contenido es requerido.");

    if (Number(quantity) < 0) errors.push("La cantidad inicial no puede ser negativa.");
    if (Number(content) < 0) errors.push("El contenido no puede ser negativo.");

    return errors;
  };

  const handleBtnCancel = () => {
    deleteInputs();
    onClose();
  };

  const handleUpdateOrder = async (e) => {
    if (e) e.preventDefault();

    const validationErrors = validateForm();
    setErrorMessages(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    const newOrder = {
      description: description,
      quantity: parseFloat(quantity),
      content: parseFloat(content),
      state: state,
      productId: productId,
    };

    const { data, error } = await supabase
      .from("order")
      .update(newOrder)
      .eq("id", orderId);

    if (error) {
      console.error("Error: ", error);
    } else {
      if (data) {
        deleteInputs();
        onClickFunction();
        onClose();
      }
      onClose();
    }
  };

  const handleAddOrder = async (e) => {
    if (e) e.preventDefault();

    const validationErrors = validateForm();
    setErrorMessages(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    const newOrder = {
      description: description,
      quantity: parseFloat(quantity),
      content: parseFloat(content),
      state: state,
      productId: productId,
    };

    const { data, error } = await supabase
      .from("product")
      .insert(newOrder)
      .single();

    if (error) {
      console.error("Error: ", error);
    } else {
      if (data) {
        deleteInputs();
        onClickFunction();
        onClose();
      }
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 p-10 flex items-center justify-center">
      <div className="w-[800px] min-h-[100px] bg-white relative rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-bold mb-4">{titleModal}</h1>

        {errorMessages.length > 0 && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <ul>
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Descripcion</label>
            <input
              name="descripcion"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              readOnly={buttonText === "Mostrar"}
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              name="cantidad"
              type="number"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              readOnly={buttonText === "Mostrar"}
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Contenido</label>
            <input
              name="contenido"
              type="string"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              readOnly={buttonText === "Mostrar"}
            />
          </div>
          {/* Agregar más campos si es necesario */}
        </div>
        <div className="flex justify-end mt-4">
          <button className="mr-2 p-2 bg-gray-300 rounded" onClick={handleBtnCancel}>
            Cancelar
          </button>
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={buttonText === "Modificar" ? handleUpdateOrder : handleAddOrder}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalWindows;
