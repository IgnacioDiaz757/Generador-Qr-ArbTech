"use client";

import { FormEvent, useState } from "react";

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoProyecto, setTipoProyecto] = useState("qr-negocio");
  const [enviado, setEnviado] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nuevosErrores: string[] = [];
    if (!nombre.trim()) nuevosErrores.push("Por favor, ingresa tu nombre.");
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) nuevosErrores.push("Ingresa un email válido.");
    if (!mensaje.trim()) nuevosErrores.push("Cuéntanos brevemente qué necesitas.");

    setErrores(nuevosErrores);
    if (nuevosErrores.length > 0) return;

    setEnviado(true);

    const asunto = encodeURIComponent("Consulta desde ArbTech QR");
    const cuerpo = encodeURIComponent(
      `Nombre: ${nombre}\nEmail: ${email}\nTipo de proyecto: ${tipoProyecto}\n\nMensaje:\n${mensaje}`
    );

    window.location.href = `mailto:contacto@arbtech.com?subject=${asunto}&body=${cuerpo}`;
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-10 px-4 sm:py-14">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="text-center space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            <i className="fas fa-sparkles text-[10px]"></i>
            contacto
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Hablemos sobre tu proyecto con códigos QR
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Completa el formulario y te ayudamos a convertir tu idea en una experiencia digital:
            cartas digitales, flyers interactivos, tarjetas de presentación y más.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Formulario principal */}
          <section className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <i className="fas fa-paper-plane text-emerald-500"></i>
              Envíanos un mensaje
            </h2>

            {errores.length > 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 space-y-1">
                {errores.map((err) => (
                  <p key={err}>{err}</p>
                ))}
              </div>
            )}

            {enviado && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                <span>
                  Abrimos tu cliente de correo con el mensaje prellenado. Si no se abrió, revisa tu
                  configuración de email.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nombre y apellido
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@tuempresa.com"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  ¿En qué estás pensando?
                </label>
                <select
                  value={tipoProyecto}
                  onChange={(e) => setTipoProyecto(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="qr-negocio">Generador de QR para mi negocio</option>
                  <option value="carta-digital">Carta digital con QR para restaurante/bar</option>
                  <option value="tarjeta-presentacion">Tarjeta de presentación con QR</option>
                  <option value="flyers-eventos">Flyers y campañas con QR</option>
                  <option value="otro">Otro tipo de proyecto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Cuéntanos un poco más
                </label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows={5}
                  placeholder="Ej: Necesito una tarjeta de presentación con QR a mi portfolio y una carta digital para mi local..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Cuanto más contexto nos des, mejor podremos ayudarte.
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:from-emerald-600 hover:to-green-700 hover:shadow-lg"
              >
                <i className="fas fa-paper-plane"></i>
                Enviar consulta
              </button>
            </form>
          </section>

          {/* Panel lateral: info de ArbTech */}
          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <i className="fas fa-building text-emerald-500"></i>
                ArbTech · Contacto
              </h2>
              <p className="text-sm text-slate-600">
                Trabajamos en la intersección entre <strong>arquitectura</strong>,{" "}
                <strong>diseño</strong> y <strong>tecnología</strong>, creando experiencias
                digitales simples y funcionales para negocios físicos y proyectos creativos.
              </p>
              <div className="space-y-2 text-sm text-slate-700">
                <p className="flex items-center gap-2">
                  <i className="fas fa-envelope text-emerald-500"></i>
                  <span>contacto@arbtech.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <i className="fab fa-whatsapp text-emerald-500"></i>
                  <span>+54 9 351 260 6190</span>
                </p>
                <p className="flex items-center gap-2">
                  <i className="fas fa-globe text-emerald-500"></i>
                  <span>Generador de QR · ArbTech</span>
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-emerald-600 text-white p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <i className="fas fa-qrcode"></i>
                ¿Querés una solución a medida?
              </h3>
              <p className="text-sm text-emerald-50">
                Además del generador online, podemos armar una plataforma de QR personalizada para
                tu negocio: dashboards, analíticas avanzadas, múltiples locales y más.
              </p>
              <ul className="space-y-1 text-sm text-emerald-50/90">
                <li>• QRs dinámicos con edición de contenido.</li>
                <li>• Panel para gestionar múltiples campañas.</li>
                <li>• Integración con tu web o e-commerce.</li>
              </ul>
              <p className="text-xs text-emerald-100">
                Cuéntanos tu idea en el formulario y vemos juntos el mejor enfoque.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


