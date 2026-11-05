import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { InventoryProduct } from "@/types/inventory";
import { RepairItem } from "@/data/repairCatalog";

// ============================================================================
// CONEXIÓN CLOUD REDIS (Vercel KV / Upstash Redis)
// ============================================================================
// Vercel KV inyecta automáticamente KV_REST_API_URL y KV_REST_API_TOKEN.
// Upstash Redis en Vercel Marketplace inyecta UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN.
const redisUrl =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_URL;

const redisToken =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN;

let redisClient: Redis | null = null;

if (redisUrl && redisToken) {
  try {
    redisClient = new Redis({
      url: redisUrl,
      token: redisToken,
    });
    console.log("[Storage] Cloud Redis (Vercel KV / Upstash) inicializado con éxito.");
  } catch (err) {
    console.error("[Storage] Error al inicializar cliente Redis:", err);
  }
} else {
  console.log("[Storage] Sin variables de Redis detectadas. Operando con fallback local/memoria.");
}

// Claves de almacenamiento en la base de datos Redis
const REDIS_PRODUCTS_KEY = "tecnotrade:products";
const REDIS_REPAIRS_KEY = "tecnotrade:repairs";

// Rutas locales de archivos de datos (utilizadas en desarrollo y como semilla inicial)
const LOCAL_INVENTORY_FILE = path.join(process.cwd(), "src", "data", "inventory.json");
const LOCAL_REPAIRS_FILE = path.join(process.cwd(), "src", "data", "repairs.json");

// Fallback temporal en /tmp (único directorio con permiso de escritura en Vercel Serverless)
const TMP_INVENTORY_FILE = "/tmp/tecnotrade_inventory.json";
const TMP_REPAIRS_FILE = "/tmp/tecnotrade_repairs.json";

// Singleton en memoria para serverless caliente
declare global {
  // eslint-disable-next-line no-var
  var __tecnotrade_products__: InventoryProduct[] | undefined;
  // eslint-disable-next-line no-var
  var __tecnotrade_repairs__: RepairItem[] | undefined;
}

// ============================================================================
// HELPERS LOCALES
// ============================================================================
function readLocalProducts(): InventoryProduct[] {
  // 1. Memoria global
  if (globalThis.__tecnotrade_products__ !== undefined) {
    return globalThis.__tecnotrade_products__;
  }

  // 2. /tmp en Vercel Serverless
  try {
    if (fs.existsSync(TMP_INVENTORY_FILE)) {
      const data = fs.readFileSync(TMP_INVENTORY_FILE, "utf-8");
      const parsed = JSON.parse(data) as InventoryProduct[];
      globalThis.__tecnotrade_products__ = parsed;
      return parsed;
    }
  } catch {
    // Continuar al archivo local
  }

  // 3. Archivo estático inicial en src/data/inventory.json
  try {
    if (fs.existsSync(LOCAL_INVENTORY_FILE)) {
      const data = fs.readFileSync(LOCAL_INVENTORY_FILE, "utf-8");
      const parsed = JSON.parse(data) as InventoryProduct[];
      globalThis.__tecnotrade_products__ = parsed;
      return parsed;
    }
  } catch (err) {
    console.error("[Storage] Error al leer inventory.json local:", err);
  }

  return [];
}

function readLocalRepairs(): RepairItem[] {
  // 1. Memoria global
  if (globalThis.__tecnotrade_repairs__ !== undefined) {
    return globalThis.__tecnotrade_repairs__;
  }

  // 2. /tmp en Vercel Serverless
  try {
    if (fs.existsSync(TMP_REPAIRS_FILE)) {
      const data = fs.readFileSync(TMP_REPAIRS_FILE, "utf-8");
      const parsed = JSON.parse(data) as RepairItem[];
      globalThis.__tecnotrade_repairs__ = parsed;
      return parsed;
    }
  } catch {
    // Continuar al archivo local
  }

  // 3. Archivo estático inicial en src/data/repairs.json
  try {
    if (fs.existsSync(LOCAL_REPAIRS_FILE)) {
      const data = fs.readFileSync(LOCAL_REPAIRS_FILE, "utf-8");
      const parsed = JSON.parse(data) as RepairItem[];
      globalThis.__tecnotrade_repairs__ = parsed;
      return parsed;
    }
  } catch (err) {
    console.error("[Storage] Error al leer repairs.json local:", err);
  }

  return [];
}

// ============================================================================
// PRODUCTOS / INVENTARIO
// ============================================================================

/**
 * Obtiene todos los productos de inventario.
 * Si Redis está conectado, lee de Redis (y lo autosemilla si es la primera vez).
 * Si no hay Redis, recurre al sistema de archivos local y memoria.
 */
export async function getProducts(): Promise<InventoryProduct[]> {
  if (redisClient) {
    try {
      const remote = await redisClient.get<InventoryProduct[]>(REDIS_PRODUCTS_KEY);
      if (remote !== null && Array.isArray(remote)) {
        globalThis.__tecnotrade_products__ = remote;
        return remote;
      }

      // Si Redis está vacío, sembramos los datos iniciales
      const initial = readLocalProducts();
      await redisClient.set(REDIS_PRODUCTS_KEY, initial);
      globalThis.__tecnotrade_products__ = initial;
      return initial;
    } catch (err) {
      console.error("[Storage] Error al leer productos de Redis, usando fallback local:", err);
    }
  }

  return readLocalProducts();
}

/**
 * Guarda el inventario de productos.
 * Actualiza Redis, memoria global, /tmp y src/data/inventory.json (en local).
 */
export async function saveProducts(products: InventoryProduct[]): Promise<boolean> {
  // 1. Actualizar memoria inmediata
  globalThis.__tecnotrade_products__ = products;

  // 2. Actualizar Cloud Redis
  if (redisClient) {
    try {
      await redisClient.set(REDIS_PRODUCTS_KEY, products);
    } catch (err) {
      console.error("[Storage] Error al guardar productos en Redis:", err);
    }
  }

  // 3. Intentar escribir en /tmp (funciona en serverless Vercel)
  try {
    fs.writeFileSync(TMP_INVENTORY_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch {
    // En caso de que /tmp no esté disponible en algún entorno
  }

  // 4. Intentar escribir en src/data/inventory.json (funciona en localhost dev)
  try {
    fs.writeFileSync(LOCAL_INVENTORY_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch {
    // Normal en Vercel (sistema de archivos de solo lectura)
  }

  return true;
}

// ============================================================================
// CATÁLOGO DE REPARACIONES
// ============================================================================

/**
 * Obtiene el catálogo de reparaciones.
 * Si Redis está conectado, lee de Redis (y lo autosemilla si es la primera vez).
 * Si no hay Redis, recurre al sistema de archivos local y memoria.
 */
export async function getRepairs(): Promise<RepairItem[]> {
  if (redisClient) {
    try {
      const remote = await redisClient.get<RepairItem[]>(REDIS_REPAIRS_KEY);
      if (remote !== null && Array.isArray(remote)) {
        globalThis.__tecnotrade_repairs__ = remote;
        return remote;
      }

      // Semilla inicial en Redis
      const initial = readLocalRepairs();
      await redisClient.set(REDIS_REPAIRS_KEY, initial);
      globalThis.__tecnotrade_repairs__ = initial;
      return initial;
    } catch (err) {
      console.error("[Storage] Error al leer reparaciones de Redis, usando fallback local:", err);
    }
  }

  return readLocalRepairs();
}

/**
 * Guarda el catálogo de reparaciones.
 * Actualiza Redis, memoria global, /tmp y src/data/repairs.json (en local).
 */
export async function saveRepairs(repairs: RepairItem[]): Promise<boolean> {
  // 1. Memoria inmediata
  globalThis.__tecnotrade_repairs__ = repairs;

  // 2. Cloud Redis
  if (redisClient) {
    try {
      await redisClient.set(REDIS_REPAIRS_KEY, repairs);
    } catch (err) {
      console.error("[Storage] Error al guardar reparaciones en Redis:", err);
    }
  }

  // 3. /tmp (Vercel Serverless)
  try {
    fs.writeFileSync(TMP_REPAIRS_FILE, JSON.stringify(repairs, null, 2), "utf-8");
  } catch {
    // Ignorar si falla
  }

  // 4. src/data/repairs.json (Local dev)
  try {
    fs.writeFileSync(LOCAL_REPAIRS_FILE, JSON.stringify(repairs, null, 2), "utf-8");
  } catch {
    // Normal en Vercel
  }

  return true;
}

/**
 * Indica si hay una base de datos cloud activa conectada.
 */
export function isCloudStorageConfigured(): boolean {
  return redisClient !== null;
}
