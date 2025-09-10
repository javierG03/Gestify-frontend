import { Github, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <div>
      <footer className="bg-gray-100 px-8 py-10 text-[#365486]">
        {/* Secciones superiores */}
        <div className="flex items-center grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6">
          {/* Image Section - Aumentado el tamaño de la imagen */}
          <div className="flex justify-center md:justify-start">
            <img src="img/logo.webp" alt="EventosIA Logo" className="h-40 w-auto" />
          </div>

          {/* Enlaces */}
          <div className="text-center md:text-left pb-4">
            <h4 className="font-bold mb-3 text-2xl">Enlaces</h4>
            <a href="#home" className="block mb-2 text-xl hover:text-[#2a3f68] transition-colors">
              Inicio
            </a>
            <a href="#services" className="block mb-2 text-xl hover:text-[#2a3f68] transition-colors">
              Servicios
            </a>
            <a href="#contact" className="block mb-2 text-xl hover:text-[#2a3f68] transition-colors">
              Contacto
            </a>
          </div>

          {/* Dirección - Añadidos los enlaces específicos */}
          <div className="text-center md:text-left pb-4">
            <h4 className="font-bold mb-3 text-2xl">Contacto</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <a
                  href="https://maps.app.goo.gl/4jHKhaq2Vc5XC7vW7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#2a3f68] transition-colors"
                >
                  <MapPin size={20} />
                  <p className="text-xl">Dubai</p>
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <a
                  href="https://wa.me/573224671853"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#2a3f68] transition-colors"
                >
                  <Phone size={20} />
                  <p className="text-xl">+1 (555) 123-4567</p>
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <a
                  href="mailto:info@eventosIA.com"
                  className="flex items-center gap-2 hover:text-[#2a3f68] transition-colors"
                >
                  <Mail size={20} />
                  <p className="text-xl">info@eventosIA.com</p>
                </a>
              </div>
            </div>
          </div>

          {/* Política */}
          <div className="text-center md:text-left pb-4">
            <h4 className="font-bold mb-3 text-2xl">Política</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-xl hover:text-[#2a3f68] transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-xl hover:text-[#2a3f68] transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-xl hover:text-[#2a3f68] transition-colors">
                  Política de Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* Sección inferior - Añadidos los enlaces a redes sociales */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">EventosIA</h2>

          <div className="flex gap-4 items-center">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="GitHub"
            >
              <Github size={30} />
            </a>
            <a
              href="https://x.com/home"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Twitter"
            >
              <Twitter size={30} />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="LinkedIn"
            >
              <Linkedin size={30} />
            </a>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="bg-[#365486] text-center text-gray-100 w-full py-4">
        <p>&copy; {currentYear} EventosIA. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}

export default Footer
