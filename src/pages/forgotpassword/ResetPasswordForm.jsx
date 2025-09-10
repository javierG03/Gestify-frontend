"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { ArrowLeft, Eye, EyeOff, CheckCircle, XCircle, Lock, AlertCircle } from "lucide-react"

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const [tokenChecking, setTokenChecking] = useState(true)
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  const { token } = useParams()
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  // Verificar si el token es válido al cargar el componente
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false)
        setTokenChecking(false)
        setError("Token no proporcionado. Por favor, solicita un nuevo enlace de recuperación.")
        return
      }

      try {
        const response = await axios.get(`${API_URL}/reset-password/${token}`)
        if (response.status === 200) {
          setTokenValid(true)
        }
      } catch (err) {
        console.error("Error al verificar el token:", err)
        setError(
          err.response?.data?.error ||
            "Token inválido o expirado. Por favor, solicita un nuevo enlace de recuperación.",
        )
        setTokenValid(false)
      } finally {
        setTokenChecking(false)
      }
    }

    verifyToken()
  }, [token, API_URL])

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    }

    setPasswordValidations(validations)

    if (!password.trim()) {
      setPasswordError("La contraseña es obligatoria")
      return false
    } else if (!Object.values(validations).every(Boolean)) {
      setPasswordError("La contraseña debe cumplir con todos los requisitos")
      return false
    }

    setPasswordError("")
    return true
  }

  const validateConfirmPassword = (confirmPassword, password = formData.newPassword) => {
    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Confirmar la contraseña es obligatorio")
      return false
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden")
      return false
    }

    setConfirmPasswordError("")
    return true
  }

  // Validar mientras se escribe después del primer intento de envío
  useEffect(() => {
    if (formSubmitted) {
      validatePassword(formData.newPassword)
      validateConfirmPassword(formData.confirmNewPassword)
    }
  }, [formData, formSubmitted])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (name === "newPassword") {
      validatePassword(value)
      // Si ya hay un valor en confirmPassword, validarlo también
      if (formData.confirmNewPassword && formSubmitted) {
        validateConfirmPassword(formData.confirmNewPassword, value)
      }
    }

    if (name === "confirmNewPassword" && formSubmitted) {
      validateConfirmPassword(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setFormSubmitted(true)

    const { newPassword, confirmNewPassword } = formData

    // Validar campos
    const isPasswordValid = validatePassword(newPassword)
    const isConfirmPasswordValid = validateConfirmPassword(confirmNewPassword)

    // Solo intentar actualizar si ambos campos son válidos
    if (!isPasswordValid || !isConfirmPasswordValid) {
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        newPassword,
      })

      if (response.status === 200) {
        Swal.fire({
          title: '<span class="text-[#365486] font-bold">¡Contraseña Actualizada!</span>',
          html: `
            <div class="flex flex-col items-center">
              <div class="mb-3 text-[#365486]">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <p class="text-gray-600 mb-1">Tu contraseña ha sido actualizada correctamente.</p>
              <p class="text-gray-600">Ahora puedes iniciar sesión con tu nueva contraseña.</p>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: "Ir a iniciar sesión",
          confirmButtonColor: "#365486",
          customClass: {
            popup: "rounded-xl",
            title: "text-xl",
            htmlContainer: "py-4",
            confirmButton: "px-6 py-2 rounded-lg text-sm font-medium",
          },
          buttonsStyling: true,
          allowOutsideClick: false,
          backdrop: `rgba(54, 84, 134, 0.4)`,
          showClass: {
            popup: "animate__animated animate__fadeInDown animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp animate__faster",
          },
        }).then(() => navigate("/login"))
      }
    } catch (err) {
      console.error("Error en la actualización de contraseña:", err)
      if (err.response?.status === 400) {
        setError("El token es inválido o ha expirado. Por favor, solicita un nuevo enlace de recuperación.")
      } else {
        setError(
          err.response?.data?.error || "Hubo un problema al actualizar la contraseña. Inténtalo de nuevo más tarde.",
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // Mostrar pantalla de carga mientras se verifica el token
  if (tokenChecking) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#d9e6f5] to-[#c5d8ed] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#365486] mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando enlace de recuperación...</p>
        </div>
      </div>
    )
  }

  // Mostrar error si el token no es válido
  if (!tokenValid && !tokenChecking) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#d9e6f5] to-[#c5d8ed] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-[#365486] mb-2">Enlace inválido o expirado</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/reset-password")}
            className="bg-[#365486] text-white py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#344663]"
          >
            Solicitar nuevo enlace
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#d9e6f5] to-[#c5d8ed] flex flex-col items-center justify-center p-4 relative">
      {/* Botón para volver a la página de inicio */}
      <button
        onClick={() => navigate("/reset-password")}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#365486] hover:text-[#4a6da8] transition-colors duration-300 font-medium z-10"
      >
        <ArrowLeft size={20} />
        <span>Volver a recuperación</span>
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#e0e7f2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#365486]" />
            </div>
            <h1 className="text-2xl font-bold text-[#365486]">Nueva Contraseña</h1>
            <p className="text-gray-600 mt-2">Crea una nueva contraseña segura para tu cuenta</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <p className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nueva contraseña */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu nueva contraseña"
                  className={`w-full bg-white border-2 ${
                    passwordError && formSubmitted ? "border-red-300" : "border-gray-300"
                  } pl-10 pr-10 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a6b4e0]`}
                  value={formData.newPassword}
                  onChange={handleChange}
                  onBlur={() => formSubmitted && validatePassword(formData.newPassword)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && formSubmitted && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

            {/* Validaciones de contraseña */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">La contraseña debe tener:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <div
                  className={`flex items-center text-xs ${
                    passwordValidations.length ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {passwordValidations.length ? (
                    <CheckCircle size={12} className="mr-1" />
                  ) : (
                    <XCircle size={12} className="mr-1" />
                  )}
                  Mínimo 8 caracteres
                </div>
                <div
                  className={`flex items-center text-xs ${
                    passwordValidations.uppercase ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {passwordValidations.uppercase ? (
                    <CheckCircle size={12} className="mr-1" />
                  ) : (
                    <XCircle size={12} className="mr-1" />
                  )}
                  Una letra mayúscula
                </div>
                <div
                  className={`flex items-center text-xs ${
                    passwordValidations.lowercase ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {passwordValidations.lowercase ? (
                    <CheckCircle size={12} className="mr-1" />
                  ) : (
                    <XCircle size={12} className="mr-1" />
                  )}
                  Una letra minúscula
                </div>
                <div
                  className={`flex items-center text-xs ${
                    passwordValidations.number ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {passwordValidations.number ? (
                    <CheckCircle size={12} className="mr-1" />
                  ) : (
                    <XCircle size={12} className="mr-1" />
                  )}
                  Un número
                </div>
                <div
                  className={`flex items-center text-xs ${
                    passwordValidations.specialChar ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {passwordValidations.specialChar ? (
                    <CheckCircle size={12} className="mr-1" />
                  ) : (
                    <XCircle size={12} className="mr-1" />
                  )}
                  Un carácter especial (@$!%*?&)
                </div>
              </div>
            </div>

            {/* Confirmar nueva contraseña */}
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar nueva contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirma tu nueva contraseña"
                  className={`w-full bg-white border-2 ${
                    confirmPasswordError && formSubmitted ? "border-red-300" : "border-gray-300"
                  } pl-10 pr-10 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a6b4e0]`}
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  onBlur={() => formSubmitted && validateConfirmPassword(formData.confirmNewPassword)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPasswordError && formSubmitted && (
                <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#365486] text-white py-2 px-4 rounded-lg transition-all duration-300 ease-in-out ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#344663] hover:shadow-md"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Actualizando...
                </span>
              ) : (
                "Actualizar contraseña"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordForm
