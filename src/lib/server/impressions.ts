type ImpressionLike = {
  id: string;
};

const positiveTerms = [
  "amazing",
  "appreciate",
  "awesome",
  "baik",
  "bagus",
  "bermanfaat",
  "best",
  "clear",
  "communicative",
  "easy",
  "effective",
  "efficient",
  "excellent",
  "friendly",
  "good",
  "great",
  "helpful",
  "impressive",
  "informatif",
  "insightful",
  "jelas",
  "keren",
  "luar biasa",
  "mantap",
  "memuaskan",
  "membantu",
  "menarik",
  "menyenangkan",
  "nice",
  "oke",
  "ok",
  "patient",
  "positive",
  "professional",
  "puas",
  "rapi",
  "recommended",
  "reliable",
  "responsif",
  "sabar",
  "smooth",
  "solutif",
  "supportive",
  "terbantu",
  "terstruktur",
  "useful",
  "valuable",
];

const negativeTerms = [
  "bad",
  "bingung",
  "buruk",
  "confusing",
  "disappointed",
  "jelek",
  "kurang",
  "lama",
  "late",
  "negative",
  "poor",
  "slow",
  "unclear",
  "unhelpful",
];

const themeMatchers = [
  { terms: ["membantu", "terbantu", "helpful", "supportive", "useful", "bermanfaat"], phrase: "helpful" },
  { terms: ["jelas", "clear", "mudah dipahami", "easy to understand"], phrase: "clear to understand" },
  { terms: ["sabar", "patient"], phrase: "patient" },
  { terms: ["rapi", "terstruktur", "structured", "organized"], phrase: "well structured" },
  { terms: ["responsif", "responsive", "cepat", "fast"], phrase: "responsive" },
  { terms: ["professional", "profesional"], phrase: "professional" },
  { terms: ["insight", "insightful", "analytical", "analysis", "analisis"], phrase: "insightful" },
  { terms: ["dashboard", "report", "reporting", "laporan"], phrase: "strong at dashboard and reporting work" },
  { terms: ["kolaborasi", "collaboration", "working", "kerja sama", "enak"], phrase: "easy to collaborate with" },
  { terms: ["mentor", "teaching", "mengajar", "belajar", "learning"], phrase: "effective in teaching and mentoring" },
  { terms: ["keren", "great", "excellent", "amazing", "mantap", "bagus", "baik"], phrase: "impressive" },
];

export function prepareImpressionForStorage(value: string) {
  const summary = summarizeImpression(value);
  const englishSummary = toEnglishImpression(summary || value);
  const cleanedSummary = clampWords(cleanText(englishSummary), 32);

  return cleanedSummary || "The visitor shared an impression about Rexy's work.";
}

export function isPositiveImpression(value: string) {
  const normalized = value.toLowerCase();
  const positiveScore = scoreTerms(normalized, positiveTerms);
  const negativeScore = scoreTerms(normalized, negativeTerms);
  const hasPositiveTone = positiveScore > 0 || /thank|thanks|appreciat|recommend|love|like/.test(normalized);
  const hasStrongNegativeTone = negativeScore >= Math.max(2, positiveScore + 1);

  return hasPositiveTone && !hasStrongNegativeTone;
}

export function pickDailyItems<TItem extends ImpressionLike>(items: TItem[], count: number, date = new Date()) {
  const seed = getJakartaDateKey(date);

  return [...items]
    .map((item) => ({ item, sort: seededHash(`${seed}:${item.id}`) }))
    .sort((left, right) => left.sort - right.sort)
    .slice(0, count)
    .map(({ item }) => item);
}

function summarizeImpression(value: string) {
  const cleaned = cleanText(value);
  const sentences = cleaned
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const candidates = sentences.length ? sentences : [cleaned];
  const best = candidates
    .map((sentence, index) => ({
      sentence,
      index,
      score: scoreTerms(sentence.toLowerCase(), positiveTerms) + scoreTerms(sentence.toLowerCase(), negativeTerms) + Number(index === 0) * 0.25,
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)[0]?.sentence;

  return clampWords(best ?? cleaned, 34);
}

function toEnglishImpression(value: string) {
  if (!looksIndonesian(value)) {
    return value;
  }

  const normalized = value.toLowerCase();
  const themes = themeMatchers
    .filter((theme) => theme.terms.some((term) => normalized.includes(term)))
    .map((theme) => theme.phrase)
    .filter((theme, index, allThemes) => allThemes.indexOf(theme) === index);

  if (themes.length === 0) {
    return "Rexy left a meaningful and memorable impression through the experience shared by the visitor.";
  }

  return `Rexy is ${joinPhrases(themes.slice(0, 4))}.`;
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function clampWords(value: string, maxWords: number) {
  const words = value.split(" ").filter(Boolean);

  if (words.length <= maxWords) {
    return value;
  }

  return `${words.slice(0, maxWords).join(" ").replace(/[,.!?;:]$/, "")}.`;
}

function looksIndonesian(value: string) {
  const normalized = value.toLowerCase();

  return /\b(aku|anda|bagus|baik|banget|bikin|dengan|dan|dia|enak|ini|jelas|karena|kolaborasi|mantap|membantu|mudah|rexy|sangat|saya|terbantu|untuk|yang)\b/.test(normalized);
}

function scoreTerms(value: string, terms: string[]) {
  return terms.reduce((score, term) => score + Number(value.includes(term)), 0);
}

function joinPhrases(phrases: string[]) {
  if (phrases.length === 1) {
    return phrases[0];
  }

  if (phrases.length === 2) {
    return `${phrases[0]} and ${phrases[1]}`;
  }

  return `${phrases.slice(0, -1).join(", ")}, and ${phrases[phrases.length - 1]}`;
}

function getJakartaDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Jakarta",
    year: "numeric",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

function seededHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
