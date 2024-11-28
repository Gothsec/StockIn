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
  let product;
  let quantity;
  let warehouse;

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
    return true;
  };

  const reset = (stock, quantity) => {
    if (changeType) {
      if (moveUpdated.type === "Salida") {
        return stock - quantity;
      } else {
        return stock + quantity;
      }
    } else {
      if (typeMoveOld === "Salida") {
        return stock + quantity;
      } else {
        return stock - quantity;
      }
    }
  };

  const update = (stock, quantity) => {
    if (moveUpdated.type === "Entrada") {
      return stock + quantity;
    } else {
      return stock - quantity;
    }
  };

  const enoughStock = async () => {
    if (productMoveOld !== moveUpdated.product_id) {
      changeProduct = true;
    }
    if (quantityMoveOld !== moveUpdated.quantity) {
      changeQuantity = true;
    }
    if (warehouseMoveOld !== moveUpdated.warehouse_id) {
      changeWarehouse = true;
    }
    if (typeMoveOld !== moveUpdated.type) {
      changeType = true;
    }

    if (changeType) {
      if (moveUpdated.type === "Salida") {
        if (!changeProduct && !changeWarehouse) {
          const { data, error } = await supabase
            .from("warehouse_product")
            .select("stock")
            .eq("id_warehouse", warehouseMoveOld)
            .eq("id_product", productMoveOld)
            .single();

          if (error) {
            console.log("Error al obtener el stock: ", error);
            showNotification("Error al obtener stock.", "error");
            return false;
          }
          const stock = reset(data.stock, quantityMoveOld);
          const quantity = changeQuantity
            ? moveUpdated.quantity
            : quantityMoveOld;
          if (stock < quantity) {
            showNotification(
              "No hay suficiente stock en la bodega para realizar la operación.",
              "error"
            );
            return false;
          }
        }
      }
    }
    return true;
  };

  const changeIndirect = async () => {
    if (changeProduct || changeWarehouse || changeType || changeQuantity) {
      const { data: dataProduct, error: errorProduct } = await supabase
        .from("product")
        .select("quantity")
        .eq("id", productMoveOld)
        .single();

      if (errorProduct) {
        console.log("Error al obtener la cantidad de producto anterior: ", errorProduct);
        showNotification("Error al obtener la cantidad de producto.", "error");
        return false;
      }
      const stockOld = reset(dataProduct.quantity, quantityMoveOld);
      const { errorUpdateProduct } = await supabase
        .from("product")
        .update({ quantity: stockOld })
        .eq("id", productMoveOld);

      if (errorUpdateProduct) {
        console.log("Error al actualizar la cantidad de producto: ", errorUpdateProduct);
        showNotification("Error al actualizar producto.", "error");
        return false;
      }
      return true;
    }
  };

  const updateIndirect = async () => {
    if (changeProduct || changeQuantity || changeWarehouse || changeType) {
      const productUpdate = changeProduct
        ? moveUpdated.product_id
        : productMoveOld;
      const warehouseUpdate = changeWarehouse
        ? moveUpdated.warehouse_id
        : warehouseMoveOld;

      const { data: productActualizar, error: productActualizarError } =
        await supabase
          .from("product")
          .select("quantity")
          .eq("id", productUpdate)
          .single();
      if (productActualizarError) {
        showNotification("Error al obtener la cantidad del producto.", "error");
        return false;
      }
      const quantity = changeQuantity ? moveUpdated.quantity : quantityMoveOld;
      const quantityUpdate = update(
        Number(productActualizar.quantity),
        Number(quantity)
      );

      const { errorUpdateProduct } = await supabase
        .from("product")
        .update({ quantity: quantityUpdate })
        .eq("id", productUpdate);

      if (errorUpdateProduct) {
        console.log("Error al actualizar el producto: ", errorUpdateProduct);
        showNotification("Error al actualizar producto.", "error");
        return false;
      }
    }
    return true;
  };

  const handleUpdateMove = async () => {
    const isMoveValid = await validateMove();
    if (isMoveValid) {
      const isStockValid = await enoughStock();
      if (isStockValid) {
        const isChangeIndirectValid = await changeIndirect();
        if (isChangeIndirectValid) {
          const isUpdateIndirectValid = await updateIndirect();
          if (isUpdateIndirectValid) {
            const { error } = await supabase
              .from("move")
              .update(moveUpdated)
              .eq("id", moveId);

            if (error) {
              console.log("Error al actualizar movimiento: ", error);
              showNotification("Error al actualizar movimiento.", "error");
              return;
            }
            showNotification("Movimiento actualizado correctamente.", "success");
            onUpdate?.();
            onClose?.();
          }
        }
      }
    }
  };

  return (
    <button 
    className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none"
    onClick={handleUpdateMove}>
      Modificar
    </button>
  );
}
