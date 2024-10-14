import React, { useContext } from 'react';
import {ConfirmationDataContext} from "../contexts/ConfirmationData"

function MessageConfirmation() {
    const { notification } = useContext(ConfirmationDataContext);
  
    if (!notification.message) return null; // No mostrar si no hay mensaje
  
    return (
      <div
        className={`mt-2 p-2 rounded text-white ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {notification.message}
      </div>
    );
  }
  
  export default MessageConfirmation;