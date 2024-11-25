// Proposito: Nos permite mostrar y gestionar las notificaciones de confirmación de cada acción del usuario

import { useContext } from "react";
import { ConfirmationDataContext } from "../contexts/ConfirmationData";

function MessageConfirmation() {
  const { notification } = useContext(ConfirmationDataContext);

  if (!notification.message) return null;

  return (
    <div
      className={`fixed top-10 right-10 p-4 rounded-md text-white ${
        notification.type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
      style={{
        zIndex: 9999,  // Aseguramos que esté por encima del modal
        position: "absolute",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {notification.message}
    </div>
  );
}

export default MessageConfirmation;
