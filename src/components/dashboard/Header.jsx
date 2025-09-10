"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, ChevronsLeft, User, LogOut, Settings, ChevronDown } from "lucide-react"
import PropTypes from "prop-types"
import NotificationBadge from "../Notification/NotificationBadge"
import NotificationsDropdown from "../Notification/NotificationsDropdown"
import { useNotifications } from "../../hooks/useNotifications"
import { useContext } from "react"
import { AuthContext } from "../../config/AuthProvider"
import { Link } from "react-router-dom"

export const Header = ({ collapsed, setCollapsed }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  const { logout, email, role } = useContext(AuthContext)

  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications()

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev)
    if (isProfileMenuOpen) setIsProfileMenuOpen(false)
    if (!isNotificationsOpen) {
      // Refrescar notificaciones al abrir
      fetchNotifications()
    }
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev)
    if (isNotificationsOpen) setIsNotificationsOpen(false)
  }

  // Cerrar menú de perfil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleDeleteNotification = async (notificationId) => {
    await deleteNotification(notificationId)
  }

  const handleLogout = () => {
    logout()
    // Redirigir a la página de inicio de sesión
    window.location.href = "/login"
  }

  // Obtener iniciales del email para mostrar en el avatar
  const getInitials = () => {
    if (!email) return "U"
    return email.charAt(0).toUpperCase()
  }

  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-sm transition-colors">
      {/* Botón de colapso */}
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronsLeft className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Controles del usuario */}
      <div className="flex items-center gap-x-5">
        {/* Botón de notificaciones */}
        <div className="relative">
          <button
            className="items-center btn-ghost size-10 relative flex justify-center rounded-full hover:bg-gray-100"
            onClick={toggleNotifications}
            aria-label="Notificaciones"
          >
            <Bell size={20} />
            <NotificationBadge count={unreadCount} />
          </button>

          <NotificationsDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notifications}
            loading={loading}
            error={error}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDelete={handleDeleteNotification}
          />
        </div>

        {/* Perfil con menú desplegable */}
        <div className="relative" ref={profileMenuRef}>
          <button
            className="flex items-center gap-2 rounded-full hover:bg-gray-100 py-1 px-2 transition-colors"
            onClick={toggleProfileMenu}
          >
            <div className="overflow-hidden rounded-full size-8 bg-[#365486] text-white flex items-center justify-center font-medium">
              {getInitials()}
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Menú desplegable de perfil */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
              <div className="p-3 border-b bg-gray-50">

                <p className="text-sm font-medium text-gray-800 truncate">{email}</p>
              </div>
              <div className="py-1">
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <User size={16} />
                  <span>Mi Perfil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// Definición de tipos para props
Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
}
