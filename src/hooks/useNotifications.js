"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useContext } from "react"
import axiosInstance from "../config/AxiosInstance"
import { AuthContext } from "../config/AuthProvider"
import { formatRelativeDate } from "../utils/dateUtils"

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all") // "all", "read", "unread"
  const [searchQuery, setSearchQuery] = useState("")
  const { userId, isAuthenticated } = useContext(AuthContext)

  // Referencia para el intervalo de actualización
  const refreshIntervalRef = useRef(null)
  const lastFetchTimeRef = useRef(null)

  // Procesar notificaciones para añadir campos adicionales
  const processNotifications = useCallback((notificationsData) => {
    return notificationsData.map((notification) => ({
      ...notification,
      relativeDate: formatRelativeDate(notification.created_at),
    }))
  }, [])

  // Aplicar filtros y búsqueda a las notificaciones
  const applyFilters = useCallback(() => {
    if (!notifications.length) {
      setFilteredNotifications([])
      return
    }

    let result = [...notifications]

    // Aplicar filtro por estado
    if (filter === "read") {
      result = result.filter((n) => n.read_status)
    } else if (filter === "unread") {
      result = result.filter((n) => !n.read_status)
    }

    // Aplicar búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((n) => n.message.toLowerCase().includes(query))
    }

    setFilteredNotifications(result)
  }, [notifications, filter, searchQuery])

  // Obtener notificaciones del servidor
  const fetchNotifications = useCallback(
    async (silent = false) => {
      if (!isAuthenticated || !userId) {
        console.log("No hay usuario autenticado o userId", { isAuthenticated, userId })
        return
      }

      // Evitar múltiples solicitudes en un corto período de tiempo
      const now = Date.now()
      if (lastFetchTimeRef.current && now - lastFetchTimeRef.current < 5000 && silent) {
        console.log("Evitando múltiples solicitudes en un corto período")
        return
      }

      lastFetchTimeRef.current = now

      if (!silent) setLoading(true)
      setError(null)

      try {
        console.log(`Obteniendo notificaciones para el usuario ${userId}`)
        const response = await axiosInstance.get(`/notifications/${userId}`)
        console.log("Respuesta de notificaciones:", response)

        const notificationsData = response.data || []
        console.log("Datos de notificaciones:", notificationsData)

        // Procesar notificaciones para añadir fechas relativas
        const processedNotifications = processNotifications(notificationsData)

        setNotifications(processedNotifications)

        // Calcular notificaciones no leídas
        const unread = processedNotifications.filter((n) => !n.read_status).length
        setUnreadCount(unread)
        console.log(`Notificaciones no leídas: ${unread}`)
      } catch (err) {
        console.error("Error al obtener notificaciones:", err)

        // Si el error es 404, significa que no hay notificaciones (según tu backend)
        if (err.response?.status === 404) {
          console.log("No hay notificaciones para este usuario")
          setNotifications([])
          setUnreadCount(0)
        } else {
          if (!silent) setError("Error al cargar notificaciones")
        }
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [isAuthenticated, userId, processNotifications],
  )

  // Marcar una notificación como leída
  const markAsRead = useCallback(async (notificationId) => {
    try {
      console.log(`Marcando notificación ${notificationId} como leída`)
      await axiosInstance.put(`/notifications/${notificationId}`)

      // Actualizar estado local
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id_notification === notificationId ? { ...notification, read_status: true } : notification,
        ),
      )

      // Actualizar contador
      setUnreadCount((prev) => Math.max(0, prev - 1))

      return true
    } catch (err) {
      console.error("Error al marcar notificación como leída:", err)
      return false
    }
  }, [])

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = useCallback(async () => {
    if (!userId) return false

    try {
      console.log(`Marcando todas las notificaciones del usuario ${userId} como leídas`)
      await axiosInstance.put(`/notifications/user/${userId}/read-all`)

      // Actualizar estado local
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read_status: true })))

      // Actualizar contador
      setUnreadCount(0)

      return true
    } catch (err) {
      console.error("Error al marcar todas las notificaciones como leídas:", err)
      return false
    }
  }, [userId])

  // Eliminar una notificación
  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        console.log(`Eliminando notificación ${notificationId}`)
        await axiosInstance.delete(`/notifications/${notificationId}`)

        // Actualizar estado local
        const updatedNotifications = notifications.filter(
          (notification) => notification.id_notification !== notificationId,
        )

        setNotifications(updatedNotifications)

        // Recalcular contador de no leídas
        const unread = updatedNotifications.filter((n) => !n.read_status).length
        setUnreadCount(unread)

        return true
      } catch (err) {
        console.error("Error al eliminar notificación:", err)
        return false
      }
    },
    [notifications],
  )

  // Configurar actualización automática
  useEffect(() => {
    if (isAuthenticated && userId) {
      // Cargar notificaciones iniciales
      console.log("Cargando notificaciones iniciales")
      fetchNotifications()

      // Configurar intervalo de actualización (cada 60 segundos)
      refreshIntervalRef.current = setInterval(() => {
        console.log("Actualizando notificaciones automáticamente")
        fetchNotifications(true) // Silencioso para no mostrar indicadores de carga
      }, 60000)
    }

    // Limpiar intervalo al desmontar
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [isAuthenticated, userId, fetchNotifications])

  // Aplicar filtros cuando cambien las dependencias
  useEffect(() => {
    applyFilters()
  }, [notifications, filter, searchQuery, applyFilters])

  return {
    notifications,
    filteredNotifications,
    unreadCount,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}
