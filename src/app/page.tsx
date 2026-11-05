"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
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
  ExternalLink,
  Settings,
  SlidersHorizontal
} from "lucide-react";
import { REPAIR_CATALOG, POPULAR_MODELS, isModelMatch, RepairItem } from "@/data/repairCatalog";
import INITIAL_INVENTORY from "@/data/inventory.json";
import { InventoryProduct } from "@/types/inventory";

// Datos oficiales de TecnoTrade PTY
const WHATSAPP_NUMBER = "50768529324";
const INSTAGRAM_URL = "https://www.instagram.com/tecnotradepty/";
const GOOGLE_MAPS_URL = "https://www.google.com/maps?q=Mobile+Hub+Pty,+C.+Ricardo+Arias+5,+Panam%C3%A1,+Provincia+de+Panam%C3%A1&ftid=0x8faca9a77aef134b:0x20520f48e572172d&entry=gps&shh=CAE&lucs=,94297699,94284454,94231188,94280568,47071704,94218641,94282134,94286869&g_ep=CAISEjI2LjE5LjIuOTEwMjIxOTUwMBgAIIgnKkgsOTQyOTc2OTksOTQyODQ0NTQsOTQyMzExODgsOTQyODA1NjgsNDcwNzE3MDQsOTQyMTg2NDEsOTQyODIxMzQsOTQyODY4NjlCAlBB&skid=78b66149-c412-4190-89b3-86f1842bf2a2&g_st=ic";

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
  const [activeTab, setActiveTab] = useState<"taller" | "productos">("productos");

  // Inventario dinámico sincronizado con la base de datos y panel admin
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [repairs, setRepairs] = useState<RepairItem[]>(REPAIR_CATALOG);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => console.error("Error al sincronizar inventario en vivo:", err))
      .finally(() => setIsProductsLoading(false));

    fetch("/api/repairs", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRepairs(data);
        }
      })
      .catch((err) => console.error("Error al sincronizar reparaciones en vivo:", err));
  }, []);

  // Barra de búsqueda superior unificada en Taller
  const [directSearchQuery, setDirectSearchQuery] = useState("");

  // Filtros paso a paso ubicados justo debajo de la barra de búsqueda
  const [selectedBrand, setSelectedBrand] = useState<"Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google" | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"Pantallas" | "Tapas Traseras" | "Puertos de Carga" | null>(null);
  const [expandedStep, setExpandedStep] = useState<1 | 2 | 3 | null>(1);

  // Filtros de Móviles en Venta
  const [deviceBrandFilter, setDeviceBrandFilter] = useState<string>("Todos");
  const [devicePriceSort, setDevicePriceSort] = useState<"default" | "asc" | "desc">("default");
  const [showFullCatalog, setShowFullCatalog] = useState(false);
  const [isFilterTabOpen, setIsFilterTabOpen] = useState(false);

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

  // Lista plana de todos los modelos conocidos (incluyendo los añadidos desde /admin)
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

    // Agregar modelos personalizados creados en el panel de admin que no estén aún cubiertos
    repairs.forEach((r) => {
      if (/series|&|\(/i.test(r.model) || r.model.split("/").length > 3) return;
      const alreadyExists = list.some(
        (existing) => existing.brand === r.brand && isModelMatch(r.model, existing.model, r.brand)
      );
      if (!alreadyExists) {
        list.push({ model: r.model, brand: r.brand });
      }
    });

    return list;
  }, [repairs]);

  // Construye una línea puramente de texto indicando si hay pantalla (y sus calidades), tapa y puerto
  const buildTextSummaryForModel = (modelName: string, brandHint: string): string => {
    // Calidades de pantalla disponibles
    const screenQualities = repairs.filter((item) => {
      if (item.category !== "Pantallas") return false;
      if (item.brand.toLowerCase() !== brandHint.toLowerCase()) return false;
      return isModelMatch(item.model, modelName, brandHint);
    }).map((s) => s.quality);

    const uniqueQualities = Array.from(new Set(screenQualities));

    // Verificar si hay tapa trasera
    const hasBackCover = repairs.some((item) => {
      if (item.category !== "Tapas Traseras") return false;
      if (item.brand.toLowerCase() !== brandHint.toLowerCase()) return false;
      return isModelMatch(item.model, modelName, brandHint);
    });

    // Verificar si hay puerto de carga
    const hasPort = repairs.some((item) => {
      if (item.category !== "Puertos de Carga") return false;
      if (item.brand.toLowerCase() !== brandHint.toLowerCase()) return false;
      return isModelMatch(item.model, modelName, brandHint);
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
  }, [directSearchQuery, allKnownModels, repairs]);

  // Modelos disponibles según la marca seleccionada en los filtros
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    const baseModels = [...(POPULAR_MODELS[selectedBrand] || [])];
    repairs.forEach((r) => {
      if (r.brand !== selectedBrand) return;
      if (/series|&|\(/i.test(r.model) || r.model.split("/").length > 3) return;
      const alreadyExists = baseModels.some((m) => isModelMatch(r.model, m, selectedBrand));
      if (!alreadyExists) {
        baseModels.unshift(r.model);
      }
    });
    return baseModels;
  }, [selectedBrand, repairs]);

  // Reparaciones coincidentes cuando se completan los 3 filtros
  const matchingRepairs = useMemo(() => {
    if (!selectedBrand || !selectedModel || !selectedCategory) return [];

    return repairs.filter((item) => {
      if (item.brand !== selectedBrand) return false;
      if (item.category !== selectedCategory) return false;

      return isModelMatch(item.model, selectedModel, selectedBrand);
    });
  }, [selectedBrand, selectedModel, selectedCategory, repairs]);

  // Dispositivos filtrados y ordenados para el Showroom
  const filteredDevices = useMemo(() => {
    let list = [...products];

    if (deviceBrandFilter !== "Todos") {
      list = list.filter((dev) => dev.category.toLowerCase() === deviceBrandFilter.toLowerCase());
    }

    if (devicePriceSort === "asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (devicePriceSort === "desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, deviceBrandFilter, devicePriceSort]);

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
    setExpandedStep(3);
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
    <div className="min-h-screen bg-[#FAFBFD] text-[#14171F] pb-32 font-sans selection:bg-[#1B57F2] selection:text-white">
      
      {/* ============================================================== */}
      {/* HEADER CLAYMORPHISM LIMPIO (SIN BORDES ILUMINADOS) */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAFBFD]/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden clay-card flex items-center justify-center p-1 transition-transform duration-300 hover:scale-105">
              <img 
                src="/logo.jpg" 
                alt="TecnoTrade" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[#14171F] block leading-tight">
                TecnoTrade
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                Proveedor Técnico & Móviles · Panamá
              </span>
            </div>
          </div>

          {/* ACCIONES DE CABECERA: CÓMO LLEGAR Y PEDIDO */}
          <div className="flex items-center gap-3">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#14171F] clay-pill px-4 py-2.5 rounded-full"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1B57F2]" />
              <span>Cómo llegar</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="clay-btn-dark text-xs font-semibold px-4.5 py-2.5 rounded-full flex items-center gap-2"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Pedido</span>
              {totalCartCount > 0 && (
                <span className="clay-badge-blue text-[11px] font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* AVISO FLOTANTE DE ELEMENTO AÑADIDO */}
      {addedItemNotification && (
        <div className="fixed top-22 right-6 z-50 clay-btn-dark px-4.5 py-3.5 rounded-2xl flex items-center gap-3 animate-slideDown">
          <div className="w-7 h-7 rounded-xl clay-badge-blue flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white">{addedItemNotification}</p>
            <p className="text-slate-300 text-[11px]">Añadido al pedido</p>
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
      <main className="max-w-5xl mx-auto px-6 pt-10 md:pt-14">

        {/* HERO EDITORIAL CON BOTONES Y RIELES CLAYMORPHIC 3D */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          
          {/* COLUMNA IZQUIERDA: TITULO, LEYENDA Y SELECTOR */}
          <div className="lg:col-span-7">
            <h1 className="animate-fadeIn text-4xl sm:text-6xl font-light tracking-tight text-[#14171F] mb-6 leading-[1.14]">
              <span>Proveedor de </span>
              <span className="font-corporate-cursive font-semibold text-5xl sm:text-7xl text-[#1B57F2] inline-block pr-1">
                taller
              </span>
              <br />
              <span>y equipos </span>
              <span className="font-corporate-cursive font-semibold text-5xl sm:text-7xl text-[#14171F] inline-block">
                certificados.
              </span>
            </h1>

            <p className="animate-fadeIn stagger-2 text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
              Suministro de{" "}
              <span className="font-corporate-cursive text-[#14171F] font-semibold text-lg sm:text-xl">
                reparaciones especializadas
              </span>{" "}
              y teléfonos verificados para{" "}
              <strong className="font-semibold text-[#14171F]">
                tiendas, revendedores y clientes directos
              </strong>{" "}
              en Panamá. Tarifas con{" "}
              <span className="font-corporate-cursive text-[#1B57F2] font-semibold text-lg sm:text-xl">
                garantía de taller
              </span>
              , repuestos en distintas calidades y{" "}
              <span className="font-corporate-cursive text-[#14171F] font-semibold text-lg sm:text-xl">
                respuesta inmediata.
              </span>
            </p>

            {/* BIFURCADOR SUPERIOR DE GRAN ESCALA (PC Y MÓVIL) EN BLOQUES 3D */}
            <div className="animate-fadeIn stagger-3 w-full sm:w-auto inline-grid grid-cols-1 sm:grid-cols-2 gap-3 p-2.5 clay-inset rounded-[2rem]">
              <button
                onClick={() => setActiveTab("taller")}
                className={`px-7 sm:px-8 py-4 sm:py-4.5 rounded-[1.5rem] text-base sm:text-lg font-extrabold tracking-tight transition-all flex items-center justify-center gap-3 ${
                  activeTab === "taller"
                    ? "clay-btn-blue"
                    : "clay-pill text-[#14171F] hover:text-[#1B57F2]"
                }`}
              >
                <Wrench className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span>
                  Catálogo de <span className="font-corporate-cursive text-xl sm:text-2xl font-bold">Reparaciones</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("productos")}
                className={`px-7 sm:px-8 py-4 sm:py-4.5 rounded-[1.5rem] text-base sm:text-lg font-extrabold tracking-tight transition-all flex items-center justify-center gap-3 ${
                  activeTab === "productos"
                    ? "clay-btn-blue"
                    : "clay-pill text-[#14171F] hover:text-[#1B57F2]"
                }`}
              >
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span>
                  Equipos en <span className="font-corporate-cursive text-xl sm:text-2xl font-bold">Venta</span> ({filteredDevices.length})
                </span>
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: IPHONE INCLINADO DIAGONAL A LA IZQUIERDA (CAMBIA ENTRE HERRAMIENTAS DE TALLER Y BOLSA DE COMPRA) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end select-none pointer-events-none">
            <div className="relative w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px] flex items-center justify-center">
              <img
                src="/hero-iphone-taller.jpg"
                alt="Servicio Técnico Especializado"
                className={`w-full h-auto object-contain mix-blend-multiply transition-opacity duration-300 ${
                  activeTab === "taller" ? "opacity-100" : "opacity-0"
                }`}
              />
              <img
                src="/hero-iphone-ventas.jpg"
                alt="Equipos Certificados en Venta"
                className={`absolute inset-0 w-full h-auto object-contain mix-blend-multiply transition-opacity duration-300 ${
                  activeTab === "productos" ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* TALLER // SUPERFICIE CLAY 3D + BUSCADOR Y FILTROS RETRÁCTILES */}
        {/* ============================================================== */}
        {activeTab === "taller" && (
          <div className="space-y-10 animate-fadeIn stagger-2 mb-20">
            
            <div className="clay-surface rounded-[2.5rem] p-6 sm:p-10 transition-all">
              
              {/* Cabecera del Cotizador */}
              <div className="flex items-center justify-between pb-6 mb-7">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl clay-badge-blue flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#14171F] tracking-tight">
                      Cotizador de <span className="font-cursive-accent font-normal text-[#1B57F2]">Servicio Técnico</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Busca tu modelo arriba o selecciona marca y pieza con <span className="font-cursive-accent text-[#14171F]">instalación profesional</span>
                    </p>
                  </div>
                </div>

                {(selectedBrand || selectedModel || selectedCategory || directSearchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedBrand(null);
                      setSelectedModel(null);
                      setSelectedCategory(null);
                      setDirectSearchQuery("");
                      setExpandedStep(1);
                    }}
                    className="clay-pill px-3.5 py-2 rounded-full text-xs text-slate-700 hover:text-[#1B57F2] flex items-center gap-1.5 font-semibold shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#1B57F2]" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>

              {/* 1. BARRA DE BÚSQUEDA EN CAVIDAD 3D (CLAY INSET) */}
              <div className="relative mb-8">
                <div className="clay-inset rounded-2xl px-5 py-4 flex items-center gap-3.5 transition-all">
                  <Search className="w-4 h-4 text-[#1B57F2] shrink-0" />
                  <input 
                    type="text"
                    value={directSearchQuery}
                    onChange={(e) => setDirectSearchQuery(e.target.value)}
                    placeholder="Buscar modelo rápido (ej: iPhone 13, Galaxy S23, Honor 90, Redmi Note 13)..."
                    className="w-full bg-transparent text-xs sm:text-sm text-[#14171F] font-medium focus:outline-none placeholder:text-slate-400"
                  />
                  {directSearchQuery && (
                    <button 
                      onClick={() => setDirectSearchQuery("")} 
                      className="text-slate-400 hover:text-[#14171F] p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Lista desplegable en tarjeta Clay 3D */}
                {directSearchQuery.trim() && (
                  <div className="mt-3 clay-card rounded-2xl overflow-hidden divide-y divide-slate-100 animate-fadeIn">
                    {textSuggestions.length > 0 ? (
                      textSuggestions.map((sug) => (
                        <button
                          key={sug.model}
                          onClick={() => handleSelectSuggestion(sug)}
                          className="w-full px-5 py-3.5 text-left hover:bg-[#F2F4F8] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                        >
                          <span className="text-xs sm:text-sm font-bold text-[#14171F]">
                            {sug.model}
                          </span>
                          <span className="text-[11px] sm:text-xs text-[#1B57F2] font-semibold">
                            {sug.summaryLine}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-4 flex items-center justify-between text-xs text-slate-600">
                        <span>Sin coincidencias exactas para &ldquo;{directSearchQuery}&rdquo;</span>
                        <button
                          onClick={() => handleConsultWhatsApp(directSearchQuery)}
                          className="font-semibold text-[#1B57F2] underline"
                        >
                          Consultar por WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. FILTROS RETRÁCTILES UNIFICADOS EN BLOQUES CLAY 3D */}
              <div className="space-y-4">

                {/* RESUMEN COMPACTO CUANDO LOS 3 PASOS ESTÁN SELECCIONADOS Y PLEGADOS */}
                {selectedBrand && selectedModel && selectedCategory && expandedStep === null ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 animate-fadeIn">
                    <button
                      onClick={() => setExpandedStep(1)}
                      className="w-full flex items-center justify-between px-4.5 py-3.5 rounded-2xl clay-card clay-card-interactive text-left group"
                      title="Cambiar marca"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl clay-badge-soft flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-[#1B57F2]" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">1. Marca</span>
                          <span className="text-xs sm:text-sm font-bold text-[#14171F] truncate block">{selectedBrand}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full clay-inset group-hover:bg-[#1B57F2] flex items-center justify-center shrink-0 ml-2 transition-colors">
                        <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                      </div>
                    </button>

                    <button
                      onClick={() => setExpandedStep(2)}
                      className="w-full flex items-center justify-between px-4.5 py-3.5 rounded-2xl clay-card clay-card-interactive text-left group"
                      title="Cambiar modelo"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl clay-badge-soft flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-[#1B57F2]" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">2. Modelo</span>
                          <span className="text-xs sm:text-sm font-bold text-[#14171F] truncate block">{selectedModel}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full clay-inset group-hover:bg-[#1B57F2] flex items-center justify-center shrink-0 ml-2 transition-colors">
                        <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                      </div>
                    </button>

                    <button
                      onClick={() => setExpandedStep(3)}
                      className="w-full flex items-center justify-between px-4.5 py-3.5 rounded-2xl clay-card clay-card-interactive text-left group"
                      title="Cambiar pieza"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl clay-badge-soft flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-[#1B57F2]" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">3. Pieza</span>
                          <span className="text-xs sm:text-sm font-bold text-[#14171F] truncate block">{selectedCategory}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full clay-inset group-hover:bg-[#1B57F2] flex items-center justify-center shrink-0 ml-2 transition-colors">
                        <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                      </div>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* PASO 1: MARCA */}
                    {selectedBrand && expandedStep !== 1 ? (
                      <button
                        onClick={() => setExpandedStep(1)}
                        className="w-full flex items-center justify-between px-4.5 py-3.5 rounded-2xl clay-card clay-card-interactive text-left group animate-fadeIn"
                        title="Cambiar marca"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl clay-badge-soft flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-[#1B57F2]" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">1. Marca seleccionada</span>
                            <span className="text-xs sm:text-sm font-bold text-[#14171F]">{selectedBrand}</span>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full clay-inset group-hover:bg-[#1B57F2] flex items-center justify-center shrink-0 transition-colors">
                          <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                      </button>
                    ) : (
                      <div className="clay-card p-6 rounded-3xl animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-[#14171F] uppercase tracking-wider">
                            1. Selecciona la Marca
                          </span>
                          {selectedBrand && (
                            <button
                              onClick={() => setExpandedStep(selectedModel ? (selectedCategory ? null : 3) : 2)}
                              className="text-xs text-[#1B57F2] font-semibold flex items-center gap-1"
                            >
                              <span>Plegar</span>
                              <ChevronUp className="w-3.5 h-3.5" />
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
                                setExpandedStep(2);
                              }}
                              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold ${
                                selectedBrand === brand
                                  ? "clay-btn-blue"
                                  : "clay-pill text-[#14171F]"
                              }`}
                            >
                              {brand}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PASO 2: MODELO */}
                    {selectedBrand && (
                      selectedModel && expandedStep !== 2 ? (
                        <button
                          onClick={() => setExpandedStep(2)}
                          className="w-full flex items-center justify-between px-4.5 py-3.5 rounded-2xl clay-card clay-card-interactive text-left group animate-fadeIn"
                          title="Cambiar modelo"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl clay-badge-soft flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-[#1B57F2]" />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">2. Modelo seleccionado</span>
                              <span className="text-xs sm:text-sm font-bold text-[#14171F]">{selectedModel}</span>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full clay-inset group-hover:bg-[#1B57F2] flex items-center justify-center shrink-0 transition-colors">
                            <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                          </div>
                        </button>
                      ) : (
                        <div className="clay-card p-6 rounded-3xl animate-fadeIn">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-[#14171F] uppercase tracking-wider">
                              2. Modelo de {selectedBrand}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-500 font-medium">
                                {availableModels.length} disponibles
                              </span>
                              {selectedModel && (
                                <button
                                  onClick={() => setExpandedStep(selectedCategory ? null : 3)}
                                  className="text-xs text-[#1B57F2] font-semibold flex items-center gap-1"
                                >
                                  <span>Plegar</span>
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2.5 max-h-56 overflow-y-auto p-1 scrollbar-thin">
                            {availableModels.map((model) => (
                              <button
                                key={model}
                                onClick={() => {
                                  setSelectedModel(model);
                                  setSelectedCategory(null);
                                  setExpandedStep(3);
                                }}
                                className={`text-xs px-4 py-2.5 rounded-xl font-bold ${
                                  selectedModel === model
                                    ? "clay-btn-blue"
                                    : "clay-pill text-[#14171F]"
                                }`}
                              >
                                {model}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    )}

                    {/* PASO 3: REPUESTO / SERVICIO CON ICONOS 3D CLAY */}
                    {selectedModel && (
                      selectedCategory && expandedStep !== 3 ? (
                        <button
                          onClick={() => setExpandedStep(3)}
                          className="w-full flex items-center justify-between px-4.5 py-3.5 rounded-2xl clay-card clay-card-interactive text-left group animate-fadeIn"
                          title="Cambiar pieza"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl clay-badge-soft flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-[#1B57F2]" />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">3. Pieza seleccionada</span>
                              <span className="text-xs sm:text-sm font-bold text-[#14171F]">{selectedCategory}</span>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full clay-inset group-hover:bg-[#1B57F2] flex items-center justify-center shrink-0 transition-colors">
                            <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                          </div>
                        </button>
                      ) : (
                        <div className="clay-card p-6 rounded-3xl animate-fadeIn">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-[#14171F] uppercase tracking-wider">
                              3. Pieza requerida para {selectedModel}
                            </span>
                            {selectedCategory && (
                              <button
                                onClick={() => setExpandedStep(null)}
                                className="text-xs text-[#1B57F2] font-semibold flex items-center gap-1"
                              >
                                <span>Plegar</span>
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            {[
                              { id: "Pantallas", title: "Pantalla", desc: "Calidades Incell, OLED y Original", icon: Smartphone },
                              { id: "Tapas Traseras", title: "Tapa Trasera", desc: "Reemplazo de cristal posterior", icon: ShieldCheck },
                              { id: "Puertos de Carga", title: "Puerto de Carga", desc: "Flex de carga y micrófono", icon: Wrench },
                            ].map((cat) => {
                              const isSelected = selectedCategory === cat.id;
                              const IconComp = cat.icon;
                              return (
                                <button
                                  key={cat.id}
                                  onClick={() => {
                                    setSelectedCategory(cat.id as any);
                                    setExpandedStep(null);
                                  }}
                                  className={`p-5 rounded-2xl text-left transition-all flex items-start gap-3.5 ${
                                    isSelected
                                      ? "clay-btn-blue"
                                      : "clay-pill text-[#14171F]"
                                  }`}
                                >
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                    isSelected ? "bg-white/20 text-white" : "clay-badge-soft"
                                  }`}>
                                    <IconComp className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm">{cat.title}</p>
                                    <p className={`text-xs mt-1 ${isSelected ? "text-blue-100" : "text-slate-600"}`}>
                                      {cat.desc}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )
                    )}
                  </>
                )}

                {/* RESULTADOS EN TARJETAS CLAY 3D */}
                {selectedBrand && selectedModel && selectedCategory && (
                  <div className="pt-8 animate-fadeIn">
                    <div className="mb-5">
                      <span className="text-xs text-[#1B57F2] uppercase tracking-wider font-bold block">
                        Cotización para {selectedModel}
                      </span>
                      <h3 className="text-lg font-bold text-[#14171F] mt-0.5">
                        Calidades disponibles · {selectedCategory}
                      </h3>
                    </div>

                    {matchingRepairs.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {matchingRepairs.map((item) => (
                          <div 
                            key={item.id}
                            className="clay-card clay-card-interactive rounded-3xl p-6 flex flex-col justify-between animate-scaleIn"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3.5">
                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                                  item.quality === "Original" || item.quality === "Servipack"
                                    ? "clay-badge-blue"
                                    : item.quality === "OLED"
                                    ? "clay-btn-dark"
                                    : "clay-inset text-slate-700"
                                }`}>
                                  {item.quality}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  Incluye instalación
                                </span>
                              </div>

                              <h4 className="font-bold text-base text-[#14171F] mb-1">
                                {item.model}
                              </h4>
                              <p className="text-xs text-slate-500 mb-6">
                                Repuesto verificado con garantía de taller.
                              </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Tarifa</span>
                                <span className="text-2xl font-bold text-[#14171F] tracking-tight">
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
                                className="clay-btn-blue text-xs font-semibold px-4.5 py-2.5 rounded-full flex items-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Añadir</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 rounded-3xl clay-card text-center text-slate-600 text-xs animate-scaleIn">
                        <p>Esta pieza específica se maneja bajo pedido directo en almacén.</p>
                        <button
                          onClick={() => handleConsultWhatsApp(`${selectedModel} - ${selectedCategory}`)}
                          className="mt-4 clay-btn-blue text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5"
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
                  <div className="clay-inset rounded-2xl p-5 text-center text-slate-500 text-xs font-medium">
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
        {/* EQUIPOS EN VENTA (CLAYMORPHISM 3D + FLAT) */}
        {/* ============================================================== */}
        {activeTab === "productos" && (
          <div className="animate-fadeIn mb-20">
            
            {/* Título de la Sección */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl clay-badge-blue flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#14171F] leading-tight">
                    Stock de Dispositivos <span className="font-cursive-accent font-normal text-[#1B57F2]">Verificados</span>
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Disponibles por unidad o lote · <span className="font-cursive-accent text-[#14171F]">Garantía de 6 meses</span>
                  </p>
                </div>
              </div>

              {/* Botón rápido WhatsApp para lotes especiales */}
              <button
                onClick={() => handleConsultWhatsApp()}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold clay-badge-soft hover:bg-[#1B57F2] hover:text-white transition-all cursor-pointer"
              >
                <MessageCircle className="w-3 h-3 fill-current" />
                <span>Consultar por WhatsApp</span>
              </button>
            </div>

            {/* PESTAÑA UNIFICADA DE FILTROS Y ORDENAMIENTO */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between gap-2.5">
                {/* Botón Pestaña de Filtros */}
                <button
                  onClick={() => setIsFilterTabOpen((prev) => !prev)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer btn-tactile ${
                    isFilterTabOpen || deviceBrandFilter !== "Todos" || devicePriceSort !== "default"
                      ? "clay-btn-blue text-white shadow-xs"
                      : "clay-pill text-slate-800 hover:text-black"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filtros y Ordenar</span>
                  {(deviceBrandFilter !== "Todos" || devicePriceSort !== "default") && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                  )}
                  {isFilterTabOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 ml-1" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 ml-1" />
                  )}
                </button>

                {/* Resumen del filtro activo y contador */}
                <div className="text-right flex items-center gap-2">
                  {(deviceBrandFilter !== "Todos" || devicePriceSort !== "default") && (
                    <button
                      onClick={() => {
                        setDeviceBrandFilter("Todos");
                        setDevicePriceSort("default");
                      }}
                      className="text-[11px] font-semibold text-[#1B57F2] hover:underline cursor-pointer"
                    >
                      Limpiar
                    </button>
                  )}
                  <span className="text-[11px] font-semibold text-slate-500">
                    {filteredDevices.length} {filteredDevices.length === 1 ? "equipo" : "equipos"}
                    {deviceBrandFilter !== "Todos" && (
                      <span className="text-[#1B57F2] font-bold"> · {deviceBrandFilter}</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Panel Desplegable: Todos los filtros agrupados en una sola pestaña */}
              {isFilterTabOpen && (
                <div className="clay-surface rounded-2xl p-4 sm:p-5 mt-3 border border-black/[0.04] shadow-sm animate-scaleIn space-y-4">
                  {/* Grupo 1: Marcas y Categorías */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Filtrar por Marca / Categoría
                      </span>
                      {deviceBrandFilter !== "Todos" && (
                        <button
                          onClick={() => setDeviceBrandFilter("Todos")}
                          className="text-[11px] font-semibold text-[#1B57F2] hover:underline cursor-pointer"
                        >
                          Ver todas
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Todos", "iPhone", "Samsung", "Honor", "Xiaomi", "Pixel", "Covers & Fundas", "Accesorios", "Otros"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setDeviceBrandFilter(cat);
                            setShowFullCatalog(false);
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            deviceBrandFilter.toLowerCase() === cat.toLowerCase()
                              ? "clay-btn-blue text-white shadow-xs"
                              : "clay-pill text-slate-700 hover:text-black"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grupo 2: Ordenar por Precio */}
                  <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Ordenar por Precio
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setDevicePriceSort("default")}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            devicePriceSort === "default"
                              ? "clay-btn-dark text-white shadow-xs"
                              : "clay-pill text-slate-700 hover:text-black"
                          }`}
                        >
                          Destacados
                        </button>
                        <button
                          onClick={() => setDevicePriceSort("asc")}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            devicePriceSort === "asc"
                              ? "clay-btn-dark text-white shadow-xs"
                              : "clay-pill text-slate-700 hover:text-black"
                          }`}
                        >
                          Menor precio
                        </button>
                        <button
                          onClick={() => setDevicePriceSort("desc")}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            devicePriceSort === "desc"
                              ? "clay-btn-dark text-white shadow-xs"
                              : "clay-pill text-slate-700 hover:text-black"
                          }`}
                        >
                          Mayor precio
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsFilterTabOpen(false)}
                      className="clay-btn-blue text-xs font-bold text-white px-4 py-1.5 rounded-full shadow-xs cursor-pointer ml-auto"
                    >
                      Aplicar y cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Parrilla de Teléfonos y Productos: 2 columnas en móvil (2 en 2), 3 en tablet, 4 en PC */}
            {isProductsLoading ? (
              <div className="clay-surface rounded-[2.2rem] p-12 text-center animate-pulse">
                <div className="w-8 h-8 border-3 border-[#1B57F2] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs font-semibold text-slate-500">Sincronizando inventario en vivo...</p>
              </div>
            ) : filteredDevices.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {displayedDevices.map((dev) => (
                    <div 
                      key={dev.id}
                      className="clay-surface rounded-2xl sm:rounded-[2.2rem] p-3 sm:p-5 flex flex-col justify-between clay-card-interactive animate-scaleIn group"
                    >
                      <div className="relative h-36 sm:h-52 md:h-60 rounded-xl sm:rounded-2xl clay-card overflow-hidden mb-3 sm:mb-4 flex items-center justify-center">
                        <img 
                          src={dev.image || "/logo.jpg"} 
                          alt={dev.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {dev.grade && (
                          <span className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 clay-pill text-[#14171F] text-[9px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                            {dev.grade}
                          </span>
                        )}
                        {dev.battery && (
                          <span className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 clay-btn-dark text-[9px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                            {dev.battery}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider">{dev.category}</span>
                          {dev.tag && (
                            <span className="text-[9px] sm:text-[10px] clay-badge-soft px-1.5 py-0.5 rounded-full font-bold truncate max-w-[70px] sm:max-w-none">
                              {dev.tag}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-xs sm:text-base text-[#14171F] line-clamp-1 leading-snug" title={dev.name}>
                          {dev.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-500 mb-2 sm:mb-3 line-clamp-1">
                          {dev.subtitle || dev.category}
                        </p>

                        <div className="flex items-center gap-1.5 mb-3 sm:mb-4 mt-auto">
                          {dev.colors && dev.colors.length > 0 && (
                            <div className="flex items-center gap-1">
                              {dev.colors.map((c, idx) => (
                                <span 
                                  key={idx}
                                  style={{ backgroundColor: c }}
                                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/10"
                                />
                              ))}
                            </div>
                          )}
                          <span className="text-[10px] sm:text-xs text-slate-500 ml-auto font-medium">
                            {dev.inStock !== false ? (
                              <span className="text-[#1B57F2] font-bold">En Stock</span>
                            ) : (
                              <span className="text-amber-600 font-semibold">Agotado</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2.5 sm:pt-4 border-t border-slate-200/70 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-1.5 sm:gap-2">
                        <div>
                          <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase font-bold leading-none">Precio</span>
                          <span className="text-base sm:text-xl font-bold text-[#14171F] tracking-tight leading-tight">${dev.price}</span>
                        </div>

                        <button
                          onClick={() => addToCart({
                            id: dev.id,
                            title: dev.name,
                            subtitle: `${dev.subtitle || dev.category} · ${dev.grade || "Garantizado"}`,
                            price: dev.price
                          })}
                          className="clay-btn-blue text-[11px] sm:text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center justify-center gap-1 btn-tactile cursor-pointer"
                        >
                          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold clay-btn-dark"
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
              <div className="clay-surface rounded-[2.2rem] p-12 text-center animate-scaleIn">
                <p className="text-sm font-bold text-[#14171F] mb-2">
                  Sin unidades listadas en esta marca por el momento
                </p>
                <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
                  Consulta directamente por WhatsApp el stock del día para revendedores y clientes finales.
                </p>
                <button
                  onClick={() => handleConsultWhatsApp(deviceBrandFilter !== "Todos" ? deviceBrandFilter : undefined)}
                  className="clay-btn-blue text-xs font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar en WhatsApp</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* PIE DE PÁGINA */}
        {/* ============================================================== */}
        <footer className="mt-16 pt-8 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 animate-fadeIn">
          <p>
            TecnoTrade PTY · <span className="font-cursive-accent text-[#14171F] font-semibold">Servicio y Reestreno</span> de Lunes a Sábado · Envíos a todo Panamá
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-slate-600 hover:text-[#14171F] font-semibold inline-flex items-center gap-1.5 transition-colors text-[11px] clay-pill px-3.5 py-2 rounded-xl"
            >
              <Settings className="w-3 h-3 text-[#1B57F2]" />
              <span>Panel Inventario</span>
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-[#1B57F2] font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>Instagram @tecnotradepty</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </footer>

      </main>

      {/* ============================================================== */}
      {/* DRAWER / MODAL DEL CARRITO EN ESTILO CLAY 3D */}
      {/* ============================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-[#14171F]/35 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-[#FAFBFD] h-full shadow-2xl flex flex-col p-6 sm:p-8 animate-slideLeft">
            
            <div className="flex items-center justify-between pb-5 border-b border-slate-200/70">
              <div>
                <h3 className="font-bold text-lg text-[#14171F]">
                  Resumen del <span className="font-cursive-accent font-normal text-[#1B57F2]">Pedido</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {totalCartCount} {totalCartCount === 1 ? "ítem seleccionado" : "ítems seleccionados"}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full clay-pill flex items-center justify-center text-slate-600 hover:text-[#14171F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto py-5 space-y-3.5">
              {cart.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                  <div className="w-14 h-14 rounded-2xl clay-inset mx-auto mb-4 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-bold text-[#14171F]">Tu pedido está vacío</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Agrega reparaciones o dispositivos del catálogo para generar tu recibo hacia WhatsApp.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-2xl clay-card flex items-center justify-between gap-3 animate-scaleIn"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#14171F] truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                      <p className="text-xs font-bold text-[#1B57F2] mt-1">
                        ${(item.price * item.quantity).toFixed(2)} USD
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 clay-inset px-2 py-1 rounded-xl">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-[#14171F]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-[#14171F]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
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
              <div className="pt-4 border-t border-slate-200/70 space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Nombre o Tienda (opcional)
                  </label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Carlos / Tienda Aliada"
                    className="w-full clay-inset px-4 py-3 rounded-xl text-xs text-[#14171F] font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Notas del pedido (opcional)
                  </label>
                  <input 
                    type="text" 
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Ej: Para entrega hoy / Color del repuesto"
                    className="w-full clay-inset px-4 py-3 rounded-xl text-xs text-[#14171F] font-medium focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-baseline justify-between">
                  <span className="text-xs text-slate-600 font-semibold">
                    Total <span className="font-cursive-accent text-[#1B57F2]">estimado</span>
                  </span>
                  <span className="text-2xl font-bold text-[#14171F] tracking-tight">
                    ${totalCartPrice.toFixed(2)} USD
                  </span>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full clay-btn-blue font-bold py-3.5 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2"
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
            className="clay-btn-dark rounded-full px-5 sm:px-6 py-3.5 flex items-center gap-3 group"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-white" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#4A80FF]" />
            </div>
            <span className="text-xs font-semibold tracking-tight">
              Ver Pedido ({totalCartCount})
            </span>
            <span className="text-xs text-slate-400 font-normal">·</span>
            <span className="text-xs font-bold text-[#7FA6FF]">
              ${totalCartPrice.toFixed(2)}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* WIDGET DE WHATSAPP EN ESQUINA INFERIOR DERECHA ("COMPRAMOS TU EQUIPO") */}
      {/* ============================================================== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        
        {/* Burbuja de mensaje estilo Clay 3D con color propio de WhatsApp */}
        {(chatBubbleStep === "typing" || chatBubbleStep === "message") && (
          <div 
            style={{ backgroundColor: '#075E54', color: '#FFFFFF' }}
            className="animate-chatPop relative text-white rounded-2xl rounded-br-xs p-4 pr-8 max-w-[260px] text-left shadow-2xl shadow-black/30 border border-white/15 font-sans"
          >
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setChatBubbleStep("dismissed");
              }}
              aria-label="Cerrar mensaje"
              className="absolute top-2.5 right-2.5 text-white/70 hover:text-white p-0.5 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {chatBubbleStep === "typing" ? (
              <div className="flex items-center gap-1.5 py-1.5 px-2">
                <span className="w-2 h-2 rounded-full bg-white typing-dot" />
                <span className="w-2 h-2 rounded-full bg-white typing-dot" />
                <span className="w-2 h-2 rounded-full bg-white typing-dot" />
              </div>
            ) : (
              <div 
                onClick={handleSellPhoneWhatsApp}
                className="cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/90 shrink-0" />
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider font-sans">
                    TecnoTrade · Trade-In
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] font-medium text-white leading-snug font-sans">
                  ¡Hey, también compramos tu teléfono! 📱💵
                </p>
                <span className="text-[11px] text-white font-bold mt-2 inline-flex items-center gap-1 group-hover:underline transition-all font-sans">
                  <span>Cotizar mi equipo</span>
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
          className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-black/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </button>
      </div>

    </div>
  );
}
