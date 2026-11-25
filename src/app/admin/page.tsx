"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Upload, 
  Camera,
  Images,
  Star,
  CheckCircle2, 
  AlertCircle, 
  X, 
  Package, 
  Wrench,
  Smartphone,
  Check,
  Lock,
  LogOut,
  KeyRound
} from "lucide-react";
import {
  DEFAULT_PRODUCT_IMAGE,
  InventoryProduct,
  MAX_PRODUCT_IMAGES,
  ProductCategory,
  normalizeProductImages,
} from "@/types/inventory";
import { RepairItem, RepairBrand, RepairCategory, RepairQuality } from "@/data/repairCatalog";

/**
 * Comprime una imagen en el navegador mediante HTML5 Canvas (máx. 1200px, JPEG 82%)
 * para mantener cada foto en ~90-120 KB y permitir hasta 3 fotos por publicación sin saturar Redis.
 */
async function compressImageToDataUrl(file: File, maxDimension = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("No se pudo inicializar el lienzo de compresión"));
          return;
        }

        // Fondo blanco por si la imagen original es PNG transparente
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        URL.revokeObjectURL(objectUrl);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo leer el archivo de imagen"));
    };

    img.src = objectUrl;
  });
}

const CATEGORIES: ProductCategory[] = [
  "iPhone",
  "Samsung",
  "Honor",
  "Xiaomi",
  "Pixel",
  "Covers & Fundas",
  "Accesorios",
  "Otros"
];

const REPAIR_BRANDS: RepairBrand[] = ["Apple", "Samsung", "Honor", "Xiaomi", "Google"];
const REPAIR_CATEGORIES: RepairCategory[] = ["Pantallas", "Tapas Traseras", "Puertos de Carga", "Baterías"];
const REPAIR_QUALITIES: RepairQuality[] = ["Incell", "OLED", "Original", "Servipack", "Estándar"];

export default function AdminPage() {
  // ==============================================================
  // ESTADO DE SEGURIDAD (PROTECCIÓN POR PIN)
  // ==============================================================
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const pinInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("tt_admin_auth") || sessionStorage.getItem("tt_admin_auth");
    if (savedToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handlePinSubmit = async (pinValue?: string) => {
    const pinToVerify = (pinValue !== undefined ? pinValue : pinInput).trim();
    if (!pinToVerify) return;

    setIsVerifyingPin(true);
    setPinError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinToVerify })
      });

      if (res.ok) {
        const data = await res.json();
        if (rememberDevice) {
          localStorage.setItem("tt_admin_auth", data.token);
        } else {
          sessionStorage.setItem("tt_admin_auth", data.token);
        }
        setIsAuthenticated(true);
        setPinInput("");
        setPinError("");
      } else {
        setPinError("PIN incorrecto. Inténtalo de nuevo.");
        setPinInput("");
      }
    } catch {
      setPinError("Error de conexión al verificar PIN");
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handlePinDigit = (digit: string) => {
    if (pinInput.length >= 6) return;
    const nextPin = pinInput + digit;
    setPinInput(nextPin);
    setPinError("");
    if (nextPin.length === 6) {
      handlePinSubmit(nextPin);
    }
  };

  const handlePinBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError("");
  };

  const handlePinClear = () => {
    setPinInput("");
    setPinError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("tt_admin_auth");
    sessionStorage.removeItem("tt_admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
    setPinError("");
  };

  // Pestaña activa del panel Admin: "inventario" (Equipos en Venta) o "reparaciones" (Taller)
  const [adminTab, setAdminTab] = useState<"inventario" | "reparaciones">("inventario");

  // ==============================================================
  // ESTADO 1: INVENTARIO DE EQUIPOS EN VENTA
  // ==============================================================
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  // Modal Producto (Crear / Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);

  const [formCategory, setFormCategory] = useState<ProductCategory>("iPhone");
  const [formName, setFormName] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formGrade, setFormGrade] = useState("Grado A+");
  const [formBattery, setFormBattery] = useState("");
  const [formTag, setFormTag] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [formInStock, setFormInStock] = useState(true);
  const [formId, setFormId] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isSubmittingRepair, setIsSubmittingRepair] = useState(false);

  // ==============================================================
  // ESTADO 2: CATÁLOGO DE REPARACIONES
  // ==============================================================
  const [repairs, setRepairs] = useState<RepairItem[]>([]);
  const [isLoadingRepairs, setIsLoadingRepairs] = useState(true);
  const [repairSearch, setRepairSearch] = useState("");
  const [repairBrandFilter, setRepairBrandFilter] = useState<string>("Todas");
  const [repairCategoryFilter, setRepairCategoryFilter] = useState<string>("Todas");
  const [autoMarginRule, setAutoMarginRule] = useState<boolean>(true);

  // Edición rápida en fila (inline)
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineCost, setInlineCost] = useState<string>("");
  const [inlinePrice, setInlinePrice] = useState<string>("");

  // Modal Reparación (Crear / Editar)
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState<RepairItem | null>(null);
  const [repFormBrand, setRepFormBrand] = useState<RepairBrand>("Apple");
  const [repFormCategory, setRepFormCategory] = useState<RepairCategory>("Pantallas");
  const [repFormModel, setRepFormModel] = useState("");
  const [repFormQuality, setRepFormQuality] = useState<RepairQuality>("Original");
  const [repFormCost, setRepFormCost] = useState("");
  const [repFormPrice, setRepFormPrice] = useState("");

  // Notificación global
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [dbStatus, setDbStatus] = useState<{
    cloudDatabaseActive: boolean;
    diagnosticSource: string;
    detectedEnvironmentVariables: string[];
  } | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/admin/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch {
      // Silencioso
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Cargar productos y reparaciones
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch("/api/products", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch {
      showNotification("Error al cargar productos", "error");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchRepairs = async () => {
    try {
      setIsLoadingRepairs(true);
      const res = await fetch("/api/repairs", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setRepairs(data);
      }
    } catch {
      showNotification("Error al cargar catálogo de reparaciones", "error");
    } finally {
      setIsLoadingRepairs(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchRepairs();
  }, []);

  // ==============================================================
  // FUNCIONES DE INVENTARIO DE EQUIPOS
  // ==============================================================
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormId(`prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
    setFormCategory("iPhone");
    setFormName("");
    setFormSubtitle("");
    setFormDescription("");
    setFormPrice("");
    setFormGrade("Grado A+");
    setFormBattery("");
    setFormTag("");
    setFormImages([]);
    setImageUrlInput("");
    setFormInStock(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: InventoryProduct) => {
    setEditingProduct(prod);
    setFormId(prod.id);
    setFormCategory(prod.category);
    setFormName(prod.name);
    setFormSubtitle(prod.subtitle || "");
    setFormDescription(prod.description || "");
    setFormPrice(prod.price ? prod.price.toString() : "");
    setFormGrade(prod.grade || "Grado A+");
    setFormBattery(prod.battery || "");
    setFormTag(prod.tag || "");
    setFormImages(normalizeProductImages(prod.images, prod.image));
    setImageUrlInput("");
    setFormInStock(prod.inStock !== false);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    e.target.value = "";
    if (selectedFiles.length === 0) return;

    const remainingSlots = MAX_PRODUCT_IMAGES - formImages.length;
    if (remainingSlots <= 0) {
      showNotification(`Máximo ${MAX_PRODUCT_IMAGES} fotos por publicación`, "error");
      return;
    }

    const filesToProcess = selectedFiles.slice(0, remainingSlots);
    const skippedCount = selectedFiles.length - filesToProcess.length;

    try {
      setIsUploading(true);
      const compressedUrls: string[] = [];

      for (const file of filesToProcess) {
        const compressed = await compressImageToDataUrl(file);
        compressedUrls.push(compressed);
      }

      setFormImages((prev) =>
        normalizeProductImages([...prev, ...compressedUrls]).slice(0, MAX_PRODUCT_IMAGES)
      );

      if (skippedCount > 0) {
        showNotification(
          `Se agregaron ${compressedUrls.length} foto(s). El límite es de ${MAX_PRODUCT_IMAGES} fotos por publicación.`,
          "success"
        );
      } else {
        showNotification(
          compressedUrls.length > 1
            ? `${compressedUrls.length} fotos agregadas correctamente`
            : "Foto agregada correctamente",
          "success"
        );
      }
    } catch {
      showNotification("No se pudo procesar la imagen seleccionada", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;

    if (formImages.length >= MAX_PRODUCT_IMAGES) {
      showNotification(`Máximo ${MAX_PRODUCT_IMAGES} fotos por publicación`, "error");
      return;
    }

    if (formImages.includes(trimmed)) {
      showNotification("Esa imagen ya está agregada en esta publicación", "error");
      return;
    }

    setFormImages((prev) => [...prev, trimmed].slice(0, MAX_PRODUCT_IMAGES));
    setImageUrlInput("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetCoverImage = (indexToPromote: number) => {
    if (indexToPromote === 0) return;
    setFormImages((prev) => {
      if (indexToPromote < 0 || indexToPromote >= prev.length) return prev;
      const target = prev[indexToPromote];
      return [target, ...prev.filter((_, idx) => idx !== indexToPromote)];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingProduct) return;

    if (!formName.trim()) {
      showNotification("El nombre o modelo es obligatorio", "error");
      return;
    }

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      showNotification("El precio debe ser un número válido", "error");
      return;
    }

    const cleanedImages = normalizeProductImages(formImages);
    const finalImages = cleanedImages.length > 0 ? cleanedImages : [DEFAULT_PRODUCT_IMAGE];

    const payload = {
      id: editingProduct ? editingProduct.id : formId || `prod-${Date.now()}`,
      category: formCategory,
      name: formName.trim(),
      subtitle: formSubtitle.trim(),
      description: formDescription.trim(),
      price: priceNum,
      grade: formGrade.trim(),
      battery: formBattery.trim(),
      tag: formTag.trim(),
      image: finalImages[0],
      images: finalImages,
      inStock: formInStock
    };

    try {
      setIsSubmittingProduct(true);
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showNotification(
          editingProduct ? "Producto actualizado correctamente" : "Producto publicado en el catálogo",
          "success"
        );
        setIsModalOpen(false);
        fetchProducts();
      } else {
        showNotification("Error al guardar producto", "error");
      }
    } catch {
      showNotification("Error de conexión", "error");
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleClearAllProducts = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar TODOS los productos del catálogo? Esta acción no se puede deshacer.")) {
      return;
    }
    try {
      setIsLoadingProducts(true);
      await fetch("/api/products?id=all", {
        method: "DELETE"
      });
      setProducts([]);
      showNotification("Todos los productos han sido eliminados", "success");
      fetchProducts();
      fetchStatus();
    } catch {
      showNotification("Error al vaciar productos", "error");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Seguro que deseas eliminar "${name}" del inventario?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });

      if (res.ok) {
        showNotification(`"${name}" eliminado del catálogo`, "success");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        showNotification("Error al eliminar", "error");
      }
    } catch {
      showNotification("Error al eliminar producto", "error");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory = 
        selectedCategory === "Todos" || prod.category.toLowerCase() === selectedCategory.toLowerCase();
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        prod.name.toLowerCase().includes(q) ||
        (prod.subtitle || "").toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // ==============================================================
  // FUNCIONES DEL CATÁLOGO DE REPARACIONES
  // ==============================================================
  const handleOpenCreateRepair = () => {
    setEditingRepair(null);
    setRepFormBrand(repairBrandFilter !== "Todas" ? (repairBrandFilter as RepairBrand) : "Apple");
    setRepFormCategory(repairCategoryFilter !== "Todas" ? (repairCategoryFilter as RepairCategory) : "Pantallas");
    setRepFormModel("");
    setRepFormQuality("Original");
    setRepFormCost("");
    setRepFormPrice("");
    setIsRepairModalOpen(true);
  };

  const handleOpenEditRepair = (item: RepairItem) => {
    setEditingRepair(item);
    setRepFormBrand(item.brand);
    setRepFormCategory(item.category);
    setRepFormModel(item.model);
    setRepFormQuality(item.quality);
    setRepFormCost((item.cost ?? 0).toString());
    setRepFormPrice(item.price.toString());
    setIsRepairModalOpen(true);
  };

  // Cuando cambia el costo en el modal de edición y está activa la regla automática de margen
  const handleModalCostChange = (val: string) => {
    setRepFormCost(val);
    if (editingRepair && autoMarginRule) {
      const newCost = parseFloat(val);
      const oldCost = editingRepair.cost ?? 0;
      if (!isNaN(newCost)) {
        const diff = newCost - oldCost;
        if (diff > 0) {
          setRepFormPrice(Number((editingRepair.price + diff).toFixed(2)).toString());
        } else {
          setRepFormPrice(editingRepair.price.toString());
        }
      }
    }
  };

  const handleSubmitRepair = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!repFormModel.trim()) {
      showNotification("El nombre del modelo es obligatorio", "error");
      return;
    }

    const priceNum = parseFloat(repFormPrice);
    const costNum = repFormCost.trim() === "" ? 0 : parseFloat(repFormCost);

    if (isNaN(priceNum) || priceNum < 0 || isNaN(costNum) || costNum < 0) {
      showNotification("Verifica que el costo y el precio sean números válidos", "error");
      return;
    }

    const payload = {
      id: editingRepair ? editingRepair.id : undefined,
      brand: repFormBrand,
      category: repFormCategory,
      model: repFormModel.trim(),
      quality: repFormQuality,
      price: priceNum,
      cost: costNum
    };

    try {
      const method = editingRepair ? "PUT" : "POST";
      const res = await fetch("/api/repairs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        if (editingRepair) {
          setRepairs((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
          showNotification(`Reparación de ${saved.model} actualizada`, "success");
        } else {
          setRepairs((prev) => [saved, ...prev]);
          showNotification(`Reparación de ${saved.model} añadida al catálogo`, "success");
        }
        setIsRepairModalOpen(false);
      } else {
        showNotification("Error al guardar la reparación", "error");
      }
    } catch {
      showNotification("Error de conexión", "error");
    }
  };

  // Iniciar edición rápida en fila
  const startInlineEdit = (item: RepairItem) => {
    setInlineEditId(item.id);
    setInlineCost((item.cost ?? 0).toString());
    setInlinePrice(item.price.toString());
  };

  // Al cambiar el costo en la edición rápida en fila, aplicar la regla si está activa
  const handleInlineCostChange = (val: string, item: RepairItem) => {
    setInlineCost(val);
    if (autoMarginRule) {
      const newCost = parseFloat(val);
      const oldCost = item.cost ?? 0;
      if (!isNaN(newCost)) {
        const diff = newCost - oldCost;
        if (diff > 0) {
          setInlinePrice(Number((item.price + diff).toFixed(2)).toString());
        } else {
          setInlinePrice(item.price.toString());
        }
      }
    }
  };

  const saveInlineEdit = async (item: RepairItem) => {
    const costNum = parseFloat(inlineCost);
    const priceNum = parseFloat(inlinePrice);

    if (isNaN(costNum) || costNum < 0 || isNaN(priceNum) || priceNum < 0) {
      showNotification("Ingresa valores numéricos válidos", "error");
      return;
    }

    try {
      const res = await fetch("/api/repairs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          cost: costNum,
          price: priceNum
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setRepairs((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setInlineEditId(null);
        showNotification(`${item.model} (${item.quality}): $${updated.price}`, "success");
      } else {
        showNotification("No se pudo actualizar el precio", "error");
      }
    } catch {
      showNotification("Error de conexión", "error");
    }
  };

  const handleDeleteRepair = async (item: RepairItem) => {
    if (!confirm(`¿Seguro que deseas eliminar "${item.model} - ${item.category} (${item.quality})"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/repairs?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setRepairs((prev) => prev.filter((r) => r.id !== item.id));
        showNotification(`Reparación de "${item.model}" eliminada`, "success");
      } else {
        showNotification("Error al eliminar la reparación", "error");
      }
    } catch {
      showNotification("Error de conexión al eliminar", "error");
    }
  };

  const filteredRepairs = useMemo(() => {
    return repairs.filter((item) => {
      const matchesBrand =
        repairBrandFilter === "Todas" || item.brand === repairBrandFilter;
      const matchesCat =
        repairCategoryFilter === "Todas" || item.category === repairCategoryFilter;

      const q = repairSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.model.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.quality.toLowerCase().includes(q);

      return matchesBrand && matchesCat && matchesSearch;
    });
  }, [repairs, repairBrandFilter, repairCategoryFilter, repairSearch]);

  const averageMargin = useMemo(() => {
    if (filteredRepairs.length === 0) return 0;
    const totalMargin = filteredRepairs.reduce(
      (acc, r) => acc + (r.price - (r.cost ?? 0)),
      0
    );
    return totalMargin / filteredRepairs.length;
  }, [filteredRepairs]);

  // PANTALLA DE CARGA / BLOQUEO POR PIN
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F7FC] flex flex-col items-center justify-center p-6 selection:bg-zinc-900 selection:text-white">
        <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 sm:p-9 shadow-2xl border border-black/[0.06] text-center animate-scaleIn">
          
          {/* Logo con insignia de candado */}
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-white border border-black/[0.08] shadow-sm flex items-center justify-center p-1.5">
              <img src="/logo.jpg" alt="TecnoTrade" className="w-full h-full object-contain" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-3 h-3" />
            </div>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-zinc-950 mb-1">
            Panel de Administración
          </h1>
          <p className="text-xs text-zinc-500 mb-6">
            Ingresa tu PIN de seguridad para acceder
          </p>

          {/* Indicadores de 6 dígitos (Círculos) */}
          <div 
            onClick={() => pinInputRef.current?.focus()} 
            className="flex items-center justify-center gap-3.5 mb-6 cursor-pointer"
          >
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const isFilled = index < pinInput.length;
              return (
                <div
                  key={index}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                    isFilled
                      ? "bg-zinc-950 scale-110 shadow-xs"
                      : "border-2 border-zinc-300 bg-white"
                  }`}
                />
              );
            })}
          </div>

          {/* Input oculto para captura nativa en teclado móvil y PC */}
          <input
            ref={pinInputRef}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pinInput}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setPinInput(val);
              setPinError("");
              if (val.length === 6) {
                handlePinSubmit(val);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && pinInput.length > 0) {
                handlePinSubmit();
              }
            }}
            className="opacity-0 absolute -z-10 pointer-events-none"
            autoFocus
          />

          {pinError && (
            <p className="text-xs font-semibold text-red-600 mb-4 animate-shake">
              {pinError}
            </p>
          )}

          {/* Teclado numérico táctil */}
          <div className="grid grid-cols-3 gap-2.5 mb-6 max-w-[240px] mx-auto">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handlePinDigit(digit)}
                className="h-12 rounded-2xl bg-[#F5F7FC] hover:bg-zinc-200 text-base font-bold text-zinc-900 transition-all active:scale-95 btn-tactile"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handlePinClear}
              className="h-12 rounded-2xl text-xs font-semibold text-zinc-500 hover:text-black transition-all active:scale-95"
            >
              C
            </button>
            <button
              type="button"
              onClick={() => handlePinDigit("0")}
              className="h-12 rounded-2xl bg-[#F5F7FC] hover:bg-zinc-200 text-base font-bold text-zinc-900 transition-all active:scale-95 btn-tactile"
            >
              0
            </button>
            <button
              type="button"
              onClick={handlePinBackspace}
              className="h-12 rounded-2xl text-xs font-semibold text-zinc-500 hover:text-black transition-all active:scale-95 flex items-center justify-center"
            >
              ⌫
            </button>
          </div>

          {/* Checkbox de recordar sesión */}
          <label className="flex items-center justify-center gap-2 text-xs text-zinc-600 cursor-pointer select-none mb-6">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="w-4 h-4 rounded accent-zinc-900 cursor-pointer"
            />
            <span>Recordar sesión en este equipo</span>
          </label>

          {/* Botón de desbloqueo */}
          <button
            onClick={() => handlePinSubmit()}
            disabled={isVerifyingPin || pinInput.length === 0}
            className="w-full bg-zinc-950 hover:bg-black text-white text-xs sm:text-sm font-semibold py-3 rounded-2xl transition-all disabled:opacity-40 btn-tactile shadow-md"
          >
            {isVerifyingPin ? "Verificando..." : "Desbloquear Panel"}
          </button>

          {/* Volver a la tienda */}
          <div className="mt-5 pt-4 border-t border-black/[0.05]">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-900 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Tienda</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA] text-[#111111] font-sans pb-24 selection:bg-[#111111] selection:text-white">
      
      {/* NOTIFICACIÓN FLOTANTE */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-slideDown border ${
          notification.type === "success" 
            ? "bg-zinc-900 text-white border-white/10" 
            : "bg-red-600 text-white border-red-500"
        }`}>
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
          )}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* HEADER DEL PANEL */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/[0.05]">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-black bg-[#F4F4F6] hover:bg-zinc-200/70 px-3.5 py-2 rounded-full transition-all btn-tactile"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Tienda</span>
            </Link>

            <div className="hidden sm:block w-px h-5 bg-black/[0.08]" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-zinc-900 block leading-tight">
                  TecnoTrade
                </span>
                <span className="text-[10px] bg-zinc-900 text-white font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <span className="text-xs text-zinc-500 font-normal block">
                Gestión de equipos en venta y tarifas de taller
              </span>
            </div>
          </div>

          {adminTab === "inventario" ? (
            <button
              onClick={handleOpenCreate}
              className="bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm btn-tactile"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Producto</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCreateRepair}
              className="bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm btn-tactile"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Reparación</span>
            </button>
          )}
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-6 pt-8">

        {/* SELECTOR DE MÓDULO (INVENTARIO DE VENTA VS CATÁLOGO DE REPARACIONES) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="inline-flex p-1.5 bg-white rounded-full border border-black/[0.06] shadow-2xs">
            <button
              onClick={() => setAdminTab("inventario")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all btn-tactile ${
                adminTab === "inventario"
                  ? "bg-zinc-900 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Equipos en Venta ({products.length})</span>
            </button>
            <button
              onClick={() => setAdminTab("reparaciones")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all btn-tactile ${
                adminTab === "reparaciones"
                  ? "bg-zinc-900 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Catálogo de Reparaciones ({repairs.length})</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MÓDULO 1: EQUIPOS EN VENTA */}
        {/* ============================================================== */}
        {adminTab === "inventario" && (
          <>
            {/* MÉTRICAS RÁPIDAS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-3xl border border-black/[0.05] shadow-xs">
                <span className="text-xs font-medium text-zinc-500 block">Total Productos</span>
                <span className="text-2xl font-bold text-zinc-900 mt-1 block">{products.length}</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-black/[0.05] shadow-xs">
                <span className="text-xs font-medium text-zinc-500 block">En Stock</span>
                <span className="text-2xl font-bold text-emerald-600 mt-1 block">
                  {products.filter((p) => p.inStock).length}
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-black/[0.05] shadow-xs">
                <span className="text-xs font-medium text-zinc-500 block">Categorías</span>
                <span className="text-2xl font-bold text-zinc-900 mt-1 block">
                  {new Set(products.map((p) => p.category)).size}
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-black/[0.05] shadow-xs">
                <span className="text-xs font-medium text-zinc-500 block">Covers & Accesorios</span>
                <span className="text-2xl font-bold text-blue-600 mt-1 block">
                  {products.filter((p) => p.category === "Covers & Fundas" || p.category === "Accesorios" || p.category === "Otros").length}
                </span>
              </div>
            </div>

            {/* BARRA DE FILTROS Y BÚSQUEDA */}
            <div className="bg-white p-6 rounded-3xl border border-black/[0.05] shadow-xs mb-8 space-y-4">
              <div className="bg-[#FAF9F8] rounded-2xl px-4 py-3 flex items-center gap-3 border border-black/[0.05] focus-within:border-black/20 transition-all">
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, modelo, capacidad o categoría..."
                  className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-zinc-400 hover:text-black">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {["Todos", ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border btn-tactile ${
                      selectedCategory === cat
                        ? "bg-zinc-900 text-white border-zinc-900 font-semibold shadow-2xs"
                        : "bg-[#FAF9F8] text-zinc-700 border-black/[0.04] hover:border-black/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* LISTADO DE PRODUCTOS */}
            {isLoadingProducts ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-black/[0.05]">
                <p className="text-xs text-zinc-500">Cargando catálogo...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((prod) => {
                  const gallery = normalizeProductImages(prod.images, prod.image);
                  const coverImage = gallery[0] || DEFAULT_PRODUCT_IMAGE;
                  return (
                  <div 
                    key={prod.id}
                    className="bg-white rounded-3xl p-5 border border-black/[0.05] shadow-xs flex flex-col justify-between minimal-card-hover group"
                  >
                    <div>
                      <div className="relative h-48 rounded-2xl bg-[#F4F4F6] overflow-hidden mb-4 flex items-center justify-center p-2">
                        <img 
                          src={coverImage} 
                          alt={prod.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-white/95 text-zinc-900 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                          {prod.category}
                        </span>
                        {prod.battery && (
                          <span className="absolute top-3 right-3 bg-zinc-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {prod.battery}
                          </span>
                        )}
                        {gallery.length > 1 && (
                          <span className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Images className="w-3 h-3" />
                            <span>{gallery.length}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-zinc-500 font-medium">
                          {prod.grade || "Nuevo"}
                        </span>
                        {prod.tag && (
                          <span className="text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full font-medium">
                            {prod.tag}
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-base text-zinc-900 leading-snug">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5 mb-4 line-clamp-2">
                        {prod.subtitle || "Sin detalles adicionales"}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] text-zinc-400 block uppercase font-medium">Precio</span>
                        <span className="text-xl font-bold text-zinc-900 tracking-tight">
                          ${prod.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-2 rounded-xl bg-[#FAF9F8] hover:bg-zinc-200/80 text-zinc-700 hover:text-black transition-colors"
                          title="Editar publicación"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Eliminar publicación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center border border-black/[0.05]">
                <Package className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-zinc-800">No se encontraron productos</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto mb-6">
                  Prueba cambiando la búsqueda o publica un nuevo equipo o accesorio.
                </p>
                <button
                  onClick={handleOpenCreate}
                  className="bg-zinc-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 btn-tactile"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar Ahora</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* MÓDULO 2: CATÁLOGO DE REPARACIONES */}
        {/* ============================================================== */}
        {adminTab === "reparaciones" && (
          <>
            {/* MÉTRICAS RÁPIDAS DE TALLER */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-3xl border border-black/[0.05] shadow-xs">
                <span className="text-xs font-medium text-zinc-500 block">Total Reparaciones</span>
                <span className="text-2xl font-bold text-zinc-900 mt-1 block">{repairs.length}</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-black/[0.05] shadow-xs">
                <span className="text-xs font-medium text-zinc-500 block">Pantallas</span>
                <span className="text-2xl font-bold text-zinc-900 mt-1 block">
                  {repairs.filter((r) => r.category === "Pantallas").length}
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-black/[0.05] shadow-xs">
                <span className="text-xs font-medium text-zinc-500 block">Tapas & Puertos</span>
                <span className="text-2xl font-bold text-zinc-900 mt-1 block">
                  {repairs.filter((r) => r.category !== "Pantallas").length}
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-black/[0.05] shadow-xs">
                <span className="text-xs font-medium text-zinc-500 block">Margen Promedio</span>
                <span className="text-2xl font-bold text-emerald-600 mt-1 block">
                  +${averageMargin.toFixed(1)}
                </span>
              </div>
            </div>

            {/* FILTROS Y REGLA DE MARGEN AUTOMÁTICO */}
            <div className="bg-white p-6 rounded-3xl border border-black/[0.05] shadow-xs mb-6 space-y-4">
              {/* Buscador */}
              <div className="bg-[#FAF9F8] rounded-2xl px-4 py-3 flex items-center gap-3 border border-black/[0.05] focus-within:border-black/20 transition-all">
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={repairSearch}
                  onChange={(e) => setRepairSearch(e.target.value)}
                  placeholder="Buscar modelo o pieza (ej: iPhone 16 Pro, S24 Ultra, Redmi Note 14, OLED)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 focus:outline-none"
                />
                {repairSearch && (
                  <button onClick={() => setRepairSearch("")} className="text-zinc-400 hover:text-black">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                {/* Filtro por Marca */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase mr-1">Marca:</span>
                  {["Todas", ...REPAIR_BRANDS].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setRepairBrandFilter(brand)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border btn-tactile ${
                        repairBrandFilter === brand
                          ? "bg-zinc-900 text-white border-zinc-900 font-semibold"
                          : "bg-[#FAF9F8] text-zinc-700 border-black/[0.04] hover:border-black/20"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>

                {/* Filtro por Categoría */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase mr-1">Pieza:</span>
                  {["Todas", ...REPAIR_CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setRepairCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border btn-tactile ${
                        repairCategoryFilter === cat
                          ? "bg-zinc-900 text-white border-zinc-900 font-semibold"
                          : "bg-[#FAF9F8] text-zinc-700 border-black/[0.04] hover:border-black/20"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Regla Automática de Margen */}
              <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between flex-wrap gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoMarginRule}
                    onChange={(e) => setAutoMarginRule(e.target.checked)}
                    className="w-4 h-4 rounded accent-zinc-900 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-700">
                    <strong className="font-semibold text-zinc-900">Regla automática de margen:</strong> si el costo de la pieza sube, sumar la diferencia exacta al precio del cliente; si baja, mantener el precio igual.
                  </span>
                </label>

                <span className="text-xs text-zinc-400">
                  Mostrando <strong className="text-zinc-700">{filteredRepairs.length}</strong> resultados
                </span>
              </div>
            </div>

            {/* TABLA DE REPARACIONES EDITABLE */}
            {isLoadingRepairs ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-black/[0.05]">
                <p className="text-xs text-zinc-500">Cargando catálogo de reparaciones...</p>
              </div>
            ) : filteredRepairs.length > 0 ? (
              <div className="bg-white rounded-3xl border border-black/[0.05] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-black/[0.06] bg-[#FAF9F8] text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Marca / Modelo</th>
                        <th className="py-3.5 px-4">Pieza</th>
                        <th className="py-3.5 px-4">Calidad</th>
                        <th className="py-3.5 px-4 text-right">Costo Pieza</th>
                        <th className="py-3.5 px-4 text-right">Precio Cliente</th>
                        <th className="py-3.5 px-4 text-right">Margen</th>
                        <th className="py-3.5 px-5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04] text-xs sm:text-sm">
                      {filteredRepairs.map((item) => {
                        const isInline = inlineEditId === item.id;
                        const currentCost = isInline ? parseFloat(inlineCost) || 0 : item.cost ?? 0;
                        const currentPrice = isInline ? parseFloat(inlinePrice) || 0 : item.price;
                        const margin = currentPrice - currentCost;

                        return (
                          <tr
                            key={item.id}
                            className={`transition-colors ${
                              isInline ? "bg-amber-50/50" : "hover:bg-[#FAF9F8]/80"
                            }`}
                          >
                            {/* Marca y Modelo */}
                            <td className="py-3.5 px-5">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                                {item.brand}
                              </span>
                              <span className="font-semibold text-zinc-900">{item.model}</span>
                            </td>

                            {/* Categoría */}
                            <td className="py-3.5 px-4 text-zinc-600 font-medium">
                              {item.category}
                            </td>

                            {/* Calidad */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                  item.quality === "Original" || item.quality === "Servipack"
                                    ? "bg-zinc-900 text-white"
                                    : item.quality === "OLED"
                                    ? "bg-zinc-200 text-zinc-900"
                                    : "bg-zinc-100 text-zinc-600"
                                }`}
                              >
                                {item.quality}
                              </span>
                            </td>

                            {/* Costo Pieza */}
                            <td className="py-3.5 px-4 text-right">
                              {isInline ? (
                                <div className="inline-flex items-center justify-end">
                                  <span className="text-zinc-400 mr-1">$</span>
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={inlineCost}
                                    onChange={(e) => handleInlineCostChange(e.target.value, item)}
                                    className="w-20 bg-white border border-black/20 rounded-lg px-2 py-1 text-right font-semibold text-zinc-900 focus:outline-none focus:border-black"
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <button
                                  onClick={() => startInlineEdit(item)}
                                  className="text-zinc-500 hover:text-zinc-900 font-medium underline decoration-dotted underline-offset-4"
                                  title="Clic para editar costo rápido"
                                >
                                  ${(item.cost ?? 0).toFixed(2)}
                                </button>
                              )}
                            </td>

                            {/* Precio Cliente */}
                            <td className="py-3.5 px-4 text-right">
                              {isInline ? (
                                <div className="inline-flex items-center justify-end">
                                  <span className="text-zinc-400 mr-1">$</span>
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={inlinePrice}
                                    onChange={(e) => setInlinePrice(e.target.value)}
                                    className="w-20 bg-white border border-black/20 rounded-lg px-2 py-1 text-right font-bold text-zinc-950 focus:outline-none focus:border-black"
                                  />
                                </div>
                              ) : (
                                <button
                                  onClick={() => startInlineEdit(item)}
                                  className="font-bold text-zinc-950 hover:text-black underline decoration-dotted underline-offset-4"
                                  title="Clic para editar precio rápido"
                                >
                                  ${item.price.toFixed(2)}
                                </button>
                              )}
                            </td>

                            {/* Margen */}
                            <td className="py-3.5 px-4 text-right">
                              <span
                                className={`font-semibold text-xs px-2 py-0.5 rounded-full ${
                                  margin >= 20
                                    ? "bg-emerald-50 text-emerald-700"
                                    : margin > 0
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                +${margin.toFixed(2)}
                              </span>
                            </td>

                            {/* Acciones */}
                            <td className="py-3.5 px-5 text-right">
                              {isInline ? (
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => saveInlineEdit(item)}
                                    className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                                    title="Guardar cambios"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setInlineEditId(null)}
                                    className="p-1.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-700 transition-colors"
                                    title="Cancelar"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditRepair(item)}
                                    className="p-1.5 rounded-xl bg-[#FAF9F8] hover:bg-zinc-200/80 text-zinc-700 hover:text-black transition-colors"
                                    title="Editar todos los datos"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRepair(item)}
                                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                    title="Eliminar reparación"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center border border-black/[0.05]">
                <Wrench className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-zinc-800">No se encontraron reparaciones con estos filtros</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto mb-6">
                  Prueba cambiando la marca/categoría o agrega una nueva pieza al catálogo.
                </p>
                <button
                  onClick={handleOpenCreateRepair}
                  className="bg-zinc-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 btn-tactile"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Reparación</span>
                </button>
              </div>
            )}
          </>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODAL 1: CREAR O EDITAR PRODUCTO DE VENTA */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-black/[0.08] p-6 sm:p-8 my-8 animate-scaleIn max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-6">
              <div>
                <h3 className="font-semibold text-xl text-zinc-900">
                  {editingProduct ? "Editar Publicación" : "Publicar Nuevo Producto"}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Los cambios se reflejan de inmediato en la tienda virtual
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                  Categoría
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                  className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-medium focus:outline-none focus:border-black/30"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                  Nombre o Modelo *
                </label>
                <input 
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: iPhone 15 Pro, Cover MagSafe Cuero, Cargador 67W..."
                  required
                  className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-black/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                  Subtítulo / Especificaciones Cortas
                </label>
                <input 
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Ej: Titanio Natural · 128 GB · Liberado de fábrica"
                  className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-black/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                  Descripción Completa (Vista Marketplace)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe estado físico, accesorios incluidos, Face ID / True Tone, garantía o detalles clave que verá el cliente al abrir la publicación..."
                  className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-black/30 resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Precio ($ USD) *
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="Ej: 450.00"
                    required
                    className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-bold focus:outline-none focus:border-black/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Condición / Grado
                  </label>
                  <input 
                    type="text"
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value)}
                    placeholder="Ej: Grado A+, Nuevo en caja, Impecable..."
                    className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-black/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Salud de Batería (Opcional)
                  </label>
                  <input 
                    type="text"
                    value={formBattery}
                    onChange={(e) => setFormBattery(e.target.value)}
                    placeholder="Ej: 98% Salud (solo para teléfonos)"
                    className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-black/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Etiqueta Destacada
                  </label>
                  <input 
                    type="text"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    placeholder="Ej: Top Ventas, MagSafe, Oferta..."
                    className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-black/30"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Fotos del Producto ({formImages.length} / {MAX_PRODUCT_IMAGES})
                  </label>
                  {formImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormImages([])}
                      className="text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                    >
                      Quitar todas
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {/* Inputs ocultos para galería (múltiple) y cámara directa */}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />

                  {/* Galería de hasta 3 slots con opción de quitar o marcar como portada */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {Array.from({ length: MAX_PRODUCT_IMAGES }).map((_, slotIdx) => {
                      const imgSrc = formImages[slotIdx];
                      if (imgSrc) {
                        return (
                          <div
                            key={`${slotIdx}-${imgSrc.slice(0, 32)}`}
                            className="relative aspect-square rounded-2xl bg-[#F4F4F6] overflow-hidden border border-black/[0.08] group"
                          >
                            <img
                              src={imgSrc}
                              alt={`Foto ${slotIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Botón siempre visible para quitar la foto */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(slotIdx)}
                              title="Quitar esta foto"
                              aria-label={`Quitar foto ${slotIdx + 1}`}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            {slotIdx === 0 ? (
                              <span className="absolute bottom-1.5 left-1.5 bg-zinc-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                Portada
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetCoverImage(slotIdx)}
                                className="absolute bottom-1.5 left-1.5 bg-white/95 hover:bg-white text-zinc-900 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs cursor-pointer"
                                title="Usar como foto principal"
                              >
                                Hacer portada
                              </button>
                            )}
                          </div>
                        );
                      }

                      const canUploadHere = formImages.length < MAX_PRODUCT_IMAGES && !isUploading;
                      return (
                        <button
                          key={`empty-${slotIdx}`}
                          type="button"
                          disabled={!canUploadHere}
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-2xl border-2 border-dashed border-zinc-300 hover:border-zinc-500 bg-[#FAF9F8] flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-[10px] font-semibold">
                            {slotIdx === 0 ? "Portada" : `Foto ${slotIdx + 1}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Botones de carga (Galería / Cámara) y campo de URL */}
                  {formImages.length < MAX_PRODUCT_IMAGES ? (
                    <>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 btn-tactile disabled:opacity-50 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {isUploading
                              ? "Procesando..."
                              : `Subir fotos (${MAX_PRODUCT_IMAGES - formImages.length} disp.)`}
                          </span>
                        </button>

                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => cameraInputRef.current?.click()}
                          className="bg-[#F4F4F6] hover:bg-zinc-200 text-zinc-900 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 btn-tactile disabled:opacity-50 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Cámara</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input 
                          type="url"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddImageUrl();
                            }
                          }}
                          placeholder="O pega un enlace web (https://...)"
                          className="flex-1 bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-black/30"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          disabled={!imageUrlInput.trim()}
                          className="px-3.5 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-900 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                        >
                          Agregar URL
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded-xl px-3 py-2">
                      Ya subiste el máximo de {MAX_PRODUCT_IMAGES} fotos. Puedes quitar alguna con la X para reemplazarla.
                    </p>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formInStock}
                  onChange={(e) => setFormInStock(e.target.checked)}
                  className="w-4 h-4 rounded accent-zinc-900 cursor-pointer"
                />
                <span className="text-xs font-semibold text-zinc-700">
                  Equipo disponible en stock (desmarca para mostrar como Agotado)
                </span>
              </label>

              <div className="pt-4 border-t border-black/[0.06] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-600 hover:text-black bg-zinc-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct || isUploading}
                  className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-zinc-950 hover:bg-black transition-all shadow-md btn-tactile disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingProduct
                    ? editingProduct
                      ? "Guardando..."
                      : "Publicando..."
                    : editingProduct
                      ? "Guardar Cambios"
                      : "Publicar en Tienda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: CREAR O EDITAR REPARACIÓN DEL CATÁLOGO */}
      {/* ============================================================== */}
      {isRepairModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-black/[0.08] p-6 sm:p-8 my-8 animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-6">
              <div>
                <h3 className="font-semibold text-xl text-zinc-900">
                  {editingRepair ? "Editar Reparación" : "Nueva Reparación"}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Se actualizará de inmediato en el cotizador de servicio técnico
                </p>
              </div>
              <button
                onClick={() => setIsRepairModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRepair} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Marca *
                  </label>
                  <select
                    value={repFormBrand}
                    onChange={(e) => setRepFormBrand(e.target.value as RepairBrand)}
                    className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-medium focus:outline-none focus:border-black/30"
                  >
                    {REPAIR_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Pieza / Categoría *
                  </label>
                  <select
                    value={repFormCategory}
                    onChange={(e) => setRepFormCategory(e.target.value as RepairCategory)}
                    className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-medium focus:outline-none focus:border-black/30"
                  >
                    {REPAIR_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={repFormModel}
                    onChange={(e) => setRepFormModel(e.target.value)}
                    placeholder="Ej: iPhone 16 Pro, Galaxy S25 Ultra..."
                    required
                    className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-black/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Calidad *
                  </label>
                  <select
                    value={repFormQuality}
                    onChange={(e) => setRepFormQuality(e.target.value as RepairQuality)}
                    className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-medium focus:outline-none focus:border-black/30"
                  >
                    {REPAIR_QUALITIES.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Costo de Pieza ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={repFormCost}
                    onChange={(e) => handleModalCostChange(e.target.value)}
                    placeholder="Ej: 45.00"
                    className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-semibold focus:outline-none focus:border-black/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Precio al Cliente ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={repFormPrice}
                    onChange={(e) => setRepFormPrice(e.target.value)}
                    placeholder="Ej: 85.00"
                    required
                    className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-bold focus:outline-none focus:border-black/30"
                  />
                </div>
              </div>

              {repFormPrice && (
                <div className="bg-[#FAF9F8] rounded-2xl p-3.5 border border-black/[0.05] flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Margen estimado con instalación:</span>
                  <span className="font-bold text-emerald-700">
                    +${((parseFloat(repFormPrice) || 0) - (parseFloat(repFormCost) || 0)).toFixed(2)} USD
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-black/[0.06] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRepairModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-600 hover:text-black bg-zinc-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-zinc-950 hover:bg-black transition-all shadow-md btn-tactile"
                >
                  {editingRepair ? "Guardar Cambios" : "Agregar al Catálogo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
