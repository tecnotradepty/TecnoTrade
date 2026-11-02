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
  ChevronRight
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
    grade: "Certificado A+",
    price: 790,
    tag: "Titanium",
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

    let message = `🧾 *COTIZACIÓN · TECNOTRADE PTY*\n`;
    message += `──────────────────────\n`;
    if (customerName.trim()) {
      message += `Cliente: ${customerName.trim()}\n`;
    }
    message += `Fecha: ${new Date().toLocaleDateString("es-PA")}\n\n`;
    message += `*SERVICIOS SELECCIONADOS:*\n`;

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
    message += `📍 Calle Ricardo Arias, Iglesia del Carmen\n`;
    message += `🕒 Horario: 10 AM - 7 PM\n\n`;
    message += `Hola TecnoTrade, me gustaría agendar cita para este pedido.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] pb-36 font-sans selection:bg-[#111111] selection:text-white">
      
      {/* HEADER MINIMALISTA ELEGANTE */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-black/[0.04]">
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

          {/* BOTÓN CARRITO */}
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

      {/* AVISO DE ELEMENTO AÑADIDO */}
      {addedItemNotification && (
        <div className="fixed top-22 right-6 z-50 bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-slideDown">
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

      {/* CONTENIDO PRINCIPAL CON AMPLIO ESPACIO BLANCO (THE REIGN OF WHITE SPACE) */}
      <main className="max-w-5xl mx-auto px-6 pt-16 md:pt-20">

        {/* HERO EDITORIAL MINIMALISTA */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs text-zinc-600 uppercase tracking-widest font-semibold block mb-4">
            Calle Ricardo Arias · Panamá
          </span>

          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-zinc-900 mb-6 leading-[1.08]">
            Reparación honesta. <br />
            <span className="font-semibold text-zinc-950">Móviles certificados.</span>
          </h1>

          <p className="text-base text-zinc-600 font-normal leading-relaxed mb-8">
            Consulta los precios transparentes de nuestro taller o explora los dispositivos en stock listos para entrega inmediata con garantía.
          </p>

          {/* SELECTOR DE VISTA MINIMALISTA */}
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
              Dispositivos en Venta ({DEVICES.length})
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TALLER // SELECTOR GUIADO MINIMALISTA */}
        {/* ============================================================== */}
        {activeTab === "taller" && (
          <div className="space-y-12 animate-fadeIn mb-24">
            
            <div className="bg-[#FAF9F8] rounded-[2.5rem] p-8 sm:p-12 border border-black/[0.04]">
              
              <div className="flex items-baseline justify-between pb-6 border-b border-black/[0.06] mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                    Cotizador de Taller
                  </h2>
                  <p className="text-xs text-zinc-600 mt-1">
                    Selecciona tu equipo para ver el costo exacto con instalación
                  </p>
                </div>

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
                    <span>Limpiar selección</span>
                  </button>
                )}
              </div>

              {/* PASO 1: MARCAS */}
              <div className="mb-10">
                <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block mb-4">
                  1. Marca del dispositivo
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {(["Apple", "Samsung", "Honor", "Xiaomi", "Google"] as const).map((brand) => (
                    <button
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setSelectedModel(null);
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
                <div className="mb-10 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                      2. Modelo de {selectedBrand}
                    </span>
                    <span className="text-xs text-zinc-600">
                      {availableModels.length} opciones
                    </span>
                  </div>

                  {/* Buscador de modelo */}
                  <div className="mb-4">
                    <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-black/[0.06] shadow-2xs">
                      <Search className="w-4 h-4 text-zinc-600" />
                      <input 
                        type="text"
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        placeholder={`Buscar modelo (ej: 13, Ultra, Note, Pro)...`}
                        className="w-full bg-transparent text-xs text-zinc-900 focus:outline-none"
                      />
                      {modelSearch && (
                        <button onClick={() => setModelSearch("")} className="text-xs text-zinc-600">
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
                        onClick={() => setSelectedModel(model)}
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
                <div className="mb-10 animate-fadeIn">
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

              {/* RESULTADOS REVELADOS */}
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
                        onClick={() => addToCart({
                          id: `custom-${selectedModel}-${selectedCategory}`,
                          title: `${selectedModel} (${selectedCategory})`,
                          subtitle: "Cotización personalizada bajo pedido",
                          price: 35.0
                        })}
                        className="mt-4 bg-zinc-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir como consulta ($35.00 ref)</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* AVISO DE SELECCIÓN INCOMPLETA */}
              {(!selectedBrand || !selectedModel || !selectedCategory) && (
                <div className="bg-white/80 rounded-2xl p-6 text-center text-zinc-600 text-xs mt-4 border border-black/[0.03]">
                  <p>
                    Completa los 3 pasos anteriores para ver los precios y añadirlos a tu carrito.
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* DISPOSITIVOS EN VENTA (SHOWROOM MINIMALISTA) */}
        {/* ============================================================== */}
        {activeTab === "productos" && (
          <div className="animate-fadeIn mb-24">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-900">
                  Dispositivos de Reestreno
                </h2>
                <p className="text-xs text-zinc-600 mt-1">
                  Equipos garantizados, probados minuciosamente en taller
                </p>
              </div>
              <span className="text-xs bg-zinc-100 text-zinc-700 px-3.5 py-1.5 rounded-full font-medium">
                {DEVICES.length} disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {DEVICES.map((dev) => (
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
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODAL / DRAWER DEL CARRITO & RECIBO DE WHATSAPP */}
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
                    placeholder="Ej: David Arias"
                    className="w-full bg-[#FAF9F8] px-4 py-2.5 rounded-xl text-xs text-zinc-900 focus:outline-none border border-black/[0.04]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-600 block mb-1">
                    Detalle del problema (opcional)
                  </label>
                  <input 
                    type="text" 
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Ej: La pantalla parpadea en verde"
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
      {/* BARRA FLOTANTE INFERIOR MINIMALISTA */}
      {/* ============================================================== */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-zinc-900 text-white rounded-full px-5 py-3 shadow-2xl flex items-center gap-5 border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("taller")}
            className={`text-xs flex items-center gap-1.5 transition-all ${
              activeTab === "taller" ? "text-white font-semibold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Taller</span>
          </button>

          <span className="w-1 h-1 rounded-full bg-zinc-700" />

          <button
            onClick={() => setActiveTab("productos")}
            className={`text-xs flex items-center gap-1.5 transition-all ${
              activeTab === "productos" ? "text-white font-semibold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Móviles</span>
          </button>

          <span className="w-1 h-1 rounded-full bg-zinc-700" />

          <button
            onClick={() => setIsCartOpen(true)}
            className="text-xs font-semibold flex items-center gap-1.5 bg-white text-zinc-900 px-3.5 py-1.5 rounded-full transition-all shadow-sm hover:bg-zinc-100"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-zinc-900" />
            <span>Carrito {totalCartCount > 0 ? `(${totalCartCount})` : ""}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
