import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en" | "fr";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

type Dict = Record<string, string>;

const ar: Dict = {
  home: "الرئيسية",
  menu: "المنيو",
  myOrder: "طلبي",
  signIn: "تسجيل الدخول",
  signOut: "تسجيل الخروج",
  account: "حسابي",
  dashboard: "لوحة المطعم",
  courierArea: "منطقة الموصل",
  language: "اللغة",
  // auth
  authTitle: "تسجيل الدخول / إنشاء حساب",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  fullName: "الاسم الكامل",
  phone: "رقم الهاتف",
  login: "دخول",
  signup: "إنشاء حساب",
  becomeCourier: "التسجيل كموصل طلبات",
  courierPending: "طلبك كموصل قيد المراجعة من صاحب المطعم.",
  courierApproved: "تمت الموافقة عليك كموصل طلبات ✅",
  courierRejected: "تم رفض طلبك كموصل.",
  vehicle: "وسيلة التوصيل (دراجة، سيارة...)",
  send: "إرسال",
  loading: "جارٍ التحميل...",
  // orders
  orders: "الطلبات",
  noOrders: "لا توجد طلبات حالياً",
  status: "الحالة",
  accept: "قبول الطلب",
  accepted: "مقبول",
  new: "جديد",
  delivering: "قيد التوصيل",
  delivered: "تم التوصيل",
  cancelled: "ملغى",
  markDelivered: "تم التوصيل",
  total: "المجموع",
  customer: "الزبون",
  address: "العنوان",
  notes: "ملاحظات",
  // menu admin
  manageMenu: "إدارة المنيو",
  addItem: "إضافة طبق",
  name: "الاسم",
  description: "الوصف",
  price: "السعر",
  category: "الفئة",
  image: "الصورة",
  save: "حفظ",
  delete: "حذف",
  edit: "تعديل",
  cancel: "إلغاء",
  available: "متوفر",
  popular: "مميز",
  couriers: "الموصلون",
  approve: "موافقة",
  reject: "رفض",
  owners: "الملاك",
  addOwner: "إضافة مالك (بالبريد الإلكتروني)",
  add: "إضافة",
  saved: "تم الحفظ",
  addToCart: "أضف للسلة",
};

const en: Dict = {
  home: "Home",
  menu: "Menu",
  myOrder: "My order",
  signIn: "Sign in",
  signOut: "Sign out",
  account: "Account",
  dashboard: "Restaurant dashboard",
  courierArea: "Courier area",
  language: "Language",
  authTitle: "Sign in / Create account",
  email: "Email",
  password: "Password",
  fullName: "Full name",
  phone: "Phone number",
  login: "Log in",
  signup: "Sign up",
  becomeCourier: "Register as a delivery courier",
  courierPending: "Your courier request is pending owner approval.",
  courierApproved: "You are approved as a courier ✅",
  courierRejected: "Your courier request was rejected.",
  vehicle: "Vehicle (bike, car...)",
  send: "Send",
  loading: "Loading...",
  orders: "Orders",
  noOrders: "No orders yet",
  status: "Status",
  accept: "Accept order",
  accepted: "Accepted",
  new: "New",
  delivering: "Delivering",
  delivered: "Delivered",
  cancelled: "Cancelled",
  markDelivered: "Mark delivered",
  total: "Total",
  customer: "Customer",
  address: "Address",
  notes: "Notes",
  manageMenu: "Manage menu",
  addItem: "Add item",
  name: "Name",
  description: "Description",
  price: "Price",
  category: "Category",
  image: "Image",
  save: "Save",
  delete: "Delete",
  edit: "Edit",
  cancel: "Cancel",
  available: "Available",
  popular: "Featured",
  couriers: "Couriers",
  approve: "Approve",
  reject: "Reject",
  owners: "Owners",
  addOwner: "Add owner (by email)",
  add: "Add",
  saved: "Saved",
  addToCart: "Add to cart",
};

const fr: Dict = {
  home: "Accueil",
  menu: "Menu",
  myOrder: "Ma commande",
  signIn: "Connexion",
  signOut: "Déconnexion",
  account: "Compte",
  dashboard: "Tableau de bord",
  courierArea: "Espace livreur",
  language: "Langue",
  authTitle: "Connexion / Créer un compte",
  email: "E-mail",
  password: "Mot de passe",
  fullName: "Nom complet",
  phone: "Téléphone",
  login: "Se connecter",
  signup: "S'inscrire",
  becomeCourier: "S'inscrire comme livreur",
  courierPending: "Votre demande de livreur est en attente de validation.",
  courierApproved: "Vous êtes approuvé comme livreur ✅",
  courierRejected: "Votre demande de livreur a été refusée.",
  vehicle: "Véhicule (moto, voiture...)",
  send: "Envoyer",
  loading: "Chargement...",
  orders: "Commandes",
  noOrders: "Aucune commande",
  status: "Statut",
  accept: "Accepter",
  accepted: "Acceptée",
  new: "Nouvelle",
  delivering: "En livraison",
  delivered: "Livrée",
  cancelled: "Annulée",
  markDelivered: "Marquer livrée",
  total: "Total",
  customer: "Client",
  address: "Adresse",
  notes: "Notes",
  manageMenu: "Gérer le menu",
  addItem: "Ajouter un plat",
  name: "Nom",
  description: "Description",
  price: "Prix",
  category: "Catégorie",
  image: "Image",
  save: "Enregistrer",
  delete: "Supprimer",
  edit: "Modifier",
  cancel: "Annuler",
  available: "Disponible",
  popular: "En vedette",
  couriers: "Livreurs",
  approve: "Approuver",
  reject: "Refuser",
  owners: "Propriétaires",
  addOwner: "Ajouter un propriétaire (e-mail)",
  add: "Ajouter",
  saved: "Enregistré",
  addToCart: "Ajouter",
};

const DICTS: Record<Lang, Dict> = { ar, en, fr };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof ar | string) => string;
  dir: "rtl" | "ltr";
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const stored = localStorage.getItem("crust-lang") as Lang | null;
    if (stored && stored in DICTS) setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("crust-lang", l);
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      dir,
      t: (key: string) => DICTS[lang][key] ?? ar[key] ?? key,
    }),
    [lang, setLang, dir]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
