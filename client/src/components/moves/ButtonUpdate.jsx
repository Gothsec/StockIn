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
  let changeType = false;
  let productChange = 0;
  let quantityChange = 0;
  let warehouseChange = 0;
  let typeChange = "";
  let productUpdate = 0;
  let quantityUpdate = 0;
  let warehouseUpdate = 0;
  let typeUpdate = "";

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
      productChange = productMoveOld;
      productUpdate = moveUpdated.id_product;
    } else {
      changeProduct = false;
      productChange = productMoveOld;
      productUpdate = productMoveOld;
    }
    if (quantityMoveOld != moveUpdated.quantity) {
      changeQuantity = true;
      quantityChange = quantityMoveOld;
      quantityUpdate = moveUpdated.quantity;
    } else {
      changeQuantity = false;
      quantityChange = quantityMoveOld;
      quantityUpdate = quantityMoveOld;
    }
    if (warehouseMoveOld != moveUpdated.id_warehouse) {
      changeWarehouse = true;
      warehouseChange = warehouseMoveOld;
      warehouseUpdate = moveUpdated.id_warehouse;
    } else {
      changeWarehouse = false;
      warehouseChange = warehouseMoveOld;
      warehouseUpdate = warehouseMoveOld;
    }
    if (typeMoveOld != moveUpdated.type) {
      changeType = true;
      typeChange = typeMoveOld;
      typeUpdate = moveUpdated.type;
    } else {
      changeType = false;
      typeChange = typeMoveOld;
      typeUpdate = typeMoveOld;
    }
  };

  const reset = (stock, quantity, changeType, typeUpdate) => {
    if (changeType) {
      if (typeUpdate == "Entrada") {
        return stock + quantity;
      } else {
        return stock - quantity;
      }
    } else {
      if (typeUpdate == "Entrada") {
        return stock - quantity;
      } else {
        return stock + quantity;
      }
    }
  }
  
  const update = (stock, quantity, typeUpdate) => {
    if(typeUpdate == "Entrada") {
      return stock + quantity;
    } else {
      return stock - quantity;
    }
  }

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
