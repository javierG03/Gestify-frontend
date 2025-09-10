"use client"

import { useRef, useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Bell, X, Check, ExternalLink, Inbox } from "lucide-react"
import NotificationItem from "./NotificationItem"
import { Link } from "react-router-dom"

const NotificationsDropdown = ({
  isOpen,
  onClose,
  notifications,
  loading,
  error,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  fetchNotifications,
}) => {
  const dropdownRef = useRef(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const [windowHeight, setWindowHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 0)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Actualizar el ancho y alto de la ventana cuando cambia
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Mostrar solo las 5 notificaciones más recientes
  const recentNotifications = notifications.slice(0, 5)
  const hasUnread = notifications.some((n) => !n.read_status)

  if (!isOpen) return null

  // Calcular la altura óptima para mostrar 4 notificaciones completas
  // Cada notificación tiene aproximadamente 80px de altura (ajustar según el diseño real)
  // Header: ~48px, Footer: ~48px, Padding: ~16px
  const calculateOptimalHeight = () => {
    // Altura base para header, footer y padding
    const baseHeight = 48 + 48 + 16

    // Altura para 4 notificaciones (ajustar según el diseño real)
    const notificationHeight = 85 // Altura aproximada de cada notificación
    const desiredNotificationsToShow = Math.min(4, recentNotifications.length)

    // Calcular altura total deseada
    const desiredHeight = baseHeight + notificationHeight * desiredNotificationsToShow

    // Limitar la altura máxima en dispositivos móviles
    if (windowWidth < 640) {
      return Math.min(desiredHeight, windowHeight - 70)
    }

    // Para pantallas más grandes
    return Math.min(desiredHeight, 480) // Máximo 480px de altura
  }

  // Determinar el estilo de posicionamiento basado en el ancho de la ventana
  const getDropdownStyles = () => {
    const optimalHeight = calculateOptimalHeight()

    // Para dispositivos móviles pequeños (menos de 640px)
    if (windowWidth < 640) {
      return {
        position: "fixed",
        top: "60px", // Ajusta según la altura de tu barra de navegación
        left: "0",
        right: "0",
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        height: optimalHeight,
        maxHeight: "calc(100vh - 70px)",
        borderRadius: "0",
        zIndex: 50,
      }
    }

    // Para tablets (640px - 768px)
    if (windowWidth < 768) {
      return {
        position: "absolute",
        top: "calc(100% + 8px)",
        right: "0",
        width: "320px",
        maxWidth: "calc(100vw - 32px)",
        height: optimalHeight,
        maxHeight: optimalHeight,
        zIndex: 50,
      }
    }

    // Para pantallas más grandes
    return {
      position: "absolute",
      top: "calc(100% + 8px)",
      right: "0",
      width: "384px", // w-96
      maxWidth: "calc(100vw - 32px)",
      height: optimalHeight,
      maxHeight: optimalHeight,
      zIndex: 50,
    }
  }

  const dropdownStyles = getDropdownStyles()

  return (
    <div
      ref={dropdownRef}
      className="animate-fadeIn overflow-hidden bg-white shadow-xl ring-1 ring-black/5 rounded-b-xl sm:rounded-xl flex flex-col"
      style={dropdownStyles}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-[#365486] to-[#4a6da8] px-4 py-2.5 text-white">
        <h3 className="flex items-center gap-2 font-medium">
          <Bell size={16} />
          <span>Notificaciones</span>
          {notifications.length > 0 && (
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">{notifications.length}</span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {hasUnread && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-white/90 transition-colors hover:bg-white/10"
              title="Marcar todas como leídas"
            >
              <Check size={14} />
              <span className="hidden sm:inline">Marcar todas</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10"
            title="Cerrar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col overflow-y-auto flex-grow">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#365486] border-t-transparent"></div>
            <span className="ml-3 text-sm text-gray-600">Cargando notificaciones...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <div className="mb-2 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <X className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => fetchNotifications()}
              className="mt-3 rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-200"
            >
              Reintentar
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Inbox className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No tienes notificaciones</p>
            <p className="mt-1 text-xs text-gray-400">Las notificaciones aparecerán aquí</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentNotifications.map((notification) => (
              <NotificationItem
                key={notification.id_notification}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer - Aseguramos que siempre aparezca si hay notificaciones */}
      {notifications.length > 0 && (
        <div className="border-t bg-gray-50 p-2.5 mt-auto">
          <Link
            to="/notifications"
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#365486]/10 px-4 py-1.5 text-sm font-medium text-[#365486] transition-colors hover:bg-[#365486]/15"
            onClick={onClose}
          >
            <span>Ver todas las notificaciones</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      )}

      {/* Estilos para animación */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

NotificationsDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.oneOf([null])]),
  onMarkAsRead: PropTypes.func.isRequired,
  onMarkAllAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  fetchNotifications: PropTypes.func,
}

export default NotificationsDropdown
