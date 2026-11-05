import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Intentar guardar en disco local (en entorno de desarrollo local)
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${Date.now()}-${safeName}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);
      return NextResponse.json({ url: `/uploads/${filename}`, success: true });
    } catch {
      // En Vercel Serverless (sistema de archivos de solo lectura), convertimos a Data URL Base64
      // De esta forma la imagen se visualiza inmediatamente y se persiste en el JSON/KV sin fallar
      const mime = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mime};base64,${base64}`;
      return NextResponse.json({ url: dataUrl, success: true });
    }
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json({ error: "Error al procesar el archivo" }, { status: 500 });
  }
}
