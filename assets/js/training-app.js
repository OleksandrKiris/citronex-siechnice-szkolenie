(() => {
  const DATA = window.CX_DATA;
  const tx = (pl, en, ua, ru, az, es, fil, id, ne) => ({ pl, en, ua, ru, az, es, fil, id, ne });
  const hydraBrand = "CITRONEX hydra S.R.Z.B.";
  const validLangs = new Set(DATA.languages.map((item) => item.id));
  const page = document.body.dataset.page || "home";
  const app = document.getElementById("app");
  const assetVersion = (() => {
    try {
      return new URL(document.currentScript?.src || location.href).searchParams.get("v") || "";
    } catch (error) {
      return "";
    }
  })();

  const iconMap = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10"/><path d="M9 21v-6h6v6"/></svg>',
    hub: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><circle cx="12" cy="3" r="1.5"/><circle cx="21" cy="12" r="1.5"/><circle cx="12" cy="21" r="1.5"/><circle cx="3" cy="12" r="1.5"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z"/><path d="M9 4v14"/><path d="M15 6v14"/></svg>',
    warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21V8l9-5 9 5v13"/><path d="M7 21v-9h10v9"/><path d="M9 16h6"/></svg>',
    tablet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M9 6h6"/><path d="M8 10h8"/><path d="M8 14h8"/><circle cx="12" cy="18" r="1"/></svg>',
    greenhouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21V9a9 9 0 0 1 18 0v12"/><path d="M3 12h18"/><path d="M7 21V9"/><path d="M12 21V6"/><path d="M17 21V9"/></svg>',
    reader: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 6h4"/><path d="M10 17h4"/><circle cx="12" cy="12" r="2"/></svg>',
    medical: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14"/><path d="M5 12h14"/><path d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/></svg>',
    speech: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5h16v10H8l-4 4V5Z"/><path d="M8 9h8"/><path d="M8 12h5"/><path d="M18 18c1.7-.6 3-2.2 3-4"/><path d="M18 21c3.4-.8 6-3.7 6-7"/></svg>',
    groups: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
    city: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/><path d="M16 15h1"/><path d="M16 18h1"/></svg>',
    bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 10h18"/><path d="M5 10V8l7-4 7 4v2"/><path d="M6 10v8"/><path d="M10 10v8"/><path d="M14 10v8"/><path d="M18 10v8"/><path d="M4 18h16"/><path d="M3 21h18"/></svg>',
    document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 3h7l5 5v13H7V3Z"/><path d="M14 3v6h5"/><path d="M10 13h6"/><path d="M10 17h6"/></svg>',
    parcel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
    food: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 3v8"/><path d="M8 3v8"/><path d="M4 7h4"/><path d="M6 11v10"/><path d="M15 3v18"/><path d="M15 3c3 2 4 5 4 8 0 2-1 4-4 4"/></svg>',
    smoke: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 15h11v4H3z"/><path d="M18 15h3v4h-3z"/><path d="M16 7c2 0 3 1 3 3"/><path d="M13 5c3 0 5 2 5 5"/></svg>',
    jewelry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 3h8l4 6-8 12L4 9l4-6Z"/><path d="M4 9h16"/><path d="m9 9 3 12 3-12"/></svg>',
    id: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M14 10h4"/><path d="M14 14h3"/></svg>',
    ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/></svg>',
    test: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11l2 2 4-4"/><path d="M20 6 9 17l-5-5"/><path d="M4 19h16"/></svg>'
  };

  function getLang() {
    const params = new URLSearchParams(location.search);
    const fromUrl = (params.get("lang") || "").toLowerCase();
    const fromStorage = (localStorage.getItem("cx-lang") || "").toLowerCase();
    const browserLanguages = [navigator.language, ...(Array.isArray(navigator.languages) ? navigator.languages : [])];
    const fromBrowser = browserLanguages.map((value) => String(value || "").toLowerCase().split(/[-_]/)[0]).map((value) => value === "uk" ? "ua" : value).find((value) => validLangs.has(value));
    if (validLangs.has(fromUrl)) return fromUrl;
    if (validLangs.has(fromStorage)) return fromStorage;
    return fromBrowser || "en";
  }

  let lang = getLang();
  document.documentElement.lang = lang === "ua" ? "uk" : lang;

  const visibleTranslationFixes = {
    fil: [
      [/\bshared step-by-step instruction\b/gi, "iisang sunod-sunod na instruksyon"], [/\bgreenhouse\b/gi, "bahay-taniman"],
      [/\bwarehouse\b/gi, "bodega"], [/\binstruction\b/gi, "instruksyon"], [/\bstep-by-step\b/gi, "sunod-sunod"],
      [/\bnear\b/gi, "malapit sa"], [/\bmeeting point\b/gi, "lugar ng pagkikita"], [/\bcoordinator\b/gi, "tagapag-ugnay"],
      [/\bcity\b/gi, "lungsod"], [/\bshared\b/gi, "iisang"], [/\boffices?\b/gi, "mga opisina"],
      [/\bdocuments?\b/gi, "mga dokumento"], [/\btaxes?\b/gi, "mga buwis"], [/\bphone\b/gi, "telepono"]
    ],
    id: [
      [/\bgreenhouse\b/gi, "rumah kaca"], [/\bwarehouse\b/gi, "gudang"], [/\binstruction\b/gi, "instruksi"],
      [/\bstep-by-step\b/gi, "langkah demi langkah"], [/\bnear\b/gi, "dekat"], [/\bmeeting point\b/gi, "titik pertemuan"],
      [/\bcoordinator\b/gi, "koordinator"], [/\bcity\b/gi, "kota"], [/\bshared\b/gi, "bersama"],
      [/\boffices?\b/gi, "kantor"], [/\bdocuments?\b/gi, "dokumen"], [/\btaxes?\b/gi, "pajak"], [/\bphone\b/gi, "telepon"]
    ]
  };

  function cleanVisibleTranslation(value) {
    let result = String(value ?? "");
    (visibleTranslationFixes[lang] || []).forEach(([pattern, replacement]) => {
      result = result.replace(pattern, replacement);
    });
    return result;
  }

  function text(value) {
    if (!value) return "";
    if (typeof value === "string") return cleanVisibleTranslation(value);
    return cleanVisibleTranslation(value[lang] || value.pl || value.en || "");
  }

  function ui(key) {
    return text(DATA.ui[key]);
  }

  const voiceLocales = { pl: "pl-PL", en: "en-US", ua: "uk-UA", ru: "ru-RU", az: "az-AZ", es: "es-ES", fil: "fil-PH", id: "id-ID", ne: "ne-NP" };
  const voiceProfiles = {
    pl: { rate: .94, pitch: 1 }, en: { rate: .96, pitch: 1 }, ua: { rate: .92, pitch: 1 },
    ru: { rate: .92, pitch: 1 }, az: { rate: .94, pitch: 1 }, es: { rate: .96, pitch: 1 },
    fil: { rate: .94, pitch: 1 }, id: { rate: .94, pitch: 1 }, ne: { rate: .90, pitch: 1 }
  };
  function speechReady(value, selectedLang = "pl") {
    let result = String(value || "")
      .replace(/S\.R\.Z\.B\.?/gi, "")
      .replace(/\s*\/\s*/g, " lub ")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (selectedLang === "pl") result = result.replace(/\breader\b/gi, "czytnik");
    return result.replace(/\s+([,.!?])/g, "$1");
  }
  function findSpeechVoice(locale) {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    const exact = locale.toLowerCase();
    const prefix = exact.split("-")[0];
    const matching = voices.filter((voice) => {
      const language = String(voice.lang || "").toLowerCase();
      return language === exact || language.startsWith(`${prefix}-`);
    });
    return matching.sort((left, right) => {
      const score = (voice) => {
        const language = String(voice.lang || "").toLowerCase();
        const name = String(voice.name || "").toLowerCase();
        let value = language === exact ? 100 : 60;
        if (/natural|neural|google|microsoft|enhanced|premium|siri/.test(name)) value += 35;
        if (/compact|espeak|robot/.test(name)) value -= 20;
        if (voice.default) value += 3;
        return value;
      };
      return score(right) - score(left);
    })[0] || null;
  }
  function waitForSpeechVoice(locale, callback) {
    const synth = window.speechSynthesis;
    if (!synth) { callback(null); return; }
    const immediate = findSpeechVoice(locale);
    if (immediate) { callback(immediate); return; }
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      synth.removeEventListener?.("voiceschanged", finish);
      callback(findSpeechVoice(locale));
    };
    synth.addEventListener?.("voiceschanged", finish, { once: true });
    window.setTimeout(finish, 450);
  }
  const welcomeLanguageNames = {
    pl: "Polski", en: "English", ua: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430", ru: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", az: "Az\u0259rbaycanca", es: "Espa\u00f1ol", fil: "Filipino", id: "Bahasa Indonesia", ne: "\u0928\u0947\u092a\u093e\u0932\u0940"
  };
  const welcomeLabels = {
    title: tx("Witaj w systemie", "Welcome to the system", "\u0412\u0456\u0442\u0430\u0454\u043c\u043e \u0432 \u0441\u0438\u0441\u0442\u0435\u043c\u0456", "\u0414\u043e\u0431\u0440\u043e \u0434\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432 \u0441\u0438\u0441\u0442\u0435\u043c\u0443", "Sistem\u0259 xo\u0159 g\u0259lmisiniz", "Bienvenido al sistema", "Maligayang pagdating sa system", "Selamat datang di sistem", "\u0938\u093f\u0938\u094d\u091f\u092e\u092e\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u091b"),
    lead: tx("Wybierz j\u0119zyk. Mi\u0142y przewodnik opowie Ci, co znajdziesz na tej stronie.", "Choose a language. A friendly guide will explain what you can find on this page.", "\u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043c\u043e\u0432\u0443. \u0414\u0440\u0443\u0436\u043d\u0456\u0439 \u043f\u0440\u043e\u0432\u0456\u0434\u043d\u0438\u043a \u043f\u043e\u044f\u0441\u043d\u0438\u0442\u044c, \u0449\u043e \u0454 \u043d\u0430 \u0446\u0456\u0439 \u0441\u0442\u043e\u0440\u0456\u043d\u0446\u0456.", "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u044f\u0437\u044b\u043a. \u0414\u0440\u0443\u0436\u0435\u043b\u044e\u0431\u043d\u044b\u0439 \u043f\u043e\u043c\u043e\u0449\u043d\u0438\u043a \u0440\u0430\u0441\u0441\u043a\u0430\u0436\u0435\u0442, \u0447\u0442\u043e \u0435\u0441\u0442\u044c \u043d\u0430 \u044d\u0442\u043e\u0439 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435.", "Dil se\u00e7in. Mehriban b\u0259l\u0259d\u00e7i bu s\u0259hif\u0259d\u0259 n\u0259l\u0259r oldu\u011funu izah ed\u0259c\u0259k.", "Elige un idioma. Un gu\u00eda amable te explicar\u00e1 qu\u00e9 puedes encontrar en esta p\u00e1gina.", "Pumili ng wika. Ipapaliwanag ng isang magiliw na gabay kung ano ang makikita sa page na ito.", "Pilih bahasa. Pemandu yang ramah akan menjelaskan apa yang ada di halaman ini.", "\u092d\u093e\u0937\u093e \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d। \u0938\u092c\u0948\u0932\u094b \u092e\u093f\u0932\u094d\u0928\u0947 \u092c\u093e\u091f\u094b\u0932\u0947 \u092f\u0938 \u092a\u0943\u0937\u094d\u0920\u092e\u093e \u0915\u0947 \u091b \u092d\u0928\u0947\u0930 \u092c\u0924\u093e\u0909\u0928\u0947\u091b\u0928\u094d\u091b.") ,
    choose: tx("Wybierz j\u0119zyk", "Choose a language", "\u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043c\u043e\u0432\u0443", "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u044f\u0437\u044b\u043a", "Dil se\u00e7in", "Elige un idioma", "Pumili ng wika", "Pilih bahasa", "\u092d\u093e\u0937\u093e \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d"),
    start: tx("Pos\u0142uchaj i rozpocznij", "Listen and start", "\u0421\u043b\u0443\u0445\u0430\u0442\u0438 \u0439 \u043f\u043e\u0447\u0430\u0442\u0438", "\u041f\u043e\u0441\u043b\u0443\u0448\u0430\u0442\u044c \u0438 \u043d\u0430\u0447\u0430\u0442\u044c", "Dinl\u0259 v\u0259 ba\u0159la", "Escuchar y comenzar", "Makinig at magsimula", "Dengarkan dan mulai", "\u0938\u0941\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u0938\u0941\u0930\u0941 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d"),
    skip: tx("Pomi\u0144 g\u0142os", "Skip voice", "\u041f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u0438 \u0433\u043e\u043b\u043e\u0441", "\u041f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u0433\u043e\u043b\u043e\u0441", "S\u0259si ke\u00e7", "Omitir voz", "Laktawan ang boses", "Lewati suara", "\u0938\u094d\u0935\u0930 \u091b\u094b\u0921\u094d\u0928\u0941\u0939\u094b\u0938\u094d"),
    speaking: tx("Przewodnik m\u00f3wi...", "The guide is speaking...", "\u041f\u0440\u043e\u0432\u0456\u0434\u043d\u0438\u043a \u0433\u043e\u0432\u043e\u0440\u0438\u0442...", "\u041f\u043e\u043c\u043e\u0449\u043d\u0438\u043a \u0433\u043e\u0432\u043e\u0440\u0438\u0442...", "B\u0259l\u0259d\u00e7i dan\u0131\u0159\u0131r...", "El gu\u00eda est\u00e1 hablando...", "Nagsasalita ang gabay...", "Pemandu sedang berbicara...", "\u092c\u093e\u091f\u094b\u0932\u0947 \u092c\u094b\u0932\u093f\u0930\u0939\u0947\u0915\u094b \u091b..."),
    open: tx("Otw\u00f3rz system", "Open the system", "\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u0441\u0438\u0441\u0442\u0435\u043c\u0443", "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u0438\u0441\u0442\u0435\u043c\u0443", "Sistemi a\u00e7", "Abrir el sistema", "Buksan ang system", "Buka sistem", "\u0938\u093f\u0938\u094d\u091f\u092e \u0916\u094b\u0932\u094d\u0928\u0941\u0939\u094b\u0938\u094d")
  };

  function welcomeText(value, selectedLang = lang) {
    return value[selectedLang] || value.pl || value.en || "";
  }

  function getLocationName() {
    if (DATA.meta && DATA.meta.location) return String(DATA.meta.location);
    const subtitle = text(DATA.ui && DATA.ui.subtitle);
    return subtitle.split(/\s+-\s+/)[0].trim() || "Citronex";
  }

  function getWelcomeSpeech(selectedLang) {
    const simple = speechGuideTemplates[selectedLang] || speechGuideTemplates.pl;
    return simple.map((line) => line.replace("{location}", getLocationName())).join(" ");
  }
  const welcomeSpeechTexts = {
    pl: "Witaj. To jest system szkoleniowy dla " + getLocationName() + ". Wybierz potrzebny kafelek.",
    en: "Welcome. This is the training system for " + getLocationName() + ". Choose the tile you need.",
    ua: "\u0412\u0456\u0442\u0430\u0454\u043c\u043e. \u0426\u0435 \u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u043d\u0430\u0432\u0447\u0430\u043d\u043d\u044f \u0434\u043b\u044f " + getLocationName() + ". \u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044c \u043f\u043e\u0442\u0440\u0456\u0431\u043d\u0438\u0439 \u0440\u043e\u0437\u0434\u0456\u043b.",
    ru: "\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c. \u042d\u0442\u043e \u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u044f \u0434\u043b\u044f " + getLocationName() + ". \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0443\u0436\u043d\u044b\u0439 \u0440\u0430\u0437\u0434\u0435\u043b.",
    az: "Salam. Bu, " + getLocationName() + " \u00fc\u00e7\u00fcn t\u0259lim sistemidir. Laz\u0131m olan b\u00f6lm\u0259ni se\u00e7in.",
    es: "Bienvenido. Este es el sistema de formaci\u00f3n para " + getLocationName() + ". Elige la secci\u00f3n que necesitas.",
    fil: "Maligayang pagdating. Ito ang training system para sa " + getLocationName() + ". Piliin ang seksiyong kailangan mo.",
    id: "Selamat datang. Ini adalah sistem pelatihan untuk " + getLocationName() + ". Pilih bagian yang Anda perlukan.",
    ne: "\u0938\u094d\u0935\u093e\u0917\u0924 \u091b\u0964 \u092f\u094b " + getLocationName() + " \u0915\u093e \u0932\u093e\u0917\u093f \u092a\u094d\u0930\u0936\u093f\u0915\u094d\u0937\u0923 \u092a\u094d\u0930\u0923\u093e\u0932\u0940 \u0939\u094b\u0964 \u0906\u0935\u0936\u094d\u092f\u0915 \u092d\u093e\u0917 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964"
  };
  const speechGuideTemplates = {
  "pl": [
    "Witaj. To jest system szkoleniowy dla {location}.",
    "Nie wiesz, gdzie iść? Otwórz mapę i wybierz miejsce pracy.",
    "Po przyjściu wybierz potrzebną sekcję."
  ],
  "en": [
    "Welcome. This is the training system for {location}.",
    "Do not know where to go? Open the map and choose your workplace.",
    "When you arrive, choose the section you need."
  ],
  "ua": [
    "Вітаємо. Це система навчання для {location}.",
    "Не знаєте, куди йти? Відкрийте карту та виберіть місце роботи.",
    "Після приходу виберіть потрібний розділ."
  ],
  "ru": [
    "Здравствуйте! Меня зовут Александр. Я ваш цифровой помощник по обучению в Сехнице.",
    "Сначала откройте карту и проверьте, куда вам нужно приехать.",
    "Если вы работаете в теплице — изучите разделы «Теплица», «Ридер» и «Планшет».",
    "Если вы работаете на складе — откройте раздел «Склад».",
    "Не спешите. Просмотрите инструкцию полностью, а после приезда обязательно пройдите очный инструктаж у руководителя.",
    "Желаю вам спокойной и безопасной работы!"
  ],
  "az": [
    "Salam. Bu, {location} üçün təlim sistemidir.",
    "Hara gedəcəyinizi bilmirsiniz? Xəritəni açın və iş yerinizi seçin.",
    "Gəldikdən sonra lazım olan bölməni seçin."
  ],
  "es": [
    "Bienvenido. Este es el sistema de formación para {location}.",
    "¿No sabes adónde ir? Abre el mapa y elige tu lugar de trabajo.",
    "Cuando llegues, elige la sección que necesitas."
  ],
  "fil": [
    "Maligayang pagdating. Ito ang training system para sa {location}.",
    "Hindi mo alam kung saan pupunta? Buksan ang mapa at piliin ang lugar ng trabaho.",
    "Pagdating mo, piliin ang seksiyong kailangan mo."
  ],
  "id": [
    "Selamat datang. Ini adalah sistem pelatihan untuk {location}.",
    "Tidak tahu harus pergi ke mana? Buka peta dan pilih tempat kerja Anda.",
    "Setelah tiba, pilih bagian yang Anda perlukan."
  ],
  "ne": [
    "{location} का लागि स्वागत छ। यो प्रशिक्षण प्रणाली हो।",
    "कहाँ जाने थाहा छैन? नक्सा खोल्नुहोस् र काम गर्ने ठाउँ छान्नुहोस्।",
    "पुगेपछि आवश्यक भाग छान्नुहोस्।"
  ]
};
  getWelcomeSpeech = (selectedLang) => (speechGuideTemplates[selectedLang] || speechGuideTemplates.pl)
    .map((line) => line.replace("{location}", getLocationName())).join(" ");
  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function href(pageName) {
    if (pageName === "szklarnia3d") return "https://oleksandrkiris.github.io/citronex-szklarnia-3d/";
    const base = pageName === "home" ? "index.html" : `${pageName}.html`;
    return `${base}?lang=${encodeURIComponent(lang)}`;
  }

  function assetSrc(src) {
    const value = String(src || "");
    const normalized = value.replace(/^\.\//, "");
    if (!normalized.startsWith("assets/") || /[?&]v=/.test(value)) return value;
    return `${value}${value.includes("?") ? "&" : "?"}v=${encodeURIComponent(assetVersion || "assets")}`;
  }

  function telHref(phone) {
    return `tel:${phone.replace(/\s/g, "")}`;
  }

  function waHref(phone, message = "") {
    const number = phone.replace(/[^\d]/g, "");
    const suffix = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${number}${suffix}`;
  }

  function viberHref(phone, message = "") {
    const number = phone.replace(/[^\d+]/g, "");
    const suffix = message ? `&text=${encodeURIComponent(message)}` : "";
    return `viber://chat?number=${encodeURIComponent(number)}${suffix}`;
  }

  function telegramAppHref(url = "") {
    const match = String(url).match(/(?:t\.me|telegram\.me)\/([A-Za-z0-9_]+)/i);
    return match ? `tg://resolve?domain=${encodeURIComponent(match[1])}` : "";
  }

  function cardClass(tone) {
    return tone ? `card ${tone}` : "card";
  }

  function action(url, label, tone = "") {
    const cls = tone ? "btn " + tone : "btn";
    return '<a class="' + cls + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + '</a>';
  }

  const linkLabels = {
    backupMap: tx("Mapa zapasowa", "Backup map", "Запасна карта", "Запасная карта", "Ehtiyat xəritə", "Mapa de reserva", "Backup na mapa", "Peta cadangan", "ब्याकअप नक्सा"),
    copyAddress: tx("Kopiuj adres", "Copy address", "Копіювати адресу", "Копировать адрес", "Ünvanı kopyala", "Copiar dirección", "Kopyahin ang address", "Salin alamat", "ठेगाना कपी गर्नुहोस्"),
    copyPoint: tx("Kopiuj punkt", "Copy point", "Копіювати пункт", "Копировать точку", "Nöqtəni kopyala", "Copiar punto", "Kopyahin ang punto", "Salin titik", "स्थान कपी गर्नुहोस्"),
    copied: tx("Skopiowano", "Copied", "Скопійовано", "Скопировано", "Kopyalandı", "Copiado", "Nakopya", "Disalin", "कपी भयो")
  };

  function cleanText(value) {
    return text(value).replace(/\s+/g, " ").trim();
  }

  function isMapLikeUrl(url = "") {
    return /maps\.app\.goo\.gl|google\.[^/]+\/maps|goo\.gl\/maps/i.test(String(url));
  }

  function coordinatesFromUrl(url = "") {
    const raw = String(url || "");
    const direct = raw.match(/(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/);
    if (direct) return direct[1] + "," + direct[2];
    try {
      const parsed = new URL(raw, location.href);
      const joined = [parsed.searchParams.get("q"), parsed.searchParams.get("destination"), parsed.pathname].filter(Boolean).join(" ");
      const match = joined.match(/(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/);
      return match ? match[1] + "," + match[2] : "";
    } catch {
      return "";
    }
  }

  function fallbackMapUrl(source = {}, url = "") {
    const explicit = source.backupUrl || source.fallbackUrl || source.backupMap;
    if (explicit) return explicit;
    const coords = coordinatesFromUrl(url || source.url || source.map);
    if (coords) return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(coords);
    const address = cleanText(source.address);
    if (address) return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
    return "";
  }

  function linkCopyValue(source = {}) {
    return cleanText(source.address) || cleanText(source.title) || cleanText(source.label) || cleanText(source.note);
  }

  function linkTools(source = {}, url = "", tone = "secondary") {
    const primaryUrl = String(url || source.url || source.map || "").trim();
    const copyValue = linkCopyValue(source);
    const shouldSupport = isMapLikeUrl(primaryUrl) || !!cleanText(source.address);
    if (!shouldSupport) return "";
    const fallback = fallbackMapUrl(source, primaryUrl);
    const hasFallback = fallback && fallback !== primaryUrl;
    const copyLabel = cleanText(source.address) ? text(linkLabels.copyAddress) : text(linkLabels.copyPoint);
    const backupTone = tone === "red" ? "red" : "secondary";
    const backup = hasFallback ? action(fallback, text(linkLabels.backupMap), backupTone) : "";
    const copy = copyValue ? '<button type="button" class="btn secondary link-copy-btn" data-copy-link="' + esc(copyValue) + '" data-copy-original="' + esc(copyLabel) + '">' + esc(copyLabel) + '</button>' : "";
    return backup || copy ? '<div class="link-tools">' + backup + copy + '</div>' : "";
  }

  function mapActionGroup(source = {}, label = ui("openMap"), tone = "blue") {
    const url = source.url || source.map || "";
    if (!url) return "";
    return '<div class="map-action-group"><div class="btn-row">' + action(url, label, tone) + '</div>' + linkTools(source, url, tone) + '</div>';
  }

  function bindCopyLinks() {
    app.querySelectorAll("[data-copy-link]").forEach((button) => {
      button.addEventListener("click", async () => {
        const value = button.dataset.copyLink || "";
        const original = button.dataset.copyOriginal || button.textContent;
        try {
          await navigator.clipboard.writeText(value);
          button.textContent = text(linkLabels.copied);
          button.classList.add("is-copied");
          window.setTimeout(() => {
            button.textContent = original;
            button.classList.remove("is-copied");
          }, 1800);
        } catch {
          button.textContent = value;
        }
      });
    });
  }

  function phoneActions(phone, whatsappLabel = ui("whatsapp")) {
    return `
      <div class="btn-row">
        <a class="btn secondary" href="${esc(telHref(phone))}">${esc(ui("call"))} ${esc(formatPhone(phone))}</a>
        <a class="btn" href="${esc(waHref(phone))}" target="_blank" rel="noopener">${esc(whatsappLabel)}</a>
      </div>
    `;
  }

  function formatPhone(phone) {
    const cleaned = phone.replace(/[^\d+]/g, "");
    if (!cleaned.startsWith("+48")) return phone.trim();
    const rest = cleaned.slice(3).replace(/(\d{3})(?=\d)/g, "$1 ").trim();
    return `+48 ${rest}`;
  }

  function renderHeader() {
    const isHome = page === "home";
    const selected = DATA.languages.map((item) => (
      `<option value="${esc(item.id)}"${item.id === lang ? " selected" : ""}>${esc(item.label)}</option>`
    )).join("");
    const navItems = [
      { page: "home", icon: "home", tone: "green", label: DATA.ui.home },
      { page: "mapa", icon: "map", tone: "blue", label: tx("Mapa", "Map", "Карта", "Карта", "Xəritə", "Mapa", "Mapa", "Peta", "नक्सा") },
      { page: "kontakty", icon: "phone", tone: "green", label: tx("Kontakt", "Contact", "Контакт", "Контакт", "Əlaqə", "Contacto", "Contact", "Kontak", "सम्पर्क") },
      { page: "lekarz", icon: "medical", tone: "red", label: tx("Lekarz", "Doctor", "Лікар", "Врач", "Həkim", "Médico", "Doktor", "Dokter", "डाक्टर") }
    ];
    const navHtml = navItems.map((item) => `
      <a class="top-nav-link${item.page === page ? " is-active" : ""}" data-tone="${esc(item.tone)}" href="${esc(href(item.page))}"${item.page === page ? ' aria-current="page"' : ""}>
        <span class="top-nav-icon" aria-hidden="true">${iconMap[item.icon] || iconMap.home}</span>
        <span>${esc(text(item.label))}</span>
      </a>
    `).join("");
    const hydraHref = `https://oleksandrkiris.github.io/citronex-hydra-project/?lang=${encodeURIComponent(lang)}`;
    const hydraLabel = text(tx(
      "Wróć do Hydry",
      "Back to Hydra",
      "Повернутися до Hydra",
      "Вернуться в Hydra",
      "Hydra-ya qayıt",
      "Volver a Hydra",
      "Bumalik sa Hydra",
      "Kembali ke Hydra",
      "Hydra मा फर्कनुहोस्"
    ));
    const hydraHtml = `
      <a class="top-nav-link hydra-link" href="${esc(hydraHref)}" aria-label="${esc(hydraLabel)}">
        <span class="top-nav-icon" aria-hidden="true">${iconMap.hub}</span>
        <span>${esc(hydraLabel)}</span>
      </a>
    `;
    const homeReturn = isHome ? "" : `
      <a class="home-return-cta" href="${esc(href("home"))}">
        <span class="home-return-icon">${iconMap.home}</span>
        <span>${esc(text(tx("Powr\u00f3t do kafelk\u00f3w", "Back to tiles", "\u041d\u0430\u0437\u0430\u0434 \u0434\u043e \u043f\u043b\u0438\u0442\u043e\u043a", "\u041d\u0430\u0437\u0430\u0434 \u043a \u043f\u043b\u0438\u0442\u043a\u0430\u043c", "Kafel se\u00e7iml\u0259rin\u0259 qay\u0131t", "Volver a tarjetas", "Bumalik sa mga tile", "Kembali ke kartu", "\u0915\u093e\u0930\u094d\u0921\u0939\u0930\u0942\u092e\u093e \u092b\u0930\u094d\u0915\u0928\u0941\u0939\u094b\u0938\u094d")))}</span>
      </a>
    `;

    document.body.insertAdjacentHTML("afterbegin", `
      <header class="app-header">
        <div class="header-inner">
          ${isHome ? `<span class="back-link" aria-hidden="true">CX</span>` : `<a class="back-link" href="${esc(href("home"))}" aria-label="${esc(ui("back"))}">‹</a>`}
          <div class="brand">
            <img src="assets/logo-citronex.svg" alt="Citronex">
            <div>
              <p class="brand-title">${esc(hydraBrand)}</p>
              <p class="brand-subtitle">${esc(ui("subtitle"))}</p>
            </div>
          </div>
          <select class="lang-select" id="langSelect" aria-label="Language">${selected}</select>
        </div>
        <nav class="top-nav" aria-label="${esc(text(tx("Szybkie przyciski", "Quick buttons", "Швидкі кнопки", "Быстрые кнопки", "Sürətli düymələr", "Botones rápidos", "Mabilis na buttons", "Tombol cepat", "छिटो बटनहरू")))}">
          <div class="top-nav-scroll">${navHtml}${hydraHtml}</div>
        </nav>
        ${homeReturn}
      </header>
    `);

    document.getElementById("langSelect").addEventListener("change", (event) => {
      reloadWithLanguage(event.target.value);
    });
  }

  function reloadWithLanguage(nextLang) {
    if (!validLangs.has(nextLang)) return;
    lang = nextLang;
    localStorage.setItem("cx-lang", lang);
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    url.searchParams.delete("welcome");
    location.href = url.toString();
  }

  function focusActiveTopNav() {
    const nav = document.querySelector(".top-nav-scroll");
    const active = nav?.querySelector(".top-nav-link.is-active");
    if (!nav || !active) return;
    requestAnimationFrame(() => {
      const target = active.offsetLeft - ((nav.clientWidth - active.clientWidth) / 2);
      nav.scrollTo({ left: Math.max(0, target), behavior: "auto" });
    });
  }

  function showHydraEntrySplash() {
    const params = new URLSearchParams(location.search);
    if (params.get("from") !== "hydra" || document.querySelector(".location-splash")) return;
    const appTitle = DATA.meta && DATA.meta.appTitle ? DATA.meta.appTitle : hydraBrand;
    const logoSrc = DATA.meta && DATA.meta.logo ? DATA.meta.logo : "assets/logo-citronex.svg";
    const logoAlt = DATA.meta && DATA.meta.logoAlt ? DATA.meta.logoAlt : appTitle;
    const cleanUrl = new URL(location.href);
    cleanUrl.searchParams.delete("from");
    history.replaceState(null, "", cleanUrl.toString());
    const splash = document.createElement("div");
    splash.className = "location-splash";
    splash.setAttribute("role", "status");
    splash.setAttribute("aria-live", "polite");
    splash.innerHTML = `
      <div class="location-splash-card">
        <img src="${esc(logoSrc)}" alt="${esc(logoAlt)}">
        <strong>${esc(appTitle)}</strong>
        <span>${esc(text(tx("Ładowanie szkolenia", "Loading training", "Завантаження навчання", "Загрузка обучения", "Təlim yüklənir", "Cargando formación", "Naglo-load ang training", "Memuat pelatihan", "तालिम खुल्दैछ")))}</span>
      </div>
    `;
    document.body.appendChild(splash);
    document.body.classList.add("location-splash-open");
    window.setTimeout(() => {
      splash.classList.add("is-hiding");
      window.setTimeout(() => {
        splash.remove();
        document.body.classList.remove("location-splash-open");
      }, 280);
    }, 2000);
  }

  function pageHero(pageName = page) {
    const info = DATA.pages[pageName] || DATA.pages.home;
    document.title = `${text(info.title)} - ${text(ui("brand"))}`;
    return `
      <section class="hero">
        <p class="eyebrow">${esc(hydraBrand)}</p>
        <h1>${esc(text(info.title))}</h1>
        <p class="lead">${esc(text(info.lead))}</p>
      </section>
    `;
  }

  function renderHome() {
    const priorityPages = new Set(["mapa", "szklarnia", "szklarnia3d", "reader", "lekarz"]);
    const primaryPages = new Set(["mapa", "magazyn", "szklarnia", "szklarnia3d", "reader", "lekarz", "kontakty", "zakazy", "test"]);
    const renderTile = (tile) => `
      <a class="tile${priorityPages.has(tile.page) ? " tile-priority" : ""}" data-tone="${esc(tile.tone)}" href="${esc(href(tile.page))}">
        <div class="tile-top">
          <div>
            <div class="icon-box">${iconMap[tile.icon] || iconMap.test}</div>
          </div>
          <span class="arrow">›</span>
        </div>
        <div>
          <p class="tile-title">${esc(text(tile.title))}</p>
          <p class="tile-text">${esc(text(tile.text))}</p>
        </div>
      </a>
    `;
    const primaryTiles = DATA.tiles.filter((tile) => primaryPages.has(tile.page));
    const extraTiles = DATA.tiles.filter((tile) => !primaryPages.has(tile.page));
    const tiles = primaryTiles.map(renderTile).join("");
    const moreModulesLabel = text(tx("Pozost\u0142e modu\u0142y", "More modules", "\u0406\u043d\u0448\u0456 \u043c\u043e\u0434\u0443\u043b\u0456", "\u0414\u0440\u0443\u0433\u0438\u0435 \u043c\u043e\u0434\u0443\u043b\u0438", "Dig\u0259r modullar", "M\u00e1s m\u00f3dulos", "Iba pang mga module", "Modul lainnya", "\u0915\u093e\u0928\u094d\u092f \u092e\u094b\u0921\u094d\u092f\u0941\u0932\u0939\u0930\u0942"));
    const fixMoreModulesLabel = () => {
      const summary = app.querySelector(".more-modules > summary");
      if (summary) summary.textContent = moreModulesLabel;
    };
    const extraModules = extraTiles.length ? `
      <details class="card more-modules section">
        <summary>${esc(text(tx("Pozostałe moduły", "More modules", "\\u0406\\u043d\\u0448\\u0456 \\u043c\\u043e\\u0434\\u0443\\u043b\\u0456", "\\u0414\\u0440\\u0443\\u0433\\u0438\\u0435 \\u043c\\u043e\\u0434\\u0443\\u043b\\u0438", "Digər modullar", "M\\u00e1s m\\u00f3dulos", "Iba pang mga module", "Modul lainnya", "\\u0915\\u093e\\u0928\\u094d\\u092f \\u092e\\u094b\\u0921\\u094d\\u092f\\u0941\\u0932\\u0939\\u0930\\u0942")))}</summary>
        <div class="details-body"><section class="tiles compact-tiles">${extraTiles.map(renderTile).join("")}</section></div>
      </details>
    ` : "";
    const install = DATA.install;
    const installCard = install ? `
      <details class="card install-card">
        <summary>${esc(text(install.title))}</summary>
        <div class="details-body">
          <p>${esc(text(install.lead))}</p>
          <ul class="list">
            <li>${esc(text(install.android))}</li>
            <li>${esc(text(install.iphone))}</li>
          </ul>
        </div>
      </details>
    ` : "";

    app.innerHTML = `<main class="page">${pageHero("home")}<section class="tiles">${tiles}</section>${extraModules}${installCard}</main>`;
    fixMoreModulesLabel();
  }

  function renderHomeCompact() {
    const priorityPages = new Set(["mapa", "szklarnia", "szklarnia3d", "reader", "lekarz"]);
    const primaryPages = new Set(["mapa", "magazyn", "szklarnia", "szklarnia3d", "reader", "lekarz", "kontakty", "zakazy", "test"]);
    const renderTile = (tile) => `
      <a class="tile${priorityPages.has(tile.page) ? " tile-priority" : ""}" data-tone="${esc(tile.tone)}" href="${esc(href(tile.page))}">
        <div class="tile-top"><span class="icon-box">${iconMap[tile.icon] || iconMap.test}</span><span class="arrow">›</span></div>
        <div><p class="tile-title">${esc(text(tile.title))}</p><p class="tile-text">${esc(text(tile.text))}</p></div>
      </a>
    `;
    const primaryTiles = DATA.tiles.filter((tile) => primaryPages.has(tile.page));
    const extraTiles = DATA.tiles.filter((tile) => !primaryPages.has(tile.page));
    const moreLinks = extraTiles.map((tile) => `
      <a class="more-link" href="${esc(href(tile.page))}">
        <span class="more-link-icon">${iconMap[tile.icon] || iconMap.test}</span>
        <span>${esc(text(tile.title))}</span>
      </a>
    `).join("");
    const moreTile = extraTiles.length ? `
      <details class="tile more-tile">
        <summary>
          <span class="tile-top"><span class="icon-box">${iconMap.hub}</span><span class="arrow">+</span></span>
          <span class="tile-title">${esc(text(tx("Więcej", "More", "Більше", "Больше", "Daha çox", "Más", "Higit pa", "Lainnya", "थप")))}</span>
          <span class="tile-text">${esc(text(tx("Słownik, grupy, miasto i komunikaty.", "Glossary, groups, city and phrases.", "Словник, групи, місто та фрази.", "Словарь, группы, город и фразы.", "Lüğət, qruplar, şəhər və ifadələr.", "Glosario, grupos, ciudad y frases.", "Talasalitaan, grupo, lungsod at mga parirala.", "Kamus, grup, kota, dan kalimat.", "शब्दकोश, समूह, शहर र वाक्यहरू।")))}</span>
        </summary>
        <span class="more-links">${moreLinks}</span>
      </details>
    ` : "";
    app.innerHTML = `<main class="page">${pageHero("home")}${renderAssistantEntryTile()}<section class="tiles">${primaryTiles.map(renderTile).join("")}${moreTile}</section></main>`;
  }

  function renderAssistantEntryTile() {
    const tap = text(tx(
      "Naciśnij tutaj", "Tap here", "Натисніть тут", "Нажмите здесь", "Buraya toxunun",
      "Pulsa aquí", "Pindutin dito", "Tekan di sini", "यहाँ थिच्नुहोस्"
    ));
    const title = text(tx(
      "Otwórz pomocnika Aleksandra", "Open Aleksandr's assistant", "Відкрити помічника Олександра",
      "Открыть помощника Александра", "Aleksandrın köməkçisini açın", "Abrir el asistente de Aleksandr",
      "Buksan ang assistant ni Aleksandr", "Buka asisten Aleksandr", "अलेक्जेन्डरको सहायक खोल्नुहोस्"
    ));
    const lead = text(tx(
      "Posłuchaj pełnego instruktażu przed przyjazdem lub podczas oczekiwania na dokumenty.",
      "Listen to the full briefing before arrival or while waiting for documents.",
      "Прослухайте повний інструктаж до приїзду або під час очікування документів.",
      "Послушайте полный инструктаж до приезда или во время ожидания документов.",
      "Gəlməzdən əvvəl və ya sənədləri gözləyərkən tam təlimatı dinləyin.",
      "Escucha la formación completa antes de llegar o mientras esperas los documentos.",
      "Pakinggan ang buong orientation bago dumating o habang naghihintay ng mga dokumento.",
      "Dengarkan pengarahan lengkap sebelum tiba atau sambil menunggu dokumen.",
      "आउनुअघि वा कागजात कुर्दै गर्दा पूर्ण निर्देशन सुन्नुहोस्।"
    ));
    const chapters = text(tx(
      "10 rozdziałów · głos męski · Twój język", "10 chapters · male voice · your language",
      "10 розділів · чоловічий голос · ваша мова", "10 глав · мужской голос · ваш язык",
      "10 bölmə · kişi səsi · sizin diliniz", "10 capítulos · voz masculina · tu idioma",
      "10 kabanata · boses ng lalaki · iyong wika", "10 bab · suara pria · bahasa Anda",
      "१० अध्याय · पुरुष आवाज · तपाईंको भाषा"
    ));
    return `
      <a class="assistant-entry-tile" href="${esc(href("pomocnik"))}" aria-label="${esc(`${tap}. ${title}`)}">
        <span class="assistant-entry-play" aria-hidden="true">▶</span>
        <span class="assistant-entry-copy">
          <span class="assistant-entry-tap">${esc(tap)}</span>
          <strong>${esc(title)}</strong>
          <span class="assistant-entry-lead">${esc(lead)}</span>
          <span class="assistant-entry-meta">${esc(chapters)}</span>
        </span>
        <span class="assistant-entry-arrow" aria-hidden="true">›</span>
      </a>`;
  }

  function renderAssistantPage() {
    const eyebrow = text(tx(
      "Osobista strona instruktażu", "Personal briefing page", "Особиста сторінка інструктажу",
      "Персональная страница инструктажа", "Şəxsi təlimat səhifəsi", "Página personal de formación",
      "Personal na orientation page", "Halaman pengarahan pribadi", "व्यक्तिगत निर्देशन पृष्ठ"
    ));
    const title = text(tx(
      "Posłuchaj Aleksandra krok po kroku", "Listen to Aleksandr step by step",
      "Слухайте Олександра крок за кроком", "Послушайте Александра шаг за шагом",
      "Aleksandrı addım-addım dinləyin", "Escucha a Aleksandr paso a paso",
      "Pakinggan si Aleksandr nang sunod-sunod", "Dengarkan Aleksandr langkah demi langkah",
      "अलेक्जेन्डरलाई चरणबद्ध सुन्नुहोस्"
    ));
    const lead = text(tx(
      "Włącz głos, przejdź przez wszystkie rozdziały i zatrzymaj nagranie w dowolnej chwili.",
      "Turn on the voice, go through every chapter and stop the recording at any time.",
      "Увімкніть голос, пройдіть усі розділи та зупиняйте запис у будь-який момент.",
      "Включите голос, пройдите все главы и останавливайте запись в любой момент.",
      "Səsi açın, bütün bölmələrə baxın və istənilən vaxt qeydi dayandırın.",
      "Activa la voz, recorre todos los capítulos y detén la grabación cuando quieras.",
      "I-on ang boses, tapusin ang lahat ng kabanata at ihinto ang recording anumang oras.",
      "Nyalakan suara, ikuti semua bab, dan hentikan rekaman kapan saja.",
      "आवाज खोल्नुहोस्, सबै अध्याय पूरा गर्नुहोस् र कुनै पनि बेला रेकर्डिङ रोक्नुहोस्।"
    ));
    document.title = `${title} - ${hydraBrand}`;
    app.innerHTML = `
      <main class="page assistant-page">
        <section class="assistant-page-intro">
          <p class="eyebrow">${esc(eyebrow)}</p>
          <h1>${esc(title)}</h1>
          <p>${esc(lead)}</p>
        </section>
        ${renderDigitalPresenter()}
      </main>`;
  }

  function presenterExperienceCopy() {
    return {
      chooseTitle: text(tx("Wybierz swój instruktaż", "Choose your briefing", "Оберіть свій інструктаж", "Выберите свой инструктаж", "Təlimatınızı seçin", "Elige tu formación", "Piliin ang iyong orientation", "Pilih pengarahan Anda", "आफ्नो निर्देशन छान्नुहोस्")),
      chooseLead: text(tx("Po wyborze głos uruchomi się automatycznie. Trasę można zmienić.", "After selection, the voice starts automatically. You can change the path.", "Після вибору голос увімкнеться автоматично. Маршрут можна змінити.", "После выбора голос включится автоматически. Маршрут можно изменить.", "Seçimdən sonra səs avtomatik başlayacaq. Marşrutu dəyişmək olar.", "Después de elegir, la voz empezará automáticamente. Puedes cambiar la ruta.", "Pagkapili, awtomatikong magsisimula ang boses. Maaari mong baguhin ang ruta.", "Setelah memilih, suara akan mulai otomatis. Jalur dapat diubah.", "छानेपछि आवाज स्वतः सुरु हुन्छ। मार्ग बदल्न सकिन्छ।")),
      changePath: text(tx("Zmień trasę", "Change path", "Змінити маршрут", "Сменить маршрут", "Marşrutu dəyiş", "Cambiar ruta", "Baguhin ang ruta", "Ganti jalur", "मार्ग बदल्नुहोस्")),
      presentation: text(tx("Tryb prezentacji", "Presentation mode", "Режим презентації", "Режим презентации", "Təqdimat rejimi", "Modo presentación", "Presentation mode", "Mode presentasi", "प्रस्तुति मोड")),
      exitPresentation: text(tx("Wyjdź z prezentacji", "Exit presentation", "Вийти з презентації", "Выйти из презентации", "Təqdimatdan çıx", "Salir de presentación", "Lumabas sa presentation", "Keluar dari presentasi", "प्रस्तुतिबाट निस्कनुहोस्")),
      completed: text(tx("Ukończono", "Completed", "Завершено", "Пройдено", "Tamamlandı", "Completado", "Natapos", "Selesai", "पूरा भयो")),
      continuing: text(tx("Za chwilę następny krok", "Next step is starting", "Далі буде наступний крок", "Дальше — следующий шаг", "Növbəti addım başlayır", "Empieza el siguiente paso", "Susunod na ang kasunod na hakbang", "Langkah berikutnya dimulai", "अब अर्को चरण सुरु हुन्छ")),
      quizTitle: text(tx("Sprawdź, czy rozumiesz", "Check your understanding", "Перевірте, чи зрозуміли", "Проверьте, всё ли понятно", "Başa düşdüyünüzü yoxlayın", "Comprueba lo aprendido", "Tingnan kung naintindihan", "Periksa pemahaman Anda", "बुझेको जाँच गर्नुहोस्")),
      correct: text(tx("Dobrze. Możesz przejść dalej.", "Correct. You can continue.", "Правильно. Можна продовжувати.", "Правильно. Можно продолжать.", "Düzdür. Davam edə bilərsiniz.", "Correcto. Puedes continuar.", "Tama. Maaari kang magpatuloy.", "Benar. Anda dapat melanjutkan.", "सही। अब अगाडि जान सक्नुहुन्छ।")),
      wrong: text(tx("Nieprawidłowo. Posłuchaj zasady jeszcze raz.", "Not correct. Listen to the rule again.", "Неправильно. Прослухайте правило ще раз.", "Неправильно. Послушайте правило ещё раз.", "Səhvdir. Qaydanı yenidən dinləyin.", "Incorrecto. Escucha la regla otra vez.", "Mali. Pakinggan muli ang patakaran.", "Belum benar. Dengarkan aturannya lagi.", "गलत। नियम फेरि सुन्नुहोस्।")),
      repeat: text(tx("Powtórz rozdział", "Repeat chapter", "Повторити розділ", "Повторить главу", "Bölməni təkrar et", "Repetir capítulo", "Ulitin ang kabanata", "Ulangi bab", "अध्याय दोहोर्याउनुहोस्")),
      continue: text(tx("Następny rozdział", "Next chapter", "Наступний розділ", "Следующая глава", "Növbəti bölmə", "Siguiente capítulo", "Susunod na kabanata", "Bab berikutnya", "अर्को अध्याय")),
      yes: text(tx("Tak", "Yes", "Так", "Да", "Bəli", "Sí", "Oo", "Ya", "हो")),
      no: text(tx("Nie", "No", "Ні", "Нет", "Xeyr", "No", "Hindi", "Tidak", "होइन")),
      forbidden: text(tx("ZABRONIONE", "PROHIBITED", "ЗАБОРОНЕНО", "ЗАПРЕЩЕНО", "QADAĞANDIR", "PROHIBIDO", "BAWAL", "DILARANG", "निषेध")),
      correctBadge: text(tx("PRAWIDŁOWO", "CORRECT", "ПРАВИЛЬНО", "ПРАВИЛЬНО", "DÜZGÜNDÜR", "CORRECTO", "TAMA", "BENAR", "सही")),
      important: text(tx("WAŻNE", "IMPORTANT", "ВАЖЛИВО", "ВАЖНО", "VACİB", "IMPORTANTE", "MAHALAGA", "PENTING", "महत्त्वपूर्ण")),
      openPhoto: text(tx("Powiększ zdjęcie", "Enlarge photo", "Збільшити фото", "Увеличить фото", "Şəkli böyüt", "Ampliar foto", "Palakihin ang larawan", "Perbesar foto", "फोटो ठूलो पार्नुहोस्")),
      closePhoto: text(tx("Zamknij zdjęcie", "Close photo", "Закрити фото", "Закрыть фото", "Şəkli bağla", "Cerrar foto", "Isara ang larawan", "Tutup foto", "फोटो बन्द गर्नुहोस्")),
      source: text(tx("Źródło zdjęcia", "Photo source", "Джерело фото", "Источник фото", "Şəkil mənbəyi", "Fuente de la foto", "Pinagmulan ng larawan", "Sumber foto", "फोटो स्रोत")),
      wrongShort: text(tx("Nie wolno", "Do not", "Не можна", "Нельзя", "Olmaz", "No se permite", "Bawal", "Dilarang", "गर्न पाइँदैन")),
      rightShort: text(tx("Tak należy", "Do this", "Так правильно", "Так правильно", "Belə edin", "Hazlo así", "Gawin ito", "Lakukan ini", "यसरी गर्नुहोस्")),
      dontUnderstand: text(tx("Nie rozumiem", "I don't understand", "Не розумію", "Не понял", "Başa düşmədim", "No entiendo", "Hindi ko naintindihan", "Saya belum paham", "मैले बुझिनँ")),
      helpTitle: text(tx("Zobaczmy to jeszcze raz", "Let us go through it again", "Розберімо це ще раз", "Давайте разберём это ещё раз", "Gəlin bunu yenidən nəzərdən keçirək", "Veámoslo otra vez", "Ulitin natin ito", "Mari kita ulangi", "यसलाई फेरि हेरौँ")),
      helpLead: text(tx("Nagranie zostało zatrzymane. Wybierz sposób wyjaśnienia.", "The recording is paused. Choose how you want this explained.", "Запис зупинено. Виберіть спосіб пояснення.", "Запись остановлена. Выберите способ объяснения.", "Səs dayandırıldı. İzah üsulunu seçin.", "La grabación está pausada. Elige cómo explicarlo.", "Naka-pause ang recording. Piliin kung paano ito ipapaliwanag.", "Rekaman dijeda. Pilih cara penjelasannya.", "रेकर्ड रोकिएको छ। कसरी बुझ्ने हो छान्नुहोस्।")),
      slowRepeat: text(tx("Powtórz wolniej", "Repeat more slowly", "Повторити повільніше", "Повторить медленнее", "Daha yavaş təkrarla", "Repetir más despacio", "Ulitin nang mas mabagal", "Ulangi lebih lambat", "बिस्तारै फेरि सुन्नुहोस्")),
      showVisual: text(tx("Pokaż na zdjęciu", "Show it in the picture", "Показати на фото", "Показать на фотографии", "Şəkildə göstər", "Mostrar en la imagen", "Ipakita sa larawan", "Tunjukkan pada gambar", "तस्बिरमा देखाउनुहोस्")),
      readText: text(tx("Pokaż cały tekst", "Show the full text", "Показати весь текст", "Показать весь текст", "Tam mətni göstər", "Mostrar todo el texto", "Ipakita ang buong teksto", "Tampilkan teks lengkap", "पूरा पाठ देखाउनुहोस्")),
      hideText: text(tx("Ukryj cały tekst", "Hide the full text", "Сховати весь текст", "Скрыть весь текст", "Tam mətni gizlət", "Ocultar el texto", "Itago ang buong teksto", "Sembunyikan teks", "पूरा पाठ लुकाउनुहोस्")),
      helpClose: text(tx("Wróć do instruktażu", "Return to the briefing", "Повернутися до інструктажу", "Вернуться к инструктажу", "Təlimata qayıt", "Volver a la formación", "Bumalik sa orientation", "Kembali ke pengarahan", "निर्देशनमा फर्कनुहोस्")),
      askSupervisor: text(tx("Jeśli nadal nie rozumiesz, nie zaczynaj czynności. Poproś brygadzistę lub koordynatora o pokazanie jej na miejscu.", "If it is still unclear, do not start the task. Ask the team leader or coordinator to demonstrate it on site.", "Якщо все ще незрозуміло, не починайте дію. Попросіть бригадира або координатора показати її на місці.", "Если всё ещё непонятно, не начинайте действие. Попросите бригадира или координатора показать его на месте.", "Hələ də aydın deyilsə, işi başlamayın. Briqadirdən və ya koordinatordan yerində göstərməsini istəyin.", "Si todavía no está claro, no empieces la tarea. Pide al encargado o coordinador que la muestre en el lugar.", "Kung hindi pa rin malinaw, huwag simulan ang gawain. Hilingin sa team leader o coordinator na ipakita ito sa lugar.", "Jika masih belum jelas, jangan mulai tugas. Minta ketua tim atau koordinator menunjukkan langsung.", "अझै नबुझेमा काम सुरु नगर्नुहोस्। टोली प्रमुख वा संयोजकलाई त्यहीँ देखाउन भन्नुहोस्।")),
      scene: text(tx("Scena", "Scene", "Сцена", "Сцена", "Səhnə", "Escena", "Eksena", "Adegan", "दृश्य")),
      tracks: {
        warehouse: { icon: "📦", title: text(tx("Praca w magazynie", "Warehouse work", "Робота на складі", "Работа на складе", "Anbar işi", "Trabajo en almacén", "Trabaho sa bodega", "Kerja di gudang", "गोदामको काम")), lead: text(tx("Wejście, tablet, zakazy i pomoc", "Entrance, tablet, rules and help", "Вхід, планшет, заборони і допомога", "Вход, планшет, запреты и помощь", "Giriş, tablet, qaydalar və kömək", "Entrada, tablet, reglas y ayuda", "Pasukan, tablet, mga bawal at tulong", "Pintu masuk, tablet, larangan dan bantuan", "प्रवेश, ट्याब्लेट, निषेध र सहायता")) },
        greenhouse: { icon: "🌿", title: text(tx("Praca w szklarni", "Greenhouse work", "Робота в теплиці", "Работа в теплице", "İstixana işi", "Trabajo en invernadero", "Trabaho sa bahay-taniman", "Kerja di rumah kaca", "ग्रीनहाउसको काम")), lead: text(tx("Orientacja, reader, tablet i bezpieczeństwo", "Orientation, reader, tablet and safety", "Орієнтація, рідер, планшет і безпека", "Ориентация, ридер, планшет и безопасность", "İstiqamət, reader, tablet və təhlükəsizlik", "Orientación, reader, tablet y seguridad", "Orientation, reader, tablet at kaligtasan", "Orientasi, reader, tablet dan keselamatan", "दिशा, reader, tablet र सुरक्षा")) },
        before: { icon: "🗺️", title: text(tx("Przed przyjazdem", "Before arrival", "До приїзду", "До приезда", "Gəlməzdən əvvəl", "Antes de llegar", "Bago dumating", "Sebelum datang", "आउनुअघि")), lead: text(tx("Droga, pierwszy dzień, dokumenty i kontakt", "Route, first day, documents and contact", "Дорога, перший день, документи і контакт", "Дорога, первый день, документы и связь", "Yol, ilk gün, sənədlər və əlaqə", "Ruta, primer día, documentos y contacto", "Daan, unang araw, dokumento at contact", "Rute, hari pertama, dokumen dan kontak", "बाटो, पहिलो दिन, कागजात र सम्पर्क")) },
        waiting: { icon: "⏳", title: text(tx("Czekam na dokumenty", "Waiting for documents", "Чекаю на документи", "Жду документы", "Sənədləri gözləyirəm", "Espero documentos", "Naghihintay ng dokumento", "Menunggu dokumen", "कागजात कुर्दैछु")), lead: text(tx("Urzędy, bank, lekarz i ważne kontakty", "Offices, bank, doctor and key contacts", "Установи, банк, лікар і важливі контакти", "Учреждения, банк, врач и важные контакты", "Qurumlar, bank, həkim və vacib əlaqələr", "Oficinas, banco, médico y contactos", "Mga opisina, bangko, doktor at contact", "Kantor, bank, dokter dan kontak penting", "कार्यालय, बैंक, डाक्टर र महत्त्वपूर्ण सम्पर्क")) },
        all: { icon: "✅", title: text(tx("Pełny instruktaż", "Full briefing", "Повний інструктаж", "Полный инструктаж", "Tam təlimat", "Formación completa", "Buong orientation", "Pengarahan lengkap", "पूर्ण निर्देशन")), lead: text(tx("Wszystkie rozdziały po kolei", "Every chapter in order", "Усі розділи по черзі", "Все главы по порядку", "Bütün bölmələr ardıcıllıqla", "Todos los capítulos en orden", "Lahat ng kabanata nang sunod-sunod", "Semua bab secara berurutan", "सबै अध्याय क्रमशः")) }
      }
    };
  }

  function renderDigitalPresenter() {
    const labels = welcomeGuideUi[lang] || welcomeGuideUi.pl;
    const experience = presenterExperienceCopy();
    const sentences = guideText(lang, getLocationName());
    const speedLabel = text(tx("Tempo", "Speed", "Темп", "Темп", "Sürət", "Velocidad", "Bilis", "Kecepatan", "गति"));
    const title = text(tx("Aleksandr — cyfrowy przewodnik", "Aleksandr — digital guide", "Олександр — цифровий провідник", "Александр — цифровой помощник", "Aleksandr — rəqəmsal bələdçi", "Aleksandr — guía digital", "Aleksandr — digital na gabay", "Aleksandr — pemandu digital", "अलेक्जेन्डर — डिजिटल मार्गदर्शक"));
    const badge = text(tx("Przed rozpoczęciem", "Before you start", "Перед початком", "Перед началом", "Başlamazdan əvvəl", "Antes de empezar", "Bago magsimula", "Sebelum mulai", "सुरु गर्नु अघि"));
    const stop = text(tx("Zatrzymaj", "Stop", "Зупинити", "Остановить", "Dayandır", "Detener", "Ihinto", "Hentikan", "रोक्नुहोस्"));
    const previous = text(tx("Poprzedni", "Previous", "Попередній", "Предыдущий", "Əvvəlki", "Anterior", "Nakaraan", "Sebelumnya", "अघिल्लो"));
    const fullText = text(tx("Pełny tekst instruktażu", "Full briefing transcript", "Повний текст інструктажу", "Полный текст инструктажа", "Təlimatın tam mətni", "Texto completo de la formación", "Buong teksto ng orientation", "Teks pengarahan lengkap", "पूर्ण निर्देशन पाठ"));
    const loading = text(tx("Ładowanie rozdziałów...", "Loading chapters...", "Завантаження розділів...", "Загрузка глав...", "Bölmələr yüklənir...", "Cargando capítulos...", "Nilo-load ang mga kabanata...", "Memuat bab...", "अध्याय लोड हुँदैछ..."));
    const map = text(tx("Najpierw: droga i mapa", "First: route and map", "Спочатку: дорога і карта", "Сначала: дорога и карта", "Əvvəlcə: yol və xəritə", "Primero: ruta y mapa", "Una: daan at mapa", "Pertama: rute dan peta", "पहिले: बाटो र नक्सा"));
    const note = text(tx(
      "To przygotowanie nie zastępuje instruktażu stanowiskowego. Na miejscu słuchaj kierownika i zasad BHP.",
      "This preparation does not replace workplace instruction. On site, follow the supervisor and safety rules.",
      "Ця підготовка не замінює інструктажу на робочому місці. На місці виконуйте вказівки керівника та правила безпеки.",
      "Эта подготовка не заменяет инструктаж на рабочем месте. На месте выполняйте указания руководителя и правила безопасности.",
      "Bu hazırlıq iş yerində təlimatı əvəz etmir. İş yerində rəhbərin göstərişlərinə və təhlükəsizlik qaydalarına əməl edin.",
      "Esta preparación no sustituye la instrucción en el puesto. En el lugar, sigue al supervisor y las normas de seguridad.",
      "Hindi nito pinapalitan ang aktuwal na orientation sa trabaho. Sundin ang supervisor at mga tuntunin sa kaligtasan.",
      "Persiapan ini tidak menggantikan pengarahan di tempat kerja. Ikuti supervisor dan aturan keselamatan.",
      "यो तयारीले कार्यस्थलको प्रत्यक्ष निर्देशनलाई प्रतिस्थापन गर्दैन। सुपरभाइजर र सुरक्षा नियम पालना गर्नुहोस्।"
    ));
    return `
      <section class="presenter-card presenter-card-v2" data-presenter-card aria-labelledby="presenterTitle">
        <div class="presenter-media presenter-stage" data-presenter-stage>
          <div class="presenter-cartoon" data-presenter-cartoon data-prop="welcome">
            <div class="cartoon-greenhouse"></div>
            <div class="cartoon-prop-card" data-cartoon-prop-card>
              <div class="cartoon-prop-visual">
                <img class="cartoon-prop-image" data-cartoon-prop-image alt="" hidden>
                <span class="guide-focus-ring" data-guide-focus-ring hidden></span>
                <span class="cartoon-rule-badge" data-cartoon-rule-badge hidden></span>
                <span class="cartoon-prop-icon" data-cartoon-prop-icon>👋</span>
                <span class="guide-comparison" data-guide-comparison hidden><b data-guide-comparison-wrong></b><b data-guide-comparison-right></b></span>
                <button type="button" class="cartoon-photo-zoom" data-presenter-photo-open aria-label="${esc(experience.openPhoto)}" hidden>⛶</button>
              </div>
              <strong data-cartoon-prop-label></strong>
              <small data-cartoon-prop-counter aria-hidden="true"></small>
              <a class="cartoon-photo-source" data-cartoon-photo-source target="_blank" rel="noopener noreferrer" hidden></a>
            </div>
            <div class="cartoon-character guide-character" data-guide-character data-pose="neutral" data-rig="parts" data-expression="friendly" aria-hidden="true">
              <img class="cartoon-arm cartoon-arm-left" src="assets/avatar/cartoon/arm-left-v2.png?v=20260719-siechnice-master30" alt="" width="1536" height="864">
              <img class="cartoon-arm cartoon-arm-right" src="assets/avatar/cartoon/arm-right-v3.png?v=20260719-siechnice-master30" alt="" width="1010" height="720">
              <img class="cartoon-torso" src="assets/avatar/cartoon/torso-v1.png?v=20260719-siechnice-master30" alt="" width="538" height="634">
              <div class="cartoon-head">
                <img src="assets/avatar/cartoon/head-v1.png?v=20260719-siechnice-master30" alt="" width="405" height="542">
                <span class="cartoon-brow cartoon-brow-left"></span>
                <span class="cartoon-brow cartoon-brow-right"></span>
                <span class="cartoon-eye cartoon-eye-left"></span>
                <span class="cartoon-eye cartoon-eye-right"></span>
                <span class="cartoon-mouth"><i></i></span>
              </div>
            </div>
          </div>
          <button type="button" class="presenter-stage-hit" data-presenter-stage-hit aria-label="${esc(labels.start)}"></button>
          <div class="presenter-stage-tools">
            <button type="button" class="presenter-tool" data-presenter-track-button aria-label="${esc(experience.changePath)}"><span data-presenter-track-icon>🧭</span><small data-presenter-track-progress>0/0</small></button>
            <button type="button" class="presenter-tool presenter-help-tool" data-presenter-help-button aria-label="${esc(experience.dontUnderstand)}"><span aria-hidden="true">?</span><small>${esc(experience.dontUnderstand)}</small></button>
            <button type="button" class="presenter-tool" data-presenter-fullscreen aria-label="${esc(experience.presentation)}">⛶</button>
          </div>
          <div class="presenter-path-overlay" data-presenter-path-overlay>
            <div class="presenter-path-dialog" role="dialog" aria-modal="true" aria-labelledby="presenterPathTitle">
              <h3 id="presenterPathTitle">${esc(experience.chooseTitle)}</h3>
              <p>${esc(experience.chooseLead)}</p>
              <div class="presenter-path-grid" data-presenter-path-grid></div>
            </div>
          </div>
          <div class="presenter-quiz-overlay" data-presenter-quiz hidden>
            <div class="presenter-quiz-card" role="dialog" aria-modal="true" aria-labelledby="presenterQuizTitle">
              <p class="presenter-quiz-kicker">${esc(experience.quizTitle)}</p>
              <h3 id="presenterQuizTitle" data-presenter-quiz-question></h3>
              <div class="presenter-quiz-answers">
                <button type="button" data-presenter-quiz-answer="1">${esc(experience.yes)}</button>
                <button type="button" data-presenter-quiz-answer="0">${esc(experience.no)}</button>
              </div>
              <p class="presenter-quiz-feedback" data-presenter-quiz-feedback aria-live="polite"></p>
              <div class="presenter-quiz-next" data-presenter-quiz-next hidden>
                <button type="button" class="btn secondary" data-presenter-quiz-repeat>${esc(experience.repeat)}</button>
                <button type="button" class="btn" data-presenter-quiz-continue>${esc(experience.continue)}</button>
              </div>
            </div>
          </div>
          <div class="presenter-photo-overlay" data-presenter-photo-overlay hidden>
            <button type="button" class="presenter-photo-close" data-presenter-photo-close aria-label="${esc(experience.closePhoto)}">×</button>
            <img data-presenter-photo-image alt="" loading="eager">
            <div class="presenter-photo-caption"><strong data-presenter-photo-title></strong><a data-presenter-photo-source target="_blank" rel="noopener noreferrer" hidden></a></div>
          </div>
          <div class="presenter-understand-overlay" data-presenter-help-overlay hidden>
            <div class="presenter-understand-card" role="dialog" aria-modal="true" aria-labelledby="presenterHelpTitle">
              <button type="button" class="presenter-understand-close" data-presenter-help-close aria-label="${esc(experience.helpClose)}">×</button>
              <p class="presenter-understand-kicker">${esc(experience.dontUnderstand)}</p>
              <h3 id="presenterHelpTitle">${esc(experience.helpTitle)}</h3>
              <p class="presenter-understand-lead">${esc(experience.helpLead)}</p>
              <blockquote data-presenter-help-sentence></blockquote>
              <div class="presenter-understand-actions">
                <button type="button" data-presenter-help-slow>🐢 <span>${esc(experience.slowRepeat)}</span></button>
                <button type="button" data-presenter-help-visual>🔎 <span>${esc(experience.showVisual)}</span></button>
                <button type="button" data-presenter-help-text>☰ <span>${esc(experience.readText)}</span></button>
              </div>
              <p class="presenter-understand-full" data-presenter-help-full hidden></p>
              <small class="presenter-understand-warning">${esc(experience.askSupervisor)}</small>
              <button type="button" class="btn presenter-understand-return" data-presenter-help-return>${esc(experience.helpClose)}</button>
            </div>
          </div>
          <div class="presenter-complete-toast" data-presenter-complete-toast hidden><b aria-hidden="true">✓</b><span>${esc(experience.completed)}</span><small>${esc(experience.continuing)}</small></div>
          <video class="presenter-video" data-presenter-video playsinline muted preload="auto" poster="assets/avatar/presenter-human-poster-v1.jpg?v=20260719-siechnice-master30" hidden></video>
          <p class="presenter-caption" data-presenter-caption aria-hidden="true"></p>
          <div class="presenter-scene-status" aria-live="polite"><span>${esc(experience.scene)}</span> <b data-presenter-scene-current>1</b>/<span data-presenter-scene-total>1</span></div>
          <span class="presenter-speaking" aria-hidden="true"><span></span><span></span><span></span></span>
          <div class="presenter-overall-progress" aria-hidden="true"><span data-presenter-overall-progress></span></div>
        </div>
        <div class="presenter-content">
          <p class="presenter-badge">${esc(badge)}</p>
          <h2 id="presenterTitle">${esc(title)}</h2>
          <p class="presenter-chapter-counter"><span data-presenter-group-label>${esc(badge)}</span> · <span data-presenter-step>${esc(labels.step)}</span> <strong data-presenter-current>1</strong> / <span data-presenter-total>1</span></p>
          <div class="presenter-step-rail" data-presenter-step-rail aria-label="${esc(fullText)}"></div>
          <label class="presenter-mobile-chapter">
            <span>${esc(labels.step)}</span>
            <select data-presenter-chapter-select aria-label="${esc(fullText)}"></select>
          </label>
          <h3 class="presenter-chapter-title" data-presenter-chapter-title>${esc(badge)}</h3>
          <p class="presenter-script" data-presenter-script aria-live="polite">${esc(sentences.join(" "))}</p>
          <div class="presenter-timeline">
            <input type="range" min="0" max="1000" value="0" step="1" data-presenter-seek aria-label="${esc(labels.speaking)}">
            <div class="presenter-times"><span data-presenter-time>0:00</span><span data-presenter-duration>0:00</span></div>
            <label class="presenter-speed">
              <span>${esc(speedLabel)}</span>
              <select data-presenter-rate aria-label="${esc(speedLabel)}">
                <option value="0.8">0.8×</option>
                <option value="0.85">0.85×</option>
                <option value="1" selected>1×</option>
                <option value="1.1">1.1×</option>
              </select>
            </label>
          </div>
          <p class="presenter-note">${esc(note)}</p>
          <div class="presenter-actions presenter-controls">
            <button type="button" class="btn secondary presenter-control-small" data-presenter-previous aria-label="${esc(previous)}"><span class="presenter-control-icon" aria-hidden="true">←</span><span class="presenter-control-text">${esc(previous)}</span></button>
            <button type="button" class="btn presenter-play" data-presenter-play><span data-presenter-play-icon>▶</span> <span data-presenter-play-label>${esc(labels.start)}</span></button>
            <button type="button" class="btn secondary presenter-control-small" data-presenter-next><span class="presenter-control-text" data-presenter-next-label>${esc(labels.next)}</span><span class="presenter-control-icon" aria-hidden="true">→</span></button>
            <button type="button" class="btn secondary presenter-stop" data-presenter-stop>■ ${esc(stop)}</button>
            <a class="btn secondary presenter-context-link" data-presenter-context-link href="${esc(href("mapa"))}">
              <span class="presenter-context-icon" data-presenter-context-icon aria-hidden="true">🗺️</span>
              <span data-presenter-context-label>${esc(map)}</span>
              <span class="presenter-context-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <nav class="presenter-chapters" data-presenter-chapters aria-label="${esc(fullText)}"><span class="presenter-loading">${esc(loading)}</span></nav>
        <details class="presenter-transcript">
          <summary>${esc(fullText)}</summary>
          <div class="presenter-transcript-body" data-presenter-transcript></div>
        </details>
        <audio data-presenter-audio preload="metadata" playsinline></audio>
      </section>`;
  }

  function renderVersionFooter() {
    const main = app.querySelector("main.page");
    if (!main || main.querySelector(".app-version-footer")) return;
    const version = DATA.meta && DATA.meta.version ? DATA.meta.version : "dev";
    main.insertAdjacentHTML("beforeend", `
      <p class="footer-note app-version-footer">
        GitHub Pages &middot; offline cache &middot; v${esc(version)}
      </p>
    `);
  }

  function renderMap() {
    const photoWord = tx("zdjęcie", "photo", "фото", "фото", "şəkil", "foto", "larawan", "foto", "फोटो");
    const placeHint = tx("Rozpoznaj to miejsce przed wejściem.", "Recognize this place before entering.", "Впізнайте це місце перед входом.", "Узнайте это место перед входом.", "Girməzdən əvvəl bu yeri tanıyın.", "Reconoce este lugar antes de entrar.", "Kilalanin ang lugar bago pumasok.", "Kenali tempat ini sebelum masuk.", "प्रवेश अघि यो ठाउँ चिन्नुहोस्।");
    const cards = DATA.maps.map((item) => `
      <article class="${cardClass(item.tone)}">
        <h3>${esc(text(item.title))}</h3>
        <p>${esc(text(item.note))}</p>
        ${mapActionGroup(item, ui("openMap") + " - " + text(item.title), item.tone === "red" ? "red" : item.tone === "yellow" ? "yellow" : "blue")}
      </article>
    `).join("");
    const firstSteps = DATA.firstDay.steps.map((item, index) => `
      <article class="step-card compact">
        <span class="step-number">${index + 1}</span>
        <div>
          <h3>${esc(text(item.title))}</h3>
          <p>${esc(text(item.note))}</p>
        </div>
      </article>
    `).join("");
    const photoGroups = (DATA.mapPhotos || []).map((group) => {
      const photos = group.photos.map((src, index) => `
        <figure class="media">
          <img loading="eager" src="${esc(src)}" alt="${esc(text(group.title))}">
          <figcaption><strong>${esc(text(group.title))}</strong><span>${esc(text(photoWord))} ${index + 1}. ${esc(text(placeHint))}</span></figcaption>
        </figure>
      `).join("");
      return `
        <details class="${cardClass(group.tone)}">
          <summary>${esc(text(group.title))}</summary>
          <div class="details-body">
            <p>${esc(text(group.note))}</p>
            <div class="photo-grid">${photos}</div>
          </div>
        </details>
      `;
    }).join("");
    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <details class="card yellow module-details">
          <summary>${esc(text(DATA.firstDay.title))}</summary>
          <div class="details-body">
            <p>${esc(text(DATA.firstDay.lead))}</p>
            <div class="steps compact-list">${firstSteps}</div>
          </div>
        </details>
        <section class="module-grid two section">${cards}</section>
        <section class="section">
          <h2>${esc(text(tx("Zdjęcia wejść", "Entrance photos", "Фото входів", "Фото входов", "Giriş şəkilləri", "Fotos de entradas", "Mga larawan ng pasukan", "Foto pintu masuk", "प्रवेश फोटो")))}</h2>
          <div class="stack">${photoGroups}</div>
        </section>
      </main>
    `;
  }

  function renderWarehouse() {
    const rules = DATA.warehouseRules.map((item) => `<li>${esc(text(item))}</li>`).join("");
    const warehouseMap = DATA.maps.find((item) => item.key === "warehouse");
    const oldWarehouseMap = DATA.maps.find((item) => item.key === "oldWarehouse");
    const warehouseButtons = [
      warehouseMap ? mapActionGroup(warehouseMap, text(tx("Mapa magazynu", "Warehouse map", "Карта складу", "Карта склада", "Anbar xəritəsi", "Mapa del almacén", "Mapa ng bodega", "Peta gudang", "गोदाम नक्सा")), "yellow") : "",
      oldWarehouseMap ? mapActionGroup(oldWarehouseMap, text(oldWarehouseMap.title), "yellow") : ""
    ].filter(Boolean).join("");
    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <section class="card yellow">
          <h2>${esc(text(DATA.tiles.find((tile) => tile.page === "magazyn").title))}</h2>
          <p>${esc(warehouseMap ? text(warehouseMap.note) : text(DATA.pages.magazyn.lead))}</p>
          <ul class="list">${rules}</ul>
          <div class="map-action-list">
            ${warehouseButtons}
          </div>
        </section>
        <section class="card yellow section media-details warehouse-photos">
          <h2>${esc(text(tx("Zdjęcia magazynu", "Warehouse photos", "Фото складу", "Фото склада", "Anbar şəkilləri", "Fotos del almacén", "Mga larawan ng bodega", "Foto gudang", "गोदाम फोटो")))}</h2>
          <p>${esc(text(tx("Najpierw otwórz mapę, potem porównaj wejście ze zdjęciem.", "First open the map, then compare the entrance with the photo.", "Спочатку відкрийте карту, потім порівняйте вхід із фото.", "Сначала откройте карту, потом сравните вход с фото.", "Əvvəl xəritəni açın, sonra girişi şəkillə müqayisə edin.", "Primero abre el mapa y luego compara la entrada con la foto.", "Buksan muna ang mapa, pagkatapos ihambing ang pasukan sa larawan.", "Buka peta dulu, lalu cocokkan pintu masuk dengan foto.", "पहिले नक्सा खोल्नुहोस्, अनि प्रवेशलाई फोटोसँग मिलाउनुहोस्।")))}</p>
          <div class="details-body">
            <div class="photo-grid">
            <figure class="media"><img loading="eager" src="assets/warehouse/magazyn-wejscie-1.jpg" alt="Magazyn wejście"><figcaption>${esc(text(tx("Budynek magazynu - widok z parkingu.", "Warehouse building - view from parking.", "Будівля складу - вид з парковки.", "Здание склада - вид с парковки.", "Anbar binası - dayanacaqdan görünüş.", "Edificio de almacén - vista desde parking.", "Gusali ng bodega mula sa paradahan.", "Gedung gudang dari parkir.", "पार्किङबाट गोदाम भवन।")))}</figcaption></figure>
            <figure class="media"><img loading="eager" src="assets/warehouse/magazyn-wejscie-2.jpg" alt="Magazyn wejście drzwi"><figcaption>${esc(text(tx("Wejście dla personelu.", "Staff entrance.", "Вхід для персоналу.", "Вход для персонала.", "Personal girişi.", "Entrada de personal.", "Pasukan ng staff.", "Pintu masuk staf.", "कर्मचारी प्रवेश।")))}</figcaption></figure>
          </div>
          </div>
        </section>
        ${tabletLinkCard("yellow")}
      </main>
    `;
  }

  function tabletLinkCard(tone = "yellow") {
    return `
      <section class="${cardClass(tone)} section tablet-link-card">
        <div class="city-card-head">
          <span class="city-card-icon">${iconMap.tablet}</span>
          <div>
            <span class="city-card-tag">${esc(text(tx("Ten sam system", "Same system", "Та сама система", "Та же система", "Eyni sistem", "El mismo sistema", "Parehong system", "Sistem yang sama", "एउटै प्रणाली")))}</span>
            <h2>${esc(text(DATA.pages.tablet.title))}</h2>
          </div>
        </div>
        <p>${esc(text(tx("Tablet działa tak samo na szklarni i na magazynie. Otwórz jedną wspólną instrukcję krok po kroku.", "The tablet works the same in the greenhouse and warehouse. Open one shared step-by-step instruction.", "Планшет працює однаково в теплиці і на складі. Відкрийте одну спільну інструкцію крок за кроком.", "Планшет работает одинаково в теплице и на складе. Откройте одну общую инструкцию шаг за шагом.", "Planşet istixanada və anbarda eyni işləyir. Bir ümumi addım-addım təlimatı açın.", "La tablet funciona igual en invernadero y almacén. Abre una instrucción común paso a paso.", "Pareho ang tablet sa greenhouse at bodega. Buksan ang isang shared step-by-step instruction.", "Tablet bekerja sama di rumah kaca dan gudang. Buka satu instruksi bersama langkah demi langkah.", "ट्याबलेट ग्रीनहाउस र गोदाममा उस्तै चल्छ। एउटै साझा चरणबद्ध निर्देशन खोल्नुहोस्।")))}</p>
        <div class="btn-row">
          <a class="btn yellow" href="${esc(href("tablet"))}">${esc(text(tx("Otwórz instrukcję tabletu", "Open tablet instruction", "Відкрити інструкцію планшета", "Открыть инструкцию планшета", "Planşet təlimatını aç", "Abrir instrucción de tablet", "Buksan ang tablet instruction", "Buka instruksi tablet", "ट्याबलेट निर्देशन खोल्नुहोस्")))}</a>
        </div>
      </section>
    `;
  }

  function tabletInstructionMarkup() {
    const tablet = DATA.tabletGuide;
    const stepsSource = tablet.steps || [];
    const steps = stepsSource.map((item, index) => `
      <details class="tablet-step">
        <summary>
          <span class="step-number">${index + 1}</span>
          <span>${esc(text(item.title))}</span>
        </summary>
        <div class="tablet-step-body">
          <p>${esc(text(item.note))}</p>
          ${item.image ? `
            <figure class="tablet-shot">
              <img loading="eager" src="${esc(item.image)}" alt="${esc(text(item.screen))}">
              <figcaption>${esc(text(item.screen))}</figcaption>
            </figure>
          ` : `
            <div class="tablet-screen" aria-label="${esc(text(item.screen))}">
              <span class="tablet-screen-top">${esc(text(tx("Tablet", "Tablet", "Планшет", "Планшет", "Planşet", "Tablet", "Tablet", "Tablet", "ट्याबलेट")))}</span>
              <strong>${esc(text(item.screen))}</strong>
            </div>
          `}
        </div>
      </details>
    `).join("");
    const tips = (tablet.tips || []).map((item) => `<li>${esc(text(item))}</li>`).join("");
    return `
      <section class="card yellow section tablet-guide">
        <div class="city-card-head">
          <span class="city-card-icon">${iconMap.tablet}</span>
          <div>
            <span class="city-card-tag">${esc(text(tablet.tag || tx("Instruktaż tablet", "Tablet training", "Інструктаж планшета", "Инструктаж планшета", "Planşet təlimatı", "Instrucción de tablet", "Tablet training", "Instruksi tablet", "ट्याबलेट निर्देशन")))}</span>
            <h2>${esc(text(tablet.title))}</h2>
          </div>
        </div>
        <p>${esc(text(tablet.lead))}</p>
        <div class="notice yellow"><strong>${esc(ui("important"))}:</strong> ${esc(text(tablet.important))}</div>
        <div class="tablet-steps">${steps}</div>
        ${tips ? `<details class="card section module-details"><summary>${esc(ui("important"))}</summary><div class="details-body"><ul class="list">${tips}</ul></div></details>` : ""}
      </section>
    `;
  }

  function renderTablet() {
    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <section class="card blue">
          <h2>${esc(text(tx("Jedna instrukcja dla szklarni i magazynu", "One instruction for greenhouse and warehouse", "Одна інструкція для теплиці і складу", "Одна инструкция для теплицы и склада", "İstixana və anbar üçün bir təlimat", "Una instrucción para invernadero y almacén", "Isang instruction para sa greenhouse at bodega", "Satu instruksi untuk rumah kaca dan gudang", "ग्रीनहाउस र गोदामका लागि एउटै निर्देशन")))}</h2>
          <p>${esc(text(DATA.pages.tablet.lead))}</p>
        </section>
        ${tabletInstructionMarkup()}
      </main>
    `;
  }

  function renderGreenhouseGuide() {
    const guide = tx(
      "Otwórz osobny projekt z wizualizacją szklarni, rzędów, pomidorów, pracowników i wózków.",
      "Open the separate project with the greenhouse, rows, tomatoes, workers and carts.",
      "Відкрийте окремий проєкт із візуалізацією теплиці, рядів, помідорів, працівників і візків.",
      "Откройте отдельный проект с визуализацией теплицы, рядов, помидоров, работников и тележек.",
      "İstixana, sıralar, pomidorlar, işçilər və arabaların vizualizasiyası üçün ayrıca layihəni açın.",
      "Abre el proyecto independiente con la visualización del invernadero, las filas, los tomates, los trabajadores y los carros.",
      "Buksan ang hiwalay na proyekto na may visualization ng bahay-taniman, mga hanay, kamatis, manggagawa at kariton.",
      "Buka proyek terpisah dengan visualisasi rumah kaca, baris, tomat, pekerja dan troli.",
      "ग्रीनहाउस, लाइन, गोलभेडा, कामदार र गाडीको दृश्य भएको अलग परियोजना खोल्नुहोस्।"
    );
    const open = tx(
      "Otwórz wizualizację szklarni 3D", "Open greenhouse 3D visualization",
      "Відкрити 3D-візуалізацію теплиці", "Открыть 3D-визуализацию теплицы",
      "İstixananın 3D görünüşünü aç", "Abrir visualización 3D del invernadero",
      "Buksan ang 3D visualization ng bahay-taniman", "Buka visualisasi 3D rumah kaca",
      "ग्रीनहाउस 3D दृश्य खोल्नुहोस्"
    );
    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <section class="card green">
          <h2>${esc(text(DATA.pages.szklarnia.title))}</h2>
          <p>${esc(text(DATA.pages.szklarnia.lead))}</p>
          <p>${esc(text(guide))}</p>
          <a class="btn primary" href="${esc(href("szklarnia3d"))}" target="_blank" rel="noopener">${esc(text(open))}</a>
        </section>
      </main>`;
  }

  function renderGreenhouse() {
    const flow = [
      tx("Etap", "Stage", "Етап", "Этап", "Etap", "Etapa", "Stage", "Tahap", "चरण"),
      tx("Strona", "Side", "Сторона", "Сторона", "Tərəf", "Lado", "Side", "Sisi", "भाग"),
      tx("Nawa", "Nave", "Нава", "Нава", "Nava", "Nave", "Nave", "Nave", "नावा"),
      tx("Wejście", "Entrance", "Вхід", "Вход", "Giriş", "Entrada", "Pasukan", "Pintu masuk", "प्रवेश"),
      tx("Rząd", "Row", "Ряд", "Ряд", "Sıra", "Fila", "Row", "Baris", "लाइन"),
      tx("Strona rzędu", "Row side", "Сторона ряду", "Сторона ряда", "Sıranın tərəfi", "Lado de la fila", "Bahagi ng hanay", "Sisi baris", "लाइनको भाग")
    ];
    const flowChips = flow.map((item, index) => `<span class="flow-chip">${index + 1}. ${esc(text(item))}</span>`).join("");
    const workCards = [
      {
        tone: "green",
        title: tx("Przed wejściem do rzędu", "Before entering the row", "Перед входом у ряд", "Перед входом в ряд", "Sıraya girməzdən əvvəl", "Antes de entrar a la fila", "Bago pumasok sa hanay", "Sebelum masuk ke baris", "लाइनमा पस्नु अघि"),
        items: [
          tx("Sprawdź etap, stronę, nawę, wejście i rząd z informacji od brygadzisty.", "Check stage, side, nave, entrance and row from the brigadier's information.", "Перевірте етап, сторону, наву, вхід і ряд з інформації від бригадира.", "Проверьте этап, сторону, наву, вход и ряд по информации от бригадира.", "Briqadirin məlumatına görə etapı, tərəfi, navanı, girişi və sıranı yoxlayın.", "Revisa etapa, lado, nave, entrada y fila según la información del encargado.", "Suriin ang etap, bahagi, nawa, pasukan at hanay ayon sa impormasyon ng brigadier.", "Cek tahap, sisi, nave, pintu masuk dan baris dari informasi mandor.", "ब्रिगेडियरको जानकारी अनुसार चरण, भाग, नावा, प्रवेश र लाइन जाँच गर्नुहोस्।"),
          tx("Weź potrzebne narzędzia i ustaw się spokojnie przy właściwym wejściu.", "Take the needed tools and stand calmly at the correct entrance.", "Візьміть потрібні інструменти і спокійно станьте біля правильного входу.", "Возьмите нужные инструменты и спокойно станьте у правильного входа.", "Lazım olan alətləri götürün və düzgün girişdə sakit dayanın.", "Toma las herramientas necesarias y colócate tranquilo en la entrada correcta.", "Kunin ang kailangang kagamitan at pumuwesto nang maayos sa tamang pasukan.", "Ambil alat yang perlu dan posisikan diri di pintu masuk yang benar.", "चाहिने औजार लिनुहोस् र सही प्रवेशमा शान्त भएर बस्नुहोस्।"),
          tx("Jeśli numeru nie rozumiesz, sprawdź go przed wejściem, nie w środku pracy.", "If you do not understand the number, check it before entering, not in the middle of work.", "Якщо не розумієте номер, перевірте його перед входом, а не під час роботи.", "Если не понимаете номер, проверьте его до входа, не во время работы.", "Nömrəni başa düşmürsünüzsə, işin ortasında deyil, girməzdən əvvəl yoxlayın.", "Si no entiendes el número, revísalo antes de entrar, no durante el trabajo.", "Kung hindi malinaw ang numero, i-check bago pumasok, hindi habang nagtatrabaho.", "Jika tidak paham nomornya, cek sebelum masuk, bukan saat kerja.", "नम्बर नबुझे प्रवेश अघि जाँच गर्नुहोस्, कामको बीचमा होइन।")
        ]
      },
      {
        tone: "blue",
        title: tx("W rzędzie", "Inside the row", "У ряду", "В ряду", "Sıranın içində", "Dentro de la fila", "Sa loob ng hanay", "Di dalam baris", "लाइन भित्र"),
        items: [
          tx("Pracuj tylko w wyznaczonym rzędzie i na swojej stronie rzędu.", "Work only in the assigned row and on your row side.", "Працюйте тільки у призначеному ряду і на своїй стороні ряду.", "Работайте только в назначенном ряду и на своей стороне ряда.", "Yalnız təyin edilmiş sırada və sıranın öz tərəfinizdə işləyin.", "Trabaja solo en la fila asignada y en tu lado de la fila.", "Magtrabaho lang sa nakatalagang hanay at sa sarili mong bahagi ng hanay.", "Bekerja hanya di baris yang ditentukan dan di sisi baris Anda.", "तोकेको लाइन र लाइनको आफ्नो भागमा मात्र काम गर्नुहोस्।"),
          tx("Przejście zostawiaj przejezdne: narzędzia, wózek i odpady nie mogą blokować drogi.", "Keep the passage clear: tools, cart and waste must not block the way.", "Залишайте прохід вільним: інструменти, візок і відходи не повинні блокувати дорогу.", "Оставляйте проход свободным: инструменты, тележка и отходы не должны блокировать дорогу.", "Keçidi açıq saxlayın: alətlər, araba və tullantı yolu bağlamamalıdır.", "Deja el pasillo libre: herramientas, carro y residuos no deben bloquear el camino.", "Panatilihing maluwag ang daan: kagamitan, cart at basura ay hindi dapat humarang.", "Jaga lorong tetap kosong: alat, troli dan sampah tidak boleh menghalangi.", "बाटो खाली राख्नुहोस्: औजार, ट्रली र फोहोरले बाटो रोक्नु हुँदैन।"),
          tx("Nie przechodź na cudzy rząd albo drugą stronę bez polecenia.", "Do not move to another person's row or the other side without instruction.", "Не переходьте на чужий ряд або іншу сторону без вказівки.", "Не переходите на чужой ряд или другую сторону без указания.", "Tapşırıq olmadan başqa sıraya və ya o biri tərəfə keçməyin.", "No pases a otra fila o al otro lado sin instrucción.", "Huwag lumipat sa ibang hanay o kabilang bahagi kung walang utos.", "Jangan pindah ke baris orang lain atau sisi lain tanpa instruksi.", "निर्देशन बिना अरूको लाइन वा अर्को भागमा नजानुहोस्।")
        ]
      },
      {
        tone: "yellow",
        title: tx("Wychodzisz z rzędu", "Leaving the row", "Виходите з ряду", "Выходите из ряда", "Sıradan çıxırsınız", "Sales de la fila", "Paglabas sa hanay", "Keluar dari baris", "लाइनबाट निस्कँदा"),
        items: [
          tx("Jeśli pracujesz z readerem, tag rzędu odbijasz dopiero przy wyjściu.", "If you work with a reader, scan the row tag only when leaving.", "Якщо працюєте з рідером, тег ряду відбивайте тільки при виході.", "Если работаете с ридером, тег ряда отмечайте только при выходе.", "Reader ilə işləyirsinizsə, sıra tagını yalnız çıxanda vurun.", "Si trabajas con reader, marca el tag de fila solo al salir.", "Kung gumagamit ng reader, i-scan ang tag ng hanay paglabas lang.", "Jika memakai reader, scan tag baris hanya saat keluar.", "reader प्रयोग भए लाइन tag निस्कँदा मात्र स्क्यान गर्नुहोस्।"),
          tx("Rząd skończony = jedno odbicie. Rząd nieskończony = dwa odbicia.", "Finished row = one scan. Unfinished row = two scans.", "Ряд закінчений = одне відбиття. Ряд незакінчений = два відбиття.", "Ряд закончен = одна отметка. Ряд не закончен = две отметки.", "Sıra bitibsə = bir vurma. Sıra bitməyibsə = iki vurma.", "Fila terminada = una marca. Fila no terminada = dos marcas.", "Tapos na hanay = isang scan. Hindi tapos = dalawang scan.", "Baris selesai = satu scan. Belum selesai = dua scan.", "लाइन सकियो = एक स्क्यान। नसकिएको = दुई स्क्यान।"),
          tx("Dopiero po wyjściu i odbiciu idziesz na przerwę, zmianę czynności albo koniec pracy.", "Only after leaving and scanning do you go to break, activity change or finish work.", "Тільки після виходу і відбиття йдіть на перерву, зміну діяльності або кінець роботи.", "Только после выхода и отметки идите на перерыв, смену деятельности или конец работы.", "Yalnız çıxıb tag vurduqdan sonra fasiləyə, fəaliyyət dəyişikliyinə və ya işin sonuna gedin.", "Solo después de salir y marcar vas al descanso, cambio de actividad o fin de trabajo.", "Pagkatapos lang lumabas at mag-scan, saka pupunta sa pahinga, palit gawain o tapos trabaho.", "Hanya setelah keluar dan scan, pergi istirahat, ganti aktivitas atau selesai kerja.", "निस्केर स्क्यान गरेपछि मात्र ब्रेक, काम परिवर्तन वा काम अन्त्यमा जानुहोस्।")
        ]
      },
      {
        tone: "red",
        title: tx("Najczęstsze pomyłki", "Most common mistakes", "Найчастіші помилки", "Самые частые ошибки", "Ən çox edilən səhvlər", "Errores más comunes", "Karaniwang mali", "Kesalahan paling umum", "सबैभन्दा धेरै गल्ती"),
        items: [
          tx("Nie myl wejścia do nawy z rzędem pracy.", "Do not confuse the nave entrance with the work row.", "Не плутайте вхід до нави з робочим рядом.", "Не путайте вход в наву с рабочим рядом.", "Navaya girişi iş sırası ilə qarışdırmayın.", "No confundas la entrada de nave con la fila de trabajo.", "Huwag ipagkamali ang pasukan ng nave sa row ng trabaho.", "Jangan samakan pintu nave dengan baris kerja.", "नावाको प्रवेशलाई काम गर्ने लाइनसँग नझुक्किनुहोस्।"),
          tx("Nie odbijaj tagu rzędu przy wejściu do rzędu.", "Do not scan the row tag when entering the row.", "Не відбивайте тег ряду при вході в ряд.", "Не отмечайте тег ряда при входе в ряд.", "Sıraya girəndə sıra tagını vurmayın.", "No marques el tag de fila al entrar.", "Huwag i-scan ang tag ng hanay pagpasok.", "Jangan scan tag baris saat masuk.", "लाइनमा पस्दा लाइन tag स्क्यान नगर्नुहोस्।"),
          tx("Nie zaczynaj nowego miejsca, jeśli nie zakończyłeś poprzedniego rzędu/pracy.", "Do not start a new place if you have not finished the previous row/work logic.", "Не починайте нове місце, якщо не закінчили попередній ряд/роботу.", "Не начинайте новое место, если не закончили предыдущий ряд/работу.", "Əvvəlki sıra/iş məntiqini bitirmədən yeni yerə başlamayın.", "No empieces un lugar nuevo si no terminaste la fila/trabajo anterior.", "Huwag magsimula sa bagong lugar kung hindi pa tapos ang dating hanay/trabaho.", "Jangan mulai tempat baru jika logika baris/kerja sebelumnya belum selesai.", "अघिल्लो लाइन/काम नसकी नयाँ ठाउँ सुरु नगर्नुहोस्।")
        ]
      }
    ];
    const workCardsHtml = workCards.map((card) => `
      <article class="${cardClass(card.tone)}">
        <h3>${esc(text(card.title))}</h3>
        <ul class="list">${card.items.map((item) => `<li>${esc(text(item))}</li>`).join("")}</ul>
      </article>
    `).join("");
    const orient = {
      back: tx("pierwsze nawy za plecami", "first naves behind your back", "перші нави за спиною", "первые навы за спиной", "ilk navalar arxanızdadır", "primeras naves detrás de ti", "unang mga nave nasa likod mo", "nave pertama di belakang Anda", "पहिलो नावा तपाईंको पछाडि"),
      left: tx("lewa część szklarni", "left part of the greenhouse", "ліва частина теплиці", "левая часть теплицы", "istixananın sol hissəsi", "parte izquierda del invernadero", "kaliwang bahagi ng greenhouse", "bagian kiri rumah kaca", "ग्रीनहाउसको बायाँ भाग"),
      right: tx("prawa część szklarni", "right part of the greenhouse", "права частина теплиці", "правая часть теплицы", "istixananın sağ hissəsi", "parte derecha del invernadero", "kanang bahagi ng greenhouse", "bagian kanan rumah kaca", "ग्रीनहाउसको दायाँ भाग"),
      stand: tx("stoisz tutaj", "you stand here", "ви стоїте тут", "вы стоите здесь", "burada dayanırsınız", "estás aquí", "dito ka nakatayo", "Anda berdiri di sini", "तपाईं यहाँ उभिनुहुन्छ"),
      look: tx("patrzysz w stronę naw", "you look toward the naves", "дивитесь у бік нав", "смотрите в сторону нав", "navalara tərəf baxırsınız", "miras hacia las naves", "nakatingin ka sa mga nave", "Anda melihat ke arah nave", "तपाईं नावातिर हेर्नुहुन्छ"),
      entrances: tx("przejścia 1-5 od lewej", "passages 1-5 from the left", "проходи 1-5 зліва", "проходы 1-5 слева", "keçidlər soldan 1-5", "pasillos 1-5 desde la izquierda", "daanan 1-5 mula kaliwa", "lorong 1-5 dari kiri", "बायाँबाट बाटो १-५"),
      rows: tx("najpierw wybierz przejście", "first choose the passage", "спочатку виберіть прохід", "сначала выберите проход", "əvvəlcə keçidi seçin", "primero elige el pasillo", "piliin muna ang daanan", "pilih lorong dulu", "पहिले बाटो छान्नुहोस्"),
      leftRow: tx("lewy rząd", "left row", "лівий ряд", "левый ряд", "sol sıra", "fila izquierda", "kaliwang hanay", "baris kiri", "बायाँ लाइन"),
      rightRow: tx("prawy rząd", "right row", "правий ряд", "правый ряд", "sağ sıra", "fila derecha", "kanang hanay", "baris kanan", "दायाँ लाइन"),
      passage: tx("przejście", "passage", "прохід", "проход", "keçid", "pasillo", "daanan", "lorong", "बाटो"),
      depth: tx("głąb przejścia", "deeper into the passage", "вглиб проходу", "вглубь прохода", "keçidin içərisinə", "hacia dentro del pasillo", "papasok sa daanan", "ke dalam lorong", "बाटोभित्र अगाडि"),
      floor: tx("numery przęseł po środku", "section numbers in the middle", "номери секцій посередині", "номера секций посередине", "bölmə nömrələri ortadadır", "números en el centro", "numero ng seksyon sa gitna", "nomor bagian di tengah", "बीचमा सेक्सन नम्बर"),
      choose: tx("Dotknij numeru przejścia na schemacie.", "Tap the passage number on the diagram.", "Натисніть номер проходу на схемі.", "Нажмите номер прохода на схеме.", "Sxemdə keçid nömrəsinə toxunun.", "Toca el número del pasillo en el esquema.", "I-tap ang numero ng daanan sa schema.", "Ketuk nomor lorong pada skema.", "नक्सामा बाटोको नम्बर छुनुहोस्।"),
      selected: tx("Wybrane przejście", "Selected passage", "Вибраний прохід", "Выбранный проход", "Seçilmiş keçid", "Pasillo elegido", "Napiling daanan", "Lorong dipilih", "छानिएको बाटो"),
      selectedMessage: tx("Wejdź w wybrane przejście. W środku sprawdź lewą albo prawą stronę pracy oraz numer przęsła na podłodze.", "Enter the selected passage. Inside, check the left or right work side and the section number on the floor.", "Зайдіть у вибраний прохід. Усередині перевірте ліву або праву сторону роботи та номер секції на підлозі.", "Зайдите в выбранный проход. Внутри проверьте левую или правую сторону работы и номер секции на полу.", "Seçilmiş keçidə daxil olun. İçəridə sol və ya sağ iş tərəfini və yerdəki bölmə nömrəsini yoxlayın.", "Entra en el pasillo elegido. Dentro revisa el lado izquierdo o derecho de trabajo y el número de sección en el suelo.", "Pumasok sa napiling daanan. Sa loob, tingnan ang kaliwa o kanang bahagi ng trabaho at ang numero ng seksyon sa sahig.", "Masuk ke lorong yang dipilih. Di dalam, cek sisi kerja kiri atau kanan dan nomor bagian di lantai.", "छानिएको बाटोमा जानुहोस्। भित्र बायाँ वा दायाँ काम गर्ने भाग र भुइँको सेक्शन नम्बर जाँच गर्नुहोस्।"),
      nextStep: tx("Następny krok: wejście do rzędu", "Next step: enter the row", "Наступний крок: вхід у ряд", "Следующий шаг: вход в ряд", "Növbəti addım: sıraya giriş", "Siguiente paso: entrar en la fila", "Susunod: pumasok sa hanay", "Langkah berikutnya: masuk ke baris", "अर्को चरण: लाइनमा प्रवेश")
    };

    // Visible diagram labels use short, direct words so the map is readable at a glance.
    const diagram = {
      back: tx("PIERWSZE NAWY - ZA TOB\u0104", "FIRST NAVES - BEHIND YOU", "\u041f\u0415\u0420\u0428\u0406 \u041d\u0410\u0412\u0418 - \u0417\u0410 \u0421\u041f\u0418\u041d\u041e\u042e", "\u041f\u0415\u0420\u0412\u042b\u0415 \u041f\u0420\u041e\u041b\u0415\u0422\u042b - \u0417\u0410 \u0421\u041f\u0418\u041d\u041e\u0419", "\u0130LK B\u00d6LM\u018fL\u018fR - ARXANDA", "PRIMERAS NAVES - DETR\u00c1S DE TI", "UNANG NAVE - NASA LIKOD MO", "NAVE PERTAMA - DI BELAKANG ANDA", "\u092a\u0939\u093f\u0932\u094b \u0928\u093e\u0935\u093e - \u0924\u092a\u093e\u0908\u0902\u0915\u094b \u092a\u091b\u093e\u0921\u093f"),
      left: tx("LEWA STRONA", "LEFT SIDE", "\u041b\u0406\u0412\u0410 \u0421\u0422\u041e\u0420\u041e\u041d\u0410", "\u041b\u0415\u0412\u0410\u042f \u0421\u0422\u041e\u0420\u041e\u041d\u0410", "SOL T\u018fR\u018fF", "LADO IZQUIERDO", "KALIWANG BAHAGI", "SISI KIRI", "\u092c\u093e\u092f\u093e\u0901 \u092a\u0915\u094d\u0937"),
      right: tx("PRAWA STRONA", "RIGHT SIDE", "\u041f\u0420\u0410\u0412\u0410 \u0421\u0422\u041e\u0420\u041e\u041d\u0410", "\u041f\u0420\u0410\u0412\u0410\u042f \u0421\u0422\u041e\u0420\u041e\u041d\u0410", "SA\u011e T\u018fR\u018fF", "LADO DERECHO", "KANANG BAHAGI", "SISI KANAN", "\u0926\u093e\u092f\u093e\u0901 \u092a\u0915\u094d\u0937"),
      look: tx("PATRZYSZ NA NAWY", "LOOK TOWARD THE NAVES", "\u0414\u0418\u0412\u0418\u0428\u0421\u042f \u041d\u0410 \u041d\u0410\u0412\u0418", "\u0421\u041c\u041e\u0422\u0420\u0418\u0428\u042c \u041d\u0410 \u041f\u0420\u041e\u041b\u0415\u0422\u042b", "NAVALARA BAXIRSAN", "MIRAS HACIA LAS NAVES", "NAKATINGIN SA MGA NAVE", "LIHAT KE ARAH NAVE", "\u0928\u093e\u0935\u093e\u0924\u093f\u0930 \u0939\u0947\u0930\u094d\u0926\u0948"),
      stand: tx("STOJESZ TUTAJ", "YOU STAND HERE", "\u0422\u0418 \u0421\u0422\u041e\u0407\u0428 \u0422\u0423\u0422", "\u0422\u042b \u0421\u0422\u041e\u0418\u0428\u042c \u0417\u0414\u0415\u0421\u042c", "BURADA DAYANIRSAN", "EST\u00c1S AQU\u00cd", "DITO KA NAKATAYO", "ANDA BERDIRI DI SINI", "\u092f\u0939\u093e\u0901 \u092c\u0938\u094d\u0928\u0941\u0939\u094b\u0938\u094d"),
      road: tx("DROGA \u015aRODKOWA", "MIDDLE ROAD", "\u0426\u0415\u041d\u0422\u0420\u0410\u041b\u042c\u041d\u0410 \u0414\u041e\u0420\u041e\u0413\u0410", "\u0426\u0415\u041d\u0422\u0420\u0410\u041b\u042c\u041d\u0410\u042f \u0414\u041e\u0420\u041e\u0413\u0410", "ORTA YOL", "CAMINO CENTRAL", "GITNANG DAAN", "JALAN TENGAH", "\u092c\u0940\u091a\u0915\u094b \u092c\u093e\u091f\u094b"),
      passages: tx("5 PRZEJ\u015a\u0106 - OD LEWEJ: 1-5", "5 PASSAGES - FROM LEFT: 1-5", "5 \u041f\u0420\u041e\u0425\u041e\u0414\u0406\u0412 - \u0417\u041b\u0406\u0412\u0410: 1-5", "5 \u041f\u0420\u041e\u0425\u041e\u0414\u041e\0412 - \u0421\u041b\u0415\u0412\u0410: 1-5", "5 KE\u00c7\u0130D - SOLDAN: 1-5", "5 PASILLOS - DESDE LA IZQUIERDA: 1-5", "5 DAANAN - MULA KALIWA: 1-5", "5 LORONG - DARI KIRI: 1-5", "5 \u092c\u093e\u091f\u094b - \u092c\u093e\u092f\u093e\u0901\u092c\u093e\u091f: 1-5"),
      choose: tx("WYBIERZ PRZEJ\u015aCIE 1-5", "CHOOSE PASSAGE 1-5", "\u041e\u0411\u0415\u0420\u0406\u0422\u042c \u041f\u0420\u041e\u0425\u0406\u0414 1-5", "\u0412\u042b\u0411\u0415\u0420\u0418 \u041f\u0420\u041e\u0425\u041e\0414 1-5", "1-5 KE\u00c7\u0130D\u0414\u0415\u041d BIRINI SE\u00c7", "ELIGE EL PASILLO 1-5", "PILIIN ANG DAANAN 1-5", "PILIH LORONG 1-5", "1-5 \u092c\u093e\u091f\u094b \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d"),
      leftRow: tx("LEWY RZ\u0104D", "LEFT ROW", "\u041b\u0406\u0412\u0418\u0419 \u0420\u042f\u0414", "\u041b\u0415\u0412\u042b\u0419 \u0420\u042f\u0414", "SOL SIRA", "FILA IZQUIERDA", "KALIWANG HANAY", "BARIS KIRI", "\u092c\u093e\u092f\u093e\u0901 \u0932\u093e\u0907\u0928"),
      rightRow: tx("PRAWY RZ\u0104D", "RIGHT ROW", "\u041f\u0420\u0410\u0412\u0418\u0419 \u0420\u042f\u0414", "\u041f\u0420\u0410\u0412\u042b\u0419 \u0420\u042f\u0414", "SA\u011e SIRA", "FILA DERECHA", "KANANG HANAY", "BARIS KANAN", "\u0926\u093e\u092f\u093e\u0901 \u0932\u093e\u0907\u0928"),
      passage: tx("PRZEJ\u015aCIE", "PASSAGE", "\u041f\u0420\u041e\u0425\u0406\u0414", "\u041f\u0420\u041e\u0425\u041e\0414", "KE\u00c7\u0130D", "PASILLO", "DAANAN", "LORONG", "\u092c\u093e\u091f\u094b"),
      depth: tx("IDZIESZ W G\u0141\u0104B", "WALK DEEPER INTO THE PASSAGE", "\u0406\u0414\u0415\u0428 \u0423\u0413\u041b\u0418\u0411 \u041f\u0420\u041e\0425\u041e\0414\u0423", "\u0418\u0414\u0418 \u0412\u0413\u041b\u0423\u0411\042c \u041f\u0420\u041e\0425\u041e\0414\0410", "KE\u00c7\u0130D\u0130N \u0130\u00c7\u0130N\u018f GET", "CAMINA HACIA DENTRO", "PUMASOK SA DAANAN", "KE DALAM LORONG", "\u092c\u093e\u091f\u094b\u092d\u093f\u0924\u094d\u0930 \u091c\u093e\u0928\u0941\u0939\u094b\u0938\u094d"),
      floor: tx("NUMERY PRZ\u0118SE\u0141 NA POD\u0141ODZE", "SECTION NUMBERS ON THE FLOOR", "\u041d\u041e\u041c\u0415\u0420\u0418 \u041f\u0420\u041e\u041b\u0415\u0422\u0406\u0412 \u041d\u0410 \u041f\u0406\u0414\u041b\u041e\u0417\u0406", "\u041d\u041e\u041c\u0415\u0420\u0410 \u041f\u0420\u041e\u041b\u0415\u0422\u041e\u0412 \u041d\u0410 \u041f\u041e\u041b\u0423", "D\u00d6\u015e\u018fM\u018fD\u018f B\u00d6LM\u018f N\u00d6MR\u018fL\u018fR\u0130", "N\u00daMEROS EN EL SUELO", "NUMERO SA SAHIG", "NOMOR DI LANTAI", "\u092d\u0941\u0915\u094d\u092f\u092e\u093e \u0928\u092e\u094d\u092c\u0930"),
      selected: tx("WYBRANE PRZEJ\u015aCIE", "SELECTED PASSAGE", "\u041e\u0431\u0440\u0430\u043d\u0438\u0439 \u043f\u0440\u043e\u0445\u0456\u0434", "\u0412\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u0445\u043e\0434", "SE\u00c7\u0130LM\u0130\u015e KE\u00c7\u0130D", "PASILLO ELEGIDO", "NAPILING DAANAN", "LORONG DIPILIH", "\u091b\u093e\u0928\u093f\u090f\u0915\u094b \u092c\u093e\u091f\u094b")
    };
    // Keep the technical words natural in every language used by the workers.
    Object.assign(diagram, {
      passages: tx("5 PRZEJŚĆ - OD LEWEJ: 1-5", "5 PASSAGES - FROM LEFT: 1-5", "5 ПРОХОДІВ - ЗЛІВА: 1-5", "5 ПРОХОДОВ - СЛЕВА: 1-5", "5 KEÇİD - SOLDAN: 1-5", "5 PASILLOS - DESDE LA IZQUIERDA: 1-5", "5 DAANAN - MULA KALIWA: 1-5", "5 LORONG - DARI KIRI: 1-5", "5 बाटो - बायाँबाट: 1-5"),
      choose: tx("WYBIERZ PRZEJŚCIE 1-5", "CHOOSE PASSAGE 1-5", "ОБЕРІТЬ ПРОХІД 1-5", "ВЫБЕРИ ПРОХОД 1-5", "1-5 KEÇİDDƏN BİRİNİ SEÇ", "ELIGE EL PASILLO 1-5", "PILIIN ANG DAANAN 1-5", "PILIH LORONG 1-5", "1-5 बाटो छान्नुहोस्"),
      passage: tx("PRZEJŚCIE", "PASSAGE", "ПРОХІД", "ПРОХОД", "KEÇİD", "PASILLO", "DAANAN", "LORONG", "बाटो"),
      depth: tx("IDZIESZ W GŁĄB", "WALK DEEPER INTO THE PASSAGE", "ІДЕШ УГЛИБ ПРОХОДУ", "ИДИ ВГЛУБЬ ПРОХОДА", "KEÇİDİN İÇİNƏ GET", "CAMINA HACIA DENTRO", "PUMASOK SA DAANAN", "KE DALAM LORONG", "बाटोभित्र जानुहोस्"),
      floor: tx("NUMERY PRZĘSEŁ NA PODŁODZE", "SECTION NUMBERS ON THE FLOOR", "НОМЕРИ ПРОЛЬОТІВ НА ПІДЛОЗІ", "НОМЕРА ПРОЛЕТОВ НА ПОЛУ", "DÖŞƏMƏDƏ BÖLMƏ NÖMRƏLƏRİ", "NÚMEROS EN EL SUELO", "NUMERO SA SAHIG", "NOMOR DI LANTAI", "भुइँमा नम्बर"),
      selected: tx("WYBRANE PRZEJŚCIE", "SELECTED PASSAGE", "ОБРАНИЙ ПРОХІД", "ВЫБРАННЫЙ ПРОХОД", "SEÇİLMİŞ KEÇİD", "PASILLO ELEGIDO", "NAPILING DAANAN", "LORONG DIPILIH", "छानिएको बाटो")
    });
    const overviewCells = Array.from({ length: 12 }, (_, i) => {
      const label = i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : i === 11 ? "37-39" : "";
      return `<span class="nave-cell">${label}</span>`;
    }).join("");

    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <section class="steps greenhouse-steps">
          <div class="orientation-legend">
            <strong>${esc(text(tx("Legenda kolorów", "Color legend", "Легенда кольорів", "Легенда цветов", "Rəng izahı", "Leyenda de colores", "Legend ng kulay", "Legenda warna", "रङको अर्थ")))}</strong>
            <span class="legend-road">${esc(text(tx("droga / przejście", "road / passage", "дорога / прохід", "дорога / проход", "yol / keçid", "camino / pasillo", "daan / daanan", "jalan / lorong", "बाटो")))}</span>
            <span class="legend-work">${esc(text(tx("strona pracy", "work side", "сторона роботи", "сторона работы", "iş tərəfi", "lado de trabajo", "bahagi ng trabaho", "sisi kerja", "काम गर्ने भाग")))}</span>
            <span class="legend-you">${esc(text(tx("ty stoisz tutaj", "you stand here", "ви стоїте тут", "вы стоите здесь", "siz burada dayanırsınız", "estás aquí", "dito ka nakatayo", "Anda berdiri di sini", "तपाईं यहाँ हुनुहुन्छ")))}</span>
            <span class="legend-look">${esc(text(tx("kierunek patrzenia", "looking direction", "напрямок погляду", "направление взгляда", "baxış istiqaməti", "dirección de la vista", "direksyon ng tingin", "arah melihat", "हेर्ने दिशा")))}</span>
          </div>
          <article class="step-card">
            <span class="step-number">1</span>
            <div>
              <h3>${esc(text(tx("Cała szklarnia z góry", "Whole greenhouse from above", "Вся теплиця зверху", "Вся теплица сверху", "Bütün istixana yuxarıdan", "Todo el invernadero desde arriba", "Buong bahay-taniman mula sa taas", "Seluruh rumah kaca dari atas", "पूरै ग्रीनहाउस माथिबाट")))}</h3>
              <p>${esc(text(tx("Stoisz plecami do pierwszych naw. Po środku jest droga. Po jednej stronie jest lewa część, po drugiej prawa część. Liczba naw może być różna: 37, 38 albo 39.", "Stand with your back to the first naves. The road is in the middle. One side is left, the other is right. The number of naves may be 37, 38 or 39.", "Станьте спиною до перших нав. Посередині дорога. З одного боку ліва частина, з іншого права. Нав може бути 37, 38 або 39.", "Встаньте спиной к первым навам. Посередине дорога. С одной стороны левая часть, с другой правая. Нав может быть 37, 38 или 39.", "İlk navalara arxanızla dayanın. Ortada yol var. Bir tərəf sol, o biri sağdır. Nava sayı 37, 38 və ya 39 ola bilər.", "Ponte de espaldas a las primeras naves. En el medio está el camino. Un lado es izquierdo y otro derecho. Puede haber 37, 38 o 39 naves.", "Tumayo na nakatalikod sa unang mga nawa. Nasa gitna ang daan. Isang bahagi ay kaliwa, isa ay kanan. Puwedeng 37, 38 o 39 nawa.", "Berdiri membelakangi nave pertama. Jalan ada di tengah. Satu sisi kiri, satu sisi kanan. Jumlah nave bisa 37, 38 atau 39.", "पहिलो नावातिर ढाड फर्काएर उभिनुहोस्। बीचमा बाटो छ। एक भाग बायाँ, अर्को दायाँ। नावा ३७, ३८ वा ३९ हुन सक्छ।")))}</p>
              <div class="schema">
                <div class="greenhouse-map greenhouse-3d-overview" aria-label="greenhouse schema">
                  <div class="orientation-badge overview-back">${esc(text(diagram.back))}</div>
                  <div class="orientation-badge overview-left">${esc(text(diagram.left))}</div>
                  <div class="orientation-badge overview-right">${esc(text(diagram.right))}</div>
                  <div class="orientation-badge overview-look">${esc(text(diagram.look))}</div>
                  <div class="orientation-badge overview-stand">${esc(text(diagram.stand))}</div>
                  <div class="green-side">${overviewCells}</div>
                  <div class="center-road">${esc(text(diagram.road))}</div>
                  <div class="green-side">${overviewCells}</div>
                </div>
              </div>
              <div class="btn-row">${action("assets/orientation/sklarnia-etap-excel.png", ui("showFullImage"), "secondary")}</div>
            </div>
          </article>
          <article class="step-card">
            <span class="step-number">2</span>
            <div>
              <h3>${esc(text(tx("Jedna nawa", "One nave", "Одна нава", "Одна нава", "Bir nava", "Una nave", "Isang nave", "Satu nave", "एउटा नावा")))}</h3>
              <p>${esc(text(tx("Patrzysz na jedną nawę od wejścia. W tym kroku nie liczysz rzędów. Widzisz tylko 5 przejść obok siebie. Pierwsze przejście zaczyna się z lewej strony.", "You look at one nave from the entrance. In this step you do not count rows. You only see 5 passages next to each other. The first passage starts on the left.", "Ви дивитесь на одну наву від входу. На цьому кроці не рахуйте ряди. Ви бачите тільки 5 проходів поруч. Перший прохід починається зліва.", "Вы смотрите на одну наву со входа. На этом шаге не считайте ряды. Вы видите только 5 проходов рядом. Первый проход начинается слева.", "Bir navaya giriş tərəfdən baxırsınız. Bu addımda sıraları saymayın. Yalnız yanaşı 5 keçidi görürsünüz. Birinci keçid soldan başlayır.", "Miras una nave desde la entrada. En este paso no cuentas las filas. Solo ves 5 pasillos juntos. El primer pasillo empieza a la izquierda.", "Tinitingnan mo ang isang nave mula sa pasukan. Sa hakbang na ito huwag bilangin ang mga hanay. Nakikita mo lang ang 5 daanan na magkakatabi. Ang unang daanan ay nagsisimula sa kaliwa.", "Anda melihat satu nave dari pintu masuk. Pada langkah ini jangan menghitung baris. Anda hanya melihat 5 lorong berdampingan. Lorong pertama mulai dari kiri.", "तपाईं प्रवेशबाट एउटा नावा हेर्दै हुनुहुन्छ। यो चरणमा लाइन नगन्नुहोस्। तपाईंले सँगसँगै ५ वटा बाटो मात्र देख्नुहुन्छ। पहिलो बाटो बायाँबाट सुरु हुन्छ।")))}</p>
              <div class="schema">
                <div class="nave-diagram nave-3d-view">
                  <div class="orientation-badge nave-entrances">${esc(text(diagram.passages))}</div>
                  <div class="orientation-badge nave-rows">${esc(text(diagram.choose))}</div>
                  <div class="orientation-badge nave-stand">${esc(text(diagram.stand))}</div>
                  ${Array.from({ length: 5 }, (_, i) => {
                    const passageNumber = i + 1;
                    return `<div class="entry nave-entry">
                      <button class="nave-pick-btn" type="button" data-nave-passage="${passageNumber}" aria-label="${esc(text(diagram.passage))} ${passageNumber}"><span class="nave-number">${passageNumber}</span><span class="nave-button-label">${esc(text(diagram.passage))}</span></button>
                      <div class="entry-rows entry-two-rows">
                        <div class="nave-side nave-side-left"><small>${esc(text(diagram.leftRow))}</small></div>
                        <div class="entry-corridor"><small>${esc(text(diagram.passage))}</small></div>
                        <div class="nave-side nave-side-right"><small>${esc(text(diagram.rightRow))}</small></div>
                      </div>
                    </div>`;
                  }).join("")}
                </div>
              </div>
              <div class="nave-guide-panel" data-nave-guide data-default-title="${esc(text(orient.rows))}" data-default-message="${esc(text(orient.choose))}" data-selected-title="${esc(text(orient.selected))}" data-selected-message="${esc(text(orient.selectedMessage))}">
                <span>${esc(text(orient.nextStep))}</span>
                <strong data-nave-guide-title>${esc(text(orient.rows))}</strong>
                <p data-nave-guide-message>${esc(text(orient.choose))}</p>
              </div>
            </div>
          </article>
          <article class="step-card">
            <span class="step-number">3</span>
            <div>
              <h3>${esc(text(tx("Wejście do rzędu", "Entry into the row", "Вхід у ряд", "Вход в ряд", "Sıraya giriş", "Entrada a la fila", "Pagpasok sa hanay", "Masuk ke baris", "पङ्क्तिमा प्रवेश")))}</h3>
              <p>${esc(text(tx("Patrzysz w przejście. Po lewej jest lewa strona, czyli lewy rząd. Po prawej jest prawa strona, czyli prawy rząd. Praca odbywa się w rzędzie, a nie 'obok rzędu'.", "You look into the passage. On the left is the left side, the left row. On the right is the right side, the right row. Work is in the row, not next to the row.", "Ви дивитесь у прохід. Зліва є ліва сторона, тобто лівий ряд. Справа є права сторона, тобто правий ряд. Робота відбувається в ряду, не біля ряду.", "Вы смотрите в проход. Слева левая сторона, то есть левый ряд. Справа правая сторона, то есть правый ряд. Работа в ряду, не возле ряда.", "Keçidə baxırsınız. Solda sol tərəf, yəni sol sıra var. Sağda sağ tərəf, yəni sağ sıra var. İş sıranın içindədir, sıranın yanında deyil.", "Miras al pasillo. A la izquierda está el lado izquierdo, es decir la fila izquierda. A la derecha está el lado derecho, es decir la fila derecha. Se trabaja dentro de la fila, no al lado.", "Tumingin sa daanan. Sa kaliwa ang kaliwang bahagi, ibig sabihin kaliwang hanay. Sa kanan ang kanang bahagi, ibig sabihin kanang hanay. Ang trabaho ay nasa hanay, hindi sa tabi.", "Lihat ke lorong. Di kiri ada sisi kiri, yaitu baris kiri. Di kanan ada sisi kanan, yaitu baris kanan. Kerja di dalam baris, bukan di samping.", "पासेजतिर हेर्नुहोस्। बायाँतिर बायाँ भाग, अर्थात् बायाँ लाइन हुन्छ। दायाँतिर दायाँ भाग, अर्थात् दायाँ लाइन हुन्छ। काम लाइनभित्र हुन्छ, लाइनको छेउमा होइन।")))}</p>
              <div class="schema">
                <div class="passage-diagram passage-3d-view">
                  <div class="orientation-badge passage-depth">${esc(text(diagram.depth))}</div>
                  <div class="orientation-badge passage-floor">${esc(text(diagram.floor))}</div>
                  <div class="orientation-badge passage-stand">${esc(text(diagram.stand))}</div>
                  <div class="orientation-badge passage-selected" data-passage-current data-default-label="${esc(text(diagram.choose))}" data-label="${esc(text(diagram.selected))}">${esc(text(diagram.choose))}</div>
                  <div class="row-side">${esc(text(diagram.leftRow))}</div>
                  <div class="work-passage">
                    <span class="passage-label">${esc(text(diagram.passage))}</span>
                    <div class="floor-number-strip in-passage" aria-label="${esc(text(diagram.floor))}">
                      <span>1</span><span>2</span><span>3</span><span>...</span><span>25</span><span>26</span><span>27</span>
                    </div>
                  </div>
                  <div class="row-side">${esc(text(diagram.rightRow))}</div>
                </div>
                <p class="floor-note">${esc(text(tx("Numer przęsła jest oznaczony na podłodze w przejściu. Często numeracja jest od 1 do 27, ale na różnych szklarniach może być inna. Zawsze sprawdzaj numer w tej szklarni.", "The section number is marked on the floor in the passage. Often the numbers go from 1 to 27, but they can be different in different greenhouses. Always check the number in that greenhouse.", "Номер секції позначений на підлозі в проході. Часто нумерація йде від 1 до 27, але в різних теплицях може бути інакше. Завжди перевіряйте номер у цій теплиці.", "Номер секции указан на полу в проходе. Часто нумерация идет от 1 до 27, но в разных теплицах может быть по-разному. Всегда проверяйте номер в этой теплице.", "Bölmənin nömrəsi keçiddə yerdə göstərilir. Çox vaxt nömrələr 1-dən 27-yə qədərdir, amma müxtəlif istixanalarda fərqli ola bilər. Həmişə həmin istixanada nömrəni yoxlayın.", "El número de sección está marcado en el suelo del pasillo. A menudo va del 1 al 27, pero puede ser diferente según el invernadero. Revisa siempre el número en ese invernadero.", "Nakasulat sa sahig ng daanan ang numero ng seksyon. Kadalasan 1 hanggang 27, pero maaaring iba sa bawat bahay-taniman. Palaging tingnan ang numero sa bahay-taniman na iyon.", "Nomor bagian tertulis di lantai lorong. Biasanya dari 1 sampai 27, tetapi bisa berbeda di tiap rumah kaca. Selalu cek nomor di rumah kaca itu.", "सेक्शन नम्बर पासेजको भुइँमा लेखिएको हुन्छ। प्रायः १ देखि २७ सम्म हुन्छ, तर फरक ग्रीनहाउसमा फरक हुन सक्छ। सधैं त्यही ग्रीनहाउसको नम्बर जाँच गर्नुहोस्।")))}</p>
              </div>
            </div>
          </article>
        </section>
        <section class="section greenhouse-work">
          <details class="card greenhouse-work-details">
            <summary>${esc(text(tx("Jak użyć tego w pracy", "How to use this at work", "Як використати це в роботі", "Как использовать это в работе", "Bunu işdə necə istifadə etmək", "Cómo usar esto en el trabajo", "Paano ito gamitin sa trabaho", "Cara memakai ini saat kerja", "काममा यसलाई कसरी प्रयोग गर्ने")))}</summary>
          <section class="green-flow">
            <h3>${esc(text(tx("Szukaj miejsca zawsze w tej kolejności", "Always find the place in this order", "Завжди шукайте місце в такій черзі", "Всегда ищите место в таком порядке", "Yeri həmişə bu ardıcıllıqla tapın", "Busca el lugar siempre en este orden", "Hanapin ang lugar palagi sa ganitong ayos", "Cari tempat selalu dengan urutan ini", "ठाउँ सधैं यही क्रममा खोज्नुहोस्")))}</h3>
            <div class="work-flow">${flowChips}</div>
          </section>
          <section class="module-grid two section">${workCardsHtml}</section>
          </details>
        </section>
        ${tabletLinkCard("yellow")}
      </main>
    `;
    setupGreenhouseStepViewer(document);
    setupGreenhouseNavePicker(document);
    setupGreenhouseFullscreen();
  }

  function setupGreenhouseStepViewer(root = document) {
    const container = root.querySelector(".greenhouse-steps");
    if (!container || container.dataset.stepViewerReady === "1") return;
    const steps = Array.from(container.children).filter((child) => child.classList.contains("step-card"));
    if (steps.length < 2) return;
    container.dataset.stepViewerReady = "1";
    const labels = [
      text(tx("Cała szklarnia", "Whole greenhouse", "Вся теплиця", "Вся теплица", "Bütün istixana", "Todo el invernadero", "Buong greenhouse", "Seluruh rumah kaca", "पूरै ग्रीनहाउस")),
      text(tx("Nawa", "Nave", "Нава", "Нава", "Nava", "Nave", "Nave", "Nave", "नावा")),
      text(tx("Przejście", "Passage", "Прохід", "Проход", "Keçid", "Pasillo", "Daanan", "Lorong", "बाटो"))
    ];
    const tabs = document.createElement("div");
    tabs.className = "greenhouse-step-tabs";
    tabs.setAttribute("aria-label", text(tx("Widoki szklarni", "Greenhouse views", "Види теплиці", "Виды теплицы", "İstixana görünüşləri", "Vistas del invernadero", "Mga view ng greenhouse", "Tampilan rumah kaca", "ग्रीनहाउस दृश्य")));
    tabs.innerHTML = labels.map((label, index) => `
      <button class="greenhouse-step-tab${index === 0 ? " is-active" : ""}" type="button" data-greenhouse-step="${index}" aria-pressed="${index === 0 ? "true" : "false"}">
        <span>${index + 1}</span>${esc(label)}
      </button>
    `).join("");
    const legend = container.querySelector(".orientation-legend");
    container.insertBefore(tabs, legend ? legend.nextSibling : container.firstChild);
    const buttons = Array.from(tabs.querySelectorAll("[data-greenhouse-step]"));
    const showStep = (index) => {
      steps.forEach((step, stepIndex) => {
        const active = stepIndex === index;
        step.classList.toggle("is-active-step", active);
        step.hidden = !active;
      });
      buttons.forEach((button, buttonIndex) => {
        const active = buttonIndex === index;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
    };
    buttons.forEach((button) => {
      button.addEventListener("click", () => showStep(Number(button.dataset.greenhouseStep || 0)));
    });
    showStep(0);
  }

  function setupGreenhousePathBuilder(root = document) {
    const steps = root.querySelector(".greenhouse-steps");
    if (!steps || root.querySelector("[data-orientation-builder]")) return;
    const labels = {
      subtitle: text(tx("Wybieraj po kolei. Na końcu dostaniesz prostą informację, jak powiedzieć gdzie jesteś.", "Choose step by step. At the end you get a simple line showing where you are.", "Обирайте по черзі. В кінці отримаєте просту інформацію, як сказати де ви є.", "Выбирайте по очереди. В конце получите простую строку, как сказать где вы находитесь.", "Ardıcıllıqla seçin. Sonda harada olduğunuzu demək üçün sadə məlumat alacaqsınız.", "Elige paso a paso. Al final tendrás una frase simple para decir dónde estás.", "Pumili nang sunod-sunod. Sa dulo may simpleng linya kung nasaan ka.", "Pilih berurutan. Di akhir Anda mendapat kalimat sederhana untuk mengatakan posisi Anda.", "क्रमसँग छान्नुहोस्। अन्त्यमा आफू कहाँ हुनुहुन्छ भन्ने सरल वाक्य पाउनुहुन्छ।")),
      part: text(tx("Część szklarni", "Greenhouse part", "Частина теплиці", "Часть теплицы", "İstixana hissəsi", "Parte del invernadero", "Bahagi ng greenhouse", "Bagian rumah kaca", "ग्रीनहाउसको भाग")),
      nave: text(tx("Nawa", "Nave", "Нава", "Нава", "Nava", "Nave", "Nave", "Nave", "नावा")),
      passage: text(tx("Przejście", "Passage", "Прохід", "Проход", "Keçid", "Pasillo", "Daanan", "Lorong", "बाटो")),
      row: text(tx("Strona / rząd", "Side / row", "Сторона / ряд", "Сторона / ряд", "Tərəf / sıra", "Lado / fila", "Bahagi / hanay", "Sisi / baris", "भाग / लाइन")),
      section: text(tx("Przęsło", "Section", "Секція", "Секция", "Bölmə", "Sección", "Seksyon", "Bagian", "सेक्शन")),
      choose: text(tx("wybierz", "choose", "оберіть", "выберите", "seçin", "elige", "piliin", "pilih", "छान्नुहोस्")),
      left: text(tx("lewa część", "left part", "ліва частина", "левая часть", "sol hissə", "parte izquierda", "kaliwang bahagi", "bagian kiri", "बायाँ भाग")),
      right: text(tx("prawa część", "right part", "права частина", "правая часть", "sağ hissə", "parte derecha", "kanang bahagi", "bagian kanan", "दायाँ भाग")),
      leftRow: text(tx("lewy rząd", "left row", "лівий ряд", "левый ряд", "sol sıra", "fila izquierda", "kaliwang hanay", "baris kiri", "बायाँ लाइन")),
      rightRow: text(tx("prawy rząd", "right row", "правий ряд", "правый ряд", "sağ sıra", "fila derecha", "kanang hanay", "baris kanan", "दायाँ लाइन")),
      result: text(tx("Twoja informacja", "Your information", "Ваша інформація", "Ваша информация", "Sizin məlumatınız", "Tu información", "Iyong impormasyon", "Informasi Anda", "तपाईंको जानकारी")),
      empty: text(tx("Uzupełnij pola. Potem pokaż to brygadziście albo przeczytaj na głos.", "Fill in the fields. Then show this to the brigadier or read it aloud.", "Заповніть поля. Потім покажіть це бригадиру або прочитайте вголос.", "Заполните поля. Потом покажите это бригадиру или прочитайте вслух.", "Sahələri doldurun. Sonra bunu briqadirə göstərin və ya ucadan oxuyun.", "Rellena los campos. Luego muéstralo al encargado o léelo en voz alta.", "Punan ang mga field. Pagkatapos ipakita sa brigadier o basahin nang malakas.", "Isi kolomnya. Lalu tunjukkan ke mandor atau baca keras.", "फिल्डहरू भर्नुहोस्। त्यसपछि ब्रिगेडियरलाई देखाउनुहोस् वा ठूलो स्वरमा पढ्नुहोस्।")),
      prefix: text(tx("Jestem tutaj:", "I am here:", "Я тут:", "Я здесь:", "Mən buradayam:", "Estoy aquí:", "Nandito ako:", "Saya di sini:", "म यहाँ छु:"))
    };
    const optionNumbers = (count) => Array.from({ length: count }, (_, index) => `<option value="${index + 1}">${index + 1}</option>`).join("");
    const builder = document.createElement("section");
    builder.className = "card orientation-builder";
    builder.dataset.orientationBuilder = "1";
    builder.innerHTML = `
      <div class="orientation-builder-head">
        <span>1-2-3</span>
        <div>
          <p>${esc(labels.subtitle)}</p>
        </div>
      </div>
      <div class="orientation-builder-grid">
        <label>${esc(labels.part)}<select data-orient-field="part"><option value="">${esc(labels.choose)}</option><option value="left">${esc(labels.left)}</option><option value="right">${esc(labels.right)}</option></select></label>
        <label>${esc(labels.nave)}<select data-orient-field="nave"><option value="">${esc(labels.choose)}</option>${optionNumbers(39)}</select></label>
        <label>${esc(labels.passage)}<select data-orient-field="passage"><option value="">${esc(labels.choose)}</option>${optionNumbers(5)}</select></label>
        <label>${esc(labels.row)}<select data-orient-field="row"><option value="">${esc(labels.choose)}</option><option value="left">${esc(labels.leftRow)}</option><option value="right">${esc(labels.rightRow)}</option></select></label>
        <label>${esc(labels.section)}<select data-orient-field="section"><option value="">${esc(labels.choose)}</option>${optionNumbers(27)}</select></label>
      </div>
      <div class="orientation-builder-result" data-orientation-result>
        <span>${esc(labels.result)}</span>
        <strong>${esc(labels.empty)}</strong>
      </div>
    `;
    steps.parentNode.insertBefore(builder, steps);
    const fields = Object.fromEntries(Array.from(builder.querySelectorAll("[data-orient-field]")).map((field) => [field.dataset.orientField, field]));
    const result = builder.querySelector("[data-orientation-result] strong");
    const update = () => {
      const values = {
        part: fields.part?.value === "left" ? labels.left : fields.part?.value === "right" ? labels.right : "",
        nave: fields.nave?.value,
        passage: fields.passage?.value,
        row: fields.row?.value === "left" ? labels.leftRow : fields.row?.value === "right" ? labels.rightRow : "",
        section: fields.section?.value
      };
      const chunks = [];
      if (values.part) chunks.push(values.part);
      if (values.nave) chunks.push(`${labels.nave} ${values.nave}`);
      if (values.passage) chunks.push(`${labels.passage} ${values.passage}`);
      if (values.row) chunks.push(values.row);
      if (values.section) chunks.push(`${labels.section} ${values.section}`);
      result.textContent = chunks.length ? `${labels.prefix} ${chunks.join(" · ")}` : labels.empty;
      if (fields.passage?.value) {
        const button = root.querySelector(`.nave-pick-btn[data-nave-passage="${fields.passage.value}"]`);
        if (button && !button.classList.contains("is-active")) button.click();
      }
    };
    Object.values(fields).forEach((field) => field?.addEventListener("change", update));
  }

  function setupGreenhouseNavePicker(root = document) {
    const routeText = {
      chip: text(tx("schemat pracy", "work schema", "схема роботи", "схема работы", "iş sxemi", "esquema de trabajo", "schema ng trabaho", "skema kerja", "कामको नक्सा")),
      titleDefault: text(tx("Ścieżka orientacji", "Orientation path", "Шлях орієнтації", "Путь ориентации", "Orientasiya yolu", "Ruta de orientación", "Gabay sa direksyon", "Jalur orientasi", "दिशा बुझ्ने क्रम")),
      messageDefault: text(tx("Najpierw wybierz przejście w kroku 2. Potem patrz na ten widok: lewa strona, prawa strona i numer przęsła po środku.", "First choose the passage in step 2. Then use this view: left side, right side and section number in the middle.", "Спочатку виберіть прохід у кроці 2. Потім дивіться на цей вид: ліва сторона, права сторона і номер секції посередині.", "Сначала выберите проход в шаге 2. Потом смотрите на этот вид: левая сторона, правая сторона и номер секции посередине.", "Əvvəl 2-ci addımda keçidi seçin. Sonra bu görünüşə baxın: sol tərəf, sağ tərəf və ortada bölmə nömrəsi.", "Primero elige el pasillo en el paso 2. Luego mira este esquema: lado izquierdo, lado derecho y número de sección en el centro.", "Piliin muna ang daanan sa hakbang 2. Pagkatapos tingnan ang view na ito: kaliwang bahagi, kanang bahagi at numero ng seksyon sa gitna.", "Pilih lorong dulu di langkah 2. Lalu lihat tampilan ini: sisi kiri, sisi kanan dan nomor bagian di tengah.", "पहिले चरण २ मा बाटो छान्नुहोस्। त्यसपछि यो दृश्य हेर्नुहोस्: बायाँ भाग, दायाँ भाग र बीचमा सेक्शन नम्बर.")),
      titleSelected: text(tx("Wybrana ścieżka", "Selected path", "Вибраний шлях", "Выбранный путь", "Seçilmiş yol", "Ruta elegida", "Napiling gabay", "Jalur dipilih", "छानिएको क्रम")),
      messageSelected: text(tx("Idź do wybranego przejścia. W środku sprawdź lewą albo prawą stronę pracy i numer przęsła na podłodze.", "Go to the selected passage. Inside, check the left or right work side and the section number on the floor.", "Ідіть до вибраного проходу. Усередині перевірте ліву або праву сторону роботи та номер секції на підлозі.", "Идите к выбранному проходу. Внутри проверьте левую или правую сторону работы и номер секции на полу.", "Seçilmiş keçidə gedin. İçəridə sol və ya sağ iş tərəfini və yerdəki bölmə nömrəsini yoxlayın.", "Ve al pasillo elegido. Dentro revisa el lado izquierdo o derecho de trabajo y el número de sección en el suelo.", "Pumunta sa napiling daanan. Sa loob, tingnan ang kaliwa o kanang bahagi ng trabaho at ang numero ng seksyon sa sahig.", "Pergi ke lorong yang dipilih. Di dalam, cek sisi kerja kiri atau kanan dan nomor bagian di lantai.", "छानिएको बाटोमा जानुहोस्। भित्र बायाँ वा दायाँ काम गर्ने भाग र भुइँको सेक्शन नम्बर जाँच गर्नुहोस्।"))
    };
    const passageSchema = root.querySelector(".passage-3d-view")?.closest(".schema");
    if (passageSchema && !passageSchema.querySelector("[data-passage-route]")) {
      passageSchema.querySelector(".passage-3d-view")?.insertAdjacentHTML("afterend", `
        <div class="orientation-route" data-passage-route data-selected-title="${esc(routeText.titleSelected)}" data-selected-message="${esc(routeText.messageSelected)}">
          <span>${esc(routeText.chip)}</span>
          <strong data-passage-route-title>${esc(routeText.titleDefault)}</strong>
          <p data-passage-route-message>${esc(routeText.messageDefault)}</p>
        </div>
      `);
    }
    const diagrams = Array.from(root.querySelectorAll(".nave-3d-view"));
    diagrams.forEach((diagram) => {
      if (diagram.dataset.navePickerReady === "1") return;
      diagram.dataset.navePickerReady = "1";
      const card = diagram.closest(".step-card") || root;
      const guide = card.querySelector("[data-nave-guide]");
      const title = guide ? guide.querySelector("[data-nave-guide-title]") : null;
      const message = guide ? guide.querySelector("[data-nave-guide-message]") : null;
      const buttons = Array.from(diagram.querySelectorAll(".nave-pick-btn"));
      const routePanels = Array.from(root.querySelectorAll("[data-passage-route]"));
      const passageBadges = Array.from(root.querySelectorAll("[data-passage-current]"));
      const setActive = (button) => {
        const number = button.dataset.navePassage || button.textContent.trim();
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
          item.closest(".nave-entry")?.classList.toggle("is-active", active);
        });
        if (guide) guide.classList.add("is-active");
        if (title) title.textContent = `${guide?.dataset.selectedTitle || ""} ${number}`.trim();
        if (message) message.textContent = guide?.dataset.selectedMessage || "";
        routePanels.forEach((panel) => {
          panel.classList.add("is-active");
          const routeTitle = panel.querySelector("[data-passage-route-title]");
          const routeMessage = panel.querySelector("[data-passage-route-message]");
          if (routeTitle) routeTitle.textContent = `${panel.dataset.selectedTitle || ""}: ${number}`.trim();
          if (routeMessage) routeMessage.textContent = panel.dataset.selectedMessage || "";
        });
        passageBadges.forEach((badge) => {
          badge.classList.add("is-active");
          badge.textContent = `${badge.dataset.label || ""} ${number}`.trim();
        });
        document.querySelectorAll('[data-orient-field="passage"]').forEach((field) => {
          if (field.value !== number) {
            field.value = number;
            field.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });
      };
      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          setActive(button);
        });
      });
    });
  }

  function setupGreenhouseFullscreen() {
    const steps = Array.from(document.querySelectorAll(".greenhouse-steps .step-card"));
    if (!steps.length) return;
    const labels = {
      open: text(tx("Otwórz na cały ekran", "Open full screen", "Відкрити на весь екран", "Открыть на весь экран", "Tam ekranda aç", "Abrir en pantalla completa", "Buksan sa buong screen", "Buka layar penuh", "पूरा स्क्रिनमा खोल्नुहोस्")),
      close: text(tx("Zamknij", "Close", "Закрити", "Закрыть", "Bağla", "Cerrar", "Isara", "Tutup", "बन्द गर्नुहोस्")),
      hint: text(tx("Dotknij schematu, aby zobaczyć duży widok.", "Tap the diagram to see a large view.", "Натисніть на схему, щоб побачити великий вигляд.", "Нажмите на схему, чтобы увидеть большой вид.", "Böyük görünüş üçün sxemə toxunun.", "Toca el esquema para verlo grande.", "I-tap ang schema para makita nang malaki.", "Ketuk skema untuk melihat tampilan besar.", "ठूलो दृश्य हेर्न योजना छुनुहोस्।"))
    };

    let modal = document.querySelector(".orientation-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "orientation-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="orientation-modal-panel">
          <button class="orientation-modal-close" type="button" aria-label="${esc(labels.close)}">×</button>
          <div class="orientation-modal-content"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const content = modal.querySelector(".orientation-modal-content");
    const closeButton = modal.querySelector(".orientation-modal-close");
    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("orientation-modal-open");
      content.innerHTML = "";
    };
    const openModal = (step) => {
      const copy = step.cloneNode(true);
      copy.querySelectorAll(".orientation-zoom-pill").forEach((item) => item.remove());
      copy.querySelectorAll(".nave-3d-view").forEach((diagram) => {
        delete diagram.dataset.navePickerReady;
      });
      content.innerHTML = "";
      content.appendChild(copy);
      setupGreenhouseNavePicker(content);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("orientation-modal-open");
      try {
        closeButton.focus({ preventScroll: true });
      } catch (error) {
        closeButton.focus();
      }
    };

    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });

    steps.forEach((step) => {
      const schema = step.querySelector(".schema");
      if (!schema || schema.dataset.orientationReady === "1") return;
      schema.dataset.orientationReady = "1";
      schema.setAttribute("role", "button");
      schema.setAttribute("tabindex", "0");
      schema.setAttribute("aria-label", labels.open);
      schema.title = labels.hint;
      const pill = document.createElement("span");
      pill.className = "orientation-zoom-pill";
      pill.textContent = labels.open;
      schema.appendChild(pill);
      schema.addEventListener("click", (event) => {
        if (event.target.closest(".nave-pick-btn")) return;
        openModal(step);
      });
      schema.addEventListener("keydown", (event) => {
        if (event.target.closest(".nave-pick-btn")) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(step);
        }
      });
    });
  }

  function readerTabButton(tab, active) {
    return `<button class="pill${active ? " active" : ""}" type="button" data-reader-tab="${esc(tab.id)}">${esc(text(tab.title))}</button>`;
  }

  function readerStep(item, index) {
    const isStructuredStep = item && typeof item === "object" && ("text" in item || "note" in item || "tone" in item);
    const value = isStructuredStep ? item.text : item;
    const note = isStructuredStep && item.note ? `<small>${esc(text(item.note))}</small>` : "";
    const tone = isStructuredStep && item.tone ? ` ${esc(item.tone)}` : "";
    return `
      <article class="step-card reader-step${tone}">
        <span class="step-number">${index + 1}</span>
        <div><p>${esc(text(value))}</p>${note}</div>
      </article>
    `;
  }

  function readerStepValue(item) {
    return item && typeof item === "object" && ("text" in item || "note" in item || "tone" in item) ? item.text : item;
  }

  function readerStepList(steps) {
    return (steps || []).map((item, index) => readerStep(item, index)).join("");
  }

  function readerSection(section) {
    return `
      <section class="reader-section">
        <h3>${esc(text(section.title))}</h3>
        ${section.lead ? `<p class="reader-section-lead">${esc(text(section.lead))}</p>` : ""}
        <div class="steps">${readerStepList(section.steps)}</div>
      </section>
    `;
  }

  function renderReader(activeId = "start") {
    const active = DATA.readerTabs.find((tab) => tab.id === activeId) || DATA.readerTabs[0];
    const tabs = DATA.readerTabs.map((tab) => readerTabButton(tab, tab.id === active.id)).join("");
    const steps = active.sections
      ? active.sections.map(readerSection).join("")
      : `<div class="steps">${readerStepList(active.steps)}</div>`;
    const tips = (active.tips || []).map((tip) => `<li>${esc(text(tip))}</li>`).join("");
    const imageOverlaySteps = (active.imageSteps || active.steps || []).map(readerStepValue).filter(Boolean);
    const imageBlocks = [
      active.image ? { src: active.image, caption: active.imageCaption } : null,
      ...(active.images || [])
    ].filter(Boolean).map((image) => {
      const overlaySteps = (image.steps || imageOverlaySteps).map(readerStepValue).filter(Boolean);
      const overlay = overlaySteps.length ? `
        <div class="reader-image-translation${overlaySteps.length > 5 ? " compact" : ""}">
          <strong>${esc(text(tx("Tłumaczenie do zdjęcia", "Translation for the image", "Переклад до зображення", "Перевод к изображению", "Şəkil üçün tərcümə", "Traducción de la imagen", "Salin para sa larawan", "Terjemahan untuk gambar", "तस्वीरको अनुवाद")))}</strong>
          <ol>${overlaySteps.map((step) => `<li>${esc(text(step))}</li>`).join("")}</ol>
        </div>
      ` : "";
      return `
      <figure class="media reader-visual">
        <div class="reader-visual-frame">
          <img loading="eager" src="${esc(image.src)}" alt="${esc(text(image.caption))}">
        </div>
        ${overlay}
        <figcaption>${esc(text(image.caption))}</figcaption>
      </figure>
    `;
    }).join("");

    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <section class="card yellow">
          <p><strong>${esc(ui("important"))}:</strong> ${esc(text(DATA.pages.reader.lead))}</p>
        </section>
        <section class="section">
          <div class="pill-row">${tabs}</div>
          <section class="reader-panel">
            <div class="reader-panel-head">
              <span class="icon-box yellow">${iconMap.reader}</span>
              <div>
                <h2>${esc(text(active.title))}</h2>
                ${active.lead ? `<p>${esc(text(active.lead))}</p>` : ""}
              </div>
            </div>
            ${steps}
            ${tips ? `<div class="reader-tips"><strong>${esc(ui("important"))}</strong><ul>${tips}</ul></div>` : ""}
          </section>
          ${imageBlocks ? `<details class="card section media-details"><summary>${esc(text(tx("Zdj\u0119cia i t\u0142umaczenia", "Photos and translations", "\u0424\u043e\u0442\u043e \u0456 \u043f\u0435\u0440\u0435\u043a\u043b\u0430\u0434", "\u0424\u043e\u0442\u043e \u0438 \u043f\u0435\u0440\u0435\u0432\u043e\u0434", "\u015e\u0259kill\u0259r v\u0259 t\u0259rc\u00fcm\u0259l\u0259r", "Fotos y traducciones", "Mga larawan at salin", "Foto dan terjemahan", "\u092b\u094b\u091f\u094b \u0930 \u0905\u0928\u0941\u0935\u093e\u0926")))}</summary><div class="details-body photo-grid">${imageBlocks}</div></details>` : ""}
        </section>
      </main>
    `;

    app.querySelectorAll("[data-reader-tab]").forEach((button) => {
      button.addEventListener("click", () => renderReader(button.dataset.readerTab));
    });
  }

  function renderMedical() {
    const sourceTitle = text(tx("Sprawdzone źródło", "Verified source", "Перевірене джерело", "Проверенный источник", "Yoxlanmış mənbə", "Fuente verificada", "Na-verify na source", "Sumber terverifikasi", "प्रमाणित स्रोत"));
    const reviewDate = DATA.meta?.externalInformationReviewed || "";
    const cards = DATA.medical.map((item) => {
      const notes = item.body.map((note) => `<li>${esc(text(note))}</li>`).join("");
      const maps = (item.maps || []).map((map) => mapActionGroup({ ...item, ...map, title: map.label || item.title, address: map.address || item.address }, ui("openMap") + " - " + map.label, item.tone)).join("");
      const oneMap = item.map ? mapActionGroup(item, ui("openMap"), item.tone) : "";
      const sources = [
        item.sourceUrl ? { url: item.sourceUrl, label: text(item.sourceLabel) || sourceTitle } : null,
        ...(item.maps || []).filter((map) => map.sourceUrl).map((map) => ({ url: map.sourceUrl, label: `${sourceTitle}: ${map.label}` }))
      ].filter(Boolean);
      const sourceLinks = sources.map((source) => `<a class="fact-source-link" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">✓ ${esc(source.label)}</a>`).join("");
      const phones = (item.phones || []).map((phone) => `
        <article class="person">
          <div class="person-name">${esc(phone.label)}</div>
          <div class="btn-row"><a class="btn secondary" href="${esc(telHref(phone.phone))}">${esc(ui("call"))} ${esc(formatPhone(phone.phone))}</a></div>
        </article>
      `).join("");
      return `
        <details class="${cardClass(item.tone)} medical-card medical-accordion">
          <summary>
            <span class="city-card-icon">${iconMap.medical}</span>
            <span>${esc(text(item.title))}</span>
          </summary>
          <div class="details-body medical-body">
            <ul class="list">${notes}</ul>
            ${maps || oneMap ? '<div class="map-action-list">' + oneMap + maps + '</div>' : ""}
            ${phones ? `<div class="section contact-group">${phones}</div>` : ""}
            ${sourceLinks ? `<div class="fact-source-list">${sourceLinks}</div>` : ""}
          </div>
        </details>
      `;
    }).join("");

    const reviewed = text(tx("Informacje zewnętrzne sprawdzono", "External information checked", "Зовнішню інформацію перевірено", "Внешняя информация проверена", "Xarici məlumat yoxlanılıb", "Información externa verificada", "Na-check ang external information", "Informasi eksternal diperiksa", "बाह्य जानकारी जाँच गरिएको"));
    app.innerHTML = `<main class="page">${pageHero()}${reviewDate ? `<p class="fact-review-stamp">✓ ${esc(reviewed)}: ${esc(reviewDate)}</p>` : ""}<div class="module-grid">${cards}</div><section class="card red section"><h2>112</h2><p>${esc(text(tx("Dzwoń pod numer 112 tylko wtedy, gdy potrzebna jest natychmiastowa pomoc służb z powodu zagrożenia życia, zdrowia lub bezpieczeństwa.", "Call 112 only when immediate emergency-service help is needed because life, health or safety is at risk.", "Телефонуйте 112 лише тоді, коли через загрозу життю, здоров’ю чи безпеці потрібна негайна допомога служб.", "Звоните 112 только тогда, когда из-за угрозы жизни, здоровью или безопасности нужна немедленная помощь служб.", "Həyat, sağlamlıq və ya təhlükəsizlik üçün təhlükə səbəbindən təcili xidmətlərin dərhal köməyi lazım olduqda yalnız 112-yə zəng edin.", "Llama al 112 solo cuando sea necesaria la ayuda inmediata de emergencias por riesgo para la vida, la salud o la seguridad.", "Tumawag lamang sa 112 kapag kailangan agad ang emergency services dahil may panganib sa buhay, kalusugan, o kaligtasan.", "Hubungi 112 hanya jika bantuan layanan darurat diperlukan segera karena nyawa, kesehatan, atau keselamatan terancam.", "जीवन, स्वास्थ्य वा सुरक्षामा खतरा भएर तत्काल आपतकालीन सेवा चाहिँदा मात्र 112 मा फोन गर्नुहोस्।")))}</p><div class="btn-row"><a class="btn red" href="tel:112">112</a></div></section></main>`;
    app.querySelectorAll(".medical-accordion").forEach((group) => {
      group.addEventListener("toggle", () => {
        if (!group.open) return;
        app.querySelectorAll(".medical-accordion[open]").forEach((other) => {
          if (other !== group) other.open = false;
        });
      });
    });
  }

  function renderContacts(activeGroup = "coordinators") {
    function personCard(person, groupLabel = "") {
      const role = person.role || groupLabel;
      const message = `${role ? role + " " : ""}${person.name}`;
      return `
        <article class="person">
          <div class="person-head">
            <div>
              <div class="person-name">${esc(person.name)}</div>
              <div class="person-role">${esc(role)}</div>
            </div>
            ${groupLabel && !person.role ? `<span class="mini-tag">${esc(groupLabel)}</span>` : ""}
          </div>
          ${phoneActions(person.phone, `${ui("whatsapp")} ${esc(message)}`)}
        </article>
      `;
    }

    const groups = [
      { id: "coordinators", label: text(tx("Koordynatorzy", "Coordinators", "Координатори", "Координаторы", "Koordinatorlar", "Coordinadores", "Coordinators", "Koordinator", "कोर्डिनेटरहरू")), people: DATA.contacts.coordinators, tag: text(tx("Koordynator", "Coordinator", "Координатор", "Координатор", "Koordinator", "Coordinador", "Coordinator", "Koordinator", "कोर्डिनेटर")) },
      { id: "warehouse", label: text(tx("Magazyn", "Warehouse", "Склад", "Склад", "Anbar", "Almacén", "Warehouse", "Gudang", "गोदाम")), people: DATA.contacts.warehouse, tag: text(tx("Magazyn", "Warehouse", "Склад", "Склад", "Anbar", "Almacén", "Warehouse", "Gudang", "गोदाम")) },
      ...Object.entries(DATA.contacts.greenhouse).map(([stage, people]) => ({ id: stage, label: stage, people, tag: stage }))
    ];

    const current = groups.find((group) => group.id === activeGroup) || groups[0];
    const pills = groups.map((group) => `<button class="pill${group.id === current.id ? " active" : ""}" type="button" data-contact-group="${esc(group.id)}">${esc(group.label)}</button>`).join("");
    const people = current.people.map((person) => personCard(person, current.tag)).join("");

    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <div class="notice yellow contact-freshness"><strong>${esc(text(tx("Sprawdź aktualność", "Check current details", "Перевірте актуальність", "Проверьте актуальность", "Cari məlumatı yoxlayın", "Comprueba los datos actuales", "Tingnan ang kasalukuyang detalye", "Periksa data terbaru", "हालको विवरण जाँच्नुहोस्")))}:</strong> ${esc(text(tx("Kontakty wewnętrzne mogą się zmieniać. Jeśli numer różni się od wiadomości startowej, użyj nowszej wiadomości albo zapytaj koordynatora na miejscu.", "Internal contacts may change. If a number differs from your start message, use the newer message or ask the on-site coordinator.", "Внутрішні контакти можуть змінюватися. Якщо номер відрізняється від стартового повідомлення, використовуйте новіше повідомлення або запитайте координатора на місці.", "Внутренние контакты могут меняться. Если номер отличается от стартового сообщения, используйте более новое сообщение или спросите координатора на месте.", "Daxili əlaqələr dəyişə bilər. Nömrə başlanğıc mesajından fərqlənirsə, daha yeni mesajdan istifadə edin və ya yerində koordinatora müraciət edin.", "Los contactos internos pueden cambiar. Si un número es distinto al mensaje inicial, usa el mensaje más reciente o pregunta al coordinador en el lugar.", "Maaaring magbago ang internal contacts. Kung iba ang numero sa start message, gamitin ang mas bagong mensahe o tanungin ang on-site coordinator.", "Kontak internal dapat berubah. Jika nomor berbeda dari pesan awal, gunakan pesan terbaru atau tanyakan koordinator di lokasi.", "आन्तरिक सम्पर्क बदलिन सक्छ। नम्बर सुरुको सन्देशभन्दा फरक भए नयाँ सन्देश प्रयोग गर्नुहोस् वा स्थलको संयोजकलाई सोध्नुहोस्।")))}</div>
        <section class="section">
          <div class="pill-row">${pills}</div>
          <h2>${esc(current.label)}</h2>
          <div class="contact-group">${people}</div>
        </section>
      </main>
    `;

    app.querySelectorAll("[data-contact-group]").forEach((button) => {
      button.addEventListener("click", () => renderContacts(button.dataset.contactGroup));
    });
  }

  function renderGroups() {
    const cards = DATA.groups.map((item) => `
      <article class="${cardClass(item.tone)}">
        <h2>${esc(text(item.title))}</h2>
        ${item.note ? `<p>${esc(text(item.note))}</p>` : ""}
        <div class="btn-row">
          ${action(item.url, `${ui("open")} ${text(item.title)}`, "blue")}
          ${telegramAppHref(item.url) ? action(telegramAppHref(item.url), text(tx("Otwórz w aplikacji Telegram", "Open in Telegram app", "Відкрити в додатку Telegram", "Открыть в приложении Telegram", "Telegram tətbiqində aç", "Abrir en la app Telegram", "Buksan sa Telegram app", "Buka di aplikasi Telegram", "Telegram एपमा खोल्नुहोस्")), "secondary") : ""}
        </div>
      </article>
    `).join("");
    app.innerHTML = `<main class="page">${pageHero()}<section class="module-grid">${cards}</section></main>`;
  }

  function renderCity() {
    const cityItems = [...DATA.city, ...(DATA.cityExtras || [])];
    const cityLinks = (item) => {
      const links = item.links || (item.url ? [{ url: item.url, label: item.button || DATA.ui.openMap, tone: item.tone }] : []);
      const buttons = links.map((link) => {
        const source = { ...item, ...link, title: link.label || item.title, address: link.address || item.address };
        return mapActionGroup(source, text(link.label), link.tone || item.tone);
      }).join("");
      const phone = item.phone ? '<a class="btn secondary" href="' + esc(telHref(item.phone)) + '">' + esc(ui("call")) + ' ' + esc(formatPhone(item.phone)) + '</a>' : "";
      return buttons || phone ? '<div class="city-links city-links-stack">' + buttons + (phone ? '<div class="btn-row">' + phone + '</div>' : "") + '</div>' : "";
    };
    const cityList = (items) => items && items.length ? `<ul class="list city-rule-list">${items.map((entry) => `<li>${esc(text(entry))}</li>`).join("")}</ul>` : "";
    {
      const cityMain = DATA.city || [];
      const compactCityCategories = [
        {
          tone: "blue",
          icon: "document",
          title: tx("Urząd i dokumenty", "Office and documents", "Установа і документи", "Учреждение и документы", "İdarə və sənədlər", "Oficina y documentos", "Opisina at dokumento", "Kantor dan dokumen", "कार्यालय र कागजात"),
          lead: tx("Karta pobytu, PESEL, urząd i aplikacje urzędowe.", "Residence card, PESEL, office and official apps.", "Карта побиту, PESEL, установа і державні додатки.", "Карта побыту, PESEL, учреждение и официальные приложения.", "Yaşayış kartı, PESEL, idarə və rəsmi tətbiqlər.", "Residencia, PESEL, oficina y apps oficiales.", "Residence card, PESEL, opisina at official apps.", "Kartu tinggal, PESEL, kantor dan aplikasi resmi.", "Residence card, PESEL, कार्यालय र सरकारी एपहरू।"),
          items: [cityMain[0], cityMain[1], cityMain[4]].filter(Boolean)
        },
        {
          tone: "yellow",
          icon: "bank",
          title: tx("Banki i bankomaty", "Banks and ATMs", "Банки і банкомати", "Банки и банкоматы", "Banklar və bankomatlar", "Bancos y cajeros", "Bangko at ATM", "Bank dan ATM", "बैंक र ATM"),
          lead: tx("Mapy do banków i najbliższych bankomatów.", "Maps to banks and nearby ATMs.", "Карти до банків і найближчих банкоматів.", "Карты к банкам и ближайшим банкоматам.", "Banklara və yaxın bankomatlara xəritələr.", "Mapas a bancos y cajeros cercanos.", "Mapa papuntang bangko at malapit na ATM.", "Peta ke bank dan ATM terdekat.", "बैंक र नजिकका ATM का नक्सा।"),
          items: [cityMain[2], cityMain[3]].filter(Boolean)
        },
        {
          tone: "blue",
          icon: "map",
          title: tx("Transport", "Transport", "Транспорт", "Транспорт", "Nəqliyyat", "Transporte", "Transport", "Transportasi", "यातायात"),
          lead: tx("Aplikacje do jazdy po mieście i pociągów.", "Apps for city travel and trains.", "Додатки для міста і поїздів.", "Приложения для города и поездов.", "Şəhər və qatar üçün tətbiqlər.", "Apps para ciudad y trenes.", "Apps para sa city at tren.", "Aplikasi untuk kota dan kereta.", "शहर र रेलका एपहरू।"),
          items: [cityMain[5], cityMain[6]].filter(Boolean)
        }
      ];
      const citySimpleItem = (item) => `
        <div class="city-simple-item">
          <div class="city-simple-text">
            <h3>${esc(text(item.title))}</h3>
            ${item.address ? `<p class="city-meta">${esc(text(item.address))}</p>` : ""}
            <p>${esc(text(item.note))}</p>
            ${cityList(item.list)}
          </div>
          ${cityLinks(item)}
        </div>
      `;
      const citySimpleGroups = compactCityCategories.map((category) => `
        <details class="${cardClass(category.tone)} city-simple-group">
          <summary>
            <span class="city-card-icon">${iconMap[category.icon] || iconMap.city}</span>
            <span>${esc(text(category.title))}</span>
          </summary>
          <div class="city-simple-body">
            <p class="city-simple-lead">${esc(text(category.lead))}</p>
            ${category.items.map(citySimpleItem).join("")}
          </div>
        </details>
      `).join("");
      app.innerHTML = `
        <main class="page city-page-simple">
          ${pageHero()}
          <section class="city-simple-list">${citySimpleGroups}</section>
        </main>
      `;
      app.querySelectorAll(".city-simple-group").forEach((group) => {
        group.addEventListener("toggle", () => {
          if (!group.open) return;
          app.querySelectorAll(".city-simple-group[open]").forEach((other) => {
            if (other !== group) other.open = false;
          });
        });
      });
      return;
    }
  }

  function renderGlossary() {
    const groups = DATA.glossaryGroups || [];
    const entries = DATA.glossary || [];
    const labels = {
      search: tx("Szukaj słowa, np. reader, rząd, przerwa...", "Search a word, e.g. reader, row, break...", "Шукайте слово, напр. reader, ряд, перерва...", "Ищите слово, напр. reader, ряд, перерыв...", "Söz axtarın, məsələn reader, sıra, fasilə...", "Busca una palabra, por ejemplo reader, fila, pausa...", "Maghanap ng salita, hal. reader, row, break...", "Cari kata, mis. reader, baris, istirahat...", "शब्द खोज्नुहोस्, जस्तै reader, लाइन, ब्रेक..."),
      count: tx("haseł", "terms", "слів", "слов", "söz", "términos", "salita", "istilah", "शब्द"),
      empty: tx("Nie znaleziono hasła. Spróbuj krócej, np. tag albo przerwa.", "No term found. Try shorter, e.g. tag or break.", "Не знайдено. Спробуйте коротше, напр. tag або перерва.", "Не найдено. Попробуйте короче, напр. tag или перерыв.", "Tapılmadı. Daha qısa yazın, məsələn tag və ya fasilə.", "No encontrado. Prueba más corto, por ejemplo tag o pausa.", "Walang nahanap. Subukan mas maikli, hal. tag o break.", "Tidak ditemukan. Coba lebih pendek, mis. tag atau istirahat.", "भेटिएन। छोटो लेख्नुहोस्, जस्तै tag वा break।"),
      tipTitle: tx("Jak korzystać", "How to use", "Як користуватись", "Как пользоваться", "Necə istifadə etmək", "Cómo usarlo", "Paano gamitin", "Cara memakai", "कसरी प्रयोग गर्ने"),
      tip: tx("Gdy ktoś powie polskie słowo, wpisz je w wyszukiwarkę albo znajdź w grupie. Czytaj tylko krótkie znaczenie i przykład.", "When someone says a Polish word, type it in search or find it in a group. Read only the short meaning and example.", "Коли хтось скаже польське слово, впишіть його в пошук або знайдіть у групі. Читайте коротке значення і приклад.", "Когда кто-то скажет польское слово, введите его в поиск или найдите в группе. Читайте короткое значение и пример.", "Kimsə polyak sözü deyəndə onu axtarışa yazın və ya qrupda tapın. Qısa mənanı və nümunəni oxuyun.", "Cuando alguien diga una palabra polaca, escríbela en búsqueda o búscala en el grupo. Lee el significado corto y el ejemplo.", "Kapag may nagsabi ng Polish na salita, i-type sa search o hanapin sa grupo. Basahin ang maikling kahulugan at halimbawa.", "Saat ada kata Polandia, ketik di pencarian atau cari di grup. Baca arti pendek dan contoh.", "कसैले पोलिस शब्द भने खोजीमा लेख्नुहोस् वा समूहमा खोज्नुहोस्। छोटो अर्थ र उदाहरण मात्र पढ्नुहोस्।")
    };
    const entryCard = (item) => {
      const searchable = [
        item.term,
        text(item.local),
        text(item.meaning),
        text(item.example)
      ].join(" ").toLowerCase();
      return `
      <article class="glossary-card" data-glossary-card data-search="${esc(searchable)}">
        <div class="glossary-term-row">
          <span class="glossary-term">${esc(item.term)}</span>
          <span class="glossary-local">${esc(text(item.local))}</span>
        </div>
        <p>${esc(text(item.meaning))}</p>
        <div class="glossary-example">${esc(text(item.example))}</div>
      </article>
    `;
    };
    const groupHtml = groups.map((group, index) => {
      const groupEntries = entries.filter((item) => item.group === group.id);
      const cards = groupEntries.map(entryCard).join("");
      if (!cards) return "";
      return `
        <details class="${cardClass(group.tone)} glossary-group" data-glossary-group data-first="${index === 0 ? "true" : "false"}"${index === 0 ? " open" : ""}>
          <summary class="glossary-summary">
            <span class="city-card-icon">${iconMap.document}</span>
            <h2>${esc(text(group.title))}</h2>
            <span class="speech-count">${groupEntries.length}</span>
          </summary>
          <div class="glossary-list">${cards}</div>
        </details>
      `;
    }).join("");

    app.innerHTML = `
      <main class="page glossary-page">
        ${pageHero()}
        <section class="card blue glossary-help">
          <div>
            <h2>${esc(text(labels.tipTitle))}</h2>
            <p>${esc(text(labels.tip))}</p>
          </div>
          <strong class="glossary-count">${entries.length} ${esc(text(labels.count))}</strong>
        </section>
        <section class="glossary-search-box">
          <input class="glossary-search" type="search" inputmode="search" autocomplete="off" placeholder="${esc(text(labels.search))}" aria-label="${esc(text(labels.search))}" data-glossary-search>
          <div class="glossary-empty is-hidden" data-glossary-empty>${esc(text(labels.empty))}</div>
        </section>
        <section class="stack section">${groupHtml}</section>
      </main>
    `;
    const search = app.querySelector("[data-glossary-search]");
    const cards = Array.from(app.querySelectorAll("[data-glossary-card]"));
    const groupNodes = Array.from(app.querySelectorAll("[data-glossary-group]"));
    const empty = app.querySelector("[data-glossary-empty]");
    if (search) {
      search.addEventListener("input", () => {
        const query = search.value.trim().toLowerCase();
        let visible = 0;
        cards.forEach((card) => {
          const show = !query || (card.dataset.search || "").includes(query);
          card.classList.toggle("is-hidden", !show);
          if (show) visible += 1;
        });
        groupNodes.forEach((group) => {
          const hasVisibleCard = !!group.querySelector("[data-glossary-card]:not(.is-hidden)");
          group.classList.toggle("is-hidden", !hasVisibleCard);
          if (query && hasVisibleCard) {
            group.open = true;
          } else if (!query) {
            group.open = group.dataset.first === "true";
          }
        });
        if (empty) empty.classList.toggle("is-hidden", visible !== 0);
      });
    }
  }

  function renderSpeech() {
    const groups = DATA.speechGroups || [];
    const phrases = DATA.speechPhrases || [];
    const labels = {
      how: tx("Jak to działa", "How it works", "Як це працює", "Как это работает", "Bu necə işləyir", "Cómo funciona", "Paano ito gumagana", "Cara kerjanya", "यसले कसरी काम गर्छ"),
      howText: tx("Wybierz zdanie w swoim języku. Telefon powie je po polsku. Możesz też pokazać polskie zdanie brygadziście.", "Choose a sentence in your language. The phone will say it in Polish. You can also show the Polish sentence to the brigadier.", "Оберіть речення своєю мовою. Телефон скаже його польською. Також можна показати польське речення бригадиру.", "Выберите фразу на своём языке. Телефон скажет её по-польски. Можно также показать польскую фразу бригадиру.", "Cümləni öz dilinizdə seçin. Telefon onu polyakca deyəcək. Polyak cümləni briqadirə də göstərə bilərsiniz.", "Elige una frase en tu idioma. El teléfono la dirá en polaco. También puedes mostrar la frase polaca al encargado.", "Pumili ng pangungusap sa iyong wika. Sasabihin ito ng telepono sa Polish. Maaari mo ring ipakita ang Polish na pangungusap sa brigadier.", "Pilih kalimat dalam bahasa Anda. Telepon akan mengucapkannya dalam bahasa Polandia. Anda juga bisa menunjukkan kalimat Polandia kepada mandor.", "आफ्नो भाषामा वाक्य छान्नुहोस्। फोनले पोलिसमा बोल्छ। पोलिस वाक्य ब्रिगेडियरलाई देखाउन पनि सक्नुहुन्छ।"),
      search: tx("Szukaj...", "Search...", "Пошук...", "Поиск...", "Axtar...", "Buscar...", "Hanapin...", "Cari...", "खोज्नुहोस्..."),
      polish: tx("Telefon powie po polsku:", "The phone will say in Polish:", "Телефон скаже польською:", "Телефон скажет по-польски:", "Telefon polyakca deyəcək:", "El teléfono dirá en polaco:", "Sasabihin ng telepono sa Polish:", "Telepon akan mengatakan dalam bahasa Polandia:", "फोनले पोलिसमा भन्छ:"),
      speak: tx("Powiedz po polsku", "Say in Polish", "Сказати польською", "Сказать по-польски", "Polyakca de", "Decir en polaco", "Sabihin sa Polish", "Ucapkan Polandia", "पोलिसमा बोल्नुहोस्"),
      copy: tx("Kopiuj", "Copy", "Копіювати", "Копировать", "Kopyala", "Copiar", "Kopyahin", "Salin", "कपी गर्नुहोस्"),
      copied: tx("Skopiowano polskie zdanie.", "Polish sentence copied.", "Польське речення скопійовано.", "Польская фраза скопирована.", "Polyak cümlə kopyalandı.", "Frase polaca copiada.", "Nakopya ang Polish na pangungusap.", "Kalimat Polandia disalin.", "पोलिस वाक्य कपी भयो।"),
      speaking: tx("Telefon mówi po polsku:", "Phone is speaking in Polish:", "Телефон говорить польською:", "Телефон говорит по-польски:", "Telefon polyakca danışır:", "El teléfono habla en polaco:", "Nagsasalita ang telepono sa Polish:", "Telepon berbicara dalam bahasa Polandia:", "फोन पोलिसमा बोल्दैछ:"),
      noVoice: tx("Ten telefon nie pozwolił uruchomić głosu. Pokaż albo skopiuj polskie zdanie.", "This phone did not allow voice. Show or copy the Polish sentence.", "Цей телефон не дозволив увімкнути голос. Покажіть або скопіюйте польське речення.", "Этот телефон не разрешил включить голос. Покажите или скопируйте польскую фразу.", "Bu telefon səsi işə salmağa icazə vermədi. Polyak cümləni göstərin və ya kopyalayın.", "Este teléfono no permitió activar la voz. Muestra o copia la frase polaca.", "Hindi pinayagan ng telepono ang boses. Ipakita o kopyahin ang Polish na pangungusap.", "Telepon ini tidak mengizinkan suara. Tunjukkan atau salin kalimat Polandia.", "यो फोनले आवाज चलाउन दिएन। पोलिस वाक्य देखाउनुहोस् वा कपी गर्नुहोस्।"),
      empty: tx("Nie znaleziono takiego zdania.", "No sentence found.", "Такого речення не знайдено.", "Такая фраза не найдена.", "Belə cümlə tapılmadı.", "No se encontró esa frase.", "Walang nahanap na pangungusap.", "Kalimat tidak ditemukan.", "यस्तो वाक्य भेटिएन।")
    };
    const phraseCard = (item) => {
      const nativeText = text(item.label);
      const polishText = item.say || "";
      const searchable = `${polishText} ${nativeText}`.toLowerCase();
      return `
        <article class="speech-card" data-speech-card data-key="${esc(searchable)}">
          <div class="speech-card-main">
            <p class="speech-native">${esc(nativeText)}</p>
            <p class="speech-polish-label">${esc(text(labels.polish))}</p>
            <p class="speech-polish">${esc(polishText)}</p>
          </div>
          <div class="speech-actions">
            <button type="button" class="btn speech-play" data-speech="${esc(polishText)}">${iconMap.speech}${esc(text(labels.speak))}</button>
            <button type="button" class="btn secondary speech-copy" data-copy="${esc(polishText)}">${esc(text(labels.copy))}</button>
          </div>
        </article>
      `;
    };
    const groupHtml = groups.map((group, index) => {
      const groupPhrases = phrases.filter((item) => item.group === group.id);
      if (!groupPhrases.length) return "";
      return `
        <details class="${cardClass(group.tone)} speech-group"${index === 0 ? " open" : ""} data-speech-group data-group-id="${esc(group.id)}">
          <summary>
            <span class="city-card-icon">${iconMap[group.icon] || iconMap.speech}</span>
            <span>${esc(text(group.title))}</span>
            <span class="speech-count">${groupPhrases.length}</span>
          </summary>
          <div class="speech-list" data-speech-list></div>
        </details>
      `;
    }).join("");

    app.innerHTML = `
      <main class="page speech-page">
        ${pageHero()}
        <section class="card blue speech-intro">
          <h2>${esc(text(labels.how))}</h2>
          <p>${esc(text(labels.howText))}</p>
          <label class="speech-search-label" for="speechSearch">${esc(text(labels.search))}</label>
          <input id="speechSearch" class="speech-search" type="search" aria-label="${esc(text(labels.search))}" autocomplete="off">
          <p id="speechStatus" class="speech-status" aria-live="polite"></p>
        </section>
        <section class="speech-groups">${groupHtml}</section>
        <p class="speech-empty" hidden>${esc(text(labels.empty))}</p>
      </main>
    `;

    const status = app.querySelector("#speechStatus");
    const setStatus = (value) => {
      if (status) status.textContent = value;
    };
    const renderSpeechGroup = (group) => {
      if (!group || group.dataset.rendered === "true") return;
      const list = group.querySelector("[data-speech-list]");
      if (!list) return;
      const groupPhrases = phrases.filter((item) => item.group === group.dataset.groupId);
      list.innerHTML = groupPhrases.map(phraseCard).join("");
      group.dataset.rendered = "true";
    };
    const speakPolish = (value) => {
      if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
        setStatus(`${text(labels.noVoice)} ${value}`);
        return;
      }
      waitForSpeechVoice("pl-PL", (polishVoice) => {
        const utterance = new SpeechSynthesisUtterance(speechReady(value, "pl"));
        utterance.lang = "pl-PL";
        utterance.rate = voiceProfiles.pl.rate;
        utterance.pitch = voiceProfiles.pl.pitch;
        if (polishVoice) utterance.voice = polishVoice;
        utterance.onstart = () => setStatus(`${text(labels.speaking)} ${value}`);
        utterance.onerror = () => setStatus(`${text(labels.noVoice)} ${value}`);
        utterance.onend = () => setStatus(value);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      });
    };
    const copyPolish = async (value) => {
      try {
        await navigator.clipboard.writeText(value);
        setStatus(`${text(labels.copied)} ${value}`);
      } catch {
        setStatus(value);
      }
    };
    app.addEventListener("click", (event) => {
      const speechButton = event.target.closest("[data-speech]");
      if (speechButton) {
        speakPolish(speechButton.dataset.speech || "");
        return;
      }
      const copyButton = event.target.closest("[data-copy]");
      if (copyButton) copyPolish(copyButton.dataset.copy || "");
    });
    app.querySelectorAll("[data-speech-group]").forEach((group) => {
      if (group.open) renderSpeechGroup(group);
      group.addEventListener("toggle", () => {
        if (group.open) renderSpeechGroup(group);
      });
    });
    const searchInput = app.querySelector("#speechSearch");
    const empty = app.querySelector(".speech-empty");
    searchInput?.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      let visibleTotal = 0;
      app.querySelectorAll("[data-speech-group]").forEach((group) => {
        if (query) renderSpeechGroup(group);
        let groupVisible = 0;
        group.querySelectorAll("[data-speech-card]").forEach((card) => {
          const match = !query || (card.dataset.key || "").includes(query);
          card.hidden = !match;
          if (match) groupVisible += 1;
        });
        group.hidden = groupVisible === 0;
        if (groupVisible > 0) {
          group.open = true;
          visibleTotal += groupVisible;
        }
      });
      if (empty) empty.hidden = visibleTotal > 0;
    });
  }

  function renderBans() {
    const quickRules = DATA.banQuickRules || [];
    const groups = DATA.banGroups || [];
    const bans = DATA.bans || [];
    const labels = {
      scope: tx("Dotyczy szklarni i magazynu", "Applies to greenhouse and warehouse", "Стосується теплиці і складу", "Относится к теплице и складу", "İstixana və anbara aiddir", "Aplica a invernadero y almacén", "Para sa greenhouse at bodega", "Untuk rumah kaca dan gudang", "ग्रीनहाउस र गोदाममा लागू हुन्छ"),
      title: tx("Przed wejściem sprawdź kieszenie i torbę.", "Before entering, check your pockets and bag.", "Перед входом перевірте кишені і сумку.", "Перед входом проверьте карманы и сумку.", "Girməzdən əvvəl ciblərinizi və çantanızı yoxlayın.", "Antes de entrar, revisa bolsillos y bolso.", "Bago pumasok, i-check ang bulsa at bag.", "Sebelum masuk, cek saku dan tas.", "प्रवेश गर्नु अघि खल्ती र झोला जाँच गर्नुहोस्।"),
      lead: tx("Jeśli masz coś zakazanego, zostaw to poza strefą pracy albo w miejscu wskazanym.", "If you have something forbidden, leave it outside the work zone or in the indicated place.", "Якщо маєте щось заборонене, залиште це поза робочою зоною або у вказаному місці.", "Если у вас есть что-то запрещенное, оставьте это вне рабочей зоны или в указанном месте.", "Qadağan olunmuş bir şeyiniz varsa, onu iş zonasından kənarda və ya göstərilən yerdə saxlayın.", "Si tienes algo prohibido, déjalo fuera de la zona de trabajo o en el sitio indicado.", "Kung may bawal na gamit, iwan ito sa labas ng work zone o sa itinalagang lugar.", "Jika ada barang terlarang, tinggalkan di luar area kerja atau di tempat yang ditunjuk.", "निषेधित सामान छ भने काम क्षेत्र बाहिर वा देखाइएको ठाउँमा छोड्नुहोस्।"),
      no: tx("Nie wolno", "Forbidden", "Заборонено", "Запрещено", "Qadağandır", "Prohibido", "Bawal", "Dilarang", "निषेध"),
      checkTitle: tx("Przed wejściem - 3 kroki", "Before entering - 3 steps", "Перед входом - 3 кроки", "Перед входом - 3 шага", "Girişdən əvvəl - 3 addım", "Antes de entrar - 3 pasos", "Bago pumasok - 3 hakbang", "Sebelum masuk - 3 langkah", "प्रवेश अघि - ३ चरण"),
      check1: tx("Sprawdź kieszenie, torbę i telefon.", "Check pockets, bag and phone.", "Перевірте кишені, сумку і телефон.", "Проверьте карманы, сумку и телефон.", "Cibləri, çantanı və telefonu yoxlayın.", "Revisa bolsillos, bolso y teléfono.", "I-check ang bulsa, bag at telepono.", "Cek saku, tas dan telepon.", "खल्ती, झोला र फोन जाँच गर्नुहोस्।"),
      check2: tx("Zostaw prywatne rzeczy poza strefą pracy.", "Leave private items outside the work zone.", "Залиште особисті речі поза робочою зоною.", "Оставьте личные вещи вне рабочей зоны.", "Şəxsi əşyaları iş zonasından kənarda saxlayın.", "Deja las cosas personales fuera de la zona.", "Iwan ang personal na gamit sa labas ng work zone.", "Tinggalkan barang pribadi di luar area kerja.", "निजी सामान काम क्षेत्र बाहिर छोड्नुहोस्।"),
      check3: tx("Jeśli nie wiesz, zapytaj brygadzistę przed wejściem.", "If you are not sure, ask the brigadier before entering.", "Якщо не знаєте, запитайте бригадира перед входом.", "Если не знаете, спросите бригадира перед входом.", "Əmin deyilsinizsə, girməzdən əvvəl briqadirdən soruşun.", "Si no sabes, pregunta al encargado antes de entrar.", "Kung hindi sigurado, magtanong sa brigadier bago pumasok.", "Jika tidak tahu, tanya mandor sebelum masuk.", "थाहा छैन भने प्रवेश अघि ब्रिगेडियरलाई सोध्नुहोस्।")
    };

    const quickHtml = quickRules.map((item) => `
      <article class="ban-quick ${esc(item.tone || "red")}">
        <div class="ban-quick-icon">${iconMap[item.icon] || iconMap.ban}</div>
        <div>
          <h3>${esc(text(item.title))}</h3>
          <p>${esc(text(item.text))}</p>
        </div>
      </article>
    `).join("");

    const groupsHtml = groups.map((group, index) => {
      const groupBans = bans.filter((item) => item.group === group.id);
      if (!groupBans.length) return "";
      const cards = groupBans.map((item) => `
        <article class="ban-card ban-card-modern">
          <div class="ban-card-mark">${iconMap[item.icon] || iconMap.ban}</div>
          <div>
            <span class="ban-card-label">${esc(text(labels.no))}</span>
            <h3>${esc(text(item.title))}</h3>
            <p>${esc(text(item.detail))}</p>
          </div>
        </article>
      `).join("");

      return `
        <details class="${cardClass(group.tone)} ban-section ban-group-panel"${index === 0 ? " open" : ""}>
          <summary>
            <span class="city-card-icon">${iconMap[group.icon] || iconMap.ban}</span>
            <span>${esc(text(group.title))}</span>
            <span class="speech-count">${groupBans.length}</span>
          </summary>
          <div class="details-body ban-section-head">
            <p>${esc(text(group.lead))}</p>
            <div class="ban-list ban-list-modern">${cards}</div>
          </div>
        </details>
      `;
    }).join("");

    app.innerHTML = `
      <main class="page bans-page">
        ${pageHero()}
        <section class="ban-alert ban-alert-modern">
          <div class="ban-alert-icon">${iconMap.ban}</div>
          <div>
            <p class="ban-alert-label">${esc(text(labels.scope))}</p>
            <h2>${esc(text(labels.title))}</h2>
            <p>${esc(text(labels.lead))}</p>
          </div>
        </section>
        <section class="ban-quick-grid">${quickHtml}</section>
        <section class="ban-before-card">
          <h2>${esc(text(labels.checkTitle))}</h2>
          <ol>
            <li>${esc(text(labels.check1))}</li>
            <li>${esc(text(labels.check2))}</li>
            <li>${esc(text(labels.check3))}</li>
          </ol>
        </section>
        <section class="ban-groups">${groupsHtml}</section>
      </main>
    `;
  }

  function renderTest() {
    const total = DATA.test.length;
    const answers = new Array(total).fill(null);
    let current = 0;

    const label = {
      prev: tx("Wstecz", "Back", "Назад", "Назад", "Geri", "Atrás", "Bumalik", "Kembali", "पछाडि"),
      next: tx("Dalej", "Next", "Далі", "Далее", "İrəli", "Siguiente", "Susunod", "Lanjut", "अगाडि"),
      finish: tx("Zakończ test", "Finish test", "Завершити тест", "Завершить тест", "Testi bitir", "Terminar test", "Tapusin ang test", "Selesai tes", "टेस्ट समाप्त गर्नुहोस्"),
      progress: tx("Pytanie", "Question", "Питання", "Вопрос", "Sual", "Pregunta", "Tanong", "Pertanyaan", "प्रश्न"),
      choose: tx("Zaznacz odpowiedź, potem przejdź dalej.", "Choose an answer, then go next.", "Оберіть відповідь, потім перейдіть далі.", "Выберите ответ, потом нажмите далее.", "Cavabı seçin, sonra irəli gedin.", "Marca una respuesta y sigue.", "Pumili ng sagot, pagkatapos susunod.", "Pilih jawaban, lalu lanjut.", "उत्तर छानेर अगाडि जानुहोस्।"),
      missing: tx("Odpowiedz na wszystkie pytania przed wysłaniem wyniku.", "Answer all questions before sending the result.", "Дайте відповідь на всі питання перед відправкою результату.", "Ответьте на все вопросы перед отправкой результата.", "Nəticəni göndərməzdən əvvəl bütün suallara cavab verin.", "Responde todas las preguntas antes de enviar.", "Sagutin ang lahat bago ipadala ang resulta.", "Jawab semua pertanyaan sebelum kirim hasil.", "नतिजा पठाउनु अघि सबै प्रश्नको उत्तर दिनुहोस्।"),
      send: tx("Po sprawdzeniu wyślij wynik przez WhatsApp albo Viber.", "After checking, send the result by WhatsApp or Viber.", "Після перевірки надішліть результат через WhatsApp або Viber.", "После проверки отправьте результат через WhatsApp или Viber.", "Yoxladıqdan sonra nəticəni WhatsApp və ya Viber ilə göndərin.", "Después de revisar, envía el resultado por WhatsApp o Viber.", "Pagkatapos, ipadala ang resulta sa WhatsApp o Viber.", "Setelah dicek, kirim hasil via WhatsApp atau Viber.", "जाँचपछि WhatsApp वा Viber बाट नतिजा पठाउनुहोस्।")
    };

    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <section class="test-shell">
          <div class="test-progress-head">
            <span id="testProgressText"></span>
            <span id="testAnsweredText"></span>
          </div>
          <div class="test-progress-bar" aria-hidden="true"><span id="testProgressBar"></span></div>
          <form id="testForm" class="test-step-form"></form>
        </section>
        <div id="testResult"></div>
      </main>
    `;

    const form = document.getElementById("testForm");
    const result = document.getElementById("testResult");

    function renderQuestion() {
      const item = DATA.test[current];
      const selected = answers[current];
      const answered = answers.filter((answer) => answer !== null).length;
      document.getElementById("testProgressText").textContent = `${text(label.progress)} ${current + 1}/${total}`;
      document.getElementById("testAnsweredText").textContent = `${answered}/${total}`;
      document.getElementById("testProgressBar").style.width = `${Math.max(4, ((current + 1) / total) * 100)}%`;

      form.innerHTML = `
        <article class="test-question is-single" data-q="${current}" data-ok="${item.ok ? "1" : "0"}">
          <p class="test-helper">${esc(text(label.choose))}</p>
          <h3>${current + 1}. ${esc(text(item.text))}</h3>
          <div class="test-answer-grid">
            <label class="${selected === true ? "is-picked" : ""}">
              <input type="radio" name="testAnswer" value="1"${selected === true ? " checked" : ""}>
              <span>${esc(ui("yes"))}</span>
            </label>
            <label class="${selected === false ? "is-picked" : ""}">
              <input type="radio" name="testAnswer" value="0"${selected === false ? " checked" : ""}>
              <span>${esc(ui("no"))}</span>
            </label>
          </div>
        </article>
        <div class="test-nav-row">
          <button class="btn secondary" type="button" id="testPrev"${current === 0 ? " disabled" : ""}>${esc(text(label.prev))}</button>
          <button class="btn yellow" type="button" id="testNext">${esc(text(current === total - 1 ? label.finish : label.next))}</button>
        </div>
      `;

      form.querySelectorAll("input[name='testAnswer']").forEach((input) => {
        input.addEventListener("change", () => {
          answers[current] = input.value === "1";
          renderQuestion();
        });
      });
      document.getElementById("testPrev").addEventListener("click", () => {
        if (current > 0) {
          current -= 1;
          renderQuestion();
          form.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      document.getElementById("testNext").addEventListener("click", () => {
        if (current < total - 1) {
          current += 1;
          renderQuestion();
          form.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        showResult();
      });
    }

    function showResult() {
      const answered = answers.filter((answer) => answer !== null).length;
      if (answered < total) {
        result.innerHTML = `<section class="notice yellow"><strong>${esc(ui("important"))}:</strong> ${esc(text(label.missing))}</section>`;
        result.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const score = DATA.test.reduce((sum, item, index) => sum + (answers[index] === item.ok ? 1 : 0), 0);
      const message = `Wynik testu Citronex Siechnice: ${score}/${total}. Odpowiedzi: ${answered}/${total}. Jezyk: ${lang.toUpperCase()}.`;
      result.innerHTML = `
        <section class="result-box">
          <h2>${esc(ui("score"))}: ${score}/${total}</h2>
          <p>${esc(text(label.send))}</p>
          <div class="btn-row">
            <a class="btn" target="_blank" rel="noopener" href="${esc(waHref("+48502251384", message))}">${esc(ui("sendResult"))} WhatsApp</a>
            <a class="btn secondary" href="${esc(viberHref("+48794912552", message))}">${esc(ui("sendResult"))} Viber</a>
          </div>
        </section>
      `;
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    renderQuestion();
  }

  let frontendObserverReady = false;
  let scrollHelpersReady = false;
  let scrollHelperUpdate = null;

  function enhanceFrontend(root = document) {
    root.querySelectorAll("img").forEach((image) => {
      const currentSrc = image.getAttribute("src");
      const nextSrc = assetSrc(currentSrc);
      if (currentSrc && nextSrc !== currentSrc) image.setAttribute("src", nextSrc);
      const importantImage = image.closest(".brand, .location-splash-card");
      if (!image.hasAttribute("loading")) image.setAttribute("loading", importantImage ? "eager" : "lazy");
      image.setAttribute("decoding", "async");
      image.setAttribute("draggable", "false");
    });

    root.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      link.setAttribute("rel", Array.from(rel).join(" "));
    });
  }

  function setupFrontendEnhancements() {
    if (frontendObserverReady || !("MutationObserver" in window)) return;
    frontendObserverReady = true;
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        enhanceFrontend();
      });
    });
    observer.observe(app, { childList: true, subtree: true });
  }

  function scrollTopLabel() {
    return text(tx(
      "Do góry",
      "Back to top",
      "Нагору",
      "Наверх",
      "Yuxarı",
      "Arriba",
      "Pataas",
      "Ke atas",
      "माथि"
    ));
  }

  function setupScrollHelpers() {
    let progress = document.querySelector(".app-scroll-progress");
    let button = document.querySelector(".app-to-top");
    const scrollRoot = () => document.scrollingElement || document.documentElement || document.body;
    const scrollTop = () => window.pageYOffset || scrollRoot().scrollTop || document.body.scrollTop || 0;

    if (!progress) {
      progress = document.createElement("div");
      progress.className = "app-scroll-progress";
      progress.setAttribute("aria-hidden", "true");
      document.body.appendChild(progress);
    }

    if (!button) {
      button = document.createElement("button");
      button.className = "app-to-top";
      button.type = "button";
      button.innerHTML = "<span aria-hidden=\"true\">↑</span>";
      button.addEventListener("click", () => {
        const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        try {
          window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
        } catch (error) {
          window.scrollTo(0, 0);
        }
        scrollRoot().scrollTop = 0;
        document.body.scrollTop = 0;
        scrollHelperUpdate?.();
      });
      document.body.appendChild(button);
    }

    button.setAttribute("aria-label", scrollTopLabel());

    if (scrollHelpersReady) {
      scrollHelperUpdate?.();
      return;
    }
    scrollHelpersReady = true;

    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const root = scrollRoot();
      const fullHeight = Math.max(root.scrollHeight, doc.scrollHeight, document.body.scrollHeight);
      const top = scrollTop();
      const max = Math.max(1, fullHeight - window.innerHeight);
      const percent = Math.min(100, Math.max(0, (top / max) * 100));
      document.body.style.setProperty("--scroll-progress", `${percent}%`);
      const useful = max > 120;
      button.classList.toggle("is-visible", useful && top > 180);
    };
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    scrollHelperUpdate = requestUpdate;
    window.addEventListener("scroll", requestUpdate, { passive: true });
    document.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("orientationchange", requestUpdate);
    window.addEventListener("wheel", requestUpdate, { passive: true });
    window.addEventListener("touchmove", requestUpdate, { passive: true });
    window.addEventListener("touchend", requestUpdate, { passive: true });
    document.addEventListener("wheel", requestUpdate, { passive: true });
    document.addEventListener("touchmove", requestUpdate, { passive: true });
    requestUpdate();
    window.setTimeout(requestUpdate, 250);
  }


  let pageLoadingReady = false;
  let pageLoadingTimer = 0;

  function loadingLabel() {
    return text(tx("\u0141aduj\u0119 aktualn\u0105 wersj\u0119", "Loading the current version", "\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0443\u044e \u0430\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u0443 \u0432\u0435\u0440\u0441\u0456\u044e", "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044e \u0430\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u0443\u044e \u0432\u0435\u0440\u0441\u0438\u044e", "Aktual versiya y\u00fckl\u0259nir", "Cargando versi\u00f3n actual", "Nilo-load ang kasalukuyang bersyon", "Memuat versi terbaru", "\u0939\u093e\u0932\u0915\u094b \u0938\u0902\u0938\u094d\u0915\u0930\u0923 \u0932\u094b\u0921 \u0939\u0941\u0901\u0926\u0948\u091b"));
  }

  function setupPageLoading() {
    if (pageLoadingReady) return;
    pageLoadingReady = true;
    const overlay = document.createElement("div");
    overlay.className = "page-loader";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="page-loader-card">
        <span class="loader-dot" aria-hidden="true"></span>
        <strong>${esc(loadingLabel())}</strong>
      </div>
    `;
    document.body.appendChild(overlay);

    const hideLoader = () => {
      window.clearTimeout(pageLoadingTimer);
      overlay.classList.remove("is-visible");
      overlay.hidden = true;
      document.querySelectorAll(".is-loading").forEach((item) => item.classList.remove("is-loading"));
    };

    const showLoader = (link) => {
      window.clearTimeout(pageLoadingTimer);
      if (link) link.classList.add("is-loading");
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add("is-visible"));
      pageLoadingTimer = window.setTimeout(hideLoader, 1800);
    };

    window.addEventListener("pageshow", hideLoader);
    window.addEventListener("pagehide", hideLoader);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) hideLoader();
    });

    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;
      if (link.closest(".map-action-group") || link.href.startsWith("tel:") || link.href.startsWith("mailto:")) return;
      const url = new URL(link.getAttribute("href"), location.href);
      if (url.origin !== location.origin) return;
      if (url.hash && url.pathname === location.pathname && url.search === location.search) return;
      const isPage = url.pathname.endsWith(".html") || url.pathname.endsWith("/") || url.pathname === location.pathname;
      if (!isPage) return;
      showLoader(link);
    }, { capture: true });
  }

  function setupFrontendStandard() {
    if (document.body.dataset.frontendStandardReady === "1") return;
    document.body.dataset.frontendStandardReady = "1";
    document.addEventListener("click", (event) => {
      const target = event.target.closest(".tile, .btn, .top-nav-link, .home-return-cta, summary, .mode-card, .contact-person");
      if (!target) return;
      target.classList.add("is-pressed");
      window.setTimeout(() => target.classList.remove("is-pressed"), 220);
    }, { capture: true });
  }


  function sessionValue(key) {
    try { return sessionStorage.getItem(key) || ""; } catch { return ""; }
  }

  function setSessionValue(key, value) {
    try { sessionStorage.setItem(key, value); } catch { /* private browsing can block session storage */ }
  }

  function speakWelcome(value, selectedLang, done) {
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
      window.setTimeout(done, 600);
      return;
    }
    const locale = voiceLocales[selectedLang] || "pl-PL";
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.setTimeout(done, 260);
    };
    const profile = voiceProfiles[selectedLang] || voiceProfiles.en;
    waitForSpeechVoice(locale, (voice) => {
      const utterance = new SpeechSynthesisUtterance(speechReady(value, selectedLang));
      utterance.lang = locale;
      utterance.rate = profile.rate;
      utterance.pitch = profile.pitch;
      if (voice) utterance.voice = voice;
      utterance.onend = finish;
      utterance.onerror = finish;
      try {
        synth.cancel();
        synth.speak(utterance);
      } catch {
        finish();
      }
    });
  }

  function showLocationWelcomeLegacy() {
    // The standalone dragon guide is the only welcome screen.
    document.querySelectorAll(".welcome-modal").forEach((modal) => modal.remove());
    document.body.classList.remove("welcome-modal-open");
    return;
    if (page !== "home") return;
    const locationKey = DATA.meta && DATA.meta.repo ? DATA.meta.repo : getLocationName();
    const seenKey = `cx-location-welcome:welcome-dragon1:${locationKey}`;
    const forceWelcome = new URLSearchParams(location.search).get("welcome") === "1";
    if (sessionValue(seenKey) && !forceWelcome) return;
    const delay = document.body.classList.contains("location-splash-open") ? 2400 : 0;
    window.setTimeout(() => {
      if (document.querySelector(".welcome-modal")) return;
      const options = DATA.languages.map((item) => `
        <option value="${esc(item.id)}"${item.id === lang ? " selected" : ""}>${esc(welcomeLanguageNames[item.id] || item.label)}</option>
      `).join("");
      const modal = document.createElement("div");
      modal.className = "welcome-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "welcomeTitle");
      modal.innerHTML = `
        <div class="welcome-dialog">
          <div class="welcome-location">${esc(getLocationName())}</div>
          <div class="welcome-dragon" aria-hidden="true">
            <svg viewBox="0 0 220 170" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="dragon-tail" d="M76 126C43 151 18 137 31 116c7-11 21-13 34-3"/>
              <path class="dragon-wing dragon-wing-left" d="M82 74C50 42 38 43 25 53c16 2 28 12 35 28 8-9 14-12 22-7Z"/>
              <path class="dragon-wing dragon-wing-right" d="M138 74c32-32 44-31 57-21-16 2-28 12-35 28-8-9-14-12-22-7Z"/>
              <path class="dragon-body" d="M72 82c0-25 17-41 38-41s38 16 38 41v28c0 20-16 34-38 34s-38-14-38-34V82Z"/>
              <path class="dragon-horn" d="M92 48 83 28l18 14M128 48l9-20-18 14"/>
              <circle class="dragon-head" cx="110" cy="67" r="30"/>
              <circle class="dragon-eye" cx="99" cy="64" r="4"/>
              <circle class="dragon-eye" cx="121" cy="64" r="4"/>
              <path class="dragon-snout" d="M102 76c5 4 11 4 16 0M106 83c3 3 7 3 10 0"/>
              <path class="dragon-foot" d="M86 132v15M134 132v15"/>
              <circle class="dragon-spark" cx="53" cy="28" r="4"/>
              <circle class="dragon-spark" cx="169" cy="29" r="3"/>
            </svg>
          </div>
          <p class="welcome-kicker">CITRONEX</p>
          <h2 id="welcomeTitle" data-welcome-title>${esc(welcomeText(welcomeLabels.title))}</h2>
          <p class="welcome-lead" data-welcome-lead>${esc(welcomeText(welcomeLabels.lead))}</p>
          <label class="welcome-language-label" for="welcomeLanguage" data-welcome-choose>${esc(welcomeText(welcomeLabels.choose))}</label>
          <select class="welcome-language" id="welcomeLanguage">${options}</select>
          <p class="welcome-status" data-welcome-status aria-live="polite"></p>
          <div class="welcome-actions">
            <button type="button" class="btn welcome-start" data-welcome-start>${esc(welcomeText(welcomeLabels.start))}</button>
            <button type="button" class="btn secondary welcome-skip" data-welcome-skip>${esc(welcomeText(welcomeLabels.skip))}</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      document.body.classList.add("welcome-modal-open");
      const language = modal.querySelector("#welcomeLanguage");
      const start = modal.querySelector("[data-welcome-start]");
      const skip = modal.querySelector("[data-welcome-skip]");
      const status = modal.querySelector("[data-welcome-status]");
      let started = false;
      const updateModalLanguage = () => {
        const selected = language.value;
        modal.querySelector("[data-welcome-title]").textContent = welcomeText(welcomeLabels.title, selected);
        modal.querySelector("[data-welcome-lead]").textContent = welcomeText(welcomeLabels.lead, selected);
        modal.querySelector("[data-welcome-choose]").textContent = welcomeText(welcomeLabels.choose, selected);
        if (!started) {
          start.textContent = welcomeText(welcomeLabels.start, selected);
          skip.textContent = welcomeText(welcomeLabels.skip, selected);
        }
      };
      const openSystem = () => {
        const selected = language.value;
        setSessionValue(seenKey, "1");
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        modal.remove();
        document.body.classList.remove("welcome-modal-open");
        reloadWithLanguage(selected);
      };
      language.addEventListener("change", updateModalLanguage);
      start.addEventListener("click", () => {
        if (started) {
          openSystem();
          return;
        }
        started = true;
        const selected = language.value;
        language.disabled = true;
        start.textContent = welcomeText(welcomeLabels.open, selected);
        skip.textContent = welcomeText(welcomeLabels.skip, selected);
        status.textContent = welcomeText(welcomeLabels.speaking, selected);
        speakWelcome(getWelcomeSpeech(selected), selected, openSystem);
      });
      skip.addEventListener("click", openSystem);
      start.focus({ preventScroll: true });
    }, delay);
  }
  function setupContrastGuard() {
    const checked = [];
    const targets = document.querySelectorAll(".tile, .card, .step-card, .notice, .btn, .pill, .city-simple-item, .contact-person");
    targets.forEach((item) => {
      const style = getComputedStyle(item);
      const color = style.color;
      const background = style.backgroundColor;
      if ((color.includes("255, 255, 255") || color.includes("255,255,255")) && background.includes("255, 255, 255")) {
        item.classList.add("contrast-guard");
        checked.push(item);
      }
    });
    if (checked.length) console.warn("Contrast guard adjusted elements:", checked.length);
  }

  function renderPage() {
    renderHeader();
    focusActiveTopNav();
    const renderers = {
      home: renderHomeCompact,
      pomocnik: renderAssistantPage,
      mapa: renderMap,
      magazyn: renderWarehouse,
      tablet: renderTablet,
      szklarnia: renderGreenhouseGuide,
      reader: renderReader,
      lekarz: renderMedical,
      kontakty: renderContacts,
      grupy: renderGroups,
      miasto: renderCity,
      mowa: renderSpeech,
      slownik: renderGlossary,
      zakazy: renderBans,
      test: renderTest
    };
    (renderers[page] || renderHomeCompact)();
    bindCopyLinks();
    renderVersionFooter();
    setupFrontendEnhancements();
    enhanceFrontend(document);
    setupScrollHelpers();
    setupPageLoading();
    setupFrontendStandard();
    setupContrastGuard();
    setupDigitalPresenter();
    // Location pages open directly. No automatic splash or dragon welcome.
  }

  function upgradeCache() {
    if ("caches" in window) {
      caches.keys().then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("citronex-siechnice-training-") && !key.includes("modular"))
        .map((key) => caches.delete(key))
      )).catch(() => {});
    }

    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      const controllerVersionKey = "cx-sw-controller-version";
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        try {
          if (sessionStorage.getItem(controllerVersionKey) === assetVersion) return;
          sessionStorage.setItem(controllerVersionKey, assetVersion);
        } catch (error) { /* Storage may be unavailable in private mode. */ }
        location.reload();
      });
      navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).then((registration) => {
        const activateWaitingWorker = () => registration.waiting?.postMessage({ type: "SKIP_WAITING" });
        activateWaitingWorker();
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) activateWaitingWorker();
          });
        });
        registration.update().catch(() => {});
      }).catch(() => {});
    }
  }

  const welcomeGuideUi = {
    pl: { title: "Witaj w systemie", lead: "Wybierz j\u0119zyk. Przewodnik poka\u017ce Ci, gdzie szuka\u0107 informacji i jak znale\u017a\u0107 drog\u0119.", choose: "Wybierz j\u0119zyk", start: "Pos\u0142uchaj przewodnika", pause: "Pauza", resume: "Wzn\u00f3w", repeat: "Powt\u00f3rz", next: "Dalej", skip: "Pomi\u0144 g\u0142os", open: "Otw\u00f3rz system", speaking: "Przewodnik m\u00f3wi", unavailable: "G\u0142os jest niedost\u0119pny. Przeczytaj tekst i otw\u00f3rz system.", step: "Krok" },
    en: { title: "Welcome to the system", lead: "Choose a language. The guide will show you where to find information and how to find your way.", choose: "Choose a language", start: "Listen to the guide", pause: "Pause", resume: "Resume", repeat: "Repeat", next: "Next", skip: "Skip voice", open: "Open the system", speaking: "The guide is speaking", unavailable: "Voice is not available. Read the text and open the system.", step: "Step" },
    ua: { title: "\u0412\u0456\u0442\u0430\u0454\u043c\u043e \u0432 \u0441\u0438\u0441\u0442\u0435\u043c\u0456", lead: "\u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043c\u043e\u0432\u0443. \u041f\u0440\u043e\u0432\u0456\u0434\u043d\u0438\u043a \u043f\u043e\u043a\u0430\u0436\u0435, \u0434\u0435 \u0448\u0443\u043a\u0430\u0442\u0438 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044e \u0442\u0430 \u044f\u043a \u0437\u043d\u0430\u0439\u0442\u0438 \u0434\u043e\u0440\u043e\u0433\u0443.", choose: "\u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043c\u043e\u0432\u0443", start: "\u041f\u043e\u0441\u043b\u0443\u0445\u0430\u0442\u0438 \u043f\u0440\u043e\u0432\u0456\u0434\u043d\u0438\u043a\u0430", pause: "\u041f\u0430\u0443\u0437\u0430", resume: "\u041f\u0440\u043e\u0434\u043e\u0432\u0436\u0438\u0442\u0438", repeat: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0438", next: "\u0414\u0430\u043b\u0456", skip: "\u041f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u0438 \u0433\u043e\u043b\u043e\u0441", open: "\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u0441\u0438\u0441\u0442\u0435\u043c\u0443", speaking: "\u041f\u0440\u043e\u0432\u0456\u0434\u043d\u0438\u043a \u0433\u043e\u0432\u043e\u0440\u0438\u0442\u044c", unavailable: "\u0413\u043e\u043b\u043e\u0441 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0456\u0439. \u041f\u0440\u043e\u0447\u0438\u0442\u0430\u0439\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u0456 \u0432\u0456\u0434\u043a\u0440\u0438\u0439\u0442\u0435 \u0441\u0438\u0441\u0442\u0435\u043c\u0443.", step: "\u041a\u0440\u043e\u043a" },
    ru: { title: "\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432 \u0441\u0438\u0441\u0442\u0435\u043c\u0443", lead: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u044f\u0437\u044b\u043a. \u041f\u043e\u043c\u043e\u0449\u043d\u0438\u043a \u043f\u043e\u043a\u0430\u0436\u0435\u0442, \u0433\u0434\u0435 \u0438\u0441\u043a\u0430\u0442\u044c \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u0438 \u043a\u0430\u043a \u043d\u0430\u0439\u0442\u0438 \u0434\u043e\u0440\u043e\u0433\u0443.", choose: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u044f\u0437\u044b\u043a", start: "\u041f\u043e\u0441\u043b\u0443\u0448\u0430\u0442\u044c \u043f\u043e\u043c\u043e\u0449\u043d\u0438\u043a\u0430", pause: "\u041f\u0430\u0443\u0437\u0430", resume: "\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c", repeat: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c", next: "\u0414\u0430\u043b\u0435\u0435", skip: "\u041f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u0433\u043e\u043b\u043e\u0441", open: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u0438\u0441\u0442\u0435\u043c\u0443", speaking: "\u041f\u043e\u043c\u043e\u0449\u043d\u0438\u043a \u0433\u043e\u0432\u043e\u0440\u0438\u0442", unavailable: "\u0413\u043e\u043b\u043e\u0441 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d. \u041f\u0440\u043e\u0447\u0438\u0442\u0430\u0439\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u0438 \u043e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0441\u0438\u0441\u0442\u0435\u043c\u0443.", step: "\u0428\u0430\u0433" },
    az: { title: "Sistem\u0259 xo\u0159 g\u0259lmisiniz", lead: "Dil se\u00e7in. B\u0259l\u0259d\u00e7i m\u0259lumat\u0131 harada tapma\u011f\u0131 v\u0259 yolu nec\u0259 tapma\u011f\u0131 g\u00f6st\u0259r\u0259c\u0259k.", choose: "Dil se\u00e7in", start: "B\u0259l\u0259d\u00e7ini dinl\u0259yin", pause: "Pauza", resume: "Davam et", repeat: "T\u0259krarla", next: "N\u00f6vb\u0259ti", skip: "S\u0259si ke\u00e7", open: "Sistemi a\u00e7", speaking: "B\u0259l\u0259d\u00e7i dan\u0131\u015f\u0131r", unavailable: "S\u0259s m\u00f6vcud deyil. M\u0259tni oxuyun v\u0259 sistemi a\u00e7\u0131n.", step: "Add\u0131m" },
    es: { title: "Bienvenido al sistema", lead: "Elige un idioma. El gu\u00eda te mostrar\u00e1 d\u00f3nde encontrar informaci\u00f3n y c\u00f3mo llegar.", choose: "Elige un idioma", start: "Escuchar al gu\u00eda", pause: "Pausa", resume: "Continuar", repeat: "Repetir", next: "Siguiente", skip: "Omitir voz", open: "Abrir el sistema", speaking: "El gu\u00eda est\u00e1 hablando", unavailable: "La voz no est\u00e1 disponible. Lee el texto y abre el sistema.", step: "Paso" },
    fil: { title: "Maligayang pagdating sa system", lead: "Pumili ng wika. Ipapakita ng gabay kung saan makikita ang impormasyon at kung paano pupunta sa tamang lugar.", choose: "Pumili ng wika", start: "Pakinggan ang gabay", pause: "I-pause", resume: "Ipagpatuloy", repeat: "Ulitin", next: "Susunod", skip: "Laktawan ang boses", open: "Buksan ang system", speaking: "Nagsasalita ang gabay", unavailable: "Walang boses. Basahin ang teksto at buksan ang system.", step: "Hakbang" },
    id: { title: "Selamat datang di sistem", lead: "Pilih bahasa. Pemandu akan menunjukkan tempat mencari informasi dan cara menemukan jalan.", choose: "Pilih bahasa", start: "Dengarkan pemandu", pause: "Jeda", resume: "Lanjutkan", repeat: "Ulangi", next: "Berikutnya", skip: "Lewati suara", open: "Buka sistem", speaking: "Pemandu sedang berbicara", unavailable: "Suara tidak tersedia. Baca teks lalu buka sistem.", step: "Langkah" },
    ne: { title: "\u0938\u093f\u0938\u094d\u091f\u092e\u092e\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u091b", lead: "\u092d\u093e\u0937\u093e \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964 \u092c\u093e\u091f\u094b\u0932\u0947 \u0915\u0939\u093e\u0901 \u091c\u093e\u0928\u0947 \u0930 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0915\u0939\u093e\u0901 \u092a\u093e\u0909\u0928\u0947 \u0926\u0947\u0916\u093e\u0909\u0928\u0947\u091b\u0964", choose: "\u092d\u093e\u0937\u093e \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d", start: "\u092c\u093e\u091f\u094b\u0932\u0947\u0915\u094b \u0915\u0941\u0930\u093e \u0938\u0941\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d", pause: "\u0930\u094b\u0915\u094d\u0928\u0941\u0939\u094b\u0938\u094d", resume: "\u091c\u093e\u0930\u0940 \u0930\u093e\u0916\u094d\u0928\u0941\u0939\u094b\u0938\u094d", repeat: "\u092b\u0947\u0930\u093f \u0938\u0941\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d", next: "\u0905\u0917\u093e\u0921\u093f", skip: "\u0938\u094d\u0935\u0930 \u091b\u094b\u0921\u094d\u0928\u0941\u0939\u094b\u0938\u094d", open: "\u0938\u093f\u0938\u094d\u091f\u092e \u0916\u094b\u0932\u094d\u0928\u0941\u0939\u094b\u0938\u094d", speaking: "\u092c\u093e\u091f\u094b\u0932\u0947 \u092c\u094b\u0932\u093f\u0930\u0939\u0947\u0915\u094b \u091b", unavailable: "\u0938\u094d\u0935\u0930 \u0909\u092a\u0932\u092c\u094d\u0927 \u091b\u0948\u0928\u0964 \u092f\u094b \u092a\u093e\u0920 \u092a\u0922\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u0938\u093f\u0938\u094d\u091f\u092e \u0916\u094b\u0932\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964", step: "\u091a\u0930\u0923" }
  };

  function guideText(selectedLang, location) {
    const name = String(location || "Citronex");
    if (speechGuideTemplates[selectedLang]) {
      return speechGuideTemplates[selectedLang].map((line) => line.replace("{location}", name));
    }
    const copies = {
      pl: [
        "Witaj. To jest system informacyjno-ucz\u0105cy dla lokalizacji " + name + ".",
        "Nie wiesz, gdzie i\u015b\u0107? Otw\u00f3rz kafelk\u0119 Dojazd / mapa i wybierz swoje miejsce pracy.",
        "Po przyj\u015bciu wybierz potrzebny modu\u0142: Szklarnia, Magazyn, Reader, Tablet, Lekarz lub Kontakty."
      ],
      en: [
        "Welcome. This is the information and training system for " + name + ".",
        "Do not know where to go? Open the Route / map tile and choose your workplace.",
        "After you arrive, choose the module you need: Greenhouse, Warehouse, Reader, Tablet, Doctor or Contacts."
      ],
      ua: [
        "\u0412\u0456\u0442\u0430\u0454\u043c\u043e. \u0426\u0435 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u0439\u043d\u043e-\u043d\u0430\u0432\u0447\u0430\u043b\u044c\u043d\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u0434\u043b\u044f \u043b\u043e\u043a\u0430\u0446\u0456\u0457 " + name + ".",
        "\u041d\u0435 \u0437\u043d\u0430\u0454\u0442\u0435, \u043a\u0443\u0434\u0438 \u0439\u0442\u0438? \u0412\u0456\u0434\u043a\u0440\u0438\u0439\u0442\u0435 \u0440\u043e\u0437\u0434\u0456\u043b \u00ab\u0414\u043e\u0440\u043e\u0433\u0430 / \u043a\u0430\u0440\u0442\u0430\u00bb \u0456 \u0432\u0438\u0431\u0435\u0440\u0456\u0442\u044c \u0441\u0432\u043e\u0454 \u043c\u0456\u0441\u0446\u0435 \u0440\u043e\u0431\u043e\u0442\u0438.",
        "\u041f\u0456\u0441\u043b\u044f \u043f\u0440\u0438\u0431\u0443\u0442\u0442\u044f \u0432\u0438\u0431\u0435\u0440\u0456\u0442\u044c \u043f\u043e\u0442\u0440\u0456\u0431\u043d\u0438\u0439 \u0440\u043e\u0437\u0434\u0456\u043b: \u0442\u0435\u043f\u043b\u0438\u0446\u044f, \u0441\u043a\u043b\u0430\u0434, \u0440\u0456\u0434\u0435\u0440, \u043f\u043b\u0430\u043d\u0448\u0435\u0442, \u043b\u0456\u043a\u0430\u0440 \u0430\u0431\u043e \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u0438."
      ],
      ru: [
        "\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c. \u042d\u0442\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u043e\u043d\u043d\u043e-\u043e\u0431\u0443\u0447\u0430\u044e\u0449\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u0434\u043b\u044f \u043b\u043e\u043a\u0430\u0446\u0438\u0438 " + name + ".",
        "\u041d\u0435 \u0437\u043d\u0430\u0435\u0442\u0435, \u043a\u0443\u0434\u0430 \u0438\u0434\u0442\u0438? \u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0440\u0430\u0437\u0434\u0435\u043b \u00ab\u0414\u043e\u0440\u043e\u0433\u0430 / \u043a\u0430\u0440\u0442\u0430\u00bb \u0438 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043c\u0435\u0441\u0442\u043e \u0440\u0430\u0431\u043e\u0442\u044b.",
        "\u041f\u043e\u0441\u043b\u0435 \u043f\u0440\u0438\u0431\u044b\u0442\u0438\u044f \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0443\u0436\u043d\u044b\u0439 \u0440\u0430\u0437\u0434\u0435\u043b: \u0442\u0435\u043f\u043b\u0438\u0446\u0430, \u0441\u043a\u043b\u0430\u0434, \u0440\u0438\u0434\u0435\u0440, \u043f\u043b\u0430\u043d\u0448\u0435\u0442, \u0432\u0440\u0430\u0447 \u0438\u043b\u0438 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b."
      ],
      az: [
        "Xo\u015f g\u0259lmisiniz. Bu, " + name + " m\u0259nt\u0259q\u0259si \u00fc\u00e7\u00fcn m\u0259lumat v\u0259 t\u0259lim sistemidir.",
        "Hara getm\u0259li oldu\u011funuzu bilmirsiniz? Yol / x\u0259rit\u0259 b\u00f6lm\u0259sini a\u00e7\u0131n v\u0259 i\u015f yerinizi se\u00e7in.",
        "G\u0259ldikd\u0259n sonra laz\u0131m olan b\u00f6lm\u0259ni se\u00e7in: istixana, anbar, reader, plan\u015fet, h\u0259kim v\u0259 ya kontaktlar."
      ],
      es: [
        "Bienvenido. Este es el sistema de informaci\u00f3n y formaci\u00f3n de la ubicaci\u00f3n " + name + ".",
        "\u00bfNo sabes ad\u00f3nde ir? Abre la secci\u00f3n Ruta / mapa y elige tu lugar de trabajo.",
        "Cuando llegues, elige la secci\u00f3n que necesitas: Invernadero, Almac\u00e9n, Lector, Tableta, M\u00e9dico o Contactos."
      ],
      fil: [
        "Maligayang pagdating. Ito ang information at training system para sa lokasyon na " + name + ".",
        "Hindi mo alam kung saan pupunta? Buksan ang seksyong Daan / mapa at piliin ang lugar ng trabaho.",
        "Pagdating mo, piliin ang kailangan mong seksyon: Greenhouse, Warehouse, Reader, Tablet, Doktor o Mga Contact."
      ],
      id: [
        "Selamat datang. Ini adalah sistem informasi dan pelatihan untuk lokasi " + name + ".",
        "Tidak tahu harus pergi ke mana? Buka bagian Rute / peta dan pilih tempat kerja Anda.",
        "Setelah tiba, pilih bagian yang Anda perlukan: Rumah kaca, Gudang, Reader, Tablet, Dokter, atau Kontak."
      ],
      ne: [
        "\u0938\u094d\u0935\u093e\u0917\u0924 \u091b\u0964 \u092f\u094b " + name + " \u0915\u093e \u0932\u093e\u0917\u093f \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0930 \u0924\u093e\u0932\u093f\u092e \u092a\u094d\u0930\u0923\u093e\u0932\u0940 \u0939\u094b\u0964",
        "\u0915\u0939\u093e\u0901 \u091c\u093e\u0928\u0947 \u0925\u093e\u0939\u093e \u091b\u0948\u0928? \u092c\u093e\u091f\u094b / \u0928\u0915\u094d\u0938\u093e \u0916\u0923\u094d\u0921 \u0916\u094b\u0932\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u0906\u092b\u094d\u0928\u094b \u0915\u093e\u092e \u0917\u0930\u094d\u0928\u0947 \u0920\u093e\u0909\u0901 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964",
        "\u092a\u0941\u0917\u0947\u092a\u091b\u093f \u0906\u0935\u0936\u094d\u092f\u0915 \u0916\u0923\u094d\u0921 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d: \u0917\u094d\u0930\u0940\u0928\u0939\u093e\u0909\u0938, \u0917\u094b\u0926\u093e\u092e, \u0930\u093f\u0921\u0930, \u091f\u094d\u092f\u093e\u092c\u0932\u0947\u091f, \u0921\u093e\u0915\u094d\u091f\u0930 \u0935\u093e \u0938\u092e\u094d\u092a\u0930\u094d\u0915\u0964"
      ]
    };
    return copies[selectedLang] || copies.pl;
  }

  function createGuideSpeaker(sentences, selectedLang, update, done) {
    const synth = window.speechSynthesis;
    const supported = Boolean(synth && typeof SpeechSynthesisUtterance !== "undefined");
    const locale = voiceLocales[selectedLang] || "pl-PL";
    let index = 0;
    let run = 0;
    let active = false;

    function play(nextIndex) {
      if (!supported || !active) return;
      index = Math.max(0, Math.min(nextIndex, sentences.length - 1));
      const token = ++run;
      synth.cancel();
      update(index, sentences[index]);
      waitForSpeechVoice(locale, (voice) => {
        if (token !== run || !active) return;
        const utterance = new SpeechSynthesisUtterance(speechReady(sentences[index], selectedLang));
        utterance.lang = locale;
        utterance.rate = (voiceProfiles[selectedLang] || voiceProfiles.en).rate;
        utterance.pitch = (voiceProfiles[selectedLang] || voiceProfiles.en).pitch;
        if (voice) utterance.voice = voice;
        const finishSentence = (moveNext) => {
          if (token !== run) return;
          if (moveNext && index < sentences.length - 1) {
            window.setTimeout(() => play(index + 1), 100);
          } else {
            active = false;
            done();
          }
        };
        utterance.onend = () => finishSentence(true);
        utterance.onerror = () => finishSentence(false);
        try {
          synth.speak(utterance);
        } catch {
          active = false;
          done();
        }
      });
    }

    return {
      supported,
      start() {
        if (!supported) return false;
        active = true;
        play(0);
        return true;
      },
      pause() {
        if (!supported || !active) return false;
        if (synth.paused) {
          synth.resume();
          return false;
        }
        synth.pause();
        return true;
      },
      repeat() {
        if (!supported) return;
        active = true;
        play(index);
      },
      next() {
        if (!supported) return;
        active = true;
        play(Math.min(index + 1, sentences.length - 1));
      },
      cancel() {
        active = false;
        run += 1;
        if (synth) synth.cancel();
      }
    };
  }

  async function setupDigitalPresenter() {
    const card = document.querySelector("[data-presenter-card]");
    if (!card) return;

    const labels = welcomeGuideUi[lang] || welcomeGuideUi.pl;
    const experience = presenterExperienceCopy();
    const recording = card.querySelector("[data-presenter-audio]");
    const stage = card.querySelector("[data-presenter-stage]");
    const stageHit = card.querySelector("[data-presenter-stage-hit]");
    const video = card.querySelector("[data-presenter-video]");
    const cartoon = card.querySelector("[data-presenter-cartoon]");
    const cartoonPropCard = card.querySelector("[data-cartoon-prop-card]");
    const cartoonPropImage = card.querySelector("[data-cartoon-prop-image]");
    const cartoonPropIcon = card.querySelector("[data-cartoon-prop-icon]");
    const cartoonPropLabel = card.querySelector("[data-cartoon-prop-label]");
    const cartoonPropCounter = card.querySelector("[data-cartoon-prop-counter]");
    const cartoonPhotoSource = card.querySelector("[data-cartoon-photo-source]");
    const photoOpen = card.querySelector("[data-presenter-photo-open]");
    const photoOverlay = card.querySelector("[data-presenter-photo-overlay]");
    const photoClose = card.querySelector("[data-presenter-photo-close]");
    const photoImage = card.querySelector("[data-presenter-photo-image]");
    const photoTitle = card.querySelector("[data-presenter-photo-title]");
    const photoSource = card.querySelector("[data-presenter-photo-source]");
    const cartoonRuleBadge = card.querySelector("[data-cartoon-rule-badge]");
    const guideCharacter = card.querySelector("[data-guide-character]");
    const guideFocusRing = card.querySelector("[data-guide-focus-ring]");
    const guideComparison = card.querySelector("[data-guide-comparison]");
    const guideComparisonWrong = card.querySelector("[data-guide-comparison-wrong]");
    const guideComparisonRight = card.querySelector("[data-guide-comparison-right]");
    const stageCaption = card.querySelector("[data-presenter-caption]");
    const sceneCurrent = card.querySelector("[data-presenter-scene-current]");
    const sceneTotal = card.querySelector("[data-presenter-scene-total]");
    const script = card.querySelector("[data-presenter-script]");
    const chapterTitle = card.querySelector("[data-presenter-chapter-title]");
    const chaptersNav = card.querySelector("[data-presenter-chapters]");
    const chapterSelect = card.querySelector("[data-presenter-chapter-select]");
    const stepRail = card.querySelector("[data-presenter-step-rail]");
    const groupLabel = card.querySelector("[data-presenter-group-label]");
    const transcript = card.querySelector("[data-presenter-transcript]");
    const currentLabel = card.querySelector("[data-presenter-current]");
    const totalLabel = card.querySelector("[data-presenter-total]");
    const timeLabel = card.querySelector("[data-presenter-time]");
    const durationLabel = card.querySelector("[data-presenter-duration]");
    const seek = card.querySelector("[data-presenter-seek]");
    const rateControl = card.querySelector("[data-presenter-rate]");
    const overallProgress = card.querySelector("[data-presenter-overall-progress]");
    const playButton = card.querySelector("[data-presenter-play]");
    const playIcon = card.querySelector("[data-presenter-play-icon]");
    const playLabel = card.querySelector("[data-presenter-play-label]");
    const previousButton = card.querySelector("[data-presenter-previous]");
    const nextButton = card.querySelector("[data-presenter-next]");
    const nextButtonLabel = card.querySelector("[data-presenter-next-label]");
    const stopButton = card.querySelector("[data-presenter-stop]");
    const contextLink = card.querySelector("[data-presenter-context-link]");
    const contextLinkIcon = card.querySelector("[data-presenter-context-icon]");
    const contextLinkLabel = card.querySelector("[data-presenter-context-label]");
    const trackOverlay = card.querySelector("[data-presenter-path-overlay]");
    const trackGrid = card.querySelector("[data-presenter-path-grid]");
    const trackButton = card.querySelector("[data-presenter-track-button]");
    const trackIcon = card.querySelector("[data-presenter-track-icon]");
    const trackProgress = card.querySelector("[data-presenter-track-progress]");
    const fullscreenButton = card.querySelector("[data-presenter-fullscreen]");
    const helpButton = card.querySelector("[data-presenter-help-button]");
    const helpOverlay = card.querySelector("[data-presenter-help-overlay]");
    const helpClose = card.querySelector("[data-presenter-help-close]");
    const helpReturn = card.querySelector("[data-presenter-help-return]");
    const helpSlow = card.querySelector("[data-presenter-help-slow]");
    const helpVisual = card.querySelector("[data-presenter-help-visual]");
    const helpText = card.querySelector("[data-presenter-help-text]");
    const helpSentence = card.querySelector("[data-presenter-help-sentence]");
    const helpFull = card.querySelector("[data-presenter-help-full]");
    const quizOverlay = card.querySelector("[data-presenter-quiz]");
    const quizQuestion = card.querySelector("[data-presenter-quiz-question]");
    const quizFeedback = card.querySelector("[data-presenter-quiz-feedback]");
    const quizNext = card.querySelector("[data-presenter-quiz-next]");
    const quizRepeat = card.querySelector("[data-presenter-quiz-repeat]");
    const quizContinue = card.querySelector("[data-presenter-quiz-continue]");
    const completeToast = card.querySelector("[data-presenter-complete-toast]");
    if (!recording || !playButton) return;

    const engineQuery = new URLSearchParams(location.search).get("engine");
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phoneLayout = window.matchMedia && window.matchMedia("(max-width: 620px), (max-height: 520px)").matches;
    const constrainedDevice = Boolean(
      reducedMotion || connection?.saveData ||
      (Number(navigator.deviceMemory) > 0 && Number(navigator.deviceMemory) <= 2) ||
      (Number(navigator.hardwareConcurrency) > 0 && Number(navigator.hardwareConcurrency) <= 2)
    );
    const engineMode = engineQuery === "lite" || engineQuery === "full"
      ? engineQuery
      : constrainedDevice ? "lite" : phoneLayout ? "mobile" : "full";
    card.dataset.engine = engineMode;
    const avatarQuery = new URLSearchParams(location.search).get("avatar");
    const humanVideoPath = "assets/avatar/presenter-human-gesture-v1.mp4";
    const supportsHumanVideo = Boolean(video && video.canPlayType && video.canPlayType('video/mp4; codecs="avc1.42E01E"'));
    const useHumanVideo = avatarQuery !== "cartoon" && engineMode !== "lite" && !reducedMotion && supportsHumanVideo;
    card.dataset.avatarPreference = useHumanVideo ? "human" : "cartoon";

    const touchToStart = text(tx(
      "Dotknij, aby włączyć głos", "Touch to enable voice", "Торкніться, щоб увімкнути голос",
      "Коснитесь, чтобы включить голос", "Səsi açmaq üçün toxunun", "Toca para activar la voz",
      "Pindutin para marinig ang boses", "Sentuh untuk mengaktifkan suara", "आवाज सुरु गर्न छुनुहोस्"
    ));
    if (stage) {
      stage.dataset.voicePrompt = touchToStart;
      stage.setAttribute("aria-label", touchToStart);
    }
    const fullGuideUrl = `assets/content/presenter-guide.json${assetVersion ? `?v=${encodeURIComponent(assetVersion)}` : ""}`;
    const fallbackSentences = guideText(lang, getLocationName());
    const fallbackChapter = {
      id: "welcome",
      title: text(tx("Przed rozpoczęciem", "Before you start", "Перед початком", "Перед началом", "Başlamazdan əvvəl", "Antes de empezar", "Bago magsimula", "Sebelum mulai", "सुरु गर्नु अघि")),
      text: fallbackSentences.join(" "),
      legacyAudio: `assets/audio/male/intro-${lang}.mp3`,
      sourceIndex: 0
    };

    const trackOrders = { warehouse: [], greenhouse: [], before: [], waiting: [], all: [] };
    const chapterQuizIndex = {
      welcome: 1,
      arrival: 2,
      warehouse: 0,
      greenhouse: 19,
      reader: 4,
      tablet: 25,
      safety: 16,
      documents: 15,
      help: 27
    };
    const progressKey = "cx-presenter-progress-v3";
    const savedProgress = (() => {
      try {
        const parsed = JSON.parse(localStorage.getItem(progressKey) || "{}");
        return {
          track: trackOrders[parsed.track] ? parsed.track : "",
          completed: Array.isArray(parsed.completed) ? parsed.completed.filter((id) => typeof id === "string") : [],
          chapter: typeof parsed.chapter === "string" ? parsed.chapter : "",
          position: Number.isFinite(Number(parsed.position)) ? Math.max(0, Number(parsed.position)) : 0,
          rate: [0.8, 0.85, 1, 1.1].includes(Number(parsed.rate)) ? Number(parsed.rate) : 1
        };
      } catch (error) {
        return { track: "", completed: [], chapter: "", position: 0, rate: 1 };
      }
    })();
    if (rateControl) rateControl.value = String(savedProgress.rate);
    recording.playbackRate = savedProgress.rate;
    const requestedTrack = new URLSearchParams(location.search).get("track") || "";
    let selectedTrack = Object.hasOwn(trackOrders, requestedTrack) ? requestedTrack : savedProgress.track;
    let completedChapters = new Set(savedProgress.completed);
    let allChapters = [fallbackChapter];
    let chapters = [fallbackChapter];
    let chapterIndex = 0;
    let waitingForGesture = false;
    let loadToken = 0;
    let chapterSentences = [];
    let sentenceBreakpoints = [];
    let activeSentenceIndex = -1;
    let quizResolved = false;
    let currentQuizItem = null;
    let audioContext = null;
    let audioAnalyser = null;
    let audioWave = null;
    let audioWarmth = null;
    let audioPresence = null;
    let audioCompressor = null;
    let audioMotionFrame = 0;
    let lastAudioMotionSample = 0;
    let activeFocus = null;
    let autoAdvanceTimer = 0;
    let focusResizeObserver = null;
    let pendingResumeSeconds = 0;
    let lastProgressSave = 0;
    let activeVideoOffset = 0;

    const formatTime = (seconds) => {
      const safe = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
      return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
    };

    const chapterAudioUrl = (chapter, index) => chapter.legacyAudio ||
      `assets/audio/guide/${lang}/${String((Number.isInteger(chapter.sourceIndex) ? chapter.sourceIndex : index) + 1).padStart(2, "0")}-${chapter.id}.mp3${assetVersion ? `?v=${encodeURIComponent(assetVersion)}` : ""}`;
    const visualAsset = (path) => {
      if (!path || !assetVersion) return path || "";
      return `${path}${path.includes("?") ? "&" : "?"}v=${encodeURIComponent(assetVersion)}`;
    };
    const cartoonCueSequences = {
      welcome: [
        { icon: "👋", gesture: "open" },
        { icon: "🗺️", gesture: "show-right" },
        { image: "assets/warehouse/magazyn-wejscie-1.jpg", icon: "📦", gesture: "show-right" },
        { image: "assets/greenhouse-orientation/orientacja-ogolna.svg", icon: "🍅", gesture: "show-left" },
        { image: "assets/inline/reader_start.jpg", icon: "📟", gesture: "show-right" },
        { image: "assets/tablet/tablet-login-pin.jpg", icon: "📱", gesture: "show-right" },
        { icon: "⚠️", gesture: "warning" },
        { icon: "☎️", gesture: "show-right" }
      ],
      arrival: [
        { icon: "📍", gesture: "show-right" },
        { icon: "🗺️", gesture: "show-right" },
        { image: "assets/warehouse/magazyn-wejscie-1.jpg", icon: "🚪", gesture: "show-right" },
        { icon: "⏳", gesture: "nod" }
      ],
      warehouse: [
        { image: "assets/warehouse/magazyn-wejscie-1.jpg", icon: "🏭", gesture: "show-right" },
        { image: "assets/warehouse/magazyn-wejscie-2.jpg", icon: "🚪", gesture: "show-left" },
        { icon: "🚫📟", gesture: "warning" },
        { image: "assets/tablet/tablet-start-work.jpg", icon: "📱", gesture: "show-right" }
      ],
      greenhouse: [
        { image: "assets/greenhouse-orientation/orientacja-ogolna.svg", icon: "🌿", gesture: "show-right" },
        { image: "assets/greenhouse-orientation/nawa.svg", icon: "↔️", gesture: "show-left" },
        { image: "assets/inline/reader_start.jpg", icon: "📟", gesture: "show-right" },
        { icon: "🏷️", gesture: "show-right" },
        { image: "assets/greenhouse-orientation/przejscie.svg", icon: "🚶", gesture: "show-left" }
      ],
      reader: [
        { image: "assets/inline/reader_start.jpg", icon: "📟", gesture: "show-right" },
        { icon: "1️⃣", gesture: "nod" },
        { icon: "2️⃣", gesture: "nod" },
        { image: "assets/inline/cart_pl.jpg", icon: "🍅", gesture: "show-right" },
        { image: "assets/inline/stage34_1.jpg", icon: "🏷️", gesture: "show-left" },
        { image: "assets/inline/restart_1.jpg", icon: "🔄", gesture: "show-right" }
      ],
      tablet: [
        { image: "assets/tablet/tablet-login-pin.jpg", icon: "🔐", gesture: "show-right" },
        { image: "assets/tablet/tablet-start-work.jpg", icon: "▶️", gesture: "show-right" },
        { image: "assets/tablet/tablet-activity.jpg", icon: "🧤", gesture: "show-left" },
        { image: "assets/tablet/tablet-change-activity.jpg", icon: "🔁", gesture: "show-right" },
        { image: "assets/tablet/tablet-break-start.jpg", icon: "☕", gesture: "show-left" },
        { image: "assets/tablet/tablet-work-end.jpg", icon: "🏁", gesture: "show-right" },
        { image: "assets/tablet/tablet-logout.jpg", icon: "🚪", gesture: "nod" }
      ],
      safety: [
        { icon: "⚠️", gesture: "warning" },
        { icon: "🚫🍔", gesture: "warning" },
        { icon: "🚫📱", gesture: "warning" },
        { icon: "🚭", gesture: "warning" },
        { icon: "🧼👐", gesture: "show-right" },
        { icon: "🚫🎧", gesture: "warning" },
        { icon: "⛔", gesture: "nod" }
      ],
      documents: [
        { icon: "🛂", gesture: "show-right" },
        { icon: "📄", gesture: "show-right" },
        { icon: "🏛️", gesture: "show-left" },
        { icon: "🏦", gesture: "show-right" },
        { icon: "📦➡️📮", gesture: "show-left" }
      ],
      help: [
        { icon: "☎️", gesture: "show-right" },
        { icon: "💬", gesture: "show-left" },
        { icon: "🏥", gesture: "show-right" },
        { icon: "🦷", gesture: "show-left" },
        { icon: "🆘 112", gesture: "warning" }
      ],
      finish: [
        { icon: "📝", gesture: "show-right" },
        { icon: "✅", gesture: "nod" },
        { icon: "🦺", gesture: "show-left" },
        { icon: "❓➡️👷", gesture: "open" }
      ]
    };
    const cartoonCueEnhancements = {
      welcome: [
        { pose: "neutral", side: "right" },
        { image: "assets/guide/arrival-route-v1.svg", pose: "right", side: "right" },
        { pose: "right", side: "right", focus: [64, 58, 24, 28] },
        { pose: "left", side: "left" },
        { pose: "reader", side: "right" },
        { pose: "tablet", side: "right" },
        { pose: "warning", side: "right" },
        { pose: "right", side: "right" }
      ],
      arrival: [
        { image: "assets/guide/arrival-route-v1.svg", pose: "right", side: "right" },
        { image: "assets/guide/arrival-route-v1.svg", pose: "right", side: "right" },
        { pose: "right", side: "right", focus: [64, 58, 24, 28] },
        { pose: "neutral", side: "right" }
      ],
      warehouse: [
        { pose: "right", side: "right", focus: [64, 58, 24, 28] },
        { pose: "left", side: "left", focus: [52, 58, 28, 31] },
        { pose: "warning", side: "right" },
        { pose: "tablet", side: "right" }
      ],
      greenhouse: [
        { pose: "right", side: "right" },
        { pose: "left", side: "left" },
        { pose: "reader", side: "right" },
        { pose: "reader", side: "right" },
        { pose: "left", side: "left" }
      ],
      reader: [
        { image: "assets/inline/reader_start.jpg", pose: "reader", side: "right" },
        { image: "assets/inline/stage12_1.jpg", pose: "reader", side: "right" },
        { image: "assets/inline/stage12_2.jpg", pose: "reader", side: "right" },
        { image: "assets/inline/cart_pl.jpg", pose: "reader", side: "right" },
        { image: "assets/inline/stage34_1.jpg", pose: "reader", side: "right" },
        { image: "assets/inline/restart_1.jpg", pose: "reader", side: "right" }
      ],
      tablet: [
        { pose: "tablet", side: "right", focus: [77, 50, 30, 72] },
        { pose: "tablet", side: "right" },
        { pose: "tablet", side: "right" },
        { pose: "tablet", side: "right" },
        { pose: "tablet", side: "right" },
        { pose: "tablet", side: "right" },
        { pose: "tablet", side: "right" }
      ],
      safety: Array.from({ length: 7 }, () => ({ pose: "warning", side: "right" })),
      documents: Array.from({ length: 5 }, (_, index) => ({ pose: index % 2 ? "left" : "right", side: index % 2 ? "left" : "right" })),
      help: Array.from({ length: 5 }, (_, index) => ({ pose: index === 4 ? "warning" : "right", side: "right" })),
      finish: [
        { pose: "right", side: "right" },
        { pose: "neutral", side: "right" },
        { pose: "left", side: "left" },
        { pose: "neutral", side: "right" }
      ]
    };
    const safetyCueCopy = {
      pl: [
        { badge: "WAŻNE", label: "Zasady obowiązują w szklarni i magazynie", tone: "caution" },
        { badge: "ZAKAZ", label: "Jedzenie, napoje i rzeczy prywatne poza strefą pracy", tone: "danger" },
        { badge: "ZAKAZ", label: "Nie używaj cudzego PIN-u, taga ani readera", tone: "danger" },
        { badge: "ZAKAZ", label: "Nie wchodź do innej strefy bez polecenia", tone: "danger" },
        { badge: "OBOWIĄZEK", label: "Dbaj o czyste ręce i rękawiczki", tone: "required" },
        { badge: "ZAKAZ", label: "Bez telefonu, zdjęć i słuchawek w pracy", tone: "danger" },
        { badge: "STOP", label: "Używaj tylko wydanego sprzętu i własnych danych", tone: "stop" }
      ],
      en: [
        { badge: "IMPORTANT", label: "The rules apply in the greenhouse and warehouse", tone: "caution" },
        { badge: "PROHIBITED", label: "Keep food, drinks and private items outside the work zone", tone: "danger" },
        { badge: "PROHIBITED", label: "Never use another person's PIN, tag or reader", tone: "danger" },
        { badge: "PROHIBITED", label: "Do not enter another zone without instruction", tone: "danger" },
        { badge: "REQUIRED", label: "Keep your hands and gloves clean", tone: "required" },
        { badge: "PROHIBITED", label: "No phone, photos or headphones at work", tone: "danger" },
        { badge: "STOP", label: "Use only issued equipment and your own data", tone: "stop" }
      ],
      ua: [
        { badge: "ВАЖЛИВО", label: "Правила діють у теплиці й на складі", tone: "caution" },
        { badge: "ЗАБОРОНЕНО", label: "Їжа, напої та особисті речі — поза робочою зоною", tone: "danger" },
        { badge: "ЗАБОРОНЕНО", label: "Не використовуйте чужий PIN, тег або рідер", tone: "danger" },
        { badge: "ЗАБОРОНЕНО", label: "Не входьте в іншу зону без вказівки", tone: "danger" },
        { badge: "ОБОВ’ЯЗКОВО", label: "Тримайте руки й рукавички чистими", tone: "required" },
        { badge: "ЗАБОРОНЕНО", label: "Без телефону, фото й навушників на роботі", tone: "danger" },
        { badge: "СТОП", label: "Використовуйте лише видане обладнання і власні дані", tone: "stop" }
      ],
      ru: [
        { badge: "ВАЖНО", label: "Правила действуют в теплице и на складе", tone: "caution" },
        { badge: "ЗАПРЕЩЕНО", label: "Еда, напитки и личные вещи — вне рабочей зоны", tone: "danger" },
        { badge: "ЗАПРЕЩЕНО", label: "Не используйте чужой PIN, тег или ридер", tone: "danger" },
        { badge: "ЗАПРЕЩЕНО", label: "Не входите в другую зону без указания", tone: "danger" },
        { badge: "ОБЯЗАТЕЛЬНО", label: "Держите руки и перчатки чистыми", tone: "required" },
        { badge: "ЗАПРЕЩЕНО", label: "Без телефона, фото и наушников на работе", tone: "danger" },
        { badge: "СТОП", label: "Используйте только выданное оборудование и свои данные", tone: "stop" }
      ],
      az: [
        { badge: "VACİB", label: "Qaydalar istixanada və anbarda qüvvədədir", tone: "caution" },
        { badge: "QADAĞANDIR", label: "Yemək, içki və şəxsi əşyalar iş zonasından kənarda qalmalıdır", tone: "danger" },
        { badge: "QADAĞANDIR", label: "Başqasının PIN-i, tagı və reader-indən istifadə etməyin", tone: "danger" },
        { badge: "QADAĞANDIR", label: "Tapşırıq olmadan başqa zonaya girməyin", tone: "danger" },
        { badge: "MÜTLƏQDİR", label: "Əlləri və əlcəkləri təmiz saxlayın", tone: "required" },
        { badge: "QADAĞANDIR", label: "İşdə telefon, foto və qulaqlıqdan istifadə etməyin", tone: "danger" },
        { badge: "DAYAN", label: "Yalnız verilmiş avadanlıqdan və öz məlumatlarınızdan istifadə edin", tone: "stop" }
      ],
      es: [
        { badge: "IMPORTANTE", label: "Las reglas se aplican en el invernadero y el almacén", tone: "caution" },
        { badge: "PROHIBIDO", label: "Comida, bebidas y objetos personales fuera de la zona de trabajo", tone: "danger" },
        { badge: "PROHIBIDO", label: "No uses el PIN, tag ni reader de otra persona", tone: "danger" },
        { badge: "PROHIBIDO", label: "No entres en otra zona sin indicación", tone: "danger" },
        { badge: "OBLIGATORIO", label: "Mantén limpias las manos y los guantes", tone: "required" },
        { badge: "PROHIBIDO", label: "Sin teléfono, fotos ni auriculares en el trabajo", tone: "danger" },
        { badge: "ALTO", label: "Usa solo el equipo entregado y tus propios datos", tone: "stop" }
      ],
      fil: [
        { badge: "MAHALAGA", label: "Ang mga patakaran ay para sa bahay-taniman at bodega", tone: "caution" },
        { badge: "BAWAL", label: "Pagkain, inumin at personal na gamit ay sa labas ng work zone", tone: "danger" },
        { badge: "BAWAL", label: "Huwag gamitin ang PIN, tag o reader ng ibang tao", tone: "danger" },
        { badge: "BAWAL", label: "Huwag pumasok sa ibang zone kung walang utos", tone: "danger" },
        { badge: "KAILANGAN", label: "Panatilihing malinis ang kamay at guwantes", tone: "required" },
        { badge: "BAWAL", label: "Walang telepono, larawan o headphone sa trabaho", tone: "danger" },
        { badge: "HINTO", label: "Gamitin lang ang ibinigay na kagamitan at sarili mong data", tone: "stop" }
      ],
      id: [
        { badge: "PENTING", label: "Aturan berlaku di rumah kaca dan gudang", tone: "caution" },
        { badge: "DILARANG", label: "Makanan, minuman dan barang pribadi di luar area kerja", tone: "danger" },
        { badge: "DILARANG", label: "Jangan gunakan PIN, tag atau reader milik orang lain", tone: "danger" },
        { badge: "DILARANG", label: "Jangan masuk ke zona lain tanpa instruksi", tone: "danger" },
        { badge: "WAJIB", label: "Jaga tangan dan sarung tangan tetap bersih", tone: "required" },
        { badge: "DILARANG", label: "Tanpa telepon, foto atau headphone saat bekerja", tone: "danger" },
        { badge: "STOP", label: "Gunakan hanya peralatan yang diberikan dan data Anda sendiri", tone: "stop" }
      ],
      ne: [
        { badge: "महत्त्वपूर्ण", label: "नियम ग्रीनहाउस र गोदाम दुवैमा लागू हुन्छन्", tone: "caution" },
        { badge: "निषेध", label: "खाना, पेय र निजी सामान काम क्षेत्र बाहिर राख्नुहोस्", tone: "danger" },
        { badge: "निषेध", label: "अरूको PIN, tag वा reader प्रयोग नगर्नुहोस्", tone: "danger" },
        { badge: "निषेध", label: "निर्देशन बिना अर्को क्षेत्रमा नजानुहोस्", tone: "danger" },
        { badge: "अनिवार्य", label: "हात र पञ्जा सफा राख्नुहोस्", tone: "required" },
        { badge: "निषेध", label: "काममा फोन, फोटो वा हेडफोन प्रयोग नगर्नुहोस्", tone: "danger" },
        { badge: "रोक्नुहोस्", label: "दिइएको उपकरण र आफ्नै डाटा मात्र प्रयोग गर्नुहोस्", tone: "stop" }
      ]
    };
    const cartoonPoseNames = new Set(["neutral", "right", "left", "warning", "reader", "tablet"]);
    const cartoonRigFiles = [
      "assets/avatar/cartoon/head-v1.png",
      "assets/avatar/cartoon/torso-v1.png",
      "assets/avatar/cartoon/arm-left-v2.png",
      "assets/avatar/cartoon/arm-right-v3.png"
    ];
    const cueVerdicts = {
      welcome: ["info", "correct", "correct", "correct", "correct", "correct", "wrong", "info"],
      arrival: ["info", "correct", "correct", "info"],
      warehouse: ["correct", "correct", "wrong", "correct"],
      greenhouse: ["correct", "correct", "correct", "correct", "correct"],
      reader: ["correct", "correct", "correct", "correct", "correct", "correct"],
      tablet: ["correct", "correct", "correct", "correct", "correct", "correct", "correct"],
      safety: ["info", "wrong", "wrong", "wrong", "correct", "wrong", "wrong"],
      documents: ["info", "correct", "correct", "correct", "wrong"],
      help: ["info", "info", "correct", "correct", "correct"],
      finish: ["correct", "correct", "correct", "info"]
    };
    const cueComparisons = {
      warehouse: [false, false, true, false],
      safety: [false, true, true, true, false, true, true]
    };
    const enhancedCartoonCue = (chapterId, cueIndex, cue) => {
      const verdict = cueVerdicts[chapterId]?.[cueIndex] || "info";
      return {
        ...cue,
        verdict,
        comparison: Boolean(cueComparisons[chapterId]?.[cueIndex]),
        ...(cartoonCueEnhancements[chapterId]?.[cueIndex] || {}),
        ...(chapterId === "safety" ? ((safetyCueCopy[lang] || safetyCueCopy.pl)[cueIndex] || {}) : {})
      };
    };
    const presenterPreloads = [];
    const presenterPreloadPaths = new Set();
    const preloadVisual = (path, priority = "auto") => {
      if (!path) return null;
      const resolvedPath = visualAsset(path);
      if (presenterPreloadPaths.has(resolvedPath)) return null;
      presenterPreloadPaths.add(resolvedPath);
      const preload = new Image();
      preload.decoding = "async";
      preload.fetchPriority = priority;
      preload.src = resolvedPath;
      if (typeof preload.decode === "function") preload.decode().catch(() => {});
      presenterPreloads.push(preload);
      return preload;
    };
    const preloadPresenterVisuals = () => {
      const paths = new Set(cartoonRigFiles);
      if (engineMode === "full") {
        Object.entries(cartoonCueSequences).forEach(([chapterId, sequence]) => {
          sequence.forEach((cue, cueIndex) => {
            const enhanced = enhancedCartoonCue(chapterId, cueIndex, cue);
            if (enhanced.image) paths.add(enhanced.image);
          });
        });
      }
      paths.forEach((path) => preloadVisual(path));
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(preloadPresenterVisuals, { timeout: 1200 });
    else window.setTimeout(preloadPresenterVisuals, 350);
    let activeCueKey = "";
    let cueAnimationTimer = 0;

    const updateGuideFocusPosition = () => {
      if (!guideFocusRing || !cartoonPropImage || !activeFocus || cartoonPropImage.hidden || !cartoonPropImage.naturalWidth) return;
      const frame = cartoonPropImage.parentElement;
      if (!frame || !frame.clientWidth || !frame.clientHeight) return;
      const scale = Math.min(frame.clientWidth / cartoonPropImage.naturalWidth, frame.clientHeight / cartoonPropImage.naturalHeight);
      const renderedWidth = cartoonPropImage.naturalWidth * scale;
      const renderedHeight = cartoonPropImage.naturalHeight * scale;
      const offsetX = (frame.clientWidth - renderedWidth) / 2;
      const offsetY = (frame.clientHeight - renderedHeight) / 2;
      guideFocusRing.style.setProperty("--focus-x", `${offsetX + (activeFocus[0] / 100) * renderedWidth}px`);
      guideFocusRing.style.setProperty("--focus-y", `${offsetY + (activeFocus[1] / 100) * renderedHeight}px`);
      guideFocusRing.style.setProperty("--focus-w", `${Math.max(18, (activeFocus[2] / 100) * renderedWidth)}px`);
      guideFocusRing.style.setProperty("--focus-h", `${Math.max(18, (activeFocus[3] / 100) * renderedHeight)}px`);
    };

    const applyCartoonCue = (sentenceIndex = 0, force = false) => {
      if (!cartoon || !chapters[chapterIndex]) return;
      const chapter = chapters[chapterIndex];
      const chapterHasVisual = Boolean(chapter.image);
      const metadataCue = {
        image: chapter.image || "",
        icon: chapter.icon || "•",
        pose: chapter.pose || "right",
        tone: chapter.tone || "neutral",
        focus: chapter.focus || null,
        side: chapter.pose === "left" ? "left" : "right",
        gesture: chapter.pose === "left" ? "show-left" : chapter.pose === "warning" ? "warning" : chapter.pose === "neutral" ? "nod" : "show-right",
        label: chapter.title,
        verdict: chapter.tone === "danger" ? "wrong" : chapter.tone === "required" ? "correct" : "info"
      };
      const cueGroup = chapter.group === "start" ? "welcome" : chapter.group;
      const sentenceTotal = Math.max(1, chapterSentences.length);
      const poseCycles = {
        welcome: ["neutral", "right", "left", "neutral"],
        arrival: ["right", "left", "neutral", "right"],
        warehouse: ["right", "neutral", "left", "right"],
        greenhouse: ["right", "left", "neutral", "right"],
        reader: ["reader", "left", "reader", "right"],
        tablet: ["tablet", "right", "tablet", "left"],
        safety: ["warning", "right", "warning", "left"],
        documents: ["right", "left", "neutral", "right"],
        help: ["right", "neutral", "left", "right"],
        finish: ["neutral", "right", "left", "neutral"]
      };
      const gestureCycle = ["show-right", "nod", "show-left", "open"];
      const chapterPoseCycle = poseCycles[cueGroup] || poseCycles.welcome;
      const visualSequence = Array.from({ length: sentenceTotal }, (_, index) => {
        const danger = chapter.tone === "danger";
        const pose = index === 0 ? metadataCue.pose : danger ? "warning" : chapterPoseCycle[index % chapterPoseCycle.length];
        const gesture = danger ? "warning" : pose === "warning" ? "warning" : gestureCycle[index % gestureCycle.length];
        return {
          ...metadataCue,
          pose,
          gesture,
          side: pose === "left" || gesture === "show-left" ? "left" : "right"
        };
      });
      const sequence = chapterHasVisual ? visualSequence : (cartoonCueSequences[cueGroup] || cartoonCueSequences.welcome);
      const fraction = sentenceTotal <= 1 ? 0 : sentenceIndex / (sentenceTotal - 1);
      const cueIndex = chapterHasVisual
        ? Math.max(0, Math.min(sequence.length - 1, sentenceIndex))
        : Math.min(sequence.length - 1, Math.floor(fraction * sequence.length));
      const cue = chapterHasVisual
        ? (sequence[cueIndex] || sequence[0])
        : enhancedCartoonCue(cueGroup, cueIndex, sequence[cueIndex] || sequence[0]);
      const cueKey = `${chapter.id}:${cueIndex}:${sentenceIndex}`;
      if (!force && cueKey === activeCueKey) return;
      activeCueKey = cueKey;

      card.dataset.scenePhase = String(sentenceIndex % 4);
      if (sceneCurrent) sceneCurrent.textContent = String(Math.min(sentenceTotal, sentenceIndex + 1));
      if (sceneTotal) sceneTotal.textContent = String(sentenceTotal);
      cartoon.dataset.prop = cueGroup;
      cartoon.dataset.cue = String(cueIndex);
      cartoon.dataset.side = cue.side || "right";
      cartoon.dataset.tone = cue.tone || (cue.verdict === "wrong" ? "danger" : cue.verdict === "correct" ? "required" : "neutral");
      cartoon.dataset.visual = cue.image && (/^https?:\/\//i.test(cue.image) || /\.(?:jpe?g|png|webp)(?:\?|$)/i.test(cue.image)) ? "photo" : "diagram";
      card.dataset.hasVisual = cue.image ? "true" : "false";
      card.dataset.gesture = cue.gesture || "show-right";
      const poseName = cartoonPoseNames.has(cue.pose) ? cue.pose : "neutral";
      if (guideCharacter) {
        guideCharacter.dataset.pose = poseName;
        guideCharacter.dataset.rig = "parts";
        guideCharacter.dataset.expression = cue.gesture === "warning" || cue.verdict === "wrong" || ["danger", "caution", "stop"].includes(cue.tone)
          ? "warning"
          : cue.verdict === "correct" || cue.tone === "required"
            ? "positive"
            : "friendly";
        guideCharacter.dataset.look = cue.side === "left" ? "left" : "right";
      }
      const sentenceLabel = chapterSentences[sentenceIndex] || chapter.title;
      const liveLabel = cue.label && cue.label !== chapter.title ? cue.label : sentenceLabel;
      if (cartoonPropLabel) cartoonPropLabel.textContent = liveLabel;
      if (cartoonPropCounter) cartoonPropCounter.textContent = `${sentenceIndex + 1}/${sentenceTotal}`;
      if (cartoonRuleBadge) {
        const verdictBadge = cue.verdict === "wrong" ? experience.forbidden : cue.verdict === "correct" ? experience.correctBadge : experience.important;
        cartoonRuleBadge.hidden = false;
        cartoonRuleBadge.textContent = cue.badge || verdictBadge;
      }
      if (guideComparison) {
        guideComparison.hidden = !cue.comparison;
        if (guideComparisonWrong) guideComparisonWrong.textContent = `✕ ${experience.wrongShort}`;
        if (guideComparisonRight) guideComparisonRight.textContent = `✓ ${experience.rightShort}`;
      }
      if (cartoonPropImage) {
        cartoonPropImage.dataset.fallbackIcon = cue.icon || "\u2022";
        if (cue.image) {
          const imageSrc = visualAsset(cue.image);
          cartoonPropImage.hidden = false;
          if (cartoonPropImage.getAttribute("src") !== imageSrc) cartoonPropImage.src = imageSrc;
          cartoonPropImage.alt = chapter.title;
          if (cartoonPropImage.complete && cartoonPropImage.naturalWidth > 0) {
            cartoonPropImage.hidden = false;
            if (cartoonPropIcon) cartoonPropIcon.hidden = true;
          } else if (cartoonPropIcon) {
            cartoonPropIcon.hidden = false;
            cartoonPropIcon.textContent = cue.icon || "\u2022";
          }
        } else {
          cartoonPropImage.hidden = true;
          cartoonPropImage.removeAttribute("src");
          cartoonPropImage.alt = "";
          if (cartoonPropIcon) {
            cartoonPropIcon.hidden = false;
            cartoonPropIcon.textContent = cue.icon || "\u2022";
          }
        }
      } else if (cartoonPropIcon) {
        cartoonPropIcon.hidden = false;
        cartoonPropIcon.textContent = cue.icon || "\u2022";
      }
      if (photoOpen) {
        photoOpen.hidden = !cue.image;
        photoOpen.dataset.photoSrc = cue.image ? visualAsset(cue.image) : "";
        photoOpen.setAttribute("aria-label", `${experience.openPhoto}: ${chapter.title}`);
      }
      [cartoonPhotoSource, photoSource].forEach((link) => {
        if (!link) return;
        const hasSource = Boolean(chapter.sourceLabel && chapter.sourceUrl);
        link.hidden = !hasSource;
        if (hasSource) {
          link.href = chapter.sourceUrl;
          link.textContent = `${experience.source}: ${chapter.sourceLabel}`;
        } else {
          link.removeAttribute("href");
          link.textContent = "";
        }
      });
      if (photoImage && cue.image) {
        photoImage.src = visualAsset(cue.image);
        photoImage.alt = chapter.title;
      }
      if (photoTitle) photoTitle.textContent = chapter.title;
      if (guideFocusRing) {
        const focus = Array.isArray(cue.focus) ? cue.focus : null;
        activeFocus = focus;
        guideFocusRing.hidden = !focus || !cue.image;
        if (focus) {
          window.requestAnimationFrame(updateGuideFocusPosition);
        }
      }
      if (cartoonPropCard) {
        window.clearTimeout(cueAnimationTimer);
        cartoonPropCard.classList.remove("is-changing");
        void cartoonPropCard.offsetWidth;
        cartoonPropCard.classList.add("is-changing");
        cueAnimationTimer = window.setTimeout(() => {
          cartoonPropCard.classList.remove("is-changing");
        }, 440);
      }
    };

    if (cartoonPropImage) {
      cartoonPropImage.addEventListener("load", () => {
        cartoonPropImage.hidden = false;
        if (cartoonPropIcon) cartoonPropIcon.hidden = true;
        window.requestAnimationFrame(updateGuideFocusPosition);
      });
      cartoonPropImage.addEventListener("error", () => {
        cartoonPropImage.hidden = true;
        cartoonPropImage.removeAttribute("src");
        if (cartoonPropIcon) {
          cartoonPropIcon.hidden = false;
          cartoonPropIcon.textContent = cartoonPropImage.dataset.fallbackIcon || "\u2022";
        }
      });
      if ("ResizeObserver" in window && cartoonPropImage.parentElement) {
        focusResizeObserver = new ResizeObserver(updateGuideFocusPosition);
        focusResizeObserver.observe(cartoonPropImage.parentElement);
      }
    }
    const closePhotoOverlay = () => {
      if (photoOverlay) photoOverlay.hidden = true;
    };
    if (photoOpen) {
      photoOpen.addEventListener("click", (event) => {
        event.stopPropagation();
        const src = photoOpen.dataset.photoSrc;
        if (!src || !photoOverlay || !photoImage) return;
        recording.pause();
        if (video) video.pause();
        setPlaying(false);
        photoImage.src = src;
        photoOverlay.hidden = false;
      });
    }
    if (photoClose) photoClose.addEventListener("click", closePhotoOverlay);
    if (photoOverlay) {
      photoOverlay.addEventListener("click", (event) => {
        if (event.target === photoOverlay) closePhotoOverlay();
      });
    }

    const splitNarration = (value) => {
      const normalized = String(value || "").replace(/\s+/g, " ").trim();
      if (!normalized) return [];
      const sentences = normalized.match(/[^.!?…！？।]+(?:[.!?…！？।]+|$)/g)?.map((item) => item.trim()).filter(Boolean) || [normalized];
      return sentences.flatMap((sentence) => {
        if (sentence.length <= 150) return [sentence];
        const clauses = sentence.match(/[^,:;，；]+(?:[,:;，；]+|$)/g)?.map((item) => item.trim()).filter(Boolean) || [sentence];
        const pieces = clauses.flatMap((clause) => {
          if (clause.length <= 150) return [clause];
          const parts = [];
          let part = "";
          clause.split(/\s+/).forEach((word) => {
            const combined = part ? `${part} ${word}` : word;
            if (combined.length <= 150 || !part) part = combined;
            else {
              parts.push(part);
              part = word;
            }
          });
          if (part) parts.push(part);
          return parts;
        });
        const chunks = [];
        let current = "";
        pieces.forEach((piece) => {
          const combined = current ? `${current} ${piece}` : piece;
          if (combined.length <= 150 || !current) current = combined;
          else {
            chunks.push(current);
            current = piece;
          }
        });
        if (current) chunks.push(current);
        return chunks;
      });
    };

    const showSentence = (index, scroll = true) => {
      if (!chapterSentences.length) return;
      const safeIndex = Math.max(0, Math.min(chapterSentences.length - 1, Number(index) || 0));
      if (safeIndex === activeSentenceIndex) return;
      activeSentenceIndex = safeIndex;
      if (stageCaption) stageCaption.textContent = chapterSentences[safeIndex];
      applyCartoonCue(safeIndex);
      script.querySelectorAll("[data-presenter-sentence]").forEach((element) => {
        element.classList.toggle("is-current", Number(element.dataset.presenterSentence) === safeIndex);
      });
      const current = script.querySelector(`[data-presenter-sentence="${safeIndex}"]`);
      if (scroll && current) {
        const target = Math.max(0, current.offsetTop - Math.round(script.clientHeight * .34));
        script.scrollTo({ top: target, behavior: "smooth" });
      }
    };

    const prepareChapterText = (chapter) => {
      chapterSentences = splitNarration(chapter.text);
      const weights = chapterSentences.map((sentence) => Math.max(18, sentence.length + (/[!?！？]$/.test(sentence) ? 16 : 8)));
      const totalWeight = Math.max(1, weights.reduce((sum, weight) => sum + weight, 0));
      let running = 0;
      sentenceBreakpoints = weights.map((weight) => {
        running += weight;
        return running / totalWeight;
      });
      activeCueKey = "";
      activeSentenceIndex = -1;
      script.innerHTML = chapterSentences.map((sentence, index) =>
        `<span data-presenter-sentence="${index}">${esc(sentence)}</span>`
      ).join(" ");
      script.scrollTop = 0;
      showSentence(0, false);
    };

    const setPlaying = (playing) => {
      card.classList.toggle("is-speaking", playing);
      card.classList.remove("is-autoplay-blocked");
      if (!playing) {
        card.style.setProperty("--voice-level", "0");
        card.dataset.motionBeat = "0";
      }
      playIcon.textContent = playing ? "Ⅱ" : "▶";
      playLabel.textContent = playing ? labels.pause : labels.resume;
      playButton.setAttribute("aria-pressed", playing ? "true" : "false");
      if (stage) {
        stage.setAttribute("aria-pressed", playing ? "true" : "false");
        stage.setAttribute("aria-label", playing ? labels.pause : labels.resume);
      }
      if (stageHit) stageHit.setAttribute("aria-label", playing ? labels.pause : labels.resume);
    };

    const animateAudioMotion = (timestamp = performance.now()) => {
      window.cancelAnimationFrame(audioMotionFrame);
      if (!audioAnalyser || !audioWave || recording.paused || document.hidden) {
        card.style.setProperty("--voice-level", "0");
        return;
      }
      const sampleInterval = engineMode === "lite" ? 55 : engineMode === "mobile" ? 40 : 32;
      if (timestamp - lastAudioMotionSample < sampleInterval) {
        audioMotionFrame = window.requestAnimationFrame(animateAudioMotion);
        return;
      }
      lastAudioMotionSample = timestamp;
      audioAnalyser.getByteTimeDomainData(audioWave);
      let energy = 0;
      for (let index = 0; index < audioWave.length; index += 1) {
        const sample = (audioWave[index] - 128) / 128;
        energy += sample * sample;
      }
      const rms = Math.sqrt(energy / audioWave.length);
      /* Keep the mouth almost closed during pauses and open it from the actual
         voice energy. The former fixed minimum made every language look dubbed. */
      const level = rms < .014 ? .015 : Math.max(.04, Math.min(1, (rms - .01) * 10.8));
      card.style.setProperty("--voice-level", level.toFixed(3));
      audioMotionFrame = window.requestAnimationFrame(animateAudioMotion);
    };

    const ensureAudioMotion = () => {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      try {
        if (!audioContext) {
          audioContext = new AudioContextClass();
          const source = audioContext.createMediaElementSource(recording);
          audioAnalyser = audioContext.createAnalyser();
          audioAnalyser.fftSize = 256;
          audioAnalyser.smoothingTimeConstant = .72;
          audioWave = new Uint8Array(audioAnalyser.fftSize);
          audioWarmth = audioContext.createBiquadFilter();
          audioWarmth.type = "lowshelf";
          audioWarmth.frequency.value = 135;
          audioWarmth.gain.value = 1.8;
          audioPresence = audioContext.createBiquadFilter();
          audioPresence.type = "peaking";
          audioPresence.frequency.value = 2700;
          audioPresence.Q.value = .85;
          audioPresence.gain.value = 2.6;
          audioCompressor = audioContext.createDynamicsCompressor();
          audioCompressor.threshold.value = -22;
          audioCompressor.knee.value = 16;
          audioCompressor.ratio.value = 2.4;
          audioCompressor.attack.value = .012;
          audioCompressor.release.value = .18;
          source.connect(audioWarmth);
          audioWarmth.connect(audioPresence);
          audioPresence.connect(audioCompressor);
          audioCompressor.connect(audioAnalyser);
          audioAnalyser.connect(audioContext.destination);
        }
        if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
      } catch (error) {
        audioAnalyser = null;
        audioWave = null;
      }
    };

    const updateProgress = () => {
      const duration = Number.isFinite(recording.duration) ? recording.duration : 0;
      const current = Number.isFinite(recording.currentTime) ? recording.currentTime : 0;
      const fraction = duration > 0 ? Math.min(1, current / duration) : 0;
      const motionBeat = Math.floor(current / 2.4) % 4;
      if (card.dataset.motionBeat !== String(motionBeat)) card.dataset.motionBeat = String(motionBeat);
      card.style.setProperty("--speech-progress", fraction.toFixed(4));
      seek.value = String(Math.round(fraction * 1000));
      timeLabel.textContent = formatTime(current);
      durationLabel.textContent = formatTime(duration);
      const totalFraction = chapters.length ? (chapterIndex + fraction) / chapters.length : 0;
      overallProgress.style.width = `${Math.min(100, Math.max(0, totalFraction * 100)).toFixed(2)}%`;
      const nextSentence = sentenceBreakpoints.findIndex((breakpoint) => fraction < breakpoint);
      showSentence(nextSentence < 0 ? chapterSentences.length - 1 : nextSentence);
      if (video && card.dataset.avatarMode === "video" && !video.hidden && Number.isFinite(video.duration) && video.duration > 0) {
        const targetVideoTime = (current + activeVideoOffset) % video.duration;
        const directDelta = Math.abs(video.currentTime - targetVideoTime);
        const loopDelta = Math.min(directDelta, Math.max(0, video.duration - directDelta));
        if (loopDelta > .65) {
          try { video.currentTime = targetVideoTime; } catch (error) { /* Metadata may still be loading. */ }
        }
      }
    };

    const updateChapterButtons = () => {
      chaptersNav.querySelectorAll("[data-presenter-chapter]").forEach((button) => {
        const active = Number(button.dataset.presenterChapter) === chapterIndex;
        button.classList.toggle("is-active", active);
        if (active) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });
      if (stepRail) {
        stepRail.querySelectorAll("[data-presenter-rail-step]").forEach((button) => {
          const active = Number(button.dataset.presenterRailStep) === chapterIndex;
          button.classList.toggle("is-active", active);
          if (active) button.setAttribute("aria-current", "step");
          else button.removeAttribute("aria-current");
        });
        const activeRail = stepRail.querySelector(".is-active");
        if (activeRail) activeRail.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      }
      previousButton.disabled = chapterIndex === 0;
      nextButton.disabled = chapterIndex >= chapters.length - 1;
      const nextChapter = chapters[chapterIndex + 1];
      const nextLabel = nextChapter ? `${labels.next}: ${nextChapter.title}` : experience.completed;
      if (nextButtonLabel) nextButtonLabel.textContent = nextLabel;
      nextButton.setAttribute("aria-label", nextLabel);
      nextButton.title = nextLabel;
      if (chapterSelect) chapterSelect.value = String(chapterIndex);
    };

    const showStaticPortrait = () => {
      if (video) {
        video.pause();
        video.loop = false;
        video.hidden = true;
        if (!useHumanVideo) video.removeAttribute("src");
      }
      if (cartoon) cartoon.hidden = false;
      card.dataset.avatarMode = "cartoon";
      card.dataset.avatarVariant = "cartoon";
    };

    const prepareVideo = async (chapter, index, token) => {
      if (token !== loadToken || !cartoon) return;
      cartoon.hidden = false;
      applyCartoonCue(activeSentenceIndex >= 0 ? activeSentenceIndex : 0, true);
      if (!video || !useHumanVideo) {
        showStaticPortrait();
        return;
      }
      const source = visualAsset(humanVideoPath);
      if (video.getAttribute("src") !== source) {
        video.src = source;
        video.load();
      }
      activeVideoOffset = (index * 1.73) % 8.4;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.playbackRate = recording.playbackRate || 1;
      video.hidden = false;
      card.dataset.avatarMode = "video";
      card.dataset.avatarVariant = "human";
      video.addEventListener("error", showStaticPortrait, { once: true });
      const alignVideo = () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;
        try { video.currentTime = ((recording.currentTime || 0) + activeVideoOffset) % video.duration; } catch (error) { /* Metadata may still be loading. */ }
      };
      if (video.readyState >= 1) alignVideo();
      else video.addEventListener("loadedmetadata", alignVideo, { once: true });
    };

    const requestPlayback = () => {
      ensureAudioMotion();
      recording.play().then(() => {
        waitingForGesture = false;
        setPlaying(true);
        animateAudioMotion();
        if (video && !video.hidden) {
          if (card.dataset.avatarMode === "video" && Number.isFinite(video.duration) && video.duration > 0) {
            video.currentTime = ((recording.currentTime || 0) + activeVideoOffset) % video.duration;
          }
          video.playbackRate = recording.playbackRate || 1;
          video.play().catch(() => {});
        }
      }).catch((error) => {
        setPlaying(false);
        if (error && error.name === "NotAllowedError") {
          card.classList.add("is-autoplay-blocked");
          playLabel.textContent = touchToStart;
          if (stage) stage.setAttribute("aria-label", touchToStart);
          if (!waitingForGesture) {
            waitingForGesture = true;
            const unlock = (event) => {
              waitingForGesture = false;
              document.removeEventListener("pointerdown", unlock, true);
              document.removeEventListener("keydown", unlock, true);
              if (event.target && event.target.closest && event.target.closest("button, a, input, select, summary, [data-presenter-stage]")) return;
              requestPlayback();
            };
            document.addEventListener("pointerdown", unlock, { once: true, capture: true, passive: true });
            document.addEventListener("keydown", unlock, { once: true, capture: true });
          }
        } else {
          playLabel.textContent = labels.unavailable;
        }
      });
    };

    const closeHelpOverlay = () => {
      if (!helpOverlay) return;
      helpOverlay.hidden = true;
      card.classList.remove("is-help-open");
      if (helpFull) helpFull.hidden = true;
      if (helpText) helpText.querySelector("span").textContent = experience.readText;
    };

    const openHelpOverlay = () => {
      const chapter = chapters[chapterIndex];
      if (!helpOverlay || !chapter) return;
      recording.pause();
      if (video) video.pause();
      setPlaying(false);
      const sentence = chapterSentences[Math.max(0, activeSentenceIndex)] || chapter.text || chapter.title;
      if (helpSentence) helpSentence.textContent = sentence;
      if (helpFull) {
        helpFull.textContent = chapter.text || sentence;
        helpFull.hidden = true;
      }
      if (helpText) helpText.querySelector("span").textContent = experience.readText;
      if (helpVisual) helpVisual.disabled = !chapter.image;
      helpOverlay.hidden = false;
      card.classList.add("is-help-open");
      window.setTimeout(() => helpSlow?.focus({ preventScroll: true }), 0);
    };

    if (helpButton) helpButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openHelpOverlay();
    });
    [helpClose, helpReturn].forEach((button) => {
      if (button) button.addEventListener("click", closeHelpOverlay);
    });
    if (helpOverlay) helpOverlay.addEventListener("click", (event) => {
      if (event.target === helpOverlay) closeHelpOverlay();
    });
    if (helpText) helpText.addEventListener("click", () => {
      if (!helpFull) return;
      helpFull.hidden = !helpFull.hidden;
      const label = helpText.querySelector("span");
      if (label) label.textContent = helpFull.hidden ? experience.readText : experience.hideText;
    });
    if (helpVisual) helpVisual.addEventListener("click", () => {
      const chapter = chapters[chapterIndex];
      if (!chapter?.image || !photoOverlay || !photoImage) return;
      closeHelpOverlay();
      photoImage.src = visualAsset(chapter.image);
      photoImage.alt = chapter.title;
      if (photoTitle) photoTitle.textContent = chapter.title;
      photoOverlay.hidden = false;
    });
    if (helpSlow) helpSlow.addEventListener("click", () => {
      const safeSentence = Math.max(0, activeSentenceIndex);
      const startFraction = safeSentence > 0 ? sentenceBreakpoints[safeSentence - 1] : 0;
      if (Number.isFinite(recording.duration) && recording.duration > 0) {
        recording.currentTime = Math.max(0, startFraction * recording.duration - .12);
      }
      recording.playbackRate = .8;
      if (rateControl) rateControl.value = "0.8";
      closeHelpOverlay();
      requestPlayback();
    });

    const saveProgress = () => {
      try {
        localStorage.setItem(progressKey, JSON.stringify({
          track: selectedTrack,
          completed: Array.from(completedChapters),
          chapter: chapters[chapterIndex]?.id || "",
          position: Number.isFinite(recording.currentTime) ? Math.round(recording.currentTime * 10) / 10 : 0,
          rate: Number(recording.playbackRate) || 1
        }));
      } catch (error) { /* Private browsing may disable storage. */ }
    };

    const completedForTrack = (trackKey) => {
      const order = trackOrders[trackKey] || [];
      return order.filter((id) => completedChapters.has(id)).length;
    };

    const updateTrackStatus = () => {
      const track = experience.tracks[selectedTrack] || experience.tracks.all;
      const done = chapters.filter((chapter) => completedChapters.has(chapter.id)).length;
      if (trackIcon) trackIcon.textContent = track.icon;
      if (trackProgress) trackProgress.textContent = `${done}/${chapters.length}`;
      if (trackButton) trackButton.setAttribute("aria-label", `${experience.changePath}: ${track.title}, ${done}/${chapters.length}`);
      chaptersNav.querySelectorAll("[data-chapter-id]").forEach((button) => {
        const completed = completedChapters.has(button.dataset.chapterId);
        button.classList.toggle("is-complete", completed);
        const status = button.querySelector("[data-chapter-status]");
        if (status) status.textContent = completed ? "✓" : "";
      });
      if (stepRail) {
        stepRail.querySelectorAll("[data-chapter-id]").forEach((button) => {
          button.classList.toggle("is-complete", completedChapters.has(button.dataset.chapterId));
        });
      }
    };

    const markChapterCompleted = () => {
      const chapter = chapters[chapterIndex];
      if (!chapter) return;
      completedChapters.add(chapter.id);
      saveProgress();
      updateTrackStatus();
      renderTrackGrid();
    };

    const hideQuiz = () => {
      currentQuizItem = null;
      quizResolved = false;
      if (!quizOverlay) return;
      quizOverlay.hidden = true;
      quizOverlay.classList.remove("is-correct", "is-wrong", "is-complete");
      quizOverlay.querySelectorAll("[data-presenter-quiz-answer]").forEach((button) => {
        button.disabled = false;
        button.hidden = false;
        button.classList.remove("is-selected");
      });
      if (quizFeedback) quizFeedback.textContent = "";
      if (quizNext) quizNext.hidden = true;
      if (quizRepeat) quizRepeat.hidden = false;
      if (quizContinue) quizContinue.hidden = false;
      if (completeToast) completeToast.hidden = true;
    };

    const chapterContextTargets = {
      start: null,
      arrival: { page: "mapa", icon: "🗺️" },
      warehouse: { page: "magazyn", icon: "📦" },
      greenhouse: { page: "szklarnia", icon: "🌿" },
      reader: { page: "reader", icon: "📟" },
      tablet: { page: "tablet", icon: "📱" },
      safety: { page: "zakazy", icon: "⛔" },
      documents: { page: "miasto", icon: "🏙️" },
      help: { page: "lekarz", icon: "🏥" },
      finish: { page: "test", icon: "✅" }
    };

    const updateContextLink = (chapter) => {
      if (!contextLink) return;
      const target = chapterContextTargets[chapter?.group] || null;
      contextLink.hidden = !target;
      if (!target) return;
      const pageData = DATA.pages[target.page] || DATA.pages.mapa;
      const label = `${text(DATA.ui.open)}: ${text(pageData.title)}`;
      contextLink.href = href(target.page);
      contextLink.dataset.contextPage = target.page;
      contextLink.setAttribute("aria-label", label);
      contextLink.title = label;
      if (contextLinkIcon) contextLinkIcon.textContent = target.icon;
      if (contextLinkLabel) contextLinkLabel.textContent = label;
    };

    const prefetchChapterVisuals = (index) => {
      const candidates = [chapters[index], chapters[index + 1]].filter(Boolean);
      candidates.forEach((chapter, offset) => {
        if (chapter.image) preloadVisual(chapter.image, offset === 0 ? "high" : "low");
      });
    };

    const activateChapter = (index, autoplay = true) => {
      window.clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = 0;
      chapterIndex = Math.max(0, Math.min(chapters.length - 1, Number(index) || 0));
      const chapter = chapters[chapterIndex];
      const token = ++loadToken;
      hideQuiz();
      closeHelpOverlay();
      recording.pause();
      showStaticPortrait();
      recording.src = chapterAudioUrl(chapter, chapterIndex);
      recording.currentTime = 0;
      chapterTitle.textContent = chapter.title;
      if (groupLabel) groupLabel.textContent = chapter.groupTitle || chapter.title;
      closePhotoOverlay();
      prepareChapterText(chapter);
      currentLabel.textContent = String(chapterIndex + 1);
      totalLabel.textContent = String(chapters.length);
      timeLabel.textContent = "0:00";
      durationLabel.textContent = "0:00";
      seek.value = "0";
      updateContextLink(chapter);
      updateChapterButtons();
      updateProgress();
      prefetchChapterVisuals(chapterIndex);
      prepareVideo(chapter, chapterIndex, token);
      if (autoplay) requestPlayback();
      else setPlaying(false);
    };

    const activateFreshChapter = (index, autoplay = true) => {
      pendingResumeSeconds = 0;
      activateChapter(index, autoplay);
    };

    if (stageHit) {
      stageHit.addEventListener("click", () => {
        if (recording.paused) requestPlayback();
        else {
          recording.pause();
          if (video) video.pause();
          setPlaying(false);
        }
      });
    }

    const renderGuide = () => {
      let previousGroup = "";
      chaptersNav.innerHTML = chapters.map((chapter, index) => {
        const groupTitle = chapter.groupTitle || "";
        const groupHeading = groupTitle && groupTitle !== previousGroup
          ? `<p class="presenter-chapter-group">${esc(groupTitle)}</p>`
          : "";
        previousGroup = groupTitle;
        return `${groupHeading}
          <button type="button" class="presenter-chapter-button${completedChapters.has(chapter.id) ? " is-complete" : ""}" data-presenter-chapter="${index}" data-chapter-id="${esc(chapter.id)}">
            <span class="presenter-chapter-number">${String(index + 1).padStart(2, "0")}</span>
            <span>${esc(chapter.title)}</span><b class="presenter-chapter-status" data-chapter-status>${completedChapters.has(chapter.id) ? "✓" : ""}</b>
          </button>`;
      }).join("");
      if (stepRail) {
        stepRail.innerHTML = chapters.map((chapter, index) => `
          <button type="button" class="presenter-step-dot${completedChapters.has(chapter.id) ? " is-complete" : ""}" data-presenter-rail-step="${index}" data-chapter-id="${esc(chapter.id)}" aria-label="${index + 1}. ${esc(chapter.title)}">${index + 1}</button>`
        ).join("");
        stepRail.onclick = (event) => {
          const button = event.target.closest("[data-presenter-rail-step]");
          if (button) activateFreshChapter(Number(button.dataset.presenterRailStep), true);
        };
      }
      if (chapterSelect) {
        chapterSelect.innerHTML = chapters.map((chapter, index) =>
          `<option value="${index}">${String(index + 1).padStart(2, "0")} · ${esc(chapter.groupTitle || "")} · ${esc(chapter.title)}</option>`
        ).join("");
        chapterSelect.value = String(chapterIndex);
        chapterSelect.onchange = () => activateFreshChapter(Number(chapterSelect.value), true);
      }
      transcript.innerHTML = chapters.map((chapter, index) => `
        <article class="presenter-transcript-chapter">
          <h4>${index + 1}. ${esc(chapter.groupTitle || "")} — ${esc(chapter.title)}</h4>
          <p>${esc(chapter.text)}</p>
        </article>`).join("");
      totalLabel.textContent = String(chapters.length);
      chaptersNav.onclick = (event) => {
        const button = event.target.closest("[data-presenter-chapter]");
        if (!button) return;
        activateFreshChapter(Number(button.dataset.presenterChapter), true);
      };
      updateTrackStatus();
    };

    function renderTrackGrid() {
      if (!trackGrid) return;
      const keys = ["warehouse", "greenhouse", "before", "waiting", "all"];
      trackGrid.innerHTML = keys.map((key) => {
        const item = experience.tracks[key];
        const done = completedForTrack(key);
        const total = trackOrders[key].length;
        return `<button type="button" class="presenter-path-option${key === selectedTrack ? " is-selected" : ""}" data-presenter-track="${key}">
          <span class="presenter-path-icon" aria-hidden="true">${item.icon}</span>
          <span><strong>${esc(item.title)}</strong><small>${esc(item.lead)}</small></span>
          <b>${done}/${total}</b>
        </button>`;
      }).join("");
    }

    const applyTrack = (trackKey, autoplay = true) => {
      selectedTrack = trackOrders[trackKey] ? trackKey : "all";
      const ordered = trackOrders[selectedTrack]
        .map((id) => allChapters.find((chapter) => chapter.id === id))
        .filter(Boolean);
      chapters = ordered.length ? ordered : allChapters.slice();
      const savedChapterIndex = chapters.findIndex((chapter) => chapter.id === savedProgress.chapter && !completedChapters.has(chapter.id));
      const nextIncomplete = chapters.findIndex((chapter) => !completedChapters.has(chapter.id));
      chapterIndex = savedChapterIndex >= 0 ? savedChapterIndex : nextIncomplete >= 0 ? nextIncomplete : 0;
      pendingResumeSeconds = savedChapterIndex >= 0 ? savedProgress.position : 0;
      saveProgress();
      renderTrackGrid();
      renderGuide();
      if (trackOverlay) trackOverlay.hidden = true;
      try {
        const params = new URLSearchParams(location.search);
        params.set("track", selectedTrack);
        history.replaceState(null, "", `${location.pathname}?${params.toString()}${location.hash}`);
      } catch (error) { /* History may be restricted in embedded browsers. */ }
      activateChapter(chapterIndex, autoplay);
    };

    const showChapterQuiz = () => {
      const chapter = chapters[chapterIndex];
      if (!chapter || !quizOverlay) {
        markChapterCompleted();
        return;
      }
      recording.pause();
      if (video) video.pause();
      setPlaying(false);
      const quizIndex = Number.isInteger(chapter.quizIndex) ? chapter.quizIndex : chapterQuizIndex[chapter.id];
      const quizItem = Number.isInteger(quizIndex) && Array.isArray(DATA.test) ? DATA.test[quizIndex] : null;
      currentQuizItem = quizItem || null;
      quizResolved = false;
      if (!quizItem && chapterIndex < chapters.length - 1) {
        markChapterCompleted();
        quizOverlay.hidden = true;
        if (completeToast) completeToast.hidden = false;
        const completedIndex = chapterIndex;
        autoAdvanceTimer = window.setTimeout(() => {
          if (chapterIndex === completedIndex) activateFreshChapter(chapterIndex + 1, true);
        }, 1150);
        return;
      }
      quizOverlay.hidden = false;
      quizOverlay.classList.remove("is-correct", "is-wrong", "is-complete");
      if (!quizItem) {
        markChapterCompleted();
        quizResolved = true;
        quizOverlay.classList.add("is-complete");
        quizQuestion.textContent = experience.completed;
        quizFeedback.textContent = `${experience.completed}: ${chapters.filter((item) => completedChapters.has(item.id)).length}/${chapters.length}`;
        quizOverlay.querySelectorAll("[data-presenter-quiz-answer]").forEach((button) => { button.hidden = true; });
        quizNext.hidden = false;
        quizRepeat.hidden = false;
        quizContinue.hidden = chapterIndex >= chapters.length - 1;
        return;
      }
      quizQuestion.textContent = text(quizItem.text);
      quizFeedback.textContent = "";
      quizNext.hidden = true;
      quizOverlay.querySelectorAll("[data-presenter-quiz-answer]").forEach((button) => {
        button.disabled = false;
        button.hidden = false;
        button.classList.remove("is-selected");
      });
    };

    if (trackGrid) {
      trackGrid.addEventListener("click", (event) => {
        const button = event.target.closest("[data-presenter-track]");
        if (!button) return;
        applyTrack(button.dataset.presenterTrack, true);
      });
    }
    if (trackButton) {
      trackButton.addEventListener("click", () => {
        recording.pause();
        if (video) video.pause();
        setPlaying(false);
        renderTrackGrid();
        if (trackOverlay) trackOverlay.hidden = false;
      });
    }
    if (quizOverlay) {
      quizOverlay.addEventListener("click", (event) => {
        const answer = event.target.closest("[data-presenter-quiz-answer]");
        if (!answer || !currentQuizItem || quizResolved) return;
        const isCorrect = (answer.dataset.presenterQuizAnswer === "1") === Boolean(currentQuizItem.ok);
        quizOverlay.querySelectorAll("[data-presenter-quiz-answer]").forEach((button) => { button.disabled = true; });
        answer.classList.add("is-selected");
        quizOverlay.classList.toggle("is-correct", isCorrect);
        quizOverlay.classList.toggle("is-wrong", !isCorrect);
        quizFeedback.textContent = isCorrect
          ? experience.correct
          : `${experience.wrong} ${currentQuizItem.ok ? experience.yes : experience.no}.`;
        quizNext.hidden = false;
        quizContinue.hidden = !isCorrect;
        quizRepeat.hidden = isCorrect;
        if (isCorrect) {
          quizResolved = true;
          markChapterCompleted();
        }
      });
    }
    if (quizRepeat) quizRepeat.addEventListener("click", () => activateFreshChapter(chapterIndex, true));
    if (quizContinue) quizContinue.addEventListener("click", () => {
      if (chapterIndex < chapters.length - 1) activateFreshChapter(chapterIndex + 1, true);
      else hideQuiz();
    });

    const syncPresentation = (active) => {
      card.classList.toggle("is-presentation", active);
      document.body.classList.toggle("presenter-presentation-open", active);
      if (fullscreenButton) {
        fullscreenButton.textContent = active ? "×" : "⛶";
        fullscreenButton.setAttribute("aria-label", active ? experience.exitPresentation : experience.presentation);
      }
    };
    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", () => {
        const active = card.classList.contains("is-presentation");
        if (active) {
          if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
          syncPresentation(false);
        } else {
          syncPresentation(true);
          if (card.requestFullscreen) card.requestFullscreen().catch(() => {});
        }
      });
      document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement && card.classList.contains("is-presentation")) syncPresentation(false);
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && card.classList.contains("is-presentation") && !document.fullscreenElement) syncPresentation(false);
        if (event.key === "Escape" && helpOverlay && !helpOverlay.hidden) closeHelpOverlay();
      });
    }

    playButton.addEventListener("click", () => {
      if (recording.paused) {
        if (recording.ended || (recording.duration && recording.currentTime >= recording.duration - .1)) recording.currentTime = 0;
        requestPlayback();
      } else {
        recording.pause();
        if (video) video.pause();
        setPlaying(false);
      }
    });
    previousButton.addEventListener("click", () => {
      if (recording.currentTime > 4 || chapterIndex === 0) activateFreshChapter(chapterIndex, true);
      else activateFreshChapter(chapterIndex - 1, true);
    });
    nextButton.addEventListener("click", () => {
      if (chapterIndex < chapters.length - 1) activateFreshChapter(chapterIndex + 1, true);
    });
    stopButton.addEventListener("click", () => {
      window.clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = 0;
      if (completeToast) completeToast.hidden = true;
      recording.pause();
      recording.currentTime = 0;
      if (video) {
        video.pause();
        try { video.currentTime = 0; } catch (error) { /* No metadata yet. */ }
      }
      setPlaying(false);
      playLabel.textContent = labels.start;
      updateProgress();
    });
    seek.addEventListener("input", () => {
      if (!Number.isFinite(recording.duration) || recording.duration <= 0) return;
      recording.currentTime = (Number(seek.value) / 1000) * recording.duration;
      updateProgress();
    });
    if (rateControl) {
      rateControl.addEventListener("change", () => {
        const rate = Math.max(.75, Math.min(1.25, Number(rateControl.value) || 1));
        recording.playbackRate = rate;
        if (video) video.playbackRate = rate;
        saveProgress();
      });
    }
    recording.addEventListener("loadedmetadata", () => {
      if (pendingResumeSeconds > 0 && Number.isFinite(recording.duration)) {
        const safeResumeLimit = Math.max(0, recording.duration - 3);
        recording.currentTime = pendingResumeSeconds < safeResumeLimit ? pendingResumeSeconds : 0;
        pendingResumeSeconds = 0;
      }
      updateProgress();
    });
    recording.addEventListener("durationchange", updateProgress);
    recording.addEventListener("timeupdate", () => {
      updateProgress();
      const now = Date.now();
      if (now - lastProgressSave > 4000) {
        lastProgressSave = now;
        saveProgress();
      }
    });
    recording.addEventListener("play", () => {
      ensureAudioMotion();
      setPlaying(true);
      animateAudioMotion();
    });
    recording.addEventListener("pause", () => {
      window.cancelAnimationFrame(audioMotionFrame);
      card.style.setProperty("--voice-level", "0");
      if (!recording.ended) setPlaying(false);
      saveProgress();
    });
    recording.addEventListener("ended", () => {
      if (video) video.pause();
      setPlaying(false);
      playLabel.textContent = labels.repeat;
      seek.value = "1000";
      showChapterQuiz();
    });
    recording.addEventListener("error", () => {
      if (video) video.pause();
      setPlaying(false);
      playLabel.textContent = labels.unavailable;
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(audioMotionFrame);
        card.style.setProperty("--voice-level", "0");
      } else if (!recording.paused) {
        animateAudioMotion();
      }
    });

    try {
      const useEditorDraft = new URLSearchParams(location.search).get("draft") === "1";
      let guide = null;
      if (useEditorDraft) {
        try { guide = JSON.parse(localStorage.getItem("cx-editor-guide-draft-v1") || "null"); } catch (error) { guide = null; }
      }
      if (!guide) {
        const response = await fetch(fullGuideUrl, { cache: "no-cache" });
        if (!response.ok) throw new Error("presenter-guide");
        guide = await response.json();
      }
      const localized = guide.languages && guide.languages[lang];
      if (!localized || !Array.isArray(localized.sections) || !localized.sections.length) throw new Error("presenter-language");
      allChapters = localized.sections.map((chapter, sourceIndex) => ({ ...chapter, sourceIndex }));
    } catch (error) {
      allChapters = [fallbackChapter];
    }

    Object.keys(trackOrders).forEach((trackKey) => {
      trackOrders[trackKey] = allChapters
        .filter((chapter) => trackKey === "all" || (Array.isArray(chapter.tracks) && chapter.tracks.includes(trackKey)))
        .map((chapter) => chapter.id);
    });

    selectedTrack = Object.hasOwn(trackOrders, selectedTrack) && trackOrders[selectedTrack].length ? selectedTrack : "all";
    chapters = trackOrders[selectedTrack]
      .map((id) => allChapters.find((chapter) => chapter.id === id))
      .filter(Boolean);
    if (!chapters.length) chapters = allChapters.slice();
    const savedChapterIndex = chapters.findIndex((chapter) => chapter.id === savedProgress.chapter && !completedChapters.has(chapter.id));
    const resumeIndex = chapters.findIndex((chapter) => !completedChapters.has(chapter.id));
    chapterIndex = savedChapterIndex >= 0 ? savedChapterIndex : resumeIndex >= 0 ? resumeIndex : 0;
    pendingResumeSeconds = savedChapterIndex >= 0 ? savedProgress.position : 0;
    renderTrackGrid();
    renderGuide();
    activateChapter(chapterIndex, false);
    if (trackOverlay) trackOverlay.hidden = false;
    window.addEventListener("pagehide", () => {
      saveProgress();
      window.cancelAnimationFrame(audioMotionFrame);
      if (focusResizeObserver) focusResizeObserver.disconnect();
      recording.pause();
      if (video) video.pause();
      if (audioContext && audioContext.state !== "closed") audioContext.close().catch(() => {});
    }, { once: true });
  }
  function showLocationWelcome() {
    // The standalone dragon guide is the only welcome screen.
    document.querySelectorAll(".welcome-modal").forEach((modal) => modal.remove());
    document.body.classList.remove("welcome-modal-open");
    return;
    const entryParams = new URLSearchParams(location.search);
    if (entryParams.get("from") === "dragon" || entryParams.get("intro") === "done") return;
    if (page !== "home") return;
    const locationKey = DATA.meta && DATA.meta.repo ? DATA.meta.repo : getLocationName();
    const seenKey = "cx-location-welcome:welcome-dragon1:" + locationKey;
    const forceWelcome = new URLSearchParams(location.search).get("welcome") === "1";
    if (sessionValue(seenKey) && !forceWelcome) return;
    const delay = document.body.classList.contains("location-splash-open") ? 2400 : 0;

    window.setTimeout(() => {
      if (document.querySelector(".welcome-modal")) return;
      let selectedLang = lang;
      let labels = welcomeGuideUi[selectedLang] || welcomeGuideUi.pl;
      let started = false;
      let finished = false;
      let guide = null;
      let sentences = guideText(selectedLang, getLocationName());
      const modal = document.createElement("div");
      modal.className = "welcome-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "welcomeTitle");
      modal.innerHTML = [
        '<div class="welcome-dialog">',
        '<div class="welcome-location">' + esc(getLocationName()) + '</div>',
        '<div class="welcome-dragon" data-welcome-dragon aria-hidden="true">',
        '<svg viewBox="0 0 220 170" fill="none" xmlns="http://www.w3.org/2000/svg">',
        '<path class="dragon-tail" d="M76 126C43 151 18 137 31 116c7-11 21-13 34-3"/>',
        '<path class="dragon-wing dragon-wing-left" d="M82 74C50 42 38 43 25 53c16 2 28 12 35 28 8-9 14-12 22-7Z"/>',
        '<path class="dragon-wing dragon-wing-right" d="M138 74c32-32 44-31 57-21-16 2-28 12-35 28-8-9-14-12-22-7Z"/>',
        '<path class="dragon-body" d="M72 82c0-25 17-41 38-41s38 16 38 41v28c0 20-16 34-38 34s-38-14-38-34V82Z"/>',
        '<path class="dragon-horn" d="M92 48 83 28l18 14M128 48l9-20-18 14"/>',
        '<circle class="dragon-head" cx="110" cy="67" r="30"/>',
        '<circle class="dragon-eye" cx="99" cy="64" r="4"/>',
        '<circle class="dragon-eye" cx="121" cy="64" r="4"/>',
        '<path class="dragon-snout dragon-mouth" d="M102 76c5 4 11 4 16 0M106 83c3 3 7 3 10 0"/>',
        '<path class="dragon-foot" d="M86 132v15M134 132v15"/>',
        '<circle class="dragon-spark" cx="53" cy="28" r="4"/>',
        '<circle class="dragon-spark" cx="169" cy="29" r="3"/>',
        '</svg></div>',
        '<p class="welcome-kicker">CITRONEX</p>',
        '<h2 id="welcomeTitle" data-welcome-title></h2>',
        '<p class="welcome-lead" data-welcome-lead></p>',
        '<label class="welcome-language-label" for="welcomeLanguage" data-welcome-choose></label>',
        '<select class="welcome-language" id="welcomeLanguage"></select>',
        '<div class="welcome-speech-bubble" data-welcome-speech aria-live="polite"></div>',
        '<p class="welcome-status" data-welcome-status aria-live="polite"></p>',
        '<div class="welcome-actions">',
        '<button type="button" class="btn welcome-start" data-welcome-start></button>',
        '<button type="button" class="btn secondary welcome-control" data-welcome-pause hidden></button>',
        '<button type="button" class="btn secondary welcome-control" data-welcome-repeat hidden></button>',
        '<button type="button" class="btn secondary welcome-control" data-welcome-next hidden></button>',
        '<button type="button" class="btn secondary welcome-skip" data-welcome-skip></button>',
        '</div>',
        '</div>'
      ].join("");
      document.body.appendChild(modal);
      document.body.classList.add("welcome-modal-open");

      const language = modal.querySelector("#welcomeLanguage");
      const title = modal.querySelector("[data-welcome-title]");
      const lead = modal.querySelector("[data-welcome-lead]");
      const choose = modal.querySelector("[data-welcome-choose]");
      const start = modal.querySelector("[data-welcome-start]");
      const pause = modal.querySelector("[data-welcome-pause]");
      const repeat = modal.querySelector("[data-welcome-repeat]");
      const next = modal.querySelector("[data-welcome-next]");
      const skip = modal.querySelector("[data-welcome-skip]");
      const speech = modal.querySelector("[data-welcome-speech]");
      const status = modal.querySelector("[data-welcome-status]");
      const dragon = modal.querySelector("[data-welcome-dragon]");
      const options = DATA.languages.map((item) => (
        '<option value="' + esc(item.id) + '">' + esc(welcomeLanguageNames[item.id] || item.label) + '</option>'
      )).join("");
      language.innerHTML = options;
      language.value = selectedLang;

      function applyLabels() {
        labels = welcomeGuideUi[selectedLang] || welcomeGuideUi.pl;
        title.textContent = labels.title;
        lead.textContent = labels.lead;
        choose.textContent = labels.choose;
        start.textContent = finished ? labels.open : labels.start;
        pause.textContent = labels.pause;
        repeat.textContent = labels.repeat;
        next.textContent = labels.next;
        skip.textContent = labels.skip;
      }

      function updateSpeech(step, sentence) {
        speech.textContent = sentence;
        status.textContent = labels.step + " " + (step + 1) + "/" + sentences.length + " - " + labels.speaking;
        dragon.classList.add("is-speaking");
        dragon.classList.remove("is-paused");
      }

      function openSystem() {
        if (guide) guide.cancel();
        setSessionValue(seenKey, "1");
        modal.remove();
        document.body.classList.remove("welcome-modal-open");
        reloadWithLanguage(selectedLang);
      }

      function finishGuide() {
        finished = true;
        dragon.classList.remove("is-speaking", "is-paused");
        pause.hidden = true;
        repeat.hidden = true;
        next.hidden = true;
        start.disabled = false;
        start.textContent = labels.open;
        status.textContent = labels.step + " " + sentences.length + "/" + sentences.length;
      }

      DATA.languages.forEach((item) => {
        if (item.id === selectedLang) language.value = selectedLang;
      });
      applyLabels();
      speech.textContent = sentences[0];
      language.addEventListener("change", () => {
        if (started) return;
        selectedLang = language.value;
        sentences = guideText(selectedLang, getLocationName());
        applyLabels();
        speech.textContent = sentences[0];
      });
      start.addEventListener("click", () => {
        if (finished) {
          openSystem();
          return;
        }
        if (started) return;
        started = true;
        selectedLang = language.value;
        sentences = guideText(selectedLang, getLocationName());
        language.disabled = true;
        applyLabels();
        guide = createGuideSpeaker(sentences, selectedLang, updateSpeech, finishGuide);
        if (!guide.start()) {
          speech.textContent = sentences.join(" ");
          status.textContent = labels.unavailable;
          finished = true;
          start.textContent = labels.open;
          return;
        }
        pause.hidden = false;
        repeat.hidden = false;
        next.hidden = false;
        start.textContent = labels.speaking;
      });
      pause.addEventListener("click", () => {
        if (!guide) return;
        const paused = guide.pause();
        pause.textContent = paused ? labels.resume : labels.pause;
        dragon.classList.toggle("is-paused", paused);
      });
      repeat.addEventListener("click", () => {
        if (!guide) return;
        guide.repeat();
        pause.textContent = labels.pause;
      });
      next.addEventListener("click", () => {
        if (!guide) return;
        guide.next();
        pause.textContent = labels.pause;
      });
      skip.addEventListener("click", openSystem);
      start.focus({ preventScroll: true });
    }, delay);
  }
  renderPage();
  upgradeCache();
})();
