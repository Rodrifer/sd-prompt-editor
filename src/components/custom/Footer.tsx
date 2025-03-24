import { Github, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground mt-auto py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1 - Acerca de */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Acerca de</h3>
            <p className="text-sm">
              Nuestra empresa se dedica a proporcionar soluciones innovadoras para nuestros clientes desde 2010.
            </p>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Productos
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <address className="text-sm not-italic">
              <p>Calle Principal 123</p>
              <p>Ciudad, CP 12345</p>
              <p className="mt-2">Email: info@ejemplo.com</p>
              <p>Teléfono: (123) 456-7890</p>
            </address>
          </div>

          {/* Columna 4 - Redes sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-foreground/80" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-foreground/80" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-foreground/80" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-primary-foreground/80" aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-primary-foreground/20 my-6"></div>

        {/* Copyright */}
        <div className="text-center text-sm">
          <p>&copy; {currentYear} Mi Aplicación. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
