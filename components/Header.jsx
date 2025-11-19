"use client";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24 lg:h-28">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            <img
              src="/arbtech-logo.png"
              alt="ArbTech Logo"
              className="h-10 w-auto sm:h-14 md:h-16 lg:h-20 xl:h-24 object-contain"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
              ArbTech
            </h1>
          </div>

          {/* Icono QR */}
          <div className="flex items-center">
            <i className="fas fa-qrcode text-white text-lg sm:text-xl md:text-2xl lg:text-3xl"></i>
          </div>
        </div>
      </div>
    </header>
  );
}

