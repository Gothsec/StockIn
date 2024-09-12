import React from 'react';
import { useState } from "react";


function ModalWidows({open, onClose, titleModal, buttonText, onClickFunction }) {
  const [stock, setStock] = useState("");
  const [precioPublico, setPrecioPublico] = useState("");
  const [precioCosto, setPrecioCosto] = useState("");

  const calcularGanancia = () => {
    return precioCosto - precioPublico;
  }

  if (!open) return null;

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 p-10 flex items-center justify-center">
      <div className="w-[600px] min-h-[100px] bg-white relative rounded-lg shadow-lg p-5">
        <h1 className="text-xl font-bold mb-4"> {titleModal} </h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="my-4 col-span-3">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded" required/>
          </div>
          <div className="my-4 col-span-2">
            <label className="block text-sm font-medium text-gray-700">Código</label>
            <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded" required/>
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Cantidad inicial</label>
            <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded" 
            value={stock} 
            onChange={(e) => setStock(e.target.value)} // Actualizar el valor
            required
            />
          </div>
          
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Precio costo</label>
            <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded" 
            value={precioCosto}
            onChange={(e) => setPrecioCosto(e.target.value)}
            required
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Precio público</label>
            <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded"
            value={precioPublico}
            onChange={(e) => setPrecioPublico(e.target.value)}
            required
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select className="w-full mt-1 p-2 border border-gray-300 rounded">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="my-4 col-span-2">
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded" required/>
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Cantidad mínima</label>
            <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded" required/>
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Marca</label>
            <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded" required/>
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Bodega</label>
            <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded" />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Proveedor</label>
            <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded" />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Ganancia</label>
            <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded" 
            value={calcularGanancia()}
            readOnly
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Stock total</label>
            <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded"
            value={stock} // Mismo valor que el campo anterior
            readOnly // Solo lectura
            />
          </div>
        </div>
        <div className="mt-4">
          {buttonText === "Mostrar" ? (
            // Si buttonText es "Mostrar", mostramos solo el botón "Volver" centrado
            <div className="flex justify-center">
              <button onClick={onClose} className="bg-gray-300 text-black py-2 px-4 rounded">
                Volver
              </button>
            </div>
          ) : (
            // Si buttonText no es "Mostrar", mostramos los botones en los lados
            <div className="flex justify-between">
              <button onClick={onClose} className="bg-gray-300 text-black py-2 px-4 rounded">
                Cancelar
              </button>
              <button className="bg-blue-500 text-white py-2 px-4 rounded">
                {buttonText}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


export default ModalWidows;