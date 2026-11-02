"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { 
  Smartphone, 
  Wrench, 
  ShieldCheck, 
  Tag, 
  Gamepad2, 
  MessageCircle, 
  BatteryCharging, 
  Sparkles, 
  ArrowUpRight, 
  Copy, 
  Check, 
  ChevronRight, 
  Zap, 
  Layers, 
  MapPin, 
  Clock, 
  ChevronDown
} from "lucide-react";
import { REPAIR_CATALOG, POPULAR_MODELS } from "@/data/repairCatalog";

// WhatsApp y redes oficiales de TecnoTrade Panamá
const WHATSAPP_NUMBER = "50768529324";
const INSTAGRAM_URL = "https://www.instagram.com/tecnotradepty/";

// Teléfonos certificados en stock
const DEVICES = [
  {
    id: 1,
    model: "iPhone 15 Pro",
    sub: "Titanio Natural",
    storages: ["128GB", "256GB"],
    battery: "99% Salud",
    grade: "Certificado A+",
    price: 790,
    regularPrice: 850,
    tag: "Destacado",
    colors: ["#9E9689", "#3C3D40", "#E3E4E5"],
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    model: "iPhone 13",
    sub: "Blanco Estrella",
    storages: ["128GB"],
    battery: "92% Salud",
    grade: "Impecable",
    price: 430,
    regularPrice: 480,
    tag: "Recomendado",
    colors: ["#F4F3ED", "#262C3A", "#DF3542"],
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    model: "Samsung S23 Ultra",
    sub: "Phantom Black",
    storages: ["256GB", "512GB"],
    battery: "95% Salud",
    grade: "Seminuevo",
    price: 640,
    regularPrice: 700,
    tag: "Pro Camera",
    colors: ["#232426", "#424D41", "#DCD4C6"],
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=700&q=80"
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"taller" | "productos">("taller");

  // Estado del Asistente Guiado
  const [selectedBrand, setSelectedBrand] = useState<"Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google">("Apple");
  const [selectedModel, setSelectedModel] = useState<string>("iPhone 13");
  const [selectedRepairType, setSelectedRepairType] = useState<"Pantallas" | "Baterías" | "Tapas Traseras">("Pantallas");
  
  // Vista catálogo completo
  const [showFullCatalog, setShowFullCatalog] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getWhatsAppLink = (message: string) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleBrandChange = (brand: "Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google") => {
    setSelectedBrand(brand);
    setSelectedModel(POPULAR_MODELS[brand][0]);
  };

  // Cotización calculada
  const currentQuote = useMemo(() => {
    const cleanModel = selectedModel.toLowerCase();
    const matches = REPAIR_CATALOG.filter((item) => {
      if (item.brand !== selectedBrand) return false;
      if (item.category !== selectedRepairType) return false;

      const parts = cleanModel.replace(/galaxy|honor|pixel|iphone|\/|\+/g, " ").trim().split(/\s+/);
      return parts.some((p) => p.length >= 2 && item.models.toLowerCase().includes(p));
    });

    return matches.length > 0 ? matches[0] : null;
  }, [selectedBrand, selectedModel, selectedRepairType]);

  const filteredFullCatalog = useMemo(() => {
    if (!catalogSearch) return REPAIR_CATALOG;
    return REPAIR_CATALOG.filter((i) => 
      (i.models + " " + i.brand + " " + i.category + " " + i.code)
        .toLowerCase()
        .includes(catalogSearch.toLowerCase())
    );
  }, [catalogSearch]);

  return (
    <div className="min-h-screen bg-[#F4F4F7] text-[#141416] pb-32 font-sans selection:bg-[#1D58F6] selection:text-white">
      
      {/* BARRA SUPERIOR DE HORARIO Y UBICACIÓN REAL DE IG */}
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

      {/* HEADER CON LOGO OFICIAL 3D DE TECNOTRADE */}
      <header className="sticky top-0 z-40 bg-[#F4F4F7]/90 backdrop-blur-md border-b border-black/[0.04]">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Logo oficial 3D Handshake */}
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
              <span className="text-[11px] text-zinc-600 block -mt-0.5 font-medium">Compra, Venta & Taller</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={getWhatsAppLink("Ey que tal TecnoTrade! Me gustaría cotizar una reparación.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1D58F6] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Escríbenos</span>
            </a>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-5 pt-8">

        {/* BIFURCADOR INSPIRADO EN EL SALUDO DE TU IG */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-zinc-700 border border-black/[0.05] text-[11px] font-semibold mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-base leading-none">🤠</span> Ey que tal? ¿Tas buscando reparar o comprar?
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-2">
            Tu smartphone en las mejores manos
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 font-normal">
            Taller especializado, repuestos certificados y compras seguras en Ciudad de Panamá.
          </p>

          {/* TARJETAS DE DECISIÓN (CON EL AZUL REAL DE TECNOTRADE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-left">
            
            {/* Opción 1: Taller */}
            <button
              onClick={() => setActiveTab("taller")}
              className={`p-6 rounded-[2rem] transition-all relative overflow-hidden flex flex-col justify-between group text-left border ${
                activeTab === "taller"
                  ? "bg-[#141416] text-white border-zinc-900 shadow-xl scale-[1.01]"
                  : "bg-white text-zinc-900 border-black/[0.06] hover:border-black/20 shadow-sm"
              }`}
            >
              <div>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${
                  activeTab === "taller" ? "bg-[#1D58F6] text-white" : "bg-[#F4F4F7] text-zinc-800"
                }`}>
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">Quiero Reparar</h3>
                  {activeTab === "taller" && (
                    <span className="w-2 h-2 rounded-full bg-[#1D58F6] animate-pulse" />
                  )}
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${
                  activeTab === "taller" ? "text-zinc-300" : "text-zinc-500"
                }`}>
                  Pantallas, tapas traseras y baterías con cupón de descuento en taller.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-semibold pt-4 border-t border-current/10">
                <span className="text-[#1D58F6] font-bold">Cotizador en 3 toques</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Opción 2: Comprar */}
            <button
              onClick={() => setActiveTab("productos")}
              className={`p-6 rounded-[2rem] transition-all relative overflow-hidden flex flex-col justify-between group text-left border ${
                activeTab === "productos"
                  ? "bg-[#141416] text-white border-zinc-900 shadow-xl scale-[1.01]"
                  : "bg-white text-zinc-900 border-black/[0.06] hover:border-black/20 shadow-sm"
              }`}
            >
              <div>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${
                  activeTab === "productos" ? "bg-[#1D58F6] text-white" : "bg-[#F4F4F7] text-zinc-800"
                }`}>
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">Quiero Comprar</h3>
                  {activeTab === "productos" && (
                    <span className="w-2 h-2 rounded-full bg-[#1D58F6] animate-pulse" />
                  )}
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${
                  activeTab === "productos" ? "text-zinc-300" : "text-zinc-500"
                }`}>
                  Dispositivos de reestreno garantizados, revisados y listos para usar.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-semibold pt-4 border-t border-current/10">
                <span className="text-[#1D58F6] font-bold">Ver stock disponible</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* ASISTENTE DE REPARACIÓN GUIADO */}
        {activeTab === "taller" && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-9 shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-black/[0.04]">
              
              <div className="flex items-center justify-between pb-6 border-b border-black/[0.05] mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#1D58F6] uppercase font-bold">
                    Cotizador TecnoTrade
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
                    Elige tu modelo y obtén tu cupón
                  </h2>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-600 font-medium bg-[#F4F4F7] px-3.5 py-1.5 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Garantía en taller</span>
                </div>
              </div>

              {/* PASO 1: MARCAS */}
              <div className="mb-8">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-3">
                  Paso 1 · Selecciona la Marca
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(["Apple", "Samsung", "Honor", "Xiaomi", "Google"] as const).map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleBrandChange(brand)}
                      className={`py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 border ${
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

              {/* PASO 2: MODELOS */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
                    Paso 2 · Selecciona tu Modelo de {selectedBrand}
                  </label>
                  <span className="text-[11px] text-zinc-600">
                    {POPULAR_MODELS[selectedBrand].length} modelos
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin">
                  {POPULAR_MODELS[selectedBrand].map((model) => (
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

              {/* PASO 3: REPARACIÓN */}
              <div className="mb-8">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-3">
                  Paso 3 · ¿Qué necesitas reparar?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "Pantallas", label: "Pantalla", icon: Layers, desc: "OLED / Incell Calibrada" },
                    { id: "Baterías", label: "Batería", icon: BatteryCharging, desc: "Original 0 ciclos" },
                    { id: "Tapas Traseras", label: "Tapa Trasera", icon: Smartphone, desc: "Cristal o policarbonato" },
                  ].map((rep) => {
                    const Icon = rep.icon;
                    const isSelected = selectedRepairType === rep.id;
                    return (
                      <button
                        key={rep.id}
                        onClick={() => setSelectedRepairType(rep.id as any)}
                        className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? "bg-[#141416] text-white border-zinc-900 shadow-md scale-[1.01]"
                            : "bg-[#F4F4F7] text-zinc-800 border-black/[0.04] hover:bg-zinc-200/60"
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${
                          isSelected ? "bg-[#1D58F6] text-white" : "bg-white text-zinc-700"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm">{rep.label}</p>
                          <p className={`text-[11px] ${isSelected ? "text-zinc-300" : "text-zinc-500"}`}>
                            {rep.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RESULTADO: TARJETA DE COTIZACIÓN */}
              {currentQuote ? (
                <div className="bg-[#141416] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#1D58F6] text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                        {currentQuote.quality}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        {currentQuote.category} para {selectedBrand}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      {selectedModel}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                      Modelos de referencia técnica: {currentQuote.models}
                    </p>

                    <div className="flex items-baseline gap-3 mt-4">
                      <span className="text-3xl font-black text-white tracking-tight">
                        ${currentQuote.promoPrice}
                      </span>
                      <span className="text-sm text-zinc-400 line-through">
                        ${currentQuote.regularPrice}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                        Ahorras ${currentQuote.regularPrice - currentQuote.promoPrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 sm:items-end justify-center shrink-0">
                    <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10">
                      <span className="font-mono text-[#1D58F6] text-xs font-bold px-2.5">
                        {currentQuote.code}
                      </span>
                      <button
                        onClick={() => copyCoupon(currentQuote.code)}
                        className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1"
                      >
                        {copiedCode === currentQuote.code ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copiar
                          </>
                        )}
                      </button>
                    </div>

                    <a
                      href={getWhatsAppLink(
                        `Ey TecnoTrade! Quiero canjear el cupón *${currentQuote.code}* para *${currentQuote.category}* de *${selectedModel}* (Calidad: ${currentQuote.quality}) por *$${currentQuote.promoPrice}* (Precio regular: $${currentQuote.regularPrice}).`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Agendar con este precio</span>
                    </a>
                  </div>

                </div>
              ) : (
                <div className="bg-[#F4F4F7] rounded-2xl p-6 text-center text-zinc-600 text-xs">
                  <p>¿No ves tu modelo exacto? Escríbenos y te damos cotización en el momento:</p>
                  <a
                    href={getWhatsAppLink(`Ey TecnoTrade! Quisiera presupuesto para ${selectedRepairType} de ${selectedModel}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#1D58F6] underline"
                  >
                    Consultar por WhatsApp <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

            </div>

            {/* BOTÓN COLAPSABLE CATÁLOGO COMPLETO */}
            <div className="text-center pt-2">
              <button
                onClick={() => setShowFullCatalog(!showFullCatalog)}
                className="text-xs font-bold text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1.5 py-2 px-4 rounded-full bg-white border border-black/[0.05] transition-all shadow-sm"
              >
                <span>{showFullCatalog ? "Ocultar catálogo completo" : "O si prefieres, ver catálogo completo (41 opciones)"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFullCatalog ? "rotate-180" : ""}`} />
              </button>
            </div>

            {showFullCatalog && (
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/[0.04] animate-fadeIn">
                <div className="mb-4">
                  <input 
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Filtrar por modelo o código..."
                    className="w-full bg-[#F4F4F7] px-4 py-2.5 rounded-xl text-xs text-zinc-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {filteredFullCatalog.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-[#F4F4F7] border border-black/[0.03] text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-zinc-900 block">{item.brand} {item.category}</span>
                        <span className="text-zinc-500 text-[11px] block">{item.models}</span>
                        <span className="text-emerald-700 font-bold font-mono text-[11px]">${item.promoPrice} (Cupón: {item.code})</span>
                      </div>
                      <a
                        href={getWhatsAppLink(`Ey TecnoTrade! Quiero canjear el cupón *${item.code}* para *${item.category}* de *${item.models}* por *$${item.promoPrice}*.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-zinc-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg font-semibold"
                      >
                        Canjear
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* SECCIÓN MÓVILES EN VENTA */}
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
                      <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider mr-1">Cap:</span>
                      {dev.storages.map((cap, i) => (
                        <span 
                          key={i} 
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            i === 0 
                              ? "bg-zinc-900 text-white" 
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {cap}
                        </span>
                      ))}

                      <div className="ml-auto flex items-center gap-1">
                        {dev.colors.map((c, idx) => (
                          <span 
                            key={idx}
                            style={{ backgroundColor: c }}
                            className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-inner"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[10px] text-zinc-500 block font-medium">Garantía 6 Meses</span>
                      <span className="text-xl font-black text-zinc-900 tracking-tight">${dev.price}</span>
                    </div>

                    <a
                      href={getWhatsAppLink(`Ey TecnoTrade, me interesa el ${dev.model} (${dev.sub}) de $${dev.price}. ¿Sigue disponible?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1D58F6] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Reservar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* BARRA FLOTANTE INFERIOR PERMANENTE */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-zinc-900 text-white rounded-full px-5 py-3 shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-md">
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

          <a
            href={getWhatsAppLink("Ey que tal TecnoTrade! Me gustaría consultar un presupuesto.")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

    </div>
  );
}
