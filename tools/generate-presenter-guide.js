#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
global.window = global;
require(path.join(repoRoot, "assets", "js", "training-data.js"));

const DATA = global.CX_DATA;
const languages = DATA.languages.map((item) => item.id);
const outputPath = path.join(repoRoot, "assets", "content", "presenter-guide.json");

const greetings = {
  pl: "Dzień dobry. Nazywam się Aleksandr i jestem Twoim cyfrowym przewodnikiem po przygotowaniu do pracy w Citronex Siechnice.",
  en: "Hello. My name is Aleksandr, and I am your digital guide for preparing to work at Citronex Siechnice.",
  ua: "Добрий день. Мене звати Олександр, і я ваш цифровий помічник з підготовки до роботи в Citronex Siechnice.",
  ru: "Здравствуйте. Меня зовут Александр. Я ваш цифровой помощник по подготовке к работе в Citronex Siechnice.",
  az: "Salam. Mənim adım Aleksandrdır. Mən Citronex Siechnice-də işə hazırlıq üzrə rəqəmsal bələdçinizəm.",
  es: "Hola. Me llamo Aleksandr y soy tu guía digital para prepararte para el trabajo en Citronex Siechnice.",
  fil: "Magandang araw. Ako si Aleksandr, ang digital mong gabay sa paghahanda para sa trabaho sa Citronex Siechnice.",
  id: "Halo. Nama saya Aleksandr. Saya adalah pemandu digital Anda untuk persiapan kerja di Citronex Siechnice.",
  ne: "नमस्कार। मेरो नाम अलेक्जेन्डर हो। म Citronex Siechnice मा कामको तयारीका लागि तपाईंको डिजिटल मार्गदर्शक हुँ।"
};

const introTitles = {
  pl: "Najważniejsze informacje przed rozpoczęciem", en: "Important information before you start",
  ua: "Важлива інформація перед початком", ru: "Главное перед началом",
  az: "Başlamazdan əvvəl əsas məlumat", es: "Información importante antes de empezar",
  fil: "Mahahalagang impormasyon bago magsimula", id: "Informasi penting sebelum mulai",
  ne: "सुरु गर्नुअघि महत्त्वपूर्ण जानकारी"
};

const endings = {
  pl: "Obejrzyj wszystkie potrzebne moduły i wykonaj test. To przygotowanie nie zastępuje instruktażu stanowiskowego. Po przyjeździe słuchaj kierownika, brygadzisty i zasad BHP. Jeśli czegoś nie rozumiesz, zatrzymaj pracę i zapytaj. Życzę Ci spokojnej i bezpiecznej pracy.",
  en: "Review every module you need and complete the test. This preparation does not replace workplace instruction. After arrival, follow the supervisor, team leader and safety rules. If you do not understand something, stop and ask. I wish you calm and safe work.",
  ua: "Перегляньте всі потрібні розділи та пройдіть тест. Ця підготовка не замінює інструктажу на робочому місці. Після прибуття виконуйте вказівки керівника, бригадира та правила безпеки. Якщо щось незрозуміло, зупиніться і запитайте. Бажаю вам спокійної та безпечної роботи.",
  ru: "Просмотрите все необходимые разделы и пройдите тест. Эта подготовка не заменяет инструктаж на рабочем месте. После приезда выполняйте указания руководителя, бригадира и правила безопасности. Если что-то непонятно, остановитесь и спросите. Желаю вам спокойной и безопасной работы.",
  az: "Lazım olan bütün bölmələrə baxın və testi tamamlayın. Bu hazırlıq iş yerindəki təlimatı əvəz etmir. Gəldikdən sonra rəhbərin, briqadirin və təhlükəsizlik qaydalarının göstərişlərinə əməl edin. Nəyisə başa düşmürsünüzsə, işi dayandırın və soruşun. Sizə sakit və təhlükəsiz iş arzulayıram.",
  es: "Revisa todos los módulos necesarios y completa el test. Esta preparación no sustituye la instrucción en el puesto. Al llegar, sigue al supervisor, al encargado y las normas de seguridad. Si no entiendes algo, detente y pregunta. Te deseo un trabajo tranquilo y seguro.",
  fil: "Tingnan ang lahat ng kailangang module at sagutan ang test. Hindi nito pinapalitan ang aktuwal na orientation sa trabaho. Pagdating, sundin ang supervisor, brigadier at mga tuntunin sa kaligtasan. Kapag may hindi malinaw, huminto at magtanong. Nais ko sa iyo ang maayos at ligtas na trabaho.",
  id: "Pelajari semua modul yang diperlukan dan selesaikan tes. Persiapan ini tidak menggantikan pengarahan di tempat kerja. Setelah tiba, ikuti supervisor, mandor, dan aturan keselamatan. Jika ada yang tidak dimengerti, berhenti dan bertanya. Semoga Anda bekerja dengan tenang dan aman.",
  ne: "आवश्यक सबै मोड्युल हेर्नुहोस् र परीक्षा पूरा गर्नुहोस्। यो तयारीले कार्यस्थलको प्रत्यक्ष निर्देशनलाई प्रतिस्थापन गर्दैन। पुगेपछि सुपरभाइजर, टोली प्रमुख र सुरक्षा नियम पालना गर्नुहोस्। केही नबुझे काम रोक्नुहोस् र सोध्नुहोस्। तपाईंको काम शान्त र सुरक्षित होस्।"
};

const completionTitles = {
  pl: "Sprawdzenie wiedzy i instruktaż na miejscu", en: "Knowledge check and on-site briefing",
  ua: "Перевірка знань та інструктаж на місці", ru: "Проверка знаний и инструктаж на месте",
  az: "Bilik yoxlaması və yerində təlimat", es: "Comprobación y formación en el lugar",
  fil: "Pagsusuri at orientation sa lugar", id: "Pemeriksaan dan pengarahan di lokasi",
  ne: "ज्ञान जाँच र कार्यस्थल निर्देशन"
};

function valueFor(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value[lang] || value.pl || value.en || "";
  return String(value);
}

function sentence(value, lang) {
  const text = valueFor(value, lang).replace(/\s+/g, " ").trim();
  if (!text) return "";
  return /[.!?…。！？]$/.test(text) ? text : `${text}.`;
}

function join(parts, lang) {
  return parts.flat(Infinity).map((part) => sentence(part, lang)).filter(Boolean).join(" ");
}

function titleOf(value, lang) {
  return valueFor(value, lang).trim();
}

function buildGuide(lang) {
  const firstDay = DATA.firstDay;
  const warehouse = DATA.warehouseRules;
  const tablet = DATA.tabletGuide;
  const startReader = DATA.readerTabs.find((item) => item.id === "start");
  const rowsReader = DATA.readerTabs.find((item) => item.id === "rows");
  const cartsReader = DATA.readerTabs.find((item) => item.id === "carts");
  const restartReader = DATA.readerTabs.find((item) => item.id === "restart");
  const emergency = DATA.medical.find((item) => item.tone === "red");

  const rowExit = rowsReader.sections.find((item) => titleOf(item.title, "pl") === "Wyjście z rzędu");
  const rowBreak = rowsReader.sections.find((item) => titleOf(item.title, "pl") === "Przerwa zwykła");
  const rowEnd = rowsReader.sections.find((item) => titleOf(item.title, "pl") === "Zmiana czynności i koniec pracy");

  const sections = [
    {
      id: "welcome",
      title: introTitles[lang],
      text: join([greetings[lang], DATA.pages.home.lead, firstDay.lead], lang)
    },
    {
      id: "arrival",
      title: titleOf(firstDay.title, lang),
      text: join([DATA.pages.mapa.lead, firstDay.steps.map((item) => [item.title, item.note])], lang)
    },
    {
      id: "warehouse",
      title: titleOf(DATA.pages.magazyn.title, lang),
      text: join([DATA.pages.magazyn.lead, warehouse, DATA.pages.tablet.lead], lang)
    },
    {
      id: "greenhouse",
      title: titleOf(DATA.pages.szklarnia.title, lang),
      text: join([DATA.pages.szklarnia.lead, DATA.pages.reader.lead, startReader.steps.slice(0, 5), startReader.tips], lang)
    },
    {
      id: "reader",
      title: titleOf(rowsReader.title, lang),
      text: join([rowsReader.lead, rowExit.steps, rowBreak.steps, rowEnd.steps, cartsReader.lead, cartsReader.steps, restartReader.lead], lang)
    },
    {
      id: "tablet",
      title: titleOf(tablet.title, lang),
      text: join([tablet.lead, tablet.important, tablet.steps.map((item) => [item.title, item.note]), tablet.tips], lang)
    },
    {
      id: "safety",
      title: titleOf(DATA.pages.zakazy.title, lang),
      text: join([DATA.pages.zakazy.lead, DATA.banQuickRules.map((item) => [item.title, item.text]), DATA.bans.map((item) => item.detail)], lang)
    },
    {
      id: "documents",
      title: titleOf(DATA.pages.miasto.title, lang),
      text: join([DATA.pages.miasto.lead, DATA.cityRules.map((item) => [item.title, item.note, item.list || []])], lang)
    },
    {
      id: "help",
      title: `${titleOf(DATA.pages.kontakty.title, lang)} / ${titleOf(DATA.pages.lekarz.title, lang)}`,
      text: join([DATA.pages.kontakty.lead, DATA.pages.lekarz.lead, emergency.body], lang)
    },
    {
      id: "finish",
      title: completionTitles[lang],
      text: join([DATA.pages.test.lead, endings[lang]], lang)
    }
  ];

  const totalCharacters = sections.reduce((sum, item) => sum + item.text.length, 0);
  if (totalCharacters >= 10000) {
    throw new Error(`${lang}: presenter guide exceeds 10,000 characters (${totalCharacters})`);
  }
  sections.forEach((item) => {
    if (!item.title || !item.text) throw new Error(`${lang}: incomplete section ${item.id}`);
    if (item.text.length >= 3000) throw new Error(`${lang}: section ${item.id} is too long (${item.text.length})`);
  });

  return { totalCharacters, sections };
}

const output = {
  version: "20260718-siechnice-guide1",
  chapterCount: 10,
  languages: Object.fromEntries(languages.map((lang) => [lang, buildGuide(lang)]))
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

for (const lang of languages) {
  const guide = output.languages[lang];
  console.log(`${lang}: ${guide.sections.length} chapters, ${guide.totalCharacters} characters`);
}
console.log(`wrote ${outputPath}`);
