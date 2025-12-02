export default function IdeasQRPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-10 px-4 sm:py-14">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="text-center space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            <i className="fas fa-lightbulb text-[10px]"></i>
            ideas qr
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            5 ideas para usar códigos QR en tu local físico
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Los códigos QR son una forma simple y económica de conectar tu espacio físico con el
            mundo digital. Aquí tienes ideas concretas que puedes aplicar hoy mismo en tu negocio.
          </p>
        </header>

        <main className="space-y-8">
          {/* Idea 1 */}
          <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-100 space-y-3">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 text-sm">
                1
              </span>
              Carta digital y menú dinámico
            </h2>
            <p className="text-sm sm:text-base text-slate-700">
              Coloca un QR en cada mesa, en la entrada o en la barra que lleve a tu carta digital.
              De esta forma, puedes actualizar precios, fotos y descripciones sin volver a imprimir
              nada. Es ideal para mostrar menús del día, platos fuera de carta o indicar alérgenos.
            </p>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
              <li>Evita pegar el QR en zonas donde se moje o se ensucie con frecuencia.</li>
              <li>Acompáñalo con un texto claro como “Escaneá para ver el menú actualizado”.</li>
              <li>Si tienes varias lenguas, crea un menú multidioma accesible desde el mismo QR.</li>
            </ul>
          </section>

          {/* Idea 2 */}
          <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-100 space-y-3">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 text-sm">
                2
              </span>
              Reseñas y reputación online
            </h2>
            <p className="text-sm sm:text-base text-slate-700">
              Un pequeño QR cerca de la caja, la salida o la puerta puede potenciar tus reseñas en
              Google, Instagram o TripAdvisor. Después de una buena experiencia, pídele al cliente
              que escanee el código y deje su opinión.
            </p>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
              <li>
                Enlaza directamente a tu ficha de Google Maps para que el usuario no tenga que
                buscarte.
              </li>
              <li>
                Ofrece un incentivo responsable, como participar en un sorteo mensual o un beneficio
                en la próxima visita.
              </li>
            </ul>
          </section>

          {/* Idea 3 */}
          <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-100 space-y-3">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 text-sm">
                3
              </span>
              Promociones y cupones internos
            </h2>
            <p className="text-sm sm:text-base text-slate-700">
              Puedes usar un QR en flyers, bolsas, tickets o en la propia vidriera para llevar a una
              landing de promociones. La ventaja es que puedes cambiar la promo sin volver a cambiar
              el código.
            </p>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
              <li>Crea QRs de tipo “cupón” o “links” con ofertas específicas.</li>
              <li>
                Haz que el cliente tenga que mostrar el QR escaneado en caja para aplicar el
                descuento.
              </li>
              <li>Actualiza las promociones según la temporada sin reimprimir cartelería.</li>
            </ul>
          </section>

          {/* Idea 4 */}
          <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-100 space-y-3">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 text-sm">
                4
              </span>
              Contenido extra en el punto de venta
            </h2>
            <p className="text-sm sm:text-base text-slate-700">
              Añade QRs en estanterías, etiquetas o displays que lleven a contenido ampliado: fichas
              técnicas, videos cortos, antes y después, o instrucciones de uso. Esto funciona muy
              bien en locales de decoración, tecnología, salud/estética y productos gourmet.
            </p>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
              <li>
                Usa un QR diferente por familia de producto en vez de uno genérico para toda la
                tienda.
              </li>
              <li>
                Incluye imágenes o videos que respondan a las dudas más comunes de tus clientes.
              </li>
            </ul>
          </section>

          {/* Idea 5 */}
          <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-100 space-y-3">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 text-sm">
                5
              </span>
              Contacto y comunidad
            </h2>
            <p className="text-sm sm:text-base text-slate-700">
              Un QR en el mostrador, la vidriera o en tu tarjeta de presentación puede centralizar
              todos tus canales de contacto. Al escanearlo, el cliente puede guardarte en su agenda,
              abrir tu WhatsApp Business o seguirte en redes sociales.
            </p>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
              <li>
                Usa un QR de tipo “links” o “social” para agrupar web, Instagram, WhatsApp y otras
                redes.
              </li>
              <li>
                Incluye una pequeña frase en el cartel: “Escaneá para seguir conectado con
                nosotros”.
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}


