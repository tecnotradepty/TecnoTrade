import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = body;

    const validPin = process.env.ADMIN_PIN || "047514";

    if (!pin || pin.toString().trim() !== validPin) {
      return NextResponse.json(
        { success: false, error: "PIN incorrecto" },
        { status: 401 }
      );
    }

    // Retorna token de autorización válido por la sesión
    const token = `tt_auth_${Buffer.from(validPin + Date.now()).toString("base64")}`;

    return NextResponse.json({
      success: true,
      token,
      message: "Acceso concedido"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error en el servidor de autenticación" },
      { status: 500 }
    );
  }
}
