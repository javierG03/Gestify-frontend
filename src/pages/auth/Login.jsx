"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, AlertCircle, Check, Eye, EyeOff } from "lucide-react"
import axiosInstance from "../../config/AxiosInstance"
import { AuthContext } from "../../config/AuthProvider"
import Chatbot from "../../components/ChatBot"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, role, isAuthenticated, authInitialized } = useContext(AuthContext)
  const navigate = useNavigate()

  // Estados para validación
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Estado para el modal de verificación
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState("")
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [verificationError, setVerificationError] = useState("")
  const [verificationSuccess, setVerificationSuccess] = useState(false)

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setEmailError("El correo electrónico es obligatorio")
      return false
    } else if (!emailRegex.test(email)) {
      setEmailError("Por favor, ingresa un correo electrónico válido")
      return false
    }
    setEmailError("")
    return true
  }

  // Validar contraseña
  const validatePassword = (password) => {
    if (!password.trim()) {
      setPasswordError("La contraseña es obligatoria")
      return false
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres")
      return false
    }
    setPasswordError("")
    return true
  }

  // Validar mientras se escribe después del primer intento de envío
  useEffect(() => {
    if (formSubmitted) {
      validateEmail(email)
      validatePassword(password)
    }
  }, [email, password, formSubmitted])

  // Redirección según el rol después de login exitoso
  useEffect(() => {
    if (authInitialized && isAuthenticated) {
      if (role === 1 || role === 2) {
        navigate("/dashboard/inicio")
      } else if (role) {
        navigate("/dashboard/events")
      }
    }
  }, [isAuthenticated, role, authInitialized, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    // Marcar como enviado para activar validaciones en tiempo real
    setFormSubmitted(true)

    // Validar campos
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    // Solo intentar login si ambos campos son válidos
    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setIsLoading(true)
    try {
      const { data } = await axiosInstance.post("/login", {
        email,
        password,
      })

      if (data.error) {
        setError(data.error)
        return
      }

      localStorage.setItem("access_token", data.token)
      await login(data.token)
      // La redirección se maneja en el useEffect de arriba según el rol
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Error en el servidor")
      } else if (err.request) {
        setError("No hay respuesta del servidor. Verifica tu conexión.")
      } else {
        setError("Error desconocido. Intenta de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Función para manejar la solicitud de correo de verificación
  const handleRequestVerification = async (e) => {
    e.preventDefault()
    setVerificationError("")

    if (!verificationEmail.trim() || !verificationEmail.includes("@")) {
      setVerificationError("Por favor ingresa un correo electrónico válido")
      return
    }

    setVerificationLoading(true)
    try {
      await axiosInstance.post("/resend-verification-email", {
        email: verificationEmail.trim(),
      })

      setVerificationSuccess(true)
      setVerificationEmail("")
    } catch (err) {
      setVerificationError(err.response?.data?.error || "Error al enviar el correo de verificación. Intenta de nuevo.")
    } finally {
      setVerificationLoading(false)
    }
  }

  // Función para cerrar el modal y resetear estados
  const closeVerificationModal = () => {
    setShowVerificationModal(false)
    setVerificationEmail("")
    setVerificationError("")
    setVerificationSuccess(false)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#d9e6f5] to-[#c5d8ed] flex flex-col items-center justify-center p-4 relative">
      {/* Botón para volver a la página de inicio */}
      <button
        onClick={() => (window.location.href = "http://localhost:5173/#home")}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#365486] hover:text-[#4a6da8] transition-colors duration-300 font-medium z-10"
      >
        <ArrowLeft size={20} />
        <span>Volver al inicio</span>
      </button>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col lg:flex-row">
          {/* Sección de imagen */}
          <div className="hidden lg:flex lg:w-1/2 bg-[#f0f5fb] flex-col items-center justify-center border-r border-gray-200 p-8">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full max-w-md object-contain"
              alt="Ilustración de login"
            />
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-[#365486]">¡Bienvenido de nuevo!</h2>
              <p className="mt-2 text-gray-600">Accede a tu cuenta para gestionar tus actividades</p>
            </div>
          </div>

          {/* Sección de formulario */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col items-center">
            <div className="text-center mb-6 w-full">
              <h1 className="text-3xl font-bold text-[#365486]">INICIO DE SESIÓN</h1>
              <p className="text-gray-600 mt-2">Ingresa tus credenciales para continuar</p>
            </div>

            {error && (
              <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm w-full lg:w-[80%]">
                <p className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </p>
              </div>
            )}

            <form className="w-full flex flex-col items-center" onSubmit={handleLogin}>
              {/* Input de correo electrónico */}
              <div className="w-full lg:w-[80%] mb-3">
                <label htmlFor="email" className="text-black font-medium block mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  placeholder="Ingresa tu correo"
                  className="w-full bg-white border-2 border-gray-300 px-4 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a6b4e0]"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => formSubmitted && validateEmail(email)}
                />
                {emailError && formSubmitted && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>

              {/* Input de contraseña */}
              <div className="w-full lg:w-[80%] relative mb-3">
                <label htmlFor="password" className="text-black font-medium block mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    placeholder="Ingresa tu contraseña"
                    className="w-full bg-white border-2 border-gray-300 px-4 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a6b4e0]"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => formSubmitted && validatePassword(password)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && formSubmitted && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
              </div>

              <div className="w-full lg:w-[80%] flex justify-end mb-3">
                <a
                  href="/reset-password"
                  className="text-[#365486] hover:text-[#4a6da8] text-sm font-medium transition-colors duration-300"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-[80%] sm:w-[45%] bg-[#365486] text-white py-2 px-2 rounded-lg transition-all duration-300 ease-in-out ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#344663] hover:scale-105"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Procesando...
                  </span>
                ) : (
                  "INICIAR SESIÓN"
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <div className="flex-row sm:flex text-center gap-2 justify-center">
                <p className="text-gray-600">¿No tienes cuenta?</p>
                <a href="/register" className="font-semibold text-md hover:underline text-[#8d9bd6]">
                  Regístrate
                </a>
              </div>

              {/* Enlace para solicitar correo de verificación */}
              <div className="flex-row sm:flex text-center gap-2 justify-center">
                <p className="text-gray-600">¿No recibiste correo de verificación?</p>
                <button
                  onClick={() => setShowVerificationModal(true)}
                  className="font-semibold text-md hover:underline text-[#8d9bd6] inline"
                >
                  Solicitar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para solicitar correo de verificación con fondo distorsionado */}
      {showVerificationModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            {/* Cabecera del modal */}
            <div className="p-6 bg-[#f0f5fb] flex flex-col items-center">
              <div className="w-16 h-16 bg-[#e0e7f2] rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-[#365486]" />
              </div>
              <h3 className="text-xl font-bold text-[#365486]">Verificación de cuenta</h3>
            </div>

            {/* Contenido del modal */}
            {!verificationSuccess ? (
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-center">
                  Ingresa tu correo electrónico para recibir un nuevo enlace de verificación y activar tu cuenta.
                </p>

                {verificationError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    <p className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{verificationError}</span>
                    </p>
                  </div>
                )}

                <form onSubmit={handleRequestVerification}>
                  <div className="mb-4">
                    <label htmlFor="verification-email" className="block text-black font-medium mb-1">
                      Correo electrónico
                    </label>
                    <input
                      id="verification-email"
                      type="email"
                      className="w-full bg-white border-2 border-gray-300 px-4 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a6b4e0]"
                      placeholder="Ingresa tu correo"
                      value={verificationEmail}
                      onChange={(e) => setVerificationEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      onClick={closeVerificationModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 bg-[#365486] text-white rounded-lg hover:bg-[#4a6da8] transition-all duration-300 ${
                        verificationLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      disabled={verificationLoading}
                    >
                      {verificationLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Enviando...
                        </span>
                      ) : (
                        "Enviar correo"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">¡Correo enviado!</h3>
                <p className="text-gray-600 mb-6">
                  Hemos enviado un correo de verificación a tu dirección de email. Por favor, revisa tu bandeja de
                  entrada y sigue las instrucciones para activar tu cuenta.
                </p>
                <button
                  className="w-full py-2 bg-[#365486] text-white rounded-lg hover:bg-[#4a6da8] transition-colors"
                  onClick={closeVerificationModal}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            )}
          </div>
        </div>

      )}
     

      {/* Estilos para la animación de entrada */}

      <style>{`
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
      `}</style>
    </div>
  )
}

export default Login