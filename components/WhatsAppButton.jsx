"use client";

export default function WhatsAppButton() {
  const phoneNumber = "+5493512606190";
  const message = encodeURIComponent("Hola! Me gustaría obtener más información.");
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 animate-bounce"
      title="Contáctanos por WhatsApp"
    >
      <i className="fab fa-whatsapp text-2xl sm:text-3xl"></i>
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}

