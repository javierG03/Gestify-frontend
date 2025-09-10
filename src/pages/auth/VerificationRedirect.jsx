"use client"

import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const VerificationRedirect = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Extract query parameters from the URL
    const searchParams = new URLSearchParams(location.search)
    const verified = searchParams.get("verified")
    const email = searchParams.get("email")
    const message = searchParams.get("message")

    // Redirect to the verification success page with the parameters
    navigate(`/verification-success?verified=${verified || "false"}&email=${email || ""}&message=${message || ""}`)
  }, [navigate, location])

  return (
    <div className="w-full h-full min-h-screen bg-[#d9e6f5] flex flex-col items-center justify-center">
      <div className="w-[70%] sm:w-[70%] lg:w-[35%] bg-white flex flex-col justify-center items-center shadow-lg rounded-md p-10 gap-2">
        <h1 className="text-4xl font-bold mb-5 text-center">REDIRIGIENDO</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#365486]"></div>
        <p className="mt-4 text-lg">Procesando verificación...</p>
      </div>
    </div>
  )
}

export default VerificationRedirect
