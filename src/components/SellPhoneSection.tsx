"use client";

import { useState } from "react";
import { 
  Smartphone, 
  Battery, 
  HardDrive, 
  Radio, 
  Wrench, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight,
  RotateCcw,
  BadgeDollarSign,
  Cpu,
  Layers,
  HelpCircle
} from "lucide-react";

interface SellPhoneSectionProps {
  whatsappNumber: string;
}

export default function SellPhoneSection({ whatsappNumber }: SellPhoneSectionProps) {
  // 1. Tipo de dispositivo: Android o iPhone
  const [deviceType, setDeviceType] = useState<"iphone" | "android">("iphone");

  // 2. Nombre del equipo
  const [deviceName, setDeviceName] = useState("");

  // 3. Espacio / Almacenamiento: 128, 256, 512, 1TB
  const [storage, setStorage] = useState<string>("128 GB");
  const [customStorage, setCustomStorage] = useState("");

  // 4. Salud de batería (solo para iPhone)
  const [batteryHealth, setBatteryHealth] = useState<string>("85% - 89%");
  const [customBattery, setCustomBattery] = useState("");

  // 5. Problemas o fallas
  const [hasIssues, setHasIssues] = useState<"no" | "yes">("no");
  const [issuesDescription, setIssuesDescription] = useState("");

  // 6. Piezas cambiadas
  const [replacedParts, setReplacedParts] = useState<string>("Ninguna (Todo 100% original)");
  const [customReplacedParts, setCustomReplacedParts] = useState("");

  // 7. Estado físico
  const [physicalCondition, setPhysicalCondition] = useState<string>("9/10 Excelente (marcas mínimas de uso)");
  const [physicalDetails, setPhysicalDetails] = useState("");

  // 8. Tipo de SIM: eSIM o Chip
  const [simType, setSimType] = useState<string>("Chip Físico (Nano SIM)");

  // 9. Nombre del cliente (opcional)
  const [ownerName, setOwnerName] = useState("");

  // Estado de validación
  const [showError, setShowError] = useState(false);

  // Sugerencias rápidas según el tipo
  const quickModels = deviceType === "iphone"
    ? ["iPhone 15 Pro Max", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14", "iPhone 13 Pro", "iPhone 13", "iPhone 12", "iPhone 11"]
    : ["Galaxy S24 Ultra", "Galaxy S23", "Galaxy A54", "Xiaomi 13T", "Redmi Note 13", "Honor 90", "Pixel 8 Pro"];

  // Resetear formulario
  const handleReset = () => {
    setDeviceName("");
    setStorage("128 GB");
    setCustomStorage("");
    setBatteryHealth("85% - 89%");
    setCustomBattery("");
    setHasIssues("no");
    setIssuesDescription("");
    setReplacedParts("Ninguna (Todo 100% original)");
    setCustomReplacedParts("");
    setPhysicalCondition("9/10 Excelente (marcas mínimas de uso)");
    setPhysicalDetails("");
    setSimType("Chip Físico (Nano SIM)");
    setOwnerName("");
    setShowError(false);
  };

  // Construir y enviar mensaje a WhatsApp
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
      ? (customBattery.trim() ? `${customBattery.trim()}%` : batteryHealth)
      : null;
    const finalReplaced = replacedParts === "Otra pieza" && customReplacedParts.trim() 
      ? customReplacedParts.trim() 
      : replacedParts;
    const finalIssues = hasIssues === "no" 
      ? "Ninguno (100% operativo sin fallas)" 
      : (issuesDescription.trim() || "Presenta detalles a evaluar");

    let message = `📱 *COTIZACIÓN DE VENTA / TRADE-IN · TECNOTRADE*\n`;
    message += `──────────────────────\n`;
    if (ownerName.trim()) {
      message += `👤 *Cliente:* ${ownerName.trim()}\n`;
    }
    message += `🏷️ *Plataforma:* ${deviceType === "iphone" ? "Apple (iPhone)" : "Android"}\n`;
    message += `📲 *Equipo / Modelo:* *${deviceName.trim()}*\n`;
    message += `💾 *Almacenamiento:* ${finalStorage}\n`;

    if (deviceType === "iphone" && finalBattery) {
      message += `🔋 *Salud de Batería:* ${finalBattery}\n`;
    }

    message += `📶 *Conectividad SIM:* ${simType}\n`;
    message += `✨ *Estado Físico:* ${physicalCondition}`;
    if (physicalDetails.trim()) {
      message += ` (${physicalDetails.trim()})`;
    }
    message += `\n`;

    message += `🔧 *Piezas Cambiadas:* ${finalReplaced}\n`;
    message += `⚠️ *Fallas o Problemas:* ${finalIssues}\n`;
    message += `──────────────────────\n`;
    message += `📍 *Ubicación:* Mobile Hub Pty, Calle Ricardo Arias 5, Panamá\n\n`;
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
                Cotización inmediata · Recibe <span className="font-semibold text-[#14171F]">pago en efectivo</span> o úsalo como abono para otro equipo
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

        {/* FORMULARIO ESTRUCTURADO */}
        <div className="space-y-8">
          
          {/* PASO 1: SELECCIONE (ANDROID O IPHONE) */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B57F2] text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <span>Selecciona el Sistema Operativo</span>
            </label>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  setDeviceType("iphone");
                  if (deviceName.toLowerCase().includes("galaxy") || deviceName.toLowerCase().includes("xiaomi")) {
                    setDeviceName("");
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-3 transition-all cursor-pointer btn-tactile ${
                  deviceType === "iphone"
                    ? "clay-btn-dark text-white ring-2 ring-[#1B57F2]/40"
                    : "clay-pill text-slate-800 hover:text-black"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-lg">
                  🍎
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm sm:text-base block">iPhone</span>
                  <span className="text-[10px] sm:text-xs opacity-75 block">Apple iOS</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeviceType("android");
                  if (deviceName.toLowerCase().includes("iphone")) {
                    setDeviceName("");
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-3 transition-all cursor-pointer btn-tactile ${
                  deviceType === "android"
                    ? "clay-btn-dark text-white ring-2 ring-[#1B57F2]/40"
                    : "clay-pill text-slate-800 hover:text-black"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-lg">
                  🤖
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm sm:text-base block">Android</span>
                  <span className="text-[10px] sm:text-xs opacity-75 block">Samsung, Xiaomi, etc.</span>
                </div>
              </button>
            </div>
          </div>

          {/* PASO 2: NOMBRE DE EQUIPO */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="sell-device-name-input" className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1B57F2] text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <span>Nombre del Equipo / Modelo</span>
                <span className="text-red-500">*</span>
              </label>
              {showError && !deviceName.trim() && (
                <span className="text-xs text-red-600 font-bold animate-pulse">
                  Por favor escribe el modelo
                </span>
              )}
            </div>

            <div className={`clay-inset rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 transition-all ${
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
                placeholder={deviceType === "iphone" ? "Ej: iPhone 14 Pro Max, iPhone 13 128GB, iPhone 11..." : "Ej: Galaxy S24 Ultra, Xiaomi 13T, Redmi Note 13..."}
                className="w-full bg-transparent text-xs sm:text-sm text-[#14171F] font-semibold focus:outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Accesos rápidos sugeridos */}
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Populares:</span>
              {quickModels.slice(0, 5).map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => {
                    setDeviceName(model);
                    setShowError(false);
                  }}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    deviceName === model 
                      ? "clay-btn-blue text-white shadow-xs" 
                      : "clay-pill text-slate-700 hover:text-[#1B57F2]"
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* PASO 3: SELECCIONE ESPACIO (128, 256, 512, 1TB) */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B57F2] text-white text-[11px] font-bold flex items-center justify-center">3</span>
              <span>Capacidad de Almacenamiento</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
              {["64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "Otro"].map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setStorage(cap)}
                  className={`py-2.5 sm:py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer btn-tactile text-center ${
                    storage === cap
                      ? "clay-btn-blue text-white shadow-xs"
                      : "clay-pill text-slate-700 hover:text-black"
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>

            {storage === "Otro" && (
              <div className="mt-2.5 max-w-xs animate-fadeIn">
                <input 
                  type="text"
                  value={customStorage}
                  onChange={(e) => setCustomStorage(e.target.value)}
                  placeholder="Ej: 32 GB, 2 TB..."
                  className="w-full clay-inset px-4 py-2.5 rounded-xl text-xs font-semibold text-[#14171F] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* PASO 4: SALUD DE BATERÍA (SOLO APARECE EN CASO DE IPHONE) */}
          {deviceType === "iphone" && (
            <div className="animate-fadeIn p-4 sm:p-5 rounded-2xl sm:rounded-3xl clay-card border border-slate-200/70">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#1B57F2] text-white text-[11px] font-bold flex items-center justify-center">
                    4
                  </div>
                  <Battery className="w-4 h-4 text-[#1B57F2]" />
                  <span>Salud de Batería (Condición Apple)</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Ajustes &gt; Batería &gt; Condición
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                {["100%", "90% - 99%", "85% - 89%", "80% - 84%", "Menos de 80%"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBatteryHealth(b);
                      setCustomBattery("");
                    }}
                    className={`py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer btn-tactile text-center ${
                      batteryHealth === b && !customBattery
                        ? "clay-btn-dark text-white shadow-xs"
                        : "clay-pill text-slate-700 hover:text-black"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">O escribe el porcentaje exacto:</span>
                <input 
                  type="number"
                  min="50"
                  max="100"
                  value={customBattery}
                  onChange={(e) => setCustomBattery(e.target.value)}
                  placeholder="Ej: 88"
                  className="w-24 clay-inset px-3 py-1.5 rounded-xl text-xs font-bold text-[#14171F] focus:outline-none"
                />
                <span className="text-xs font-bold text-slate-600">%</span>
              </div>
            </div>
          )}

          {/* PASO 5: SELECCIONAR SI ES ESIM O CHIP */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B57F2] text-white text-[11px] font-bold flex items-center justify-center">
                {deviceType === "iphone" ? "5" : "4"}
              </span>
              <Radio className="w-4 h-4 text-[#1B57F2]" />
              <span>Conectividad: ¿eSIM o Chip Físico?</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { label: "Chip Físico (Nano SIM)", desc: "Ranura para chip tradicional" },
                { label: "Solo eSIM (Digital)", desc: "Modelos americanos sin ranura" },
                { label: "Ambos (eSIM + Chip Físico)", desc: "Dual SIM compatible" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSimType(item.label)}
                  className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer btn-tactile ${
                    simType === item.label
                      ? "clay-btn-blue text-white shadow-xs"
                      : "clay-pill text-slate-800 hover:text-black"
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm block">{item.label}</span>
                  <span className={`text-[10px] sm:text-[11px] block mt-0.5 ${
                    simType === item.label ? "text-blue-100" : "text-slate-500"
                  }`}>
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* PASO 6: DESCRIBIR ESTADO FÍSICO */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B57F2] text-white text-[11px] font-bold flex items-center justify-center">
                {deviceType === "iphone" ? "6" : "5"}
              </span>
              <Sparkles className="w-4 h-4 text-[#1B57F2]" />
              <span>Estado Físico y Estético</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              {[
                { label: "10/10 Como nuevo (impecable)", desc: "Sin ningún detalle, siempre con funda y vidrio" },
                { label: "9/10 Excelente (marcas mínimas de uso)", desc: "Detalles leves casi imperceptibles" },
                { label: "8/10 Bueno (rayoncitos visibles)", desc: "Marcas o desgaste normal en marco/pantalla" },
                { label: "Con golpes o trizadura", desc: "Vidrio quebrado, golpe fuerte o detalles mayores" },
              ].map((cond) => (
                <button
                  key={cond.label}
                  type="button"
                  onClick={() => setPhysicalCondition(cond.label)}
                  className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer btn-tactile ${
                    physicalCondition === cond.label
                      ? "clay-btn-dark text-white shadow-xs"
                      : "clay-pill text-slate-800 hover:text-black"
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm block">{cond.label}</span>
                  <span className={`text-[10px] sm:text-[11px] block mt-0.5 ${
                    physicalCondition === cond.label ? "text-slate-300" : "text-slate-500"
                  }`}>
                    {cond.desc}
                  </span>
                </button>
              ))}
            </div>

            <div className="clay-inset rounded-2xl px-4 py-2.5">
              <input 
                type="text"
                value={physicalDetails}
                onChange={(e) => setPhysicalDetails(e.target.value)}
                placeholder="Detalle estético adicional (opcional: ej. incluye caja, cargador original, cover)..."
                className="w-full bg-transparent text-xs text-[#14171F] font-medium focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* PASO 7: ¿ALGUNA PIEZA CAMBIADA? */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B57F2] text-white text-[11px] font-bold flex items-center justify-center">
                {deviceType === "iphone" ? "7" : "6"}
              </span>
              <Wrench className="w-4 h-4 text-[#1B57F2]" />
              <span>¿Tiene alguna pieza cambiada o reparada?</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                "Ninguna (Todo 100% original)",
                "Pantalla cambiada",
                "Batería cambiada",
                "Tapa trasera cambiada",
                "Cámara cambiada",
                "Otra pieza",
              ].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setReplacedParts(p)}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer btn-tactile text-center ${
                    replacedParts === p
                      ? "clay-btn-blue text-white shadow-xs"
                      : "clay-pill text-slate-700 hover:text-black"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {replacedParts === "Otra pieza" && (
              <div className="mt-2.5 animate-fadeIn">
                <input 
                  type="text"
                  value={customReplacedParts}
                  onChange={(e) => setCustomReplacedParts(e.target.value)}
                  placeholder="Especifica qué pieza fue cambiada..."
                  className="w-full clay-inset px-4 py-2.5 rounded-xl text-xs font-semibold text-[#14171F] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* PASO 8: MENCIONAR ALGÚN PROBLEMA QUE TENGA */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#14171F] uppercase tracking-wider block mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B57F2] text-white text-[11px] font-bold flex items-center justify-center">
                {deviceType === "iphone" ? "8" : "7"}
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>¿Tiene algún problema o falla en su funcionamiento?</span>
            </label>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={() => {
                  setHasIssues("no");
                  setIssuesDescription("");
                }}
                className={`p-3.5 rounded-2xl text-center transition-all cursor-pointer btn-tactile ${
                  hasIssues === "no"
                    ? "clay-btn-dark text-white ring-2 ring-emerald-500/30"
                    : "clay-pill text-slate-800 hover:text-black"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs sm:text-sm">100% Funcional</span>
                </div>
                <span className="text-[10px] text-slate-300 block mt-0.5">Sin ningún problema operativo</span>
              </button>

              <button
                type="button"
                onClick={() => setHasIssues("yes")}
                className={`p-3.5 rounded-2xl text-center transition-all cursor-pointer btn-tactile ${
                  hasIssues === "yes"
                    ? "clay-btn-dark text-white ring-2 ring-amber-500/40"
                    : "clay-pill text-slate-800 hover:text-black"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-xs sm:text-sm">Tiene detalles</span>
                </div>
                <span className="text-[10px] text-slate-300 block mt-0.5">Falla en alguna función</span>
              </button>
            </div>

            {hasIssues === "yes" && (
              <div className="clay-inset rounded-2xl p-4 animate-fadeIn">
                <textarea 
                  rows={2}
                  value={issuesDescription}
                  onChange={(e) => setIssuesDescription(e.target.value)}
                  placeholder="Describe la falla (ej: Face ID no funciona, cámara tiembla, no agarra WiFi o señal, etc.)..."
                  className="w-full bg-transparent text-xs text-[#14171F] font-medium focus:outline-none placeholder:text-slate-400 resize-none"
                />
              </div>
            )}
          </div>

          {/* CAMPO ADICIONAL: NOMBRE (OPCIONAL) */}
          <div className="pt-4 border-t border-slate-200/60">
            <div className="max-w-md">
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                Tu nombre o tienda (opcional)
              </label>
              <div className="clay-inset rounded-xl px-4 py-2.5">
                <input 
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Ej: David Pérez / Tecno Store"
                  className="w-full bg-transparent text-xs font-medium text-[#14171F] focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* BOTÓN PRINCIPAL DE ENVÍO A WHATSAPP */}
          <div className="pt-6 border-t border-slate-200/70">
            <div className="clay-card rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 bg-gradient-to-r from-blue-50/50 via-white to-emerald-50/50">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[11px] font-bold text-[#1B57F2] uppercase tracking-wider block mb-0.5">
                  Cotización Rápida Garantizada
                </span>
                <h4 className="text-base sm:text-lg font-bold text-[#14171F]">
                  ¿Listo para recibir oferta por tu teléfono?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Te responderemos al instante con el valor estimado para compra o abono.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer shrink-0"
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="clay-card rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl clay-badge-blue mx-auto mb-3 flex items-center justify-center text-white">
            <BadgeDollarSign className="w-5 h-5" />
          </div>
          <h5 className="font-bold text-sm text-[#14171F] mb-1">Pago Inmediato</h5>
          <p className="text-xs text-slate-500">
            En efectivo o transferencia instantánea al momento de revisar tu equipo en el local.
          </p>
        </div>

        <div className="clay-card rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl clay-badge-blue mx-auto mb-3 flex items-center justify-center text-white">
            <Layers className="w-5 h-5" />
          </div>
          <h5 className="font-bold text-sm text-[#14171F] mb-1">Trade-In (Abono)</h5>
          <p className="text-xs text-slate-500">
            Entrega tu equipo actual como parte de pago para llevarte otro modelo nuevo o seminuevo.
          </p>
        </div>

        <div className="clay-card rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl clay-badge-blue mx-auto mb-3 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h5 className="font-bold text-sm text-[#14171F] mb-1">Trato Seguro y Rápido</h5>
          <p className="text-xs text-slate-500">
            Sin intermediarios ni riesgos en la calle. Te atendemos en nuestro taller oficial en Mobile Hub Pty.
          </p>
        </div>
      </div>

    </div>
  );
}
