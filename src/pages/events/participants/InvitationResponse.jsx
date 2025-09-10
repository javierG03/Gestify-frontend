import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import axiosInstance from "../../../config/AxiosInstance"; // ajusta según tu estructura

export default function InvitationResponse() {
  const { token, action } = useParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasRequested = useRef(false);

  useEffect(() => {
    const handleInvitation = async () => {
      try {
        if (action === "rechazar") {
          await axiosInstance.get(`/invitacion/rechazar/${token}`);
          setStatus("rejected");
        } else {
          await axiosInstance.get(`/invitacion/${token}`);
          setStatus("accepted");
        }
      } catch (error) {
        console.error("Error procesando invitación:", error);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    if (!hasRequested.current) {
      hasRequested.current = true;
      handleInvitation();
    }
  }, [token, action]);

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-lg text-gray-600">Procesando invitación...</p>;
    }

    if (status === "accepted") {
      return (
        <div className="text-center">
          <FiCheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-700 mb-2">Invitación aceptada</h1>
          <p className="text-gray-600">Gracias por confirmar tu asistencia.</p>
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <div className="text-center">
          <FiXCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-700 mb-2">Invitación rechazada</h1>
          <p className="text-gray-600">Lamentamos que no puedas asistir.</p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <FiXCircle size={64} className="text-gray-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Invitación inválida</h1>
        <p className="text-gray-600">El enlace que usaste no es válido o ya expiró.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
}
