"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { ArrowLeft, Eye, EyeOff, CheckCircle, XCircle, User, Mail, Lock } from "lucide-react"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    id_role: 3,
  })

  const [errors, setErrors] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [generalError, setGeneralError] = useState("")

  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  // Validar un campo específico
  const validateField = (fieldName, value = formData[fieldName]) => {
    let errorMessage = ""

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          errorMessage = "El nombre es obligatorio"
        } else if (value.trim().length < 2) {
          errorMessage = "El nombre debe tener al menos 2 caracteres"
        }
        break

      case "last_name":
        if (!value.trim()) {
          errorMessage = "El apellido es obligatorio"
        } else if (value.trim().length < 2) {
          errorMessage = "El apellido debe tener al menos 2 caracteres"
        }
        break

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) {
          errorMessage = "El correo electrónico es obligatorio"
        } else if (!emailRegex.test(value)) {
          errorMessage = "Por favor, ingresa un correo electrónico válido"
        }
        break

      case "password":
        if (!value.trim()) {
          errorMessage = "La contraseña es obligatoria"
        } else if (!Object.values(passwordValidations).every(Boolean)) {
          errorMessage = "La contraseña debe cumplir con todos los requisitos"
        }
        break

      case "confirmPassword":
        if (!value.trim()) {
          errorMessage = "Confirmar la contraseña es obligatorio"
        } else if (value !== formData.password) {
          errorMessage = "Las contraseñas no coinciden"
        }
        break

      default:
        break
    }

    // Actualizar el estado de errores
    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }))

    return errorMessage === ""
  }

  // Validar mientras se escribe después del primer intento de envío
  useEffect(() => {
    if (formSubmitted) {
      Object.keys(formData).forEach((field) => {
        if (field !== "id_role") {
          validateField(field)
        }
      })
    }
  }, [formData, formSubmitted])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "name" || name === "last_name") {
      // Permitir solo letras y espacios
      if (/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value })
      }
    } else if (name === "password") {
      // Validar la contraseña en tiempo real
      const validations = {
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        specialChar: /[@$!%*?&]/.test(value),
      }
      setPasswordValidations(validations)
      setFormData({ ...formData, password: value })

      // Si cambia la contraseña, validar también la confirmación
      if (formData.confirmPassword) {
        validateField("confirmPassword", formData.confirmPassword)
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const validateForm = () => {
    // Validar cada campo
    const nameValid = validateField("name")
    const lastNameValid = validateField("last_name")
    const emailValid = validateField("email")
    const passwordValid = validateField("password")
    const confirmPasswordValid = validateField("confirmPassword")

    // Devolver true si todos los campos son válidos
    return nameValid && lastNameValid && emailValid && passwordValid && confirmPasswordValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitted(true)
    setGeneralError("")

    if (!validateForm()) return

    setLoading(true)
    try {
      // Eliminar confirmPassword antes de enviar
      const { confirmPassword, ...userData } = formData

      const res = await axios.post(`${API_URL}/users`, userData)
      console.log("Respuesta del backend:", res.data)

      // Definir el icono de éxito personalizado
      const successIcon = `
        <div class="swal2-icon swal2-success swal2-animate-success-icon" style="display: flex;">
          <div class="swal2-success-circular-line-left" style="background-color: rgb(255, 255, 255);"></div>
          <span class="swal2-success-line-tip"></span>
          <span class="swal2-success-line-long"></span>
          <div class="swal2-success-ring"></div>
          <div class="swal2-success-fix" style="background-color: rgb(255, 255, 255);"></div>
          <div class="swal2-success-circular-line-right" style="background-color: rgb(255, 255, 255);"></div>
        </div>
      `

      Swal.fire({
        title: '<span class="text-[#365486] font-bold">¡Registro Exitoso!</span>',
        html: `
          <div class="flex flex-col items-center">
            <div class="mb-3 text-[#365486]">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <p class="text-gray-600 mb-1">Hemos enviado un token de verificación a tu correo electrónico.</p>
            <p class="text-gray-600">Por favor, revisa tu bandeja de entrada para completar el proceso.</p>
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
      })

      setFormData({
        name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        id_role: 1,
      })
      navigate("/login")
    } catch (error) {
      console.error("Error en el registro:", error)

      // Manejar errores específicos
      if (error.response?.data?.error?.includes("email")) {
        setErrors((prev) => ({
          ...prev,
          email: "Este correo electrónico ya está registrado",
        }))
      } else {
        setGeneralError(error.response?.data?.error || "Error al registrar usuario")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#d9e6f5] to-[#c5d8ed] flex flex-col items-center justify-center p-4 relative">
      {/* Barra superior con botón de volver para móviles */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm py-3 px-4 md:hidden">
        <button
          onClick={() => (window.location.href = "http://localhost:5173/#home")}
          className="flex items-center gap-2 text-[#365486] hover:text-[#4a6da8] transition-colors duration-300 font-medium"
        >
          <ArrowLeft size={18} />
          <span>Volver al inicio</span>
        </button>
      </div>

      {/* Botón para volver a la página de inicio (solo desktop) */}
      <button
        onClick={() => (window.location.href = "http://localhost:5173/#home")}
        className="absolute top-6 left-6 hidden md:flex items-center gap-2 text-[#365486] hover:text-[#4a6da8] transition-colors duration-300 font-medium z-10"
      >
        <ArrowLeft size={20} />
        <span>Volver al inicio</span>
      </button>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl mt-14 md:mt-0">
        <div className="flex flex-col lg:flex-row">
          {/* Sección de imagen */}
          <div className="hidden lg:flex lg:w-2/5 bg-[#f0f5fb] flex-col items-center justify-center border-r border-gray-200 p-6">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full max-w-md object-contain"
              alt="Ilustración de registro"
            />
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-[#365486]">¡Únete a nosotros!</h2>
              <p className="mt-1 text-gray-600">Crea tu cuenta para acceder a todas las funcionalidades</p>
            </div>
          </div>

          {/* Sección de formulario */}
          <div className="w-full lg:w-3/5 p-6">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-[#365486]">REGISTRO DE USUARIO</h1>
              <p className="text-gray-600 mt-1 text-sm">Completa el formulario para crear tu cuenta</p>
            </div>

            {generalError && (
              <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs w-full max-w-lg mx-auto">
                <div className="flex items-center">
                  <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{generalError}</span>
                </div>
              </div>
            )}

            <form className="w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                {/* Nombre */}
                <div className="relative">
                  <label htmlFor="name" className="text-black font-medium block mb-1 text-sm">
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      placeholder="Ingresa tu nombre"
                      className={`w-full bg-white border-2 ${
                        errors.name && formSubmitted ? "border-red-300" : "border-gray-300"
                      } pl-9 pr-3 py-1.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a6b4e0] text-sm`}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => formSubmitted && validateField("name")}
                    />
                  </div>
                  {errors.name && formSubmitted && (
                    <div className="h-5 mt-1">
                      <p className="text-red-500 text-xs">{errors.name}</p>
                    </div>
                  )}
                  {!errors.name && <div className="h-5"></div>}
                </div>

                {/* Apellido */}
                <div className="relative">
                  <label htmlFor="last_name" className="text-black font-medium block mb-1 text-sm">
                    Apellido
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="last_name"
                      placeholder="Ingresa tu apellido"
                      className={`w-full bg-white border-2 ${
                        errors.last_name && formSubmitted ? "border-red-300" : "border-gray-300"
                      } pl-9 pr-3 py-1.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a6b4e0] text-sm`}
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      onBlur={() => formSubmitted && validateField("last_name")}
                    />
                  </div>
                  {errors.last_name && formSubmitted && (
                    <div className="h-5 mt-1">
                      <p className="text-red-500 text-xs">{errors.last_name}</p>
                    </div>
                  )}
                  {!errors.last_name && <div className="h-5"></div>}
                </div>

                {/* Email - ocupa todo el ancho */}
                <div className="relative md:col-span-2">
                  <label htmlFor="email" className="text-black font-medium block mb-1 text-sm">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      placeholder="Ingresa tu correo electrónico"
                      className={`w-full bg-white border-2 ${
                        errors.email && formSubmitted ? "border-red-300" : "border-gray-300"
                      } pl-9 pr-3 py-1.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a6b4e0] text-sm`}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => formSubmitted && validateField("email")}
                    />
                  </div>
                  {errors.email && formSubmitted && (
                    <div className="h-5 mt-1">
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    </div>
                  )}
                  {!errors.email && <div className="h-5"></div>}
                </div>

                {/* Contraseña */}
                <div className="relative">
                  <label htmlFor="password" className="text-black font-medium block mb-1 text-sm">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      placeholder="Ingresa tu contraseña"
                      className={`w-full bg-white border-2 ${
                        errors.password && formSubmitted ? "border-red-300" : "border-gray-300"
                      } pl-9 pr-9 py-1.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a6b4e0] text-sm`}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => formSubmitted && validateField("password")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && formSubmitted && (
                    <div className="h-5 mt-1">
                      <p className="text-red-500 text-xs">{errors.password}</p>
                    </div>
                  )}
                  {!errors.password && <div className="h-5"></div>}
                </div>

                {/* Confirmar Contraseña */}
                <div className="relative">
                  <label htmlFor="confirmPassword" className="text-black font-medium block mb-1 text-sm">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      placeholder="Confirma tu contraseña"
                      className={`w-full bg-white border-2 ${
                        errors.confirmPassword && formSubmitted ? "border-red-300" : "border-gray-300"
                      } pl-9 pr-9 py-1.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a6b4e0] text-sm`}
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => formSubmitted && validateField("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && formSubmitted && (
                    <div className="h-5 mt-1">
                      <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                    </div>
                  )}
                  {!errors.confirmPassword && <div className="h-5"></div>}
                </div>
              </div>

              {/* Validaciones de contraseña */}
              <div className="mt-2 mb-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-1.5">La contraseña debe tener:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
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

              <div className="flex justify-center mt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full md:w-[60%] bg-[#365486] text-white py-2 px-4 rounded-lg transition-all duration-300 ease-in-out ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#344663] hover:scale-[1.02]"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                      Registrando...
                    </span>
                  ) : (
                    "CREAR CUENTA"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <div className="flex-row sm:flex text-center gap-1 justify-center">
                <p className="text-gray-600 text-sm">¿Ya tienes cuenta?</p>
                <a href="/login" className="font-semibold text-sm hover:underline text-[#8d9bd6]">
                  Inicia Sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
