"use client"

import { useState, useEffect, useContext } from "react"
import axiosInstance from "../../config/AxiosInstance"
import { AuthContext } from "../../config/AuthProvider"
import { Calendar, Search, Frown } from "lucide-react"
import Chatbot from "../../components/ChatBot"

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { userId, email, isAuthenticated, role,authInitialized } = useContext(AuthContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("Todos")

useEffect(() => {
    if (!authInitialized) return; // Espera a que el contexto esté listo

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          setError("No has iniciado sesión. Por favor, inicia sesión para ver tus eventos.")
          setLoading(false)
          return
        }
        if (!userId) {
          setError("No se pudo identificar al usuario. Por favor, espera un momento.")
          setLoading(false)
          return
        }
        setLoading(true)
        const response = await axiosInstance.get(`/events/users/${userId}`)
        setMyEvents(response.data)
        setError(null)
      } catch (err) {
        // ...manejo de errores...
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && userId) {
      fetchEvents()
    } else {
      setLoading(false)
      setError("Debes iniciar sesión para ver tus eventos.")
    }
  }, [userId, isAuthenticated, authInitialized])


  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible"
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Fecha inválida"
      const day = date.getDate()
      const month = date.toLocaleString("es-ES", { month: "short" }).toUpperCase()
      const weekday = date.toLocaleString("es-ES", { weekday: "short" }).toUpperCase()
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")
      return `${day} ${month} - ${weekday} - ${hours}:${minutes}`
    } catch (error) {
      return "Error en fecha"
    }
  }

  const filteredEvents = myEvents.filter((event) => {
    if (!event) return false
    const eventName = event.name || event.event_name || ""
    const eventRole = event.user_role || ""
    const matchesSearch = eventName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = activeFilter === "Todos" || eventRole.toLowerCase() === activeFilter.toLowerCase()
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#365486]"></div>
        <p className="ml-2">Cargando eventos...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#365486]">Mis Eventos</h1>
        {(role === 1 || role === 2) ? (
          <button
            onClick={() => (window.location.href = "/dashboard/events/create-event")}
            className="px-6 py-2 font-semibold rounded-lg shadow-md bg-[#365486] text-white hover:bg-[#4a6da8] transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Crear Evento
          </button>
        ) : (
          <a
            href="https://wa.me/573173453174?text=Hola,%20quiero%20contactar%20a%20un%20gestor%20para%20crear%20un%20evento"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 font-semibold rounded-lg shadow-md bg-green-500 text-white hover:bg-green-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Contactar a un gestor
          </a>
        )}
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#365486]" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#365486]"
        />
      </div>

      {/* Filtros de rol con opción "Todos" */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {["Todos", "Gestor", "participante", "cliente"].map((role) => (
          <button
            key={role}
            className={`px-6 py-2 rounded-full ${
              activeFilter === role ? "bg-[#365486] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Más recientes</h2>

      {filteredEvents.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center flex flex-col items-center">
          <Frown className="w-12 h-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No tienes eventos</h3>
          {role !== 1 && role !== 2 && (
            <a
              href="https://wa.me/51999999999?text=Hola,%20quiero%20contactar%20a%20un%20gestor%20para%20crear%20un%20evento"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-2 font-semibold rounded-lg shadow-md bg-green-500 text-white hover:bg-green-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Contactar a un gestor
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 ">
          {filteredEvents.map((event) => (
            <a
              key={event.id_event}
              href={`/dashboard/events/detail-events/${event.id_event}`}
              className="block h-full"
              style={{ textDecoration: "none" }}
            >
                <div
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] cursor-pointer block h-full"
                >

                <div className="h-40 bg-gray-200 relative">
                  {event.image_url && Array.isArray(event.image_url) && event.image_url.length > 0 ? (
                    <img
                      src={event.image_url[0] || "/placeholder.svg"}
                      alt={event.name || event.event_name}
                      className="w-full h-full object-cover"
                    />
                  ) : event.image ? (
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.name || event.event_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#f0f5fb]">
                      <Calendar className="text-[#365486] opacity-50" size={48} />
                    </div>
                  )}
                  {event.state && (
                    <div className="absolute top-2 right-2 bg-[#365486] text-white text-xs px-2 py-1 rounded">
                      {event.state}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[#365486] text-sm font-medium mb-1">{formatDate(event.start_time || event.date)}</p>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{event.name || event.event_name}</h3>
                  <p className="text-gray-700 line-clamp-2 mb-3">{event.event_type_description || event.description}</p>
                  <div className="flex justify-end">
                    <span className="text-[#365486] hover:text-[#4a6da8] font-medium text-sm">
                      Ver detalles
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
    
  )
}

export default MyEvents