import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { RepairItem } from "@/data/repairCatalog";

const REPAIRS_FILE = path.join(process.cwd(), "src", "data", "repairs.json");

function readRepairs(): RepairItem[] {
  try {
    if (!fs.existsSync(REPAIRS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(REPAIRS_FILE, "utf-8");
    return JSON.parse(data) as RepairItem[];
  } catch (error) {
    console.error("Error reading repairs:", error);
    return [];
  }
}

function writeRepairs(repairs: RepairItem[]): boolean {
  try {
    fs.writeFileSync(REPAIRS_FILE, JSON.stringify(repairs, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing repairs:", error);
    return false;
  }
}

// GET: Obtener todas las reparaciones
export async function GET() {
  const repairs = readRepairs();
  return NextResponse.json(repairs);
}

// POST: Crear nueva reparación en el catálogo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const repairs = readRepairs();

    const newItem: RepairItem = {
      id: body.id || `rep-${Date.now()}`,
      brand: body.brand || "Apple",
      category: body.category || "Pantallas",
      model: (body.model || "Modelo sin nombre").trim(),
      quality: body.quality || "Original",
      price: Number(body.price) || 0,
      cost: body.cost !== undefined ? Number(body.cost) : 0
    };

    const updated = [newItem, ...repairs];
    writeRepairs(updated);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear la reparación" }, { status: 500 });
  }
}

// PUT: Actualizar reparación existente
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID de reparación requerido" }, { status: 400 });
    }

    const repairs = readRepairs();
    const index = repairs.findIndex((r) => r.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: "Reparación no encontrada" }, { status: 404 });
    }

    const current = repairs[index];
    const oldCost = current.cost ?? 0;
    const newCost = body.cost !== undefined ? Number(body.cost) : oldCost;

    let finalPrice = body.price !== undefined ? Number(body.price) : current.price;

    // Si se solicita aplicar la regla automática de margen al cambiar el costo:
    // Si el costo sube, subir la diferencia exacta al precio final; si baja, mantener el precio del cliente igual.
    if (body.applyMarginRule && body.cost !== undefined) {
      const diff = newCost - oldCost;
      if (diff > 0) {
        finalPrice = Number((current.price + diff).toFixed(2));
      } else {
        finalPrice = current.price;
      }
    }

    const updatedItem: RepairItem = {
      ...current,
      brand: body.brand || current.brand,
      category: body.category || current.category,
      model: body.model !== undefined ? body.model.trim() : current.model,
      quality: body.quality || current.quality,
      price: finalPrice,
      cost: newCost
    };

    repairs[index] = updatedItem;
    writeRepairs(repairs);

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar la reparación" }, { status: 500 });
  }
}

// DELETE: Eliminar reparación por ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const repairs = readRepairs();
    const filtered = repairs.filter((r) => r.id !== id);

    if (filtered.length === repairs.length) {
      return NextResponse.json({ error: "Reparación no encontrada" }, { status: 404 });
    }

    writeRepairs(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar la reparación" }, { status: 500 });
  }
}
