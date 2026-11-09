"use client";

import { useState } from "react";
import { 
  Smartphone, 
  Battery, 
  HardDrive, 
  Radio, 
  Wrench, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  ArrowRight,
  RotateCcw,
  BadgeDollarSign,
  Layers,
  Sparkles
} from "lucide-react";

interface SellPhoneSectionProps {
  whatsappNumber: string;
}

// Icono Oficial Vectorial de Apple
function AppleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 170" fill="currentColor" className={className} aria-label="Apple">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.07-7.66-7.85-11.88-14.34-5.9-8.8-10.42-18.77-13.56-29.9-3.14-11.13-4.71-21.73-4.71-31.8 0-14.67 3.84-26.4 11.53-35.18 7.68-8.78 17.18-13.23 28.5-13.35 4.9 0 10.37 1.25 16.42 3.75 6.04 2.5 10.15 3.8 12.33 3.9 1.83 0 6.08-1.35 12.74-4.05 6.67-2.7 12.18-3.9 16.54-3.6 12.63.8 22.82 5.57 30.56 14.32-11.05 6.7-16.49 15.82-16.32 27.35.17 9.17 3.71 16.92 10.63 23.25 6.92 6.33 15.02 9.87 24.3 10.62-2.11 6.57-4.72 13.24-7.84 20.02zM119.22 31.84c0-7.35 2.65-14.28 7.95-20.78 5.3-6.5 11.83-10.45 19.59-11.86.3 1.2.45 2.37.45 3.52 0 7.37-2.8 14.39-8.4 21.05-5.6 6.66-12.24 10.49-19.92 11.49-.1-.95-.17-1.89-.17-2.82z"/>
    </svg>
  );
}

// Icono Oficial Vectorial de Android
function AndroidIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Android">
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4111 13.8533 8.0833 12 8.0833s-3.5902.3278-5.1369.8664L4.8408 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/>
    </svg>
  );
}

const STORAGE_OPTIONS = [
  "128 GB",
  "256 GB",
  "512 GB",
  "1 TB",
  "64 GB",
  "Otro"
];

const SIM_OPTIONS = [
  { label: "Chip Físico (Nano SIM)", desc: "Ranura SIM tradicional" },
  { label: "Solo eSIM (Digital)", desc: "Sin ranura física (modelos americanos)" },
  { label: "Ambos (eSIM + Chip Físico)", desc: "Dual SIM" }
];

const CONDITION_SCALE = [
  { level: "5", title: "5 / 5 — Impecable", desc: "Como nuevo, sin detalles, pantalla y marco 10/10" },
  { level: "4", title: "4 / 5 — Excelente", desc: "Marcas mínimas casi imperceptibles por uso de funda" },
  { level: "3", title: "3 / 5 — Buen estado", desc: "Rayoncitos leves normales del uso diario" },
  { level: "2", title: "2 / 5 — Regular", desc: "Marcas visibles, desgaste en marco o rayones" },
  { level: "1", title: "1 / 5 — Deteriorado", desc: "Con golpes fuertes, raspones o trizadura" }
];

export default function SellPhoneSection({ whatsappNumber }: SellPhoneSectionProps) {
  // 1. Sistema Operativo (Apple vs Android con iconos oficiales SVG)
  const [deviceType, setDeviceType] = useState<"iphone" | "android">("iphone");

  // 2. Nombre del equipo (sin sugerencias)
  const [deviceName, setDeviceName] = useState("");

  // 3. Espacio / Almacenamiento (un solo botón que abre ventana de selección)
  const [storage, setStorage] = useState<string>("128 GB");
  const [customStorage, setCustomStorage] = useState("");
  const [isStorageOpen, setIsStorageOpen] = useState(false);

  // 4. Batería (casilla en blanco para escribir libremente, sin opciones fijas)
  const [batteryHealth, setBatteryHealth] = useState("");

  // 5. Conectividad SIM (un solo botón que abre ventana de selección)
  const [simType, setSimType] = useState<string>("Chip Físico (Nano SIM)");
  const [isSimOpen, setIsSimOpen] = useState(false);

  // 6. Estado Físico (un solo botón con lista del 1 al 5)
  const [conditionLevel, setConditionLevel] = useState<string>("5");
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [conditionNotes, setConditionNotes] = useState("");

  // 7. Piezas cambiadas (casilla en blanco para que el usuario escriba, sin opciones)
  const [replacedPartsText, setReplacedPartsText] = useState("");

  // 8. Mencionar algún problema que tenga (casilla libre)
  const [issuesText, setIssuesText] = useState("");

  // Nombre opcional
  const [ownerName, setOwnerName] = useState("");

  // Validación
  const [showError, setShowError] = useState(false);

  const selectedConditionObj = CONDITION_SCALE.find((c) => c.level === conditionLevel) || CONDITION_SCALE[0];

  const handleReset = () => {
    setDeviceName("");
    setStorage("128 GB");
    setCustomStorage("");
    setIsStorageOpen(false);
    setBatteryHealth("");
    setSimType("Chip Físico (Nano SIM)");
    setIsSimOpen(false);
    setConditionLevel("5");
    setIsConditionOpen(false);
    setConditionNotes("");
    setReplacedPartsText("");
    setIssuesText("");
    setOwnerName("");
    setShowError(false);
  };

  const handleSendToWhatsApp = () => {
    if (!deviceName.trim()) {
      setShowError(true);
      const inputEl = document.getElementById("sell-device-name-input");
      if (inputEl) inputEl.focus();
      return;
    }
    setShowError(false);

    const finalStorage = storage === "Otro" && customStorage.trim() ? customStorage.trim() : storage;
    const finalBattery = deviceType === "iphone" 
      ? (batteryHealth.trim() ? batteryHealth.trim() : "No especificada")
      : null;
    const finalReplaced = replacedPartsText.trim() ? replacedPartsText.trim() : "Ninguna (todo original)";
    const finalIssues = issuesText.trim() ? issuesText.trim() : "Ninguno (100% operativo)";

    let message = `📱 *COTIZACIÓN DE VENTA / TRADE-IN · TECNOTRADE*\n`;
    message += `──────────────────────\n`;
    if (ownerName.trim()) {
      message += `👤 *Cliente:* ${ownerName.trim()}\n`;
    }
    message += `🏷️ *Sistema:* ${deviceType === "iphone" ? "Apple (iPhone)" : "Android"}\n`;
    message += `📲 *Equipo / Modelo:* *${deviceName.trim()}*\n`;
    message += `💾 *Almacenamiento:* ${finalStorage}\n`;

    if (deviceType === "iphone" && finalBattery) {
      message += `🔋 *Salud de Batería:* ${finalBattery.includes("%") ? finalBattery : `${finalBattery}%`}\n`;
    }

    message += `📶 *Conectividad SIM:* ${simType}\n`;
    message += `⭐ *Estado Físico (1 al 5):* ${selectedConditionObj.title}`;
    if (conditionNotes.trim()) {
      message += ` (${conditionNotes.trim()})`;
    }
    message += `\n`;

    message += `🔧 *Piezas Cambiadas:* ${finalReplaced}\n`;
    message += `⚠️ *Problemas o Fallas:* ${finalIssues}\n`;
    message += `──────────────────────\n`;
    message += `📍 Mobile Hub Pty, Calle Ricardo Arias 5, Panamá\n\n`;
    message += `Hola TecnoTrade 👋 Envío estos datos desde la web para cotizar mi equipo. ¿Cuánto me podrían ofrecer para compra directa o como abono (Trade-In)?`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8 animate-fadeIn mb-20">
      
      {/* TARJETA SUPERIOR PRINCIPAL EN ESTILO CLAY 3D */}
      <div className="clay-surface rounded-[2.5rem] p-6 sm:p-10 transition-all">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200/70 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl clay-badge-blue flex items-center justify-center shrink-0">
              <BadgeDollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#14171F] tracking-tight">
                Vende tu Teléfono <span className="text-[#1B57F2]">en TecnoTrade</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Cotización rápida · Recibe <span className="font-semibold text-[#14171F]">pago en efectivo</span> o úsalo como abono para otro equipo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleReset}
              className="clay-pill px-3.5 py-2 rounded-full text-xs text-slate-700 hover:text-[#1B57F2] flex items-center gap-1.5 font-semibold shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#1B57F2]" />
              <span>Limpiar formulario</span>
            </button>
          </div>
        </div>

        {/* FORMULARIO ESTRUCTURADO Y COMPACTO */}
        <div className="space-y-6">
          
          {/* CAMPO 1: SELECCIÓN DE SISTEMA OPERATIVO CON ICONOS OFICIALES SVG */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-2.5">
              Selecciona Sistema Operativo
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeviceType("iphone")}
                className={`p-3.5 sm:p-4 rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer btn-tactile ${
                  deviceType === "iphone"
                    ? "clay-btn-dark text-white ring-2 ring-[#1B57F2]/40"
                    : "clay-pill text-slate-800 hover:text-black"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  deviceType === "iphone" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"
                }`}>
                  <AppleIcon className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm block">iPhone</span>
                  <span className="text-[10px] opacity-75 block">Apple</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeviceType("android")}
                className={`p-3.5 sm:p-4 rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer btn-tactile ${
                  deviceType === "android"
                    ? "clay-btn-dark text-white ring-2 ring-[#1B57F2]/40"
                    : "clay-pill text-slate-800 hover:text-black"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  deviceType === "android" ? "bg-[#3DDC84]/20 text-[#3DDC84]" : "bg-slate-200 text-slate-800"
                }`}>
                  <AndroidIcon className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm block">Android</span>
                  <span className="text-[10px] opacity-75 block">Samsung, Xiaomi, etc.</span>
                </div>
              </button>
            </div>
          </div>

          {/* CAMPO 2: NOMBRE DE EQUIPO (SIN SUGERENCIAS) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="sell-device-name-input" className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider">
                Nombre de Equipo <span className="text-red-500">*</span>
              </label>
              {showError && !deviceName.trim() && (
                <span className="text-xs text-red-600 font-bold animate-pulse">
                  Escribe el modelo de tu teléfono
                </span>
              )}
            </div>

            <div className={`clay-inset rounded-2xl px-4 py-3 flex items-center gap-3 transition-all ${
              showError && !deviceName.trim() ? "ring-2 ring-red-500" : ""
            }`}>
              <Smartphone className="w-4 h-4 text-[#1B57F2] shrink-0" />
              <input 
                id="sell-device-name-input"
                type="text"
                value={deviceName}
                onChange={(e) => {
                  setDeviceName(e.target.value);
                  if (showError) setShowError(false);
                }}
                placeholder={deviceType === "iphone" ? "Ej: iPhone 14 Pro Max" : "Ej: Galaxy S24 Ultra, Xiaomi 13T..."}
                className="w-full bg-transparent text-sm text-[#14171F] font-semibold focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* CAMPO 3: ALMACENAMIENTO (UN SOLO BOTÓN QUE ABRE VENTANA DE SELECCIÓN) */}
          <div className="relative">
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-1.5">
              Espacio de Almacenamiento
            </label>

            <button
              type="button"
              onClick={() => {
                setIsStorageOpen((prev) => !prev);
                setIsSimOpen(false);
                setIsConditionOpen(false);
              }}
              className="w-full clay-card rounded-2xl px-4 py-3.5 flex items-center justify-between text-left transition-all cursor-pointer btn-tactile hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl clay-badge-blue flex items-center justify-center text-white shrink-0">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Capacidad seleccionada:</span>
                  <span className="text-sm font-bold text-[#14171F]">
                    {storage === "Otro" && customStorage.trim() ? customStorage.trim() : storage}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#1B57F2] font-semibold text-xs">
                <span>Elegir</span>
                {isStorageOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Ventana de selección desplegable */}
            {isStorageOpen && (
              <div className="absolute top-full left-0 right-0 z-30 mt-2 p-3 rounded-2xl clay-surface shadow-xl border border-slate-200/80 animate-scaleIn space-y-1.5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STORAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setStorage(opt);
                        if (opt !== "Otro") setIsStorageOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        storage === opt
                          ? "clay-btn-blue text-white shadow-xs"
                          : "clay-pill text-slate-700 hover:text-black"
                      }`}
                    >
                      <span>{opt}</span>
                      {storage === opt && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                {storage === "Otro" && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                    <input 
                      type="text"
                      value={customStorage}
                      onChange={(e) => setCustomStorage(e.target.value)}
                      placeholder="Especifica capacidad (ej: 32 GB, 2 TB)..."
                      className="flex-1 clay-inset px-3 py-2 rounded-xl text-xs font-semibold text-[#14171F] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsStorageOpen(false)}
                      className="clay-btn-dark px-3 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
                    >
                      Listo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CAMPO 4: SALUD DE BATERÍA (SOLO EN CASO DE IPHONE, CASILLA EN BLANCO PARA ESCRIBIR) */}
          {deviceType === "iphone" && (
            <div className="animate-fadeIn">
              <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-1.5">
                Salud de Batería (%)
              </label>
              <div className="clay-inset rounded-2xl px-4 py-3 flex items-center gap-3">
                <Battery className="w-4 h-4 text-[#1B57F2] shrink-0" />
                <input 
                  type="text"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(e.target.value)}
                  placeholder="Escribe el porcentaje (ej: 87% o 100%)..."
                  className="w-full bg-transparent text-sm text-[#14171F] font-semibold focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* CAMPO 5: SELECCIONAR SI ES ESIM O CHIP (UN SOLO BOTÓN QUE ABRE VENTANA DE SELECCIÓN) */}
          <div className="relative">
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-1.5">
              Tipo de SIM / Conectividad
            </label>

            <button
              type="button"
              onClick={() => {
                setIsSimOpen((prev) => !prev);
                setIsStorageOpen(false);
                setIsConditionOpen(false);
              }}
              className="w-full clay-card rounded-2xl px-4 py-3.5 flex items-center justify-between text-left transition-all cursor-pointer btn-tactile hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl clay-badge-blue flex items-center justify-center text-white shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Conectividad:</span>
                  <span className="text-sm font-bold text-[#14171F]">{simType}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#1B57F2] font-semibold text-xs">
                <span>Cambiar</span>
                {isSimOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Ventana de selección desplegable */}
            {isSimOpen && (
              <div className="absolute top-full left-0 right-0 z-30 mt-2 p-2.5 rounded-2xl clay-surface shadow-xl border border-slate-200/80 animate-scaleIn space-y-1.5">
                {SIM_OPTIONS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSimType(item.label);
                      setIsSimOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                      simType === item.label
                        ? "clay-btn-blue text-white shadow-xs"
                        : "clay-pill text-slate-800 hover:text-black"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs sm:text-sm block">{item.label}</span>
                      <span className={`text-[10px] block ${simType === item.label ? "text-blue-100" : "text-slate-500"}`}>
                        {item.desc}
                      </span>
                    </div>
                    {simType === item.label && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CAMPO 6: ESTADO FÍSICO (UN SOLO BOTÓN CON LISTA DEL 1 AL 5) */}
          <div className="relative">
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-1.5">
              Estado Físico (Escala del 1 al 5)
            </label>

            <button
              type="button"
              onClick={() => {
                setIsConditionOpen((prev) => !prev);
                setIsStorageOpen(false);
                setIsSimOpen(false);
              }}
              className="w-full clay-card rounded-2xl px-4 py-3.5 flex items-center justify-between text-left transition-all cursor-pointer btn-tactile hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl clay-btn-dark flex items-center justify-center text-white shrink-0 font-extrabold text-sm">
                  {conditionLevel}★
                </div>
                <div>
                  <span className="text-sm font-bold text-[#14171F] block">{selectedConditionObj.title}</span>
                  <span className="text-[11px] text-slate-500 block">{selectedConditionObj.desc}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#1B57F2] font-semibold text-xs shrink-0 ml-2">
                <span>Elegir</span>
                {isConditionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Ventana de selección con lista del 1 al 5 */}
            {isConditionOpen && (
              <div className="absolute top-full left-0 right-0 z-30 mt-2 p-2.5 rounded-2xl clay-surface shadow-xl border border-slate-200/80 animate-scaleIn space-y-1.5">
                {CONDITION_SCALE.map((cond) => (
                  <button
                    key={cond.level}
                    type="button"
                    onClick={() => {
                      setConditionLevel(cond.level);
                      setIsConditionOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      conditionLevel === cond.level
                        ? "clay-btn-dark text-white shadow-xs"
                        : "clay-pill text-slate-800 hover:text-black"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs sm:text-sm block">{cond.title}</span>
                      <span className={`text-[10px] block ${conditionLevel === cond.level ? "text-slate-300" : "text-slate-500"}`}>
                        {cond.desc}
                      </span>
                    </div>
                    {conditionLevel === cond.level && <Check className="w-4 h-4 shrink-0 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}

            {/* Detalle físico adicional opcional */}
            <div className="mt-2 clay-inset rounded-xl px-3.5 py-2">
              <input 
                type="text"
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value)}
                placeholder="Detalle estético adicional (opcional: ej. incluye caja, cargador, cover)..."
                className="w-full bg-transparent text-xs text-[#14171F] font-medium focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* CAMPO 7: PIEZAS CAMBIADAS (CASILLA EN BLANCO PARA ESCRIBIR LIBREMENTE, SIN OPCIONES) */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-1.5">
              ¿Alguna Pieza Cambiada o Reparada?
            </label>
            <div className="clay-inset rounded-2xl px-4 py-3 flex items-center gap-3">
              <Wrench className="w-4 h-4 text-[#1B57F2] shrink-0" />
              <input 
                type="text"
                value={replacedPartsText}
                onChange={(e) => setReplacedPartsText(e.target.value)}
                placeholder="Escribe si tiene alguna (ej: Ninguna / Pantalla cambiada / Batería)..."
                className="w-full bg-transparent text-sm text-[#14171F] font-semibold focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* CAMPO 8: MENCIONAR ALGÚN PROBLEMA QUE TENGA (CASILLA LIBRE) */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-1.5">
              Mencionar Algún Problema o Falla
            </label>
            <div className="clay-inset rounded-2xl px-4 py-3 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <input 
                type="text"
                value={issuesText}
                onChange={(e) => setIssuesText(e.target.value)}
                placeholder="Escribe si tiene falla (ej: Ninguno, Face ID no sirve, detalle en cámara)..."
                className="w-full bg-transparent text-sm text-[#14171F] font-semibold focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* CAMPO 9: NOMBRE (OPCIONAL) */}
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">
              Tu nombre o tienda (opcional)
            </label>
            <div className="clay-inset rounded-xl px-4 py-2.5">
              <input 
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Ej: David Pérez"
                className="w-full bg-transparent text-xs font-medium text-[#14171F] focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* BOTÓN PRINCIPAL DE ENVÍO A WHATSAPP */}
          <div className="pt-4 border-t border-slate-200/70">
            <div className="clay-card rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-50/50 via-white to-emerald-50/50">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[11px] font-bold text-[#1B57F2] uppercase tracking-wider block">
                  Respuesta Inmediata
                </span>
                <h4 className="text-base sm:text-lg font-bold text-[#14171F]">
                  ¿Listo para recibir tu oferta?
                </h4>
                <p className="text-xs text-slate-500">
                  Te cotizamos al instante para compra directa en efectivo o abono.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer shrink-0"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Enviar Cotización a WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* BENEFICIOS DE VENDER EN TECNOTRADE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="clay-card rounded-2xl p-4.5 text-center">
          <div className="w-9 h-9 rounded-xl clay-badge-blue mx-auto mb-2.5 flex items-center justify-center text-white">
            <BadgeDollarSign className="w-4.5 h-4.5" />
          </div>
          <h5 className="font-bold text-sm text-[#14171F] mb-1">Pago Inmediato</h5>
          <p className="text-xs text-slate-500 leading-snug">
            En efectivo o transferencia instantánea al momento de revisar tu equipo.
          </p>
        </div>

        <div className="clay-card rounded-2xl p-4.5 text-center">
          <div className="w-9 h-9 rounded-xl clay-badge-blue mx-auto mb-2.5 flex items-center justify-center text-white">
            <Layers className="w-4.5 h-4.5" />
          </div>
          <h5 className="font-bold text-sm text-[#14171F] mb-1">Trade-In (Abono)</h5>
          <p className="text-xs text-slate-500 leading-snug">
            Entrega tu teléfono actual como parte de pago para tu próximo equipo.
          </p>
        </div>

        <div className="clay-card rounded-2xl p-4.5 text-center">
          <div className="w-9 h-9 rounded-xl clay-badge-blue mx-auto mb-2.5 flex items-center justify-center text-white">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <h5 className="font-bold text-sm text-[#14171F] mb-1">Trato Seguro y Directo</h5>
          <p className="text-xs text-slate-500 leading-snug">
            En nuestro local oficial en Mobile Hub Pty, Calle Ricardo Arias 5.
          </p>
        </div>
      </div>

    </div>
  );
}
