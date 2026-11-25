"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import { InventoryProduct, getProductImages } from "@/types/inventory";

interface ProductDetailModalProps {
  product: InventoryProduct | null;
  whatsappNumber: string;
  onClose: () => void;
  onAddToCart: (product: InventoryProduct) => void;
}

export default function ProductDetailModal({
  product,
  whatsappNumber,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const photos = product ? getProductImages(product) : [];

  useEffect(() => {
    if (!product) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && photos.length > 1) {
        setActiveIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === "ArrowLeft" && photos.length > 1) {
        setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, photos.length, onClose]);

  if (!product) return null;

  const safeIndex = activeIndex < photos.length ? activeIndex : 0;
  const activePhoto = photos[safeIndex];
  const isAvailable = product.inStock !== false;

  const handlePrev = () => {
    if (photos.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    if (photos.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || photos.length <= 1) return;
    const endX = e.changedTouches[0]?.clientX;
    if (endX === undefined) return;

    const deltaX = touchStartXRef.current - endX;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const handleWhatsAppProduct = () => {
    const details = product.subtitle ? ` (${product.subtitle})` : "";
    const msg = isAvailable
      ? `¡Hola TecnoTrade! Me interesa el equipo *${product.name}*${details} publicado en $${product.price}. ¿Sigue disponible?`
      : `¡Hola TecnoTrade! Vi el equipo *${product.name}*${details} en su catálogo y me gustaría saber si pronto tendrán stock disponible.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleAdd = () => {
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-5xl sm:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* COLUMNA IZQUIERDA: VISOR DE FOTOS ESTILO MARKETPLACE */}
        <div className="md:w-[58%] bg-[#0D1017] relative flex flex-col justify-between shrink-0">
          {/* Barra superior flotante (móvil y contador) */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <span className="bg-black/65 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 pointer-events-auto">
              {safeIndex + 1} / {photos.length}
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar publicación"
              className="md:hidden w-9 h-9 rounded-full bg-black/65 backdrop-blur-md text-white hover:bg-black flex items-center justify-center border border-white/15 pointer-events-auto cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Imagen principal con soporte swipe */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex-1 flex items-center justify-center min-h-[290px] sm:min-h-[380px] md:min-h-[480px] p-4 sm:p-6 overflow-hidden select-none"
          >
            {/* Fondo ambiental difuminado */}
            <img
              src={activePhoto}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-110 pointer-events-none"
            />

            <img
              src={activePhoto}
              alt={`${product.name} - Foto ${safeIndex + 1}`}
              className="relative z-10 max-h-[38vh] sm:max-h-[46vh] md:max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
            />

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/15 transition-all cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Siguiente foto"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/15 transition-all cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Tira de miniaturas */}
          {photos.length > 1 && (
            <div className="relative z-20 flex items-center justify-center gap-2.5 px-4 py-3 bg-black/45 border-t border-white/10">
              {photos.map((photoUrl, idx) => (
                <button
                  key={`${idx}-${photoUrl.slice(0, 24)}`}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Ver foto ${idx + 1}`}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    idx === safeIndex
                      ? "border-[#3B82F6] ring-2 ring-[#3B82F6]/40 scale-105"
                      : "border-white/20 opacity-65 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: INFORMACIÓN Y ACCIONES */}
        <div className="md:w-[42%] flex flex-col flex-1 min-h-0 bg-white">
          {/* Header desktop */}
          <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B57F2] bg-blue-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar publicación"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5 md:hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B57F2] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {product.category}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isAvailable ? "En Stock" : "Agotado"}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#14171F] leading-snug">
                {product.name}
              </h2>

              <div className="flex items-baseline justify-between gap-3 mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#14171F] tracking-tight">
                  ${product.price}
                </span>
                <span
                  className={`hidden md:inline-flex text-xs font-bold px-3 py-1 rounded-full ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isAvailable ? "Disponible · En Stock" : "Agotado temporalmente"}
                </span>
              </div>

              {product.subtitle && (
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Badges técnicos */}
            {(product.grade || product.battery || product.tag) && (
              <div className="flex flex-wrap gap-2">
                {product.grade && (
                  <span className="text-xs font-semibold bg-slate-100 text-[#14171F] px-3 py-1.5 rounded-xl">
                    Condición: {product.grade}
                  </span>
                )}
                {product.battery && (
                  <span className="text-xs font-semibold bg-zinc-900 text-white px-3 py-1.5 rounded-xl">
                    Batería: {product.battery}
                  </span>
                )}
                {product.tag && (
                  <span className="text-xs font-semibold bg-blue-50 text-[#1B57F2] px-3 py-1.5 rounded-xl">
                    {product.tag}
                  </span>
                )}
              </div>
            )}

            {/* Colores si existen */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-500">Color:</span>
                <div className="flex items-center gap-1.5">
                  {product.colors.map((c, idx) => (
                    <span
                      key={idx}
                      style={{ backgroundColor: c }}
                      className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bloque de descripción estilo Marketplace */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Descripción
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {product.description?.trim()
                  ? product.description
                  : product.subtitle?.trim()
                    ? `${product.subtitle}\n\nEquipo revisado y certificado por el taller de TecnoTrade PTY. Listo para entrega inmediata o envío.`
                    : "Equipo revisado y certificado por el taller de TecnoTrade PTY. Escríbenos por WhatsApp para fotos adicionales, detalles de IMEI o disponibilidad inmediata."}
              </p>
            </div>

            {/* Garantía y ubicación */}
            <div className="bg-[#F5F7FC] rounded-2xl p-4 space-y-2.5 border border-slate-200/60">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#14171F]">
                <ShieldCheck className="w-4 h-4 text-[#1B57F2] shrink-0" />
                <span>Garantía de 6 meses por funcionamiento</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Retiro en TecnoTrade PTY (Ciudad de Panamá) o entrega coordinada</span>
              </div>
            </div>
          </div>

          {/* Barra inferior fija de acciones */}
          <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-white flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!isAvailable}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                justAdded
                  ? "bg-emerald-600 text-white"
                  : "clay-btn-blue text-white"
              }`}
            >
              {justAdded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Agregado al carrito</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{isAvailable ? "Añadir al carrito" : "Agotado"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppProduct}
              className="flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Consultar por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
