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
  RotateCcw,
  Cpu,
  Activity,
  Zap,
  Terminal,
  Compass
} from "lucide-react";
import { REPAIR_CATALOG, POPULAR_MODELS, RepairItem } from "@/data/repairCatalog";

// Datos oficiales de TecnoTrade PTY
const WHATSAPP_NUMBER = "50768529324";
const INSTAGRAM_URL = "https://www.instagram.com/tecnotradepty/";

// Teléfonos certificados de reestreno
const DEVICES = [
  {
    id: "dev-ip15p",
    model: "iPhone 15 Pro",
    sub: "Titanio Natural · 128 GB",
    battery: "99% Salud",
    grade: "Certificado Grado A+",
    price: 790,
    tag: "Titanium Series",
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
    tag: "Core Lineup",
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
    tag: "Pro Studio",
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

  // Estado del flujo guiado (oculto hasta especificar)
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

  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    const list = POPULAR_MODELS[selectedBrand] || [];
    if (!modelSearch) return list;
    return list.filter((m) => m.toLowerCase().includes(modelSearch.toLowerCase()));
  }, [selectedBrand, modelSearch]);

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

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    let message = `🧾 *MANIFIESTO DE ORDEN // TECNOTRADE CORP*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    if (customerName.trim()) {
      message += `👤 *Cliente:* ${customerName.trim()}\n`;
    }
    message += `📅 *Registro:* ${new Date().toLocaleDateString("es-PA")} · Ciudad de Panamá\n\n`;
    message += `🔬 *MÓDULOS DE SERVICIO SOLICITADOS:*\n`;

    cart.forEach((item, index) => {
      message += `[${index + 1}] *${item.title}*\n`;
      message += `    ↳ ${item.subtitle} | Cant: ${item.quantity} × $${item.price.toFixed(2)} = *$${(item.price * item.quantity).toFixed(2)}*\n`;
    });

    message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL FINAL ESTIMADO: $${totalCartPrice.toFixed(2)} USD*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    if (customerNote.trim()) {
      message += `📝 *Observaciones:* ${customerNote.trim()}\n`;
    }
    message += `📍 *Laboratorio:* Calle Ricardo Arias, Iglesia del Carmen\n`;
    message += `🕒 *Operación:* 10:00 - 19:00\n\n`;
    message += `Hola TecnoTrade, me gustaría agendar la cita para el ingreso de este equipo.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#0B0C0E] pb-36 font-sans relative selection:bg-[#1D58F6] selection:text-white bg-corporate-grid">
      
      {/* GLOW ATMOSFÉRICO CORPORATIVO (Luz cerámico-azul ultra sutil) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-[#1D58F6]/[0.035] via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />

      {/* TOP STATUS BAR ESTILO BLACK MIRROR // LAB CORPORATIVO */}
      <div className="bg-[#FFFFFF]/80 backdrop-blur-md border-b border-black/[0.04] text-[10px] font-mono tracking-wider py-2 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-zinc-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM PROTOCOL // ONLINE
            </span>
            <span className="hidden md:flex items-center gap-1 text-zinc-400">
              <Clock className="w-3 h-3 text-[#1D58F6]" /> 10:00 - 19:00 EST
            </span>
            <span className="hidden md:flex items-center gap-1 text-zinc-400">
              <MapPin className="w-3 h-3 text-[#1D58F6]" /> PANAMA CITY · CALLE RICARDO ARIAS
            </span>
          </div>

          <a 
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-black transition-colors flex items-center gap-1.5 font-bold uppercase tracking-widest text-[9px]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D58F6]" />
            @tecnotradepty
          </a>
        </div>
      </div>

      {/* HEADER MONOLÍTICO DE CRISTAL CERÁMICO (ESTILO MACSTORE / APPLE PARK) */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/75 backdrop-blur-2xl border-b border-black/[0.05]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white shadow-sm border border-black/[0.06] flex items-center justify-center p-0.5">
              <img 
                src="/logo.jpg" 
                alt="TecnoTrade Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-zinc-950 uppercase font-mono">
                  TecnoTrade
                </span>
                <span className="text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded bg-black text-white">
                  CORP
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 block font-mono -mt-0.5 tracking-wider">
                SURGICAL RESTORATION & HARDWARE
              </span>
            </div>
          </div>

          {/* BOTÓN DEL CARRITO MINIMALISTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-zinc-950 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-2.5 relative group"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#1D58F6] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-mono tracking-wider">ORDEN</span>
              {totalCartCount > 0 && (
                <span className="bg-[#1D58F6] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center font-mono">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* AVISO FLOTANTE DE ITEM AÑADIDO (CLINICAL NOTIFICATION) */}
      {addedItemNotification && (
        <div className="fixed top-20 right-6 z-50 ceramic-card px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideDown border border-[#1D58F6]/20">
          <div className="w-2 h-2 rounded-full bg-[#1D58F6] animate-ping" />
          <div className="text-xs">
            <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">INGRESADO A LA ORDEN</p>
            <p className="font-bold text-zinc-900">{addedItemNotification}</p>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-[11px] text-[#1D58F6] font-mono font-bold hover:underline ml-2"
          >
            VER
          </button>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-6 pt-12">

        {/* HERO EDITORIAL // BLACK MIRROR CLEAN MONOLITH */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/[0.06] text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-6 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D58F6]" />
            ESTÁNDAR DE PRECISIÓN · CIUDAD DE PANAMÁ
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 mb-4 leading-[1.06]">
            Restauración de precisión. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-400 font-light">
              Ingeniería limpia para tu smartphone.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-500 max-w-xl font-normal leading-relaxed">
            Diagnóstico quirúrgico, módulos certificados y dispositivos de reestreno bajo 30 puntos de inspección técnica en Calle Ricardo Arias.
          </p>

          {/* BIFURCADOR MONOLÍTICO DE ARQUITECTURA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            
            {/* Opción 1: Taller Quirúrgico */}
            <button
              onClick={() => setActiveTab("taller")}
              className={`p-6 rounded-[2rem] transition-all text-left relative overflow-hidden border ${
                activeTab === "taller"
                  ? "bg-white border-black/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.06)] scale-[1.01]"
                  : "bg-white/50 border-black/[0.04] hover:bg-white text-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
                  MÓDULO 01
                </span>
                {activeTab === "taller" && (
                  <span className="w-2 h-2 rounded-full bg-[#1D58F6]" />
                )}
              </div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
                Taller de Precisión
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Pantallas calibradas, tapas traseras de cristal y pines de carga.
              </p>
              <div className="mt-5 text-[11px] font-mono text-[#1D58F6] font-bold flex items-center gap-1">
                <span>CONFIGURAR SERVICIO</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Opción 2: Vault de Hardware */}
            <button
              onClick={() => setActiveTab("productos")}
              className={`p-6 rounded-[2rem] transition-all text-left relative overflow-hidden border ${
                activeTab === "productos"
                  ? "bg-white border-black/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.06)] scale-[1.01]"
                  : "bg-white/50 border-black/[0.04] hover:bg-white text-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
                  MÓDULO 02
                </span>
                {activeTab === "productos" && (
                  <span className="w-2 h-2 rounded-full bg-[#1D58F6]" />
                )}
              </div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
                Dispositivos Certificados
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Hardware de reestreno inspeccionado, con garantía real por escrito.
              </p>
              <div className="mt-5 text-[11px] font-mono text-[#1D58F6] font-bold flex items-center gap-1">
                <span>EXPLORAR STOCK</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CONSOLA DE DIAGNÓSTICO // TALLER QUIRÚRGICO (RESULTADOS OCULTOS) */}
        {/* ============================================================== */}
        {activeTab === "taller" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="ceramic-card rounded-[2.5rem] p-6 sm:p-10">
              
              <div className="flex items-center justify-between pb-6 border-b border-black/[0.05] mb-8">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#1D58F6] uppercase font-bold block mb-1">
                    CONSOLA DE SERVICIO // CONFIGURADOR
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
                    Especifica la arquitectura del dispositivo
                  </h3>
                </div>

                {(selectedBrand || selectedModel || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSelectedBrand(null);
                      setSelectedModel(null);
                      setSelectedCategory(null);
                      setModelSearch("");
                    }}
                    className="text-[11px] font-mono text-zinc-400 hover:text-black flex items-center gap-1.5 transition-colors uppercase"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>REINICIAR</span>
                  </button>
                )}
              </div>

              {/* PASO 1: SELECCIONAR ARQUITECTURA (MARCA) */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    01 // SELECCIONA EL FABRICANTE
                  </span>
                  {selectedBrand && (
                    <span className="text-[10px] font-mono text-[#1D58F6] font-bold uppercase">
                      ✓ SELECCIONADO: {selectedBrand}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(["Apple", "Samsung", "Honor", "Xiaomi", "Google"] as const).map((brand) => (
                    <button
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setSelectedModel(null);
                        setModelSearch("");
                      }}
                      className={`py-4 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all border text-center flex flex-col items-center justify-center gap-1 ${
                        selectedBrand === brand
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-md scale-[1.02]"
                          : "bg-white/80 text-zinc-800 border-black/[0.05] hover:bg-white hover:border-black/20"
                      }`}
                    >
                      <span>{brand}</span>
                      <span className={`text-[9px] font-mono ${selectedBrand === brand ? "text-zinc-400" : "text-zinc-400"}`}>
                        {brand === "Apple" ? "iOS Platform" : "Android OEM"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PASO 2: SELECCIONAR MODELO INDIVIDUAL */}
              {selectedBrand && (
                <div className="mb-10 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      02 // IDENTIFICA EL MODELO ({selectedBrand})
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {availableModels.length} MODELOS EN ARCHIVO
                    </span>
                  </div>

                  {/* Buscador ultra limpio */}
                  <div className="mb-3">
                    <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-black/[0.06] shadow-2xs">
                      <Search className="w-4 h-4 text-zinc-400" />
                      <input 
                        type="text"
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        placeholder={`Filtrar modelo (ej: 13 Pro, S24, Note 13, Magic)...`}
                        className="w-full bg-transparent text-xs text-zinc-950 focus:outline-none font-mono"
                      />
                      {modelSearch && (
                        <button onClick={() => setModelSearch("")} className="text-xs text-zinc-400 hover:text-black">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Grid de modelos estilo chips técnicos */}
                  <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto p-1 scrollbar-thin">
                    {availableModels.map((model) => (
                      <button
                        key={model}
                        onClick={() => setSelectedModel(model)}
                        className={`text-xs font-medium px-3.5 py-2.5 rounded-xl transition-all border ${
                          selectedModel === model
                            ? "bg-[#1D58F6] text-white border-[#1D58F6] font-semibold shadow-sm scale-102"
                            : "bg-white text-zinc-700 border-black/[0.05] hover:border-black/20"
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PASO 3: SELECCIONAR MÓDULO DE PIEZA */}
              {selectedModel && (
                <div className="mb-10 animate-fadeIn">
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-4">
                    03 // MÓDULO TÉCNICO A REEMPLAZAR
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "Pantallas", title: "Óptica & Pantalla", desc: "Display OLED / Incell de alta resolución" },
                      { id: "Tapas Traseras", title: "Chasis & Tapa Trasera", desc: "Cristal templado o aleación de cuerpo" },
                      { id: "Puertos de Carga", title: "Circuito de Carga", desc: "Flex USB-C / Lightning & micrófono" },
                    ].map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id as any)}
                          className={`p-5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? "bg-zinc-950 text-white border-zinc-950 shadow-md scale-[1.01]"
                              : "bg-white text-zinc-800 border-black/[0.05] hover:border-black/20"
                          }`}
                        >
                          <p className="font-bold text-xs sm:text-sm">{cat.title}</p>
                          <p className={`text-[11px] mt-1 ${isSelected ? "text-zinc-400" : "text-zinc-500"}`}>
                            {cat.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* RESULTADOS REVELADOS // MÓDULOS DE PRECISIÓN EN CERÁMICA */}
              {/* ============================================================== */}
              {selectedBrand && selectedModel && selectedCategory && (
                <div className="pt-8 border-t border-black/[0.06] animate-fadeIn">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-[#1D58F6] uppercase font-bold">
                        COTIZACIÓN CERTIFICADA
                      </span>
                      <h4 className="text-base font-bold text-zinc-950 mt-0.5">
                        {selectedModel} · {selectedCategory}
                      </h4>
                    </div>
                  </div>

                  {matchingRepairs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {matchingRepairs.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm flex flex-col justify-between ceramic-card-hover"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="bg-zinc-100 text-zinc-900 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase">
                                {item.quality}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-400">
                                GARANTÍA 180D
                              </span>
                            </div>

                            <h5 className="font-bold text-sm text-zinc-950 mb-1">
                              {item.model}
                            </h5>
                            <p className="text-xs text-zinc-500 mb-4 font-normal">
                              Módulo certificado con calibración de color y sellado estanco en taller.
                            </p>
                          </div>

                          <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between">
                            <div>
                              <span className="text-[9px] font-mono text-zinc-400 uppercase block">Inversión Final</span>
                              <span className="text-2xl font-black text-zinc-950 tracking-tight font-mono">
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
                              className="bg-zinc-950 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm group"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#1D58F6] group-hover:rotate-90 transition-transform" />
                              <span>Añadir</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-white border border-black/[0.06] text-center text-zinc-500 text-xs">
                      <p>Para este modelo particular contamos con stock bajo pedido especial.</p>
                      <button
                        onClick={() => addToCart({
                          id: `custom-${selectedModel}-${selectedCategory}`,
                          title: `${selectedModel} (${selectedCategory})`,
                          subtitle: "Cotización personalizada bajo pedido",
                          price: 35.0
                        })}
                        className="mt-4 bg-zinc-950 text-white text-xs font-mono font-bold px-4 py-2 rounded-full inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#1D58F6]" />
                        <span>Añadir a la orden ($35.00 ref)</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* RECORDATORIO SI ESTÁ INCOMPLETO */}
              {(!selectedBrand || !selectedModel || !selectedCategory) && (
                <div className="bg-white/60 rounded-2xl p-6 text-center text-zinc-400 text-xs mt-4 border border-black/[0.03]">
                  <p className="font-mono">
                    [ SE REQUIERE COMPLETAR LOS 3 PASOS SUPERIORES PARA DESPLEGAR VALORES ]
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* SHOWROOM // HARDWARE CERTIFICADO DE REESTRENO */}
        {/* ============================================================== */}
        {activeTab === "productos" && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#1D58F6] uppercase font-bold">
                  VAULT DE DISPOSITIVOS // STOCK INMEDIATO
                </span>
                <h3 className="text-2xl font-extrabold text-zinc-950 mt-1">
                  Hardware Certificado
                </h3>
              </div>
              <span className="text-xs bg-white border border-black/[0.06] text-zinc-600 px-3.5 py-1.5 rounded-full font-mono text-[11px]">
                {DEVICES.length} UNIDADES ACTIVAS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
              {DEVICES.map((dev) => (
                <div 
                  key={dev.id}
                  className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/[0.06] flex flex-col justify-between ceramic-card-hover group"
                >
                  <div className="relative h-60 rounded-2xl bg-[#EBECEF]/60 overflow-hidden mb-5 flex items-center justify-center border border-black/[0.02]">
                    <img 
                      src={dev.image} 
                      alt={dev.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-zinc-950 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-2xs">
                      {dev.grade}
                    </span>
                    <span className="absolute top-3.5 right-3.5 bg-zinc-950 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                      {dev.battery}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-zinc-950 tracking-tight">{dev.model}</h4>
                    <p className="text-xs text-zinc-500 mb-4">{dev.sub}</p>

                    <div className="flex items-center gap-1.5 mb-5">
                      <div className="flex items-center gap-1">
                        {dev.colors.map((c, idx) => (
                          <span 
                            key={idx}
                            style={{ backgroundColor: c }}
                            className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-inner"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 ml-auto uppercase">GARANTÍA 6M</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-400 block uppercase">Inversión</span>
                      <span className="text-2xl font-black text-zinc-950 tracking-tight font-mono">${dev.price}</span>
                    </div>

                    <button
                      onClick={() => addToCart({
                        id: dev.id,
                        title: dev.model,
                        subtitle: `${dev.sub} · ${dev.grade}`,
                        price: dev.price
                      })}
                      className="bg-zinc-950 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm group"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#1D58F6]" />
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
      {/* MANIFIESTO DE ORDEN // MODAL DRAWER CORPORATIVO */}
      {/* ============================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 animate-slideLeft border-l border-black/[0.08]">
            
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-mono text-xs">
                  TT
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-950 uppercase font-mono tracking-wider">
                    Manifiesto de Orden
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {totalCartCount} MÓDULOS REGISTRADOS
                  </span>
                </div>
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
                <div className="text-center py-20 text-zinc-400">
                  <Terminal className="w-10 h-10 mx-auto mb-3 opacity-30 text-zinc-400" />
                  <p className="text-xs font-mono font-bold text-zinc-700 uppercase">SIN ITEMS ACTIVOS</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                    Selecciona una reparación en la consola o un dispositivo del vault.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#F8F9FB] border border-black/[0.04] flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-950 truncate">{item.title}</p>
                      <p className="text-[11px] text-zinc-500 truncate font-mono mt-0.5">{item.subtitle}</p>
                      <p className="text-xs font-black text-[#1D58F6] font-mono mt-1.5">
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
                      <span className="text-xs font-mono font-bold px-1">{item.quantity}</span>
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

            {/* Inputs & Transmisión */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-black/[0.06] space-y-3">
                <div>
                  <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                    CLIENTE / TITULAR (OPCIONAL)
                  </label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: David Arias"
                    className="w-full bg-[#F8F9FB] px-3.5 py-2.5 rounded-xl text-xs text-zinc-950 focus:outline-none border border-black/[0.04]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                    DETALLES ADICIONALES DEL DISPOSITIVO
                  </label>
                  <input 
                    type="text" 
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Ej: Pantalla parpadea en color verde"
                    className="w-full bg-[#F8F9FB] px-3.5 py-2.5 rounded-xl text-xs text-zinc-950 focus:outline-none border border-black/[0.04]"
                  />
                </div>

                <div className="pt-2 flex items-baseline justify-between border-t border-black/[0.04]">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Total Estimado</span>
                  <span className="text-2xl font-black text-zinc-950 font-mono tracking-tight">
                    ${totalCartPrice.toFixed(2)} USD
                  </span>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 font-mono uppercase tracking-wider"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Transmitir Manifiesto a WhatsApp</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BARRA FLOTANTE MONOLÍTICA INFERIOR */}
      {/* ============================================================== */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-zinc-950 text-white rounded-full px-5 py-3 shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-2xl">
          <button
            onClick={() => setActiveTab("taller")}
            className={`text-xs font-mono tracking-wider flex items-center gap-2 transition-all ${
              activeTab === "taller" ? "text-white font-bold" : "text-zinc-500 hover:text-white"
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-[#1D58F6]" />
            <span>TALLER</span>
          </button>

          <span className="w-1 h-1 rounded-full bg-zinc-800" />

          <button
            onClick={() => setActiveTab("productos")}
            className={`text-xs font-mono tracking-wider flex items-center gap-2 transition-all ${
              activeTab === "productos" ? "text-white font-bold" : "text-zinc-500 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#1D58F6]" />
            <span>HARDWARE</span>
          </button>

          <span className="w-1 h-1 rounded-full bg-zinc-800" />

          <button
            onClick={() => setIsCartOpen(true)}
            className="text-xs font-mono font-bold flex items-center gap-1.5 bg-[#1D58F6] text-white px-3.5 py-1.5 rounded-full transition-all shadow-sm hover:bg-blue-600"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>ORDEN {totalCartCount > 0 ? `(${totalCartCount})` : ""}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
