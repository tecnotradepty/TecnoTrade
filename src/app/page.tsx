"use client";

import { useState, useMemo } from "react";
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
  Layers,
  ChevronRight,
  ArrowUpDown,
  Sparkles
} from "lucide-react";
import { REPAIR_CATALOG, POPULAR_MODELS, RepairItem } from "@/data/repairCatalog";

// Datos oficiales de TecnoTrade PTY
const WHATSAPP_NUMBER = "50768529324";
const INSTAGRAM_URL = "https://www.instagram.com/tecnotradepty/";

// Dispositivos certificados en venta con filtros de marca y orden
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
    grade: "Certificado A+",
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
    grade: "Excelente",
    price: 680,
    tag: "Top Ventas",
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
    tag: "Recomendado",
    colors: ["#F4F3ED", "#262C3A", "#DF3542"],
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-ip12",
    brand: "iPhone",
    model: "iPhone 12",
    sub: "Black · 64 GB",
    battery: "89% Salud",
    grade: "Muy Bueno",
    price: 310,
    tag: "Económico",
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
    tag: "Pro Camera",
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
    tag: "Gama Alta",
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
    tag: "Batería 5000mAh",
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
    grade: "Gama Flagship",
    price: 490,
    tag: "Cámara Top",
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
    tag: "Pantalla Curva",
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
    grade: "Potencia Extrema",
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
    grade: "Gaming",
    price: 270,
    tag: "Dimensity 8300",
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
    grade: "Certificado A+",
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
    tag: "Cámara Pura",
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

// Resumen de repuestos disponibles para sugerencias en vivo
export interface ModelPartsSummary {
  model: string;
  brand: string;
  screens: { id: string; quality: string; price: number }[];
  backCover?: { id: string; quality: string; price: number };
  chargingPort?: { id: string; quality: string; price: number };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"taller" | "productos">("taller");

  // Modo del Taller: "search" (buscador directo con sugerencias) | "steps" (filtros paso a paso)
  const [tallerMode, setTallerMode] = useState<"search" | "steps">("search");
  const [directSearchQuery, setDirectSearchQuery] = useState("");

  // Estado del flujo guiado por pasos
  const [selectedBrand, setSelectedBrand] = useState<"Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google" | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"Pantallas" | "Tapas Traseras" | "Puertos de Carga" | null>(null);
  const [modelSearch, setModelSearch] = useState("");

  // Filtros de Móviles en Venta
  const [deviceBrandFilter, setDeviceBrandFilter] = useState<string>("Todos");
  const [devicePriceSort, setDevicePriceSort] = useState<"default" | "asc" | "desc">("default");

  // Estado del Carrito
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

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

  // Lista plana de todos los modelos únicos conocidos para el buscador inteligente
  const allKnownModels = useMemo(() => {
    const list: { model: string; brand: string }[] = [];
    Object.entries(POPULAR_MODELS).forEach(([brand, models]) => {
      models.forEach((m) => list.push({ model: m, brand }));
    });
    return list;
  }, []);

  // Helper para generar el desglose de piezas (pantalla con calidades, tapa, puerto)
  const getPartsSummary = (modelName: string, brandHint: string): ModelPartsSummary => {
    const cleanTarget = modelName.toLowerCase();
    const words = cleanTarget
      .replace(/galaxy|honor|pixel|iphone|\/|\+/g, " ")
      .trim()
      .split(/\s+/)
      .filter((w) => w.length >= 2);

    // Pantallas exactas o coincidentes
    const matchedScreens = REPAIR_CATALOG.filter((item) => {
      if (item.category !== "Pantallas") return false;
      if (item.brand.toLowerCase() !== brandHint.toLowerCase()) return false;
      const cleanItem = item.model.toLowerCase();
      if (cleanItem.includes(cleanTarget) || cleanTarget.includes(cleanItem)) return true;
      return words.length > 0 && words.every((w) => cleanItem.includes(w));
    }).map((s) => ({
      id: s.id,
      quality: s.quality,
      price: s.price
    }));

    // Tapa trasera
    let matchedBackCover = REPAIR_CATALOG.find((item) => {
      if (item.category !== "Tapas Traseras") return false;
      if (item.brand.toLowerCase() !== brandHint.toLowerCase()) return false;
      const cleanItem = item.model.toLowerCase();
      if (cleanItem.includes(cleanTarget) || cleanTarget.includes(cleanItem)) return true;
      return words.length > 0 && words.every((w) => cleanItem.includes(w));
    });

    if (!matchedBackCover) {
      // Coincidencia por serie para marcas Android y Apple
      matchedBackCover = REPAIR_CATALOG.find((item) => {
        if (item.category !== "Tapas Traseras") return false;
        if (item.brand.toLowerCase() !== brandHint.toLowerCase()) return false;
        const cleanItem = item.model.toLowerCase();
        return words.length > 0 && words.some((w) => cleanItem.includes(w));
      });
    }

    // Puerto de carga
    let matchedPort = REPAIR_CATALOG.find((item) => {
      if (item.category !== "Puertos de Carga") return false;
      if (item.brand.toLowerCase() !== brandHint.toLowerCase()) return false;
      const cleanItem = item.model.toLowerCase();
      if (brandHint === "Apple") {
        if (cleanTarget.includes("16") && cleanItem.includes("16")) return true;
        if ((cleanTarget.includes("14") || cleanTarget.includes("15")) && cleanItem.includes("14 / 15")) return true;
        if ((cleanTarget.includes("12") || cleanTarget.includes("13")) && cleanItem.includes("12 / 13")) return true;
        if ((cleanTarget.includes("8") || cleanTarget.includes("x") || cleanTarget.includes("11")) && cleanItem.includes("8 a 11")) return true;
      } else if (brandHint === "Samsung") {
        if ((cleanTarget.includes("s2") || cleanTarget.includes("note") || cleanTarget.includes("flip")) && cleanItem.includes("series s")) return true;
        if (cleanTarget.includes("a") && cleanItem.includes("series a")) return true;
      } else if (brandHint === "Honor" && cleanItem.includes("honor")) {
        return true;
      } else if (brandHint === "Xiaomi" && cleanItem.includes("redmi")) {
        return true;
      }
      return false;
    });

    return {
      model: modelName,
      brand: brandHint,
      screens: matchedScreens,
      backCover: matchedBackCover ? { id: matchedBackCover.id, quality: matchedBackCover.quality, price: matchedBackCover.price } : undefined,
      chargingPort: matchedPort ? { id: matchedPort.id, quality: matchedPort.quality, price: matchedPort.price } : undefined
    };
  };

  // Sugerencias inteligentes para el buscador de Taller
  const searchSuggestions = useMemo(() => {
    if (!directSearchQuery.trim()) return [];

    const q = directSearchQuery.toLowerCase().trim();
    const matched = allKnownModels.filter((m) => {
      return m.model.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q);
    });

    // Tomar las mejores 8 coincidencias y generar su resumen de piezas
    return matched.slice(0, 8).map((m) => getPartsSummary(m.model, m.brand));
  }, [directSearchQuery, allKnownModels]);

  // Modelos disponibles para el selector guiado
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    const list = POPULAR_MODELS[selectedBrand] || [];
    if (!modelSearch) return list;
    return list.filter((m) => m.toLowerCase().includes(modelSearch.toLowerCase()));
  }, [selectedBrand, modelSearch]);

  // Reparaciones coincidentes en el selector guiado
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

  // Enviar carrito como recibo formateado a WhatsApp
  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    let message = `🧾 *COTIZACIÓN · TECNOTRADE PTY*\n`;
    message += `──────────────────────\n`;
    if (customerName.trim()) {
      message += `Cliente: ${customerName.trim()}\n`;
    }
    message += `Fecha: ${new Date().toLocaleDateString("es-PA")}\n\n`;
    message += `*PEDIDO / COTIZACIÓN:*\n`;

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
    message += `📍 Calle Ricardo Arias, diagonal a Iglesia del Carmen\n`;
    message += `🕒 Horario: 10 AM - 7 PM\n\n`;
    message += `Hola TecnoTrade, me gustaría agendar para este pedido.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleConsultWhatsApp = (modelQuery?: string) => {
    const text = modelQuery 
      ? `Hola TecnoTrade, quisiera consultar disponibilidad y precio para el modelo: ${modelQuery}`
      : `Hola TecnoTrade, estoy buscando un teléfono en venta que no veo en el catálogo web. ¿Tienen disponibilidad o cotizan bajo pedido?`;
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
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-zinc-50 border border-black/[0.06] flex items-center justify-center p-1">
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
              <span className="text-xs text-zinc-600 font-normal">
                Taller & Reestreno · Panamá
              </span>
            </div>
          </div>

          {/* BOTÓN CARRITO SUPERIOR */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-zinc-900 hover:bg-black text-white text-xs font-medium px-4 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Carrito</span>
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
            <p className="text-zinc-400 text-[11px]">Agregado al carrito</p>
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

        {/* HERO EDITORIAL MINIMALISTA */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs text-zinc-600 uppercase tracking-widest font-semibold block mb-3.5">
            Calle Ricardo Arias · Iglesia del Carmen
          </span>

          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-zinc-900 mb-6 leading-[1.08]">
            Reparación honesta. <br />
            <span className="font-semibold text-zinc-950">Móviles certificados.</span>
          </h1>

          <p className="text-base text-zinc-600 font-normal leading-relaxed mb-8">
            Consulta los precios transparentes de nuestro taller o explora los dispositivos en stock listos para entrega inmediata con garantía.
          </p>

          {/* BIFURCADOR SUPERIOR EXCLUSIVO (Taller vs Teléfonos) */}
          <div className="inline-flex p-1.5 bg-[#F4F4F6] rounded-full border border-black/[0.04]">
            <button
              onClick={() => setActiveTab("taller")}
              className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "taller"
                  ? "bg-white text-zinc-950 shadow-sm font-semibold"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Taller de Reparaciones
            </button>
            <button
              onClick={() => setActiveTab("productos")}
              className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "productos"
                  ? "bg-white text-zinc-950 shadow-sm font-semibold"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Dispositivos en Venta ({filteredDevices.length})
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TALLER // BUSCADOR DIRECTO O SELECTOR GUIADO */}
        {/* ============================================================== */}
        {activeTab === "taller" && (
          <div className="space-y-10 animate-fadeIn mb-24">
            
            <div className="bg-[#FAF9F8] rounded-[2.5rem] p-6 sm:p-10 border border-black/[0.04]">
              
              {/* Encabezado del Taller con Selector de Método (Buscador vs Filtros) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/[0.06] mb-8 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                    Cotizador de Taller
                  </h2>
                  <p className="text-xs text-zinc-600 mt-1">
                    Encuentra piezas con instalación y calibración incluidas
                  </p>
                </div>

                {/* Alternador de Método de Búsqueda */}
                <div className="inline-flex p-1 bg-white rounded-2xl border border-black/[0.06] shadow-2xs self-start sm:self-auto">
                  <button
                    onClick={() => setTallerMode("search")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      tallerMode === "search"
                        ? "bg-zinc-900 text-white font-semibold shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Buscador Inteligente</span>
                  </button>
                  <button
                    onClick={() => setTallerMode("steps")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      tallerMode === "steps"
                        ? "bg-zinc-900 text-white font-semibold shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Filtros por Pasos</span>
                  </button>
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* OPCIÓN 1: BUSCADOR INTELIGENTE CON SUGERENCIAS EN VIVO */}
              {/* ------------------------------------------------------------ */}
              {tallerMode === "search" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Caja de Búsqueda */}
                  <div className="relative">
                    <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3.5 border border-black/[0.08] shadow-sm focus-within:border-black/30 transition-all">
                      <Search className="w-5 h-5 text-zinc-400 shrink-0" />
                      <input 
                        type="text"
                        value={directSearchQuery}
                        onChange={(e) => setDirectSearchQuery(e.target.value)}
                        placeholder="Escribe el modelo (ej: iPhone 13, Galaxy S23, Honor Magic 6, Poco X6)..."
                        className="w-full bg-transparent text-sm text-zinc-900 focus:outline-none placeholder:text-zinc-400 font-medium"
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

                    {/* Chips de sugerencias rápidas populares */}
                    {!directSearchQuery && (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-zinc-600 font-medium mr-1">Populares:</span>
                        {[
                          "iPhone 13", 
                          "iPhone 14 Pro", 
                          "Galaxy A54", 
                          "Galaxy S23 Ultra", 
                          "Honor Magic 6 Lite", 
                          "Honor 90", 
                          "Redmi Note 13"
                        ].map((m) => (
                          <button
                            key={m}
                            onClick={() => setDirectSearchQuery(m)}
                            className="text-xs bg-white text-zinc-700 px-3 py-1.5 rounded-xl border border-black/[0.05] hover:border-black/20 hover:text-black transition-all shadow-2xs"
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Resultados y Sugerencias detalladas con repuestos y calidades */}
                  {directSearchQuery.trim() && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                          Sugerencias y Disponibilidad ({searchSuggestions.length})
                        </span>
                        <span className="text-[11px] text-zinc-600">
                          Precios con mano de obra incluida
                        </span>
                      </div>

                      {searchSuggestions.length > 0 ? (
                        <div className="space-y-3">
                          {searchSuggestions.map((item) => (
                            <div 
                              key={item.model}
                              className="bg-white rounded-3xl p-5 sm:p-6 border border-black/[0.06] shadow-xs hover:border-black/20 transition-all"
                            >
                              {/* Cabecera del modelo */}
                              <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.04]">
                                <div className="flex items-center gap-2.5">
                                  <h4 className="font-semibold text-base sm:text-lg text-zinc-900">
                                    {item.model}
                                  </h4>
                                  <span className="text-[10px] bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full font-medium">
                                    {item.brand}
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleConsultWhatsApp(item.model)}
                                  className="text-[11px] text-zinc-600 hover:text-black font-medium flex items-center gap-1 transition-colors"
                                >
                                  <span>¿Otra pieza?</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Desglose de piezas disponibles: Pantalla (calidades), Tapa, Puerto */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                
                                {/* 1. PANTALLAS Y CALIDADES */}
                                <div className="bg-[#FAF9F8] rounded-2xl p-4 border border-black/[0.03] flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                                        📱 Pantalla
                                      </span>
                                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                                        {item.screens.length > 0 ? "Disponible" : "Bajo Pedido"}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-600 mb-3">
                                      Calidades y tecnologías en stock:
                                    </p>
                                  </div>

                                  {item.screens.length > 0 ? (
                                    <div className="space-y-1.5">
                                      {item.screens.map((sc) => (
                                        <div 
                                          key={sc.id}
                                          className="bg-white rounded-xl p-2 px-2.5 flex items-center justify-between border border-black/[0.04] text-xs shadow-2xs"
                                        >
                                          <div>
                                            <span className="font-medium text-zinc-800">{sc.quality}</span>
                                            <span className="font-bold text-zinc-950 ml-1.5">${sc.price}</span>
                                          </div>
                                          <button
                                            onClick={() => addToCart({
                                              id: sc.id,
                                              title: `${item.model} (Pantalla ${sc.quality})`,
                                              subtitle: `Repuesto calibrado: ${sc.quality}`,
                                              price: sc.price
                                            })}
                                            className="bg-zinc-900 hover:bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                                          >
                                            <Plus className="w-3 h-3" />
                                            <span>Añadir</span>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleConsultWhatsApp(`${item.model} Pantalla`)}
                                      className="text-xs text-zinc-600 hover:text-black underline text-left pt-2"
                                    >
                                      Consultar pantalla en WhatsApp
                                    </button>
                                  )}
                                </div>

                                {/* 2. TAPA TRASERA */}
                                <div className="bg-[#FAF9F8] rounded-2xl p-4 border border-black/[0.03] flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                                        🪟 Tapa Trasera
                                      </span>
                                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                                        {item.backCover ? "Disponible" : "Bajo Pedido"}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-600 mb-3">
                                      Cristal / chasis con sellado hermético
                                    </p>
                                  </div>

                                  {item.backCover ? (
                                    <div className="bg-white rounded-xl p-2 px-2.5 flex items-center justify-between border border-black/[0.04] text-xs shadow-2xs mt-auto">
                                      <div>
                                        <span className="text-zinc-600 text-[11px]">Costo:</span>
                                        <span className="font-bold text-zinc-950 ml-1.5">${item.backCover.price}</span>
                                      </div>
                                      <button
                                        onClick={() => addToCart({
                                          id: item.backCover!.id,
                                          title: `${item.model} (Tapa Trasera)`,
                                          subtitle: `Calidad: ${item.backCover!.quality}`,
                                          price: item.backCover!.price
                                        })}
                                        className="bg-zinc-900 hover:bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Añadir</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleConsultWhatsApp(`${item.model} Tapa Trasera`)}
                                      className="text-xs text-zinc-600 hover:text-black underline text-left pt-2"
                                    >
                                      Consultar tapa en WhatsApp
                                    </button>
                                  )}
                                </div>

                                {/* 3. PUERTO / PIN DE CARGA */}
                                <div className="bg-[#FAF9F8] rounded-2xl p-4 border border-black/[0.03] flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                                        ⚡ Pin de Carga
                                      </span>
                                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                                        {item.chargingPort ? "Disponible" : "Bajo Pedido"}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-600 mb-3">
                                      Conector de carga rápida y micrófono
                                    </p>
                                  </div>

                                  {item.chargingPort ? (
                                    <div className="bg-white rounded-xl p-2 px-2.5 flex items-center justify-between border border-black/[0.04] text-xs shadow-2xs mt-auto">
                                      <div>
                                        <span className="text-zinc-600 text-[11px]">Costo:</span>
                                        <span className="font-bold text-zinc-950 ml-1.5">${item.chargingPort.price}</span>
                                      </div>
                                      <button
                                        onClick={() => addToCart({
                                          id: item.chargingPort!.id,
                                          title: `${item.model} (Pin de Carga)`,
                                          subtitle: `Calidad: ${item.chargingPort!.quality}`,
                                          price: item.chargingPort!.price
                                        })}
                                        className="bg-zinc-900 hover:bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Añadir</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleConsultWhatsApp(`${item.model} Pin de Carga`)}
                                      className="text-xs text-zinc-600 hover:text-black underline text-left pt-2"
                                    >
                                      Consultar pin en WhatsApp
                                    </button>
                                  )}
                                </div>

                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-3xl p-8 border border-black/[0.06] text-center space-y-3">
                          <p className="text-sm font-semibold text-zinc-800">
                            No encontramos &ldquo;{directSearchQuery}&rdquo; en la lista rápida
                          </p>
                          <p className="text-xs text-zinc-600 max-w-md mx-auto">
                            Tenemos repuestos para casi todos los modelos del mercado bajo pedido inmediato. Escríbenos directamente a WhatsApp y te cotizamos al momento.
                          </p>
                          <button
                            onClick={() => handleConsultWhatsApp(directSearchQuery)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-2 transition-all shadow-sm"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                            <span>Consultar {directSearchQuery} en WhatsApp</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {!directSearchQuery.trim() && (
                    <div className="bg-white/80 rounded-2xl p-8 text-center border border-black/[0.03]">
                      <p className="text-xs text-zinc-600">
                        Escribe el modelo de tu teléfono arriba para ver al instante si hay pantalla (Incell, OLED u Original), tapa trasera o puerto de carga con sus precios exactos.
                      </p>
                    </div>
                  )}

                </div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* OPCIÓN 2: SELECTOR GUIADO POR PASOS (Marca ➔ Modelo ➔ Repuesto) */}
              {/* ------------------------------------------------------------ */}
              {tallerMode === "steps" && (
                <div className="space-y-10 animate-fadeIn">
                  
                  {/* PASO 1: MARCAS */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block">
                        1. Marca del dispositivo
                      </span>
                      {(selectedBrand || selectedModel || selectedCategory) && (
                        <button
                          onClick={() => {
                            setSelectedBrand(null);
                            setSelectedModel(null);
                            setSelectedCategory(null);
                            setModelSearch("");
                          }}
                          className="text-xs text-zinc-600 hover:text-zinc-900 flex items-center gap-1 font-medium transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reiniciar</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {(["Apple", "Samsung", "Honor", "Xiaomi", "Google"] as const).map((brand) => (
                        <button
                          key={brand}
                          onClick={() => {
                            setSelectedBrand(brand);
                            setSelectedModel(null);
                            setSelectedCategory(null);
                            setModelSearch("");
                          }}
                          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm transition-all border ${
                            selectedBrand === brand
                              ? "bg-zinc-900 text-white border-zinc-900 font-semibold shadow-sm"
                              : "bg-white text-zinc-700 border-black/[0.05] hover:border-black/20"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PASO 2: MODELOS (SOLO VISIBLE AL ELEGIR MARCA) */}
                  {selectedBrand && (
                    <div className="animate-fadeIn">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                          2. Modelo de {selectedBrand}
                        </span>
                        <span className="text-xs text-zinc-600">
                          {availableModels.length} opciones
                        </span>
                      </div>

                      {/* Buscador de modelo interno */}
                      <div className="mb-4">
                        <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-black/[0.06] shadow-2xs">
                          <Search className="w-4 h-4 text-zinc-400" />
                          <input 
                            type="text"
                            value={modelSearch}
                            onChange={(e) => setModelSearch(e.target.value)}
                            placeholder={`Filtrar ${selectedBrand} (ej: 13, Ultra, Note, Pro)...`}
                            className="w-full bg-transparent text-xs text-zinc-900 focus:outline-none"
                          />
                          {modelSearch && (
                            <button onClick={() => setModelSearch("")} className="text-xs text-zinc-400">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Chips de modelos */}
                      <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto p-1 scrollbar-thin">
                        {availableModels.map((model) => (
                          <button
                            key={model}
                            onClick={() => {
                              setSelectedModel(model);
                              setSelectedCategory(null);
                            }}
                            className={`text-xs px-4 py-2.5 rounded-xl transition-all border ${
                              selectedModel === model
                                ? "bg-zinc-900 text-white border-zinc-900 font-semibold shadow-sm"
                                : "bg-white text-zinc-700 border-black/[0.05] hover:border-black/20"
                            }`}
                          >
                            {model}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PASO 3: TIPO DE REPARACIÓN */}
                  {selectedModel && (
                    <div className="animate-fadeIn">
                      <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block mb-4">
                        3. Tipo de reparación para {selectedModel}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: "Pantallas", title: "Pantalla", desc: "Display OLED o Incell calibrada" },
                          { id: "Tapas Traseras", title: "Tapa Trasera", desc: "Cristal o chasis de reemplazo" },
                          { id: "Puertos de Carga", title: "Pin de Carga", desc: "Reparación de conector y micrófono" },
                        ].map((cat) => {
                          const isSelected = selectedCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(cat.id as any)}
                              className={`p-5 rounded-2xl border text-left transition-all ${
                                isSelected
                                  ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                                  : "bg-white text-zinc-800 border-black/[0.05] hover:border-black/20"
                              }`}
                            >
                              <p className="font-semibold text-sm">{cat.title}</p>
                              <p className={`text-xs mt-1 ${isSelected ? "text-zinc-300" : "text-zinc-600"}`}>
                                {cat.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* RESULTADOS REVELADOS SOLO AL COMPLETAR LOS 3 PASOS */}
                  {selectedBrand && selectedModel && selectedCategory && (
                    <div className="pt-8 border-t border-black/[0.06] animate-fadeIn">
                      <div className="mb-5">
                        <span className="text-xs text-zinc-600 uppercase tracking-wider font-semibold block">
                          Resultado para {selectedModel}
                        </span>
                        <h3 className="text-lg font-semibold text-zinc-900 mt-0.5">
                          Opciones disponibles ({selectedCategory})
                        </h3>
                      </div>

                      {matchingRepairs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {matchingRepairs.map((item) => (
                            <div 
                              key={item.id}
                              className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm flex flex-col justify-between minimal-card-hover"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="bg-zinc-100 text-zinc-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                                    {item.quality}
                                  </span>
                                  <span className="text-[11px] text-zinc-600">
                                    Garantía taller
                                  </span>
                                </div>

                                <h4 className="font-semibold text-base text-zinc-900 mb-1">
                                  {item.model}
                                </h4>
                                <p className="text-xs text-zinc-600 mb-5">
                                  Instalación profesional y sellado incluidos.
                                </p>
                              </div>

                              <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between">
                                <div>
                                  <span className="text-[10px] text-zinc-600 block uppercase font-medium">Precio cerrado</span>
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
                                  className="bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Añadir</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-3xl bg-white border border-black/[0.06] text-center text-zinc-600 text-xs">
                          <p>Para este modelo específico cotizamos de inmediato bajo pedido.</p>
                          <button
                            onClick={() => handleConsultWhatsApp(`${selectedModel} ${selectedCategory}`)}
                            className="mt-4 bg-zinc-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Consultar en WhatsApp</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AVISO DE SELECCIÓN INCOMPLETA */}
                  {(!selectedBrand || !selectedModel || !selectedCategory) && (
                    <div className="bg-white/80 rounded-2xl p-6 text-center text-zinc-600 text-xs mt-4 border border-black/[0.03]">
                      <p>
                        Completa los 3 pasos anteriores para ver los repuestos y agregarlos al carrito.
                      </p>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* DISPOSITIVOS EN VENTA (SHOWROOM CON FILTROS Y ORDENAMIENTO) */}
        {/* ============================================================== */}
        {activeTab === "productos" && (
          <div className="animate-fadeIn mb-24">
            
            {/* Título de la Sección */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-900">
                  Dispositivos de Reestreno Certificados
                </h2>
                <p className="text-xs text-zinc-600 mt-1">
                  Equipos garantizados, probados minuciosamente en taller (6 meses de garantía)
                </p>
              </div>

              {/* Selector de ordenamiento: menor a mayor / mayor a menor */}
              <div className="flex items-center gap-2 self-start md:self-auto bg-[#F4F4F6] p-1.5 rounded-2xl border border-black/[0.04]">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 ml-2" />
                <span className="text-xs text-zinc-600 font-medium">Ordenar:</span>
                <button
                  onClick={() => setDevicePriceSort("default")}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                    devicePriceSort === "default"
                      ? "bg-white text-zinc-900 font-semibold shadow-2xs"
                      : "text-zinc-600 hover:text-black"
                  }`}
                >
                  Destacados
                </button>
                <button
                  onClick={() => setDevicePriceSort("asc")}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                    devicePriceSort === "asc"
                      ? "bg-white text-zinc-900 font-semibold shadow-2xs"
                      : "text-zinc-600 hover:text-black"
                  }`}
                >
                  Menor a Mayor
                </button>
                <button
                  onClick={() => setDevicePriceSort("desc")}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
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
                  onClick={() => setDeviceBrandFilter(brand)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-medium transition-all border ${
                    deviceBrandFilter.toLowerCase() === brand.toLowerCase()
                      ? "bg-zinc-900 text-white border-zinc-900 font-semibold shadow-sm"
                      : "bg-[#FAF9F8] text-zinc-700 border-black/[0.04] hover:border-black/20"
                  }`}
                >
                  {brand}
                </button>
              ))}

              {/* Botón especial: Consultar por otro en WhatsApp */}
              <button
                onClick={() => handleConsultWhatsApp()}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-all shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-600" />
                <span>Consultar por otro en WhatsApp</span>
              </button>
            </div>

            {/* Parrilla de Teléfonos */}
            {filteredDevices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredDevices.map((dev) => (
                  <div 
                    key={dev.id}
                    className="bg-[#FAF9F8] rounded-[2rem] p-6 border border-black/[0.04] flex flex-col justify-between minimal-card-hover group"
                  >
                    <div className="relative h-64 rounded-2xl bg-[#EBECEF]/60 overflow-hidden mb-6 flex items-center justify-center">
                      <img 
                        src={dev.image} 
                        alt={dev.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                        <span className="text-xs text-zinc-600 ml-auto">Garantía 6 Meses</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] text-zinc-600 block uppercase font-medium">Precio final</span>
                        <span className="text-2xl font-bold text-zinc-900 tracking-tight">${dev.price}</span>
                      </div>

                      <button
                        onClick={() => addToCart({
                          id: dev.id,
                          title: dev.model,
                          subtitle: `${dev.sub} · ${dev.grade}`,
                          price: dev.price
                        })}
                        className="bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Al Carrito</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#FAF9F8] rounded-[2rem] p-12 text-center border border-black/[0.04]">
                <p className="text-sm font-semibold text-zinc-900 mb-2">
                  No hay dispositivos listados en este filtro por ahora
                </p>
                <p className="text-xs text-zinc-600 max-w-md mx-auto mb-6">
                  Renovamos inventario semanalmente. Consúltanos por el modelo específico que buscas y te lo conseguimos de inmediato.
                </p>
                <button
                  onClick={() => handleConsultWhatsApp(deviceBrandFilter !== "Todos" ? deviceBrandFilter : undefined)}
                  className="bg-zinc-900 text-white text-xs font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar en WhatsApp</span>
                </button>
              </div>
            )}

            {/* Banner inferior de consulta personalizada */}
            <div className="mt-12 bg-[#FAF9F8] rounded-[2rem] p-8 border border-black/[0.04] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block mb-1">
                  ¿Buscas otro modelo o capacidad?
                </span>
                <h4 className="text-lg font-semibold text-zinc-900">
                  Cotizamos cualquier equipo nuevo o certificado bajo pedido
                </h4>
                <p className="text-xs text-zinc-600 mt-1">
                  Atención directa con nuestro equipo en Calle Ricardo Arias, Panamá.
                </p>
              </div>
              <button
                onClick={() => handleConsultWhatsApp()}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-6 py-3 rounded-full text-xs sm:text-sm shrink-0 flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Escríbenos por WhatsApp</span>
              </button>
            </div>

          </div>
        )}

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
                  Tu Cotización
                </h3>
                <span className="text-xs text-zinc-600">
                  {totalCartCount} {totalCartCount === 1 ? "artículo" : "artículos"} seleccionados
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto py-5 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-24 text-zinc-400">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold text-zinc-700">Tu carrito está vacío</p>
                  <p className="text-xs text-zinc-600 mt-1 max-w-xs mx-auto">
                    Selecciona una reparación en el cotizador o un teléfono de reestreno.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FAF9F8] border border-black/[0.04] flex items-center justify-between gap-3"
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
                    Tu nombre (opcional)
                  </label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Carlos Mendoza"
                    className="w-full bg-[#FAF9F8] px-4 py-2.5 rounded-xl text-xs text-zinc-900 focus:outline-none border border-black/[0.04]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-600 block mb-1">
                    Detalle del equipo o falla (opcional)
                  </label>
                  <input 
                    type="text" 
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Ej: Pantalla rota pero enciende"
                    className="w-full bg-[#FAF9F8] px-4 py-2.5 rounded-xl text-xs text-zinc-900 focus:outline-none border border-black/[0.04]"
                  />
                </div>

                <div className="pt-2 flex items-baseline justify-between border-t border-black/[0.04]">
                  <span className="text-xs text-zinc-600 font-medium">Total estimado</span>
                  <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                    ${totalCartPrice.toFixed(2)} USD
                  </span>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3.5 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enviar Cotización a WhatsApp</span>
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slideUp">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-zinc-950 hover:bg-black text-white rounded-full px-6 py-3.5 shadow-2xl flex items-center gap-3 border border-white/15 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-white" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-xs font-semibold tracking-tight">
              Ver Carrito ({totalCartCount} {totalCartCount === 1 ? "artículo" : "artículos"})
            </span>
            <span className="text-xs text-zinc-500 font-normal">·</span>
            <span className="text-xs font-bold text-emerald-400">
              ${totalCartPrice.toFixed(2)}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

    </div>
  );
}
