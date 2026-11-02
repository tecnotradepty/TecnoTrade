"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Smartphone, 
  Wrench, 
  ShieldCheck, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  X,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ExternalLink
} from "lucide-react";
import { REPAIR_CATALOG, POPULAR_MODELS } from "@/data/repairCatalog";

// Datos oficiales de TecnoTrade PTY
const WHATSAPP_NUMBER = "50768529324";
const INSTAGRAM_URL = "https://www.instagram.com/tecnotradepty/";
const GOOGLE_MAPS_URL = "https://www.google.com/maps?q=Mobile+Hub+Pty,+C.+Ricardo+Arias+5,+Panam%C3%A1,+Provincia+de+Panam%C3%A1&ftid=0x8faca9a77aef134b:0x20520f48e572172d&entry=gps&shh=CAE&lucs=,94297699,94284454,94231188,94280568,47071704,94218641,94282134,94286869&g_ep=CAISEjI2LjE5LjIuOTEwMjIxOTUwMBgAIIgnKkgsOTQyOTc2OTksOTQyODQ0NTQsOTQyMzExODgsOTQyODA1NjgsNDcwNzE3MDQsOTQyMTg2NDEsOTQyODIxMzQsOTQyODY4NjlCAlBB&skid=78b66149-c412-4190-89b3-86f1842bf2a2&g_st=ic";

// Dispositivos certificados en venta (para cliente final y revendedores)
export interface DeviceItem {
  id: string;
  brand: "iPhone" | "Samsung" | "Honor" | "Xiaomi" | "Pixel";
  model: string;
  sub: string;
  battery: string;
  grade: string;
  price: number;
  tag: string;
  colors: string[];
  image: string;
}

const DEVICES: DeviceItem[] = [
  // iPhone
  {
    id: "dev-ip15p",
    brand: "iPhone",
    model: "iPhone 15 Pro",
    sub: "Titanio Natural · 128 GB",
    battery: "99% Salud",
    grade: "Grado A+",
    price: 790,
    tag: "Titanium",
    colors: ["#9E9689", "#3C3D40", "#E3E4E5"],
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-ip14pm",
    brand: "iPhone",
    model: "iPhone 14 Pro Max",
    sub: "Deep Purple · 128 GB",
    battery: "94% Salud",
    grade: "Grado A+",
    price: 680,
    tag: "Alta Rotación",
    colors: ["#483D4F", "#232426", "#F2F1ED"],
    image: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-ip13",
    brand: "iPhone",
    model: "iPhone 13",
    sub: "Blanco Estrella · 128 GB",
    battery: "92% Salud",
    grade: "Impecable",
    price: 430,
    tag: "Más Pedido",
    colors: ["#F4F3ED", "#262C3A", "#DF3542"],
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-ip12",
    brand: "iPhone",
    model: "iPhone 12",
    sub: "Black · 64 GB",
    battery: "89% Salud",
    grade: "Verificado",
    price: 310,
    tag: "Ideal Reventa",
    colors: ["#202124", "#F4F3ED", "#35485E"],
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=700&q=80"
  },

  // Samsung
  {
    id: "dev-s23u",
    brand: "Samsung",
    model: "Samsung Galaxy S23 Ultra",
    sub: "Phantom Black · 256 GB",
    battery: "95% Salud",
    grade: "Seminuevo",
    price: 640,
    tag: "Flagship",
    colors: ["#232426", "#424D41", "#DCD4C6"],
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-s22p",
    brand: "Samsung",
    model: "Samsung Galaxy S22+",
    sub: "Verde Bosque · 128 GB",
    battery: "93% Salud",
    grade: "Excelente",
    price: 420,
    tag: "Serie S",
    colors: ["#32463F", "#1D1E22", "#F6F5F3"],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-a54",
    brand: "Samsung",
    model: "Samsung Galaxy A54 5G",
    sub: "Awesome Graphite · 128 GB",
    battery: "98% Salud",
    grade: "Como Nuevo",
    price: 220,
    tag: "Alta Demanda",
    colors: ["#2C3033", "#C5D8A4", "#928490"],
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=700&q=80"
  },

  // Honor
  {
    id: "dev-hn-m5p",
    brand: "Honor",
    model: "Honor Magic 5 Pro",
    sub: "Meadow Green · 512 GB",
    battery: "96% Salud",
    grade: "Grado A+",
    price: 490,
    tag: "512 GB",
    colors: ["#2D4F3C", "#1F2024"],
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-hn-90",
    brand: "Honor",
    model: "Honor 90",
    sub: "Diamond Silver · 256 GB",
    battery: "97% Salud",
    grade: "Impecable",
    price: 280,
    tag: "200 MP",
    colors: ["#D8DCE0", "#183059"],
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-hn-m6l",
    brand: "Honor",
    model: "Honor Magic 6 Lite",
    sub: "Emerald Green · 256 GB",
    battery: "99% Salud",
    grade: "Seminuevo",
    price: 240,
    tag: "Stock Rápido",
    colors: ["#1B3B30", "#DF7A34"],
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=700&q=80"
  },

  // Xiaomi
  {
    id: "dev-xm-13tp",
    brand: "Xiaomi",
    model: "Xiaomi 13T Pro",
    sub: "Black Ceramic · 512 GB",
    battery: "97% Salud",
    grade: "Grado A+",
    price: 460,
    tag: "Carga 120W",
    colors: ["#171717", "#879CB0"],
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-xm-rn13p",
    brand: "Xiaomi",
    model: "Redmi Note 13 Pro+ 5G",
    sub: "Aurora Purple · 256 GB",
    battery: "98% Salud",
    grade: "Como Nuevo",
    price: 310,
    tag: "Curvo 1.5K",
    colors: ["#D1C4E9", "#212121"],
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-xm-px6p",
    brand: "Xiaomi",
    model: "Poco X6 Pro",
    sub: "Yellow Edition · 256 GB",
    battery: "99% Salud",
    grade: "Impecable",
    price: 270,
    tag: "Alto Rendimiento",
    colors: ["#F9D342", "#1F1F1F"],
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=700&q=80"
  },

  // Pixel
  {
    id: "dev-px-8p",
    brand: "Pixel",
    model: "Google Pixel 8 Pro",
    sub: "Bay Blue · 128 GB",
    battery: "98% Salud",
    grade: "Grado A+",
    price: 540,
    tag: "Google AI",
    colors: ["#A8C7FA", "#202124", "#E3E3E3"],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-px-7",
    brand: "Pixel",
    model: "Google Pixel 7",
    sub: "Obsidian · 128 GB",
    battery: "94% Salud",
    grade: "Excelente",
    price: 320,
    tag: "Puro Android",
    colors: ["#202124", "#E7E8D1"],
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=700&q=80"
  }
];

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
}

// Resumen compacto en texto para las sugerencias de búsqueda
export interface TextSuggestion {
  model: string;
  brand: "Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google";
  summaryLine: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"taller" | "productos">("taller");

  // Barra de búsqueda superior unificada en Taller
  const [directSearchQuery, setDirectSearchQuery] = useState("");

  // Filtros paso a paso ubicados justo debajo de la barra de búsqueda
  const [selectedBrand, setSelectedBrand] = useState<"Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google" | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"Pantallas" | "Tapas Traseras" | "Puertos de Carga" | null>(null);

  // Filtros de Móviles en Venta
  const [deviceBrandFilter, setDeviceBrandFilter] = useState<string>("Todos");
  const [devicePriceSort, setDevicePriceSort] = useState<"default" | "asc" | "desc">("default");
  const [showFullCatalog, setShowFullCatalog] = useState(false);

  // Estado del Carrito
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  // Estado de la burbuja animada estilo WhatsApp ("¡Hey, también compramos tu teléfono!")
  const [chatBubbleStep, setChatBubbleStep] = useState<"hidden" | "typing" | "message" | "dismissed">("hidden");

  useEffect(() => {
    const timerTyping = setTimeout(() => {
      setChatBubbleStep((prev) => (prev === "hidden" ? "typing" : prev));
    }, 1000);

    const timerMessage = setTimeout(() => {
      setChatBubbleStep((prev) => (prev === "typing" ? "message" : prev));
    }, 2200);

    return () => {
      clearTimeout(timerTyping);
      clearTimeout(timerMessage);
    };
  }, []);

  const addToCart = (item: { id: string; title: string; subtitle: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    setAddedItemNotification(item.title);
    setTimeout(() => setAddedItemNotification(null), 2500);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalCartPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Lista plana de todos los modelos conocidos
  const allKnownModels = useMemo(() => {
    const list: { model: string; brand: "Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google" }[] = [];
    Object.entries(POPULAR_MODELS).forEach(([brand, models]) => {
      models.forEach((m) =>
        list.push({
          model: m,
          brand: brand as "Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google"
        })
      );
    });
    return list;
  }, []);

  // Construye una línea puramente de texto indicando si hay pantalla (y sus calidades), tapa y puerto
  const buildTextSummaryForModel = (modelName: string, brandHint: string): string => {
    const cleanTarget = modelName.toLowerCase();
    const words = cleanTarget
      .replace(/galaxy|honor|pixel|iphone|\/|\+/g, " ")
      .trim()
      .split(/\s+/)
      .filter((w) => w.length >= 2);

    // Calidades de pantalla disponibles
    const screenQualities = REPAIR_CATALOG.filter((item) => {
      if (item.category !== "Pantallas") return false;
      if (item.brand.toLowerCase() !== brandHint.toLowerCase()) return false;
      const cleanItem = item.model.toLowerCase();
      if (cleanItem.includes(cleanTarget) || cleanTarget.includes(cleanItem)) return true;
      return words.length > 0 && words.every((w) => cleanItem.includes(w));
    }).map((s) => s.quality);

    const uniqueQualities = Array.from(new Set(screenQualities));

    // Verificar si hay tapa trasera
    const hasBackCover = REPAIR_CATALOG.some((item) => {
      if (item.category !== "Tapas Traseras") return false;
      if (item.brand.toLowerCase() !== brandHint.toLowerCase()) return false;
      const cleanItem = item.model.toLowerCase();
      if (cleanItem.includes(cleanTarget) || cleanTarget.includes(cleanItem)) return true;
      return words.length > 0 && words.some((w) => cleanItem.includes(w));
    });

    // Verificar si hay puerto de carga
    const hasPort = REPAIR_CATALOG.some((item) => {
      if (item.category !== "Puertos de Carga") return false;
      return item.brand.toLowerCase() === brandHint.toLowerCase();
    });

    const partsText: string[] = [];
    if (uniqueQualities.length > 0) {
      partsText.push(`Pantalla (${uniqueQualities.join(", ")})`);
    }
    if (hasBackCover) {
      partsText.push("Tapa");
    }
    if (hasPort) {
      partsText.push("Puerto");
    }

    return partsText.length > 0 ? partsText.join(" · ") : "Consultar disponibilidad bajo pedido";
  };

  // Sugerencias de búsqueda en texto limpio (sin tarjetas que abrumen)
  const textSuggestions = useMemo<TextSuggestion[]>(() => {
    if (!directSearchQuery.trim()) return [];

    const q = directSearchQuery.toLowerCase().trim();
    const matched = allKnownModels.filter((m) => {
      return m.model.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q);
    });

    return matched.slice(0, 7).map((m) => ({
      model: m.model,
      brand: m.brand,
      summaryLine: buildTextSummaryForModel(m.model, m.brand)
    }));
  }, [directSearchQuery, allKnownModels]);

  // Modelos disponibles según la marca seleccionada en los filtros
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    return POPULAR_MODELS[selectedBrand] || [];
  }, [selectedBrand]);

  // Reparaciones coincidentes cuando se completan los 3 filtros
  const matchingRepairs = useMemo(() => {
    if (!selectedBrand || !selectedModel || !selectedCategory) return [];

    const cleanModel = selectedModel.toLowerCase();

    return REPAIR_CATALOG.filter((item) => {
      if (item.brand !== selectedBrand) return false;
      if (item.category !== selectedCategory) return false;

      const parts = cleanModel.replace(/galaxy|honor|pixel|iphone|\/|\+/g, " ").trim().split(/\s+/);
      return parts.some((p) => p.length >= 2 && (item.model || "").toLowerCase().includes(p));
    });
  }, [selectedBrand, selectedModel, selectedCategory]);

  // Dispositivos filtrados y ordenados para el Showroom
  const filteredDevices = useMemo(() => {
    let list = [...DEVICES];

    if (deviceBrandFilter !== "Todos") {
      list = list.filter((dev) => dev.brand.toLowerCase() === deviceBrandFilter.toLowerCase());
    }

    if (devicePriceSort === "asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (devicePriceSort === "desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [deviceBrandFilter, devicePriceSort]);

  // Mostrar solo 3 unidades inicialmente, expandible con el botón de catálogo completo
  const displayedDevices = useMemo(() => {
    return showFullCatalog ? filteredDevices : filteredDevices.slice(0, 3);
  }, [filteredDevices, showFullCatalog]);

  // Al elegir una sugerencia de texto, autocompleta Marca y Modelo en los filtros de abajo
  const handleSelectSuggestion = (suggestion: TextSuggestion) => {
    setSelectedBrand(suggestion.brand);
    setSelectedModel(suggestion.model);
    setSelectedCategory(null);
    setDirectSearchQuery("");
  };

  // Enviar carrito como recibo formateado a WhatsApp
  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    let message = `🧾 *PEDIDO / COTIZACIÓN · TECNOTRADE PTY*\n`;
    message += `──────────────────────\n`;
    if (customerName.trim()) {
      message += `Cliente / Tienda: ${customerName.trim()}\n`;
    }
    message += `Fecha: ${new Date().toLocaleDateString("es-PA")}\n\n`;
    message += `*DETALLE DEL PEDIDO:*\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.title}*\n`;
      message += `   ${item.subtitle} | Cant: ${item.quantity} × $${item.price.toFixed(2)} = *$${(item.price * item.quantity).toFixed(2)}*\n`;
    });

    message += `\n──────────────────────\n`;
    message += `*TOTAL ESTIMADO: $${totalCartPrice.toFixed(2)} USD*\n`;
    message += `──────────────────────\n`;
    if (customerNote.trim()) {
      message += `Nota: ${customerNote.trim()}\n`;
    }
    message += `📍 Mobile Hub Pty, Calle Ricardo Arias 5\n`;
    message += `🕒 Lunes a Sábado: 10 AM - 7 PM\n\n`;
    message += `Hola TecnoTrade, envío esta orden desde el catálogo web para coordinar disponibilidad.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleConsultWhatsApp = (modelQuery?: string) => {
    const text = modelQuery 
      ? `Hola TecnoTrade, quisiera consultar disponibilidad y tarifa para: ${modelQuery}`
      : `Hola TecnoTrade, les escribo desde el catálogo web. Busco cotizar equipos o repuestos (tienda / revendedor / cliente directo).`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleSellPhoneWhatsApp = () => {
    const text = `Hola TecnoTrade 👋 Vi en la web que también compran teléfonos o los reciben como parte de pago (Trade-In). Quiero cotizar mi equipo:\n\n• Modelo:\n• Capacidad (GB):\n• Estado / Detalles:`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] pb-32 font-sans selection:bg-[#111111] selection:text-white">
      
      {/* ============================================================== */}
      {/* HEADER MINIMALISTA EDITORIAL */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/[0.05]">
        <div className="max-w-5xl mx-auto px-6 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-zinc-50 border border-black/[0.06] flex items-center justify-center p-1 transition-transform duration-300 hover:scale-105">
              <img 
                src="/logo.jpg" 
                alt="TecnoTrade" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-zinc-900 block leading-tight">
                TecnoTrade
              </span>
              <span className="text-xs text-zinc-500 font-normal block">
                Proveedor Técnico & Móviles · Panamá
              </span>
            </div>
          </div>

          {/* ACCIONES DE CABECERA: CÓMO LLEGAR Y PEDIDO */}
          <div className="flex items-center gap-2.5">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 bg-[#F4F4F6] hover:bg-zinc-200/70 px-3.5 py-2.5 rounded-full transition-all btn-tactile"
            >
              <MapPin className="w-3.5 h-3.5 text-zinc-700" />
              <span>Cómo llegar</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-zinc-900 hover:bg-black text-white text-xs font-medium px-4 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm btn-tactile"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Pedido</span>
              {totalCartCount > 0 && (
                <span className="bg-white text-zinc-900 text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* AVISO FLOTANTE DE ELEMENTO AÑADIDO */}
      {addedItemNotification && (
        <div className="fixed top-22 right-6 z-50 bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-slideDown border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold">{addedItemNotification}</p>
            <p className="text-zinc-400 text-[11px]">Añadido al pedido</p>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-xs text-white font-semibold underline ml-2"
          >
            Ver
          </button>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-6 pt-14 md:pt-18">

        {/* HERO EDITORIAL ENFOCADO EN PROVEEDOR CON IPHONE DIAGONAL AL LADO DERECHO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          
          {/* COLUMNA IZQUIERDA: TITULO, LEYENDA Y SELECTOR */}
          <div className="lg:col-span-7">
            <h1 className="animate-fadeIn text-4xl sm:text-6xl font-light tracking-tight text-zinc-950 mb-6 leading-[1.14]">
              <span>Proveedor de </span>
              <span className="font-corporate-cursive font-semibold text-5xl sm:text-7xl text-zinc-900 inline-block pr-1">
                taller
              </span>
              <br />
              <span>y equipos </span>
              <span className="font-corporate-cursive font-semibold text-5xl sm:text-7xl text-zinc-900 inline-block">
                certificados.
              </span>
            </h1>

            <p className="animate-fadeIn stagger-2 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed mb-8 max-w-xl">
              Suministro de{" "}
              <span className="font-corporate-cursive text-zinc-950 font-semibold text-lg sm:text-xl">
                reparaciones especializadas
              </span>{" "}
              y teléfonos verificados para{" "}
              <strong className="font-semibold text-zinc-900">
                tiendas, revendedores y clientes directos
              </strong>{" "}
              en Panamá. Tarifas con{" "}
              <span className="font-corporate-cursive text-zinc-950 font-semibold text-lg sm:text-xl">
                garantía de taller
              </span>
              , repuestos en distintas calidades y{" "}
              <span className="font-corporate-cursive text-zinc-950 font-semibold text-lg sm:text-xl">
                respuesta inmediata.
              </span>
            </p>

            {/* BIFURCADOR SUPERIOR (Taller vs Teléfonos) */}
            <div className="animate-fadeIn stagger-3 inline-flex p-1.5 bg-[#F4F4F6] rounded-full border border-black/[0.04]">
              <button
                onClick={() => setActiveTab("taller")}
                className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all btn-tactile ${
                  activeTab === "taller"
                    ? "bg-white text-zinc-950 shadow-sm font-semibold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Catálogo de <span className="font-corporate-cursive text-sm font-semibold">Reparaciones</span>
              </button>
              <button
                onClick={() => setActiveTab("productos")}
                className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all btn-tactile ${
                  activeTab === "productos"
                    ? "bg-white text-zinc-950 shadow-sm font-semibold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Equipos en <span className="font-corporate-cursive text-sm font-semibold">Venta</span> ({filteredDevices.length})
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: IPHONE INCLINADO DIAGONAL A LA IZQUIERDA */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fadeIn stagger-2">
            <div className="relative w-full max-w-[300px] sm:max-w-[340px] flex items-center justify-center py-4">
              <div className="relative w-full rounded-[2.5rem] p-3 sm:p-4 bg-gradient-to-b from-zinc-50/80 to-zinc-100/40 border border-black/[0.04] shadow-xs group">
                <img
                  src="/hero-iphone.jpg"
                  alt="iPhone 15 Pro Titanium"
                  className="w-full h-auto object-contain rounded-3xl drop-shadow-md group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />

                {/* Badge flotante de certificación */}
                <div className="absolute -bottom-3 left-6 bg-white/95 backdrop-blur-md border border-black/[0.08] rounded-2xl px-3.5 py-2 shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-zinc-900 tracking-tight">
                    Equipos & Pantallas Calibradas
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* TALLER // BUSCADOR SUPERIOR + FILTROS ABAJO UNIFICADOS */}
        {/* ============================================================== */}
        {activeTab === "taller" && (
          <div className="space-y-10 animate-fadeIn stagger-2 mb-20">
            
            <div className="bg-[#FAF9F8] rounded-[2.5rem] p-6 sm:p-10 border border-black/[0.04] transition-all">
              
              {/* Cabecera del Cotizador */}
              <div className="flex items-baseline justify-between pb-6 border-b border-black/[0.06] mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                    Cotizador de <span className="font-cursive-accent font-normal">Servicio Técnico</span>
                  </h2>
                  <p className="text-xs text-zinc-600 mt-1">
                    Busca tu modelo arriba o selecciona marca y pieza con <span className="font-cursive-accent text-zinc-800">instalación profesional</span>
                  </p>
                </div>

                {(selectedBrand || selectedModel || selectedCategory || directSearchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedBrand(null);
                      setSelectedModel(null);
                      setSelectedCategory(null);
                      setDirectSearchQuery("");
                    }}
                    className="text-xs text-zinc-600 hover:text-zinc-900 flex items-center gap-1 font-medium transition-colors shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>

              {/* 1. BARRA DE BÚSQUEDA ARRIBA CON SUGERENCIAS DE SOLO TEXTO */}
              <div className="relative mb-10">
                <div className="bg-white rounded-2xl px-5 py-3.5 flex items-center gap-3.5 border border-black/[0.08] shadow-xs focus-within:border-black/30 transition-all">
                  <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                  <input 
                    type="text"
                    value={directSearchQuery}
                    onChange={(e) => setDirectSearchQuery(e.target.value)}
                    placeholder="Buscar modelo rápido (ej: iPhone 13, Galaxy S23, Honor 90, Redmi Note 13)..."
                    className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 focus:outline-none placeholder:text-zinc-400"
                  />
                  {directSearchQuery && (
                    <button 
                      onClick={() => setDirectSearchQuery("")} 
                      className="text-zinc-400 hover:text-zinc-900 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Lista desplegable minimalista de sugerencias en SOLO TEXTO */}
                {directSearchQuery.trim() && (
                  <div className="mt-2 bg-white rounded-2xl border border-black/[0.08] shadow-lg overflow-hidden divide-y divide-black/[0.04] animate-fadeIn">
                    {textSuggestions.length > 0 ? (
                      textSuggestions.map((sug) => (
                        <button
                          key={sug.model}
                          onClick={() => handleSelectSuggestion(sug)}
                          className="w-full px-5 py-3 text-left hover:bg-[#FAF9F8] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                        >
                          <span className="text-xs sm:text-sm font-semibold text-zinc-900">
                            {sug.model}
                          </span>
                          <span className="text-[11px] sm:text-xs text-zinc-500 font-normal">
                            {sug.summaryLine}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-3.5 flex items-center justify-between text-xs text-zinc-600">
                        <span>Sin coincidencias exactas para &ldquo;{directSearchQuery}&rdquo;</span>
                        <button
                          onClick={() => handleConsultWhatsApp(directSearchQuery)}
                          className="font-semibold text-zinc-900 underline hover:text-black"
                        >
                          Consultar por WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. FILTROS DEBAJO DE LA BARRA DE BÚSQUEDA */}
              <div className="space-y-8">
                
                {/* PASO 1: MARCA */}
                <div>
                  <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block mb-3.5">
                    1. Marca
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(["Apple", "Samsung", "Honor", "Xiaomi", "Google"] as const).map((brand) => (
                      <button
                        key={brand}
                        onClick={() => {
                          setSelectedBrand(brand);
                          setSelectedModel(null);
                          setSelectedCategory(null);
                        }}
                        className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all border btn-tactile ${
                          selectedBrand === brand
                            ? "bg-zinc-900 text-white border-zinc-900 font-semibold shadow-xs"
                            : "bg-white text-zinc-700 border-black/[0.05] hover:border-black/20"
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PASO 2: MODELO */}
                {selectedBrand && (
                  <div className="animate-fadeIn">
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                        2. Modelo de {selectedBrand}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {availableModels.length} modelos
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto p-0.5 scrollbar-thin">
                      {availableModels.map((model) => (
                        <button
                          key={model}
                          onClick={() => {
                            setSelectedModel(model);
                            setSelectedCategory(null);
                          }}
                          className={`text-xs px-4 py-2.5 rounded-xl transition-all border btn-tactile ${
                            selectedModel === model
                              ? "bg-zinc-900 text-white border-zinc-900 font-semibold shadow-xs"
                              : "bg-white text-zinc-700 border-black/[0.05] hover:border-black/20"
                          }`}
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PASO 3: REPUESTO / SERVICIO */}
                {selectedModel && (
                  <div className="animate-fadeIn">
                    <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block mb-3.5">
                      3. Pieza requerida para {selectedModel}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "Pantallas", title: "Pantalla", desc: "Calidades Incell, OLED y Original" },
                        { id: "Tapas Traseras", title: "Tapa Trasera", desc: "Reemplazo de cristal posterior" },
                        { id: "Puertos de Carga", title: "Puerto de Carga", desc: "Flex de carga y micrófono" },
                      ].map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id as any)}
                            className={`p-4 sm:p-5 rounded-2xl border text-left transition-all btn-tactile ${
                              isSelected
                                ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                                : "bg-white text-zinc-800 border-black/[0.05] hover:border-black/20"
                            }`}
                          >
                            <p className="font-semibold text-sm">{cat.title}</p>
                            <p className={`text-xs mt-1 ${isSelected ? "text-zinc-300" : "text-zinc-500"}`}>
                              {cat.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* RESULTADOS REVELADOS AL ESPECIFICAR LOS 3 PASOS */}
                {selectedBrand && selectedModel && selectedCategory && (
                  <div className="pt-8 border-t border-black/[0.06] animate-fadeIn">
                    <div className="mb-5">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold block">
                        Cotización para {selectedModel}
                      </span>
                      <h3 className="text-lg font-semibold text-zinc-900 mt-0.5">
                        Calidades disponibles · {selectedCategory}
                      </h3>
                    </div>

                    {matchingRepairs.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {matchingRepairs.map((item) => (
                          <div 
                            key={item.id}
                            className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs flex flex-col justify-between minimal-card-hover animate-scaleIn"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="bg-zinc-100 text-zinc-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                                  {item.quality}
                                </span>
                                <span className="text-[11px] text-zinc-500">
                                  Incluye instalación
                                </span>
                              </div>

                              <h4 className="font-semibold text-base text-zinc-900 mb-1">
                                {item.model}
                              </h4>
                              <p className="text-xs text-zinc-500 mb-5">
                                Repuesto verificado con garantía de taller.
                              </p>
                            </div>

                            <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-zinc-500 block uppercase font-medium">Tarifa</span>
                                <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>

                              <button
                                onClick={() => addToCart({
                                  id: item.id,
                                  title: `${item.model} (${item.category})`,
                                  subtitle: `Calidad: ${item.quality}`,
                                  price: item.price
                                })}
                                className="bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-xs btn-tactile"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Añadir</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 rounded-3xl bg-white border border-black/[0.06] text-center text-zinc-600 text-xs animate-scaleIn">
                        <p>Esta pieza específica se maneja bajo pedido directo en almacén.</p>
                        <button
                          onClick={() => handleConsultWhatsApp(`${selectedModel} - ${selectedCategory}`)}
                          className="mt-4 bg-zinc-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 btn-tactile"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Consultar disponibilidad en WhatsApp</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* AVISO CUANDO AÚN NO SE HA SELECCIONADO LA PIEZA */}
                {(!selectedBrand || !selectedModel || !selectedCategory) && (
                  <div className="bg-white/80 rounded-2xl p-5 text-center text-zinc-500 text-xs border border-black/[0.03]">
                    <p>
                      Especifica el equipo y la pieza para mostrar las tarifas exactas y añadirlas a tu pedido.
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* EQUIPOS EN VENTA (PARA CLIENTE FINAL Y REVENDEDORES) */}
        {/* ============================================================== */}
        {activeTab === "productos" && (
          <div className="animate-fadeIn mb-20">
            
            {/* Título de la Sección */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-900">
                  Stock de Dispositivos <span className="font-cursive-accent font-normal text-zinc-950">Verificados</span>
                </h2>
                <p className="text-xs text-zinc-600 mt-1">
                  Disponibles por unidad o lote con <span className="font-cursive-accent text-zinc-800">garantía de 6 meses</span>
                </p>
              </div>

              {/* Selector de ordenamiento: menor a mayor / mayor a menor */}
              <div className="flex items-center gap-2 self-start md:self-auto bg-[#F4F4F6] p-1.5 rounded-2xl border border-black/[0.04]">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 ml-2" />
                <span className="text-xs text-zinc-600 font-medium">Precio:</span>
                <button
                  onClick={() => setDevicePriceSort("default")}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all btn-tactile ${
                    devicePriceSort === "default"
                      ? "bg-white text-zinc-900 font-semibold shadow-2xs"
                      : "text-zinc-600 hover:text-black"
                  }`}
                >
                  Destacados
                </button>
                <button
                  onClick={() => setDevicePriceSort("asc")}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all btn-tactile ${
                    devicePriceSort === "asc"
                      ? "bg-white text-zinc-900 font-semibold shadow-2xs"
                      : "text-zinc-600 hover:text-black"
                  }`}
                >
                  Menor a Mayor
                </button>
                <button
                  onClick={() => setDevicePriceSort("desc")}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all btn-tactile ${
                    devicePriceSort === "desc"
                      ? "bg-white text-zinc-900 font-semibold shadow-2xs"
                      : "text-zinc-600 hover:text-black"
                  }`}
                >
                  Mayor a Menor
                </button>
              </div>
            </div>

            {/* FILTROS POR MARCA + BOTÓN CONSULTAR EN WHATSAPP */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {["Todos", "iPhone", "Samsung", "Honor", "Xiaomi", "Pixel"].map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setDeviceBrandFilter(brand);
                    setShowFullCatalog(false);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-medium transition-all border btn-tactile ${
                    deviceBrandFilter.toLowerCase() === brand.toLowerCase()
                      ? "bg-zinc-900 text-white border-zinc-900 font-semibold shadow-sm"
                      : "bg-[#FAF9F8] text-zinc-700 border-black/[0.04] hover:border-black/20"
                  }`}
                >
                  {brand}
                </button>
              ))}

              <button
                onClick={() => handleConsultWhatsApp()}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-all shadow-2xs btn-tactile"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-600" />
                <span>Consultar otro modelo o lote en WhatsApp</span>
              </button>
            </div>

            {/* Parrilla de Teléfonos (Inicialmente 3 opciones, expandible a catálogo completo) */}
            {filteredDevices.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {displayedDevices.map((dev) => (
                    <div 
                      key={dev.id}
                      className="bg-[#FAF9F8] rounded-[2rem] p-6 border border-black/[0.04] flex flex-col justify-between minimal-card-hover animate-scaleIn group"
                    >
                      <div className="relative h-64 rounded-2xl bg-[#EBECEF]/60 overflow-hidden mb-6 flex items-center justify-center">
                        <img 
                          src={dev.image} 
                          alt={dev.model}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <span className="absolute top-3.5 left-3.5 bg-white/95 text-zinc-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                          {dev.grade}
                        </span>
                        <span className="absolute top-3.5 right-3.5 bg-zinc-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          {dev.battery}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-zinc-600 font-medium">{dev.brand}</span>
                          <span className="text-[10px] bg-zinc-200/70 text-zinc-700 px-2 py-0.5 rounded-full font-medium">
                            {dev.tag}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg text-zinc-900">{dev.model}</h3>
                        <p className="text-xs text-zinc-600 mb-4">{dev.sub}</p>

                        <div className="flex items-center gap-1.5 mb-6">
                          <div className="flex items-center gap-1">
                            {dev.colors.map((c, idx) => (
                              <span 
                                key={idx}
                                style={{ backgroundColor: c }}
                                className="w-2.5 h-2.5 rounded-full border border-black/10"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-zinc-500 ml-auto">
                          100% <span className="font-cursive-accent text-zinc-700">Verificado</span>
                        </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-[10px] text-zinc-500 block uppercase font-medium">Precio</span>
                          <span className="text-2xl font-bold text-zinc-900 tracking-tight">${dev.price}</span>
                        </div>

                        <button
                          onClick={() => addToCart({
                            id: dev.id,
                            title: dev.model,
                            subtitle: `${dev.sub} · ${dev.grade}`,
                            price: dev.price
                          })}
                          className="bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm btn-tactile"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botón para mostrar catálogo completo o contraer */}
                {filteredDevices.length > 3 && (
                  <div className="mt-10 text-center animate-fadeIn">
                    <button
                      onClick={() => setShowFullCatalog((prev) => !prev)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-zinc-900 hover:bg-black text-white shadow-sm transition-all btn-tactile"
                    >
                      <span>
                        {showFullCatalog
                          ? "Mostrar menos equipos"
                          : `Mostrar catálogo completo (${filteredDevices.length} disponibles)`}
                      </span>
                      {showFullCatalog ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-[#FAF9F8] rounded-[2rem] p-12 text-center border border-black/[0.04] animate-scaleIn">
                <p className="text-sm font-semibold text-zinc-900 mb-2">
                  Sin unidades listadas en esta marca por el momento
                </p>
                <p className="text-xs text-zinc-600 max-w-md mx-auto mb-6">
                  Consulta directamente por WhatsApp el stock del día para revendedores y clientes finales.
                </p>
                <button
                  onClick={() => handleConsultWhatsApp(deviceBrandFilter !== "Todos" ? deviceBrandFilter : undefined)}
                  className="bg-zinc-900 text-white text-xs font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 btn-tactile"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar en WhatsApp</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* PIE DE PÁGINA MINIMALISTA */}
        {/* ============================================================== */}
        <footer className="mt-16 pt-8 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 animate-fadeIn">
          <p>
            TecnoTrade PTY · <span className="font-cursive-accent text-zinc-600">Servicio y Reestreno</span> de Lunes a Sábado · Envíos a todo Panamá
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-700 hover:text-black font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>Instagram @tecnotradepty</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </footer>

      </main>

      {/* ============================================================== */}
      {/* DRAWER / MODAL DEL CARRITO & RECIBO A WHATSAPP */}
      {/* ============================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 sm:p-8 animate-slideLeft border-l border-black/[0.06]">
            
            <div className="flex items-center justify-between pb-5 border-b border-black/[0.06]">
              <div>
                <h3 className="font-semibold text-lg text-zinc-900">
                  Resumen del <span className="font-cursive-accent font-normal">Pedido</span>
                </h3>
                <span className="text-xs text-zinc-600">
                  {totalCartCount} {totalCartCount === 1 ? "ítem seleccionado" : "ítems seleccionados"}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto py-5 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-24 text-zinc-400">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold text-zinc-700">Tu pedido está vacío</p>
                  <p className="text-xs text-zinc-600 mt-1 max-w-xs mx-auto">
                    Agrega reparaciones o dispositivos del catálogo para generar tu recibo hacia WhatsApp.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FAF9F8] border border-black/[0.04] flex items-center justify-between gap-3 animate-scaleIn"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-zinc-600 truncate mt-0.5">{item.subtitle}</p>
                      <p className="text-xs font-bold text-zinc-900 mt-1">
                        ${(item.price * item.quantity).toFixed(2)} USD
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-black/[0.06]">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-black"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold px-1">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-black"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-400 hover:text-red-500 p-1"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Formulario y Botón de Enviar a WhatsApp */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-black/[0.06] space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-zinc-600 block mb-1">
                    Nombre o Tienda (opcional)
                  </label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Carlos / Tienda Aliada"
                    className="w-full bg-[#FAF9F8] px-4 py-2.5 rounded-xl text-xs text-zinc-900 focus:outline-none border border-black/[0.04]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-600 block mb-1">
                    Notas del pedido (opcional)
                  </label>
                  <input 
                    type="text" 
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Ej: Para entrega hoy / Color del repuesto"
                    className="w-full bg-[#FAF9F8] px-4 py-2.5 rounded-xl text-xs text-zinc-900 focus:outline-none border border-black/[0.04]"
                  />
                </div>

                <div className="pt-2 flex items-baseline justify-between border-t border-black/[0.04]">
                  <span className="text-xs text-zinc-600 font-medium">
                    Total <span className="font-cursive-accent text-zinc-800">estimado</span>
                  </span>
                  <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                    ${totalCartPrice.toFixed(2)} USD
                  </span>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3.5 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 btn-tactile"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enviar Pedido a WhatsApp</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BOTÓN FLOTANTE INFERIOR EXCLUSIVO DEL CARRITO (SOLO CON ITEMS) */}
      {/* ============================================================== */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 left-6 sm:left-1/2 sm:-translate-x-1/2 z-40 animate-slideUp">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-zinc-950 hover:bg-black text-white rounded-full px-5 sm:px-6 py-3.5 shadow-2xl flex items-center gap-3 border border-white/15 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-white" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-semibold tracking-tight">
              Ver Pedido ({totalCartCount})
            </span>
            <span className="text-xs text-zinc-500 font-normal">·</span>
            <span className="text-xs font-bold text-emerald-400">
              ${totalCartPrice.toFixed(2)}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* WIDGET DE WHATSAPP EN ESQUINA INFERIOR DERECHA ("COMPRAMOS TU EQUIPO") */}
      {/* ============================================================== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        
        {/* Burbuja de mensaje estilo chat de WhatsApp */}
        {(chatBubbleStep === "typing" || chatBubbleStep === "message") && (
          <div className="animate-chatPop relative bg-white rounded-2xl rounded-br-xs p-3.5 pr-8 shadow-xl border border-black/[0.08] max-w-[250px] text-left">
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setChatBubbleStep("dismissed");
              }}
              aria-label="Cerrar mensaje"
              className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-zinc-800 p-0.5 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {chatBubbleStep === "typing" ? (
              <div className="flex items-center gap-1.5 py-1.5 px-2">
                <span className="w-2 h-2 rounded-full bg-zinc-400 typing-dot" />
                <span className="w-2 h-2 rounded-full bg-zinc-400 typing-dot" />
                <span className="w-2 h-2 rounded-full bg-zinc-400 typing-dot" />
              </div>
            ) : (
              <div 
                onClick={handleSellPhoneWhatsApp}
                className="cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    TecnoTrade · Trade-In
                  </span>
                </div>
                <p className="text-xs font-semibold text-zinc-900 leading-snug group-hover:text-emerald-700 transition-colors">
                  ¡Hey, también compramos tu{" "}
                  <span className="font-cursive-accent font-semibold text-emerald-800 text-[13px]">
                    teléfono!
                  </span>{" "}
                  📱💵
                </p>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-flex items-center gap-1">
                  <span className="font-cursive-accent font-semibold text-xs">Cotizar mi equipo</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            )}
          </div>
        )}

        {/* Botón circular principal de WhatsApp */}
        <button
          onClick={handleSellPhoneWhatsApp}
          onMouseEnter={() => {
            if (chatBubbleStep === "dismissed") {
              setChatBubbleStep("message");
            }
          }}
          title="Vende tu teléfono o cotiza por WhatsApp"
          className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-black/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </button>
      </div>

    </div>
  );
}
