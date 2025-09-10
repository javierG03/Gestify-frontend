// ResourceList.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiAlertCircle, FiBox } from "react-icons/fi";
import resourceService from "./services/ResourceService";
import CardList from "../../../components/events/CardList";
import Swal from "sweetalert2"; // Importa SweetAlert2

const ResourceList = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResources();
  }, [eventId]);

    const loadResources = async () => {
    setLoading(true);
    try {
        const response = await resourceService.getEventResources(eventId);
        console.log(response.data); // Verifica que la respuesta sea un array

        // Asignamos la respuesta directamente si es un array
        if (Array.isArray(response.data)) {
        setResources(response.data);  // Asigna el array directamente
        } else {
        setResources([]);  // En caso de que no sea un array, asignamos un array vacío
        }
        setError(null); // Limpiar cualquier error previo
    } catch (err) {
        setError("No se pudieron cargar los recursos. Por favor, intenta de nuevo.");
    } finally {
        setLoading(false);
    }
    };

  const handleAddResource = () => {
    navigate(`/dashboard/events/detail-events/${eventId}/add-resource`);
  };

  const handleEditResource = (resourceId) => {
    navigate(`/dashboard/events/detail-events/${eventId}/edit-resource/${resourceId}`);
  };

  const handleDeleteResource = async (resourceId) => {
    // Mostrar el SweetAlert para confirmar la eliminación
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await resourceService.deleteResource(resourceId); // Elimina el recurso
          loadResources(); // Vuelve a cargar los recursos
          Swal.fire("Eliminado!", "El recurso ha sido eliminado.", "success"); // Mensaje de éxito
          navigate(`/dashboard/events/detail-events/${eventId}/resource-list`);
        } catch (err) {
          Swal.fire("Error", "No se pudo eliminar el recurso. Inténtalo de nuevo.", "error"); // Mensaje de error
        }
      }
    });
  };

  return (
    <div className="min-h-screen rounded-lg p-6">
      <div className="max-w-4xl mx-auto ">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(`/dashboard/events/detail-events/${eventId}`)}
           className="text-gray-600 hover:text-indigo-600 flex items-center">
            <FiArrowLeft className="mr-2" /> Volver
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Recursos del Evento</h1>
          <button
            onClick={handleAddResource}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <FiPlus className="mr-2" /> Agregar Recurso
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <span className="animate-spin text-4xl">⏳</span>
            <p className="mt-4">Cargando recursos...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 mt-10">
            <FiAlertCircle size={40} className="mx-auto mb-4" />
            <p>{error}</p>
            <button
              onClick={loadResources}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Reintentar
            </button>
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-20">
            <FiBox size={60} />
            <p className="text-lg font-semibold mt-4">No hay recursos agregados</p>
            <p className="text-sm mt-2">Agrega recursos para tu evento como equipos, decoración, etc.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resources.map((item) => (
              <CardList
                key={item.id_resource || item.id}
                item={{
                  name: item.name,
                  quantity: item.quantity_available,
                  price: item.price,
                  totalCost: item.quantity_available * item.price,
                  description: item.description || "Sin notas adicionales",
                }}
                onEdit={() => handleEditResource(item.id_resource || item.id)}
                onDelete={() => handleDeleteResource(item.id_resource || item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceList;