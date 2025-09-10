"use client"

import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../config/AuthProvider"
import AllEvents from "./all-events"
import { Calendar, Users, Clock, TrendingUp } from "lucide-react"
import axiosInstance from "../../config/AxiosInstance"
import Chatbot from "../../components/ChatBot"

const Dashboard = () => {
  const { permissions, loading: authLoading, isAuthenticated, userId } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalCapacity: 0,
  })
  const [loading, setLoading] = useState(true)

  // Función para verificar permisos
  const hasPermission = (permission) => {
    if (authLoading) {
      return false // Si los permisos aún se están cargando, no verificamos permisos
    }
    if (!permissions || !Array.isArray(permissions)) {
      return false // Si permissions no está definido o no es un array, retorna false
    }
    return permissions.some((perm) => perm.name === permission) // Verifica si algún permiso coincide
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Obtener todos los eventos para calcular estadísticas
        const response = await axiosInstance.get("/events")
        const events = response.data

        if (events && Array.isArray(events)) {
          // Calcular estadísticas basadas en los datos reales
          const totalEvents = events.length
          const upcomingEvents = events.filter((event) => event.state === "Planeado").length
          const completedEvents = events.filter((event) => event.state === "Completado").length

          // Calcular la capacidad total sumando max_participants de todos los eventos
          const totalCapacity = events.reduce((sum, event) => {
            const participants = Number.parseInt(event.max_participants) || 0
            return sum + participants
          }, 0)

          setStats({
            totalEvents,
            upcomingEvents,
            completedEvents,
            totalCapacity,
          })
        }
      } catch (error) {
        console.error("Error al obtener estadísticas:", error)
        // En caso de error, mantener los valores predeterminados
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#365486]"></div>
        <p className="ml-2">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#365486] mb-2">Bienvenido al Dashboard</h1>
          <p className="text-gray-600">
            {isAuthenticated
              ? "Explora todos los eventos disponibles y gestiona tu participación"
              : "Explora todos los eventos disponibles en nuestra plataforma"}
          </p>
        </div>

        {/* Tarjetas de estadísticas - Mostrar siempre, incluso si el usuario no está autenticado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 mr-4">
                <Calendar className="h-6 w-6 text-[#365486]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de eventos</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalEvents}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 mr-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Próximos eventos</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.upcomingEvents}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-50 mr-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Eventos completados</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.completedEvents}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-50 mr-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Suma de aforo</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalCapacity.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Roles - Solo mostrar si el usuario tiene permisos específicos */}
        {(hasPermission("manage_events") || hasPermission("accept_invitation")) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {hasPermission("manage_events") && (
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#365486]">
                <h2 className="text-xl font-semibold mb-2 text-[#365486]">Rol: Gestor de eventos</h2>
                <p className="text-gray-600 mb-4">Tienes permisos para gestionar eventos en la plataforma.</p>
                <a
                  href="/dashboard/events/create-event"
                  className="inline-block px-4 py-2 bg-[#365486] text-white rounded-lg hover:bg-[#4a6da8] transition-colors"
                >
                  Crear nuevo evento
                </a>
              </div>
            )}

            {hasPermission("accept_invitation") && (
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <h2 className="text-xl font-semibold mb-2 text-green-600">Rol: Cliente</h2>
                <p className="text-gray-600 mb-4">Puedes participar en eventos y aceptar invitaciones.</p>
                <a
                  href="/dashboard/invitations"
                  className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Ver invitaciones
                </a>
              </div>
            )}
          </div>
        )}

        {/* Componente de todos los eventos */}
        <AllEvents />
      </div>
     
    </div>
    
  )
}

export default Dashboard
