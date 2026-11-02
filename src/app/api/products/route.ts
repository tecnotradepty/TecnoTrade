import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { InventoryProduct } from "@/types/inventory";

const INVENTORY_FILE = path.join(process.cwd(), "src", "data", "inventory.json");

function readInventory(): InventoryProduct[] {
  try {
    if (!fs.existsSync(INVENTORY_FILE)) {
      return [];
    }
    const data = fs.readFileSync(INVENTORY_FILE, "utf-8");
    return JSON.parse(data) as InventoryProduct[];
  } catch (error) {
    console.error("Error reading inventory:", error);
    return [];
  }
}

function writeInventory(products: InventoryProduct[]): boolean {
  try {
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing inventory:", error);
    return false;
  }
}

// GET: Obtener todos los productos
export async function GET() {
  const products = readInventory();
  return NextResponse.json(products);
}

// POST: Crear nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const products = readInventory();

    const newProduct: InventoryProduct = {
      id: body.id || `prod-${Date.now()}`,
      category: body.category || "Otros",
      name: body.name || "Sin nombre",
      subtitle: body.subtitle || "",
      price: Number(body.price) || 0,
      grade: body.grade || "Nuevo",
      battery: body.battery || "",
      tag: body.tag || "",
      colors: Array.isArray(body.colors) ? body.colors : ["#111111"],
      image: body.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80",
      inStock: body.inStock !== false,
      createdAt: new Date().toISOString()
    };

    // Agregar al inicio del inventario
    const updated = [newProduct, ...products];
    writeInventory(updated);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
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

    const products = readInventory();
    const index = products.findIndex((p) => p.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    const updatedProduct: InventoryProduct = {
      ...products[index],
      category: body.category || products[index].category,
      name: body.name || products[index].name,
      subtitle: body.subtitle !== undefined ? body.subtitle : products[index].subtitle,
      price: body.price !== undefined ? Number(body.price) : products[index].price,
      grade: body.grade !== undefined ? body.grade : products[index].grade,
      battery: body.battery !== undefined ? body.battery : products[index].battery,
      tag: body.tag !== undefined ? body.tag : products[index].tag,
      colors: Array.isArray(body.colors) ? body.colors : products[index].colors,
      image: body.image || products[index].image,
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : products[index].inStock
    };

    products[index] = updatedProduct;
    writeInventory(products);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

// DELETE: Eliminar producto
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const products = readInventory();
    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    writeInventory(filtered);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
