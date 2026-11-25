import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/storage";
import {
  DEFAULT_PRODUCT_IMAGE,
  InventoryProduct,
  normalizeProductImages,
} from "@/types/inventory";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0"
};

// GET: Obtener todos los productos (recibe request para evaluar dinámicamente)
export async function GET(_request: Request) {
  const products = await getProducts();
  return NextResponse.json(products, {
    headers: NO_CACHE_HEADERS
  });
}

// POST: Crear nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const products = await getProducts();

    const productId = body.id || `prod-${Date.now()}`;

    // 1. Verificación por ID único (Idempotencia: si ya existe por ID, no duplicar)
    const existingById = products.find((p) => p.id === productId);
    if (existingById) {
      console.log(`[Products API] Producto ya existente por ID evitado: ${productId}`);
      return NextResponse.json(existingById, { 
        status: 200, 
        headers: NO_CACHE_HEADERS 
      });
    }

    const normalizedImages = normalizeProductImages(body.images, body.image);
    const primaryImage = normalizedImages[0] || DEFAULT_PRODUCT_IMAGE;

    const newProduct: InventoryProduct = {
      id: productId,
      category: body.category || "Otros",
      name: body.name || "Sin nombre",
      subtitle: body.subtitle || "",
      description: typeof body.description === "string" ? body.description.trim() : "",
      price: Number(body.price) || 0,
      grade: body.grade || "Nuevo",
      battery: body.battery || "",
      tag: body.tag || "",
      colors: Array.isArray(body.colors) ? body.colors : ["#111111"],
      image: primaryImage,
      images: normalizedImages.length > 0 ? normalizedImages : [primaryImage],
      inStock: body.inStock !== false,
      createdAt: new Date().toISOString()
    };

    // Prevenir duplicados accidentales (doble clic o reenvío rápido de red)
    const now = Date.now();
    const existingDuplicate = products.find((p) => {
      const isSameName = p.name.trim().toLowerCase() === newProduct.name.trim().toLowerCase();
      const isSameCategory = p.category === newProduct.category;
      const isSamePrice = p.price === newProduct.price;
      const isSameSubtitle = (p.subtitle || "").trim().toLowerCase() === (newProduct.subtitle || "").trim().toLowerCase();
      if (!isSameName || !isSameCategory || !isSamePrice || !isSameSubtitle) return false;

      const createdTime = p.createdAt ? new Date(p.createdAt).getTime() : 0;
      return (now - createdTime) < 15000; // Creado hace menos de 15 segundos
    });

    if (existingDuplicate) {
      console.log(`[Products API] Duplicado evitado para: ${newProduct.name}`);
      return NextResponse.json(existingDuplicate, { 
        status: 200,
        headers: NO_CACHE_HEADERS
      });
    }

    // Agregar al inicio del inventario
    const updated = [newProduct, ...products];
    await saveProducts(updated);

    return NextResponse.json(newProduct, { 
      status: 201,
      headers: NO_CACHE_HEADERS
    });
  } catch (error) {
    console.error("Error en POST /api/products:", error);
    return NextResponse.json({ error: "Error al crear el producto" }, { status: 500 });
  }
}

// PUT: Editar producto existente
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID de producto requerido" }, { status: 400 });
    }

    const products = await getProducts();
    const index = products.findIndex((p) => p.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    const existing = products[index];
    const hasImagesField = body.images !== undefined;
    const hasImageField = body.image !== undefined;
    const normalizedImages =
      hasImagesField || hasImageField
        ? normalizeProductImages(
            hasImagesField ? body.images : undefined,
            hasImageField ? body.image : undefined
          )
        : normalizeProductImages(existing.images, existing.image);

    const primaryImage = normalizedImages[0] || DEFAULT_PRODUCT_IMAGE;

    const updatedProduct: InventoryProduct = {
      ...existing,
      category: body.category || existing.category,
      name: body.name || existing.name,
      subtitle: body.subtitle !== undefined ? body.subtitle : existing.subtitle,
      description:
        body.description !== undefined
          ? typeof body.description === "string"
            ? body.description.trim()
            : ""
          : existing.description,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      grade: body.grade !== undefined ? body.grade : existing.grade,
      battery: body.battery !== undefined ? body.battery : existing.battery,
      tag: body.tag !== undefined ? body.tag : existing.tag,
      colors: Array.isArray(body.colors) ? body.colors : existing.colors,
      image: primaryImage,
      images: normalizedImages.length > 0 ? normalizedImages : [primaryImage],
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : existing.inStock
    };

    products[index] = updatedProduct;
    await saveProducts(products);

    return NextResponse.json(updatedProduct, {
      headers: NO_CACHE_HEADERS
    });
  } catch (error) {
    console.error("Error en PUT /api/products:", error);
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

// DELETE: Eliminar producto (o id=all para vaciar catálogo completo)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    if (id === "all") {
      await saveProducts([]);
      return NextResponse.json({ success: true, message: "Inventario vaciado por completo" }, {
        headers: NO_CACHE_HEADERS
      });
    }

    const products = await getProducts();
    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    await saveProducts(filtered);
    return NextResponse.json({ success: true, deletedId: id }, {
      headers: NO_CACHE_HEADERS
    });
  } catch (error) {
    console.error("Error en DELETE /api/products:", error);
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
