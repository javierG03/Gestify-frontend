"use client"

import { useState, useEffect } from "react"

const ContactFormSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("contact")
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulación de envío
    setTimeout(() => {
      console.log("Form submitted:", form)
      setIsSubmitting(false)
      // Resetear el formulario
      setForm({
        name: "",
        email: "",
        message: "",
      })
      // Mostrar algún tipo de notificación aquí si se desea
    }, 1000)
  }

  return (
    <section className="bg-white px-6 md:px-8 py-16 md:py-20" id="contact">
      <div className="container mx-auto">
        <div
          className={`flex flex-col md:flex-row items-start justify-between gap-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Texto izquierda */}
          <div className="md:w-1/2">
            <div className="inline-flex items-center px-3 py-1.5 bg-[#e0e7f2] rounded-full mb-3">
              <span className="text-[#365486] text-sm font-medium">Estamos para ayudarte</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#365486] mb-6">Contacto</h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                ¿Tienes alguna pregunta sobre nuestro sistema de gestión de eventos con planificación automática?
              </p>
              <p className="text-lg">
                Ya sea que necesites más información, soporte o quieras saber cómo implementar nuestra solución en tu
                próximo evento, nuestro equipo está listo para asistirte.
              </p>
              <p className="text-lg font-semibold text-[#365486]">
                No dudes en contactarnos, ¡nos encantaría ayudarte a llevar tu evento al siguiente nivel!
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="md:w-1/2 w-full flex flex-col gap-6 bg-gray-50 p-6 md:p-8 rounded-lg shadow-sm"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#365486] focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#365486] focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#365486] focus:border-transparent transition-all h-40 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`self-end bg-[#365486] text-white px-8 py-3 rounded-lg shadow-md hover:bg-[#2a3f68] hover:shadow-lg transition-all duration-300 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
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
                "Enviar"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactFormSection
