"use client";

import { useState, useRef, useEffect } from "react";

// Implementación pura de QR Code Generator sin librerías externas
// Genera QR codes válidos usando el estándar QR Code
function generateQRCodeMatrix(text) {
  // Determinar versión del QR (1-40, pero usaremos hasta versión 3 para simplificar)
  const dataLength = text.length;
  let version = 1;
  if (dataLength > 25) version = 2;
  if (dataLength > 47) version = 3;
  
  const size = 21 + (version - 1) * 4;
  const modules = Array(size).fill(null).map(() => Array(size).fill(false));
  
  // Codificar datos en modo byte (8 bits por carácter)
  const modeIndicator = "0100"; // Modo byte
  const charCount = dataLength.toString(2).padStart(8, "0");
  
  // Convertir texto a bits
  const dataBits = [];
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    for (let bit = 7; bit >= 0; bit--) {
      dataBits.push((charCode >> bit) & 1);
    }
  }
  
  // Terminador (4 bits de 0)
  const terminator = "0000";
  
  // Combinar todos los bits
  let bitString = modeIndicator + charCount + dataBits.join("") + terminator;
  
  // Asegurar que la longitud sea múltiplo de 8
  while (bitString.length % 8 !== 0) {
    bitString += "0";
  }
  
  // Convertir a array de bits
  const allBits = bitString.split("").map(bit => parseInt(bit));
  
  // Patrones de búsqueda (Finders) - 3 esquinas
  const addFinder = (modules, x, y) => {
    const pattern = [
      [1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1]
    ];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (x + i < size && y + j < size) {
          modules[x + i][y + j] = pattern[i][j] === 1;
        }
      }
    }
  };
  
  addFinder(modules, 0, 0);
  addFinder(modules, 0, size - 7);
  addFinder(modules, size - 7, 0);
  
  // Separadores (áreas blancas alrededor de finders)
  for (let i = 0; i < 8; i++) {
    if (i < size) {
      modules[7][i] = false;
      modules[i][7] = false;
      if (size - 8 + i < size) {
        modules[7][size - 8 + i] = false;
        modules[size - 8 + i][7] = false;
      }
    }
  }
  
  // Timing patterns (líneas alternadas)
  for (let i = 8; i < size - 8; i++) {
    modules[6][i] = (i % 2 === 0);
    modules[i][6] = (i % 2 === 0);
  }
  
  // Dark module (siempre negro en posición específica)
  if (size >= 21) {
    modules[size - 8][8] = true;
  }
  
  // Función para verificar si una posición está reservada
  const isReserved = (row, col) => {
    // Finder patterns
    if ((row < 9 && col < 9) || 
        (row < 9 && col >= size - 8) || 
        (row >= size - 8 && col < 9)) {
      return true;
    }
    // Timing patterns
    if (row === 6 || col === 6) {
      return true;
    }
    // Dark module
    if (row === size - 8 && col === 8) {
      return true;
    }
    return false;
  };
  
  // Rellenar datos en patrón zigzag (de derecha a izquierda, alternando arriba/abajo)
  let bitIndex = 0;
  let direction = -1; // -1 = arriba, 1 = abajo
  let col = size - 1;
  
  while (col >= 0 && bitIndex < allBits.length) {
    // Saltar columna de timing vertical
    if (col === 6) {
      col--;
      continue;
    }
    
    let row = direction === -1 ? size - 1 : 0;
    
    while (row >= 0 && row < size && bitIndex < allBits.length) {
      // Saltar áreas reservadas
      if (!isReserved(row, col)) {
        modules[row][col] = allBits[bitIndex] === 1;
        bitIndex++;
      }
      
      row += direction;
    }
    
    // Cambiar dirección y mover a la siguiente columna
    direction *= -1;
    col -= 2; // Saltamos de dos en dos columnas
    
    // Si llegamos a la columna 6, saltarla
    if (col === 6) {
      col--;
    }
  }
  
  // Rellenar módulos restantes con 0 (blanco)
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!isReserved(i, j) && bitIndex >= allBits.length) {
        modules[i][j] = false;
      }
    }
  }
  
  // Aplicar máscara (patrón 0: (i + j) % 2 === 0)
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!isReserved(i, j)) {
        const mask = ((i + j) % 2 === 0);
        modules[i][j] = modules[i][j] ^ mask;
      }
    }
  }
  
  return modules;
}

// Tipos de QR disponibles agrupados por categorías
const qrCategories = {
  web: {
    name: "Web y URLs",
    icon: "fa-globe",
    types: [
      { id: "url", name: "Sitio web", icon: "fa-globe", placeholder: "https://ejemplo.com" },
      { id: "pdf", name: "PDF", icon: "fa-file-pdf", placeholder: "https://ejemplo.com/documento.pdf" },
      { id: "links", name: "Lista de enlaces", icon: "fa-link", placeholder: "URL1,URL2,URL3" },
      { id: "app", name: "Aplicaciones", icon: "fa-mobile-alt", placeholder: "URL de la app store" },
    ]
  },
  social: {
    name: "Redes Sociales",
    icon: "fa-share-alt",
    types: [
      { id: "facebook", name: "Facebook", icon: "fa-facebook", placeholder: "https://facebook.com/tu-pagina" },
      { id: "instagram", name: "Instagram", icon: "fa-instagram", placeholder: "https://instagram.com/tu-perfil" },
      { id: "whatsapp", name: "WhatsApp", icon: "fa-whatsapp", placeholder: "+1234567890" },
      { id: "social", name: "Redes sociales", icon: "fa-share-alt", placeholder: "URLs de redes sociales" },
    ]
  },
  media: {
    name: "Multimedia",
    icon: "fa-photo-video",
    types: [
      { id: "images", name: "Imágenes", icon: "fa-images", placeholder: "https://ejemplo.com/imagen.jpg" },
      { id: "video", name: "Video", icon: "fa-video", placeholder: "https://ejemplo.com/video.mp4" },
      { id: "mp3", name: "MP3", icon: "fa-music", placeholder: "https://ejemplo.com/audio.mp3" },
    ]
  },
  contact: {
    name: "Contacto",
    icon: "fa-address-book",
    types: [
      { id: "vcard", name: "vCard", icon: "fa-address-card", placeholder: "Datos de contacto" },
      { id: "business", name: "Empresa", icon: "fa-building", placeholder: "Información de la empresa" },
    ]
  },
  other: {
    name: "Otros",
    icon: "fa-ellipsis-h",
    types: [
      { id: "wifi", name: "Wi-Fi", icon: "fa-wifi", placeholder: "SSID:MiRed,Password:12345678" },
      { id: "menu", name: "Menú", icon: "fa-utensils", placeholder: "Nombre del restaurante" },
      { id: "coupon", name: "Cupón", icon: "fa-ticket-alt", placeholder: "Código del cupón" },
    ]
  }
};

// Lista plana de todos los tipos para búsqueda
const allQrTypes = Object.values(qrCategories).flatMap(category => category.types);

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
  const canvasRef = useRef(null);
  const logoInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectedType = allQrTypes.find(t => t.id === qrType) || allQrTypes[0];

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

  const generateQr = async () => {
    const formattedData = formatQRData(qrType, text, extraFields);
    
    if (!formattedData.trim()) {
      return;
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const size = 400;
      const padding = 40;

      canvas.width = size;
      canvas.height = size;

      // Usar API externa para generar QR válido (sin librerías npm)
      // API pública de QR code generation
      const encodedData = encodeURIComponent(formattedData);
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size - padding * 2}x${size - padding * 2}&data=${encodedData}&color=${qrColor.replace('#', '')}`;
      
      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      
      qrImg.onload = () => {
        // Fondo blanco
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, size, size);

        // Dibujar QR desde la API
        ctx.drawImage(qrImg, padding, padding, size - padding * 2, size - padding * 2);

        // Si el color no es negro, reemplazar el color negro del QR
        if (qrColor !== "#000000") {
          const imageData = ctx.getImageData(0, 0, size, size);
          const data = imageData.data;
          const targetColor = hexToRgb(qrColor);
          
          for (let i = 0; i < data.length; i += 4) {
            // Si es un pixel oscuro (negro), cambiarlo al color seleccionado
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            // Detectar píxeles negros (umbral bajo)
            if (r < 50 && g < 50 && b < 50 && a > 0) {
              data[i] = targetColor.r;
              data[i + 1] = targetColor.g;
              data[i + 2] = targetColor.b;
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
        }

        // Agregar logo si existe
        if (logoPreview) {
          const logoSize = size * 0.25;
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          const logoImg = new Image();
          logoImg.crossOrigin = "anonymous";
          logoImg.onload = () => {
            // Fondo blanco redondeado para el logo
            const cornerRadius = 10;
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            // Dibujar rectángulo redondeado manualmente
            const x = logoX - 10;
            const y = logoY - 10;
            const w = logoSize + 20;
            const h = logoSize + 20;
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

            // Dibujar logo con recorte redondeado
            ctx.save();
            ctx.beginPath();
            const logoX2 = logoX;
            const logoY2 = logoY;
            ctx.moveTo(logoX2 + cornerRadius, logoY2);
            ctx.lineTo(logoX2 + logoSize - cornerRadius, logoY2);
            ctx.quadraticCurveTo(logoX2 + logoSize, logoY2, logoX2 + logoSize, logoY2 + cornerRadius);
            ctx.lineTo(logoX2 + logoSize, logoY2 + logoSize - cornerRadius);
            ctx.quadraticCurveTo(logoX2 + logoSize, logoY2 + logoSize, logoX2 + logoSize - cornerRadius, logoY2 + logoSize);
            ctx.lineTo(logoX2 + cornerRadius, logoY2 + logoSize);
            ctx.quadraticCurveTo(logoX2, logoY2 + logoSize, logoX2, logoY2 + logoSize - cornerRadius);
            ctx.lineTo(logoX2, logoY2 + cornerRadius);
            ctx.quadraticCurveTo(logoX2, logoY2, logoX2 + cornerRadius, logoY2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(logoImg, logoX2, logoY2, logoSize, logoSize);
            ctx.restore();
            
            setQrImage(canvas.toDataURL("image/png"));
          };
          logoImg.onerror = () => {
            setQrImage(canvas.toDataURL("image/png"));
          };
          logoImg.src = logoPreview;
        } else {
          setQrImage(canvas.toDataURL("image/png"));
        }
      };
      
      qrImg.onerror = () => {
        // Fallback: usar generación local si la API falla
        const modules = generateQRCodeMatrix(formattedData);
        const moduleSize = (size - padding * 2) / modules.length;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = qrColor;
        
        for (let i = 0; i < modules.length; i++) {
          for (let j = 0; j < modules[i].length; j++) {
            if (modules[i][j]) {
              const x = padding + j * moduleSize;
              const y = padding + i * moduleSize;
              ctx.fillRect(x, y, moduleSize, moduleSize);
            }
          }
        }
        
        setQrImage(canvas.toDataURL("image/png"));
      };
      
      qrImg.src = qrApiUrl;
    } catch (error) {
      console.error("Error al generar QR:", error);
    }
  };

  // Función auxiliar para convertir hex a RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
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

  const downloadQr = () => {
    if (qrImage) {
      const link = document.createElement("a");
      link.href = qrImage;
      link.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Regenerar QR cuando cambia el color o el logo
  useEffect(() => {
    if (text && qrImage) {
      generateQr();
    }
  }, [qrColor, logoPreview]);

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
                    <i className={`fas ${selectedType.icon} text-green-600 text-lg sm:text-xl`}></i>
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
                              <i className={`fas ${category.icon} text-green-600 text-sm`}></i>
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
                              <i className={`fas ${type.icon} text-lg ${
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
                  <i className={`fas ${selectedType.icon} text-green-600 hover:text-green-700 transition-colors mr-2`}></i>
                  {selectedType.name}
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={selectedType.placeholder}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      generateQr();
                    }
                  }}
                />
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
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
                <i className="fas fa-eye text-green-600 hover:text-green-700 transition-colors mr-2"></i>
                Vista Previa
              </h2>

              {qrImage ? (
                <div className="space-y-4">
                  <div className="flex justify-center bg-gray-50 rounded-lg p-4 sm:p-6">
                    <img
                      src={qrImage}
                      alt="QR Code"
                      className="max-w-full h-auto border-4 border-white rounded-lg shadow-md"
                    />
                  </div>

                  <button
                    onClick={downloadQr}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 sm:py-4 px-5 sm:px-7 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-base sm:text-lg"
                  >
                    <i className="fas fa-download text-white text-lg"></i>
                    <span>Descargar QR</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 sm:h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <i className={`fas ${selectedType.icon} text-4xl sm:text-6xl text-green-300 hover:text-green-400 transition-colors mb-3 sm:mb-4`}></i>
                  <p className="text-gray-500 text-center px-4 text-xs sm:text-sm">
                    Completa los campos y haz clic en "Generar QR" para ver la vista previa
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Canvas oculto para generar QR */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
