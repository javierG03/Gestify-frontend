"use client"

import { useState, useEffect, useRef } from "react"
import { useNotifications } from "../../hooks/useNotifications"
import NotificationItem from "../../components/Notification/NotificationItem"
import {
  Bell,
  Search,
  Filter,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Inbox,
  Clock,
  ArrowLeft,
  CheckCheck,
  Sparkles,
} from "lucide-react"

const NotificationsPage = () => {
  const {
    filteredNotifications,
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
    unreadCount,
  } = useNotifications()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const filterMenuRef = useRef(null)
  const searchInputRef = useRef(null)

  // Handle outside clicks for filter menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterMenuOpen(false)
      }
    }

    if (isFilterMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterMenuOpen])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleRefresh = () => {
    fetchNotifications()
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setIsFilterMenuOpen(false)
  }

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen)
  }

  // Get filter label
  const getFilterLabel = () => {
    switch (filter) {
      case "read":
        return "Leídas"
      case "unread":
        return "No leídas"
      default:
        return "Todas"
    }
  }

  // Get filter icon
  const getFilterIcon = () => {
    switch (filter) {
      case "read":
        return <CheckCircle size={16} className="mr-2" />
      case "unread":
        return <AlertCircle size={16} className="mr-2" />
      default:
        return <Clock size={16} className="mr-2" />
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#d9e6f5] to-[#c5d8ed] flex flex-col items-center justify-center p-4 relative">
      {/* Botón para volver al Dashboard */}
      <button
        onClick={() => (window.location.href = "http://localhost:5173/dashboard/inicio")}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#365486] hover:text-[#4a6da8] transition-colors duration-300 font-medium z-10"
      >
        <ArrowLeft size={20} />
        <span>Volver al Dashboard</span>
      </button>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Header con título y acciones */}
        <div className="bg-[#f0f5fb] p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#365486] to-[#4a6da8] text-white shadow-md">
                  <Bell size={24} />
                </div>
                {unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold border-2 border-white animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#365486] flex items-center">
                  Notificaciones
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#365486]/10 text-[#365486]">
                    {filteredNotifications.length}
                  </span>
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {unreadCount > 0
                    ? `Tienes ${unreadCount} notificación${unreadCount !== 1 ? "es" : ""} sin leer`
                    : "No tienes notificaciones sin leer"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
              {isSearchOpen ? (
                <div className="relative flex-grow md:w-64 animate-fadeIn">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar notificaciones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#365486]/30 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-lg bg-white text-[#365486] hover:bg-[#365486] hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#365486]/30 shadow-sm"
                  title="Buscar notificaciones"
                >
                  <Search size={18} />
                </button>
              )}

              {/* Filter Dropdown */}
              <div className="relative" ref={filterMenuRef}>
                <button
                  onClick={toggleFilterMenu}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    filter !== "all"
                      ? "bg-[#365486] text-white"
                      : "bg-white text-[#365486] hover:bg-[#365486] hover:text-white"
                  } transition-all focus:outline-none focus:ring-2 focus:ring-[#365486]/30 shadow-sm`}
                  title="Filtrar notificaciones"
                >
                  <Filter size={18} />
                  <span className="hidden md:inline text-sm">{getFilterLabel()}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isFilterMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Filter Menu */}
                {isFilterMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 animate-fadeIn overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={() => handleFilterChange("all")}
                        className={`flex items-center w-full px-4 py-2 text-sm ${
                          filter === "all" ? "bg-[#365486] text-white" : "text-gray-700 hover:bg-gray-50"
                        } transition-colors`}
                      >
                        <Clock size={16} className="mr-2" />
                        <span>Todas</span>
                      </button>
                      <button
                        onClick={() => handleFilterChange("unread")}
                        className={`flex items-center w-full px-4 py-2 text-sm ${
                          filter === "unread" ? "bg-[#365486] text-white" : "text-gray-700 hover:bg-gray-50"
                        } transition-colors`}
                      >
                        <AlertCircle size={16} className="mr-2" />
                        <span>No leídas</span>
                      </button>
                      <button
                        onClick={() => handleFilterChange("read")}
                        className={`flex items-center w-full px-4 py-2 text-sm ${
                          filter === "read" ? "bg-[#365486] text-white" : "text-gray-700 hover:bg-gray-50"
                        } transition-colors`}
                      >
                        <CheckCircle size={16} className="mr-2" />
                        <span>Leídas</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 rounded-lg bg-white text-[#365486] hover:bg-[#365486] hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#365486]/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                title="Actualizar notificaciones"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>

              {/* Mark All as Read Button (Desktop) */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#365486] to-[#4a6da8] text-white shadow-sm hover:shadow-md hover:from-[#2a4372] hover:to-[#3d5a8c] transition-all focus:outline-none focus:ring-2 focus:ring-[#365486]/50 text-sm"
                >
                  <CheckCheck size={18} />
                  <span>Marcar todas como leídas</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {(filter !== "all" || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 animate-fadeIn">
              <span className="text-xs font-medium text-gray-600">Filtros activos:</span>

              {filter !== "all" && (
                <div className="flex items-center gap-1 text-xs bg-[#365486]/10 text-[#365486] px-2 py-1 rounded-full">
                  {getFilterIcon()}
                  <span>{getFilterLabel()}</span>
                  <button
                    onClick={() => handleFilterChange("all")}
                    className="ml-1 text-[#365486]/70 hover:text-[#365486] transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {searchQuery && (
                <div className="flex items-center gap-1 text-xs bg-[#365486]/10 text-[#365486] px-2 py-1 rounded-full">
                  <Search size={12} />
                  <span className="max-w-[150px] truncate">{searchQuery}</span>
                  <button
                    onClick={handleClearSearch}
                    className="ml-1 text-[#365486]/70 hover:text-[#365486] transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="w-full">
          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="relative h-16 w-16 mb-6">
                <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-[#365486]/20 animate-spin"></div>
                <div className="absolute inset-3 rounded-full border-t-4 border-[#365486] animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bell size={20} className="text-[#365486]/60" />
                </div>
              </div>
              <p className="text-gray-700 font-medium">Cargando notificaciones...</p>
              <p className="text-gray-500 text-sm mt-1">Esto puede tomar un momento</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <p className="text-red-500 font-medium mb-2">{error}</p>
              <p className="text-gray-500 text-sm mb-6 max-w-md">
                No pudimos cargar tus notificaciones. Por favor, intenta de nuevo más tarde.
              </p>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-[#365486] text-white rounded-lg hover:bg-[#2a4372] transition-all shadow-sm"
              >
                <RefreshCw size={16} />
                <span>Intentar de nuevo</span>
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f5fb]">
                  <Inbox size={32} className="text-[#365486]/60" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-md border-2 border-[#f0f5fb]">
                  <Sparkles size={16} className="text-[#365486]" />
                </div>
              </div>
              <p className="text-[#365486] font-bold text-xl mb-2">¡Todo al día!</p>
              <p className="text-gray-500 text-sm max-w-md mb-6">
                {searchQuery
                  ? "No se encontraron notificaciones que coincidan con tu búsqueda"
                  : filter !== "all"
                    ? `No tienes notificaciones ${filter === "read" ? "leídas" : "sin leer"}`
                    : "No tienes notificaciones en este momento"}
              </p>
              {(searchQuery || filter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setFilter("all")
                    setIsSearchOpen(false)
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 shadow-sm text-sm"
                >
                  <X size={16} />
                  <span>Limpiar filtros</span>
                </button>
              )}
            </div>
          ) : (
            <div className="w-full divide-y divide-gray-100">
              {/* List Header - Only showing "Mensaje" as requested */}
              <div className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 hidden md:flex">
                <div className="w-8"></div>
                <div className="flex-1 ml-3">Mensaje</div>
              </div>

              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id_notification}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      {unreadCount > 0 && (
        <div className="fixed bottom-6 right-6 md:hidden z-10">
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#365486] to-[#4a6da8] text-white shadow-lg hover:shadow-xl hover:from-[#2a4372] hover:to-[#3d5a8c] transition-all text-sm"
          >
            <CheckCheck size={16} />
            <span>Marcar todas como leídas</span>
          </button>
        </div>
      )}

      {/* Animation Styles */}
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
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default NotificationsPage
