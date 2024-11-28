// proposito: Nos permite mostrar una tabla de pedidos y gestionar sus acciones

import supabase from "../../utils/supabase";
import { useState } from "react";
import { ModalMove } from "./ModalMove";
import ConfirmationModal from "./ConfirmationModal";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import InfoIcon from "../../assets/InfoIcon";
import EditIcon from "../../assets/EditIcon";
import DeleteIcon from "../../assets/DeleteIcon";

export default function MoveRow({
  name,
  quantity,
  id,
  type,
  className,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [windowsModal, setWindowsModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    moveId: "",
    option: "",
  });

  const abrirCerrarModal = (titleModal, moveId, option) => {
    setModalProps({
      titleModal,
      moveId,
      option,
    });
    setWindowsModal(!windowsModal);
  };

  const reset = (type, stock, cantidad) => {
    if (type === "Entrada") {
      console.log("reseteo:", stock - cantidad);
      return stock - cantidad;
    } else {
      console.log("reseteo:", stock + cantidad);
      return stock + cantidad;
    }
  };

  const resetProduct = async (product, type, cantidad) => {
    const { data: dataProduct, error: errorProduct } = await supabase
      .from("product")
      .select("quantity")
      .eq("id", product)
      .single();

    if (errorProduct) {
      console.error(
        "Error al obtener la cantidad del producto: ",
        errorProduct
      );
      return false;
    } else {
      // actualizamos la cantidad del producto
      let stock = reset(type, Number(dataProduct.quantity), Number(cantidad));
      const { errorUpdateProduct } = await supabase
        .from("product")
        .update({ quantity: stock })
        .eq("id", product);

      if (errorUpdateProduct) {
        console.error(
          "Error al actualizar la cantidad del producto: ",
          errorUpdateProduct
        );
        return false;
      }
    }
    return true;
  };
  const resetWarehouse = async (warehouse, type, cantidad) => {
    const { data: dataWarehouse, error: errorWarehouse } = await supabase
      .from("warehouse")
      .select("cant_actual")
      .eq("id", warehouse)
      .single();

    if (errorWarehouse) {
      console.error(
        "Error al consultar la cantidad actual de la bodega: ",
        errorWarehouse
      );
      return false;
    } else {
      let cant_actual_up = reset(
        type,
        Number(dataWarehouse.cant_actual),
        Number(cantidad)
      );
      const { errorUpdateWarehouse } = await supabase
        .from("warehouse")
        .update({ cant_actual: cant_actual_up })
        .eq("id", warehouse);
      if (errorUpdateWarehouse) {
        console.error(
          "Error al actualizar la cantidad actual de la bodega: ",
          errorUpdateWarehouse
        );
        return false;
      }
    }
    return true;
  };
  const resetWarehouseProduct = async (warehouse, product, type, cantidad) => {
    const { data: dataWarehouseProduct, error: errorWarehouseProduct } =
      await supabase
        .from("warehouse_product")
        .select("stock")
        .eq("id_warehouse", warehouse)
        .eq("id_product", product)
        .single();
    if (errorWarehouseProduct) {
      console.error(
        "Error al consultar la cantidad en stock del producto en la bodega: ",
        errorWarehouseProduct
      );
      return false;
    } else {
      let stock_up = reset(
        type,
        Number(dataWarehouseProduct.stock),
        Number(cantidad),
      );
      const { errorUpdateWarehouseProduct } = await supabase
        .from("warehouse_product")
        .update({ stock: stock_up })
        .eq("id_warehouse", warehouse)
        .eq("id_product", product);
      if (errorUpdateWarehouseProduct) {
        console.error(
          "Error al actualizar la cantidad en stock del producto en la bodega: ",
          errorUpdateWarehouseProduct
        );
        return false;
      }
    }
    return true;
  };

  const handleDelete = async () => {

    const { data, error } = await supabase
      .from("move")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "Error al consultar la información para eliminar el movimiento: ",
        error
      );
      showNotification("Error al eliminar el movimiento", "error");
    } else {
      let product = data.product_id;
      let warehouse = data.warehouse_id;
      let type = data.type;
      let quantity = data.quantity;

      // actualizamos la cantidad del producto
      const isProductReset = await resetProduct(
        Number(product),
        type,
        Number(quantity)
      );
      // actualizamos la cantidad actual de la bodega
      const isWarehouseReset = await resetWarehouse(
        Number(warehouse),
        type,
        Number(quantity)
      );
      // actualizamos la cantidad en stock del producto en la bodega
      const isWarehouseProductReset = await resetWarehouseProduct(
        Number(warehouse),
        Number(product),
        type,
        Number(quantity)
      );
      // eliminamos el movimiento
      if (isProductReset && isWarehouseReset && isWarehouseProductReset) {
        const { error } = await supabase
          .from("move")
          .update({ state: false })          .eq("id", id);
        if (error) {
          console.error("Error al eliminar el pedido:", error.message);
          showNotification("Error al eliminar el pedido", "error");
        } else {
          console.log(isProductReset, isWarehouseReset, isWarehouseProductReset); 
          showNotification(
            "El movimiento ha sido eliminado correctamente",
            "success"
          );
          onUpdate();
        }
      } else {
          console.error("Error al eliminar el pedido - validaciones 3:", error.message);
          showNotification("Error al eliminar el pedido", "error");
      }
    }
  };

  const confirmDelete = () => {
    handleDelete();
    setConfirmModalOpen(false);
  };

  return (
    <>
      <tr className={`${className} text-left border-b`}>
        <td className="p-3">{name}</td>
        <td className="p-3 text-center">{quantity}</td>
        <td className="p-3 text-center">{type}</td>
        <td className="p-3 flex gap-2 justify-end">
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() =>
              abrirCerrarModal("Información movimiento", id, "info")
            }
          >
            <InfoIcon />
          </button>
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() =>
              abrirCerrarModal("Modificar movimiento", id, "update")
            }
          >
            <EditIcon />
          </button>
          <button
            className="text-red-400 px-3 rounded-lg flex items-center hover:text-red-600 transition-all duration-300 ease"
            onClick={() => setConfirmModalOpen(true)}
          >
            <DeleteIcon />
          </button>
        </td>
      </tr>

      {windowsModal && (
        <ModalMove
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          moveId={modalProps.moveId}
          option={modalProps.option}
          onUpdate={onUpdate}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        moveName={name}
      />
    </>
  );
}
