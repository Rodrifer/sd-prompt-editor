import { Bell, Calendar, Star, MessageCircle } from "lucide-react"

export default function Right() {
  return (
    <aside className="w-full md:w-1/5 bg-muted p-4 border-l">
      <div className="font-medium text-lg mb-6">Panel Lateral</div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Notificaciones</h3>
          <div className="bg-background p-3 rounded-md shadow-sm">
            <div className="flex items-start gap-2">
              <Bell className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="text-sm">Nueva actualización disponible</p>
                <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
              </div>
            </div>
          </div>
          <div className="bg-background p-3 rounded-md shadow-sm">
            <div className="flex items-start gap-2">
              <MessageCircle className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="text-sm">Nuevo mensaje de soporte</p>
                <p className="text-xs text-muted-foreground">Hace 1 hora</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Próximos Eventos</h3>
          <div className="bg-background p-3 rounded-md shadow-sm">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="text-sm">Reunión de equipo</p>
                <p className="text-xs text-muted-foreground">Mañana, 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Favoritos</h3>
          <div className="bg-background p-3 rounded-md shadow-sm">
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="text-sm">Dashboard de Analíticas</p>
                <p className="text-xs text-muted-foreground">Visitado recientemente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

