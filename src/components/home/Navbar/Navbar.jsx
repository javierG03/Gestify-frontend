"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detectar scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Función para manejar la navegación a home
  const navigateToHome = (e) => {
    e.preventDefault()
    // Usar scrollIntoView para una navegación más confiable
    const homeElement = document.getElementById("home")
    if (homeElement) {
      homeElement.scrollIntoView({ behavior: "smooth" })
    } else {
      // Fallback si no encuentra el elemento
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (isOpen) toggleMenu()
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2 bg-white shadow-md" : "py-4 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      }`}
      id="navbar"
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo - Sin imagen */}
        <a href="#home" className="flex items-center group" onClick={navigateToHome}>
          <h1 className="text-2xl font-bold text-[#365486] group-hover:text-[#4a6da8] transition-colors">EventosIA</h1>
        </a>

        {/* Menú en desktop */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <a
              href="#home"
              className="text-[#365486] font-medium hover:text-[#4a6da8] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#4a6da8] after:transition-all hover:after:w-full"
              onClick={navigateToHome}
            >
              Inicio
            </a>
            <a
              href="#services"
              className="text-[#365486] font-medium hover:text-[#4a6da8] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#4a6da8] after:transition-all hover:after:w-full"
            >
              Servicios
            </a>
            <a
              href="#contact"
              className="text-[#365486] font-medium hover:text-[#4a6da8] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#4a6da8] after:transition-all hover:after:w-full"
            >
              Contacto
            </a>
          </div>
          <a
            href="/login"
            className="bg-[#365486] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#2a3f68] hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Ingresar
          </a>
        </div>

        {/* Icono de hamburguesa (toggle menu) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-[#365486] hover:text-[#4a6da8] transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú desplegable (toggle) */}
      <div
        className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-64 border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="container mx-auto px-4 py-2 flex flex-col items-center gap-4">
          <a
            href="#home"
            className="text-[#365486] font-medium py-2 w-full text-center hover:bg-gray-50 rounded-lg transition-colors"
            onClick={navigateToHome}
          >
            Inicio
          </a>
          <a
            href="#services"
            className="text-[#365486] font-medium py-2 w-full text-center hover:bg-gray-50 rounded-lg transition-colors"
            onClick={toggleMenu}
          >
            Servicios
          </a>
          <a
            href="#contact"
            className="text-[#365486] font-medium py-2 w-full text-center hover:bg-gray-50 rounded-lg transition-colors"
            onClick={toggleMenu}
          >
            Contacto
          </a>
          <a
            href="/login"
            className="bg-[#365486] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#2a3f68] w-full text-center transition-all duration-300"
            onClick={toggleMenu}
          >
            Ingresar
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
