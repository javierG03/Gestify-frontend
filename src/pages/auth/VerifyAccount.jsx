"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"

const VerifyAccount = () => {
  const { token } = useParams() // Obtiene el token desde la URL
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [autoVerifying, setAutoVerifying] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL

  // Auto-verify on component mount
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/verify-email/${token}`)
        console.log("Verificación exitosa: ", res.data)

        Swal.fire({
          title: "Email Verificado",
          text: "Tu email ha sido verificado correctamente. Inicia sesión ahora",
          icon: "success",
          confirmButtonText: "Ir al Login",
          allowOutsideClick: false,
        }).then(() => {
          navigate("/login")
        })
      } catch (error) {
        console.error("Error de verificación:", error)
        setAutoVerifying(false)
        setMessage(
          error.response?.data?.error ||
            error.response?.data?.mensaje ||
            "Error al verificar la cuenta. Por favor, intenta de nuevo.",
        )
      } finally {
        setLoading(false)
      }
    }

    if (token && autoVerifying) {
      verifyEmail()
    }
  }, [token, navigate, API_URL])

  const handleVerify = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/verify-email/${token}`)
      console.log("Verificación exitosa: ", res.data)

      Swal.fire({
        title: "Email Verificado",
        text: "Tu email ha sido verificado correctamente. Inicia sesión ahora",
        icon: "success",
        confirmButtonText: "Ir al Login",
        allowOutsideClick: false,
      }).then(() => {
        navigate("/login")
      })
    } catch (error) {
      console.error("Error de verificación:", error)
      setMessage(
        error.response?.data?.error ||
          error.response?.data?.mensaje ||
          "Error al verificar la cuenta. Por favor, intenta de nuevo.",
      )
    } finally {
      setLoading(false)
    }
  }

  // If still loading from auto-verification, show loading state
  if (autoVerifying && loading) {
    return (
      <div className="w-full h-full min-h-screen bg-[#d9e6f5] flex flex-col items-center justify-center">
        <div className="w-[70%] sm:w-[70%] lg:w-[35%] bg-white flex flex-col justify-center items-center shadow-lg rounded-md p-10 gap-2">
          <h1 className="text-4xl font-bold mb-5 text-center">VERIFICANDO TU CUENTA</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#365486]"></div>
          <p className="mt-4 text-lg">Procesando verificación automática...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-screen bg-[#d9e6f5] flex flex-col items-center justify-center">
      <div className="w-[70%] sm:w-[70%] lg:w-[35%] bg-white flex flex-col justify-center items-center shadow-lg rounded-md p-10 gap-2">
        <h1 className="text-4xl font-bold mb-5 text-center">VERIFICA TU CUENTA</h1>
        <p className="text-lg text-center">Presiona "Confirmar" para verificar tu cuenta</p>

        {message && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 w-full">
            <p className="text-center">{message}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleVerify}
          disabled={loading}
          className={`w-[80%] sm:w-[45%] mt-4 py-2 px-2 rounded-lg transition-all duration-300 ease-in-out 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#365486] text-white hover:bg-[#344663] hover:scale-105"}`}
        >
          {loading ? "Verificando..." : "VERIFICAR"}
        </button>
      </div>
    </div>
  )
}

export default VerifyAccount
