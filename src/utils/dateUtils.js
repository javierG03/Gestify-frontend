/**
 * Formatea una fecha en formato relativo personalizado con reglas específicas:
 * - Menos de 59 segundos: "Ahora"
 * - Menos de 59 minutos: "Hace X minutos"
 * - Menos de 23 horas y 59 minutos: "Hace X horas"
 * - Hasta 5 días: "Hace X días"
 * - Más de 5 días: Fecha exacta (día y mes)
 *
 * @param {string|Date} date - La fecha a formatear
 * @returns {string} Fecha formateada según las reglas
 */
export const formatRelativeDate = (date) => {
  try {
    // Convertir a objeto Date si es string
    const dateObj = typeof date === "string" ? new Date(date) : new Date(date)

    // Ajustar la zona horaria (restar 5 horas)
    const adjustedDate = new Date(dateObj.getTime() - 5 * 60 * 60 * 1000)

    // Fecha actual
    const now = new Date()

    // Calcular diferencias de tiempo
    const diffMs = now - adjustedDate
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    // Aplicar reglas de formato
    if (diffSeconds < 60) {
      return "Ahora"
    } else if (diffMinutes < 60) {
      return `Hace ${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minutos"}`
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
    } else if (diffDays <= 5) {
      return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`
    } else {
      // Para fechas mayores a 5 días, mostrar fecha exacta (día y mes)
      const options = {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }

      return adjustedDate.toLocaleDateString("es-ES", options)
    }
  } catch (error) {
    console.error("Error al formatear fecha relativa:", error)
    return typeof date === "string" ? date : date.toString()
  }
}
