import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonUpdate({
  moveUpdated,
  moveId,
  onClose,
  onUpdate,
  percentage_used,
  quantityMoveOld,
  typeMoveOld,
  warehouseMoveOld,
  productMoveOld,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);
  let changeProduct = false;
  let changeQuantity = false;
  let changeWarehouse = false;

  const validateMove = async () => {
    if (
      !moveUpdated.product_id ||
      !moveUpdated.warehouse_id ||
      !moveUpdated.date ||
      !moveUpdated.type ||
      !moveUpdated.quantity ||
      !percentage_used
    ) {
      showNotification("Todos los campos son requeridos.", "error");
      console.log(moveUpdated);
      return false;
    }

    if (Number(moveUpdated.quantity) <= 0) {
      showNotification("La cantidad debe ser mayor a 0.", "error");
      return false;
    }

    if (percentage_used < 0) {
      showNotification(
        "El porcentaje de uso debe ser mayor o igual a 0.",
        "error"
      );
      return false;
    }

    if (percentage_used > 100) {
      showNotification(
        "El porcentaje de uso debe ser menor o igual a 100.",
        "error"
      );
      return false;
    }

    if (productMoveOld != moveUpdated.id_product) {
      changeProduct = true;
    }
    if (quantityMoveOld != moveUpdated.quantity) {
      changeQuantity = true;
    }
    if (warehouseMoveOld != moveUpdated.id_warehouse) {
      changeWarehouse = true;
    }

  };

  const handleUpdateMove = async () => {};

  return (
    <button
      className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none"
      onClick={handleUpdateMove}
    >
      Modificar
    </button>
  );
}
