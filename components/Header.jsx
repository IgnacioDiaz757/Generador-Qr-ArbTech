"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogoClick = () => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") {
        window.location.reload();
      } else {
        router.push("/");
        router.refresh();
        window.location.href = "/";
      }
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24 lg:h-28">
          {/* Logo y Nombre */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-xl cursor-pointer"
            aria-label="Volver al inicio"
          >
            <img
              src="/arbtech-logo.png"
              alt="ArbTech Logo"
              className="h-10 w-auto sm:h-14 md:h-16 lg:h-20 xl:h-24 object-contain"
            />
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
              ArbTech
            </span>
          </button>

          {/* Navegación */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-white/20 transition"
            >
              <i className="fas fa-qrcode"></i>
              Generador
            </button>
            <button
              type="button"
              onClick={() => router.push("/ideas-qr")}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-white/20 transition"
            >
              <i className="fas fa-lightbulb"></i>
              Ideas
            </button>
            <button
              type="button"
              onClick={() => router.push("/contacto")}
              className="inline-flex items-center gap-2 rounded-full bg-white text-emerald-700 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold shadow-sm hover:bg-emerald-50 transition"
            >
              <i className="fas fa-envelope"></i>
              <span className="hidden xs:inline">Contacto</span>
              <span className="sm:hidden">Contacto</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

