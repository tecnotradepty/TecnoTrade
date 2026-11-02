"use client";

import { useState, useMemo } from "react";
import { 
  Smartphone, 
  Wrench, 
  ShieldCheck, 
  MessageCircle, 
  BatteryCharging, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight, 
  Layers, 
  MapPin, 
  Clock, 
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  CheckCircle2,
  Receipt,
  RotateCcw
} from "lucide-react";
import { REPAIR_CATALOG, POPULAR_MODELS, RepairItem } from "@/data/repairCatalog";

// Datos oficiales de TecnoTrade PTY
const WHATSAPP_NUMBER = "50768529324";
const INSTAGRAM_URL = "https://www.instagram.com/tecnotradepty/";

// Teléfonos de reestreno en stock
const DEVICES = [
  {
    id: "dev-ip15p",
    model: "iPhone 15 Pro",
    sub: "Titanio Natural · 128 GB",
    battery: "99% Salud",
    grade: "Certificado A+",
    price: 790,
    tag: "Destacado",
    colors: ["#9E9689", "#3C3D40", "#E3E4E5"],
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "dev-ip13",
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
    id: "dev-s23u",
    model: "Samsung S23 Ultra",
    sub: "Phantom Black · 256 GB",
    battery: "95% Salud",
    grade: "Seminuevo",
    price: 640,
    tag: "Pro Camera",
    colors: ["#232426", "#424D41", "#DCD4C6"],
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=700&q=80"
  }
];

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"taller" | "productos">("taller");

  // Estado del flujo de búsqueda guiado (oculta resultados hasta especificar)
  const [selectedBrand, setSelectedBrand] = useState<"Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google" | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"Pantallas" | "Tapas Traseras" | "Puertos de Carga" | null>(null);
  const [modelSearch, setModelSearch] = useState("");

  // Estado del Carrito
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  // Funciones del Carrito
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

  // Modelos filtrados por marca y buscador
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    const list = POPULAR_MODELS[selectedBrand] || [];
    if (!modelSearch) return list;
    return list.filter((m) => m.toLowerCase().includes(modelSearch.toLowerCase()));
  }, [selectedBrand, modelSearch]);

  // Resultados revelados SOLO cuando se especificó Marca + Modelo + Categoría
  const matchingRepairs = useMemo(() => {
    if (!selectedBrand || !selectedModel || !selectedCategory) return [];

    const cleanModel = selectedModel.toLowerCase();

    return REPAIR_CATALOG.filter((item) => {
      if (item.brand !== selectedBrand) return false;
      if (item.category !== selectedCategory) return false;

      // Coincidencia inteligente de nombres
      const parts = cleanModel.replace(/galaxy|honor|pixel|iphone|\/|\+/g, " ").trim().split(/\s+/);
      return parts.some((p) => p.length >= 2 && (item.model || "").toLowerCase().includes(p));
    });
  }, [selectedBrand, selectedModel, selectedCategory]);

  // Generador de Recibo para WhatsApp
  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    let message = `🧾 *COTIZACIÓN DE REPARACIÓN · TECNOTRADE PTY*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (customerName.trim()) {
      message += `👤 *Cliente:* ${customerName.trim()}\n`;
    }
    message += `📅 *Fecha:* ${new Date().toLocaleDateString("es-PA")}\n\n`;
    message += `🛠️ *DETALLE DE SERVICIOS / ITEMS:*\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.title}*\n`;
      message += `   ↳ ${item.subtitle} | Cant: ${item.quantity} × $${item.price.toFixed(2)} = *$${(item.price * item.quantity).toFixed(2)}*\n`;
    });

    message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL ESTIMADO: $${totalCartPrice.toFixed(2)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (customerNote.trim()) {
      message += `📝 *Nota del cliente:* ${customerNote.trim()}\n`;
    }
    message += `📍 *Ubicación:* Calle Ricardo Arias, Iglesia del Carmen (Panamá)\n`;
    message += `🕒 *Horario:* 10 AM - 7 PM\n\n`;
    message += `¡Ey TecnoTrade! Me gustaría agendar mi cita para este pedido.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F4F4F7] text-[#141416] pb-36 font-sans selection:bg-[#1D58F6] selection:text-white relative">
      
      {/* BARRA SUPERIOR CON DATOS REALES DE INSTAGRAM */}
      <div className="bg-[#121216] text-zinc-300 text-[11px] font-medium py-2 px-4 border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-[#1D58F6]" /> Horario: 10 AM - 7 PM
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-[#1D58F6]" /> Panamá · Calle Ricardo Arias (Iglesia del Carmen)
            </span>
          </div>

          <a 
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#1D58F6] transition-colors flex items-center gap-1.5 font-semibold"
          >
            <svg className="w-3.5 h-3.5 text-[#E1306C] fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>@tecnotradepty</span>
          </a>
        </div>
      </div>

      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-40 bg-[#F4F4F7]/90 backdrop-blur-md border-b border-black/[0.04]">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white shadow-md border border-black/5 flex items-center justify-center p-0.5">
              <img 
                src="/logo.jpg" 
                alt="TecnoTrade Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-zinc-900">TecnoTrade</span>
                <span className="text-[10px] bg-[#1D58F6]/10 text-[#1D58F6] font-bold px-1.5 py-0.2 rounded-md font-mono">PTY</span>
              </div>
              <span className="text-[11px] text-zinc-600 block -mt-0.5 font-medium">Taller & Reestreno</span>
            </div>
          </div>

          {/* BOTÓN DEL CARRITO EN HEADER */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-white hover:bg-zinc-100 text-zinc-900 border border-black/[0.08] text-xs font-bold px-3.5 py-2 rounded-full transition-all shadow-sm flex items-center gap-2 relative"
            >
              <ShoppingCart className="w-4 h-4 text-[#1D58F6]" />
              <span className="hidden sm:inline">Carrito</span>
              {totalCartCount > 0 && (
                <span className="bg-[#1D58F6] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center -mr-1">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* AVISO FLOTANTE DE ITEM AÑADIDO */}
      {addedItemNotification && (
        <div className="fixed top-20 right-5 z-50 bg-[#141416] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Añadido al Carrito</p>
            <p className="text-zinc-400">{addedItemNotification}</p>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-[11px] text-[#1D58F6] font-bold hover:underline ml-2"
          >
            Ver
          </button>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-5 pt-8">

        {/* BIFURCADOR PRINCIPAL */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-zinc-700 border border-black/[0.05] text-[11px] font-semibold mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-base leading-none">🤠</span> Ey que tal? ¿Tas buscando reparar o comprar?
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-2">
            Catálogo & Cotizaciones TecnoTrade
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 font-normal">
            Agrega piezas o teléfonos al carrito y envía tu cotización en formato recibo directo a nuestro WhatsApp.
          </p>

          {/* Selector de Sección */}
          <div className="grid grid-cols-2 gap-3 mt-6 text-left max-w-lg mx-auto">
            <button
              onClick={() => setActiveTab("taller")}
              className={`p-4 rounded-2xl transition-all border flex items-center gap-3 ${
                activeTab === "taller"
                  ? "bg-[#141416] text-white border-zinc-900 shadow-lg scale-[1.01]"
                  : "bg-white text-zinc-800 border-black/[0.05] hover:bg-zinc-50"
              }`}
            >
              <div className={`p-2 rounded-xl ${activeTab === "taller" ? "bg-[#1D58F6] text-white" : "bg-[#F4F4F7] text-zinc-700"}`}>
                <Wrench className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block">Taller Reparaciones</span>
                <span className={`text-[10px] ${activeTab === "taller" ? "text-zinc-300" : "text-zinc-500"}`}>
                  Pantallas, tapas, pines
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("productos")}
              className={`p-4 rounded-2xl transition-all border flex items-center gap-3 ${
                activeTab === "productos"
                  ? "bg-[#141416] text-white border-zinc-900 shadow-lg scale-[1.01]"
                  : "bg-white text-zinc-800 border-black/[0.05] hover:bg-zinc-50"
              }`}
            >
              <div className={`p-2 rounded-xl ${activeTab === "productos" ? "bg-[#1D58F6] text-white" : "bg-[#F4F4F7] text-zinc-700"}`}>
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block">Móviles en Venta</span>
                <span className={`text-[10px] ${activeTab === "productos" ? "text-zinc-300" : "text-zinc-500"}`}>
                  Reestreno con garantía
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECCIÓN TALLER CON BÚSQUEDA GUIADA (OCULTA RESULTADOS HASTA ELEGIR) */}
        {/* ============================================================== */}
        {activeTab === "taller" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-9 shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-black/[0.04]">
              
              <div className="flex items-center justify-between pb-5 border-b border-black/[0.05] mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#1D58F6] uppercase font-bold">
                    Catálogo de Taller
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
                    Especifica tu modelo para cotizar
                  </h2>
                </div>

                {(selectedBrand || selectedModel || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSelectedBrand(null);
                      setSelectedModel(null);
                      setSelectedCategory(null);
                      setModelSearch("");
                    }}
                    className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar</span>
                  </button>
                )}
              </div>

              {/* PASO 1: SELECCIONAR MARCA */}
              <div className="mb-8">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-3">
                  Paso 1 · Selecciona la Marca
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(["Apple", "Samsung", "Honor", "Xiaomi", "Google"] as const).map((brand) => (
                    <button
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setSelectedModel(null);
                        setModelSearch("");
                      }}
                      className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        selectedBrand === brand
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-md scale-[1.02]"
                          : "bg-[#F4F4F7] text-zinc-700 border-black/[0.04] hover:bg-zinc-200/70"
                      }`}
                    >
                      <span>{brand}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PASO 2: SELECCIONAR MODELO (VISIBLE SOLO SI HAY MARCA) */}
              {selectedBrand && (
                <div className="mb-8 animate-fadeIn">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
                      Paso 2 · Selecciona tu Modelo de {selectedBrand}
                    </label>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {availableModels.length} modelos
                    </span>
                  </div>

                  {/* Buscador de modelo */}
                  <div className="mb-3">
                    <div className="bg-[#F4F4F7] rounded-xl px-3.5 py-2 flex items-center gap-2 border border-black/[0.03]">
                      <Search className="w-3.5 h-3.5 text-zinc-500" />
                      <input 
                        type="text"
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        placeholder={`Buscar modelo (ej: 13, Ultra, Lite, Note)...`}
                        className="w-full bg-transparent text-xs text-zinc-900 focus:outline-none"
                      />
                      {modelSearch && (
                        <button onClick={() => setModelSearch("")} className="text-xs text-zinc-500">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Grid de modelos */}
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin">
                    {availableModels.map((model) => (
                      <button
                        key={model}
                        onClick={() => setSelectedModel(model)}
                        className={`text-xs font-medium px-3.5 py-2 rounded-xl transition-all border ${
                          selectedModel === model
                            ? "bg-[#1D58F6] text-white border-[#1D58F6] font-semibold shadow-sm"
                            : "bg-[#F4F4F7] text-zinc-700 border-black/[0.03] hover:bg-zinc-200"
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PASO 3: SELECCIONAR TIPO DE PIEZA (VISIBLE SOLO SI HAY MODELO) */}
              {selectedModel && (
                <div className="mb-8 animate-fadeIn">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-3">
                    Paso 3 · ¿Qué pieza necesitas para {selectedModel}?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "Pantallas", label: "Pantalla", desc: "Incell, OLED u Original" },
                      { id: "Tapas Traseras", label: "Tapa Trasera", desc: "Cristal o cubierta" },
                      { id: "Puertos de Carga", label: "Pin de Carga", desc: "Flex o conector" },
                    ].map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id as any)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? "bg-[#141416] text-white border-zinc-900 shadow-md scale-[1.01]"
                              : "bg-[#F4F4F7] text-zinc-800 border-black/[0.04] hover:bg-zinc-200/60"
                          }`}
                        >
                          <p className="font-bold text-xs sm:text-sm">{cat.label}</p>
                          <p className={`text-[11px] ${isSelected ? "text-zinc-300" : "text-zinc-500"}`}>
                            {cat.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* RESULTADOS REVELADOS: SOLO APARECEN TRAS ESPECIFICAR */}
              {/* ============================================================== */}
              {selectedBrand && selectedModel && selectedCategory && (
                <div className="pt-6 border-t border-black/[0.05] animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                      Opciones disponibles para {selectedModel} ({selectedCategory})
                    </h3>
                  </div>

                  {matchingRepairs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {matchingRepairs.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-[#F4F4F7] rounded-2xl p-4 border border-black/[0.04] flex flex-col justify-between hover:border-black/20 transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-white text-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono shadow-2xs">
                                {item.quality}
                              </span>
                              <span className="text-[11px] text-zinc-500 font-medium">
                                {item.category}
                              </span>
                            </div>

                            <h4 className="font-bold text-sm text-zinc-900 mb-1">
                              {item.model}
                            </h4>
                            <p className="text-xs text-zinc-600 mb-4">
                              Calidad: <span className="font-semibold text-zinc-800">{item.quality}</span> con instalación garantizada.
                            </p>
                          </div>

                          <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between">
                            <span className="text-xl font-black text-zinc-900 tracking-tight">
                              ${item.price.toFixed(2)}
                            </span>

                            <button
                              onClick={() => addToCart({
                                id: item.id,
                                title: `${item.model} (${item.category})`,
                                subtitle: `Calidad: ${item.quality}`,
                                price: item.price
                              })}
                              className="bg-[#1D58F6] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Añadir</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-[#F4F4F7] text-center text-zinc-600 text-xs">
                      <p>Para esta combinación específica, solicita cotización directa por WhatsApp:</p>
                      <button
                        onClick={() => addToCart({
                          id: `custom-${selectedModel}-${selectedCategory}`,
                          title: `${selectedModel} (${selectedCategory})`,
                          subtitle: "Cotización personalizada",
                          price: 35.0
                        })}
                        className="mt-3 bg-zinc-900 text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir como consulta ($35 ref)</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* MENSAJE CUANDO AÚN NO SE HA COMPLETADO LA SELECCIÓN */}
              {(!selectedBrand || !selectedModel || !selectedCategory) && (
                <div className="bg-[#F4F4F7] rounded-2xl p-6 text-center text-zinc-500 text-xs mt-4">
                  <p>
                    👆 Completa los pasos superiores (Marca ➔ Modelo ➔ Pieza) para revelar los precios y agregarlos a tu carrito.
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* SECCIÓN MÓVILES EN VENTA */}
        {/* ============================================================== */}
        {activeTab === "productos" && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#1D58F6] uppercase font-bold">
                  Stock Disponible
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
                  Teléfonos de Reestreno
                </h2>
              </div>
              <span className="text-xs bg-white border border-black/[0.05] text-zinc-600 px-3 py-1 rounded-full font-medium">
                {DEVICES.length} listos para entrega
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
              {DEVICES.map((dev) => (
                <div 
                  key={dev.id}
                  className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all group"
                >
                  <div className="relative h-56 rounded-2xl bg-[#EBECEF] overflow-hidden mb-4 flex items-center justify-center">
                    <img 
                      src={dev.image} 
                      alt={dev.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-zinc-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {dev.grade}
                    </span>
                    <span className="absolute top-3 right-3 bg-zinc-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {dev.battery}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 tracking-tight">{dev.model}</h3>
                    <p className="text-xs text-zinc-500 mb-3">{dev.sub}</p>

                    <div className="flex items-center gap-1.5 mb-4">
                      <div className="flex items-center gap-1">
                        {dev.colors.map((c, idx) => (
                          <span 
                            key={idx}
                            style={{ backgroundColor: c }}
                            className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-inner"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-500 ml-auto font-medium">Garantía 6M</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[10px] text-zinc-500 block font-medium">Precio final</span>
                      <span className="text-xl font-black text-zinc-900 tracking-tight">${dev.price}</span>
                    </div>

                    <button
                      onClick={() => addToCart({
                        id: dev.id,
                        title: dev.model,
                        subtitle: `${dev.sub} · ${dev.grade}`,
                        price: dev.price
                      })}
                      className="bg-[#1D58F6] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Al Carrito</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODAL / DRAWER DEL CARRITO & RECIBO DE WHATSAPP */}
      {/* ============================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 animate-slideLeft">
            
            {/* Header del carrito */}
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#1D58F6]" />
                <h3 className="font-extrabold text-base text-zinc-900">
                  Tu Cotización ({totalCartCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4F4F7] flex items-center justify-center text-zinc-600 hover:bg-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-zinc-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold text-zinc-700">El carrito está vacío</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Selecciona una reparación o teléfono para añadirlo a tu orden.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#F4F4F7] border border-black/[0.03] flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{item.subtitle}</p>
                      <p className="text-xs font-extrabold text-[#1D58F6] mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-black/[0.05]">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-900"
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

            {/* Datos adicionales del cliente */}
            {cart.length > 0 && (
              <div className="pt-3 border-t border-black/[0.06] space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Tu Nombre (Opcional)
                  </label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Carlos Martínez"
                    className="w-full bg-[#F4F4F7] px-3.5 py-2 rounded-xl text-xs text-zinc-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Nota o detalle del fallo (Opcional)
                  </label>
                  <input 
                    type="text" 
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Ej: La pantalla no da imagen pero suena"
                    className="w-full bg-[#F4F4F7] px-3.5 py-2 rounded-xl text-xs text-zinc-900 focus:outline-none"
                  />
                </div>

                {/* Total */}
                <div className="pt-2 flex items-baseline justify-between">
                  <span className="text-xs text-zinc-500 font-bold uppercase">Total Estimado</span>
                  <span className="text-2xl font-black text-zinc-900">
                    ${totalCartPrice.toFixed(2)}
                  </span>
                </div>

                {/* Botón WhatsApp Recibo */}
                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enviar Recibo a WhatsApp</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BARRA FLOTANTE INFERIOR CON ACCESO RÁPIDO AL CARRITO */}
      {/* ============================================================== */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-zinc-900 text-white rounded-full px-5 py-3 shadow-2xl flex items-center gap-5 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("taller")}
            className={`text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "taller" ? "text-white font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Taller</span>
          </button>

          <span className="w-1 h-1 rounded-full bg-zinc-700" />

          <button
            onClick={() => setActiveTab("productos")}
            className={`text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "productos" ? "text-white font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Móviles</span>
          </button>

          <span className="w-1 h-1 rounded-full bg-zinc-700" />

          {/* Botón Carrito en la Barra Flotante */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-xs font-bold flex items-center gap-1.5 bg-[#1D58F6] text-white px-3 py-1.5 rounded-full transition-all shadow-sm"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Carrito {totalCartCount > 0 ? `(${totalCartCount})` : ""}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
