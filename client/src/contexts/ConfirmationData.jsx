// Proposito: Nos permite crear un contexto para gestionar las notificaciones de confirmación en cualquier componente

import { createContext, useState } from "react";

export const ConfirmationDataContext = createContext();

export const ConfirmationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type) => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  return (
    <ConfirmationDataContext.Provider
      value={{ notification, showNotification }}
    >
      {children}
    </ConfirmationDataContext.Provider>
  );
};
