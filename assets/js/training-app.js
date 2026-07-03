(() => {
  const DATA = window.CX_DATA;
  const tx = (pl, en, ua, ru, az, es, fil, id, ne) => ({ pl, en, ua, ru, az, es, fil, id, ne });
  const validLangs = new Set(DATA.languages.map((item) => item.id));
  const page = document.body.dataset.page || "home";
  const app = document.getElementById("app");

  const iconMap = {
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z"/><path d="M9 4v14"/><path d="M15 6v14"/></svg>',
    warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21V8l9-5 9 5v13"/><path d="M7 21v-9h10v9"/><path d="M9 16h6"/></svg>',
    greenhouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21V9a9 9 0 0 1 18 0v12"/><path d="M3 12h18"/><path d="M7 21V9"/><path d="M12 21V6"/><path d="M17 21V9"/></svg>',
    reader: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 6h4"/><path d="M10 17h4"/><circle cx="12" cy="12" r="2"/></svg>',
    medical: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14"/><path d="M5 12h14"/><path d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/></svg>',
    groups: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
    city: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/><path d="M16 15h1"/><path d="M16 18h1"/></svg>',
    ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/></svg>',
    test: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11l2 2 4-4"/><path d="M20 6 9 17l-5-5"/><path d="M4 19h16"/></svg>'
  };

  function getLang() {
    const params = new URLSearchParams(location.search);
    const fromUrl = (params.get("lang") || "").toLowerCase();
    const fromStorage = (localStorage.getItem("cx-lang") || "").toLowerCase();
    if (validLangs.has(fromUrl)) return fromUrl;
    if (validLangs.has(fromStorage)) return fromStorage;
    return "pl";
  }

  let lang = getLang();

  function text(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[lang] || value.pl || value.en || "";
  }

  function ui(key) {
    return text(DATA.ui[key]);
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function href(pageName) {
    const base = pageName === "home" ? "index.html" : `${pageName}.html`;
    return `${base}?lang=${encodeURIComponent(lang)}`;
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

  function cardClass(tone) {
    return tone ? `card ${tone}` : "card";
  }

  function action(url, label, tone = "") {
    const cls = tone ? `btn ${tone}` : "btn";
    return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
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
    if (!cleaned.startsWith("+48")) return cleaned;
    const rest = cleaned.slice(3).replace(/(\d{3})(?=\d)/g, "$1 ").trim();
    return `+48 ${rest}`;
  }

  function renderHeader() {
    const isHome = page === "home";
    const selected = DATA.languages.map((item) => (
      `<option value="${esc(item.id)}"${item.id === lang ? " selected" : ""}>${esc(item.label)}</option>`
    )).join("");

    document.body.insertAdjacentHTML("afterbegin", `
      <header class="app-header">
        <div class="header-inner">
          ${isHome ? `<span class="back-link" aria-hidden="true">CX</span>` : `<a class="back-link" href="${esc(href("home"))}" aria-label="${esc(ui("back"))}">‹</a>`}
          <div class="brand">
            <img src="assets/logo-citronex.svg" alt="Citronex">
            <div>
              <p class="brand-title">${esc(ui("brand"))}</p>
              <p class="brand-subtitle">${esc(ui("subtitle"))}</p>
            </div>
          </div>
          <select class="lang-select" id="langSelect" aria-label="Language">${selected}</select>
        </div>
      </header>
    `);

    document.getElementById("langSelect").addEventListener("change", (event) => {
      lang = event.target.value;
      localStorage.setItem("cx-lang", lang);
      const url = new URL(location.href);
      url.searchParams.set("lang", lang);
      location.href = url.toString();
    });
  }

  function pageHero(pageName = page) {
    const info = DATA.pages[pageName] || DATA.pages.home;
    document.title = `${text(info.title)} - Citronex Siechnice`;
    return `
      <section class="hero">
        <p class="eyebrow">Citronex Siechnice</p>
        <h1>${esc(text(info.title))}</h1>
        <p class="lead">${esc(text(info.lead))}</p>
      </section>
    `;
  }

  function renderHome() {
    const tiles = DATA.tiles.map((tile) => `
      <a class="tile" data-tone="${esc(tile.tone)}" href="${esc(href(tile.page))}">
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
    `).join("");

    app.innerHTML = `<main class="page">${pageHero("home")}<section class="tiles">${tiles}</section><p class="footer-note">GitHub Pages • offline cache • v2026-07-03</p></main>`;
  }

  function renderMap() {
    const cards = DATA.maps.map((item) => `
      <article class="${cardClass(item.tone)}">
        <h3>${esc(text(item.title))}</h3>
        <p>${esc(text(item.note))}</p>
        <div class="btn-row">${action(item.url, ui("openMap"), item.tone === "red" ? "red" : item.tone === "yellow" ? "yellow" : "blue")}</div>
      </article>
    `).join("");
    app.innerHTML = `<main class="page">${pageHero()}<section class="module-grid two">${cards}</section></main>`;
  }

  function renderWarehouse() {
    const rules = DATA.warehouseRules.map((item) => `<li>${esc(text(item))}</li>`).join("");
    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <section class="card yellow">
          <h2>${esc(text(DATA.tiles.find((tile) => tile.page === "magazyn").title))}</h2>
          <ul class="list">${rules}</ul>
          <div class="btn-row">
            ${action(DATA.maps.find((item) => text(item.title).toLowerCase().includes(text(DATA.pages.magazyn.title).toLowerCase()) || item.url.includes("Staff+Entrance")).url, ui("openMap"), "yellow")}
            ${action("https://maps.app.goo.gl/5B47Av1GDhEUBM7M7", `${ui("openMap")} - ${text(DATA.maps.find((item) => item.url.includes("5B47")).title)}`, "yellow")}
          </div>
        </section>
        <section class="section">
          <h2>${esc(text(tx("Zdjęcia wejścia", "Entrance photos", "Фото входу", "Фото входа", "Giriş şəkilləri", "Fotos de entrada", "Larawan ng pasukan", "Foto pintu masuk", "प्रवेश फोटो")))}</h2>
          <div class="photo-grid">
            <figure class="media"><img src="assets/warehouse/magazyn-wejscie-1.jpg" alt="Magazyn wejście"><figcaption>${esc(text(tx("Budynek magazynu - widok z parkingu.", "Warehouse building - view from parking.", "Будівля складу - вид з парковки.", "Здание склада - вид с парковки.", "Anbar binası - dayanacaqdan görünüş.", "Edificio de almacén - vista desde parking.", "Warehouse building mula sa parking.", "Gedung gudang dari parkir.", "पार्किङबाट गोदाम भवन।")))}</figcaption></figure>
            <figure class="media"><img src="assets/warehouse/magazyn-wejscie-2.jpg" alt="Magazyn wejście drzwi"><figcaption>${esc(text(tx("Wejście dla personelu.", "Staff entrance.", "Вхід для персоналу.", "Вход для персонала.", "Personal girişi.", "Entrada de personal.", "Pasukan ng staff.", "Pintu masuk staf.", "कर्मचारी प्रवेश।")))}</figcaption></figure>
          </div>
        </section>
      </main>
    `;
  }

  function renderGreenhouse() {
    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <section class="steps">
          <article class="step-card">
            <span class="step-number">1</span>
            <div>
              <h3>${esc(text(tx("Cała szklarnia z góry", "Whole greenhouse from above", "Вся теплиця зверху", "Вся теплица сверху", "Bütün istixana yuxarıdan", "Todo el invernadero desde arriba", "Buong greenhouse mula sa taas", "Seluruh rumah kaca dari atas", "पूरै ग्रीनहाउस माथिबाट")))}</h3>
              <p>${esc(text(tx("Stoisz plecami do pierwszych naw. Po środku jest droga. Po jednej stronie jest lewa część, po drugiej prawa część. Liczba naw może być różna: 37, 38 albo 39.", "Stand with your back to the first naves. The road is in the middle. One side is left, the other is right. The number of naves may be 37, 38 or 39.", "Станьте спиною до перших нав. Посередині дорога. З одного боку ліва частина, з іншого права. Нав може бути 37, 38 або 39.", "Встаньте спиной к первым навам. Посередине дорога. С одной стороны левая часть, с другой правая. Нав может быть 37, 38 или 39.", "İlk navalara arxanızla dayanın. Ortada yol var. Bir tərəf sol, o biri sağdır. Nava sayı 37, 38 və ya 39 ola bilər.", "Ponte de espaldas a las primeras naves. En el medio está el camino. Un lado es izquierdo y otro derecho. Puede haber 37, 38 o 39 naves.", "Tumayo na nakatalikod sa unang naves. Nasa gitna ang daan. Isang side kaliwa, isa kanan. Puwedeng 37, 38 o 39 naves.", "Berdiri membelakangi nave pertama. Jalan ada di tengah. Satu sisi kiri, satu sisi kanan. Jumlah nave bisa 37, 38 atau 39.", "पहिलो नावातिर ढाड फर्काएर उभिनुहोस्। बीचमा बाटो छ। एक भाग बायाँ, अर्को दायाँ। नावा ३७, ३८ वा ३९ हुन सक्छ।")))}</p>
              <div class="schema">
                <div class="greenhouse-map" aria-label="greenhouse schema">
                  <div class="green-side">${Array.from({ length: 35 }, () => '<span class="nave-cell"></span>').join("")}</div>
                  <div class="center-road">${esc(text(tx("droga środkowa", "middle road", "центральна дорога", "центральная дорога", "orta yol", "camino central", "gitnang daan", "jalan tengah", "बीच बाटो")))}</div>
                  <div class="green-side">${Array.from({ length: 35 }, () => '<span class="nave-cell"></span>').join("")}</div>
                </div>
              </div>
              <div class="btn-row">${action("assets/orientation/sklarnia-etap-excel.png", ui("showFullImage"), "secondary")}</div>
            </div>
          </article>
          <article class="step-card">
            <span class="step-number">2</span>
            <div>
              <h3>${esc(text(tx("Jedna nawa", "One nave", "Одна нава", "Одна нава", "Bir nava", "Una nave", "Isang nave", "Satu nave", "एउटा नावा")))}</h3>
              <p>${esc(text(tx("Patrzysz na nawę. Nie ma tu różnicy prawa/lewa strona szklarni. Od lewej zaczyna się pierwsze wejście. W nawie jest 5 wejść obok siebie i 10 rzędów.", "You look at one nave. Here we do not use greenhouse left/right. The first entrance starts from the left. One nave has 5 entrances next to each other and 10 rows.", "Ви дивитесь на одну наву. Тут не ділимо на праву/ліву сторону теплиці. Зліва починається перший вхід. У наві 5 входів поруч і 10 рядів.", "Вы смотрите на одну наву. Здесь не делим на правую/левую сторону теплицы. Слева начинается первый вход. В наве 5 входов рядом и 10 рядов.", "Bir navaya baxırsınız. Burada istixananın sağ/sol tərəfi fərqləndirilmir. Soldan birinci giriş başlayır. Navada yanaşı 5 giriş və 10 sıra var.", "Miras una nave. Aquí no usamos lado derecho/izquierdo del invernadero. Desde la izquierda empieza la primera entrada. Hay 5 entradas y 10 filas.", "Tinitingnan ang isang nave. Dito walang greenhouse right/left. Sa kaliwa nagsisimula ang unang pasukan. May 5 pasukan at 10 rows.", "Anda melihat satu nave. Di sini tidak memakai kanan/kiri rumah kaca. Dari kiri mulai pintu pertama. Ada 5 pintu dan 10 baris.", "एउटा नावा हेर्दै हुनुहुन्छ। यहाँ ग्रीनहाउसको दायाँ/बायाँ फरक छैन। बायाँबाट पहिलो प्रवेश सुरु हुन्छ। ५ प्रवेश र १० पङ्क्ति हुन्छ।")))}</p>
              <div class="schema">
                <div class="nave-diagram">
                  ${Array.from({ length: 5 }, (_, i) => `<div class="entry"><span>${i + 1}</span><div class="entry-rows"><div class="row-line"></div><div class="row-line"></div></div></div>`).join("")}
                </div>
              </div>
            </div>
          </article>
          <article class="step-card">
            <span class="step-number">3</span>
            <div>
              <h3>${esc(text(tx("Wejście do rzędu", "Entry into the row", "Вхід у ряд", "Вход в ряд", "Sıraya giriş", "Entrada al pasillo", "Pasok sa row", "Masuk ke baris", "पङ्क्तिमा प्रवेश")))}</h3>
              <p>${esc(text(tx("Patrzysz w przejście. Z lewej strony masz lewe przęsło, z prawej prawe przęsło. Praca odbywa się w rzędzie, a nie 'obok rzędu'.", "You look into the passage. On the left is the left span; on the right is the right span. Work is in the row, not next to the row.", "Ви дивитесь у прохід. Зліва ліве прясло, справа праве. Робота відбувається в ряду, не біля ряду.", "Вы смотрите в проход. Слева левое прясло, справа правое. Работа в ряду, не возле ряда.", "Keçidə baxırsınız. Solda sol bölmə, sağda sağ bölmə. İş sıranın içindədir, sıranın yanında deyil.", "Miras al pasillo. A la izquierda está el tramo izquierdo, a la derecha el derecho. Se trabaja dentro de la fila, no al lado.", "Tumingin sa passage. Sa kaliwa left span, sa kanan right span. Trabaho ay nasa row, hindi sa tabi.", "Lihat ke lorong. Kiri = bentang kiri, kanan = bentang kanan. Kerja di dalam baris, bukan di samping.", "पासेजतिर हेर्नुहोस्। बायाँमा left span, दायाँमा right span। काम पङ्क्तिभित्र हुन्छ, पङ्क्तिको छेउमा होइन।")))}</p>
              <div class="schema">
                <div class="passage-diagram">
                  <div class="span-side">${esc(text(tx("lewe przęsło", "left span", "ліве прясло", "левое прясло", "sol bölmə", "tramo izquierdo", "left span", "bentang kiri", "बायाँ span")))}</div>
                  <div class="work-passage">${esc(text(tx("przejście", "passage", "прохід", "проход", "keçid", "pasillo", "passage", "lorong", "पासेज")))}</div>
                  <div class="span-side">${esc(text(tx("prawe przęsło", "right span", "праве прясло", "правое прясло", "sağ bölmə", "tramo derecho", "right span", "bentang kanan", "दायाँ span")))}</div>
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>
    `;
  }

  function readerTabButton(tab, active) {
    return `<button class="pill${active ? " active" : ""}" type="button" data-reader-tab="${esc(tab.id)}">${esc(text(tab.title))}</button>`;
  }

  function renderReader(activeId = "start") {
    const active = DATA.readerTabs.find((tab) => tab.id === activeId) || DATA.readerTabs[0];
    const tabs = DATA.readerTabs.map((tab) => readerTabButton(tab, tab.id === active.id)).join("");
    const steps = active.steps.map((item, index) => `
      <article class="step-card">
        <span class="step-number">${index + 1}</span>
        <div><p>${esc(text(item))}</p></div>
      </article>
    `).join("");
    const imageBlocks = [
      active.image ? { src: active.image, caption: active.imageCaption } : null,
      ...(active.images || [])
    ].filter(Boolean).map((image) => `
      <figure class="media">
        <img src="${esc(image.src)}" alt="${esc(text(image.caption))}">
        <figcaption>${esc(text(image.caption))}</figcaption>
      </figure>
    `).join("");

    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <section class="card yellow">
          <p><strong>${esc(ui("important"))}:</strong> ${esc(text(DATA.pages.reader.lead))}</p>
        </section>
        <section class="section">
          <div class="pill-row">${tabs}</div>
          <div class="steps">${steps}</div>
          ${imageBlocks ? `<div class="section photo-grid">${imageBlocks}</div>` : ""}
        </section>
      </main>
    `;

    app.querySelectorAll("[data-reader-tab]").forEach((button) => {
      button.addEventListener("click", () => renderReader(button.dataset.readerTab));
    });
  }

  function renderMedical() {
    const cards = DATA.medical.map((item) => {
      const notes = item.body.map((note) => `<li>${esc(text(note))}</li>`).join("");
      const maps = (item.maps || []).map((map) => action(map.url, `${ui("openMap")} - ${map.label}`, item.tone)).join("");
      const oneMap = item.map ? action(item.map, ui("openMap"), item.tone) : "";
      const phones = (item.phones || []).map((phone) => `
        <article class="person">
          <div class="person-name">${esc(phone.label)}</div>
          <div class="btn-row"><a class="btn secondary" href="${esc(telHref(phone.phone))}">${esc(ui("call"))} ${esc(formatPhone(phone.phone))}</a></div>
        </article>
      `).join("");
      return `
        <section class="${cardClass(item.tone)}">
          <h2>${esc(text(item.title))}</h2>
          <ul class="list">${notes}</ul>
          ${maps || oneMap ? `<div class="btn-row">${oneMap}${maps}</div>` : ""}
          ${phones ? `<div class="section contact-group">${phones}</div>` : ""}
        </section>
      `;
    }).join("");

    app.innerHTML = `<main class="page">${pageHero()}<div class="module-grid">${cards}</div><section class="card red section"><h2>112</h2><p>${esc(text(tx("W sytuacji zagrożenia życia dzwoń pod numer 112.", "In a life-threatening situation call 112.", "У ситуації загрози життю телефонуйте 112.", "В ситуации угрозы жизни звоните 112.", "Həyat təhlükəsi olduqda 112-yə zəng edin.", "En peligro de vida llama al 112.", "Kung buhay ay nasa panganib, tumawag sa 112.", "Jika mengancam nyawa, hubungi 112.", "जीवन जोखिममा भए 112 मा फोन गर्नुहोस्।")))}</p><div class="btn-row"><a class="btn red" href="tel:112">112</a></div></section></main>`;
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
            ${groupLabel ? `<span class="mini-tag">${esc(groupLabel)}</span>` : ""}
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
        <h2>${esc(item.title)}</h2>
        <div class="btn-row">${action(item.url, `${ui("open")} ${item.title}`, "blue")}</div>
      </article>
    `).join("");
    app.innerHTML = `<main class="page">${pageHero()}<section class="module-grid">${cards}</section></main>`;
  }

  function renderCity() {
    const cards = DATA.city.map((item) => `
      <article class="${cardClass(item.tone)}">
        <h2>${esc(text(item.title))}</h2>
        <p>${esc(text(item.note))}</p>
        ${item.url ? `<div class="btn-row">${action(item.url, ui("openMap"), item.tone)}</div>` : ""}
      </article>
    `).join("");
    app.innerHTML = `<main class="page">${pageHero()}<section class="module-grid">${cards}</section></main>`;
  }

  function renderBans() {
    const cards = DATA.bans.map((item, index) => `
      <article class="step-card">
        <span class="step-number">${index + 1}</span>
        <div><p>${esc(text(item))}</p></div>
      </article>
    `).join("");
    app.innerHTML = `<main class="page">${pageHero()}<section class="steps">${cards}</section></main>`;
  }

  function renderTest() {
    const questions = DATA.test.map((item, index) => `
      <article class="test-question" data-q="${index}" data-ok="${item.ok ? "1" : "0"}">
        <h3>${index + 1}. ${esc(text(item.text))}</h3>
        <label><input type="radio" name="q${index}" value="1"> ${esc(ui("yes"))}</label>
        <label><input type="radio" name="q${index}" value="0"> ${esc(ui("no"))}</label>
      </article>
    `).join("");

    app.innerHTML = `
      <main class="page">
        ${pageHero()}
        <form id="testForm" class="stack">
          ${questions}
          <button class="btn yellow" type="submit">${esc(ui("score"))}</button>
        </form>
        <div id="testResult"></div>
      </main>
    `;

    document.getElementById("testForm").addEventListener("submit", (event) => {
      event.preventDefault();
      let score = 0;
      let answered = 0;
      DATA.test.forEach((item, index) => {
        const selected = app.querySelector(`input[name="q${index}"]:checked`);
        if (!selected) return;
        answered += 1;
        if ((selected.value === "1") === item.ok) score += 1;
      });
      const total = DATA.test.length;
      const message = `Wynik testu Citronex Siechnice: ${score}/${total}. Odpowiedzi: ${answered}/${total}. Jezyk: ${lang.toUpperCase()}.`;
      document.getElementById("testResult").innerHTML = `
        <section class="result-box">
          <h2>${esc(ui("score"))}: ${score}/${total}</h2>
          <p>${esc(text(tx("Po sprawdzeniu wyślij wynik przez WhatsApp albo Viber.", "After checking, send the result by WhatsApp or Viber.", "Після перевірки надішліть результат через WhatsApp або Viber.", "После проверки отправьте результат через WhatsApp или Viber.", "Yoxladıqdan sonra nəticəni WhatsApp və ya Viber ilə göndərin.", "Después de revisar, envía el resultado por WhatsApp o Viber.", "Pagkatapos, ipadala ang resulta sa WhatsApp o Viber.", "Setelah dicek, kirim hasil via WhatsApp atau Viber.", "जाँचपछि WhatsApp वा Viber बाट नतिजा पठाउनुहोस्।")))}</p>
          <div class="btn-row">
            <a class="btn" target="_blank" rel="noopener" href="${esc(waHref("+48502251384", message))}">${esc(ui("sendResult"))} WhatsApp</a>
            <a class="btn secondary" href="${esc(viberHref("+48794912552", message))}">${esc(ui("sendResult"))} Viber</a>
          </div>
        </section>
      `;
      document.getElementById("testResult").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function renderPage() {
    renderHeader();
    const renderers = {
      home: renderHome,
      mapa: renderMap,
      magazyn: renderWarehouse,
      szklarnia: renderGreenhouse,
      reader: renderReader,
      lekarz: renderMedical,
      kontakty: renderContacts,
      grupy: renderGroups,
      miasto: renderCity,
      zakazy: renderBans,
      test: renderTest
    };
    (renderers[page] || renderHome)();
  }

  function upgradeCache() {
    if ("caches" in window) {
      caches.keys().then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("citronex-siechnice-training-") && !key.includes("modular"))
        .map((key) => caches.delete(key))
      )).catch(() => {});
    }

    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("./sw.js").then((registration) => registration.update()).catch(() => {});
    }
  }

  renderPage();
  upgradeCache();
})();
