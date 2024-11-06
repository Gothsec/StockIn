// componente ButtonCreate se encarga de gestionar la creación de movimientos de productos
// en un sistema de inventario, específicamente entradas y salidas de productos
// cuenta con sus validacioes y actualizaciones de datos en la base de datos supabase
// dependiendo del tipo de movimiento (entrada o salida)

import { useContext } from "react";
import supabase from "../../utils/supabase";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function ButtonCreate({ newMove, onClose, onUpdate, percentage_used }) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const validateMove = async () => {
    if (
      !newMove.product_id ||
      !newMove.warehouse_id ||
      !newMove.date ||
      !newMove.type ||
      !newMove.quantity ||
      !percentage_used
    ) {
      showNotification("Todos los campos son requeridos.", "error");
      console.log(newMove);
      return false;
    }

    // Validar que el porcentaje de uso sea número no negativo o mayor a 100
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

    if (Number(newMove.quantity) <= 0) {
      showNotification("La cantidad debe ser mayor a 0.", "error");
      return false;
    }

    if (newMove.type === "Salida") {
      const { data: warehouseProduct, error: warehouseProductError } =
        await supabase
          .from("warehouse_product")
          .select("stock")
          .eq("id_warehouse", newMove.warehouse_id)
          .eq("id_product", newMove.product_id)
          .maybeSingle();

      if (warehouseProductError) {
        showNotification(
          "Error al verificar el stock del producto en la bodega.",
          "error"
        );
        console.error(warehouseProductError);
        return false;
      }

      if (Number(newMove.quantity) > Number(warehouseProduct.stock)) {
        showNotification(
          "Se está intentando sacar una cantidad mayor a la que hay almacenada.",
          "error"
        );
        return false;
      }
    }

    return true;
  };

  const handleCreateMove = async () => {
    if (!(await validateMove())) return;

    try {
      const { error: insertError } = await supabase
        .from("move")
        .insert([newMove])
        .maybeSingle();

      if (insertError) {
        showNotification("Error al crear el movimiento", "error");
        console.log(newMove)
        console.error("Error al crear el movimiento: ", insertError);
        return;
      }

      if (newMove.type === "Entrada") {
        await handleEntry();
      } else if (newMove.type === "Salida") {
        await handleExit();
      }

      showNotification("El movimiento fue creado correctamente", "success");
      onClose();
      onUpdate();
    } catch (error) {
      console.error("Error al crear el movimiento: ", error);
      showNotification("Hubo un error al crear el movimiento", "error");
    }
  };

  const handleEntry = async () => {
    const { data: warehouseProduct, error: warehouseProductError } =
      await supabase
        .from("warehouse_product")
        .select("stock")
        .eq("id_warehouse", newMove.warehouse_id)
        .eq("id_product", newMove.product_id)
        .maybeSingle();

    if (warehouseProductError) {
      showNotification("Error al verificar el producto en la bodega.", "error");
      console.error(warehouseProductError);
      return;
    }

    const newStock = warehouseProduct
      ? Number(warehouseProduct.stock) + Number(newMove.quantity)
      : Number(newMove.quantity);

    if (warehouseProduct) {
      await supabase
        .from("warehouse_product")
        .update({ stock: newStock })
        .eq("id_warehouse", newMove.warehouse_id)
        .eq("id_product", newMove.product_id);
    } else {
      await supabase.from("warehouse_product").insert({
        id_warehouse: newMove.warehouse_id,
        id_product: newMove.product_id,
        stock: newStock,
      });
    }

    const { data: product, error: productError } = await supabase
      .from("product")
      .select("quantity")
      .eq("id", newMove.product_id)
      .single();

    if (!productError && product) {
      const updatedStock = Number(product.quantity) + Number(newMove.quantity);
      await supabase
        .from("product")
        .update({ quantity: updatedStock })
        .eq("id", newMove.product_id);
    }

    const { data: warehouse, error: warehouseError } = await supabase
      .from("warehouse")
      .select("percentage_used, cant_actual")
      .eq("id", newMove.warehouse_id)
      .single();

    if (!warehouseError && warehouse) {
      const updatedCantActual =
        Number(warehouse.cant_actual) + Number(newMove.quantity);
      await supabase
        .from("warehouse")
        .update({ percentage_used: percentage_used, cant_actual: updatedCantActual })
        .eq("id", newMove.warehouse_id);
    }
  };

  const handleExit = async () => {
    const { data: warehouseProduct, error: warehouseProductError } =
      await supabase
        .from("warehouse_product")
        .select("stock")
        .eq("id_warehouse", newMove.warehouse_id)
        .eq("id_product", newMove.product_id)
        .maybeSingle();

    if (warehouseProductError) {
      showNotification("Error al verificar el producto en la bodega.", "error");
      console.error(warehouseProductError);
      return;
    }

    const newStock = Number(warehouseProduct.stock) - Number(newMove.quantity);
    await supabase
      .from("warehouse_product")
      .update({ stock: newStock })
      .eq("id_warehouse", newMove.warehouse_id)
      .eq("id_product", newMove.product_id);

    const { data: product, error: productError } = await supabase
      .from("product")
      .select("quantity")
      .eq("id", newMove.product_id)
      .single();

    if (!productError && product) {
      const updatedStock = Number(product.quantity) - Number(newMove.quantity);
      await supabase
        .from("product")
        .update({ quantity: updatedStock })
        .eq("id", newMove.product_id);
    }

    const { data: warehouse, error: warehouseError } = await supabase
      .from("warehouse")
      .select("cant_actual")
      .eq("id", newMove.warehouse_id)
      .single();

    if (!warehouseError && warehouse) {
      const updatedCantActual =
        Number(warehouse.cant_actual) - Number(newMove.quantity);
      await supabase
        .from("warehouse")
        .update({ cant_actual: updatedCantActual })
        .eq("id", newMove.warehouse_id);
    }
  };

  return (
    <button
      className="bg-blue-500 text-white py-1 px-3 rounded-md"
      onClick={handleCreateMove}
    >
      Crear
    </button>
  );
}
