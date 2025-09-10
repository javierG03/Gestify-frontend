"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom" // Cambiado a react-router-dom

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Añadir animación de entrada al cargar la página
    setIsVisible(true)
  }, [])

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#f0f5fb] to-white" id="home">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div
          className={`flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Sección de texto */}
          <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
            <div className="inline-flex items-center px-3 py-1.5 bg-[#e0e7f2] rounded-full mb-2">
              <span className="text-[#365486] text-sm font-medium">Planificación Inteligente</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#365486] leading-tight">
              Sistema de Gestión de Eventos con Planificación Automática
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Organiza tus eventos de manera eficiente con nuestra plataforma que automatiza la planificación,
              <span className="font-semibold text-[#365486]"> optimiza tiempos</span> y asegura el éxito en cada evento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/register"
                className="bg-[#365486] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#2a3f68] hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-center"
              >
                Regístrate ahora
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="bg-white text-[#365486] border-2 border-[#365486] px-6 py-3 rounded-lg hover:bg-[#f0f5fb] transition-all duration-300 flex items-center justify-center gap-2 text-center"
              >
                Iniciar sesión
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-[#d9e6f5] flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`}
                      alt={`Usuario ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#365486] flex items-center justify-center text-white text-xs font-medium">
                  +50
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Más de <span className="font-semibold">50 organizadores</span> confían en nosotros
              </p>
            </div>
          </div>

          {/* Sección de imagen */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#f0f5fb] rounded-full blur-2xl opacity-70"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#d9e6f5] rounded-full blur-2xl opacity-70"></div>

            <div className="relative bg-white p-2 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="absolute -top-3 -right-3 bg-[#365486] text-white text-xs font-bold px-3 py-1 rounded-full">
                EventosIA
              </div>

              <img src="img/event_management.webp" alt="Gestión de eventos" className="w-full h-auto rounded-xl" />

              <div className="absolute -bottom-4 -left-4 bg-white shadow-lg rounded-lg p-3 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="#22C55E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Planificación automática</p>
                  <p className="text-xs text-gray-500">Ahorra hasta 5 horas por evento</p>
                </div>
              </div>

              <div className="absolute top-1/3 -right-4 bg-white shadow-lg rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-full">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#3B82F6"
                        strokeWidth="2"
                      />
                      <path d="M12 6V12L16 14" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium">Optimización de tiempo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
