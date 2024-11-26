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
      if (moveUpdated.type == "Salida")  {
        // ahora sabemos que el tipo actual es Salida, por lo que debemos primero verificar si el producto y la bodega cambian
        if (!changeProduct && !changeWarehouse) {
          // ahora sabemos que tendremos que restablecer el stock primero de ese producto anterior en la bodega anterior, antes de verificar el stock actual
          const {data, error} = await supabase
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
          let quantity = changeQuantity ? moveUpdated.quantity : quantityMoveOld;
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
          const {data, error} = await supabase
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
          warehouse = changeWarehouse ? moveUpdated.warehouse_id : warehouseMoveOld;

          const {data, error} = await supabase
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
          warehouse = changeWarehouse ? moveUpdated.warehouse_id : warehouseMoveOld;

          const {data, error} = await supabase
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
  }

  const changeIndirect = async () => {
    if (changeProduct || changeWarehouse || changeType  || changeQuantity ) { 

      // tenemos que restablecer la cantidad de producto anterior?
        const {data: dataProduct, error: errorProduct} = await supabase
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

        const {errorUpdateProduct} = await supabase
          .from("product")
          .update({quantity: stockOld})
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

        const {data: dataWarehouse, error: errorWarehouse} = await supabase
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

        const {errorUpdateWarehouse} = await supabase
          .from("warehouse")
          .update({cant_actual: cant_actual_old})
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
      const {data: dataWarehouseProduct, error: errorWarehouseProduct} = await supabase
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

      const {errorUpdateWarehouseProduct} = await supabase
        .from("warehouse_product")
        .update({stock: stock})
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
  }

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
  }
  
  const update = (stock, quantity) => {
    if(moveUpdated.type == "Entrada") {
      return stock + quantity;
    } else {
      return stock - quantity;
    }
  }

  const handleUpdateMove = async () => {
    const enoughStockValid = await enoughStock();
    const validateMoveValid = await validateMove();
    const changeIndirectValid = await changeIndirect();
    
    if (enoughStockValid && validateMoveValid && changeIndirectValid) {
      showNotification("Pasaron las validaciones.", "success");
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
