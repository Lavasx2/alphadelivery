import type { Lang } from "./i18n";
import type { MenuItem } from "./menu";

/** Category labels per language (key = Arabic category name used in data). */
export const CATEGORY_LABELS: Record<string, { en: string; fr: string }> = {
  بيتزا: { en: "Pizza", fr: "Pizza" },
  طاكوس: { en: "Tacos", fr: "Tacos" },
  صوفلي: { en: "Soufflé", fr: "Soufflé" },
  مقلوب: { en: "Makloub", fr: "Makloub" },
  برغر: { en: "Burgers", fr: "Burgers" },
  شاورما: { en: "Shawarma", fr: "Chawarma" },
  بوتين: { en: "Poutine", fr: "Poutine" },
  بانيني: { en: "Panini", fr: "Panini" },
  ساندويتش: { en: "Sandwiches", fr: "Sandwichs" },
  أطباق: { en: "Plates", fr: "Plats" },
  مكسيكي: { en: "Mexican", fr: "Mexicain" },
  سلطات: { en: "Salads", fr: "Salades" },
  بوكس: { en: "Boxes", fr: "Box" },
  "كريسبي كورن تشيز": {
    en: "Crispy Corn Cheese",
    fr: "Crispy Corn Cheese",
  },
};

export function localizeCategory(category: string, lang: Lang) {
  if (lang === "ar") return category;
  return CATEGORY_LABELS[category]?.[lang] ?? category;
}

type Tr = { name: string; description: string };

/** id -> { en, fr } translations for the built-in menu. */
export const ITEM_LABELS: Record<string, { en: Tr; fr: Tr }> = {
  "pizza-margherita": {
    en: { name: "Margherita Pizza", description: "Tomato sauce and mozzarella" },
    fr: { name: "Pizza Margherita", description: "Sauce tomate et mozzarella" },
  },
  "pizza-champignon": {
    en: { name: "Mushroom Pizza", description: "Fresh mushrooms and cheese" },
    fr: { name: "Pizza Champignon", description: "Champignons frais et fromage" },
  },
  "pizza-poulet": {
    en: { name: "Chicken Pizza", description: "Marinated chicken and melted cheese" },
    fr: { name: "Pizza Poulet", description: "Poulet mariné et fromage fondu" },
  },
  "pizza-thon": {
    en: { name: "Tuna Pizza", description: "Tuna, olives and cheese" },
    fr: { name: "Pizza Thon", description: "Thon, olives et fromage" },
  },
  "pizza-viande": {
    en: { name: "Beef Pizza", description: "Seasoned minced beef" },
    fr: { name: "Pizza Viande", description: "Viande hachée assaisonnée" },
  },
  "pizza-vegetarienne": {
    en: { name: "Veggie Pizza", description: "Mixed seasonal vegetables" },
    fr: { name: "Pizza Végétarienne", description: "Légumes de saison" },
  },
  "pizza-special": {
    en: { name: "Special Pizza", description: "The chef's own mix" },
    fr: { name: "Pizza Spéciale", description: "Le mélange du chef" },
  },
  "pizza-3fromage": {
    en: { name: "3-Cheese Pizza", description: "Mozzarella, gruyère and cheddar" },
    fr: { name: "Pizza 3 Fromages", description: "Mozzarella, gruyère et cheddar" },
  },
  "pizza-royal": {
    en: { name: "Royal Pizza", description: "Chicken, beef and mushrooms" },
    fr: { name: "Pizza Royale", description: "Poulet, viande et champignons" },
  },
  "pizza-4saison": {
    en: { name: "4 Seasons Pizza", description: "Four flavours on one pizza" },
    fr: { name: "Pizza 4 Saisons", description: "Quatre saveurs sur une pizza" },
  },
  "pizza-crust": {
    en: { name: "Crust Pizza", description: "Our signature pizza with everything" },
    fr: { name: "Pizza Crust", description: "Notre pizza signature, tout garnie" },
  },
  "tacos-poulet-m": {
    en: { name: "Chicken Tacos (M)", description: "Chicken, fries and sauce" },
    fr: { name: "Tacos Poulet (M)", description: "Poulet, frites et sauce" },
  },
  "tacos-viande-m": {
    en: { name: "Beef Tacos (M)", description: "Minced beef, fries and sauce" },
    fr: { name: "Tacos Viande (M)", description: "Viande hachée, frites et sauce" },
  },
  "tacos-kebda-m": {
    en: { name: "Liver Tacos (M)", description: "Seasoned liver, fries and sauce" },
    fr: { name: "Tacos Foie (M)", description: "Foie assaisonné, frites et sauce" },
  },
  "tacos-mixte-m": {
    en: { name: "Mixed Tacos (M)", description: "Chicken and beef with fries" },
    fr: { name: "Tacos Mixte (M)", description: "Poulet et viande avec frites" },
  },
  "tacos-crispy-m": {
    en: { name: "Crispy Tacos (M)", description: "Crispy chicken and sauce" },
    fr: { name: "Tacos Crispy (M)", description: "Poulet croustillant et sauce" },
  },
  "tacos-poulet-l": {
    en: { name: "Chicken Tacos (L)", description: "Large size" },
    fr: { name: "Tacos Poulet (L)", description: "Grande taille" },
  },
  "tacos-viande-l": {
    en: { name: "Beef Tacos (L)", description: "Large size" },
    fr: { name: "Tacos Viande (L)", description: "Grande taille" },
  },
  "tacos-kebda-l": {
    en: { name: "Liver Tacos (L)", description: "Large size" },
    fr: { name: "Tacos Foie (L)", description: "Grande taille" },
  },
  "tacos-mixte-l": {
    en: { name: "Mixed Tacos (L)", description: "Large size" },
    fr: { name: "Tacos Mixte (L)", description: "Grande taille" },
  },
  "tacos-crispy-l": {
    en: { name: "Crispy Tacos (L)", description: "Large size" },
    fr: { name: "Tacos Crispy (L)", description: "Grande taille" },
  },
  "souflet-poulet": {
    en: { name: "Chicken Soufflé", description: "Soufflé bread with chicken and cheese" },
    fr: { name: "Soufflé Poulet", description: "Pain soufflé, poulet et fromage" },
  },
  "souflet-viande": {
    en: { name: "Beef Soufflé", description: "Minced beef and cheese" },
    fr: { name: "Soufflé Viande", description: "Viande hachée et fromage" },
  },
  "souflet-kebda": {
    en: { name: "Liver Soufflé", description: "Seasoned liver and cheese" },
    fr: { name: "Soufflé Foie", description: "Foie assaisonné et fromage" },
  },
  "souflet-mixte": {
    en: { name: "Mixed Soufflé", description: "Chicken and beef" },
    fr: { name: "Soufflé Mixte", description: "Poulet et viande" },
  },
  "baguette-farcie": {
    en: { name: "Stuffed Baguette", description: "Fully loaded baguette" },
    fr: { name: "Baguette Farcie", description: "Baguette entièrement garnie" },
  },
  "makloub-poulet": {
    en: { name: "Chicken Makloub", description: "Makloub bread with chicken" },
    fr: { name: "Makloub Poulet", description: "Pain makloub au poulet" },
  },
  "makloub-viande": {
    en: { name: "Beef Makloub", description: "Minced beef and cheese" },
    fr: { name: "Makloub Viande", description: "Viande hachée et fromage" },
  },
  "makloub-kebda": {
    en: { name: "Liver Makloub", description: "Seasoned liver" },
    fr: { name: "Makloub Foie", description: "Foie assaisonné" },
  },
  "makloub-mixte": {
    en: { name: "Mixed Makloub", description: "Chicken and beef" },
    fr: { name: "Makloub Mixte", description: "Poulet et viande" },
  },
  "cc-croquette": {
    en: { name: "Croquette", description: "One crispy croquette" },
    fr: { name: "Croquette", description: "Une croquette croustillante" },
  },
  "cc-poulet": {
    en: { name: "Crispy Chicken", description: "Crispy chicken with melted cheese" },
    fr: { name: "Crispy Poulet", description: "Poulet croustillant, fromage fondu" },
  },
  "cc-viande": {
    en: { name: "Crispy Beef", description: "Beef with melted cheese" },
    fr: { name: "Crispy Viande", description: "Viande et fromage fondu" },
  },
  "cc-mixte": {
    en: { name: "Crispy Mixed", description: "Chicken and beef with cheese" },
    fr: { name: "Crispy Mixte", description: "Poulet et viande avec fromage" },
  },
  "cc-crust": {
    en: { name: "Crispy Crust", description: "Our full signature recipe" },
    fr: { name: "Crispy Crust", description: "Notre recette signature complète" },
  },
  "burger-cheese-viande": {
    en: { name: "Beef Cheeseburger", description: "Beef patty and cheddar" },
    fr: { name: "Cheeseburger Viande", description: "Steak haché et cheddar" },
  },
  "burger-cheese-poulet": {
    en: { name: "Chicken Cheeseburger", description: "Chicken and cheddar" },
    fr: { name: "Cheeseburger Poulet", description: "Poulet et cheddar" },
  },
  "burger-classique": {
    en: { name: "Classic Burger", description: "Burger with veggies and sauce" },
    fr: { name: "Burger Classique", description: "Burger aux légumes et sauce" },
  },
  "burger-chicken": {
    en: { name: "Cheese Chicken", description: "Crispy chicken and cheese" },
    fr: { name: "Cheese Chicken", description: "Poulet croustillant et fromage" },
  },
  "burger-double": {
    en: { name: "Double Cheeseburger", description: "Two patties and cheese" },
    fr: { name: "Double Cheeseburger", description: "Deux steaks et fromage" },
  },
  "burger-mixte": {
    en: { name: "Mixed Cheeseburger", description: "Beef and chicken together" },
    fr: { name: "Cheeseburger Mixte", description: "Viande et poulet ensemble" },
  },
  "chawerma-libanaise": {
    en: { name: "Lebanese Shawarma", description: "Pita, chicken and garlic sauce" },
    fr: { name: "Chawarma Libanaise", description: "Pain pita, poulet et sauce à l'ail" },
  },
  "chawerma-extra": {
    en: { name: "Extra Shawarma", description: "Double filling" },
    fr: { name: "Chawarma Extra", description: "Garniture doublée" },
  },
  "poutine-fromage": {
    en: { name: "Cheese Poutine", description: "Fries and melted cheese" },
    fr: { name: "Poutine Fromage", description: "Frites et fromage fondu" },
  },
  "poutine-poulet": {
    en: { name: "Chicken Poutine", description: "Fries, chicken and cheese" },
    fr: { name: "Poutine Poulet", description: "Frites, poulet et fromage" },
  },
  "poutine-viande": {
    en: { name: "Beef Poutine", description: "Fries, beef and cheese" },
    fr: { name: "Poutine Viande", description: "Frites, viande et fromage" },
  },
  "poutine-mixte": {
    en: { name: "Mixed Poutine", description: "Chicken and beef with cheese" },
    fr: { name: "Poutine Mixte", description: "Poulet et viande avec fromage" },
  },
  "poutine-crust": {
    en: { name: "Crust Poutine", description: "The full recipe" },
    fr: { name: "Poutine Crust", description: "La recette complète" },
  },
  "panini-poulet": {
    en: { name: "Chicken Panini", description: "Grilled chicken and cheese" },
    fr: { name: "Panini Poulet", description: "Poulet grillé et fromage" },
  },
  "panini-viande-hachee": {
    en: { name: "Minced Beef Panini", description: "Minced beef and cheese" },
    fr: { name: "Panini Viande Hachée", description: "Viande hachée et fromage" },
  },
  "panini-3fromage": {
    en: { name: "3-Cheese Panini", description: "Melted cheese blend" },
    fr: { name: "Panini 3 Fromages", description: "Mélange de fromages fondus" },
  },
  "panini-thon": {
    en: { name: "Tuna Panini", description: "Tuna and cheese" },
    fr: { name: "Panini Thon", description: "Thon et fromage" },
  },
  "sandwich-special": {
    en: { name: "Special Sandwich", description: "House mix" },
    fr: { name: "Sandwich Spécial", description: "Mélange maison" },
  },
  "sandwich-marine": {
    en: { name: "Marinated Sandwich", description: "Grilled marinated chicken" },
    fr: { name: "Sandwich Mariné", description: "Poulet mariné grillé" },
  },
  "sandwich-royal": {
    en: { name: "Royal Sandwich", description: "Generous filling" },
    fr: { name: "Sandwich Royal", description: "Garniture généreuse" },
  },
  "sandwich-mixte": {
    en: { name: "Mixed Sandwich", description: "Chicken and beef" },
    fr: { name: "Sandwich Mixte", description: "Poulet et viande" },
  },
  "sandwich-kebda": {
    en: { name: "Liver Sandwich", description: "Seasoned liver" },
    fr: { name: "Sandwich Foie", description: "Foie assaisonné" },
  },
  "plat-frite": {
    en: { name: "French Fries", description: "Golden crispy fries" },
    fr: { name: "Frites", description: "Frites dorées et croustillantes" },
  },
  "plat-escalope": {
    en: { name: "Escalope", description: "Escalope with fries and salad" },
    fr: { name: "Escalope", description: "Escalope avec frites et salade" },
  },
  "plat-indien": {
    en: { name: "Indian Plate", description: "Chicken with Indian spices" },
    fr: { name: "Plat Indien", description: "Poulet aux épices indiennes" },
  },
  "plat-chiche": {
    en: { name: "Shish Kebab", description: "Grilled skewers with fries" },
    fr: { name: "Chiche Kebab", description: "Brochettes grillées avec frites" },
  },
  "plat-crispy": {
    en: { name: "Crispy Plate", description: "Crispy chicken with fries" },
    fr: { name: "Plat Crispy", description: "Poulet croustillant avec frites" },
  },
  "plat-viande-hachee": {
    en: { name: "Minced Beef Plate", description: "Grilled minced beef with fries" },
    fr: { name: "Plat Viande Hachée", description: "Viande hachée grillée et frites" },
  },
  "plat-poulet-creme": {
    en: { name: "Creamy Chicken", description: "Chicken breast in cream sauce" },
    fr: { name: "Poulet à la Crème", description: "Blanc de poulet, sauce crème" },
  },
  "plat-mixte-marine": {
    en: { name: "Mixed Marinated Plate", description: "Marinated chicken and beef" },
    fr: { name: "Plat Mixte Mariné", description: "Poulet mariné et viande" },
  },
  "mex-poulet": {
    en: { name: "Mexican Chicken", description: "Chicken, Mexican style" },
    fr: { name: "Mexicain Poulet", description: "Poulet à la mexicaine" },
  },
  "mex-viande": {
    en: { name: "Mexican Beef", description: "Beef, Mexican style" },
    fr: { name: "Mexicain Viande", description: "Viande à la mexicaine" },
  },
  "mex-mixte": {
    en: { name: "Mexican Mixed", description: "Chicken and beef" },
    fr: { name: "Mexicain Mixte", description: "Poulet et viande" },
  },
  "salade-variee": {
    en: { name: "Mixed Salad", description: "Assorted fresh vegetables" },
    fr: { name: "Salade Variée", description: "Légumes frais variés" },
  },
  "salade-tunisienne": {
    en: { name: "Tunisian Salad", description: "The traditional Tunisian recipe" },
    fr: { name: "Salade Tunisienne", description: "La recette tunisienne traditionnelle" },
  },
  "salade-cesar": {
    en: { name: "Caesar Salad", description: "Chicken, lettuce and Caesar dressing" },
    fr: { name: "Salade César", description: "Poulet, laitue et sauce César" },
  },
  "salade-riz": {
    en: { name: "Rice Salad", description: "Rice with vegetables and sauce" },
    fr: { name: "Salade de Riz", description: "Riz aux légumes et sauce" },
  },
  "salade-thon": {
    en: { name: "Tuna Salad", description: "Tuna, vegetables and olives" },
    fr: { name: "Salade Thon", description: "Thon, légumes et olives" },
  },
  "box-1": {
    en: { name: "Box for 1", description: "A full meal for one" },
    fr: { name: "Box 1 personne", description: "Un repas complet pour une personne" },
  },
  "box-2": {
    en: { name: "Box for 2", description: "A full meal for two" },
    fr: { name: "Box 2 personnes", description: "Un repas complet pour deux" },
  },
  "box-3": {
    en: { name: "Box for 3", description: "A full meal for three" },
    fr: { name: "Box 3 personnes", description: "Un repas complet pour trois" },
  },
  "box-4": {
    en: { name: "Box for 4", description: "A full meal for four" },
    fr: { name: "Box 4 personnes", description: "Un repas complet pour quatre" },
  },
  "box-familiale": {
    en: { name: "Family Box", description: "A full meal for the family" },
    fr: { name: "Box Familiale", description: "Un repas complet pour la famille" },
  },
  "pack-crispy": {
    en: {
      name: "Crispy Pack",
      description: "Camembert croquettes + tacos + crispy corn cheese + crispy chicken + fries",
    },
    fr: {
      name: "Pack Crispy",
      description: "Croquettes camembert + tacos + crispy corn cheese + chicken crispy + frites",
    },
  },
};

/** Supplement names per language. */
export const SUPPLEMENT_LABELS: Record<string, { en: string; fr: string }> = {
  غرويار: { en: "Gruyère", fr: "Gruyère" },
  موزاريلا: { en: "Mozzarella", fr: "Mozzarella" },
  كامامبير: { en: "Camembert", fr: "Camembert" },
  "صلصة بيضاء": { en: "White sauce", fr: "Sauce blanche" },
  غودا: { en: "Gouda", fr: "Gouda" },
  "فرماج روج": { en: "Red cheese", fr: "Fromage rouge" },
  شيدر: { en: "Cheddar", fr: "Cheddar" },
  "دجاج مدخن": { en: "Smoked chicken", fr: "Poulet fumé" },
};

export function localizeSupplement(name: string, lang: Lang) {
  if (lang === "ar") return name;
  return SUPPLEMENT_LABELS[name]?.[lang] ?? name;
}

/** Returns the item with name/description/category localized when a translation exists. */
export function localizeItem<T extends MenuItem>(item: T, lang: Lang): T {
  if (lang === "ar") return item;
  const tr = ITEM_LABELS[item.id]?.[lang];
  return {
    ...item,
    name: tr?.name ?? item.name,
    description: tr?.description ?? item.description,
    category: localizeCategory(item.category, lang),
  };
}
