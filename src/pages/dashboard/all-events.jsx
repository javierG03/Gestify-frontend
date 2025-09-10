"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../../config/AxiosInstance"
import { useContext } from "react"
import { AuthContext } from "../../config/AuthProvider"
import { Calendar, Search, Filter, ArrowUp, ArrowDown } from "lucide-react"

const AllEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useContext(AuthContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("Todos")
  const [activeEventType, setActiveEventType] = useState("Todos")
  const [sortOrder, setSortOrder] = useState("desc") // "asc" or "desc"

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setLoading(true)
        // Usar la ruta para obtener todos los eventos
        const response = await axiosInstance.get("/events")

        // Log the complete response to console
        console.log("Respuesta completa del backend:", response)
        console.log("Datos de eventos:", response.data)

        setEvents(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching events:", err)

        if (err.response) {
          console.error("Error response:", err.response.status, err.response.data)

          if (err.response.status === 401) {
            setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.")
          } else {
            setError(`Error al cargar eventos: ${err.response.data.error || "Error desconocido"}`)
          }
        } else if (err.request) {
          setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.")
        } else {
          setError("No se pudieron cargar los eventos. Por favor, intenta de nuevo más tarde.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAllEvents()
  }, [])

  // Función para formatear la fecha
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
      console.error("Error al formatear fecha:", error)
      return "Error en fecha"
    }
  }

  // Función para cambiar el orden de clasificación
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  // Filtrado y ordenamiento de eventos
  const filteredAndSortedEvents = events
    .filter((event) => {
      // Validar que event y sus propiedades existan
      if (!event) return false

      const eventName = event.name || ""
      const eventType = event.event_type || ""
      const eventState = event.state || ""

      const matchesSearch = eventName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesState = activeFilter === "Todos" || eventState === activeFilter

      // Case-insensitive comparison for event type
      const matchesEventType = activeEventType === "Todos" || eventType.toLowerCase() === activeEventType.toLowerCase()

      return matchesSearch && matchesState && matchesEventType
    })
    .sort((a, b) => {
      // Ordenar por fecha de inicio
      const dateA = new Date(a.start_time || 0)
      const dateB = new Date(b.start_time || 0)

      if (sortOrder === "asc") {
        return dateA - dateB // Más antiguo primero
      } else {
        return dateB - dateA // Más reciente primero
      }
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#365486]"></div>
        <p className="ml-2">Cargando eventos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#365486] text-white px-4 py-2 rounded-lg hover:bg-[#4a6da8] transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#365486] mb-2">Explora Eventos</h1>
            <p className="text-gray-600">Descubre todos los eventos disponibles en nuestra plataforma</p>
          </div>
          {isAuthenticated && (
            <a
              href="/dashboard/events"
              className="mt-4 md:mt-0 px-4 py-2 bg-[#365486] text-white rounded-lg hover:bg-[#4a6da8] transition-colors"
            >
              Ver mis eventos
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
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#365486] bg-white shadow-sm"
          />
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-[#365486] mr-2" />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Filtro por estado */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Estado del evento</h3>
              <div className="flex flex-wrap gap-2">
                {["Todos", "Planeado", "En curso", "Completado", "Cancelado"].map((state) => (
                  <button
                    key={state}
                    className={`px-4 py-2 rounded-full text-sm ${
                      activeFilter === state
                        ? "bg-[#365486] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveFilter(state)}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por tipo de evento */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Modalidad</h3>
              <div className="flex flex-wrap gap-2">
                {["Todos", "Virtual", "Presencial", "Hibrido"].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded-full text-sm ${
                      activeEventType === type
                        ? "bg-[#365486] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveEventType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#365486]">
              {filteredAndSortedEvents.length}{" "}
              {filteredAndSortedEvents.length === 1 ? "evento encontrado" : "eventos encontrados"}
            </h2>
            <button
              onClick={toggleSortOrder}
              className="flex items-center text-sm text-gray-700 hover:text-[#365486] transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-full"
            >
              {sortOrder === "asc" ? (
                <>
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>Más antiguos primero</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-4 w-4 mr-1" />
                  <span>Más recientes primero</span>
                </>
              )}
            </button>
          </div>

          {filteredAndSortedEvents.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No hay eventos disponibles</h3>
              <p className="text-gray-500 mb-4">Prueba con otros filtros o vuelve más tarde.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedEvents.map((event) => (
                <a
                  key={event.id_event}
                  href={`/dashboard/events/detail-events/${event.id_event}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] cursor-pointer block"
                  style={{ textDecoration: "none" }}
                >
                  <div className="h-48 bg-gray-200 relative">
                    {event.image_url && Array.isArray(event.image_url) && event.image_url.length > 0 ? (
                      <img
                        src={event.image_url[0] || "/placeholder.svg"}
                        alt={event.name}
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
                    {event.event_type && (
                      <div className="absolute bottom-2 left-2 bg-white text-[#365486] text-xs px-2 py-1 rounded shadow-sm">
                        {event.event_type}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[#365486] text-sm font-medium mb-1">{formatDate(event.start_time)}</p>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{event.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <span className="truncate">{event.location || "Ubicación no especificada"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {event.max_participants ? `Máx. ${event.max_participants} participantes` : ""}
                      </span>
                      <span className="text-[#365486] hover:text-[#4a6da8] font-medium text-sm">
                        Ver detalles
                      </span>
                    </div>
                  </div>
                </a>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllEvents
