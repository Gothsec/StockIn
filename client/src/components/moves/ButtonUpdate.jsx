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

  const enoughStock = async () => {
    if (productMoveOld != moveUpdated.product_id) {
      changeProduct = true;
    }
    if (quantityMoveOld != moveUpdated.quantity) {
      changeQuantity = true;
    }
    if (warehouseMoveOld != moveUpdated.warehouse_id) {
      changeWarehouse = true;
    }
    if (typeMoveOld != moveUpdated.type) {
      changeType = true;
    }

    // verificar si hubo cambio en el tipo de movimiento
    if (changeType) {
      // sabemos que hubo cambio en el tipo de movimiento, ahora nos interesa saber si tipo movimiento actual es Salida
      if (moveUpdated.type == "Salida") {
        // ahora sabemos que el tipo actual es Salida, por lo que debemos primero verificar si el producto y la bodega cambian
        if (!changeProduct && !changeWarehouse) {
          // ahora sabemos que tendremos que restablecer el stock primero de ese producto anterior en la bodega anterior, antes de verificar el stock actual
          const { data, error } = await supabase
            .from("warehouse_product")
            .select("stock")
            .eq("id_warehouse", warehouseMoveOld)
            .eq("id_product", productMoveOld)
            .single();

          if (error) {
            console.log(
              "Error al obtener el stock en la verificación de stock suficiente (P y W no change, type change) : ",
              error
            );
            showNotification(
              "Error al obtener stock en la verificación de stock suficiente. ",
              "error"
            );
            return false;
          }
          // restablecer el stock anterior
          const stock = reset(data.stock, quantityMoveOld);
          // verificar el stock actual
          let quantity = changeQuantity
            ? moveUpdated.quantity
            : quantityMoveOld;
          if (stock < quantity) {
            showNotification(
              "No hay suficiente stock en la bodega para realizar la operación.",
              "error"
            );
            return false;
          }
          return true;
        }
      }
    } else {
      // sabemos que el tipo de movimiento no cambió, ahora nos interesa saber si el producto y la bodega no cambiaron y si cantidad cambió
      if (!changeProduct && !changeWarehouse && changeQuantity) {
        if (typeMoveOld == "Salida") {
          // ahora sabemos que tendremos que restablecer el stock primero de ese producto anterior en la bodega anterior, antes de verificar el stock actual
          const { data, error } = await supabase
            .from("warehouse_product")
            .select("stock")
            .eq("id_warehouse", warehouseMoveOld)
            .eq("id_product", productMoveOld)
            .single();

          if (error) {
            console.log(
              "Error al obtener el stock en la verificación de stock suficiente (P y W no change, type no change) : ",
              error
            );
            showNotification(
              "Error al obtener stock en la verificación de stock suficiente. ",
              "error"
            );
            return false;
          }

          // restableciendo el stock anterior
          const stock = reset(data.stock, quantityMoveOld);
          // verificando el stock actual
          if (stock < moveUpdated.quantity) {
            showNotification(
              "No hay suficiente stock en la bodega para realizar la operación.",
              "error"
            );
            return false;
          }
          return true;
        }
      }
    }

    if (changeProduct || changeWarehouse) {
      if (changeType) {
        if (moveUpdated.type == "Salida") {
          product = changeProduct ? moveUpdated.product_id : productMoveOld;
          quantity = changeQuantity ? moveUpdated.quantity : quantityMoveOld;
          warehouse = changeWarehouse
            ? moveUpdated.warehouse_id
            : warehouseMoveOld;

          const { data, error } = await supabase
            .from("warehouse_product")
            .select("stock")
            .eq("id_warehouse", warehouse)
            .eq("id_product", product)
            .single();

          if (error) {
            console.log(
              "Error al obtener el stock en la verificación de stock suficiente (type change otros) : ",
              error
            );
            showNotification(
              "Error al obtener stock en la verificación de stock suficiente. ",
              "error"
            );
            return false;
          }
          // verificando el stock
          if (data.stock < quantity) {
            showNotification(
              "No hay suficiente stock en la bodega para realizar la operación.",
              "error"
            );
            return false;
          }
          return true;
        }
      } else {
        if (typeMoveOld == "Salida") {
          product = changeProduct ? moveUpdated.product_id : productMoveOld;
          quantity = changeQuantity ? moveUpdated.quantity : quantityMoveOld;
          warehouse = changeWarehouse
            ? moveUpdated.warehouse_id
            : warehouseMoveOld;

          const { data, error } = await supabase
            .from("warehouse_product")
            .select("stock")
            .eq("id_warehouse", warehouse)
            .eq("id_product", product)
            .single();

          if (error) {
            console.log(
              "Error al obtener el stock en la verificación de stock suficiente (no change type otros): ",
              error
            );
            showNotification(
              "Error al obtener stock en la verificación de stock suficiente. ",
              "error"
            );
            return false;
          }
          // verificando el stock
          if (data.stock < quantity) {
            showNotification(
              "No hay suficiente stock en la bodega para realizar la operación.",
              "error"
            );
            return false;
          }
          return true;
        }
      }
    }
    return true;
  };

  const changeIndirect = async () => {
    if (changeProduct || changeWarehouse || changeType || changeQuantity) {
      // tenemos que restablecer la cantidad de producto anterior?
      const { data: dataProduct, error: errorProduct } = await supabase
        .from("product")
        .select("quantity")
        .eq("id", productMoveOld)
        .single();

      if (errorProduct) {
        console.log(
          "Error al obtener la cantidad de producto anterior (changeIndirect - product) : ",
          errorProduct
        );
        showNotification(
          "Error al obtener la cantidad de producto anterior. ",
          "error"
        );
        return false;
      }
      // restablecer la cantidad anterior
      const stockOld = reset(dataProduct.quantity, quantityMoveOld);

      const { errorUpdateProduct } = await supabase
        .from("product")
        .update({ quantity: stockOld })
        .eq("id", productMoveOld);

      if (errorUpdateProduct) {
        console.log(
          "Error al actualizar la cantidad de producto anterior (changeIndirect - product) : ",
          errorUpdateProduct
        );
        showNotification(
          "Error al actualizar la cantidad de producto anterior. ",
          "error"
        );
        return false;
      }

      // Restableciendo bodega anterior?

      const { data: dataWarehouse, error: errorWarehouse } = await supabase
        .from("warehouse")
        .select("cant_actual")
        .eq("id", warehouseMoveOld)
        .single();

      if (errorWarehouse) {
        console.log(
          "Error al obtener el stock de la bodega anterior (changeIndirect - warehouse) : ",
          errorWarehouse
        );
        showNotification(
          "Error al obtener el stock de la bodega anterior. ",
          "error"
        );
        return false;
      }
      // restablecer la canttidad actual
      const cant_actual_old = reset(dataWarehouse.cant_actual, quantityMoveOld);

      const { errorUpdateWarehouse } = await supabase
        .from("warehouse")
        .update({ cant_actual: cant_actual_old })
        .eq("id", warehouseMoveOld);

      if (errorUpdateWarehouse) {
        console.log(
          "Error al actualizar el stock de la bodega anterior (changeIndirect - warehouse) : ",
          errorUpdateWarehouse
        );
        showNotification(
          "Error al actualizar el stock de la bodega anterior. ",
          "error"
        );
        return false;
      }

      // Modificando Warehouse
      const { data: dataWarehouseProduct, error: errorWarehouseProduct } =
        await supabase
          .from("warehouse_product")
          .select("stock")
          .eq("id_warehouse", warehouseMoveOld)
          .eq("id_product", productMoveOld)
          .single();

      if (errorWarehouseProduct) {
        console.log(
          "Error al obtener el stock en la verificación de stock suficiente (changeIndirect - warehouse_product) : ",
          errorWarehouseProduct
        );
        showNotification(
          "Error al obtener stock en la verificación de stock suficiente. ",
          "error"
        );
        return false;
      }
      // restablecer el stock anterior
      const stock = reset(dataWarehouseProduct.stock, quantityMoveOld);

      const { errorUpdateWarehouseProduct } = await supabase
        .from("warehouse_product")
        .update({ stock: stock })
        .eq("id_warehouse", warehouseMoveOld)
        .eq("id_product", productMoveOld);

      if (errorUpdateWarehouseProduct) {
        console.log(
          "Error al actualizar el stock en la verificación de stock suficiente (changeIndirect - warehouse_product) : ",
          errorUpdateWarehouseProduct
        );
        showNotification(
          "Error al actualizar stock en la verificación de stock suficiente. ",
          "error"
        );
        return false;
      }
      return true;
    }
  };

  const updateIndirect = async () => {
    if (changeProduct || changeQuantity || changeWarehouse || changeType) {
      // conociendo los valores de los campos que cambiaron
      const productUpdate = changeProduct
        ? moveUpdated.product_id
        : productMoveOld;
      const warehouseUpdate = changeWarehouse
        ? moveUpdated.warehouse_id
        : warehouseMoveOld;
      // obteniendo la cantidad del producto para actulizarlo
      const { data: productActualizar, error: productActualizarError } =
        await supabase
          .from("product")
          .select("quantity")
          .eq("id", productUpdate)
          .single();
      if (productActualizarError) {
        showNotification(
          "Error al obtener la cantidad del producto. ",
          "error"
        );
        console.log(
          "Error al obtener la cantidad del producto antes de actualizarlo. ",
          error
        );
        return false;
      }
      // verificamos si cantidad cambio
      const quantity = changeQuantity ? moveUpdated.quantity : quantityMoveOld;

      // Actualizamos la cantidad del producto
      const quantityUpdate = update(
        Number(productActualizar.quantity),
        Number(quantity)
      );
      // Actualizamos la tabla product
      const { errorUpdateProduct } = await supabase
        .from("product")
        .update({ quantity: quantityUpdate })
        .eq("id", productUpdate);

      if (errorUpdateProduct) {
        console.log(
          "Error al actualizar la cantidad del producto. ",
          errorUpdateProduct
        );
        showNotification(
          "Error al actualizar la cantidad del producto. ",
          "error"
        );
        return false;
      }

      const { data: warehouseActulizar, error: warehouseActualizarError } =
        await supabase
          .from("warehouse")
          .select("cant_actual")
          .eq("id", warehouseUpdate)
          .single();

      if (warehouseActualizarError) {
        console.log(
          "Error al obtener la cantidad actual de la bodega antes de actualizarla : ",
          warehouseActualizarError
        );
        showNotification(
          "Error al obtener la cantidad actual de la bodega antes de actualizarla. ",
          "error"
        );
        return false;
      }
      // verificamos la cantidad en la que se va a actualizar la cantidad actual
      const quantityWarehouse = changeQuantity
        ? moveUpdated.quantity
        : quantityMoveOld;
      // actualizamos la cantidad actual
      const cantActualUp = update(
        Number(warehouseActulizar.cant_actual),
        Number(quantityWarehouse)
      );
      // actualizamos la tabla bodega
      const { errorUpdateWarehouse } = await supabase
        .from("warehouse")
        .update({ cant_actual: cantActualUp })
        .eq("id", warehouseUpdate);

      if (errorUpdateWarehouse) {
        console.log(
          "Error al actualizar la cantidad actual de la bodega : ",
          errorUpdateWarehouse
        );
        showNotification(
          "Error al actualizar la cantidad actual de la bodega. ",
          "error"
        );
        return false;
      }
    }

    const productUpdate = changeProduct
        ? moveUpdated.product_id
        : productMoveOld;
      const warehouseUpdate = changeWarehouse
        ? moveUpdated.warehouse_id
        : warehouseMoveOld;
    const { data, error } = await supabase
      .from("warehouse_product")
      .select("stock")
      .eq("id_warehouse", warehouseUpdate)
      .eq("id_product", productUpdate)
      .maybeSingle();
    if (error) {
      console.log(
        "Error al obtener el stock del producto en la bodega antes de actualizarlo: ",
        error
      );
      showNotification(
        "Error al obtener el stock del producto en la bodega antes de actualizarlo. ",
        "error"
      );
      return false;
    }
    if (data) {
      // Verificamos si quantity cambio
      const quantity = changeQuantity ? moveUpdated.quantity : quantityMoveOld;
      // Actualizamos el stock
      const stockUp = update(Number(data.stock), Number(quantity));
      // Actualizamos la tabla product
      const { errorUpdate } = await supabase
        .from("warehouse_product")
        .update({ stock: stockUp })
        .eq("id_warehouse", warehouseUpdate)
        .eq("id_product", productUpdate);

      if (errorUpdate) {
        console.log(
          "Error al actualizar el stock del producto en la bodega: ",
          errorUpdate
        );
        showNotification(
          "Error al actualizar el stock del producto en la bodega. ",
          "error"
        );
        return false;
      }
      return true;
    } else {
      // Verificamos si quantity cambio
      const quantity = changeQuantity ? moveUpdated.quantity : quantityMoveOld;
      // Insertamos el producto en la bodega por primera vez
      const { errorInsert } = await supabase.from("warehouse_product").insert([
        {
          id_warehouse: warehouseUpdate,
          id_product: productUpdate,
          stock: quantity,
        },
      ]);

      if (errorInsert) {
        console.log(
          "Error al insertar el stock del producto en la bodega: ",
          errorInsert
        );
        showNotification(
          "Error al insertar el stock del producto en la bodega. ",
          "error"
        );
        return false;
      }
      return true;
    }
  };

  const reset = (stock, quantity) => {
    if (changeType) {
      if (moveUpdated.type == "Salida") {
        return stock - quantity;
      } else {
        return stock + quantity;
      }
    } else {
      if (typeMoveOld == "Salida") {
        return stock + quantity;
      } else {
        return stock - quantity;
      }
    }
  };

  const update = (stock, quantity) => {
    if (moveUpdated.type == "Entrada") {
      return stock + quantity;
    } else {
      return stock - quantity;
    }
  };

  const handleUpdateMove = async () => {
    const validateMoveValid = await validateMove();

    if (validateMoveValid) {
      const enoughStockValid = await enoughStock();
      if (enoughStockValid){
        const changeIndirectValid = await changeIndirect();
        if (changeIndirectValid){
          const updateIndirectValid = await updateIndirect();
          if (updateIndirectValid){
            const {error} = await supabase
              .from("move")
              .update(moveUpdated)
              .eq("id", moveId);

              onClose();
              onUpdate();
            if (error) {
              console.log("Error al actualizar el movimiento: ", error);
              showNotification("Error al actualizar el movimiento. ", "error");
            } else {
              showNotification("Movimiento actualizado con éxito.", "success");
            }
          }
        }
      }
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
