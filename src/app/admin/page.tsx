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
  CheckCircle2, 
  AlertCircle, 
  X, 
  Layers, 
  DollarSign, 
  Package, 
  ExternalLink,
  RotateCcw,
  Image as ImageIcon
} from "lucide-react";
import { InventoryProduct, ProductCategory } from "@/types/inventory";

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

export default function AdminPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  // Estado del Modal (Crear / Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);

  // Campos del formulario
  const [formCategory, setFormCategory] = useState<ProductCategory>("iPhone");
  const [formName, setFormName] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formGrade, setFormGrade] = useState("Grado A+");
  const [formBattery, setFormBattery] = useState("");
  const [formTag, setFormTag] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formInStock, setFormInStock] = useState(true);

  // Estado de subida de imagen
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar productos desde la API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      showNotification("Error al cargar productos", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormCategory("iPhone");
    setFormName("");
    setFormSubtitle("");
    setFormPrice("");
    setFormGrade("Grado A+");
    setFormBattery("");
    setFormTag("");
    setFormImage("");
    setFormInStock(true);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (prod: InventoryProduct) => {
    setEditingProduct(prod);
    setFormCategory(prod.category);
    setFormName(prod.name);
    setFormSubtitle(prod.subtitle || "");
    setFormPrice(prod.price ? prod.price.toString() : "");
    setFormGrade(prod.grade || "Grado A+");
    setFormBattery(prod.battery || "");
    setFormTag(prod.tag || "");
    setFormImage(prod.image || "");
    setFormInStock(prod.inStock !== false);
    setIsModalOpen(true);
  };

  // Subir imagen desde la computadora / celular
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setFormImage(data.url);
        showNotification("Foto subida correctamente", "success");
      } else {
        showNotification("Error al subir imagen", "error");
      }
    } catch (error) {
      showNotification("Error de conexión al subir imagen", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Guardar (Crear o Editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showNotification("El nombre o modelo es obligatorio", "error");
      return;
    }

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      showNotification("El precio debe ser un número válido", "error");
      return;
    }

    const payload = {
      id: editingProduct ? editingProduct.id : undefined,
      category: formCategory,
      name: formName.trim(),
      subtitle: formSubtitle.trim(),
      price: priceNum,
      grade: formGrade.trim(),
      battery: formBattery.trim(),
      tag: formTag.trim(),
      image: formImage.trim() || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80",
      inStock: formInStock
    };

    try {
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
    } catch (error) {
      showNotification("Error de conexión", "error");
    }
  };

  // Eliminar producto
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
    } catch (error) {
      showNotification("Error al eliminar producto", "error");
    }
  };

  // Filtrado de productos en la tabla
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
                  Inventario
                </span>
              </div>
              <span className="text-xs text-zinc-500 font-normal block">
                Gestión de teléfonos, repuestos y accesorios
              </span>
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm btn-tactile"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Producto</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-6 pt-10">

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
          
          {/* Buscador */}
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

          {/* Chips de Categorías */}
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
        {isLoading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-black/[0.05]">
            <p className="text-xs text-zinc-500">Cargando catálogo...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((prod) => (
              <div 
                key={prod.id}
                className="bg-white rounded-3xl p-5 border border-black/[0.05] shadow-xs flex flex-col justify-between minimal-card-hover group"
              >
                <div>
                  {/* Foto y Badges */}
                  <div className="relative h-48 rounded-2xl bg-[#F4F4F6] overflow-hidden mb-4 flex items-center justify-center p-2">
                    <img 
                      src={prod.image} 
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
                  </div>

                  {/* Textos */}
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

                {/* Footer de Tarjeta con Precio y Botones */}
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
            ))}
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

      </main>

      {/* ============================================================== */}
      {/* MODAL PARA CREAR O EDITAR PRODUCTO */}
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
              
              {/* Categoría */}
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

              {/* Nombre / Modelo */}
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

              {/* Subtítulo / Detalles */}
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                  Subtítulo / Especificaciones
                </label>
                <input 
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Ej: Titanio Natural · 128 GB, Para iPhone 13 a 16 Pro..."
                  className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-black/30"
                />
              </div>

              {/* Precio y Grado (2 Columnas) */}
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

              {/* Salud de Batería y Tag */}
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

              {/* Imagen del Producto: Subir archivo o Pegar URL */}
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                  Foto del Producto
                </label>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 btn-tactile disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? "Subiendo foto..." : "Subir foto desde PC o Celular"}</span>
                    </button>
                    <span className="text-[11px] text-zinc-400">o ingresa enlace web abajo</span>
                  </div>

                  <input 
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://... o ruta de archivo subido"
                    className="w-full bg-[#FAF9F8] border border-black/[0.06] rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-black/30"
                  />

                  {/* Vista Previa de la Foto */}
                  {formImage && (
                    <div className="w-24 h-24 rounded-2xl bg-zinc-100 overflow-hidden border border-black/[0.08] p-1 flex items-center justify-center">
                      <img 
                        src={formImage} 
                        alt="Vista previa" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Guardar */}
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
                  className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-zinc-950 hover:bg-black transition-all shadow-md btn-tactile"
                >
                  {editingProduct ? "Guardar Cambios" : "Publicar en Tienda"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
