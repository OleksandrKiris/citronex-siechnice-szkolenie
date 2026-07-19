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

const introductions = {
  pl: "Dzień dobry. Nazywam się Aleksandr i pomogę Ci spokojnie przygotować się do pracy w Citronex Siechnice. Obejrzyj ten instruktaż przed przyjazdem albo włącz go podczas oczekiwania na dokumenty. Przejdziemy po kolei przez dojazd, różnice między magazynem i szklarnią, reader, tablet, zasady bezpieczeństwa oraz miejsca, w których możesz uzyskać pomoc. Nie spiesz się. W każdej chwili możesz zatrzymać nagranie, powtórzyć rozdział lub otworzyć pełny tekst.",
  en: "Hello. My name is Aleksandr, and I will help you prepare calmly for work at Citronex Siechnice. Watch this briefing before you arrive, or play it while you wait for your documents. We will go step by step through arrival, the differences between the warehouse and greenhouse, the reader, the tablet, safety rules, and where to ask for help. There is no need to rush. You can pause the recording, repeat a chapter, or open the full text at any time.",
  ua: "Добрий день. Мене звати Олександр, і я допоможу вам спокійно підготуватися до роботи в Citronex Siechnice. Перегляньте цей інструктаж до приїзду або увімкніть його, поки очікуєте на документи. Ми послідовно розберемо приїзд, різницю між складом і теплицею, рідер, планшет, правила безпеки та до кого звертатися по допомогу. Не поспішайте. Ви можете будь-коли зупинити запис, повторити розділ або відкрити повний текст.",
  ru: "Здравствуйте. Меня зовут Александр, и я помогу вам спокойно подготовиться к работе в Citronex Siechnice. Посмотрите этот инструктаж до приезда или включите его, пока ожидаете документы. Мы пройдём всё по порядку: куда приехать, чем отличаются склад и теплица, как пользоваться ридером и планшетом, какие правила безопасности обязательны и к кому обращаться за помощью. Не спешите. Вы можете в любой момент поставить запись на паузу, повторить главу или открыть полный текст.",
  az: "Salam. Mənim adım Aleksandrdır və Citronex Siechnice-də işə sakit şəkildə hazırlaşmağınıza kömək edəcəyəm. Bu təlimata gəlməzdən əvvəl baxın və ya sənədləri gözləyərkən qoşun. Biz gəlişi, anbarla istixananın fərqini, readeri, planşeti, təhlükəsizlik qaydalarını və kömək üçün kimə müraciət etməyi addım-addım izah edəcəyik. Tələsməyin. Yazını istənilən vaxt dayandıra, bölməni təkrar edə və ya tam mətni aça bilərsiniz.",
  es: "Hola. Me llamo Aleksandr y te ayudaré a prepararte con calma para trabajar en Citronex Siechnice. Mira esta formación antes de llegar o reprodúcela mientras esperas tus documentos. Explicaremos paso a paso la llegada, la diferencia entre el almacén y el invernadero, el lector, la tableta, las normas de seguridad y a quién pedir ayuda. No tengas prisa. Puedes pausar la grabación, repetir un capítulo o abrir el texto completo en cualquier momento.",
  fil: "Magandang araw. Ako si Aleksandr at tutulungan kitang maghanda nang maayos para sa trabaho sa Citronex Siechnice. Panoorin ang pagsasanay na ito bago dumating, o i-play ito habang naghihintay ng mga dokumento. Tatalakayin natin nang sunod-sunod ang pagdating, ang pagkakaiba ng bodega at bahay-taniman, ang reader, tablet, mga tuntunin sa kaligtasan, at kung kanino hihingi ng tulong. Huwag magmadali. Maaari mong i-pause ang rekording, ulitin ang kabanata, o buksan ang buong teksto anumang oras.",
  id: "Halo. Nama saya Aleksandr, dan saya akan membantu Anda mempersiapkan diri dengan tenang untuk bekerja di Citronex Siechnice. Tonton pengarahan ini sebelum tiba, atau putar sambil menunggu dokumen. Kita akan membahas secara berurutan tentang kedatangan, perbedaan gudang dan rumah kaca, reader, tablet, aturan keselamatan, serta siapa yang harus dihubungi untuk meminta bantuan. Tidak perlu terburu-buru. Anda dapat menjeda rekaman, mengulang bab, atau membuka teks lengkap kapan saja.",
  ne: "नमस्कार। मेरो नाम अलेक्जेन्डर हो, र म तपाईंलाई Citronex Siechnice मा कामका लागि शान्त रूपमा तयार हुन मद्दत गर्नेछु। यो निर्देशन आइपुग्नुअघि हेर्नुहोस्, वा कागजात पर्खँदा चलाउनुहोस्। हामी आगमन, गोदाम र हरितगृहबीचको फरक, रिडर, ट्याब्लेट, सुरक्षा नियम र मद्दतका लागि कसलाई सम्पर्क गर्ने भन्ने कुरा क्रमसँग बुझ्नेछौँ। हतार नगर्नुहोस्। तपाईंले कुनै पनि बेला रेकर्डिङ रोक्न, अध्याय दोहोर्‍याउन वा पूरा पाठ खोल्न सक्नुहुन्छ।"
};

const topicLeadTemplates = {
  pl: (title) => `Teraz przejdziemy do tematu: ${title}.`,
  en: (title) => `Now let us go through: ${title}.`,
  ua: (title) => `Тепер розберімо тему: ${title}.`,
  ru: (title) => `Теперь разберём тему: ${title}.`,
  az: (title) => `İndi bu mövzuya keçək: ${title}.`,
  es: (title) => `Ahora veremos el tema: ${title}.`,
  fil: (title) => `Ngayon, talakayin natin ang ${title}.`,
  id: (title) => `Sekarang kita bahas: ${title}.`,
  ne: (title) => `अब यो विषय बुझौँ: ${title}।`
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
  fil: "Panoorin ang lahat ng kinakailangang modyul at sagutan ang pagsusulit. Hindi nito pinapalitan ang aktuwal na pagsasanay sa lugar ng trabaho. Pagdating, sundin ang superbisor, pinuno ng pangkat, at mga tuntunin sa kaligtasan. Kapag may hindi malinaw, huminto at magtanong. Nawa'y maging maayos at ligtas ang iyong trabaho.",
  id: "Pelajari semua modul yang diperlukan dan selesaikan tes. Persiapan ini tidak menggantikan pengarahan di tempat kerja. Setelah tiba, ikuti supervisor, mandor, dan aturan keselamatan. Jika ada yang tidak dimengerti, berhenti dan bertanya. Semoga Anda bekerja dengan tenang dan aman.",
  ne: "आवश्यक सबै मोड्युल हेर्नुहोस् र परीक्षा पूरा गर्नुहोस्। यो तयारीले कार्यस्थलको प्रत्यक्ष निर्देशनलाई प्रतिस्थापन गर्दैन। पुगेपछि सुपरभाइजर, टोली प्रमुख र सुरक्षा नियम पालना गर्नुहोस्। केही नबुझे काम रोक्नुहोस् र सोध्नुहोस्। तपाईंको काम शान्त र सुरक्षित होस्।"
};

const completionTitles = {
  pl: "Sprawdzenie wiedzy i instruktaż na miejscu", en: "Knowledge check and on-site briefing",
  ua: "Перевірка знань та інструктаж на місці", ru: "Проверка знаний и инструктаж на месте",
  az: "Bilik yoxlaması və yerində təlimat", es: "Comprobación y formación en el lugar",
  fil: "Pagsusuri ng kaalaman at pagsasanay sa lugar", id: "Pemeriksaan dan pengarahan di lokasi",
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
  return /[.!?…。！？।]$/.test(text) ? text : `${text}.`;
}

function join(parts, lang) {
  return parts.flat(Infinity).map((part) => sentence(part, lang)).filter(Boolean).join("\n\n");
}

function titleOf(value, lang) {
  return valueFor(value, lang).trim();
}

function topicLead(value, lang) {
  return topicLeadTemplates[lang](titleOf(value, lang));
}

function buildGuide(lang) {
  const firstDay = DATA.firstDay;
  const warehouse = DATA.warehouseRules;
  const tablet = DATA.tabletGuide;
  const startReader = DATA.readerTabs.find((item) => item.id === "start");
  const rowsReader = DATA.readerTabs.find((item) => item.id === "rows");
  const cartsReader = DATA.readerTabs.find((item) => item.id === "carts");
  const restartReader = DATA.readerTabs.find((item) => item.id === "restart");
  const rowStart = rowsReader.sections[0];
  const rowExit = rowsReader.sections.find((item) => titleOf(item.title, "pl") === "Wyjście z rzędu");
  const rowBreak = rowsReader.sections.find((item) => titleOf(item.title, "pl") === "Przerwa zwykła");
  const rowEnd = rowsReader.sections.find((item) => titleOf(item.title, "pl") === "Zmiana czynności i koniec pracy");
  const clinic = DATA.medical.find((item) => item.tone === "blue");
  const emergency = DATA.medical.find((item) => item.tone === "red");
  const dental = DATA.medical.find((item) => item.tone === "yellow");

  const groupTitles = {
    start: introTitles[lang],
    arrival: titleOf(firstDay.title, lang),
    warehouse: titleOf(DATA.pages.magazyn.title, lang),
    greenhouse: titleOf(DATA.pages.szklarnia.title, lang),
    reader: titleOf(DATA.pages.reader.title, lang),
    tablet: titleOf(tablet.title, lang),
    safety: titleOf(DATA.pages.zakazy.title, lang),
    documents: titleOf(DATA.pages.miasto.title, lang),
    help: `${titleOf(DATA.pages.kontakty.title, lang)} / ${titleOf(DATA.pages.lekarz.title, lang)}`,
    finish: completionTitles[lang]
  };
  const tracksByGroup = {
    start: ["warehouse", "greenhouse", "before", "waiting", "all"],
    arrival: ["warehouse", "greenhouse", "before", "all"],
    warehouse: ["warehouse", "all"],
    greenhouse: ["greenhouse", "all"],
    reader: ["greenhouse", "all"],
    tablet: ["warehouse", "greenhouse", "all"],
    safety: ["warehouse", "greenhouse", "all"],
    documents: ["before", "waiting", "all"],
    help: ["warehouse", "greenhouse", "before", "waiting", "all"],
    finish: ["warehouse", "greenhouse", "before", "waiting", "all"]
  };
  const sections = [];
  const shortTitle = (value) => {
    const clean = valueFor(value, lang).replace(/\s+/g, " ").trim().replace(/[.!?…。！？।]+$/, "");
    const first = clean.split(/[.!?…。！？।]/)[0].trim();
    return first.length > 76 ? `${first.slice(0, 73).trim()}…` : first;
  };
  const add = ({ id, group, title, parts, image = "", icon = "", pose = "right", tone = "neutral", focus = null, quizIndex = null, sourceLabel = "", sourceUrl = "" }) => {
    const resolvedTitle = typeof title === "string" ? title : titleOf(title, lang);
    const text = join(parts, lang);
    sections.push({
      id,
      group,
      groupTitle: groupTitles[group],
      tracks: tracksByGroup[group],
      title: resolvedTitle || shortTitle(parts.flat(Infinity).find(Boolean)),
      text,
      image: valueFor(image, lang),
      icon,
      pose,
      tone,
      ...(focus ? { focus } : {}),
      ...(Number.isInteger(quizIndex) ? { quizIndex } : {}),
      ...(sourceLabel && sourceUrl ? { sourceLabel, sourceUrl } : {})
    });
  };

  add({ id: "welcome", group: "start", title: introTitles[lang], parts: [introductions[lang]], image: "assets/inline/stage34_1.jpg", icon: "👋", pose: "neutral", tone: "neutral", quizIndex: 1 });

  firstDay.steps.forEach((step, index) => add({
    id: ["arrival-place", "arrival-map", "arrival-walk", "arrival-wait"][index],
    group: "arrival",
    title: step.title,
    parts: [step.title, step.note],
    image: index < 2 ? "assets/guide/arrival-route-v1.svg" : `assets/inline/stage12_${index - 1}.jpg`,
    icon: ["📍", "🗺️", "🚶", "⏳"][index],
    pose: index === 3 ? "neutral" : "right",
    tone: index === 3 ? "caution" : "required",
    quizIndex: index === 3 ? 2 : null
  }));

  warehouse.forEach((rule, index) => add({
    id: ["warehouse-no-reader", "warehouse-entrance", "warehouse-contact"][index],
    group: "warehouse",
    title: shortTitle(rule),
    parts: [rule, index === 0 ? startReader.tips[1] : []],
    image: `assets/warehouse/magazyn-wejscie-${index === 2 ? 2 : 1}.jpg`,
    icon: index === 0 ? "🚫📟" : index === 1 ? "🚪" : "☎️",
    pose: index === 0 ? "warning" : "right",
    tone: index === 0 ? "danger" : "required",
    quizIndex: index === 0 ? 0 : null
  }));

  add({ id: "greenhouse-overview", group: "greenhouse", title: DATA.pages.szklarnia.title, parts: [DATA.pages.szklarnia.lead], image: "assets/greenhouse-orientation/orientacja-ogolna.svg", icon: "🌿", pose: "right", tone: "required" });
  add({ id: "greenhouse-sides", group: "greenhouse", title: shortTitle(DATA.test[19].text), parts: [DATA.test[19].text, DATA.test[21].text], image: "assets/greenhouse-orientation/lewa-prawa-strona.svg", icon: "↔️", pose: "left", tone: "required", quizIndex: 19 });
  add({ id: "greenhouse-nave", group: "greenhouse", title: shortTitle(DATA.test[20].text), parts: [DATA.test[20].text, DATA.test[24].text], image: "assets/greenhouse-orientation/nawa.svg", icon: "🌿", pose: "right", tone: "required", quizIndex: 20 });
  add({ id: "greenhouse-section", group: "greenhouse", title: shortTitle(DATA.test[22].text), parts: [DATA.test[22].text], image: "assets/greenhouse-orientation/przeslo.svg", icon: "🔢", pose: "left", tone: "required", quizIndex: 22 });

  add({ id: "reader-overview", group: "reader", title: startReader.title, parts: [startReader.lead, startReader.tips], image: startReader.image, icon: "📟", pose: "reader", tone: "caution" });
  const readerStartIds = ["reader-take", "reader-personal-tag", "reader-work-start", "reader-activity", "reader-assigned-row", "reader-break-start", "reader-break-end", "reader-work-end", "reader-charge"];
  const readerFocus = [[25, 14, 42, 18], [76, 14, 36, 18], [50, 32, 90, 17], [25, 47, 40, 17], [76, 47, 36, 17], [25, 63, 40, 17], [76, 63, 36, 17], [25, 80, 40, 17], [76, 80, 36, 17]];
  startReader.steps.forEach((step, index) => add({
    id: readerStartIds[index],
    group: "reader",
    title: shortTitle(step),
    parts: [step],
    image: startReader.image,
    icon: "📟",
    pose: "reader",
    tone: index === 4 || index === 7 ? "caution" : "required",
    focus: readerFocus[index],
    quizIndex: index === 8 ? 8 : null
  }));

  add({ id: "reader-row-entry", group: "reader", title: rowStart.title, parts: [rowsReader.lead, rowStart.steps[3]], image: "assets/greenhouse-orientation/przejscie.svg", icon: "➡️", pose: "left", tone: "caution" });
  add({ id: "reader-row-exit", group: "reader", title: rowExit.title, parts: [rowExit.steps], image: "assets/greenhouse-orientation/lewa-prawa-strona.svg", icon: "⬅️", pose: "reader", tone: "required", quizIndex: 4 });
  add({ id: "reader-cart", group: "reader", title: cartsReader.title, parts: [cartsReader.lead, cartsReader.steps.slice(0, 3)], image: cartsReader.images[0], icon: "🛒", pose: "reader", tone: "required" });
  add({ id: "reader-cart-send", group: "reader", title: shortTitle(cartsReader.steps[3]), parts: [cartsReader.steps.slice(3)], image: cartsReader.images[0], icon: "✓", pose: "reader", tone: "required", quizIndex: 10 });
  add({ id: "reader-break", group: "reader", title: rowBreak.title, parts: [rowBreak.steps], image: startReader.image, icon: "☕", pose: "reader", tone: "caution", focus: readerFocus[5], quizIndex: 26 });
  add({ id: "reader-change-end", group: "reader", title: rowEnd.title, parts: [rowEnd.steps], image: startReader.image, icon: "🏁", pose: "reader", tone: "required", focus: readerFocus[7], quizIndex: 25 });
  add({ id: "reader-restart-buttons", group: "reader", title: restartReader.title, parts: [restartReader.lead, restartReader.steps.slice(0, 3)], image: restartReader.images[0], icon: "🔄", pose: "reader", tone: "caution" });
  add({ id: "reader-restart-menu", group: "reader", title: shortTitle(restartReader.steps[3]), parts: [restartReader.steps.slice(3)], image: restartReader.images[1], icon: "🔄", pose: "reader", tone: "caution", quizIndex: 12 });

  const tabletFocus = [[68, 51, 58, 82], [52, 58, 18, 24], [52, 58, 18, 24], [65, 58, 18, 24], [65, 58, 18, 24], [52, 58, 18, 24], [79, 58, 18, 24], [71, 86, 20, 24]];
  tablet.steps.forEach((step, index) => add({
    id: ["tablet-login", "tablet-start", "tablet-activity", "tablet-change", "tablet-break-start", "tablet-break-end", "tablet-work-end", "tablet-logout"][index],
    group: "tablet",
    title: step.title,
    parts: [index === 0 ? tablet.important : [], step.title, step.note, index === 7 ? tablet.tips : []],
    image: step.image,
    icon: "📱",
    pose: "tablet",
    tone: index === 7 ? "caution" : "required",
    focus: tabletFocus[index],
    quizIndex: index === 0 ? 17 : index === 3 ? 25 : null
  }));

  const safetySets = [[0, 1, 2, 3, 7], [10, 11, 12], [16, 17, 18], [13, 14, 15], [4, 5, 6, 9]];
  const safetyIds = ["safety-food-items", "safety-phone-photo", "safety-personal-data", "safety-zones", "safety-hygiene"];
  safetySets.forEach((indexes, index) => add({
    id: safetyIds[index],
    group: "safety",
    title: DATA.bans[indexes[0]].title,
    parts: [indexes.map((itemIndex) => [DATA.bans[itemIndex].title, DATA.bans[itemIndex].detail])],
    icon: index === 4 ? "🧼" : "⛔",
    pose: "warning",
    tone: index === 4 ? "required" : "danger",
    quizIndex: [16, 18, 17, 2, null][index]
  }));

  DATA.cityRules.forEach((rule, index) => add({
    id: ["documents-id", "documents-pass", "documents-parcels"][index],
    group: "documents",
    title: rule.title,
    parts: [rule.title, rule.note, rule.list || []],
    icon: ["🪪", "🎫", "📦"][index],
    pose: index === 2 ? "warning" : "right",
    tone: index === 1 ? "danger" : "caution",
    quizIndex: null
  }));

  add({ id: "help-clinic", group: "help", title: clinic.title, parts: [clinic.title, clinic.body], icon: "🏥", pose: "right", tone: "caution", quizIndex: 15 });
  add({ id: "help-emergency", group: "help", title: emergency.title, parts: [emergency.title, emergency.body], icon: "🆘 112", pose: "warning", tone: "danger", quizIndex: 27 });
  add({ id: "help-dental", group: "help", title: dental.title, parts: [dental.title, dental.body], icon: "🦷", pose: "right", tone: "caution" });
  add({ id: "finish", group: "finish", title: completionTitles[lang], parts: [topicLead(completionTitles[lang], lang), DATA.pages.test.lead, endings[lang]], icon: "✅", pose: "neutral", tone: "required" });

  const totalCharacters = sections.reduce((sum, item) => sum + item.text.length, 0);
  if (totalCharacters >= 10000) {
    throw new Error(`${lang}: presenter guide exceeds 10,000 characters (${totalCharacters})`);
  }
  sections.forEach((item) => {
    if (!item.title || !item.text) throw new Error(`${lang}: incomplete section ${item.id}`);
    if (item.text.length >= 1800) throw new Error(`${lang}: section ${item.id} is too long (${item.text.length})`);
  });

  return { totalCharacters, sections };
}

const output = {
  version: "20260719-siechnice-guide7",
  chapterCount: 0,
  languages: Object.fromEntries(languages.map((lang) => [lang, buildGuide(lang)]))
};
output.chapterCount = output.languages.pl.sections.length;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

for (const lang of languages) {
  const guide = output.languages[lang];
  console.log(`${lang}: ${guide.sections.length} chapters, ${guide.totalCharacters} characters`);
}
console.log(`wrote ${outputPath}`);
