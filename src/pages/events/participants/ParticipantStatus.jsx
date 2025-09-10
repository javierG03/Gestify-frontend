import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiCheckCircle, FiClock, FiUserCheck, FiXCircle } from "react-icons/fi";
import axiosInstance from "../../../config/AxiosInstance";

const statusMapping = {
  "Pendiente": 1,
  "Confirmado": 2,
  "Asistio": 3,
  "Cancelado": 4,
};

const statusOptions = [
  { id: "Pendiente", name: "Pendiente", icon: FiClock },
  { id: "Confirmado", name: "Confirmado", icon: FiCheckCircle },
  { id: "Asistio", name: "Asistio", icon: FiUserCheck },
  { id: "Cancelado", name: "Cancelado", icon: FiXCircle },
];

export default function ParticipantStatus() {
  const { participantId } = useParams();
  const navigate = useNavigate();

  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const { data } = await axiosInstance.get(`/participants/${participantId}`);
        const statusName = Object.keys(statusMapping).find(
          key => statusMapping[key] === data.participant_status_id
        );
        setParticipant(data);
        setSelectedStatus(statusName);
      } catch (err) {
        console.error("Error al cargar participante", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [participantId]);

  const handleStatusChange = async () => {
    if (!selectedStatus || selectedStatus === participant?.status_name) return;

    try {
      setLoading(true);
      const statusId = statusMapping[selectedStatus];
      await axiosInstance.put(`/participants/update/${participantId}`, {
        participant_status_id: statusId,
      });
      navigate(-1);
    } catch (err) {
      console.error("Error actualizando estado", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Cargando...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-gray-600 hover:text-indigo-600">
          <FiArrowLeft className="mr-2" /> Volver
        </button>

        <h1 className="text-2xl font-bold mb-6">Estado del Participante</h1>

        <div className="space-y-4">
          {statusOptions.map((status) => {
            const Icon = status.icon;
            const isSelected = selectedStatus === status.id;
            return (
              <div
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer ${
                  isSelected ? "bg-indigo-100 border-indigo-500" : "bg-white border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={isSelected ? "text-indigo-600" : "text-gray-500"} size={20} />
                  <span className={`font-medium ${isSelected ? "text-indigo-800" : "text-gray-700"}`}>{status.name}</span>
                </div>
                {isSelected && (
                  <div className="bg-indigo-600 rounded-full p-1">
                    <FiCheck size={14} className="text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleStatusChange}
          disabled={selectedStatus === participant?.status_name || !selectedStatus}
          className={`w-full mt-8 py-3 rounded-lg font-semibold text-white transition-colors ${
            selectedStatus === participant?.status_name || !selectedStatus
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
