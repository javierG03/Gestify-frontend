"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { ArrowLeft, Mail, AlertCircle, Send } from "lucide-react"

const ResetPassword = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)

  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

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

  // Validar mientras se escribe después del primer intento de envío
  useEffect(() => {
    if (formSubmitted) {
      validateEmail(email)
    }
  }, [email, formSubmitted])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Marcar como enviado para activar validaciones en tiempo real
    setFormSubmitted(true)

    // Validar campos
    const isEmailValid = validateEmail(email)

    // Solo intentar enviar si el email es válido
    if (!isEmailValid) {
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/request-password-reset`, { email })

      if (response.status === 200) {
        Swal.fire({
          title: '<span class="text-[#365486] font-bold">¡Correo Enviado!</span>',
          html: `
            <div class="flex flex-col items-center">
              <div class="mb-3 text-[#365486]">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <p class="text-gray-600 mb-1">Hemos enviado un enlace de recuperación a tu correo electrónico.</p>
              <p class="text-gray-600">Por favor, revisa tu bandeja de entrada para continuar con el proceso.</p>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: "Entendido",
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
          timer: 8000,
          timerProgressBar: true,
          showClass: {
            popup: "animate__animated animate__fadeInDown animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp animate__faster",
          },
        }).then(() => {
          setEmail("")
          setFormSubmitted(false)
        })
      }
    } catch (err) {
      console.error("Error en la recuperación de contraseña:", err)
      if (err.response?.status === 404) {
        setError("El correo electrónico no está registrado en nuestro sistema.")
      } else {
        setError(err.response?.data?.error || "Hubo un problema con la solicitud. Inténtalo de nuevo más tarde.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#d9e6f5] to-[#c5d8ed] flex flex-col items-center justify-center p-4 relative">
      {/* Botón para volver a la página de inicio */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#365486] hover:text-[#4a6da8] transition-colors duration-300 font-medium z-10"
      >
        <ArrowLeft size={20} />
        <span>Volver al inicio de sesión</span>
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#e0e7f2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#365486]" />
            </div>
            <h1 className="text-2xl font-bold text-[#365486]">Recuperar Contraseña</h1>
            <p className="text-gray-600 mt-2">Ingresa tu correo electrónico para recibir un enlace de recuperación</p>
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
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  className={`w-full bg-white border-2 ${
                    emailError && formSubmitted ? "border-red-300" : "border-gray-300"
                  } pl-10 pr-3 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a6b4e0]`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => formSubmitted && validateEmail(email)}
                />
              </div>
              {emailError && formSubmitted && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#365486] text-white py-2 px-4 rounded-lg transition-all duration-300 ease-in-out ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#344663] hover:shadow-md"
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <span className="flex items-center">
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
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center">
                  Enviar enlace
                  <Send size={16} className="ml-2" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Recordaste tu contraseña?{" "}
              <a href="/login" className="font-semibold text-[#8d9bd6] hover:underline">
                Iniciar sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
