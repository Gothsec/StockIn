import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonUpdate({ moveUpdated, moveId, onClose, onUpdate }) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const validateMove = async () => {
    if (
      !moveUpdated.product_id ||
      !moveUpdated.warehouse_id ||
      !moveUpdated.date ||
      !moveUpdated.type ||
      !moveUpdated.quantity
    ) {
      showNotification("Todos los campos son requeridos.", "error");
      console.log(moveUpdated);
      return false;
    }

    if (Number(moveUpdated.quantity) <= 0) {
      showNotification("La cantidad debe ser mayor a 0.", "error");
      return false;
    }

    if (moveUpdated.type === "Entrada") {
      const { data: warehouse, error: warehouseError } = await supabase
        .from("warehouse")
        .select("cant_max_product, cant_actual, name")
        .eq("id", moveUpdated.warehouse_id)
        .maybeSingle();

      if (warehouseError) {
        showNotification("Error al verificar la capacidad de la bodega.", "error");
        console.error(warehouseError);
        return false;
      }

      const newCantActual =
        Number(warehouse.cant_actual) + Number(moveUpdated.quantity);
      if (newCantActual > Number(warehouse.cant_max_product)) {
        showNotification(
          `La bodega ${warehouse.name} no puede recibir esta cantidad, ya que sobrepasa su capacidad máxima.`,
          "error"
        );
        return false;
      }
    }

    if (moveUpdated.type === "Salida") {
      const { data: warehouseProduct, error: warehouseProductError } =
        await supabase
          .from("warehouse_product")
          .select("stock")
          .eq("id_warehouse", moveUpdated.warehouse_id)
          .eq("id_product", moveUpdated.product_id)
          .maybeSingle();

      if (warehouseProductError) {
        showNotification("Error al verificar el stock del producto en la bodega.", "error");
        console.error(warehouseProductError);
        return false;
      }

      if (Number(moveUpdated.quantity) > Number(warehouseProduct.stock)) {
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
        console.log(moveUpdated)
        console.log(moveId)
        showNotification("Error al actualizar el movimiento", "error");
        return;
      }

      if (moveUpdated.type === "Entrada") {
        await handleEntry();
      } else if (moveUpdated.type === "Salida") {
        await handleExit();
      }

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

    const newStock = warehouseProduct
      ? Number(warehouseProduct.stock) + Number(moveUpdated.quantity)
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
      const updatedStock = Number(product.quantity) + Number(moveUpdated.quantity);
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
      const updatedCantActual =
        Number(warehouse.cant_actual) + Number(moveUpdated.quantity);
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
        .maybeSingle();

    if (warehouseProductError) {
      showNotification("Error al verificar el producto en la bodega.", "error");
      console.error(warehouseProductError);
      return;
    }

    const newStock = Number(warehouseProduct.stock) - Number(moveUpdated.quantity);
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
      const updatedStock = Number(product.quantity) - Number(moveUpdated.quantity);
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
      const updatedCantActual =
        Number(warehouse.cant_actual) - Number(moveUpdated.quantity);
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
