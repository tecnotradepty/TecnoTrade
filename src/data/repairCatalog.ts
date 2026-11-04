import INITIAL_REPAIRS from "./repairs.json";

export type RepairBrand = "Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google";
export type RepairCategory = "Pantallas" | "Tapas Traseras" | "Puertos de Carga" | "Baterías";
export type RepairQuality = "Incell" | "OLED" | "Original" | "Original de equipo" | "Servipack" | "Estándar";

export interface RepairItem {
  id: string;
  brand: RepairBrand;
  category: RepairCategory;
  model: string;
  quality: RepairQuality;
  price: number;
  cost?: number;
}

export const REPAIR_CATALOG: RepairItem[] = INITIAL_REPAIRS as RepairItem[];

export const POPULAR_MODELS: Record<string, string[]> = {
  Apple: [
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 mini",
    "iPhone 12 Pro Max",
    "iPhone 12 / 12 Pro",
    "iPhone 12 mini",
    "iPhone 11 Pro Max",
    "iPhone 11 Pro",
    "iPhone 11",
    "iPhone XS Max",
    "iPhone XS",
    "iPhone XR",
    "iPhone X",
    "iPhone 8 / 8 Plus"
  ],
  Samsung: [
    "Galaxy S24 Ultra",
    "Galaxy S24 / S24+",
    "Galaxy S23 Ultra",
    "Galaxy S23 / S23+",
    "Galaxy S22 Ultra",
    "Galaxy S22 / S22+",
    "Galaxy S21 Ultra",
    "Galaxy S21 / S21+",
    "Galaxy S21 FE",
    "Galaxy S20 Ultra",
    "Galaxy S20 / S20+",
    "Galaxy S20 FE",
    "Galaxy Z Flip 5",
    "Galaxy Z Flip 4",
    "Galaxy Z Flip 3",
    "Galaxy A55",
    "Galaxy A54",
    "Galaxy A35",
    "Galaxy A34",
    "Galaxy A25",
    "Galaxy A24",
    "Galaxy A16 4G / 5G",
    "Galaxy A15",
    "Galaxy A14 4G / 5G",
    "Galaxy A12 / A13",
    "Galaxy A05 / A05s / A06",
    "Galaxy A04 / A04s / A04e",
    "Galaxy A02 / A03 / A03s",
    "Galaxy Note 10 / Note 20 Ultra"
  ],
  Honor: [
    "Honor Magic 7 Lite",
    "Honor Magic 6 Lite",
    "Honor Magic 5 Lite",
    "Honor 200 / 200 Lite",
    "Honor 90 / 90 Lite",
    "Honor X9",
    "Honor X8 / X8a / X8b",
    "Honor X7 / X7a / X7b",
    "Honor X5 / X6 / X6s",
    "Honor 50 / 90 / 200"
  ],
  Xiaomi: [
    "Redmi Note 14 / 14 Pro",
    "Redmi Note 13 4G / 5G",
    "Redmi Note 12 4G / 5G",
    "Redmi Note 11 / 11s",
    "Redmi Note 10 / 10s",
    "Poco X6 / X6 Pro",
    "Poco X4 Pro / X5",
    "Poco X3 / X3 Pro",
    "Poco F3 / F4 / F5",
    "Redmi 12 / 13 / 13C / 14C",
    "Redmi 9 / 9A / 9C / 10 / 10C"
  ],
  Google: [
    "Pixel 8 / 8 Pro",
    "Pixel 7 Pro",
    "Pixel 7",
    "Pixel 6 Pro",
    "Pixel 6 / 6A"
  ]
};

/**
 * Validador estricto para asegurar que una pieza corresponde al modelo seleccionado.
 * Evita falsos positivos como asociar repuestos del iPhone 11 o del Redmi Note 10
 * al seleccionar iPhone 16 Pro o Redmi Note 14.
 */
const BRAND_WORDS = /\b(iphone|galaxy|honor|pixel|google|xiaomi|poco|redmi|samsung|apple)\b/g;

const normalizeVariant = (s: string) => s.toLowerCase().replace(/\+/g, "plus").replace(/[^a-z0-9]/g, "");

/**
 * Expande un nombre de modelo en sus variantes completas.
 * ej: "Redmi Note 14 / 14 Pro" -> ["note14", "note14pro"]
 *     "iPhone X / XR / XS / XS Max" -> ["x", "xr", "xs", "xsmax"]
 *     "Galaxy A16 4G / 5G" -> ["a16"]
 */
export function expandModelVariants(model: string): string[] {
  const base = model
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b[45]g\b/g, " ")
    .replace(BRAND_WORDS, " ");
  const parts = base.split(/[\/,]/).map((p) => p.trim().replace(/\s+/g, " ")).filter(Boolean);
  if (!parts.length) return [];

  // Prefijo de familia (ej: "note" en "Redmi Note 14") para heredarlo en variantes como "14 Pro"
  const words = parts[0].split(" ");
  const idx = words.findIndex((w) => /\d/.test(w));
  const prefix = idx > 0 ? words.slice(0, idx).join(" ") : "";

  return parts
    .map((p, i) => normalizeVariant(i > 0 && prefix && /^\d/.test(p) ? `${prefix} ${p}` : p))
    .filter(Boolean);
}

export function isModelMatch(itemModel: string, selectedModel: string, _brand?: string): boolean {
  if (!itemModel || !selectedModel) return false;

  const itemLower = itemModel.toLowerCase().trim();
  const selLower = selectedModel.toLowerCase().trim();
  if (itemLower === selLower) return true;

  const selVariants = expandModelVariants(selectedModel);

  // Agrupaciones con paréntesis: "Galaxy Series A (A12, A14, A15, A54, A55)"
  const paren = itemModel.match(/\(([^)]+)\)/);
  if (paren) {
    const groupUltra = itemLower.includes("ultra");
    if (groupUltra !== selLower.includes("ultra")) return false;
    const tokens = paren[1]
      .split(/[\s,\/]+/)
      .map(normalizeVariant)
      .filter((t) => t.length >= 2 && /\d/.test(t));
    const selBases = selVariants.map((v) => v.replace(/(plus|ultra|fe)$/, ""));
    return tokens.some((t) => selBases.includes(t));
  }

  // Repuestos universales de series completas (Honor Series X & Magic Lite, Redmi Note & Poco Series)
  if (/series|&/i.test(itemModel)) {
    if (itemLower.includes("honor series x") && /\bx\d/.test(selLower)) return true;
    if (itemLower.includes("magic lite") && selLower.includes("magic") && selLower.includes("lite")) return true;
    if (itemLower.includes("redmi note") && selLower.includes("redmi note")) return true;
    if (itemLower.includes("poco series") && selLower.includes("poco")) return true;
    return false;
  }

  // Coincidencia exacta de al menos una variante completa
  const itemVariants = expandModelVariants(itemModel);
  return itemVariants.some((v) => selVariants.includes(v));
}
