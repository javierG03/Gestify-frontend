import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMail, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import axiosInstance from "../../../config/AxiosInstance";

export function InviteParticipant() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const generateRandomPassword = () => {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

    const handleSubmit = async () => {
    if (!formData.email) {
      toast.error("Por favor ingrese un correo electrónico");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Por favor ingrese un correo electrónico válido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let userId = null;

      // 1. Verificar si el usuario existe
      try {
        const userResponse = await axiosInstance.get(`/users/${formData.email}`);
        const userData = userResponse?.data?.usuario;

        if (userData?.id_user) {
          userId = userData.id_user;

          // Verificar si ya es participante
          const participantsResponse = await axiosInstance.get(`/participants/event/${id}`);
          const participants = Array.isArray(participantsResponse.data)
            ? participantsResponse.data
            : participantsResponse?.data?.data || [];

          const isAlreadyParticipant = participants.some(
            participant => participant.user_id === userId
          );

          if (isAlreadyParticipant) {
            toast.warning("Este usuario ya es participante del evento");
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // 2. Crear nuevo usuario si no existe
          const randomPassword = generateRandomPassword();

          const response = await axiosInstance.post("/users", {
            name: formData.name,
            last_name: formData.last_name,
            email: formData.email,
            id_role: 3,
            password: randomPassword,
          });

          await axiosInstance.post("/credentials", {
            email: formData.email,
            password: randomPassword,
          });

          userId = response.data?.usuario?.id_user;
          if (!userId) throw new Error("No se pudo crear el usuario");
        } else {
          throw err; // Re-lanza otros errores
        }
      }

      // 3. Enviar invitación
      await axiosInstance.post("/invitacion", {
        id_event: id,
        id_user: userId,
      });

      // 4. Crear notificación
      const eventData = await axiosInstance.get(`/events/${id}`);
      const eventName = eventData?.data?.event_name || "un evento";

      await axiosInstance.post("/notifications", {
        user_id: userId,
        message: `Has sido invitado al evento "${eventName}"`,
      });

      Swal.fire({
        icon: 'success',
        title: '¡Invitación enviada!',
        text: 'El usuario fue invitado correctamente al evento.',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        navigate(`/dashboard/events/participants/${id}`);
      });

    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Hubo un problema al procesar la solicitud");
      toast.error(error || "Hubo un problema al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center bg-gray-100 p-6 min-h-screen">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-800 hover:text-indigo-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" size={24} />
            <span className="font-medium">Volver</span>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Enviar Invitación</h1>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Nombre */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Apellido */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="last_name"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Apellido"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                "PROCESANDO..."
              ) : (
                <>
                  ENVIAR INVITACIÓN
                  <FiSend className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InviteParticipant;