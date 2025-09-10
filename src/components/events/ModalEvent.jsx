import { useState } from "react"; // 👈 Importación necesaria

const ModalEvent = ({ open, onClose, event, isAdmin, onSave }) => {
  if (!open) return null;

  // Estados locales para edición/creación
  const [eventData, setEventData] = useState(
    event || { name: '', location_id: '', type_of_event_id: '', event_state_id: '' }
  );

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(eventData); // Llamar a la función que guarda el evento
    onClose(); // Cerrar modal
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-stone-800/75 flex justify-center items-center transition-opacity duration-500 ease-out z-[9999]">
      <div className="bg-white rounded-lg w-1/3 transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-2 cursor-pointer">
        
        {/* Encabezado */}
        <div className="border-b border-stone-200 p-4 flex justify-between items-center">
          <h1 className="text-lg text-stone-800 font-semibold">
            {event ? 'Detalles del Evento' : 'Crear Nuevo Evento'}
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800"
          >
            &times;
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-4 text-stone-500">
          {isAdmin ? (
            <>
              <label className="block text-sm text-stone-600">Nombre:</label>
              <input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mb-2"
              />

              <label className="block text-sm text-stone-600">Lugar:</label>
              <input
                type="text"
                name="location_id"
                value={eventData.location_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mb-2"
              />

              <label className="block text-sm text-stone-600">Tipo de Evento:</label>
              <input
                type="text"
                name="type_of_event_id"
                value={eventData.type_of_event_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mb-2"
              />

              <label className="block text-sm text-stone-600">Estado:</label>
              <input
                type="text"
                name="event_state_id"
                value={eventData.event_state_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mb-2"
              />
            </>
          ) : (
            <>
              <p><strong>Nombre:</strong> {eventData.name}</p>
              <p><strong>Lugar:</strong> {eventData.location_id}</p>
              <p><strong>Tipo:</strong> {eventData.type_of_event_id}</p>
              <p><strong>Estado:</strong> {eventData.event_state_id}</p>
            </>
          )}
        </div>

        {/* Botones del Modal */}
        <div className="border-t border-stone-200 p-4 flex justify-end gap-2">
          {/* <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cerrar
          </button> */}

          {isAdmin && (
            <button
              type="button"
              onClick={handleSave}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {event ? 'Guardar Cambios' : 'Crear Evento'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalEvent;