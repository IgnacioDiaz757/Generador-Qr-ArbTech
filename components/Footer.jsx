"use client";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-600 to-emerald-600 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base">
          <span className="flex items-center gap-2">
            <i className="fas fa-code text-white"></i>
            Programación
          </span>
          <span className="hidden sm:inline text-white/70">•</span>
          <span className="flex items-center gap-2">
            <i className="fas fa-paint-brush text-white"></i>
            Diseño Interior
          </span>
          <span className="hidden sm:inline text-white/70">•</span>
          <span className="flex items-center gap-2">
            <i className="fas fa-drafting-compass text-white"></i>
            Arquitectura
          </span>
        </div>
        <div className="mt-4 text-center text-xs sm:text-sm text-white/80">
          <p>© {new Date().getFullYear()} ArbTech. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

