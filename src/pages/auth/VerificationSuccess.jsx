"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Swal from "sweetalert2"

const VerificationSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("loading") // loading, success, error
  const [message, setMessage] = useState("")

  const email = searchParams.get("email")
  const verified = searchParams.get("verified")

  useEffect(() => {
    if (verified === "true") {
      setStatus("success")
      setMessage("Tu correo electrónico ha sido verificado correctamente.")

      // Show success message after a short delay
      const timer = setTimeout(() => {
        Swal.fire({
          title: "Email Verificado",
          text: "Tu email ha sido verificado correctamente. Inicia sesión ahora",
          icon: "success",
          confirmButtonText: "Ir al Login",
          allowOutsideClick: false,
        }).then(() => {
          navigate("/login")
        })
      }, 1000)

      return () => clearTimeout(timer)
    } else if (verified === "false") {
      setStatus("error")
      setMessage(searchParams.get("message") || "Error al verificar la cuenta.")
    } else {
      // If no parameters, redirect to home
      navigate("/")
    }
  }, [verified, navigate, searchParams])

  return (
    <div className="w-full h-full min-h-screen bg-[#d9e6f5] flex flex-col items-center justify-center">
      <div className="w-[70%] sm:w-[70%] lg:w-[35%] bg-white flex flex-col justify-center items-center shadow-lg rounded-md p-10 gap-2">
        <h1 className="text-4xl font-bold mb-5 text-center">VERIFICACIÓN DE CUENTA</h1>

        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#365486]"></div>
            <p className="mt-4 text-lg">Procesando verificación...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
              <p className="text-lg text-center">{message}</p>
              {email && <p className="text-center mt-2">Email: {email}</p>}
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              <p className="text-lg text-center">{message}</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-[80%] sm:w-[45%] mt-4 py-2 px-2 rounded-lg transition-all duration-300 ease-in-out bg-[#365486] text-white hover:bg-[#344663] hover:scale-105"
            >
              IR AL LOGIN
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerificationSuccess
