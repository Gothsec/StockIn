import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonUpdate({ moveUpdated, moveId, onClose, onUpdate, percentage_used, quantityMoveOld, typeMoveOld, warehouseMoveOld, productMoveOld}) {
  const { showNotification } = useContext(ConfirmationDataContext);

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

    if (moveUpdated.type === "Salida") {
      const { data: warehouseProduct, error } = await supabase
        .from("warehouse_product")
        .select("stock")
        .eq("id_warehouse", moveUpdated.warehouse_id)
        .eq("id_product", moveUpdated.product_id)
        .maybeSingle();
  
      if (error) {
        showNotification("Error al verificar el stock del producto en la bodega.", "error");
        console.error(error);
        return false;
      }
  
        const oldStock = Number(warehouseProduct.stock) + Number(quantityMoveOld);
  
        if (Number(moveUpdated.quantity) > oldStock) {
          showNotification(
            "Se está intentando sacar una cantidad mayor a la que hay almacenada.",
            "error"
          );
          return false;
        }
      }

    return true;
  };


  const handleUpdateMove = async () => {
    if (!(await validateMove())) return;

    try {
      const { error } = await supabase
        .from("move")
        .update(moveUpdated)
        .eq("id", moveId);

      if (error) {
        console.error("Error: ", error);
        showNotification("Error al actualizar el movimiento", "error");
        return;
      }

      moveUpdated.type === "Entrada" ? await handleEntry() : await handleExit();

      showNotification("Movimiento actualizado correctamente", "success");
      onClose();
      onUpdate();
    } catch (error) {
      console.error("Error: ", error);
      showNotification("Hubo un error al actualizar el movimiento", "error");
    }
  };

  const handleEntry = async () => {
    const { data: warehouseProduct, error: warehouseProductError } =
      await supabase
        .from("warehouse_product")
        .select("stock")
        .eq("id_warehouse", moveUpdated.warehouse_id)
        .eq("id_product", moveUpdated.product_id)
        .maybeSingle();

    if (warehouseProductError) {
      showNotification("Error al verificar el producto en la bodega.", "error");
      console.error(warehouseProductError);
      return;
    }

    const oldStock = Number(warehouseProduct.stock) - Number(quantityMoveOld);

    const newStock = warehouseProduct
      ? oldStock + Number(moveUpdated.quantity)
      : Number(moveUpdated.quantity);

    if (warehouseProduct) {
      await supabase
        .from("warehouse_product")
        .update({ stock: newStock })
        .eq("id_warehouse", moveUpdated.warehouse_id)
        .eq("id_product", moveUpdated.product_id);
        
    } else {
      await supabase.from("warehouse_product").insert({
        id_warehouse: moveUpdated.warehouse_id,
        id_product: moveUpdated.product_id,
        stock: newStock,
      });
    }

    const { data: product, error: productError } = await supabase
      .from("product")
      .select("quantity")
      .eq("id", moveUpdated.product_id)
      .single();

    if (!productError && product) {
      const oldStock = Number(product.quantity) - Number(quantityMoveOld);
      const updatedStock = oldStock + Number(moveUpdated.quantity);
      await supabase
        .from("product")
        .update({ quantity: updatedStock })
        .eq("id", moveUpdated.product_id);
    }

    const { data: warehouse, error: warehouseError } = await supabase
      .from("warehouse")
      .select("cant_actual")
      .eq("id", moveUpdated.warehouse_id)
      .single();

    if (!warehouseError && warehouse) {
      const cant_actual_old = Number(warehouse.cant_actual) - Number(quantityMoveOld);
      const updatedCantActual =
        cant_actual_old + Number(moveUpdated.quantity);
      await supabase
        .from("warehouse")
        .update({ cant_actual: updatedCantActual })
        .eq("id", moveUpdated.warehouse_id);
    }
  };

  const handleExit = async () => {
    const { data: warehouseProduct, error: warehouseProductError } =
      await supabase
        .from("warehouse_product")
        .select("stock")
        .eq("id_warehouse", moveUpdated.warehouse_id)
        .eq("id_product", moveUpdated.product_id)
        .single();

    if (warehouseProductError) {
      showNotification("Error al verificar el producto en la bodega.", "error");
      console.error(warehouseProductError);
      return;
    }

    const oldStock = Number(warehouseProduct.stock) + Number(quantityMoveOld);
    const newStock = oldStock - Number(moveUpdated.quantity);
    await supabase
      .from("warehouse_product")
      .update({ stock: newStock })
      .eq("id_warehouse", moveUpdated.warehouse_id)
      .eq("id_product", moveUpdated.product_id);

    const { data: product, error: productError } = await supabase
      .from("product")
      .select("quantity")
      .eq("id", moveUpdated.product_id)
      .single();

    if (!productError && product) {
      const oldStock = Number(product.quantity) + Number(quantityMoveOld);
      const updatedStock = oldStock - Number(moveUpdated.quantity);
      await supabase
        .from("product")
        .update({ quantity: updatedStock })
        .eq("id", moveUpdated.product_id);

    }

    const { data: warehouse, error: warehouseError } = await supabase
      .from("warehouse")
      .select("cant_actual")
      .eq("id", moveUpdated.warehouse_id)
      .single();

    if (!warehouseError && warehouse) {
      const cant_actual_old = Number(warehouse.cant_actual) + Number(quantityMoveOld);
      const updatedCantActual =
        cant_actual_old - Number(moveUpdated.quantity);
      await supabase
        .from("warehouse")
        .update({ cant_actual: updatedCantActual })
        .eq("id", moveUpdated.warehouse_id);
    }
  };

  return (
    <button
      className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none"
      onClick={handleUpdateMove}
    >
      Modificar
    </button>
  );
}