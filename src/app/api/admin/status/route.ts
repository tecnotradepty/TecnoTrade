import { NextResponse } from "next/server";
import { getStorageDiagnostics, getProducts, getRepairs } from "@/lib/storage";

export async function GET(_request: Request) {
  const diag = getStorageDiagnostics();
  const products = await getProducts();
  const repairs = await getRepairs();

  // Filtrar nombres de variables de entorno relevantes sin revelar contraseñas
  const detectedEnvVars = Object.keys(process.env).filter((key) => {
    const u = key.toUpperCase();
    return u.includes("REDIS") || u.includes("UPSTASH") || u.includes("KV") || u.includes("STORAGE");
  });

  return NextResponse.json({
    cloudDatabaseActive: diag.isCloudConfigured,
    diagnosticSource: diag.source,
    hasUrl: diag.hasUrl,
    hasToken: diag.hasToken,
    productsInDatabase: products.length,
    repairsInDatabase: repairs.length,
    detectedEnvironmentVariables: detectedEnvVars,
    serverTime: new Date().toISOString()
  }, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
    }
  });
}
