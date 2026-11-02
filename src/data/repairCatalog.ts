export interface RepairItem {
  id: string;
  brand: "Apple" | "Samsung" | "Honor" | "Xiaomi" | "Google";
  category: "Pantallas" | "Tapas Traseras" | "Puertos de Carga" | "Baterías";
  model: string;
  quality: "Incell" | "OLED" | "Original" | "Original de equipo" | "Servipack" | "Estándar";
  price: number;
  cost?: number;
}

export const REPAIR_CATALOG: RepairItem[] = [
  // ==========================================
  // 1. IPHONE - PANTALLAS
  // ==========================================
  { id: "ip-scr-x-incell", brand: "Apple", category: "Pantallas", model: "iPhone X", quality: "Incell", price: 30, cost: 13 },
  { id: "ip-scr-x-oled", brand: "Apple", category: "Pantallas", model: "iPhone X", quality: "OLED", price: 45, cost: 25 },
  { id: "ip-scr-x-ori", brand: "Apple", category: "Pantallas", model: "iPhone X", quality: "Original", price: 65, cost: 44 },

  { id: "ip-scr-xr-incell", brand: "Apple", category: "Pantallas", model: "iPhone XR", quality: "Incell", price: 35, cost: 13 },
  { id: "ip-scr-xr-ori", brand: "Apple", category: "Pantallas", model: "iPhone XR", quality: "Original", price: 45, cost: 23 },

  { id: "ip-scr-xs-incell", brand: "Apple", category: "Pantallas", model: "iPhone XS", quality: "Incell", price: 35, cost: 13 },
  { id: "ip-scr-xs-oled", brand: "Apple", category: "Pantallas", model: "iPhone XS", quality: "OLED", price: 45, cost: 25 },
  { id: "ip-scr-xs-ori", brand: "Apple", category: "Pantallas", model: "iPhone XS", quality: "Original", price: 65, cost: 39 },

  { id: "ip-scr-xsmax-incell", brand: "Apple", category: "Pantallas", model: "iPhone XS Max", quality: "Incell", price: 35, cost: 15 },
  { id: "ip-scr-xsmax-oled", brand: "Apple", category: "Pantallas", model: "iPhone XS Max", quality: "OLED", price: 55, cost: 32 },
  { id: "ip-scr-xsmax-ori", brand: "Apple", category: "Pantallas", model: "iPhone XS Max", quality: "Original", price: 75, cost: 50 },

  { id: "ip-scr-11-incell", brand: "Apple", category: "Pantallas", model: "iPhone 11", quality: "Incell", price: 35, cost: 13 },
  { id: "ip-scr-11-ori", brand: "Apple", category: "Pantallas", model: "iPhone 11", quality: "Original", price: 50, cost: 23 },
  { id: "ip-scr-11-orieq", brand: "Apple", category: "Pantallas", model: "iPhone 11", quality: "Original de equipo", price: 55, cost: 28 },

  { id: "ip-scr-11p-incell", brand: "Apple", category: "Pantallas", model: "iPhone 11 Pro", quality: "Incell", price: 35, cost: 16 },
  { id: "ip-scr-11p-oled", brand: "Apple", category: "Pantallas", model: "iPhone 11 Pro", quality: "OLED", price: 55, cost: 30 },
  { id: "ip-scr-11p-ori", brand: "Apple", category: "Pantallas", model: "iPhone 11 Pro", quality: "Original", price: 85, cost: 59 },

  { id: "ip-scr-11pm-incell", brand: "Apple", category: "Pantallas", model: "iPhone 11 Pro Max", quality: "Incell", price: 37, cost: 18 },
  { id: "ip-scr-11pm-oled", brand: "Apple", category: "Pantallas", model: "iPhone 11 Pro Max", quality: "OLED", price: 60, cost: 38 },
  { id: "ip-scr-11pm-ori", brand: "Apple", category: "Pantallas", model: "iPhone 11 Pro Max", quality: "Original", price: 90, cost: 60 },

  { id: "ip-scr-12m-incell", brand: "Apple", category: "Pantallas", model: "iPhone 12 mini", quality: "Incell", price: 40, cost: 23 },
  { id: "ip-scr-12m-oled", brand: "Apple", category: "Pantallas", model: "iPhone 12 mini", quality: "OLED", price: 75, cost: 50 },

  { id: "ip-scr-12-incell", brand: "Apple", category: "Pantallas", model: "iPhone 12 / 12 Pro", quality: "Incell", price: 35, cost: 17 },
  { id: "ip-scr-12-oled", brand: "Apple", category: "Pantallas", model: "iPhone 12 / 12 Pro", quality: "OLED", price: 65, cost: 38 },
  { id: "ip-scr-12-ori", brand: "Apple", category: "Pantallas", model: "iPhone 12 / 12 Pro", quality: "Original", price: 85, cost: 56 },

  { id: "ip-scr-12pm-incell", brand: "Apple", category: "Pantallas", model: "iPhone 12 Pro Max", quality: "Incell", price: 37.5, cost: 18 },
  { id: "ip-scr-12pm-oled", brand: "Apple", category: "Pantallas", model: "iPhone 12 Pro Max", quality: "OLED", price: 75, cost: 50 },
  { id: "ip-scr-12pm-ori", brand: "Apple", category: "Pantallas", model: "iPhone 12 Pro Max", quality: "Original", price: 130, cost: 95 },

  { id: "ip-scr-13m-incell", brand: "Apple", category: "Pantallas", model: "iPhone 13 mini", quality: "Incell", price: 40, cost: 23 },
  { id: "ip-scr-13m-oled", brand: "Apple", category: "Pantallas", model: "iPhone 13 mini", quality: "OLED", price: 90, cost: 65 },

  { id: "ip-scr-13-incell", brand: "Apple", category: "Pantallas", model: "iPhone 13", quality: "Incell", price: 40, cost: 19 },
  { id: "ip-scr-13-oled", brand: "Apple", category: "Pantallas", model: "iPhone 13", quality: "OLED", price: 65, cost: 43 },
  { id: "ip-scr-13-ori", brand: "Apple", category: "Pantallas", model: "iPhone 13", quality: "Original", price: 90, cost: 66 },

  { id: "ip-scr-13p-incell", brand: "Apple", category: "Pantallas", model: "iPhone 13 Pro", quality: "Incell", price: 40, cost: 23 },
  { id: "ip-scr-13p-oled", brand: "Apple", category: "Pantallas", model: "iPhone 13 Pro", quality: "OLED", price: 75, cost: 50 },
  { id: "ip-scr-13p-ori", brand: "Apple", category: "Pantallas", model: "iPhone 13 Pro", quality: "Original de equipo", price: 140, cost: 125 },

  { id: "ip-scr-13pm-incell", brand: "Apple", category: "Pantallas", model: "iPhone 13 Pro Max", quality: "Incell", price: 50, cost: 25 },
  { id: "ip-scr-13pm-oled", brand: "Apple", category: "Pantallas", model: "iPhone 13 Pro Max", quality: "OLED", price: 80, cost: 53 },
  { id: "ip-scr-13pm-ori", brand: "Apple", category: "Pantallas", model: "iPhone 13 Pro Max", quality: "Original", price: 125, cost: 75 },

  { id: "ip-scr-14-incell", brand: "Apple", category: "Pantallas", model: "iPhone 14", quality: "Incell", price: 45, cost: 22 },
  { id: "ip-scr-14-oled", brand: "Apple", category: "Pantallas", model: "iPhone 14", quality: "OLED", price: 65, cost: 42 },
  { id: "ip-scr-14-ori", brand: "Apple", category: "Pantallas", model: "iPhone 14", quality: "Original de equipo", price: 150, cost: 130 },

  { id: "ip-scr-14plus-incell", brand: "Apple", category: "Pantallas", model: "iPhone 14 Plus", quality: "Incell", price: 50, cost: 25 },
  { id: "ip-scr-14plus-oled", brand: "Apple", category: "Pantallas", model: "iPhone 14 Plus", quality: "OLED", price: 90, cost: 65 },

  { id: "ip-scr-14p-incell", brand: "Apple", category: "Pantallas", model: "iPhone 14 Pro", quality: "Incell", price: 55, cost: 30 },
  { id: "ip-scr-14p-oled", brand: "Apple", category: "Pantallas", model: "iPhone 14 Pro", quality: "OLED", price: 100, cost: 70 },
  { id: "ip-scr-14p-ori", brand: "Apple", category: "Pantallas", model: "iPhone 14 Pro", quality: "Original", price: 130, cost: 93 },

  { id: "ip-scr-14pm-incell", brand: "Apple", category: "Pantallas", model: "iPhone 14 Pro Max", quality: "Incell", price: 55, cost: 26 },
  { id: "ip-scr-14pm-oled", brand: "Apple", category: "Pantallas", model: "iPhone 14 Pro Max", quality: "OLED", price: 90, cost: 65 },
  { id: "ip-scr-14pm-ori", brand: "Apple", category: "Pantallas", model: "iPhone 14 Pro Max", quality: "Original", price: 150, cost: 170 },

  { id: "ip-scr-15-incell", brand: "Apple", category: "Pantallas", model: "iPhone 15", quality: "Incell", price: 55, cost: 30 },
  { id: "ip-scr-15-oled", brand: "Apple", category: "Pantallas", model: "iPhone 15", quality: "OLED", price: 120, cost: 90 },
  { id: "ip-scr-15-ori", brand: "Apple", category: "Pantallas", model: "iPhone 15", quality: "Original", price: 150, cost: 110 },

  { id: "ip-scr-15plus-incell", brand: "Apple", category: "Pantallas", model: "iPhone 15 Plus", quality: "Incell", price: 60, cost: 34 },
  { id: "ip-scr-15plus-oled", brand: "Apple", category: "Pantallas", model: "iPhone 15 Plus", quality: "OLED", price: 125, cost: 96 },

  { id: "ip-scr-15p-incell", brand: "Apple", category: "Pantallas", model: "iPhone 15 Pro", quality: "Incell", price: 55, cost: 28 },
  { id: "ip-scr-15p-oled", brand: "Apple", category: "Pantallas", model: "iPhone 15 Pro", quality: "OLED", price: 125, cost: 100 },
  { id: "ip-scr-15p-ori", brand: "Apple", category: "Pantallas", model: "iPhone 15 Pro", quality: "Original", price: 160, cost: 168 },

  { id: "ip-scr-15pm-incell", brand: "Apple", category: "Pantallas", model: "iPhone 15 Pro Max", quality: "Incell", price: 60, cost: 31 },
  { id: "ip-scr-15pm-oled", brand: "Apple", category: "Pantallas", model: "iPhone 15 Pro Max", quality: "OLED", price: 115, cost: 86 },
  { id: "ip-scr-15pm-ori", brand: "Apple", category: "Pantallas", model: "iPhone 15 Pro Max", quality: "Original", price: 150, cost: 110 },

  { id: "ip-scr-16-incell", brand: "Apple", category: "Pantallas", model: "iPhone 16", quality: "Incell", price: 70, cost: 44 },
  { id: "ip-scr-16-oled", brand: "Apple", category: "Pantallas", model: "iPhone 16", quality: "OLED", price: 135, cost: 105 },

  { id: "ip-scr-16plus-incell", brand: "Apple", category: "Pantallas", model: "iPhone 16 Plus", quality: "Incell", price: 60, cost: 31 },
  { id: "ip-scr-16plus-oled", brand: "Apple", category: "Pantallas", model: "iPhone 16 Plus", quality: "OLED", price: 150, cost: 120 },

  { id: "ip-scr-16p-incell", brand: "Apple", category: "Pantallas", model: "iPhone 16 Pro", quality: "Incell", price: 75, cost: 52 },
  { id: "ip-scr-16p-oled", brand: "Apple", category: "Pantallas", model: "iPhone 16 Pro", quality: "OLED", price: 115, cost: 85 },

  { id: "ip-scr-16pm-incell", brand: "Apple", category: "Pantallas", model: "iPhone 16 Pro Max", quality: "Incell", price: 70, cost: 48 },
  { id: "ip-scr-16pm-oled", brand: "Apple", category: "Pantallas", model: "iPhone 16 Pro Max", quality: "OLED", price: 115, cost: 85 },

  // ==========================================
  // 2. IPHONE - TAPAS TRASERAS
  // ==========================================
  { id: "ip-bk-8", brand: "Apple", category: "Tapas Traseras", model: "iPhone 8 / 8 Plus", quality: "Original", price: 35, cost: 4.5 },
  { id: "ip-bk-x", brand: "Apple", category: "Tapas Traseras", model: "iPhone X / XR / XS / XS Max", quality: "Original", price: 35, cost: 5 },
  { id: "ip-bk-11", brand: "Apple", category: "Tapas Traseras", model: "iPhone 11 / 11 Pro", quality: "Original", price: 35, cost: 5 },
  { id: "ip-bk-11pm", brand: "Apple", category: "Tapas Traseras", model: "iPhone 11 Pro Max", quality: "Original", price: 40, cost: 5 },
  { id: "ip-bk-12m", brand: "Apple", category: "Tapas Traseras", model: "iPhone 12 mini", quality: "Original", price: 35, cost: 5 },
  { id: "ip-bk-12", brand: "Apple", category: "Tapas Traseras", model: "iPhone 12", quality: "Original", price: 35, cost: 5 },
  { id: "ip-bk-12p", brand: "Apple", category: "Tapas Traseras", model: "iPhone 12 Pro", quality: "Original", price: 40, cost: 5 },
  { id: "ip-bk-12pm", brand: "Apple", category: "Tapas Traseras", model: "iPhone 12 Pro Max", quality: "Original", price: 45, cost: 5 },
  { id: "ip-bk-13m", brand: "Apple", category: "Tapas Traseras", model: "iPhone 13 mini", quality: "Original", price: 35, cost: 5 },
  { id: "ip-bk-13", brand: "Apple", category: "Tapas Traseras", model: "iPhone 13", quality: "Original", price: 40, cost: 5 },
  { id: "ip-bk-13p", brand: "Apple", category: "Tapas Traseras", model: "iPhone 13 Pro", quality: "Original", price: 40, cost: 5 },
  { id: "ip-bk-13pm", brand: "Apple", category: "Tapas Traseras", model: "iPhone 13 Pro Max", quality: "Original", price: 45, cost: 5 },
  { id: "ip-bk-14", brand: "Apple", category: "Tapas Traseras", model: "iPhone 14", quality: "Original", price: 40, cost: 6 },
  { id: "ip-bk-14plus", brand: "Apple", category: "Tapas Traseras", model: "iPhone 14 Plus", quality: "Original", price: 45, cost: 6 },
  { id: "ip-bk-14p", brand: "Apple", category: "Tapas Traseras", model: "iPhone 14 Pro", quality: "Original", price: 45, cost: 6 },
  { id: "ip-bk-14pm", brand: "Apple", category: "Tapas Traseras", model: "iPhone 14 Pro Max", quality: "Original", price: 50, cost: 6 },
  { id: "ip-bk-15", brand: "Apple", category: "Tapas Traseras", model: "iPhone 15", quality: "Original", price: 45, cost: 6 },
  { id: "ip-bk-15plus", brand: "Apple", category: "Tapas Traseras", model: "iPhone 15 Plus", quality: "Original", price: 50, cost: 6 },
  { id: "ip-bk-15p", brand: "Apple", category: "Tapas Traseras", model: "iPhone 15 Pro", quality: "Original", price: 50, cost: 6 },
  { id: "ip-bk-15pm", brand: "Apple", category: "Tapas Traseras", model: "iPhone 15 Pro Max", quality: "Original", price: 55, cost: 6 },
  { id: "ip-bk-16", brand: "Apple", category: "Tapas Traseras", model: "iPhone 16", quality: "Original", price: 45, cost: 13 },
  { id: "ip-bk-16plus", brand: "Apple", category: "Tapas Traseras", model: "iPhone 16 Plus", quality: "Original", price: 50, cost: 13 },
  { id: "ip-bk-16p", brand: "Apple", category: "Tapas Traseras", model: "iPhone 16 Pro", quality: "Original", price: 55, cost: 15 },
  { id: "ip-bk-16pm", brand: "Apple", category: "Tapas Traseras", model: "iPhone 16 Pro Max", quality: "Original", price: 60, cost: 15 },

  // ==========================================
  // 3. SAMSUNG - PANTALLAS
  // ==========================================
  { id: "sam-scr-a02", brand: "Samsung", category: "Pantallas", model: "Galaxy A02 / A03 / A03s", quality: "Original", price: 30, cost: 8.5 },
  { id: "sam-scr-a04", brand: "Samsung", category: "Pantallas", model: "Galaxy A04 / A04s / A04e", quality: "Original", price: 30, cost: 10 },
  { id: "sam-scr-a05", brand: "Samsung", category: "Pantallas", model: "Galaxy A05 / A05s / A06", quality: "Original", price: 30, cost: 10 },
  { id: "sam-scr-a12", brand: "Samsung", category: "Pantallas", model: "Galaxy A12 / A13", quality: "Original", price: 35, cost: 11 },
  { id: "sam-scr-a14", brand: "Samsung", category: "Pantallas", model: "Galaxy A14 4G / 5G", quality: "Incell", price: 35, cost: 12 },
  { id: "sam-scr-a15-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy A15", quality: "Incell", price: 35, cost: 15 },
  { id: "sam-scr-a15-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy A15", quality: "OLED", price: 50, cost: 30 },
  { id: "sam-scr-a15-servi", brand: "Samsung", category: "Pantallas", model: "Galaxy A15", quality: "Servipack", price: 85, cost: 60 },
  { id: "sam-scr-a16-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy A16 4G / 5G", quality: "Incell", price: 35, cost: 17 },
  { id: "sam-scr-a16-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy A16 4G / 5G", quality: "OLED", price: 65, cost: 45 },
  { id: "sam-scr-a24-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy A24", quality: "Incell", price: 35, cost: 15 },
  { id: "sam-scr-a24-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy A24", quality: "OLED", price: 55, cost: 34.5 },
  { id: "sam-scr-a25-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy A25", quality: "Incell", price: 35, cost: 15 },
  { id: "sam-scr-a25-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy A25", quality: "OLED", price: 55, cost: 34 },
  { id: "sam-scr-a34-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy A34", quality: "Incell", price: 35, cost: 17 },
  { id: "sam-scr-a34-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy A34", quality: "OLED", price: 55, cost: 36 },
  { id: "sam-scr-a35-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy A35", quality: "Incell", price: 35, cost: 20 },
  { id: "sam-scr-a35-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy A35", quality: "OLED", price: 55, cost: 36 },
  { id: "sam-scr-a54-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy A54", quality: "Incell", price: 37.5, cost: 18 },
  { id: "sam-scr-a54-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy A54", quality: "OLED", price: 60, cost: 31 },
  { id: "sam-scr-a54-ori", brand: "Samsung", category: "Pantallas", model: "Galaxy A54", quality: "Original", price: 85, cost: 65 },
  { id: "sam-scr-a55-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy A55", quality: "Incell", price: 37.5, cost: 22 },
  { id: "sam-scr-a55-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy A55", quality: "OLED", price: 60, cost: 37 },
  { id: "sam-scr-a55-ori", brand: "Samsung", category: "Pantallas", model: "Galaxy A55", quality: "Original", price: 100, cost: 80 },

  { id: "sam-scr-s20fe-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S20 FE", quality: "Incell", price: 40, cost: 19 },
  { id: "sam-scr-s20fe-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S20 FE", quality: "OLED", price: 60, cost: 33 },
  { id: "sam-scr-s20fe-ori", brand: "Samsung", category: "Pantallas", model: "Galaxy S20 FE", quality: "Original", price: 90, cost: 64 },
  { id: "sam-scr-s21fe-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S21 FE", quality: "OLED", price: 70, cost: 42 },

  { id: "sam-scr-s20-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S20", quality: "Incell", price: 65, cost: 38 },
  { id: "sam-scr-s20-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S20", quality: "OLED", price: 80, cost: 70 },
  { id: "sam-scr-s20p-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S20+", quality: "Incell", price: 65, cost: 34 },
  { id: "sam-scr-s20p-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S20+", quality: "OLED", price: 90, cost: 57 },
  { id: "sam-scr-s20u-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S20 Ultra", quality: "Incell", price: 65, cost: 42 },
  { id: "sam-scr-s20u-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S20 Ultra", quality: "OLED", price: 100, cost: 77 },

  { id: "sam-scr-s21-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S21", quality: "Incell", price: 65, cost: 38 },
  { id: "sam-scr-s21-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S21", quality: "OLED", price: 85, cost: 83 },
  { id: "sam-scr-s21p-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S21+", quality: "Incell", price: 65, cost: 35 },
  { id: "sam-scr-s21p-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S21+", quality: "OLED", price: 105, cost: 60 },
  { id: "sam-scr-s21u-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S21 Ultra", quality: "Incell", price: 75, cost: 50 },
  { id: "sam-scr-s21u-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S21 Ultra", quality: "OLED", price: 100, cost: 71 },

  { id: "sam-scr-s22-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S22", quality: "Incell", price: 65, cost: 38 },
  { id: "sam-scr-s22p-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S22+", quality: "Incell", price: 65, cost: 42 },
  { id: "sam-scr-s22p-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S22+", quality: "OLED", price: 90, cost: 67 },
  { id: "sam-scr-s22u-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S22 Ultra", quality: "Incell", price: 75, cost: 50 },
  { id: "sam-scr-s22u-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S22 Ultra", quality: "OLED", price: 110, cost: 75 },

  { id: "sam-scr-s23-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S23", quality: "Incell", price: 75, cost: 50 },
  { id: "sam-scr-s23p-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S23+", quality: "Incell", price: 65, cost: 40 },
  { id: "sam-scr-s23p-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S23+", quality: "OLED", price: 85, cost: 62 },
  { id: "sam-scr-s23u-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S23 Ultra", quality: "Incell", price: 75, cost: 50 },
  { id: "sam-scr-s23u-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S23 Ultra", quality: "OLED", price: 100, cost: 75 },

  { id: "sam-scr-s24u-inc", brand: "Samsung", category: "Pantallas", model: "Galaxy S24 Ultra", quality: "Incell", price: 75, cost: 50 },
  { id: "sam-scr-s24u-oled", brand: "Samsung", category: "Pantallas", model: "Galaxy S24 Ultra", quality: "OLED", price: 130, cost: 95 },

  { id: "sam-scr-zflip3", brand: "Samsung", category: "Pantallas", model: "Galaxy Z Flip 3", quality: "Original", price: 250, cost: 195 },
  { id: "sam-scr-zflip4", brand: "Samsung", category: "Pantallas", model: "Galaxy Z Flip 4", quality: "Original", price: 260, cost: 205 },
  { id: "sam-scr-zflip5", brand: "Samsung", category: "Pantallas", model: "Galaxy Z Flip 5", quality: "Original", price: 310, cost: 260 },

  // ==========================================
  // 4. SAMSUNG - TAPAS TRASERAS
  // ==========================================
  { id: "sam-bk-a-series", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy A10 a A72 (Series A)", quality: "Original", price: 20, cost: 6 },
  { id: "sam-bk-s20", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy S20 / S20+ / S20 FE", quality: "Original", price: 25, cost: 6 },
  { id: "sam-bk-s21", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy S21 / S21+ / S21 FE", quality: "Original", price: 25, cost: 6 },
  { id: "sam-bk-s21u", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy S21 Ultra", quality: "Original", price: 30, cost: 7 },
  { id: "sam-bk-s22", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy S22 / S22+ / S22 Ultra", quality: "Original", price: 30, cost: 7 },
  { id: "sam-bk-s23", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy S23", quality: "Original", price: 30, cost: 7 },
  { id: "sam-bk-s23p", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy S23+", quality: "Original", price: 30, cost: 7 },
  { id: "sam-bk-s23u", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy S23 Ultra", quality: "Original", price: 35, cost: 7 },
  { id: "sam-bk-s24", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy S24", quality: "Original", price: 30, cost: 7 },
  { id: "sam-bk-s24p", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy S24+", quality: "Original", price: 30, cost: 7 },
  { id: "sam-bk-s24u", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy S24 Ultra", quality: "Original", price: 35, cost: 7 },
  { id: "sam-bk-note", brand: "Samsung", category: "Tapas Traseras", model: "Galaxy Note 10 / Note 20 Ultra", quality: "Original", price: 25, cost: 7 },

  // ==========================================
  // 5. HONOR - PANTALLAS
  // ==========================================
  { id: "hn-scr-x5", brand: "Honor", category: "Pantallas", model: "Honor X5 / X6 / X6s", quality: "Original", price: 30, cost: 10 },
  { id: "hn-scr-x7", brand: "Honor", category: "Pantallas", model: "Honor X7 / X7a / X7b", quality: "Original", price: 30, cost: 11 },
  { id: "hn-scr-x8", brand: "Honor", category: "Pantallas", model: "Honor X8 / X8a / X8b", quality: "Original", price: 37.5, cost: 14 },
  { id: "hn-scr-x9", brand: "Honor", category: "Pantallas", model: "Honor X9", quality: "Original", price: 25, cost: 20 },
  { id: "hn-scr-m5l-inc", brand: "Honor", category: "Pantallas", model: "Honor Magic 5 Lite", quality: "Incell", price: 37.5, cost: 22 },
  { id: "hn-scr-m5l-oled", brand: "Honor", category: "Pantallas", model: "Honor Magic 5 Lite", quality: "OLED", price: 65, cost: 38 },
  { id: "hn-scr-m6l-inc", brand: "Honor", category: "Pantallas", model: "Honor Magic 6 Lite", quality: "Incell", price: 60, cost: 28 },
  { id: "hn-scr-m6l-oled", brand: "Honor", category: "Pantallas", model: "Honor Magic 6 Lite", quality: "OLED", price: 75, cost: 45 },
  { id: "hn-scr-m7l-inc", brand: "Honor", category: "Pantallas", model: "Honor Magic 7 Lite", quality: "Incell", price: 60, cost: 28 },
  { id: "hn-scr-m7l-ori", brand: "Honor", category: "Pantallas", model: "Honor Magic 7 Lite", quality: "Original", price: 76, cost: 45 },
  { id: "hn-scr-90-inc", brand: "Honor", category: "Pantallas", model: "Honor 90 / 90 Lite", quality: "Incell", price: 35, cost: 14 },
  { id: "hn-scr-90-ori", brand: "Honor", category: "Pantallas", model: "Honor 90", quality: "Original", price: 60, cost: 42 },
  { id: "hn-scr-200-inc", brand: "Honor", category: "Pantallas", model: "Honor 200 / 200 Lite", quality: "Incell", price: 45, cost: 24 },
  { id: "hn-scr-200-ori", brand: "Honor", category: "Pantallas", model: "Honor 200", quality: "Original", price: 65, cost: 43 },

  // ==========================================
  // 6. HONOR - TAPAS TRASERAS
  // ==========================================
  { id: "hn-bk-x", brand: "Honor", category: "Tapas Traseras", model: "Honor X6 / X7 / X8 / X9", quality: "Original", price: 20, cost: 5.5 },
  { id: "hn-bk-m5l", brand: "Honor", category: "Tapas Traseras", model: "Honor Magic 5 Lite", quality: "Original", price: 20, cost: 6 },
  { id: "hn-bk-m6l", brand: "Honor", category: "Tapas Traseras", model: "Honor Magic 6 Lite", quality: "Original", price: 20, cost: 6 },
  { id: "hn-bk-h50", brand: "Honor", category: "Tapas Traseras", model: "Honor 50 / 90 / 200", quality: "Original", price: 25, cost: 8 },

  // ==========================================
  // 7. XIAOMI - PANTALLAS
  // ==========================================
  { id: "xm-scr-red9", brand: "Xiaomi", category: "Pantallas", model: "Redmi 9 / 9A / 9C / 10 / 10C", quality: "Original", price: 30, cost: 11 },
  { id: "xm-scr-red12", brand: "Xiaomi", category: "Pantallas", model: "Redmi 12 / 13 / 13C / 14C", quality: "Original", price: 30, cost: 11 },
  { id: "xm-scr-n10-oled", brand: "Xiaomi", category: "Pantallas", model: "Redmi Note 10 / 10s", quality: "OLED", price: 45, cost: 26 },
  { id: "xm-scr-n11-inc", brand: "Xiaomi", category: "Pantallas", model: "Redmi Note 11 / 11s", quality: "Incell", price: 35, cost: 13 },
  { id: "xm-scr-n11-oled", brand: "Xiaomi", category: "Pantallas", model: "Redmi Note 11 / 11s", quality: "OLED", price: 45, cost: 28 },
  { id: "xm-scr-n12-inc", brand: "Xiaomi", category: "Pantallas", model: "Redmi Note 12 4G / 5G", quality: "Incell", price: 35, cost: 14 },
  { id: "xm-scr-n12-oled", brand: "Xiaomi", category: "Pantallas", model: "Redmi Note 12 4G / 5G", quality: "OLED", price: 55, cost: 32 },
  { id: "xm-scr-n13-inc", brand: "Xiaomi", category: "Pantallas", model: "Redmi Note 13 4G / 5G", quality: "Incell", price: 35, cost: 15 },
  { id: "xm-scr-n13-oled", brand: "Xiaomi", category: "Pantallas", model: "Redmi Note 13 4G / 5G", quality: "OLED", price: 55, cost: 36 },
  { id: "xm-scr-n14-inc", brand: "Xiaomi", category: "Pantallas", model: "Redmi Note 14", quality: "Incell", price: 35, cost: 14 },
  { id: "xm-scr-n14-oled", brand: "Xiaomi", category: "Pantallas", model: "Redmi Note 14", quality: "OLED", price: 60, cost: 36 },
  { id: "xm-scr-n14p-oled", brand: "Xiaomi", category: "Pantallas", model: "Redmi Note 14 Pro", quality: "OLED", price: 65, cost: 41 },
  { id: "xm-scr-x3-inc", brand: "Xiaomi", category: "Pantallas", model: "Poco X3 / X3 Pro", quality: "Incell", price: 35, cost: 14 },
  { id: "xm-scr-x4p-oled", brand: "Xiaomi", category: "Pantallas", model: "Poco X4 Pro / X5", quality: "OLED", price: 65, cost: 33 },
  { id: "xm-scr-x6-inc", brand: "Xiaomi", category: "Pantallas", model: "Poco X6", quality: "Incell", price: 35, cost: 18 },
  { id: "xm-scr-x6p-inc", brand: "Xiaomi", category: "Pantallas", model: "Poco X6 Pro", quality: "Incell", price: 55, cost: 28 },
  { id: "xm-scr-x6-oled", brand: "Xiaomi", category: "Pantallas", model: "Poco X6 / X6 Pro", quality: "OLED", price: 65, cost: 40 },
  { id: "xm-scr-f3-oled", brand: "Xiaomi", category: "Pantallas", model: "Poco F3 / F4 / F5", quality: "OLED", price: 65, cost: 35 },

  // ==========================================
  // 8. XIAOMI - TAPAS TRASERAS
  // ==========================================
  { id: "xm-bk-note", brand: "Xiaomi", category: "Tapas Traseras", model: "Redmi Note 8 / 9 / 10 / 11 / 12 / 13", quality: "Original", price: 20, cost: 6.5 },
  { id: "xm-bk-pocox", brand: "Xiaomi", category: "Tapas Traseras", model: "Poco X3 / X4 Pro / X5 Pro / X6", quality: "Original", price: 25, cost: 6.5 },
  { id: "xm-bk-pocof", brand: "Xiaomi", category: "Tapas Traseras", model: "Poco F3 / F4 / F5", quality: "Original", price: 25, cost: 6.5 },

  // ==========================================
  // 9. FLEX / PUERTOS DE CARGA
  // ==========================================
  { id: "ch-ip-x", brand: "Apple", category: "Puertos de Carga", model: "iPhone X / XR / XS / XS Max", quality: "Original", price: 35, cost: 9 },
  { id: "ch-ip-11", brand: "Apple", category: "Puertos de Carga", model: "iPhone 11", quality: "Original", price: 35, cost: 10 },
  { id: "ch-ip-11p", brand: "Apple", category: "Puertos de Carga", model: "iPhone 11 Pro", quality: "Original", price: 35, cost: 26 },
  { id: "ch-ip-11pm", brand: "Apple", category: "Puertos de Carga", model: "iPhone 11 Pro Max", quality: "Original", price: 45, cost: 27 },
  { id: "ch-ip-12", brand: "Apple", category: "Puertos de Carga", model: "iPhone 12", quality: "Original", price: 35, cost: 12 },
  { id: "ch-ip-12p", brand: "Apple", category: "Puertos de Carga", model: "iPhone 12 Pro", quality: "Original", price: 35, cost: 12 },
  { id: "ch-ip-12pm", brand: "Apple", category: "Puertos de Carga", model: "iPhone 12 Pro Max", quality: "Original", price: 45, cost: 20 },
  { id: "ch-ip-13", brand: "Apple", category: "Puertos de Carga", model: "iPhone 13", quality: "Original", price: 35, cost: 12 },
  { id: "ch-ip-13p", brand: "Apple", category: "Puertos de Carga", model: "iPhone 13 Pro", quality: "Original", price: 35, cost: 18 },
  { id: "ch-ip-13pm", brand: "Apple", category: "Puertos de Carga", model: "iPhone 13 Pro Max", quality: "Original", price: 45, cost: 16 },
  { id: "ch-ip-14", brand: "Apple", category: "Puertos de Carga", model: "iPhone 14", quality: "Original", price: 40, cost: 16 },
  { id: "ch-ip-14p", brand: "Apple", category: "Puertos de Carga", model: "iPhone 14 Pro", quality: "Original", price: 40, cost: 20 },
  { id: "ch-ip-14pm", brand: "Apple", category: "Puertos de Carga", model: "iPhone 14 Pro Max", quality: "Original", price: 50, cost: 28 },
  { id: "ch-ip-15", brand: "Apple", category: "Puertos de Carga", model: "iPhone 15", quality: "Original", price: 50, cost: 28 },
  { id: "ch-ip-15p", brand: "Apple", category: "Puertos de Carga", model: "iPhone 15 Pro", quality: "Original", price: 55, cost: 32 },
  { id: "ch-ip-15pm", brand: "Apple", category: "Puertos de Carga", model: "iPhone 15 Pro Max", quality: "Original", price: 60, cost: 38 },

  { id: "ch-sam-a", brand: "Samsung", category: "Puertos de Carga", model: "Galaxy Series A (A12, A14, A15, A54, A55)", quality: "Original", price: 30, cost: 7 },
  { id: "ch-sam-s-std", brand: "Samsung", category: "Puertos de Carga", model: "Galaxy Series S (S20, S21, S22 Base / Plus)", quality: "Original", price: 30, cost: 8 },
  { id: "ch-sam-s-ultra", brand: "Samsung", category: "Puertos de Carga", model: "Galaxy Series S (S22, S23, S24 Ultra)", quality: "Original", price: 35, cost: 14 },

  { id: "ch-hn-all", brand: "Honor", category: "Puertos de Carga", model: "Honor Series X & Magic Lite", quality: "Original", price: 35, cost: 8 },
  { id: "ch-xm-all", brand: "Xiaomi", category: "Puertos de Carga", model: "Redmi Note & Poco Series", quality: "Original", price: 27.5, cost: 7 }
];

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
    "Pixel 8 Pro",
    "Pixel 7 Pro",
    "Pixel 7",
    "Pixel 6 Pro",
    "Pixel 6 / 6A"
  ]
};
