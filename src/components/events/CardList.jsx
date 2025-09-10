// CardList.jsx (versión web adaptada de React Native)
import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const CardList = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-start">
      <div className="mr-4 w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
        <p className="text-sm text-gray-600 mt-1">Valor Unitario: ${item.price}</p>
        <p className="text-sm text-gray-600 mt-1">Costo Total: ${item.totalCost}</p>
        {item.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 rounded hover:bg-gray-100 text-indigo-600"
            title="Editar"
          >
            <FiEdit size={20} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 rounded hover:bg-gray-100 text-red-600"
            title="Eliminar"
          >
            <FiTrash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CardList;