export interface RepairItem {
  id: string;
  category: "Pantallas" | "Baterías" | "Tapas Traseras";
  brand: "Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google";
  models: string;
  quality: "Original" | "OLED" | "Incell";
  regularPrice: number;
  promoPrice: number;
  code: string;
}

export const REPAIR_CATALOG: RepairItem[] = [
  // ==========================================
  // APPLE - PANTALLAS (Piso mínimo $35 Incell)
  // ==========================================
  { id: "ap-1", category: "Pantallas", brand: "Apple", models: "iPhone X, XR, XS", quality: "Incell", regularPrice: 48, promoPrice: 35, code: "IPHONE35" },
  { id: "ap-2", category: "Pantallas", brand: "Apple", models: "iPhone 11", quality: "Incell", regularPrice: 48, promoPrice: 35, code: "IPHONE35" },
  { id: "ap-3", category: "Pantallas", brand: "Apple", models: "iPhone X, XR, XS", quality: "OLED", regularPrice: 65, promoPrice: 49, code: "SCRNOLED" },
  { id: "ap-4", category: "Pantallas", brand: "Apple", models: "iPhone XS Max, 11 Pro, 11 Pro Max", quality: "Incell", regularPrice: 52, promoPrice: 38, code: "IPHONE38" },
  { id: "ap-5", category: "Pantallas", brand: "Apple", models: "iPhone 11 Pro, 11 Pro Max", quality: "OLED", regularPrice: 75, promoPrice: 58, code: "SCRNOLED" },
  
  { id: "ap-6", category: "Pantallas", brand: "Apple", models: "iPhone 12 mini, 12, 12 Pro", quality: "Incell", regularPrice: 55, promoPrice: 39, code: "IPHONE39" },
  { id: "ap-7", category: "Pantallas", brand: "Apple", models: "iPhone 12, 12 Pro", quality: "OLED", regularPrice: 85, promoPrice: 68, code: "SCRNOLED" },
  { id: "ap-8", category: "Pantallas", brand: "Apple", models: "iPhone 12 Pro Max", quality: "Incell", regularPrice: 58, promoPrice: 42, code: "IPHONE42" },
  { id: "ap-9", category: "Pantallas", brand: "Apple", models: "iPhone 12 Pro Max", quality: "OLED", regularPrice: 95, promoPrice: 78, code: "SCRNOLED" },

  { id: "ap-10", category: "Pantallas", brand: "Apple", models: "iPhone 13 mini, 13", quality: "Incell", regularPrice: 58, promoPrice: 42, code: "IPHONE42" },
  { id: "ap-11", category: "Pantallas", brand: "Apple", models: "iPhone 13", quality: "OLED", regularPrice: 90, promoPrice: 72, code: "SCRNOLED" },
  { id: "ap-12", category: "Pantallas", brand: "Apple", models: "iPhone 13 Pro, 13 Pro Max", quality: "Incell", regularPrice: 65, promoPrice: 48, code: "IPHONE48" },
  { id: "ap-13", category: "Pantallas", brand: "Apple", models: "iPhone 13 Pro, 13 Pro Max", quality: "OLED", regularPrice: 110, promoPrice: 85, code: "SCRNOLED" },

  { id: "ap-14", category: "Pantallas", brand: "Apple", models: "iPhone 14, 14 Plus", quality: "Incell", regularPrice: 65, promoPrice: 48, code: "IPHONE48" },
  { id: "ap-15", category: "Pantallas", brand: "Apple", models: "iPhone 14, 14 Plus", quality: "OLED", regularPrice: 95, promoPrice: 75, code: "SCRNOLED" },
  { id: "ap-16", category: "Pantallas", brand: "Apple", models: "iPhone 14 Pro, 14 Pro Max", quality: "Incell", regularPrice: 75, promoPrice: 55, code: "IPHONE55" },
  { id: "ap-17", category: "Pantallas", brand: "Apple", models: "iPhone 14 Pro, 14 Pro Max", quality: "OLED", regularPrice: 125, promoPrice: 98, code: "SCRNOLED" },

  { id: "ap-18", category: "Pantallas", brand: "Apple", models: "iPhone 15, 15 Plus", quality: "Incell", regularPrice: 75, promoPrice: 55, code: "IPHONE55" },
  { id: "ap-19", category: "Pantallas", brand: "Apple", models: "iPhone 15 Pro, 15 Pro Max", quality: "Incell", regularPrice: 80, promoPrice: 59, code: "IPHONE59" },
  { id: "ap-20", category: "Pantallas", brand: "Apple", models: "iPhone 15 Pro, 15 Pro Max", quality: "OLED", regularPrice: 155, promoPrice: 125, code: "SCRNOLED" },
  { id: "ap-21", category: "Pantallas", brand: "Apple", models: "iPhone 16, 16 Pro, 16 Pro Max", quality: "Incell", regularPrice: 95, promoPrice: 72, code: "IPHONE72" },

  // ==========================================
  // SAMSUNG - PANTALLAS
  // ==========================================
  { id: "sp-1", category: "Pantallas", brand: "Samsung", models: "Galaxy A04, A04s, A05, A05s, A06", quality: "Original", regularPrice: 38, promoPrice: 26, code: "SAM26" },
  { id: "sp-2", category: "Pantallas", brand: "Samsung", models: "Galaxy A14, A15, A16", quality: "Incell", regularPrice: 42, promoPrice: 30, code: "SAM30" },
  { id: "sp-3", category: "Pantallas", brand: "Samsung", models: "Galaxy A15, A16", quality: "OLED", regularPrice: 65, promoPrice: 48, code: "SAMOLED" },
  { id: "sp-4", category: "Pantallas", brand: "Samsung", models: "Galaxy A24, A25, A34, A35", quality: "Incell", regularPrice: 48, promoPrice: 35, code: "SAM35" },
  { id: "sp-5", category: "Pantallas", brand: "Samsung", models: "Galaxy A34, A35, A54, A55", quality: "OLED", regularPrice: 78, promoPrice: 59, code: "SAMOLED" },
  { id: "sp-6", category: "Pantallas", brand: "Samsung", models: "Galaxy S20 FE, S21 FE", quality: "OLED", regularPrice: 70, promoPrice: 55, code: "SAMOLED" },
  { id: "sp-7", category: "Pantallas", brand: "Samsung", models: "Galaxy S20, S21, S22 (Base / Plus)", quality: "Incell", regularPrice: 75, promoPrice: 58, code: "SAMS58" },
  { id: "sp-8", category: "Pantallas", brand: "Samsung", models: "Galaxy S22 Ultra, S23 Ultra, S24 Ultra", quality: "Incell", regularPrice: 105, promoPrice: 79, code: "ULTRA79" },
  { id: "sp-9", category: "Pantallas", brand: "Samsung", models: "Galaxy S22 Ultra, S23 Ultra", quality: "OLED", regularPrice: 155, promoPrice: 119, code: "ULTRAOLED" },

  // ==========================================
  // HONOR - PANTALLAS
  // ==========================================
  { id: "hp-1", category: "Pantallas", brand: "Honor", models: "Honor X6, X6s, X7, X7a, X7b, X8, X8a", quality: "Original", regularPrice: 38, promoPrice: 28, code: "HON28" },
  { id: "hp-2", category: "Pantallas", brand: "Honor", models: "Honor X9", quality: "Original", regularPrice: 45, promoPrice: 32, code: "HON32" },
  { id: "hp-3", category: "Pantallas", brand: "Honor", models: "Honor Magic 5 Lite, Magic 6 Lite, Magic 7 Lite", quality: "Incell", regularPrice: 55, promoPrice: 42, code: "MAGIC42" },
  { id: "hp-4", category: "Pantallas", brand: "Honor", models: "Honor Magic 5 Lite, Magic 6 Lite", quality: "OLED", regularPrice: 85, promoPrice: 65, code: "MAGICOLED" },
  { id: "hp-5", category: "Pantallas", brand: "Honor", models: "Honor 90, Honor 200, Honor 200 Lite", quality: "OLED", regularPrice: 85, promoPrice: 65, code: "HONOLED" },

  // ==========================================
  // XIAOMI & POCO - PANTALLAS
  // ==========================================
  { id: "xp-1", category: "Pantallas", brand: "Xiaomi", models: "Redmi 9, 10, 12, 13, 13C, 14C", quality: "Original", regularPrice: 38, promoPrice: 26, code: "REDMI26" },
  { id: "xp-2", category: "Pantallas", brand: "Xiaomi", models: "Redmi Note 11, Note 12, Note 13, Note 14", quality: "Incell", regularPrice: 42, promoPrice: 30, code: "NOTE30" },
  { id: "xp-3", category: "Pantallas", brand: "Xiaomi", models: "Redmi Note 11 Pro, 12 Pro, 13 Pro, 14 Pro", quality: "OLED", regularPrice: 70, promoPrice: 52, code: "XMOLED" },
  { id: "xp-4", category: "Pantallas", brand: "Xiaomi", models: "Poco X3, X3 Pro, X4 Pro, X5, X6, X6 Pro", quality: "Incell", regularPrice: 45, promoPrice: 32, code: "POCO32" },
  { id: "xp-5", category: "Pantallas", brand: "Xiaomi", models: "Poco X5, X6, F3, F4, F5", quality: "OLED", regularPrice: 75, promoPrice: 55, code: "POCOOLED" },

  // ==========================================
  // GOOGLE PIXEL - PANTALLAS
  // ==========================================
  { id: "gp-1", category: "Pantallas", brand: "Google", models: "Pixel 6, 6A, 7", quality: "Incell", regularPrice: 65, promoPrice: 49, code: "PIX49" },
  { id: "gp-2", category: "Pantallas", brand: "Google", models: "Pixel 6, 6A, 7", quality: "OLED", regularPrice: 95, promoPrice: 72, code: "PIXOLED" },
  { id: "gp-3", category: "Pantallas", brand: "Google", models: "Pixel 6 Pro, 7 Pro, 8 Pro", quality: "OLED", regularPrice: 115, promoPrice: 85, code: "PIXPRO" },

  // ==========================================
  // TAPAS TRASERAS (PISO IPHONE $35 MÍNIMO)
  // ==========================================
  // iPhone Tapas: Mínimo $35 para cubrir 30% tienda y riesgo de desarme/láser
  { id: "tt-1", category: "Tapas Traseras", brand: "Apple", models: "iPhone X, XR, XS, 11, 12, 13", quality: "Original", regularPrice: 48, promoPrice: 35, code: "TAPAIPHONE" },
  { id: "tt-2", category: "Tapas Traseras", brand: "Apple", models: "iPhone 13 Pro, 14, 14 Plus, 14 Pro, 14 Pro Max", quality: "Original", regularPrice: 55, promoPrice: 40, code: "TAPAIPHONE" },
  { id: "tt-3", category: "Tapas Traseras", brand: "Apple", models: "iPhone 15, 15 Pro, 15 Pro Max, 16 Pro", quality: "Original", regularPrice: 65, promoPrice: 45, code: "TAPAIPHONE" },
  
  // Android Tapas: Más económicas ($24 a $26) ya que son de menor complejidad
  { id: "tt-4", category: "Tapas Traseras", brand: "Samsung", models: "Galaxy A14, A24, A34, A54, A55", quality: "Original", regularPrice: 35, promoPrice: 24, code: "TAPASAM" },
  { id: "tt-5", category: "Tapas Traseras", brand: "Samsung", models: "Galaxy S20, S21, S22, S23, S24 (Base, Plus, Ultra)", quality: "Original", regularPrice: 40, promoPrice: 26, code: "TAPASAM" },
  { id: "tt-6", category: "Tapas Traseras", brand: "Honor", models: "Honor X7, X8, Magic 5 Lite, 6 Lite, 90", quality: "Original", regularPrice: 35, promoPrice: 24, code: "TAPAHO" },
  { id: "tt-7", category: "Tapas Traseras", brand: "Xiaomi", models: "Redmi Note 11, 12, 13, Poco X3, X5, X6", quality: "Original", regularPrice: 35, promoPrice: 24, code: "TAPAXIAOMI" },

  // ==========================================
  // BATERÍAS (0 ciclos - Alta duración)
  // ==========================================
  { id: "bt-1", category: "Baterías", brand: "Apple", models: "iPhone X, XR, XS, 11", quality: "Original", regularPrice: 45, promoPrice: 32, code: "BATAPPLE" },
  { id: "bt-2", category: "Baterías", brand: "Apple", models: "iPhone 12, 12 Pro, 13, 13 Pro", quality: "Original", regularPrice: 55, promoPrice: 39, code: "BATAPPLE" },
  { id: "bt-3", category: "Baterías", brand: "Apple", models: "iPhone 14, 15 Pro", quality: "Original", regularPrice: 68, promoPrice: 49, code: "BATAPPLE" },
  { id: "bt-4", category: "Baterías", brand: "Samsung", models: "Galaxy A12, A14, A15, A24, A34, A54, A55", quality: "Original", regularPrice: 38, promoPrice: 26, code: "BATSAM" },
  { id: "bt-5", category: "Baterías", brand: "Samsung", models: "Galaxy S20, S21, S22, S23 Ultra", quality: "Original", regularPrice: 48, promoPrice: 35, code: "BATSAM" },
  { id: "bt-6", category: "Baterías", brand: "Honor", models: "Honor X6, X7, X8, Magic 5 Lite, 6 Lite", quality: "Original", regularPrice: 38, promoPrice: 27, code: "BATHON" },
  { id: "bt-7", category: "Baterías", brand: "Xiaomi", models: "Redmi Note 10, 11, 12, 13, Poco X3", quality: "Original", regularPrice: 38, promoPrice: 26, code: "BATXM" }
];

export const POPULAR_MODELS: Record<string, string[]> = {
  Apple: [
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 11 Pro",
    "iPhone 11",
    "iPhone XR / XS / X"
  ],
  Samsung: [
    "Galaxy S24 Ultra",
    "Galaxy S23 Ultra",
    "Galaxy S23 / S23+",
    "Galaxy S22 Ultra",
    "Galaxy S22 / S22+",
    "Galaxy S21 Ultra / S21",
    "Galaxy S20 FE / S20",
    "Galaxy A55 / A54",
    "Galaxy A35 / A34",
    "Galaxy A25 / A24",
    "Galaxy A15 / A14",
    "Galaxy A05 / A06"
  ],
  Honor: [
    "Honor Magic 6 Lite",
    "Honor Magic 5 Lite",
    "Honor 200 / 200 Lite",
    "Honor 90 / 90 Lite",
    "Honor X9",
    "Honor X8 / X8b",
    "Honor X7 / X7b",
    "Honor X6 / X6s"
  ],
  Xiaomi: [
    "Redmi Note 14 / 14 Pro",
    "Redmi Note 13 / 13 Pro",
    "Redmi Note 12 / 12 Pro",
    "Redmi Note 11 / 11 Pro",
    "Poco X6 / X6 Pro",
    "Poco X5 / X5 Pro",
    "Poco X3 / X3 Pro",
    "Redmi 13C / 12C / 10C"
  ],
  Google: [
    "Pixel 8 Pro",
    "Pixel 7 Pro",
    "Pixel 7",
    "Pixel 6 Pro",
    "Pixel 6 / 6A"
  ]
};
