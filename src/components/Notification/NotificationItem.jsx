"use client"

import PropTypes from "prop-types"
import { CheckCircle, Trash2, Clock, AlertCircle } from "lucide-react"
import { formatRelativeDate } from "../../utils/dateUtils"

const NotificationItem = ({ notification, onMarkAsRead, onDelete, showActions = true }) => {
  const { id_notification, message, created_at, read_status } = notification

  // Formatear la fecha usando la utilidad centralizada
  const formattedDate = formatRelativeDate(created_at)

  return (
    <div
      className={`group relative border-b last:border-b-0 transition-all duration-200 ${
        read_status ? "bg-white hover:bg-gray-50" : "bg-blue-50/70 hover:bg-blue-50"
      }`}
    >
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          {/* Indicador de estado */}
          <div className="mt-0.5 shrink-0">
            {!read_status ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#365486]/10">
                <AlertCircle size={14} className="text-[#365486]" />
              </div>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                <Clock size={14} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0 pr-8">
            <p className={`text-sm ${read_status ? "text-gray-600" : "text-gray-800 font-medium"} line-clamp-2`}>
              {message}
            </p>
            <div className="mt-1 flex items-center text-xs text-gray-500">
              <span title={new Date(created_at).toLocaleString()}>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones flotantes - siempre visibles en móvil */}
      {showActions && (
        <div className="absolute right-2 top-2 flex items-center gap-1 sm:opacity-0 transition-opacity duration-200 sm:group-hover:opacity-100">
          {!read_status && (
            <button
              onClick={() => onMarkAsRead(id_notification)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors hover:bg-green-200"
              title="Marcar como leída"
            >
              <CheckCircle size={14} />
            </button>
          )}
          <button
            onClick={() => onDelete(id_notification)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
            title="Eliminar notificación"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id_notification: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    read_status: PropTypes.bool.isRequired,
    relativeDate: PropTypes.string,
  }).isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  showActions: PropTypes.bool,
}

export default NotificationItem
