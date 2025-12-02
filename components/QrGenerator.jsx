"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";

// Tipos de QR disponibles agrupados por categorías
const qrCategories = {
  web: {
    name: "Web y URLs",
    icon: "fas fa-globe",
    types: [
      { id: "url", name: "Sitio web", icon: "fas fa-globe", placeholder: "https://ejemplo.com" },
      { id: "pdf", name: "PDF", icon: "fas fa-file-pdf", placeholder: "https://ejemplo.com/documento.pdf" },
      { id: "links", name: "Lista de enlaces", icon: "fas fa-link", placeholder: "URL1,URL2,URL3" },
      { id: "app", name: "Aplicaciones", icon: "fas fa-mobile-screen-button", placeholder: "URL de la app store" },
    ]
  },
  social: {
    name: "Redes Sociales",
    icon: "fas fa-share-nodes",
    types: [
      { id: "facebook", name: "Facebook", icon: "fab fa-facebook", placeholder: "https://facebook.com/tu-pagina" },
      { id: "instagram", name: "Instagram", icon: "fab fa-instagram", placeholder: "https://instagram.com/tu-perfil" },
      { id: "whatsapp", name: "WhatsApp", icon: "fab fa-whatsapp", placeholder: "+1234567890" },
      { id: "social", name: "Redes sociales", icon: "fas fa-share-nodes", placeholder: "URLs de redes sociales" },
    ]
  },
  media: {
    name: "Multimedia",
    icon: "fas fa-photo-film",
    types: [
      { id: "images", name: "Imágenes", icon: "fas fa-images", placeholder: "https://ejemplo.com/imagen.jpg" },
      { id: "video", name: "Video", icon: "fas fa-video", placeholder: "https://ejemplo.com/video.mp4" },
      { id: "mp3", name: "MP3", icon: "fas fa-music", placeholder: "https://ejemplo.com/audio.mp3" },
    ]
  },
  contact: {
    name: "Contacto",
    icon: "fas fa-address-book",
    types: [
      { id: "vcard", name: "vCard", icon: "fas fa-address-card", placeholder: "Datos de contacto" },
      { id: "business", name: "Empresa", icon: "fas fa-building", placeholder: "Información de la empresa" },
    ]
  },
  other: {
    name: "Otros",
    icon: "fas fa-ellipsis",
    types: [
      { id: "wifi", name: "Wi-Fi", icon: "fas fa-wifi", placeholder: "SSID:MiRed,Password:12345678" },
      { id: "menu", name: "Menú", icon: "fas fa-utensils", placeholder: "Nombre del restaurante" },
      { id: "coupon", name: "Cupón", icon: "fas fa-ticket", placeholder: "Código del cupón" },
    ]
  }
};

// Lista plana de todos los tipos para búsqueda
const allQrTypes = Object.values(qrCategories).flatMap(category => category.types);

const interfaceThemes = {
  web: {
    backgroundClass: "bg-gradient-to-br from-blue-50 via-white to-indigo-100",
    textClass: "text-slate-800",
    header: {
      icon: "fas fa-globe",
      title: "Navegador",
      subtitle: "Vista previa",
    },
  },
  instagram: {
    backgroundClass: "bg-gradient-to-br from-[#4f5bd5] via-[#962fbf] to-[#feda77]",
    textClass: "text-white drop-shadow-sm",
    header: {
      icon: "fab fa-instagram",
      title: "Instagram Story",
      subtitle: "@arbtech.design",
      badge: "LIVE",
    },
  },
  facebook: {
    backgroundClass: "bg-gradient-to-b from-[#1877f2] to-[#0f5dd7]",
    textClass: "text-white drop-shadow-sm",
    header: {
      icon: "fab fa-facebook",
      title: "Facebook Page",
      subtitle: "facebook.com/arbtech",
      badge: "EN VIVO",
    },
  },
  whatsapp: {
    backgroundClass: "bg-gradient-to-b from-[#25D366] to-[#128C7E]",
    textClass: "text-white drop-shadow-sm",
    header: {
      icon: "fab fa-whatsapp",
      title: "WhatsApp Business",
      subtitle: "+54 9 351 2606190",
    },
  },
  video: {
    backgroundClass: "bg-gradient-to-br from-[#0f0c29] via-[#1f1b4a] to-[#0f0c29]",
    textClass: "text-white",
    header: {
      icon: "fas fa-play",
      title: "Video player",
      subtitle: "Reproduciendo...",
      badge: "HD",
    },
  },
  pdf: {
    backgroundClass: "bg-gradient-to-br from-rose-100 via-white to-amber-50",
    textClass: "text-slate-800",
    header: {
      icon: "fas fa-file-pdf",
      title: "Documento PDF",
      subtitle: "Previsualización",
    },
  },
  mp3: {
    backgroundClass: "bg-gradient-to-br from-[#1DB954] via-[#121212] to-[#050505]",
    textClass: "text-white",
    header: {
      icon: "fab fa-spotify",
      title: "Spotify Player",
      subtitle: "Reproduciendo ahora",
      badge: "PREMIUM",
    },
  },
  wifi: {
    backgroundClass: "bg-gradient-to-br from-[#0f172a] via-[#0b253b] to-[#0a3c5a]",
    textClass: "text-white",
    header: {
      icon: "fas fa-wifi",
      title: "Red disponible",
      subtitle: "Configuración rápida",
    },
  },
  contact: {
    backgroundClass: "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#475569]",
    textClass: "text-white",
    header: {
      icon: "fas fa-address-card",
      title: "Tarjeta de contacto",
      subtitle: "Listo para compartir",
    },
  },
  gallery: {
    backgroundClass: "bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#7c3aed]",
    textClass: "text-white",
    header: {
      icon: "fas fa-images",
      title: "Galería interactiva",
      subtitle: "Swipe para explorar",
    },
  },
  app: {
    backgroundClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700",
    textClass: "text-white",
    header: {
      icon: "fas fa-mobile-screen",
      title: "App Store",
      subtitle: "Recomendado",
    },
  },
  links: {
    backgroundClass: "bg-gradient-to-br from-amber-50 via-white to-rose-50",
    textClass: "text-slate-800",
    header: {
      icon: "fas fa-link",
      title: "Bio links",
      subtitle: "Selecciona un destino",
    },
  },
  menu: {
    backgroundClass: "bg-gradient-to-br from-amber-100 via-rose-100 to-emerald-50",
    textClass: "text-amber-900",
    header: {
      icon: "fas fa-utensils",
      title: "Carta digital",
      subtitle: "Especiales del día",
    },
  },
  coupon: {
    backgroundClass: "bg-gradient-to-br from-fuchsia-100 via-white to-amber-100",
    textClass: "text-fuchsia-900",
    header: {
      icon: "fas fa-ticket",
      title: "Cupón exclusivo",
      subtitle: "Disponible hoy",
      badge: "-25%",
    },
  },
  social: {
    backgroundClass: "bg-gradient-to-br from-[#7928CA] to-[#FF0080]",
    textClass: "text-white",
    header: {
      icon: "fas fa-share-nodes",
      title: "Social Hub",
      subtitle: "Comparte tu marca",
    },
  },
  default: {
    backgroundClass: "bg-gradient-to-br from-slate-100 via-white to-slate-200",
    textClass: "text-gray-700",
  },
};

const getMockupVariant = (type) => {
  switch (type) {
    case "instagram":
      return "instagram";
    case "facebook":
      return "facebook";
    case "whatsapp":
      return "whatsapp";
    case "video":
      return "video";
    case "pdf":
      return "pdf";
    case "mp3":
      return "mp3";
    case "wifi":
      return "wifi";
    case "vcard":
    case "business":
      return "contact";
    case "images":
      return "gallery";
    case "app":
      return "app";
    case "links":
      return "links";
    case "menu":
      return "menu";
    case "coupon":
      return "coupon";
    case "social":
      return "social";
    default:
      return "web";
  }
};

// Función para formatear datos según el tipo
function formatQRData(type, data, extraData = {}) {
  switch (type) {
    case "url":
      return data.startsWith("http") ? data : `https://${data}`;
    
    case "pdf":
      return data.startsWith("http") ? data : `https://${data}`;
    
    case "images":
      return data.startsWith("http") ? data : `https://${data}`;
    
    case "video":
      return data.startsWith("http") ? data : `https://${data}`;
    
    case "wifi":
      // Formato: WIFI:T:WPA;S:SSID;P:Password;;
      const ssid = extraData.ssid || data.split(",")[0]?.split(":")[1] || "MiRed";
      const password = extraData.password || data.split(",")[1]?.split(":")[1] || "";
      const security = extraData.security || "WPA";
      return `WIFI:T:${security};S:${ssid};P:${password};;`;
    
    case "menu":
      return `MENU:${data}`;
    
    case "business":
      const businessName = extraData.name || data;
      const businessPhone = extraData.phone || "";
      const businessEmail = extraData.email || "";
      const businessAddress = extraData.address || "";
      return `BIZNVCARD:${businessName};TEL:${businessPhone};EMAIL:${businessEmail};ADR:${businessAddress};;`;
    
    case "vcard":
      const name = extraData.name || data;
      const phone = extraData.phone || "";
      const email = extraData.email || "";
      const address = extraData.address || "";
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nADR:${address}\nEND:VCARD`;
    
    case "mp3":
      return data.startsWith("http") ? data : `https://${data}`;
    
    case "app":
      return data.startsWith("http") ? data : `https://${data}`;
    
    case "links":
      return data.split(",").map(url => url.trim()).join("\n");
    
    case "coupon":
      return `COUPON:${data}`;
    
    case "facebook":
      return data.startsWith("http") ? data : `https://facebook.com/${data}`;
    
    case "instagram":
      return data.startsWith("http") ? data : `https://instagram.com/${data}`;
    
    case "social":
      return data;
    
    case "whatsapp":
      const phoneNumber = data.replace(/[^0-9+]/g, "");
      return `https://wa.me/${phoneNumber}`;
    
    default:
      return data;
  }
}

// Funciones de validación inteligente
const validateInput = (type, value, extraData = {}) => {
  const errors = [];
  const suggestions = [];

  switch (type) {
    case "url":
    case "pdf":
    case "images":
    case "video":
    case "mp3":
    case "app":
    case "facebook":
    case "instagram":
      if (value && !value.match(/^https?:\/\//i) && !value.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/)) {
        errors.push("URL inválida");
        suggestions.push("Agrega 'https://' al inicio o ingresa un dominio válido");
      }
      break;
    
    case "whatsapp":
      const whatsappPhone = value.replace(/[^0-9+]/g, "");
      if (value && whatsappPhone.length < 8) {
        errors.push("Número de WhatsApp inválido");
        suggestions.push("Formato: +5493512606190");
      }
      break;
  }

  // Validar campos extra
  if (extraData.email) {
    if (!extraData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push("Email inválido en campos adicionales");
      suggestions.push("Formato de email: ejemplo@dominio.com");
    }
  }

  if (extraData.phone) {
    const phone = extraData.phone.replace(/[^0-9+]/g, "");
    if (phone.length < 8) {
      errors.push("Teléfono inválido en campos adicionales");
      suggestions.push("Ingresa un número válido con código de país");
    }
  }

  return { errors, suggestions, isValid: errors.length === 0 };
};

// Detectar tipo automáticamente
const detectType = (value) => {
  if (!value) return null;
  
  if (value.match(/^https?:\/\//i) || value.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/)) {
    if (value.match(/\.(pdf)$/i)) return "pdf";
    if (value.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return "images";
    if (value.match(/\.(mp4|avi|mov|wmv)$/i)) return "video";
    if (value.match(/\.(mp3|wav|ogg)$/i)) return "mp3";
    if (value.match(/facebook\.com|fb\.com/i)) return "facebook";
    if (value.match(/instagram\.com|instagr\.am/i)) return "instagram";
    if (value.match(/wa\.me|whatsapp/i)) return "whatsapp";
    return "url";
  }
  
  if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "email";
  if (value.match(/^\+?[0-9]{8,}$/)) return "phone";
  if (value.match(/^WIFI:/i)) return "wifi";
  
  return null;
};

// Funciones de Analytics
const defaultAnalyticsState = {
  totalGenerated: 0,
  todayGenerated: 0,
  typesCount: {},
  lastDate: null,
  history: [],
};

const getAnalytics = () => {
  if (typeof window === "undefined") return defaultAnalyticsState;

  const analytics = localStorage.getItem("qrAnalytics");
  if (!analytics) return defaultAnalyticsState;

  try {
    const data = JSON.parse(analytics);
    const today = new Date().toDateString();

    return {
      totalGenerated: data.totalGenerated || 0,
      todayGenerated: data.lastDate === today ? data.todayGenerated || 0 : 0,
      typesCount: data.typesCount || {},
      lastDate: data.lastDate || null,
      history: Array.isArray(data.history) ? data.history : [],
    };
  } catch {
    return defaultAnalyticsState;
  }
};

const updateAnalytics = (type) => {
  if (typeof window === "undefined") return;

  const analytics = localStorage.getItem("qrAnalytics");
  let parsed = defaultAnalyticsState;

  if (analytics) {
    try {
      parsed = JSON.parse(analytics);
    } catch {
      parsed = defaultAnalyticsState;
    }
  }

  const today = new Date().toDateString();
  const totalGenerated = (parsed.totalGenerated || 0) + 1;
  const todayGenerated = parsed.lastDate === today ? (parsed.todayGenerated || 0) + 1 : 1;
  const typesCount = {
    ...(parsed.typesCount || {}),
    [type]: ((parsed.typesCount || {})[type] || 0) + 1,
  };

  const history = Array.isArray(parsed.history) ? [...parsed.history] : [];
  if (history.length === 0 || history[history.length - 1].date !== today) {
    history.push({ date: today, count: 1 });
  } else {
    history[history.length - 1].count += 1;
  }
  if (history.length > 7) {
    history.shift();
  }

  const updated = {
    totalGenerated,
    todayGenerated,
    typesCount,
    lastDate: today,
    history,
  };

  localStorage.setItem("qrAnalytics", JSON.stringify(updated));
};

export default function QrGenerator() {
  const [qrType, setQrType] = useState("url");
  const [text, setText] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [extraFields, setExtraFields] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Nuevos estados para personalización
  const [errorCorrection, setErrorCorrection] = useState("M"); // L, M, Q, H
  const [qrSize, setQrSize] = useState(400);
  const [qrMargin, setQrMargin] = useState(40);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Estados para validación y analytics
  const [validation, setValidation] = useState({ errors: [], suggestions: [], isValid: true });
  const [analytics, setAnalytics] = useState(getAnalytics());
  
  // Estados para compartir y colaborar
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  
  // Estado para formato de descarga
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [mockupPulse, setMockupPulse] = useState(false);
  const mockupPulseTimeout = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);
  
  const canvasRef = useRef(null);
  const logoInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const embedCodeRef = useRef(null);

  const selectedType = allQrTypes.find(t => t.id === qrType) || allQrTypes[0];
  const mockupVariant = getMockupVariant(qrType);
  const mockupTheme = interfaceThemes[mockupVariant] || interfaceThemes.default;
  const triggerMockupPulse = () => {
    if (mockupPulseTimeout.current) {
      clearTimeout(mockupPulseTimeout.current);
    }
    setMockupPulse(true);
    mockupPulseTimeout.current = setTimeout(() => {
      setMockupPulse(false);
    }, 1500);
  };
  const faqItems = [
    {
      question: "¿Necesito registrarme para usar el generador?",
      answer: "No, puedes crear y descargar códigos ilimitados sin usuario ni contraseña.",
    },
    {
      question: "¿Los QR expiran o dejan de funcionar?",
      answer:
        "Los QR estáticos se mantienen activos indefinidamente. Solo debes asegurarte de que el link o recurso sigan disponibles.",
    },
    {
      question: "¿Puedo personalizar colores y logos sin perder lecturabilidad?",
      answer:
        "Sí, el nivel de corrección de errores permite integrar logos y colores siempre que exista contraste contra el fondo.",
    },
  ];
  const qrSteps = [
    {
      icon: "fas fa-pen-ruler",
      title: "1. Configura",
      description: "Elige el tipo de QR e ingresa la información que quieres compartir.",
    },
    {
      icon: "fas fa-sliders-h",
      title: "2. Personaliza",
      description: "Selecciona colores, márgenes, tamaño y agrega tu logo si lo deseas.",
    },
    {
      icon: "fas fa-rocket",
      title: "3. Descarga y comparte",
      description: "Exporta en PNG, SVG, JPG o WEBP y usa tu QR en impresos o campañas digitales.",
    },
  ];
  const bestTips = [
    {
      title: "Contraste inteligente",
      description: "Asegúrate de que el código tenga buen contraste respecto al fondo.",
    },
    {
      title: "Margen de seguridad",
      description: "Mantén un área blanca alrededor del QR (quiet zone) para mejorar el escaneo.",
    },
    {
      title: "Pruebas reales",
      description: "Escanea el QR con diferentes móviles antes de imprimir o publicar.",
    },
  ];
  const historyData = (analytics.history || []).slice(-7);
  const maxHistoryValue =
    historyData.length > 0 ? Math.max(...historyData.map((entry) => entry.count)) : 1;
  const topTypeEntries = Object.entries(analytics.typesCount || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const maxTypeValue = topTypeEntries.length > 0 ? topTypeEntries[0][1] : 1;
  const formatHistoryLabel = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("es-AR", { weekday: "short" });
    } catch {
      return dateString.slice(0, 3);
    }
  };

  const sanitizedText = text || "";
  const hasQr = Boolean(qrImage);
  const wifiMatchSsid = sanitizedText.match(/SSID:([^,]+)/i);
  const wifiMatchPassword = sanitizedText.match(/password:([^,]+)/i);
  const wifiSsid = extraFields.ssid || wifiMatchSsid?.[1]?.trim() || "ArbTech Guest";
  const wifiPassword = extraFields.password || wifiMatchPassword?.[1]?.trim() || "12345678";
  const wifiSecurity = extraFields.security || "WPA2";
  const contactName =
    extraFields.name || (qrType === "business" ? "ArbTech Studio" : "Nombre Apellido");
  const contactPhone = extraFields.phone || "+54 9 351 000000";
  const contactEmail = extraFields.email || "contacto@arbtech.com";
  const contactAddress = extraFields.address || "Dirección completa";
  const urlPreview =
    sanitizedText || "https://arbtech.com/experiencias-digitales-personalizadas";
  const linksList =
    sanitizedText.length > 0
      ? sanitizedText.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean).slice(0, 4)
      : ["Sitio web oficial", "Portfolio", "WhatsApp", "LinkedIn"];
  const menuItems =
    sanitizedText.length > 0
      ? sanitizedText.split(/[\n,]+/).map((item, idx) => ({
          name: item.trim() || `Especial ${idx + 1}`,
          price: `$${(idx + 1) * 5 + 10}`,
        }))
      : [
          { name: "Bowl Primavera", price: "$12" },
          { name: "Pasta ArbTech", price: "$15" },
          { name: "Café Nitro", price: "$6" },
        ];
  const couponCode = sanitizedText || "ARBTECH2024";
  const appName = extraFields.name || sanitizedText || "ArbTech App";
  const galleryTitle = sanitizedText || "Colección ArbTech";
  const socialHandle = sanitizedText || "@arbtech";

  const placeholderQR = (
    <div className="mt-3 grid h-32 place-items-center rounded-2xl border-2 border-dashed border-white/30 text-[0.65rem] uppercase tracking-[0.2em] text-white/70">
      QR pendiente
    </div>
  );

  const renderImageOrPlaceholder = (className = "", tone = "light") =>
    hasQr ? (
      <img src={qrImage} alt="QR Code" className={`rounded-xl border border-white/20 shadow-lg ${className}`} />
    ) : (
      <div
        className={`rounded-xl border-2 border-dashed ${
          tone === "light" ? "border-white/40" : "border-gray-300"
        } ${className}`}
      >
        <div
          className={`flex h-full items-center justify-center text-[0.7rem] uppercase tracking-[0.3em] ${
            tone === "light" ? "text-white/60" : "text-gray-400"
          }`}
        >
          Genera tu QR
        </div>
      </div>
    );

  const renderMockupContent = ({ textClass }) => {
    switch (mockupVariant) {
      case "wifi":
        return (
          <div className="flex h-full flex-col justify-between text-white">
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/15 bg-black/25 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.55rem] uppercase tracking-[0.4em] text-white/60">
                      Red seleccionada
                    </p>
                    <p className="text-xl font-semibold">{wifiSsid}</p>
                  </div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em]">
                    {wifiSecurity}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="rounded-xl bg-black/40 px-4 py-3 font-mono tracking-[0.35em] text-sm">
                    {wifiPassword.replace(/./g, "•")}
                  </div>
                  <p className="mt-2 text-[0.65rem] text-white/70">
                    Mantén el teléfono cerca para conectarte automáticamente al escanear el QR.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/90 p-4 text-center text-gray-900 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Escanea y conecta
                </p>
                {hasQr ? (
                  <img
                    src={qrImage}
                    alt="QR WiFi"
                    className="mt-3 h-32 w-32 mx-auto rounded-xl border border-gray-200 shadow-lg"
                  />
                ) : (
                  <div className="mt-3 h-32 rounded-xl border-2 border-dashed border-gray-300 text-xs uppercase tracking-[0.4em] text-gray-400 grid place-items-center">
                    Genera tu QR
                  </div>
                )}
                <button className="mt-4 w-full rounded-xl bg-emerald-500 py-2 text-white font-semibold shadow hover:bg-emerald-600 transition">
                  Conectar
                </button>
              </div>
            </div>
            <p className="mt-4 text-center text-[0.6rem] text-white/70">
              Configuración rápida Wi-Fi • ArbTech
            </p>
          </div>
        );
      case "contact":
        return (
          <div className="flex h-full flex-col gap-4 text-white">
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur border border-white/15 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-lg font-semibold">
                  {contactName
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold">{contactName}</p>
                  <p className="text-sm text-white/70">{contactEmail}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <i className="fas fa-phone text-white/70"></i>
                  <span>{contactPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-white/70"></i>
                  <span>{contactAddress}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-xl bg-white text-slate-900 py-2 font-semibold">
                  Llamar
                </button>
                <button className="flex-1 rounded-xl border border-white/40 py-2">
                  Guardar contacto
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/10 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Comparte tu tarjeta</p>
              {hasQr ? (
                <img
                  src={qrImage}
                  alt="QR Contacto"
                  className="mx-auto mt-3 h-28 w-28 rounded-xl border border-white/40"
                />
              ) : (
                placeholderQR
              )}
            </div>
          </div>
        );
      case "mp3":
        return (
          <div className="flex h-full flex-col justify-between gap-5 text-white">
            <div className="rounded-3xl bg-black/35 p-5 shadow-2xl ring-1 ring-white/15 backdrop-blur">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-lg">
                {hasQr ? (
                  <img src={qrImage} alt="QR Code" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-40 place-items-center bg-black/50 text-xs uppercase tracking-[0.3em] text-white/60">
                    Playlist
                  </div>
                )}
                <span className="absolute bottom-3 right-3 rounded-full bg-white/25 px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em]">
                  Scan & Play
                </span>
              </div>
              <div className="mt-5 space-y-1">
                <p className="text-base font-semibold">Daily Mix · ArbTech</p>
                <p className="text-sm text-white/70">Lista dinámica generada desde tu QR</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-1.5 w-full rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white" style={{ width: "42%" }}></div>
                </div>
                <div className="flex justify-between text-[0.65rem] text-white/60">
                  <span>1:12</span>
                  <span>3:20</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-2xl">
                <button className="text-white/80 hover:text-white transition">
                  <i className="fas fa-random"></i>
                </button>
                <button className="text-white/80 hover:text-white transition">
                  <i className="fas fa-step-backward"></i>
                </button>
                <button className="rounded-full bg-white text-black px-5 py-3 shadow-lg">
                  <i className="fas fa-play"></i>
                </button>
                <button className="text-white/80 hover:text-white transition">
                  <i className="fas fa-step-forward"></i>
                </button>
                <button className="text-white/80 hover:text-white transition">
                  <i className="fas fa-heart"></i>
                </button>
              </div>
            </div>
            <div className="text-center text-xs text-white/80">
              Escanea el QR para abrir la playlist en Spotify.
            </div>
          </div>
        );
      case "video":
        return (
          <div className="flex h-full flex-col text-white">
            <div className="rounded-3xl border border-white/15 bg-black/30 p-4">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/60">
                {hasQr ? (
                  <img src={qrImage} alt="QR Video" className="h-full w-full object-cover opacity-70" />
                ) : (
                  <div className="grid h-full place-items-center text-xs uppercase tracking-[0.3em] text-white/50">
                    Video preview
                  </div>
                )}
                <button className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-white/90 text-slate-900 shadow-lg">
                  <i className="fas fa-play"></i>
                </button>
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="h-1.5 rounded-full bg-white/30">
                    <div className="h-full w-2/3 rounded-full bg-white"></div>
                  </div>
                  <div className="mt-1 flex justify-between text-[0.6rem] text-white/70">
                    <span>02:16</span>
                    <span>07:45</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/80">
                Escanea el QR para reproducir el video en tu dispositivo.
              </p>
            </div>
          </div>
        );
      case "pdf":
        return (
          <div className="flex h-full flex-col justify-between">
            <div className="rounded-3xl bg-white/95 p-5 text-slate-800 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                  <i className="fas fa-file-pdf text-xl"></i>
                </div>
                <div>
                  <p className="text-lg font-semibold">Documento PDF</p>
                  <p className="text-sm text-slate-500">Previzualización rápida</p>
                </div>
              </div>
              <div className="mt-4 h-40 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60">
                {hasQr ? (
                  <img src={qrImage} alt="PDF QR" className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    QR pendiente
                  </div>
                )}
              </div>
              <button className="mt-4 w-full rounded-xl bg-rose-500 py-2 text-white font-semibold shadow hover:bg-rose-600 transition">
                Descargar PDF
              </button>
            </div>
          </div>
        );
      case "whatsapp":
        return (
          <div className="flex h-full flex-col justify-between text-white">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30">
                  <i className="fas fa-user"></i>
                </div>
                <div className="rounded-2xl rounded-tl-none bg-emerald-500/90 px-4 py-2 text-sm shadow">
                  ¡Hola! Escaneá el QR para continuar la conversación.
                </div>
              </div>
              <div className="flex items-start gap-2 justify-end">
                <div className="rounded-2xl rounded-tr-none bg-white/20 px-4 py-2 text-sm shadow">
                  Te enviamos todos los datos al instante.
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/95 p-3 text-center text-gray-800 shadow-lg">
              {hasQr ? (
                <img src={qrImage} alt="WhatsApp QR" className="mx-auto h-28 w-28 rounded-xl border border-gray-200" />
              ) : (
                <div className="grid h-28 place-items-center rounded-xl border-2 border-dashed border-gray-300 text-xs uppercase tracking-[0.3em] text-gray-400">
                  QR pendiente
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">Comparte este código para abrir WhatsApp.</p>
            </div>
          </div>
        );
      case "instagram":
        return (
          <div className="flex h-full flex-col justify-center text-white">
            <div className="rounded-[32px] border border-white/20 bg-white/10 p-3">
              <div className="flex items-center gap-2 px-2 py-1 text-xs text-white/70">
                <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></div>
                EN DIRECTO · {socialHandle.replace(/@/g, "@")}
              </div>
              <div className="mt-2 overflow-hidden rounded-3xl border border-white/25">
                {hasQr ? (
                  <img src={qrImage} alt="Story QR" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-64 place-items-center text-xs uppercase tracking-[0.3em] text-white/70">
                    Story preview
                  </div>
                )}
              </div>
              <p className="mt-3 text-center text-xs uppercase tracking-[0.4em] text-white/80">
                Swipe up para abrir
              </p>
            </div>
          </div>
        );
      case "facebook":
        return (
          <div className="flex h-full flex-col gap-4 text-white">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur border border-white/15">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-8 w-8 rounded-full bg-white/30 grid place-items-center">
                  <i className="fab fa-facebook-f"></i>
                </div>
                <div>
                  <p className="font-semibold">ArbTech Studio</p>
                  <span className="text-xs text-white/70">Hace 5 minutos</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-white/90">
                Escanea el QR y descubre nuestro último proyecto interactivo.
              </p>
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/20 bg-white/10">
                {renderImageOrPlaceholder("h-40 w-full object-cover")}
              </div>
              <button className="mt-3 w-full rounded-xl bg-white text-[#1877f2] py-2 font-semibold">
                Ver publicación
              </button>
            </div>
          </div>
        );
      case "gallery":
        return (
          <div className="flex h-full flex-col text-white">
            <p className="text-sm text-white/80">{galleryTitle}</p>
            <div className="mt-3 grid flex-1 grid-cols-2 gap-2">
              {["A", "B", "C", "D"].map((label, idx) => (
                <div
                  key={label}
                  className={`rounded-2xl border border-white/20 ${idx === 0 ? "row-span-2" : ""} overflow-hidden bg-white/10`}
                >
                  {idx === 0 && hasQr ? (
                    <img src={qrImage} alt="Galería QR" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-xs uppercase tracking-[0.3em] text-white/60">
                      Shot {idx + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case "links":
        return (
          <div className={`flex h-full flex-col justify-between ${textClass}`}>
            <div className="space-y-3">
              {linksList.map((link, idx) => (
                <div
                  key={`${link}-${idx}`}
                  className="rounded-2xl border border-white/20 bg-white/80/5 px-4 py-3 text-sm backdrop-blur hover:bg-white/20 transition"
                >
                  <div className="flex items-center justify-between">
                    <span>{link}</span>
                    <i className="fas fa-arrow-up-right-from-square text-xs opacity-60"></i>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/25 bg-white/10 p-3 text-center">
              {renderImageOrPlaceholder("h-24 w-full", "dark")}
              <p className="mt-2 text-xs opacity-70">Escanea y comparte tu Link in Bio.</p>
            </div>
          </div>
        );
      case "menu":
        return (
          <div className="flex h-full flex-col justify-between text-amber-900">
            <div className="rounded-3xl border border-amber-200 bg-white/80 p-4 shadow-md">
              <p className="text-center text-xs uppercase tracking-[0.4em] text-amber-400">
                menú digital
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {menuItems.slice(0, 3).map((item, idx) => (
                  <li key={`${item.name}-${idx}`} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-dashed border-amber-300 bg-white/70 p-3 text-center">
              {hasQr ? (
                <img src={qrImage} alt="QR Menú" className="mx-auto h-24 w-24 rounded-lg border border-amber-200" />
              ) : (
                <div className="grid h-24 place-items-center rounded-lg border-2 border-dashed border-amber-200 text-xs uppercase tracking-[0.3em] text-amber-300">
                  QR pendiente
                </div>
              )}
              <p className="mt-2 text-xs text-amber-500">Escanea para ver la carta completa.</p>
            </div>
          </div>
        );
      case "coupon":
        return (
          <div className="flex h-full flex-col justify-between text-fuchsia-900">
            <div className="rounded-3xl border border-fuchsia-200 bg-white/90 p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-500">
                  Cupón especial
                </p>
                <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-semibold">
                  -25%
                </span>
              </div>
              <p className="mt-3 text-3xl font-black tracking-widest">{couponCode}</p>
              <p className="mt-2 text-xs text-fuchsia-500">Escanea el QR para aplicar el beneficio.</p>
            </div>
            <div className="rounded-2xl border border-fuchsia-200 bg-white/80 p-3 text-center">
              {renderImageOrPlaceholder("h-24", "dark")}
            </div>
          </div>
        );
      case "app":
        return (
          <div className="flex h-full flex-col justify-between text-white">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 text-2xl">
                  <i className="fas fa-mobile-screen"></i>
                </div>
                <div>
                  <p className="text-lg font-semibold">{appName}</p>
                  <span className="text-xs text-white/70">App Store · 4.9 ⭐️</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-white/80">
                Escanea el QR para descargar la app desde tu tienda favorita.
              </p>
              <button className="mt-4 w-full rounded-xl bg-white py-2 font-semibold text-slate-900">
                Obtener
              </button>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-center">
              {renderImageOrPlaceholder("h-24")}
            </div>
          </div>
        );
      case "social":
        return (
          <div className="flex h-full flex-col justify-between text-white">
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              {["Instagram", "Facebook", "LinkedIn", "TikTok"].map((network) => (
                <div key={network} className="rounded-2xl border border-white/20 bg-white/10 px-2 py-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{network}</p>
                  <p className="text-sm font-semibold mt-1">{socialHandle}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-white/30 bg-white/10 p-3 text-center">
              {renderImageOrPlaceholder("h-24")}
              <p className="mt-2 text-xs text-white/70">Escanea para abrir tu hub social.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className={`flex h-full flex-col justify-between ${textClass}`}>
            <div className="rounded-3xl border border-white/20 bg-white/90 p-4 shadow-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <i className="fas fa-lock text-xs"></i>
                <span>https://</span>
                <span className="truncate">{urlPreview.replace(/^https?:\/\//, "")}</span>
              </div>
              <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-3 text-gray-800 shadow-inner">
                {hasQr ? (
                  <img src={qrImage} alt="QR vista previa" className="w-full rounded-xl" />
                ) : (
                  <div className="grid h-28 place-items-center rounded-xl border-2 border-dashed border-gray-200 text-xs uppercase tracking-[0.3em] text-gray-400">
                    Vista previa
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Escanea para abrir la página en tu navegador.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  // Validar input en tiempo real
  useEffect(() => {
    if (text || Object.values(extraFields).some(v => v)) {
      const validationResult = validateInput(qrType, text, extraFields);
      setValidation(validationResult);
    } else {
      setValidation({ errors: [], suggestions: [], isValid: true });
    }
  }, [text, extraFields, qrType]);

  // Cargar analytics al montar
  useEffect(() => {
    setAnalytics(getAnalytics());
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (mockupPulseTimeout.current) {
        clearTimeout(mockupPulseTimeout.current);
      }
    };
  }, []);

  // Filtrar tipos según búsqueda
  const filteredCategories = Object.entries(qrCategories).reduce((acc, [key, category]) => {
    const filteredTypes = category.types.filter(type =>
      type.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredTypes.length > 0) {
      acc[key] = { ...category, types: filteredTypes };
    }
    return acc;
  }, {});

  // Detectar tipo automáticamente cuando el usuario escribe
  const handleTextChange = (value) => {
    setText(value);
    
    // Detectar tipo automáticamente si está vacío o es URL
    if (value && qrType === "url") {
      const detected = detectType(value);
      if (detected && detected !== "url") {
        // Sugerir cambio de tipo (para futura implementación)
        const detectedType = allQrTypes.find(t => t.id === detected);
        if (detectedType) {
          // No cambiar automáticamente, solo para referencia
        }
      }
    }
  };

  const generateQr = async () => {
    const formattedData = formatQRData(qrType, text, extraFields);

    if (!formattedData.trim()) {
      return;
    }

    // Validar antes de generar
    const validationResult = validateInput(qrType, text, extraFields);
    if (!validationResult.isValid && qrType !== "url" && qrType !== "menu" && qrType !== "coupon") {
      // Mostrar errores pero permitir generar de todas formas
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const size = qrSize;
      const padding = Math.min(qrMargin, size / 2 - 10);
      const qrAreaSize = Math.max(size - padding * 2, 80);

      canvas.width = size;
      canvas.height = size;

      const tempCanvas = document.createElement("canvas");

      await new Promise((resolve, reject) => {
        QRCode.toCanvas(
          tempCanvas,
          formattedData,
          {
            errorCorrectionLevel: errorCorrection,
            width: qrAreaSize,
            margin: 0,
            color: {
              dark: qrColor || "#000000",
              light: "#FFFFFF",
            },
          },
          (error) => {
            if (error) reject(error);
            else resolve(null);
          }
        );
      });

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(tempCanvas, padding, padding);

      const finalizeCanvas = () => {
        const imageData = canvas.toDataURL("image/png");
        setQrImage(imageData);
        updateAnalytics(qrType);
        setAnalytics(getAnalytics());
        triggerMockupPulse();
      };

      if (logoPreview) {
        const logoSizeMap = { L: 0.12, M: 0.16, Q: 0.18, H: 0.2 };
        const logoScale = logoSizeMap[errorCorrection] || 0.16;
        const logoSize = Math.min(size * logoScale, size * 0.25);
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.onload = () => {
          const cornerRadius = Math.max(6, logoSize * 0.1);
          const paddingAroundLogo = logoSize * 0.15;
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          const x = logoX - paddingAroundLogo;
          const y = logoY - paddingAroundLogo;
          const w = logoSize + paddingAroundLogo * 2;
          const h = logoSize + paddingAroundLogo * 2;
          ctx.moveTo(x + cornerRadius, y);
          ctx.lineTo(x + w - cornerRadius, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + cornerRadius);
          ctx.lineTo(x + w, y + h - cornerRadius);
          ctx.quadraticCurveTo(x + w, y + h, x + w - cornerRadius, y + h);
          ctx.lineTo(x + cornerRadius, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - cornerRadius);
          ctx.lineTo(x, y + cornerRadius);
          ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
          ctx.closePath();
          ctx.fill();

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(logoX + cornerRadius, logoY);
          ctx.lineTo(logoX + logoSize - cornerRadius, logoY);
          ctx.quadraticCurveTo(logoX + logoSize, logoY, logoX + logoSize, logoY + cornerRadius);
          ctx.lineTo(logoX + logoSize, logoY + logoSize - cornerRadius);
          ctx.quadraticCurveTo(logoX + logoSize, logoY + logoSize, logoX + logoSize - cornerRadius, logoY + logoSize);
          ctx.lineTo(logoX + cornerRadius, logoY + logoSize);
          ctx.quadraticCurveTo(logoX, logoY + logoSize, logoX, logoY + logoSize - cornerRadius);
          ctx.lineTo(logoX, logoY + cornerRadius);
          ctx.quadraticCurveTo(logoX, logoY, logoX + cornerRadius, logoY);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          ctx.restore();

          finalizeCanvas();
        };
        logoImg.onerror = finalizeCanvas;
        logoImg.src = logoPreview;
      } else {
        finalizeCanvas();
      }
    } catch (error) {
      console.error("Error al generar QR:", error);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Por favor, selecciona una imagen menor a 2MB.");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  // Convertir imagen a diferentes formatos
  const convertToFormat = async (format, quality = 0.92) => {
    if (!qrImage) return null;

    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = () => {
        // Asegurar que el canvas tenga el tamaño correcto
        const size = qrSize;
        canvas.width = size;
        canvas.height = size;
        
        // Dibujar imagen en el canvas
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        
        let dataUrl;
        switch (format.toLowerCase()) {
          case "jpg":
          case "jpeg":
            dataUrl = canvas.toDataURL("image/jpeg", quality);
            break;
          case "webp":
            dataUrl = canvas.toDataURL("image/webp", quality);
            break;
          case "png":
          default:
            dataUrl = canvas.toDataURL("image/png");
            break;
        }
        
        resolve(dataUrl);
      };
      img.src = qrImage;
    });
  };

  // Generar SVG del QR
  const generateSVG = () => {
    if (!qrImage) return null;
    
    const size = qrSize;
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#FFFFFF"/>
  <image href="${qrImage}" width="${size}" height="${size}"/>
</svg>`.trim();
    
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const downloadQr = async () => {
    if (!qrImage) return;

    let dataUrl = qrImage;
    let filename = `qr-code-${Date.now()}`;
    let mimeType = "image/png";

    try {
      switch (downloadFormat.toLowerCase()) {
        case "jpg":
        case "jpeg":
          dataUrl = await convertToFormat("jpg", 0.92);
          filename += ".jpg";
          mimeType = "image/jpeg";
          break;
        case "webp":
          dataUrl = await convertToFormat("webp", 0.92);
          filename += ".webp";
          mimeType = "image/webp";
          break;
        case "svg":
          dataUrl = generateSVG();
          filename += ".svg";
          mimeType = "image/svg+xml";
          break;
        case "png":
        default:
          dataUrl = qrImage;
          filename += ".png";
          mimeType = "image/png";
          break;
      }

      if (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error al descargar QR:", error);
      // Fallback a PNG
      const link = document.createElement("a");
      link.href = qrImage;
      link.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Funciones de compartir y colaborar
  const generateShareUrl = () => {
    if (typeof window !== "undefined" && qrImage) {
      // Crear un enlace compartible usando data URL (para desarrollo)
      // En producción, podrías subir la imagen a un servidor y generar una URL real
      const base64 = qrImage.split(',')[1];
      const blob = new Blob([atob(base64)], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setShareUrl(url);
      return url;
    }
    return "";
  };

  const copyToClipboard = async (text, type = "text") => {
    try {
      if (type === "image" && qrImage) {
        // Convertir base64 a blob y copiar
        const response = await fetch(qrImage);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
      // Fallback para navegadores antiguos
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnSocial = (platform) => {
    const formattedData = formatQRData(qrType, text, extraFields);
    const shareText = encodeURIComponent(`¡Mira este código QR generado con ArbTech!`);
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    
    let url = "";
    
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`;
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`;
        break;
      case "email":
        const subject = encodeURIComponent("Código QR generado con ArbTech");
        const body = encodeURIComponent(`¡Mira este código QR!\n\n${formattedData}\n\nGenerado con: ${shareUrl}`);
        url = `mailto:?subject=${subject}&body=${body}`;
        break;
    }
    
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  const getEmbedCode = () => {
    if (!qrImage) return "";
    const formattedData = formatQRData(qrType, text, extraFields);
    return `<div style="text-align: center;">
  <img src="${qrImage}" alt="QR Code - ${formattedData.substring(0, 50)}..." style="max-width: 300px; height: auto;" />
  <p style="font-size: 12px; color: #666; margin-top: 10px;">Generado con <a href="${typeof window !== "undefined" ? window.location.origin : ""}" target="_blank">ArbTech QR Generator</a></p>
</div>`;
  };

  const copyEmbedCode = () => {
    const code = getEmbedCode();
    copyToClipboard(code, "text");
  };

const PhoneMockup = ({ children, theme, pulse }) => {
  const backgroundClass = theme?.backgroundClass ?? "bg-gradient-to-br from-slate-100 via-white to-slate-200";
  const textClass = theme?.textClass ?? "text-gray-700";
  const header = theme?.header;
  const backgroundWithAnimation =
    theme?.disableAnimation === true ? backgroundClass : `${backgroundClass} animate-gradient`;

  return (
    <div className="flex justify-center">
      <div
        className={`relative w-[220px] sm:w-[260px] lg:w-[300px] aspect-[9/17] bg-neutral-900 rounded-[40px] p-2.5 shadow-[0_20px_45px_rgba(15,23,42,0.4)] animate-phone ${
          pulse ? "animate-pulse-strong" : ""
        }`}
      >
        <div
          aria-hidden="true"
          className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/70 rounded-full"
        ></div>
        <div
          aria-hidden="true"
          className="absolute top-12 right-2 w-1.5 h-12 bg-black/60 rounded-full"
        ></div>
        <div
          aria-hidden="true"
          className="absolute top-28 right-2 w-1.5 h-16 bg-black/60 rounded-full"
        ></div>
        <div
          className={`relative z-10 flex h-full flex-col rounded-[34px] overflow-hidden ${backgroundWithAnimation}`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 top-0 h-6 rounded-b-[18px] bg-black/10"
          ></div>
          <div className="relative z-10 flex h-full flex-col px-4 py-5 space-y-4">
            {header && (
              <div className={`flex items-center justify-between text-[0.7rem] font-semibold ${textClass}`}>
                <div className="flex items-center gap-2">
                  <i className={`${header.icon} text-base`}></i>
                  <div className="leading-tight">
                    <p>{header.title}</p>
                    {header.subtitle && (
                      <span className="block text-[0.6rem] opacity-80">{header.subtitle}</span>
                    )}
                  </div>
                </div>
                {header.badge && (
                  <span className="rounded-full bg-white/25 px-2 py-1 text-[0.55rem] uppercase tracking-[0.2em]">
                    {header.badge}
                  </span>
                )}
              </div>
            )}
            <div className="flex-1 flex flex-col">
              {typeof children === "function" ? children({ textClass }) : children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  // Regenerar QR cuando cambia el color, logo, tamaño, margen o corrección de errores
  useEffect(() => {
    if (text && qrImage) {
      generateQr();
    }
  }, [qrColor, logoPreview, qrSize, qrMargin, errorCorrection]);

  // Limpiar campos cuando cambia el tipo
  useEffect(() => {
    setText("");
    setExtraFields({});
    setQrImage("");
  }, [qrType]);

  const renderExtraFields = () => {
    if (qrType === "wifi") {
      return (
        <>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              <i className="fas fa-network-wired text-green-600 hover:text-green-700 transition-colors mr-2"></i>
              SSID (Nombre de red)
            </label>
            <input
              type="text"
              value={extraFields.ssid || ""}
              onChange={(e) => setExtraFields({...extraFields, ssid: e.target.value})}
              placeholder="MiRed"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              <i className="fas fa-lock text-green-600 hover:text-green-700 transition-colors mr-2"></i>
              Contraseña
            </label>
            <input
              type="password"
              value={extraFields.password || ""}
              onChange={(e) => setExtraFields({...extraFields, password: e.target.value})}
              placeholder="Contraseña Wi-Fi"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg"
            />
          </div>
        </>
      );
    }
    
    if (qrType === "vcard" || qrType === "business") {
      return (
        <>
          {qrType === "business" && (
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                <i className="fas fa-building text-green-600 hover:text-green-700 transition-colors mr-2"></i>
                Nombre de la empresa
              </label>
              <input
                type="text"
                value={extraFields.name || ""}
                onChange={(e) => setExtraFields({...extraFields, name: e.target.value})}
                placeholder="Nombre de la empresa"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg"
              />
            </div>
          )}
          {qrType === "vcard" && (
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                <i className="fas fa-user text-green-600 hover:text-green-700 transition-colors mr-2"></i>
                Nombre completo
              </label>
              <input
                type="text"
                value={extraFields.name || ""}
                onChange={(e) => setExtraFields({...extraFields, name: e.target.value})}
                placeholder="Juan Pérez"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg"
              />
            </div>
          )}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              <i className="fas fa-phone text-green-600 hover:text-green-700 transition-colors mr-2"></i>
              Teléfono
            </label>
            <input
              type="tel"
              value={extraFields.phone || ""}
              onChange={(e) => setExtraFields({...extraFields, phone: e.target.value})}
              placeholder="+1234567890"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              <i className="fas fa-envelope text-green-600 hover:text-green-700 transition-colors mr-2"></i>
              Email
            </label>
            <input
              type="email"
              value={extraFields.email || ""}
              onChange={(e) => setExtraFields({...extraFields, email: e.target.value})}
              placeholder="ejemplo@email.com"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              <i className="fas fa-map-marker-alt text-green-600 hover:text-green-700 transition-colors mr-2"></i>
              Dirección
            </label>
            <input
              type="text"
              value={extraFields.address || ""}
              onChange={(e) => setExtraFields({...extraFields, address: e.target.value})}
              placeholder="Dirección completa"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg"
            />
          </div>
        </>
      );
    }
    
    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 mb-8 sm:mb-10 lg:mb-12 text-center text-white relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>
            <div className="absolute top-1/2 right-10 w-24 h-24 bg-white/5 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <i className="fas fa-qrcode text-4xl sm:text-5xl lg:text-6xl animate-pulse"></i>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
                  Genera tus QR con
                  <span className="block sm:inline sm:ml-2 bg-white text-green-600 px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl inline-block mt-2 sm:mt-0">
                    ArbTech
                  </span>
                </h1>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-4 sm:mb-6 max-w-3xl mx-auto">
                Crea códigos QR personalizados, profesionales y funcionales en segundos
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg">
                  <i className="fas fa-palette"></i>
                  <span>Colores personalizados</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg">
                  <i className="fas fa-image"></i>
                  <span>Agrega tu logo</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg">
                  <i className="fas fa-bolt"></i>
                  <span>Rápido y fácil</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
              <i className="fas fa-magic text-green-600 hover:text-green-700 transition-colors"></i>
              <span>Generador de QR</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Elige el tipo de QR y personalízalo a tu gusto
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7 lg:gap-10">
            {/* Panel de Control */}
            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-7 lg:p-10 space-y-5 sm:space-y-7">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
                <i className="fas fa-sliders-h text-green-600 hover:text-green-700 transition-colors mr-2"></i>
                Configuración
              </h2>

              {/* Selector de tipo - Dropdown profesional */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-base font-medium text-gray-700 mb-3">
                  <i className="fas fa-list text-green-600 hover:text-green-700 transition-colors mr-2"></i>
                  Tipo de QR
                </label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-white border-2 border-gray-300 rounded-lg hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <i className={`${selectedType.icon.startsWith('fa') ? selectedType.icon : `fas ${selectedType.icon}`} text-green-600 text-lg sm:text-xl`}></i>
                    <span className="text-base sm:text-lg font-medium text-gray-800">{selectedType.name}</span>
                  </div>
                  <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-hidden">
                    {/* Búsqueda */}
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <div className="relative">
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar tipo de QR..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Lista de categorías y tipos */}
                    <div className="overflow-y-auto max-h-80">
                      {Object.entries(filteredCategories).map(([categoryKey, category]) => (
                        <div key={categoryKey} className="border-b border-gray-100 last:border-b-0">
                          {/* Header de categoría */}
                          <div className="px-4 py-2 bg-green-50 border-b border-green-100">
                            <div className="flex items-center gap-2">
                              <i className={`${category.icon.startsWith('fa') ? category.icon : `fas ${category.icon}`} text-green-600 text-sm`}></i>
                              <span className="text-sm font-semibold text-green-700">{category.name}</span>
                            </div>
                          </div>
                          
                          {/* Tipos de la categoría */}
                          {category.types.map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => {
                                setQrType(type.id);
                                setIsDropdownOpen(false);
                                setSearchQuery("");
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors ${
                                qrType === type.id ? "bg-green-100 border-l-4 border-green-500" : ""
                              }`}
                            >
                              <i className={`${type.icon.startsWith('fa') ? type.icon : `fas ${type.icon}`} text-lg ${
                                qrType === type.id ? "text-green-600" : "text-gray-500"
                              }`}></i>
                              <span className={`text-sm sm:text-base ${
                                qrType === type.id ? "font-semibold text-green-700" : "text-gray-700"
                              }`}>
                                {type.name}
                              </span>
                              {qrType === type.id && (
                                <i className="fas fa-check text-green-600 ml-auto"></i>
                              )}
                            </button>
                          ))}
                        </div>
                      ))}
                      
                      {Object.keys(filteredCategories).length === 0 && (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <i className="fas fa-search text-3xl mb-2"></i>
                          <p>No se encontraron tipos de QR</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Input principal según el tipo */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">
                  <i className={`${selectedType.icon.startsWith('fa') ? selectedType.icon : `fas ${selectedType.icon}`} text-green-600 hover:text-green-700 transition-colors mr-2`}></i>
                  {selectedType.name}
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={selectedType.placeholder}
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 border rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
                    validation.errors.length > 0
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : validation.isValid && text
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-green-500 focus:border-transparent"
                  }`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      generateQr();
                    }
                  }}
                />
                
                {/* Mensajes de validación */}
                {validation.errors.length > 0 && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <i className="fas fa-exclamation-circle text-red-600 mt-0.5"></i>
                      <div className="flex-1">
                        {validation.errors.map((error, idx) => (
                          <p key={idx} className="text-sm text-red-700">{error}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Sugerencias */}
                {validation.suggestions.length > 0 && !validation.errors.length && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <i className="fas fa-lightbulb text-blue-600 mt-0.5"></i>
                      <div className="flex-1">
                        {validation.suggestions.map((suggestion, idx) => (
                          <p key={idx} className="text-sm text-blue-700">{suggestion}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Campos extra según el tipo */}
              {renderExtraFields()}

              {/* Selector de color */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">
                  <i className="fas fa-palette text-green-600 hover:text-green-700 transition-colors mr-2"></i>
                  Color del QR
                </label>
                <div className="flex items-center gap-3 sm:gap-4">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-14 sm:w-18 h-12 sm:h-14 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="flex-1 px-4 sm:px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-lg"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Opciones avanzadas */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <i className="fas fa-cog text-green-600"></i>
                    <span className="text-base font-medium text-gray-700">Opciones Avanzadas</span>
                  </div>
                  <i className={`fas fa-chevron-${showAdvanced ? 'up' : 'down'} text-gray-400`}></i>
                </button>
                
                {showAdvanced && (
                  <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {/* Nivel de corrección de errores */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-shield-alt text-green-600 mr-2"></i>
                        Nivel de Corrección de Errores
                      </label>
                      <select
                        value={errorCorrection}
                        onChange={(e) => setErrorCorrection(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                      >
                        <option value="L">L - Bajo (7% recuperación)</option>
                        <option value="M">M - Medio (15% recuperación) - Recomendado</option>
                        <option value="Q">Q - Alto (25% recuperación)</option>
                        <option value="H">H - Máximo (30% recuperación)</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Mayor nivel = más datos de corrección, QR más denso pero más resistente a daños
                      </p>
                    </div>
                    
                    {/* Tamaño del QR */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-expand-arrows-alt text-green-600 mr-2"></i>
                        Tamaño del QR: {qrSize}px
                      </label>
                      <input
                        type="range"
                        min="200"
                        max="800"
                        step="50"
                        value={qrSize}
                        onChange={(e) => setQrSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>200px</span>
                        <span>500px</span>
                        <span>800px</span>
                      </div>
                    </div>
                    
                    {/* Margen */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-border-style text-green-600 mr-2"></i>
                        Margen: {qrMargin}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={qrMargin}
                        onChange={(e) => setQrMargin(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0px</span>
                        <span>50px</span>
                        <span>100px</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload de logo */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">
                  <i className="fas fa-image text-green-600 hover:text-green-700 transition-colors mr-2"></i>
                  Logo/Imagen (Opcional)
                </label>
                {!logoPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 sm:p-7 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <i className="fas fa-cloud-upload-alt text-3xl sm:text-4xl text-green-500 hover:text-green-600 transition-colors mb-3"></i>
                      <span className="text-sm sm:text-base text-gray-600">
                        Haz clic para subir una imagen
                      </span>
                      <span className="text-xs sm:text-sm text-gray-400 mt-2">
                        Máx. 2MB
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="border border-gray-300 rounded-lg p-4 sm:p-5 flex items-center justify-between bg-gray-50">
                      <div className="flex items-center gap-3">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded bg-white p-1"
                        />
                        <span className="text-sm sm:text-base text-gray-700">Logo cargado</span>
                      </div>
                      <button
                        onClick={removeLogo}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Eliminar logo"
                      >
                        <i className="fas fa-times-circle text-xl sm:text-2xl"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón generar */}
              <button
                onClick={generateQr}
                disabled={!text.trim() && !Object.values(extraFields).some(v => v)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 sm:py-4 px-5 sm:px-7 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                <i className="fas fa-magic text-white text-lg"></i>
                <span>Generar QR</span>
              </button>
            </div>

            {/* Panel de Vista Previa */}
            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-7 lg:p-10 space-y-5 sm:space-y-7">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
                  <i className="fas fa-eye text-green-600 hover:text-green-700 transition-colors mr-2"></i>
                  Vista Previa
                </h2>
                
                {/* Analytics básicos */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="fas fa-chart-line text-green-600"></i>
                  <span className="hidden sm:inline">Total: {analytics.totalGenerated}</span>
                  <span className="sm:hidden">{analytics.totalGenerated}</span>
                </div>
              </div>
              
              {/* Panel de Analytics */}
              {analytics.totalGenerated > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-green-800 flex items-center">
                      <i className="fas fa-chart-bar text-green-600 mr-2"></i>
                      Estadísticas
                    </h3>
                    <button
                      onClick={() => {
                        if (confirm("¿Estás seguro de que quieres resetear las estadísticas?")) {
                          localStorage.removeItem("qrAnalytics");
                          setAnalytics(getAnalytics());
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-700 transition-colors"
                      title="Resetear estadísticas"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-green-600">{analytics.totalGenerated}</div>
                      <div className="text-xs text-gray-600 mt-1">Total generados</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-green-600">{analytics.todayGenerated}</div>
                      <div className="text-xs text-gray-600 mt-1">Hoy</div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl bg-white/90 p-4 shadow-sm border border-green-100">
                      <div className="flex items-center justify-between text-xs font-semibold text-green-700 uppercase tracking-[0.3em]">
                        <span>Actividad semanal</span>
                        <span>{historyData.length} días</span>
                      </div>
                      <div className="mt-4 flex h-28 items-end gap-2">
                        {historyData.map((entry) => (
                          <div key={entry.date} className="flex-1 flex flex-col items-center gap-2">
                            <div
                              className="w-full rounded-t-xl bg-gradient-to-t from-emerald-500 to-green-400 transition-all duration-500"
                              style={{ height: `${(entry.count / maxHistoryValue) * 100}%` }}
                            ></div>
                            <span className="text-[0.65rem] font-semibold text-green-800">
                              {formatHistoryLabel(entry.date)}
                            </span>
                          </div>
                        ))}
                        {historyData.length === 0 && (
                          <div className="text-xs text-green-800/70">Genera tu primer QR para ver estadísticas.</div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/90 p-4 shadow-sm border border-green-100">
                      <div className="text-xs font-semibold text-green-700 uppercase tracking-[0.3em]">
                        Tipos más usados
                      </div>
                      <div className="mt-4 space-y-3">
                        {topTypeEntries.length > 0 ? (
                          topTypeEntries.map(([type, count]) => {
                            const typeInfo = allQrTypes.find((t) => t.id === type);
                            return (
                              <div key={type}>
                                <div className="flex items-center justify-between text-xs text-green-900 mb-1">
                                  <span className="flex items-center gap-2">
                                    <i
                                      className={`${
                                        typeInfo?.icon?.startsWith("fa")
                                          ? typeInfo.icon
                                          : `fas ${typeInfo?.icon || "fa-qrcode"}`
                                      } text-green-500`}
                                    ></i>
                                    {typeInfo?.name || type}
                                  </span>
                                  <span className="font-semibold">{count}</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-100">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                                    style={{ width: `${(count / maxTypeValue) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-slate-500">Genera algunos QR para ver la distribución.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <PhoneMockup theme={mockupTheme} pulse={mockupPulse}>
                {renderMockupContent}
              </PhoneMockup>

              {qrImage && (
                <div className="space-y-4">
                  {/* Selector de formato y botón Descargar */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-file-export text-green-600 mr-2"></i>
                        Formato de descarga
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => setDownloadFormat("png")}
                          className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                            downloadFormat === "png"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-300 bg-white text-gray-700 hover:border-green-300"
                          }`}
                        >
                          <i className="fas fa-image mr-1"></i>
                          PNG
                        </button>
                        <button
                          onClick={() => setDownloadFormat("jpg")}
                          className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                            downloadFormat === "jpg"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-300 bg-white text-gray-700 hover:border-green-300"
                          }`}
                        >
                          <i className="fas fa-file-image mr-1"></i>
                          JPG
                        </button>
                        <button
                          onClick={() => setDownloadFormat("svg")}
                          className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                            downloadFormat === "svg"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-300 bg-white text-gray-700 hover:border-green-300"
                          }`}
                        >
                          <i className="fas fa-vector-square mr-1"></i>
                          SVG
                        </button>
                        <button
                          onClick={() => setDownloadFormat("webp")}
                          className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                            downloadFormat === "webp"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-300 bg-white text-gray-700 hover:border-green-300"
                          }`}
                        >
                          <i className="fas fa-file-code mr-1"></i>
                          WEBP
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        <i className="fas fa-info-circle mr-1"></i>
                        {downloadFormat === "png" && "Mejor calidad, sin pérdida de datos"}
                        {downloadFormat === "jpg" && "Tamaño más pequeño, ideal para web"}
                        {downloadFormat === "svg" && "Vectorial, escalable sin pérdida de calidad"}
                        {downloadFormat === "webp" && "Formato moderno, mejor compresión"}
                      </p>
                    </div>

                    <button
                      onClick={downloadQr}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 sm:py-4 px-5 sm:px-7 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-base sm:text-lg"
                    >
                      <i className="fas fa-download text-white text-lg"></i>
                      <span>Descargar QR ({downloadFormat.toUpperCase()})</span>
                    </button>
                  </div>

                  {/* Sección Compartir y Colaborar */}
                  <div className="border-t border-gray-200 pt-4 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <i className="fas fa-share-alt text-green-600 mr-2"></i>
                      Compartir y Colaborar
                    </h3>

                    {/* Botones de Redes Sociales */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      <button
                        onClick={() => shareOnSocial("facebook")}
                        className="flex flex-col items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all transform hover:scale-105"
                        title="Compartir en Facebook"
                      >
                        <i className="fab fa-facebook-f text-xl mb-1"></i>
                        <span className="text-xs hidden sm:inline">Facebook</span>
                      </button>
                      <button
                        onClick={() => shareOnSocial("twitter")}
                        className="flex flex-col items-center justify-center p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all transform hover:scale-105"
                        title="Compartir en Twitter"
                      >
                        <i className="fab fa-twitter text-xl mb-1"></i>
                        <span className="text-xs hidden sm:inline">Twitter</span>
                      </button>
                      <button
                        onClick={() => shareOnSocial("linkedin")}
                        className="flex flex-col items-center justify-center p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-all transform hover:scale-105"
                        title="Compartir en LinkedIn"
                      >
                        <i className="fab fa-linkedin-in text-xl mb-1"></i>
                        <span className="text-xs hidden sm:inline">LinkedIn</span>
                      </button>
                      <button
                        onClick={() => shareOnSocial("whatsapp")}
                        className="flex flex-col items-center justify-center p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all transform hover:scale-105"
                        title="Compartir en WhatsApp"
                      >
                        <i className="fab fa-whatsapp text-xl mb-1"></i>
                        <span className="text-xs hidden sm:inline">WhatsApp</span>
                      </button>
                      <button
                        onClick={() => shareOnSocial("telegram")}
                        className="flex flex-col items-center justify-center p-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-all transform hover:scale-105"
                        title="Compartir en Telegram"
                      >
                        <i className="fab fa-telegram-plane text-xl mb-1"></i>
                        <span className="text-xs hidden sm:inline">Telegram</span>
                      </button>
                      <button
                        onClick={() => shareOnSocial("email")}
                        className="flex flex-col items-center justify-center p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all transform hover:scale-105"
                        title="Compartir por Email"
                      >
                        <i className="fas fa-envelope text-xl mb-1"></i>
                        <span className="text-xs hidden sm:inline">Email</span>
                      </button>
                    </div>

                    {/* Copiar imagen al portapapeles */}
                    <button
                      onClick={() => copyToClipboard(qrImage, "image")}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <i className={`fas ${copied ? "fa-check" : "fa-copy"} text-green-600`}></i>
                      <span>{copied ? "¡Copiado!" : "Copiar imagen al portapapeles"}</span>
                    </button>

                    {/* Copiar URL compartible */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={typeof window !== "undefined" ? window.location.href : ""}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        placeholder="URL compartible"
                      />
                      <button
                        onClick={() => copyToClipboard(typeof window !== "undefined" ? window.location.href : "", "text")}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all flex items-center gap-2"
                        title="Copiar URL"
                      >
                        <i className={`fas ${copied ? "fa-check" : "fa-link"}`}></i>
                        <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar"}</span>
                      </button>
                    </div>

                    {/* Código Embed */}
                    <div>
                      <button
                        onClick={() => setShowEmbedCode(!showEmbedCode)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <i className="fas fa-code text-green-600"></i>
                          <span className="font-medium">Código Embed</span>
                        </div>
                        <i className={`fas fa-chevron-${showEmbedCode ? 'up' : 'down'} text-gray-400`}></i>
                      </button>
                      
                      {showEmbedCode && (
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">
                              Copia este código para insertar el QR en tu sitio web:
                            </label>
                            <button
                              onClick={copyEmbedCode}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-all flex items-center gap-1"
                            >
                              <i className={`fas ${copied ? "fa-check" : "fa-copy"}`}></i>
                              <span>{copied ? "Copiado" : "Copiar"}</span>
                            </button>
                          </div>
                          <textarea
                            ref={embedCodeRef}
                            value={getEmbedCode()}
                            readOnly
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={(e) => e.target.select()}
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            <i className="fas fa-info-circle mr-1"></i>
                            Pega este código HTML en tu sitio web para mostrar el QR
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sección de información adicional */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-11 w-11 rounded-2xl bg-green-100 text-green-600 grid place-items-center text-xl">
                  <i className="fas fa-question-circle"></i>
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">Preguntas frecuentes</h2>
              </div>
              <dl className="space-y-3">
                {faqItems.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={item.question}
                      className={`rounded-2xl border border-slate-100 transition-all duration-300 ${
                        isOpen ? "bg-green-50/80 shadow-inner" : "bg-white hover:border-green-200"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none"
                      >
                        <span className="font-semibold text-slate-900">{item.question}</span>
                        <i
                          className={`fas fa-chevron-${isOpen ? "up" : "down"} text-sm text-slate-400 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        ></i>
                      </button>
                      <div
                        className={`px-5 pb-4 text-sm text-slate-600 transition-all duration-300 ${
                          isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        {item.answer}
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-11 w-11 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center text-xl">
                  <i className="fas fa-qrcode"></i>
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">¿Cómo funciona un código QR?</h2>
              </div>
              <div className="space-y-4">
                {qrSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="group rounded-2xl border border-slate-100 bg-white/90 px-5 py-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 text-xl">
                        <i className={step.icon}></i>
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{step.title}</p>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
                          Paso {index + 1}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
            <div className="flex flex-wrap gap-3 items-center mb-4">
              <div className="h-11 w-11 rounded-2xl bg-blue-100 text-blue-600 grid place-items-center text-xl">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">Tips para obtener el mejor resultado</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3 text-slate-600">
              {bestTips.map((tip) => (
                <div
                  key={tip.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                >
                  <p className="font-semibold text-slate-900">{tip.title}</p>
                  <p className="mt-2 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sección de consejos de diseño y contacto */}
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <div className="h-11 w-11 rounded-2xl bg-purple-100 text-purple-600 grid place-items-center text-xl">
                <i className="fas fa-pen-ruler"></i>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Consejos de uso: flyers, tarjetas y contacto
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3 text-slate-600">
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <i className="fas fa-file-lines text-purple-500"></i>
                  Flyer con QR
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Coloca el QR en una zona limpia del flyer, lejos de bordes y textos saturados.</li>
                  <li>• Añade una llamada a la acción clara: “Escaneá para ver el menú”, “Ver más fotos”, etc.</li>
                  <li>• No reduzcas demasiado el tamaño: para lectura a distancia media, apunta a al menos 3–4 cm de lado.</li>
                  <li>• Evita fondos muy oscuros o muy texturados detrás del QR.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <i className="fas fa-address-card text-emerald-500"></i>
                  Tarjeta de presentación
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Ubica el QR en la cara trasera de la tarjeta para no recargar la parte frontal.</li>
                  <li>• Usa un QR de contacto (vCard) para que al escanear se guarde directo en la agenda.</li>
                  <li>• Mantén buen contraste y un margen blanco alrededor del código.</li>
                  <li>• Incluye también tus datos en texto por si alguien no puede escanear.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <i className="fas fa-building text-blue-500"></i>
                  Hoja de contacto ArbTech
                </h3>
                <p className="text-sm">
                  Puedes crear una hoja de contacto con un QR que apunte a tu portfolio, redes y datos
                  de contacto centralizados. Ideal para presentaciones, presupuestos y dossieres.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Genera un QR de tipo “links” o “social” con tus principales canales.</li>
                  <li>• En la hoja, acompaña el QR con un breve resumen de tus servicios.</li>
                  <li>• Usa un encabezado claro, por ejemplo “Escaneá para ver más de ArbTech”.</li>
                  <li>• Si lo imprimes, revisa que el QR sea legible en blanco y negro.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Canvas oculto para generar QR */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
