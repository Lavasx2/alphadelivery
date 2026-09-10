export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // دج
  category: string;
  image?: string;
  popular?: boolean;
}

export const CATEGORIES = [
  "بيتزا",
  "طاكوس",
  "صوفلي",
  "مقلوب",
  "برغر",
  "شاورما",
  "بوتين",
  "بانيني",
  "ساندويتش",
  "أطباق",
  "مكسيكي",
  "سلطات",
  "بوكس",
  "كريسبي كورن تشيز",
];

export const MENU_ITEMS: MenuItem[] = [
  // بيتزا
  { id: "pizza-margherita", name: "بيتزا مارغريتا", description: "صلصة طماطم وموزاريلا", price: 300, category: "بيتزا" },
  { id: "pizza-champignon", name: "بيتزا شامبينيون", description: "فطر طازج وجبنة", price: 400, category: "بيتزا" },
  { id: "pizza-poulet", name: "بيتزا دجاج", description: "دجاج متبل وجبنة ذائبة", price: 400, category: "بيتزا" },
  { id: "pizza-thon", name: "بيتزا تونة", description: "تونة، زيتون وجبنة", price: 450, category: "بيتزا" },
  { id: "pizza-viande", name: "بيتزا لحم", description: "لحم مفروم متبل", price: 500, category: "بيتزا" },
  { id: "pizza-vegetarienne", name: "بيتزا خضار", description: "خضار موسمية مشكّلة", price: 500, category: "بيتزا" },
  { id: "pizza-special", name: "بيتزا سبيسيال", description: "خلطة الشيف", price: 550, category: "بيتزا", popular: true },
  { id: "pizza-3fromage", name: "بيتزا 3 أجبان", description: "موزاريلا، غرويار وشيدر", price: 600, category: "بيتزا" },
  { id: "pizza-royal", name: "بيتزا رويال", description: "دجاج، لحم وفطر", price: 700, category: "بيتزا" },
  { id: "pizza-4saison", name: "بيتزا 4 فصول", description: "أربع نكهات في بيتزا واحدة", price: 800, category: "بيتزا" },
  { id: "pizza-crust", name: "بيتزا كراست", description: "بيتزا البيت الخاصة بكل المكونات", price: 1000, category: "بيتزا", popular: true },

  // طاكوس
  { id: "tacos-poulet-m", name: "طاكوس دجاج (M)", description: "دجاج، بطاطس وصلصة", price: 400, category: "طاكوس" },
  { id: "tacos-viande-m", name: "طاكوس لحم (M)", description: "لحم مفروم، بطاطس وصلصة", price: 450, category: "طاكوس" },
  { id: "tacos-kebda-m", name: "طاكوس كبدة (M)", description: "كبدة متبلة، بطاطس وصلصة", price: 500, category: "طاكوس" },
  { id: "tacos-mixte-m", name: "طاكوس مكس (M)", description: "دجاج ولحم مع بطاطس", price: 550, category: "طاكوس" },
  { id: "tacos-crispy-m", name: "طاكوس كريسبي (M)", description: "دجاج مقرمش وصلصة", price: 600, category: "طاكوس" },
  { id: "tacos-poulet-l", name: "طاكوس دجاج (L)", description: "حجم كبير", price: 500, category: "طاكوس" },
  { id: "tacos-viande-l", name: "طاكوس لحم (L)", description: "حجم كبير", price: 550, category: "طاكوس" },
  { id: "tacos-kebda-l", name: "طاكوس كبدة (L)", description: "حجم كبير", price: 650, category: "طاكوس" },
  { id: "tacos-mixte-l", name: "طاكوس مكس (L)", description: "حجم كبير", price: 700, category: "طاكوس", popular: true },
  { id: "tacos-crispy-l", name: "طاكوس كريسبي (L)", description: "حجم كبير", price: 800, category: "طاكوس" },

  // صوفلي
  { id: "souflet-poulet", name: "صوفلي دجاج", description: "خبز صوفلي بالدجاج والجبن", price: 450, category: "صوفلي" },
  { id: "souflet-viande", name: "صوفلي لحم", description: "لحم مفروم وجبنة", price: 500, category: "صوفلي" },
  { id: "souflet-kebda", name: "صوفلي كبدة", description: "كبدة متبلة وجبنة", price: 600, category: "صوفلي" },
  { id: "souflet-mixte", name: "صوفلي مكس", description: "دجاج ولحم", price: 650, category: "صوفلي" },
  { id: "baguette-farcie", name: "باغيت فارسي", description: "خبز محشو بالكامل", price: 750, category: "صوفلي" },

  // مقلوب
  { id: "makloub-poulet", name: "مقلوب دجاج", description: "خبز مقلوب بالدجاج", price: 350, category: "مقلوب" },
  { id: "makloub-viande", name: "مقلوب لحم", description: "لحم مفروم وجبنة", price: 400, category: "مقلوب" },
  { id: "makloub-kebda", name: "مقلوب كبدة", description: "كبدة متبلة", price: 500, category: "مقلوب" },
  { id: "makloub-mixte", name: "مقلوب مكس", description: "دجاج ولحم", price: 500, category: "مقلوب" },

  // كريسبي كورن تشيز
  { id: "cc-croquette", name: "كروكيت", description: "قطعة كروكيت مقرمشة", price: 150, category: "كريسبي كورن تشيز" },
  { id: "cc-poulet", name: "كريسبي دجاج", description: "دجاج مقرمش مع جبنة ذائبة", price: 500, category: "كريسبي كورن تشيز" },
  { id: "cc-viande", name: "كريسبي لحم", description: "لحم مع جبنة ذائبة", price: 600, category: "كريسبي كورن تشيز" },
  { id: "cc-mixte", name: "كريسبي مكس", description: "دجاج ولحم مع جبنة", price: 650, category: "كريسبي كورن تشيز" },
  { id: "cc-crust", name: "كريسبي كراست", description: "الوصفة الكاملة الخاصة", price: 800, category: "كريسبي كورن تشيز", popular: true },

  // برغر
  { id: "burger-cheese-viande", name: "تشيز برغر لحم", description: "لحم بقري وجبنة شيدر", price: 250, category: "برغر" },
  { id: "burger-cheese-poulet", name: "تشيز برغر دجاج", description: "دجاج وجبنة شيدر", price: 300, category: "برغر" },
  { id: "burger-classique", name: "برغر كلاسيك", description: "برغر بالخضار والصلصة", price: 300, category: "برغر", popular: true },
  { id: "burger-chicken", name: "تشيز تشيكن", description: "دجاج مقرمش وجبنة", price: 350, category: "برغر" },
  { id: "burger-double", name: "دوبل تشيز برغر", description: "قطعتان من اللحم والجبن", price: 400, category: "برغر" },
  { id: "burger-mixte", name: "تشيز برغر مكس", description: "لحم ودجاج معاً", price: 400, category: "برغر" },

  // شاورما
  { id: "chawerma-libanaise", name: "شاورما لبنانية", description: "خبز عربي، دجاج وصلصة ثوم", price: 300, category: "شاورما" },
  { id: "chawerma-extra", name: "شاورما إكسترا", description: "حشوة مضاعفة", price: 400, category: "شاورما" },

  // بوتين
  { id: "poutine-fromage", name: "بوتين جبنة", description: "بطاطس وجبنة ذائبة", price: 200, category: "بوتين" },
  { id: "poutine-poulet", name: "بوتين دجاج", description: "بطاطس، دجاج وجبنة", price: 300, category: "بوتين" },
  { id: "poutine-viande", name: "بوتين لحم", description: "بطاطس، لحم وجبنة", price: 400, category: "بوتين" },
  { id: "poutine-mixte", name: "بوتين مكس", description: "دجاج ولحم مع جبنة", price: 500, category: "بوتين" },
  { id: "poutine-crust", name: "بوتين كراست", description: "الوصفة الكاملة", price: 650, category: "بوتين" },

  // بانيني
  { id: "panini-poulet", name: "بانيني دجاج", description: "دجاج وجبنة مشوية", price: 250, category: "بانيني" },
  { id: "panini-viande-hachee", name: "بانيني لحم مفروم", description: "لحم مفروم وجبنة", price: 250, category: "بانيني" },
  { id: "panini-3fromage", name: "بانيني 3 أجبان", description: "خليط أجبان ذائبة", price: 300, category: "بانيني" },
  { id: "panini-thon", name: "بانيني تونة", description: "تونة وجبنة", price: 300, category: "بانيني" },

  // ساندويتش
  { id: "sandwich-special", name: "ساندويتش سبيسيال", description: "خلطة البيت", price: 250, category: "ساندويتش" },
  { id: "sandwich-marine", name: "ساندويتش مارينيه", description: "دجاج متبل مشوي", price: 300, category: "ساندويتش" },
  { id: "sandwich-royal", name: "ساندويتش رويال", description: "حشوة غنية", price: 350, category: "ساندويتش" },
  { id: "sandwich-mixte", name: "ساندويتش مكس", description: "دجاج ولحم", price: 450, category: "ساندويتش" },
  { id: "sandwich-kebda", name: "ساندويتش كبدة", description: "كبدة متبلة", price: 450, category: "ساندويتش" },

  // أطباق
  { id: "plat-frite", name: "بطاطس مقلية", description: "فريت ذهبي مقرمش", price: 150, category: "أطباق" },
  { id: "plat-escalope", name: "إسكالوب", description: "إسكالوب مع بطاطس وسلطة", price: 550, category: "أطباق" },
  { id: "plat-indien", name: "طبق هندي", description: "دجاج بتوابل هندية", price: 600, category: "أطباق" },
  { id: "plat-chiche", name: "شيش كباب", description: "أسياخ مشوية مع بطاطس", price: 600, category: "أطباق" },
  { id: "plat-crispy", name: "طبق كريسبي", description: "دجاج مقرمش مع بطاطس", price: 600, category: "أطباق" },
  { id: "plat-viande-hachee", name: "طبق لحم مفروم", description: "لحم مفروم مشوي مع بطاطس", price: 600, category: "أطباق" },
  { id: "plat-poulet-creme", name: "دجاج بالكريمة", description: "صدر دجاج بصلصة كريمية", price: 700, category: "أطباق", popular: true },
  { id: "plat-mixte-marine", name: "طبق مكس مارينيه", description: "دجاج متبل ولحم", price: 850, category: "أطباق" },

  // مكسيكي
  { id: "mex-poulet", name: "مكسيكي دجاج", description: "دجاج بالنكهة المكسيكية", price: 400, category: "مكسيكي" },
  { id: "mex-viande", name: "مكسيكي لحم", description: "لحم بالنكهة المكسيكية", price: 450, category: "مكسيكي" },
  { id: "mex-mixte", name: "مكسيكي مكس", description: "دجاج ولحم", price: 600, category: "مكسيكي" },

  // سلطات
  { id: "salade-variee", name: "سلطة مشكّلة", description: "خضار طازجة متنوعة", price: 250, category: "سلطات" },
  { id: "salade-tunisienne", name: "سلطة تونسية", description: "الوصفة التونسية التقليدية", price: 250, category: "سلطات" },
  { id: "salade-cesar", name: "سلطة سيزر", description: "دجاج، خس وصلصة سيزر", price: 250, category: "سلطات" },
  { id: "salade-riz", name: "سلطة أرز", description: "أرز بالخضار والصلصة", price: 300, category: "سلطات" },
  { id: "salade-thon", name: "سلطة تونة", description: "تونة، خضار وزيتون", price: 350, category: "سلطات" },

  // بوكس
  { id: "box-1", name: "بوكس شخص واحد", description: "وجبة كاملة لشخص", price: 500, category: "بوكس" },
  { id: "box-2", name: "بوكس شخصين", description: "وجبة كاملة لشخصين", price: 800, category: "بوكس" },
  { id: "box-3", name: "بوكس 3 أشخاص", description: "وجبة كاملة لثلاثة", price: 1200, category: "بوكس" },
  { id: "box-4", name: "بوكس 4 أشخاص", description: "وجبة كاملة لأربعة", price: 1500, category: "بوكس" },
  { id: "box-familiale", name: "بوكس عائلي", description: "وجبة كاملة للعائلة", price: 2000, category: "بوكس", popular: true },
  { id: "pack-crispy", name: "باك كريسبي", description: "كروكيت كامامبير + طاكوس + كريسبي كورن تشيز + تشيكن كريسبي + فريت", price: 2500, category: "بوكس" },
];

export const SUPPLEMENTS = {
  pizza: [
    { name: "غرويار", price: 300 },
    { name: "موزاريلا", price: 200 },
    { name: "كامامبير", price: 200 },
    { name: "صلصة بيضاء", price: 100 },
  ],
  tacos: [
    { name: "غرويار", price: 150 },
    { name: "غودا", price: 150 },
    { name: "فرماج روج", price: 150 },
    { name: "كامامبير", price: 100 },
    { name: "شيدر", price: 100 },
    { name: "دجاج مدخن", price: 100 },
  ],
};

export const RESTAURANT = {
  name: "Crust Tebessa",
  tagline: "Snacks & Drinks",
  phone: "0666321449",
  address: "تبسة، الجزائر",
  plusCode: "C44C+M5G تبسة",
  rating: 4.9,
  ratingCount: 7,
  lat: 35.4066917,
  lng: 8.1204584,
  placeId: "ChIJO-B2EwDt-RIRll19KgssiKE",
  mapsUrl:
    "https://www.google.com/maps/place/Crust+tebessa/@35.4066917,8.1204584,17z",
};

export function formatPrice(price: number) {
  return `${price.toLocaleString("ar-DZ")} دج`;
}
