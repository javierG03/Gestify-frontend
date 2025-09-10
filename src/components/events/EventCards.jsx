import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const EventCards = ({ 
  id_event, 
  name, 
  event_state_id, 
  location_id, 
  type_of_event_id, 
  created_by, 
  role, 
  onCardClick, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="flex w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden 
                    hover:shadow-lg hover:scale-105 transition-transform duration-300">
      
      {/* Imagen a la izquierda */}
      <img className="w-1/3 object-cover rounded-l-lg" src="/docs/images/blog/image-1.jpg" alt="Event" />

      {/* Contenido a la derecha */}
      <div className="w-2/3 p-5 flex flex-col justify-center relative">
        <h5 className="text-lg font-bold text-gray-900">{name}</h5>
        <p className="text-sm text-gray-600"><strong>Lugar:</strong> {location_id}</p>
        <p className="text-sm text-gray-600"><strong>Tipo:</strong> {type_of_event_id}</p>
        <p className="text-sm text-gray-600"><strong>Estado:</strong> {event_state_id}</p>

        {/* Botón "Más detalles" o iconos de edición/borrado */}
        {role === "manager" ? (
          <div className="flex justify-center gap-4 mt-4">
            <button 
              onClick={() => onEdit?.(id_event)} 
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <PencilIcon className="w-6 h-6 text-blue-500 hover:text-blue-700 transition" />
            </button>
            <button 
              onClick={() => onDelete?.(id_event)} 
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <TrashIcon className="w-6 h-6 text-red-500 hover:text-red-700 transition" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onCardClick({ id_event, name, event_state_id, location_id, type_of_event_id, created_by })}
            className="mt-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm transition"
          >
            Más Detalles
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCards;