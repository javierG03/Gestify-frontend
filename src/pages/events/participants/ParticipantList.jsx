import { useState, useEffect, useContext } from "react";
import { FiUser, FiEdit2, FiTrash2, FiArrowLeft, FiPlus, FiSearch } from "react-icons/fi";
import { AuthContext } from "../../../config/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import participantService from "./services/ParticipantService";

export default function ParticipantList() {
  const { id } = useParams();
  
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Obtén los datos de autenticación desde el contexto
  const { userId, isAuthenticated, loading: authLoading } = useContext(AuthContext);

  // Verifica autenticación al cargar
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login"); // Redirige si no está autenticado
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Cargar participantes directamente con axios
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        // Llamamos directamente al servicio de participantes
        const response = await participantService.getEventParticipants(id);
        setParticipants(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching participants:", err);
        setError(err.response?.data?.message || "Error al cargar los participantes");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchParticipants();
  }, [id]);

const handleDelete = async (participantId) => {

  const confirmResult = await Swal.fire({
    title: "¿Eliminar participante?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (!confirmResult.isConfirmed) return;

  try {
    setIsDeleting(true);

    await participantService.deleteParticipant(userId, {
      id_participants: participantId
    });

    setParticipants(prev => prev.filter(p => p.id_participants !== participantId));

    Swal.fire({
      title: "Eliminado",
      text: "El participante fue eliminado correctamente.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    });

  } catch (err) {
    console.error("Delete error:", err);
    Swal.fire({
      title: "Error",
      text: err.response?.data?.message || "No se pudo eliminar el participante.",
      icon: "error"
    });
  } finally {
    setIsDeleting(false);
  }
};

  const handleNavigateToInvitation = () => {
    navigate(`/dashboard/events/invite/${id}`);
  };

  const handleNavigateToStatus = (participantId) => {
    navigate(`/dashboard/events/${id}/participants/${participantId}`);
  };

  const filteredParticipants = participants.filter(p => {
    const search = searchTerm.toLowerCase();
    return (
      p.user_name?.toLowerCase().includes(search) ||
      p.user_email?.toLowerCase().includes(search) ||
      p.user_last_name?.toLowerCase().includes(search)
    );
  });

  if (loading && !isDeleting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Cargando participantes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-xl">
      {/* Contenido principal */}
      <main className="p-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate(`/dashboard/events/detail-events/${id}`)}
            className="p-2 rounded-full hover:bg-gray-100 mr-2"
          >
            <FiArrowLeft className="text-gray-800 text-xl" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Participantes del evento #{id}</h1>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={handleNavigateToInvitation}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 transition-colors"
            aria-label="Añadir participante"
          >
            <FiPlus size={20} />
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-2.5 text-indigo-500" size={20} />
          </div>
        </div>

        {/* Lista de participantes */}
        {filteredParticipants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron participantes</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredParticipants.map(participant => (
              <li key={participant.id_participants} className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-200 rounded-full p-3">
                    <FiUser size={24} className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {participant.user_name || "Nombre no disponible"} {participant.user_last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{participant.email || "Sin correo"}</p>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      participant.participant_status_id === 2 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {participant.status_name}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleNavigateToStatus(participant.id_participants)}
                    className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-colors"
                    aria-label="Editar"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(participant.id_participants)}
                    disabled={isDeleting}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Eliminar"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}