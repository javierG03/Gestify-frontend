import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Usa la variable de entorno
  headers: {
    "Content-Type": "application/json",
  },
  // Importante: Configurar withCredentials para enviar cookies con las solicitudes
  //withCredentials: true,
})

// Interceptor de solicitud para agregar el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token") // Obtén el token del localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}` // Agrega el token al encabezado de Authorization
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor de respuesta para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo notifica el error, no elimines el token ni redirijas aquí
    return Promise.reject(error)
  }
)

export default axiosInstance
