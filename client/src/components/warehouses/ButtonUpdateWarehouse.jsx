import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonUpdate({ moveUpdated, moveId, onClose, onUpdate }) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const validateMove = async () => {
    const requiredFields = ['product_id', 'warehouse_id', 'date', 'type', 'quantity'];
    for (const field of requiredFields) {
      if (!moveUpdated[field]) {
        showNotification("Todos los campos son requeridos.", "error");
        return false;
      }
    }

    if (Number(moveUpdated.quantity) <= 0) {
      showNotification("La cantidad debe ser mayor a 0.", "error");
      return false;
    }

    const warehouse = await getWarehouse(moveUpdated.warehouse_id);
    if (!warehouse) return false;

    if (moveUpdated.type === "Entrada") {
      return validateEntryMove(warehouse);
    } else if (moveUpdated.type === "Salida") {
      return validateExitMove(warehouse);
    }

    return true;
  };

  const getWarehouse = async (warehouseId) => {
    const { data: warehouse, error } = await supabase
      .from("warehouse")
      .select("cant_actual, name, percentage_used") // Solo campos necesarios
      .eq("id", warehouseId)

    if (error) {
      showNotification("Error al verificar la bodega.", "error");
      console.error(error);
      return null;
    }

    return warehouse;
  };

  const validateEntryMove = async (warehouse) => {
    const newCantActual = Number(warehouse.cant_actual) + Number(moveUpdated.quantity);

    // Verificar el porcentaje usado
    if (warehouse.percentage_used >= 100) {
      showNotification(`La bodega ${warehouse.name} está llena. No se pueden realizar más entradas.`, "error");
      return false;
    }

    return true;
  };

  const validateExitMove = async (warehouse) => {
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

    if (Number(moveUpdated.quantity) > Number(warehouseProduct?.stock || 0)) {
      showNotification("Se está intentando sacar una cantidad mayor a la que hay almacenada.", "error");
      return false;
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
