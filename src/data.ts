export type Language = "EN" | "ES";
// Grows as screens get ported.
export type Screen =
  | "sign-in"
  | "users"
  | "dashboard"
  | "classify-setup"
  | "classify-categories"
  | "material"
  | "review";

export type User = { name: string; initials: string };

export const users: User[] = [
  { name: "Sofia Pintos", initials: "SP" },
  { name: "Arllene Ychuste", initials: "AY" },
  { name: "Antonio Rivero", initials: "AR" },
  { name: "Ignacio González", initials: "IG" },
  { name: "Ma.Laura Bergeret", initials: "MB" },
  { name: "Ana Laura Scarenzio", initials: "AS" },
  { name: "José Bozzano", initials: "JB" },
  { name: "Carolina Rogberg", initials: "CR" },
  { name: "Arturo Torres", initials: "AT" },
];

export const copy = {
  EN: {
    signIn: "Sign in",
    back: "Go back",
    select: "Please select your user.",
    tapProfile: "Tap a profile to continue",
    welcome: "Welcome",
    choose: "Choose from the following options",
    options: ["Collect", "Classify", "History", "Evidences"],
    comingSoon: "is coming soon",
  },
  ES: {
    signIn: "Ingresar",
    back: "Volver",
    select: "Selecciona tu usuario.",
    tapProfile: "Toca un perfil para continuar",
    welcome: "Bienvenido",
    choose: "Elige una de las siguientes opciones",
    options: ["Recolectar", "Clasificar", "Historial", "Evidencias"],
    comingSoon: "estará disponible pronto",
  },
};

export type CategoryId = "paper" | "plastic" | "other" | "organic" | "discard";

export const organizations = [
  { id: "nuevo", name: "Client Nuevo" },
  { id: "wtc", name: "WTC" },
  { id: "clave", name: "Empresa Clave" },
  { id: "colegio", name: "Colegio San Ignacio" },
  { id: "itau", name: "Banco Itau" },
];

// Pickup places per client (shared later by the Collect and Evidences flows).
export const clientPlaces: Record<string, string[]> = {
  nuevo: ["Edificio Central"],
  wtc: ["Torres 1 2 3", "Torres 4"],
  clave: ["Oficina A", "Oficina B", "Oficina C"],
  colegio: ["Colegio"],
  itau: ["Planta Casavalle", "WTC 4"],
};

export const categories: { id: CategoryId; en: string; es: string; color: string }[] = [
  { id: "paper", en: "Paper & Cardboard", es: "Papel y cartón", color: "#5469ef" },
  { id: "plastic", en: "Plastics", es: "Plásticos", color: "#e2cb19" },
  { id: "other", en: "Other", es: "Otros", color: "#f5a623" },
  { id: "organic", en: "Organic", es: "Orgánico", color: "#8b4d19" },
  { id: "discard", en: "Discard", es: "Descarte", color: "#682079" },
];

export const materialOptions: Record<CategoryId, string[]> = {
  paper: [
    "White paper",
    "Colored paper",
    "Magazine",
    "Newspaper",
    "Corrugated cardboard",
    "Colored cardboard",
  ],
  plastic: [
    "Clear PET (1)",
    "Green PET (1)",
    "White PET (1)",
    "Bottle – HDPE (2)",
    "Clear film – LDPE (4)",
    "Colored film – LDPE (4)",
    "Foam – PS (6)",
    "Polypropylene – PP (5)",
    "Other plastic (7)",
  ],
  other: ["Aluminum cans", "Scrap metal cans", "Electronics", "Glass", "Tetra Pak"],
  organic: ["Fruit & vegetables", "Coffee & tea", "Garden waste", "Food scraps"],
  discard: ["Dirty packaging", "Ceramics", "Sanitary waste", "Mixed waste"],
};

export const categoryDescriptions: Record<CategoryId, string> = {
  paper:
    "Paper is thin and flexible. Cardboard is thicker, firmer paper that keeps its shape, such as a shipping box.",
  plastic:
    "Plastic is usually light, waterproof and marked with a recycling triangle containing a number from 1 to 7.",
  other: "Metal, glass, electronics and drink cartons belong here.",
  organic:
    "Food and garden materials that naturally break down, such as fruit peels, coffee grounds and leaves.",
  discard:
    "Items that cannot be recovered because they are dirty, mixed, sanitary, ceramic or otherwise unsuitable.",
};

export const materialDescriptions: Record<string, string> = {
  "White paper": "Clean white office or printer sheets without colored coating.",
  "Colored paper": "Paper sheets dyed or printed with a strong color.",
  Magazine: "Glossy, flexible pages joined with staples or glue.",
  Newspaper: "Thin, soft gray paper commonly used for daily news.",
  "Corrugated cardboard": "Firm brown board with a wavy layer visible between two flat sheets.",
  "Colored cardboard": "Firm paperboard with colored printing or dye on its surface.",
  "Clear PET (1)": "Transparent drink bottles marked with recycling code 1.",
  "Green PET (1)": "Green transparent beverage bottles marked with code 1.",
  "White PET (1)": "Opaque or white PET containers marked with code 1.",
  "Bottle – HDPE (2)": "Sturdy milk, detergent or cleaning-product bottles marked with code 2.",
  "Clear film – LDPE (4)": "Clear, stretchable bags or wrapping film marked with code 4.",
  "Colored film – LDPE (4)": "Colored plastic bags or flexible film marked with code 4.",
  "Foam – PS (6)": "Very light foam packaging or trays, often white, marked with code 6.",
  "Polypropylene – PP (5)": "Food tubs, caps and firm containers marked with code 5.",
  "Other plastic (7)": "Mixed or specialty plastic marked with recycling code 7.",
  "Aluminum cans": "Lightweight drink cans that do not attract a magnet.",
  "Scrap metal cans": "Steel food or product cans that are heavier and may attract a magnet.",
  Electronics: "Small devices, cables or components that contain circuits or batteries.",
  Glass: "Rigid, breakable bottles and jars. Green glass is commonly marked 71.",
  "Tetra Pak": "Layered drink or food cartons with folded seams and a waxy surface.",
  "Fruit & vegetables": "Peels, cores and uncooked fruit or vegetable leftovers.",
  "Coffee & tea": "Coffee grounds, paper filters and tea leaves without plastic packaging.",
  "Garden waste": "Small leaves, grass and plant cuttings.",
  "Food scraps": "Recoverable meal leftovers without plastic, glass or metal.",
  "Dirty packaging": "Packaging that cannot be emptied or cleaned enough for recycling.",
  Ceramics: "Broken cups, plates or pottery; these are not glass.",
  "Sanitary waste": "Used tissues, diapers and other hygiene materials.",
  "Mixed waste": "Objects made from bonded materials that cannot be separated.",
};

export function categoryOf(material: string): CategoryId {
  return categories.find((c) => materialOptions[c.id].includes(material))?.id ?? "discard";
}

/** One classification in progress. Selected materials = keys of `weights` (insertion order). */
export type Classification = {
  organization: string;
  location: string;
  date: string;
  weights: Record<string, number>;
};
