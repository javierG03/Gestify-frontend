import axiosInstance from "../../../../config/AxiosInstance";

const participantService = {
  /**
   * Obtiene los participantes de un evento específico
   * @param {string|number} eventId - ID del evento
   * @returns {Promise} - Promesa con la respuesta
   */
  getEventParticipants: (eventId) => {
    return axiosInstance.get(`/participants/event/${eventId}`);
  },

  /**
   * Registra un nuevo participante en un evento
   * @param {Object} data - Datos del participante
   * @returns {Promise} - Promesa con la respuesta
   */
  registerParticipant: (data) => {
    return axiosInstance.post('/participants', data);
  },

  /**
   * Actualiza la información de un participante
   * @param {string|number} participantId - ID del participante
   * @param {Object} data - Nuevos datos del participante
   * @returns {Promise} - Promesa con la respuesta
   */
  updateParticipant: (participantId, data) => {
    return axiosInstance.put(`/participants/${participantId}`, data);
  },

  /**
   * Elimina un participante de un evento
   * @param {string|number} participantId - ID del participante
   * @returns {Promise} - Promesa con la respuesta
   */
  deleteParticipant: (userId, data) => {
    return axiosInstance.delete(`/participants/delete/${userId}`, {
      data
    });
  }
};

export default participantService;