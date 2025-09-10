"use client"

import { useState, useEffect } from "react"

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("services")
      if (section) {
        const sectionPosition = section.getBoundingClientRect()
        if (sectionPosition.top < window.innerHeight * 0.75) {
          setIsVisible(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Verificar visibilidad inicial
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="bg-gray-100 px-6 py-12 md:px-16 md:py-20" id="services">
      <div className="container mx-auto">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Texto */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#365486] mb-4">Servicios</h2>
            <p className="text-base md:text-lg text-gray-600">
              Nuestro sistema de gestión de eventos con planificación automática está diseñado para facilitar la
              organización y ejecución de eventos. Con solo unos clics, puedes automatizar la planificación y garantizar
              un evento exitoso.
            </p>
          </div>

          {/* Mini cards con servicios */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            {/* Servicio 1: Planificación Automática */}
            <div
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-80 transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex justify-center mb-4">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#365486" strokeWidth="2" />
                  <path d="M3 10H21" stroke="#365486" strokeWidth="2" />
                  <path d="M9 3V7" stroke="#365486" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15 3V7" stroke="#365486" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 14H10" stroke="#365486" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 14H16" stroke="#365486" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 18H10" stroke="#365486" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 18H16" stroke="#365486" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h4 className="font-semibold text-[#365486] text-center text-lg mb-2">Planificación Automática</h4>
              <p className="text-sm text-gray-600 text-center">
                Automatiza la programación de tareas, recordatorios y recursos necesarios para tus eventos sin esfuerzo
                manual.
              </p>
            </div>

            {/* Servicio 2: Gestión de Usuario */}
            <div
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-80 transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex justify-center mb-4">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
                    stroke="#365486"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.90625 20.2491C3.82834 18.6531 5.1542 17.3278 6.75064 16.4064C8.34708 15.485 10.1579 15 12.0011 15C13.8444 15 15.6552 15.4851 17.2516 16.4065C18.848 17.3279 20.1739 18.6533 21.0959 20.2493"
                    stroke="#365486"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-[#365486] text-center text-lg mb-2">Gestión de Usuario</h4>
              <p className="text-sm text-gray-600 text-center">
                Administra fácilmente tus usuarios, asigna roles y gestiona sus permisos para un control total.
              </p>
            </div>

            {/* Servicio 3: Reportes en Tiempo Real */}
            <div
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-80 transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex justify-center mb-4">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 20V10" stroke="#365486" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 20V4" stroke="#365486" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 20V14" stroke="#365486" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4 className="font-semibold text-[#365486] text-center text-lg mb-2">Reportes en Tiempo Real</h4>
              <p className="text-sm text-gray-600 text-center">
                Visualiza y controla el progreso de tu evento en tiempo real, con datos precisos y gráficos que te
                ayudan a tomar decisiones rápidas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
