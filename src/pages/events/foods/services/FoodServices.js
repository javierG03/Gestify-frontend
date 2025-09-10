import axiosInstance from "../../../../config/AxiosInstance";

const foodService = {
  /**
   * Obtiene todos los alimentos
   * @returns {Promise}
   */
  getFoods: () => {
    return axiosInstance.get("/food");
  },

  /**
   * Obtiene un alimento específico por su ID
   * @param {string|number} id
   * @returns {Promise}
   */
  getFood: (id) => {
    return axiosInstance.get(`/food/${id}`);
  },

  /**
   * Crea un nuevo alimento
   * @param {Object} foodData
   * @returns {Promise}
   */
  createFood: (foodData) => {
    return axiosInstance.post("/food", foodData);
  },

  /**
   * Actualiza un alimento
   * @param {string|number} id
   * @param {Object} foodData
   * @returns {Promise}
   */
  updateFood: (id, foodData) => {
    return axiosInstance.put(`/food/${id}`, foodData);
  },

  /**
   * Elimina un alimento
   * @param {string|number} id
   * @returns {Promise}
   */
  deleteFood: (id) => {
    return axiosInstance.delete(`/food/${id}`);
  },

  /**
   * Asigna un alimento a un evento
   * @param {{ id_event: number, id_food: number }} data
   * @returns {Promise}
   */
  assignFoodToEvent: (data) => {
    return axiosInstance.post("/events/food", data);
  },

  /**
   * Elimina un alimento de un evento
   * @param {string|number} eventId
   * @param {string|number} foodId
   * @returns {Promise}
   */
  removeFoodFromEvent: (eventId, foodId) => {
    return axiosInstance.delete(`/events/${eventId}/foods/${foodId}`);
  },

  /**
   * Obtiene los alimentos de un evento específico
   * @param {string|number} eventId
   * @returns {Promise}
   */
  getEventFoods: (eventId) => {
    return axiosInstance.get(`/events/${eventId}/food`);
  },
};

export default foodService;
