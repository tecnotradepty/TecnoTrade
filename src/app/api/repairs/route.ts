import { NextResponse } from "next/server";
import { getRepairs, saveRepairs } from "@/lib/storage";
import { RepairItem } from "@/data/repairCatalog";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0"
};

// GET: Obtener todas las reparaciones (recibe request para evaluar dinámicamente)
export async function GET(_request: Request) {
  const repairs = await getRepairs();
  return NextResponse.json(repairs, {
    headers: NO_CACHE_HEADERS
  });
}

// POST: Crear nueva reparación en el catálogo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const repairs = await getRepairs();

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
    await saveRepairs(updated);

    return NextResponse.json(newItem, { 
      status: 201,
      headers: NO_CACHE_HEADERS
    });
  } catch (error) {
    console.error("Error en POST /api/repairs:", error);
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

    const repairs = await getRepairs();
    const index = repairs.findIndex((r) => r.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: "Reparación no encontrada" }, { status: 404 });
    }

    const current = repairs[index];
    const oldCost = current.cost ?? 0;
    const newCost = body.cost !== undefined ? Number(body.cost) : oldCost;

    let finalPrice = body.price !== undefined ? Number(body.price) : current.price;

    // Regla de margen automático: si el costo sube, trasladar la subida exacta al cliente; si baja, mantener precio
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
    await saveRepairs(repairs);

    return NextResponse.json(updatedItem, {
      headers: NO_CACHE_HEADERS
    });
  } catch (error) {
    console.error("Error en PUT /api/repairs:", error);
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

    const repairs = await getRepairs();
    const filtered = repairs.filter((r) => r.id !== id);

    if (filtered.length === repairs.length) {
      return NextResponse.json({ error: "Reparación no encontrada" }, { status: 404 });
    }

    await saveRepairs(filtered);
    return NextResponse.json({ success: true, deletedId: id }, {
      headers: NO_CACHE_HEADERS
    });
  } catch (error) {
    console.error("Error en DELETE /api/repairs:", error);
    return NextResponse.json({ error: "Error al eliminar la reparación" }, { status: 500 });
  }
}
