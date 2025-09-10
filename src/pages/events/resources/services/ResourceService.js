import axiosInstance from "../../../../config/AxiosInstance";

const resourceService = {
  /**
   * Obtiene todos los recursos
   * @returns {Promise}
   */
  getResources: () => {
    return axiosInstance.get("/resources");
  },

  /**
   * Obtiene un recurso específico por su ID
   * @param {string|number} id
   * @returns {Promise}
   */
  getResource: (id) => {
    return axiosInstance.get(`/resources/${id}`);
  },

  /**
   * Crea un nuevo recurso
   * @param {Object} data
   * @returns {Promise}
   */
  createResource: (data) => {
    return axiosInstance.post("/resources", data);
  },

  /**
   * Actualiza un recurso
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise}
   */
  updateResource: (id, data) => {
    return axiosInstance.put(`/resources/${id}`, data);
  },

  /**
   * Elimina un recurso
   * @param {string|number} id
   * @returns {Promise}
   */
  deleteResource: (id) => {
    return axiosInstance.delete(`/resources/${id}`);
  },

  /**
   * Obtiene los recursos asignados a un evento
   * @param {string|number} eventId
   * @returns {Promise}
   */
  getEventResources: (eventId) => {
    return axiosInstance.get(`/events/${eventId}/resources`);
  },

  /**
   * Asigna un recurso a un evento
   * @param {{ id_event: number, id_resource: number }} data
   * @returns {Promise}
   */
  assignResourceToEvent: (data) => {
    return axiosInstance.post("/event-resources", data);
  },

  /**
   * Elimina un recurso de un evento
   * @param {string|number} eventId
   * @param {string|number} resourceId
   * @returns {Promise}
   */
  removeResourceFromEvent: (eventId, resourceId) => {
    return axiosInstance.delete(`/events/${eventId}/resources/${resourceId}`);
  },
};

export default resourceService;