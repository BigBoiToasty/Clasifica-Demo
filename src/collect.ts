import { categories, type CategoryId, type Language } from "./data";

/** One bag of collected material. Collect only records the broad category, not the specific material. */
export type CollectedBag = {
  id: string;
  category: CategoryId;
  weightKg: number;
};

/** A collection in progress (same organization, location, and date fields as a Classification). */
export type Collection = {
  organization: string;
  location: string;
  date: string;
  bags: CollectedBag[];
};

export function totalWeight(bags: CollectedBag[]): number {
  return bags.reduce((sum, bag) => sum + bag.weightKg, 0);
}

export function categoryLabel(id: CategoryId, language: Language): string {
  const category = categories.find((c) => c.id === id);
  if (!category) return id;
  return language === "EN" ? category.en : category.es;
}

/** 4 -> "4", 4.5 -> "4.5", 4.123 -> "4.12" (so the voice never reads long decimals). */
const kg = (n: number) => String(Number(n.toFixed(2)));

/**
 * The sentence the "Hear summary" button reads aloud: how many bags, the total weight,
 * then every bag with its category and weight. Pass the result to your speak function.
 */
export function collectionSummaryText(collection: Collection, language: Language): string {
  const en = language === "EN";
  const { bags } = collection;

  if (bags.length === 0) {
    return en ? "No bags have been added yet." : "Aún no se han agregado bolsas.";
  }

  const total = totalWeight(bags);
  const intro = en
    ? `You have ${bags.length} ${bags.length === 1 ? "bag" : "bags"}, totaling ${kg(total)} kilograms.`
    : `Tienes ${bags.length} ${bags.length === 1 ? "bolsa" : "bolsas"}, con ${kg(total)} kilos en total.`;

  const details = bags
    .map((bag, i) =>
      en
        ? `Bag ${i + 1}: ${categoryLabel(bag.category, language)}, ${kg(bag.weightKg)} kilograms.`
        : `Bolsa ${i + 1}: ${categoryLabel(bag.category, language)}, ${kg(bag.weightKg)} kilos.`,
    )
    .join(" ");

  return `${intro} ${details}`;
}
