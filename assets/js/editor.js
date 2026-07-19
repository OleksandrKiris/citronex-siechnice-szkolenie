(() => {
  "use strict";

  const DRAFT_KEY = "cx-editor-guide-draft-v1";
  const $ = (selector) => document.querySelector(selector);
  const controls = {
    status: $("[data-editor-status]"), language: $("[data-editor-language]"), search: $("[data-editor-search]"),
    chapter: $("[data-editor-chapter]"), form: $("[data-editor-form]"), title: $("[data-editor-title]"),
    text: $("[data-editor-text]"), image: $("[data-editor-image]"), pose: $("[data-editor-pose]"), tone: $("[data-editor-tone]"),
    group: $("[data-editor-group-input]"), id: $("[data-editor-id]"), sourceLabel: $("[data-editor-source-label]"),
    sourceUrl: $("[data-editor-source-url]"), heading: $("[data-editor-heading]"), groupName: $("[data-editor-group]"),
    position: $("[data-editor-position]"), chars: $("[data-editor-chars]"), audio: $("[data-editor-audio-check]"),
    previewImage: $("[data-editor-preview-image]"), previewTitle: $("[data-editor-preview-title]"), previewText: $("[data-editor-preview-text]"),
    importButton: $("[data-editor-import]"), file: $("[data-editor-file]"), reset: $("[data-editor-reset]"),
    preview: $("[data-editor-preview]"), copy: $("[data-editor-copy]"), download: $("[data-editor-download]"), toast: $("[data-editor-toast]")
  };

  let guide = null;
  let original = null;
  let activeLanguage = "ru";
  let activeIndex = 0;
  let toastTimer = 0;
  let resetArmed = false;
  let resetTimer = 0;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const languageLabels = { pl: "Polski", en: "English", ua: "Українська", ru: "Русский", az: "Azərbaycanca", es: "Español", fil: "Filipino", id: "Indonesia", ne: "नेपाली" };

  function notify(message) {
    window.clearTimeout(toastTimer);
    controls.toast.textContent = message;
    controls.toast.hidden = false;
    toastTimer = window.setTimeout(() => { controls.toast.hidden = true; }, 2600);
  }

  function validate(value) {
    if (!value || typeof value !== "object" || !value.languages || typeof value.languages !== "object") throw new Error("В файле нет languages.");
    Object.entries(value.languages).forEach(([language, payload]) => {
      if (!payload || !Array.isArray(payload.sections) || !payload.sections.length) throw new Error(`В языке ${language} нет глав.`);
      payload.sections.forEach((section, index) => {
        if (!section.id || !section.title || !section.text) throw new Error(`Неполная глава ${index + 1} в языке ${language}.`);
      });
    });
    return value;
  }

  function sections() {
    return guide?.languages?.[activeLanguage]?.sections || [];
  }

  function current() {
    return sections()[activeIndex] || null;
  }

  function originalCurrent() {
    const id = current()?.id;
    return original?.languages?.[activeLanguage]?.sections?.find((section) => section.id === id) || null;
  }

  function renderLanguages() {
    controls.language.innerHTML = Object.keys(guide.languages).map((language) => `<option value="${language}">${languageLabels[language] || language}</option>`).join("");
    if (!guide.languages[activeLanguage]) activeLanguage = Object.keys(guide.languages)[0];
    controls.language.value = activeLanguage;
  }

  function renderChapterList() {
    const query = controls.search.value.trim().toLocaleLowerCase();
    const options = sections().map((section, index) => ({ section, index })).filter(({ section }) => {
      const haystack = `${section.id} ${section.groupTitle || ""} ${section.title}`.toLocaleLowerCase();
      return !query || haystack.includes(query);
    });
    controls.chapter.innerHTML = "";
    options.forEach(({ section, index }) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${String(index + 1).padStart(2, "0")} · ${section.title}`;
      controls.chapter.appendChild(option);
    });
    if (!options.some(({ index }) => index === activeIndex)) activeIndex = options[0]?.index ?? 0;
    controls.chapter.value = String(activeIndex);
  }

  function updatePreview(section = current()) {
    if (!section) return;
    controls.previewTitle.textContent = section.title;
    controls.previewText.textContent = section.text;
    const image = String(section.image || "").trim();
    controls.previewImage.style.backgroundImage = image ? `url("${image.replace(/["\\]/g, "")}")` : "none";
  }

  function updateAudioStatus() {
    const source = originalCurrent();
    const changed = !source || controls.title.value.trim() !== source.title || controls.text.value.trim() !== source.text;
    controls.audio.classList.toggle("is-changed", changed);
    controls.audio.innerHTML = changed
      ? "<strong>Текст изменён — аудио больше не совпадает.</strong><span>Перед публикацией создайте новую запись для этой главы и языка.</span>"
      : "<strong>Текст совпадает с опубликованной версией.</strong><span>Готовая аудиозапись остаётся синхронизированной.</span>";
  }

  function renderForm() {
    const section = current();
    if (!section) return;
    controls.title.value = section.title || "";
    controls.text.value = section.text || "";
    controls.image.value = section.image || "";
    controls.pose.value = section.pose || "neutral";
    controls.tone.value = section.tone || "neutral";
    controls.group.value = section.group || "";
    controls.id.value = section.id || "";
    controls.sourceLabel.value = section.sourceLabel || "";
    controls.sourceUrl.value = section.sourceUrl || "";
    controls.heading.textContent = section.title;
    controls.groupName.textContent = section.groupTitle || section.group || "";
    controls.position.textContent = `${activeIndex + 1} / ${sections().length}`;
    controls.chars.textContent = `${section.text.length} знаков`;
    updatePreview(section);
    updateAudioStatus();
  }

  function applyForm() {
    const section = current();
    if (!section) return;
    section.title = controls.title.value.trim();
    section.text = controls.text.value.trim();
    section.image = controls.image.value.trim();
    section.pose = controls.pose.value;
    section.tone = controls.tone.value;
    const sourceLabel = controls.sourceLabel.value.trim();
    const sourceUrl = controls.sourceUrl.value.trim();
    if (sourceLabel && sourceUrl) {
      section.sourceLabel = sourceLabel;
      section.sourceUrl = sourceUrl;
    } else {
      delete section.sourceLabel;
      delete section.sourceUrl;
    }
    const payload = guide.languages[activeLanguage];
    payload.totalCharacters = payload.sections.reduce((sum, item) => sum + item.text.length, 0);
    guide.chapterCount = Math.max(...Object.values(guide.languages).map((item) => item.sections.length));
    localStorage.setItem(DRAFT_KEY, JSON.stringify(guide));
    controls.status.textContent = "Черновик сохранён";
    renderChapterList();
    renderForm();
  }

  function downloadGuide() {
    applyForm();
    const blob = new Blob([`${JSON.stringify(guide, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "presenter-guide.json";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 500);
    notify("Файл presenter-guide.json подготовлен.");
  }

  async function load() {
    const response = await fetch("assets/content/presenter-guide.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Не удалось загрузить presenter-guide.json.");
    original = validate(await response.json());
    try {
      guide = validate(JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"));
      controls.status.textContent = "Открыт локальный черновик";
    } catch (error) {
      guide = clone(original);
      controls.status.textContent = "Открыта опубликованная версия";
    }
    renderLanguages();
    renderChapterList();
    renderForm();
  }

  controls.language.addEventListener("change", () => { activeLanguage = controls.language.value; activeIndex = 0; renderChapterList(); renderForm(); });
  controls.search.addEventListener("input", () => { renderChapterList(); renderForm(); });
  controls.chapter.addEventListener("change", () => { activeIndex = Number(controls.chapter.value) || 0; renderForm(); });
  controls.form.addEventListener("submit", (event) => { event.preventDefault(); applyForm(); notify("Черновик сохранён в этом браузере."); });
  [controls.title, controls.text, controls.image, controls.pose, controls.tone, controls.sourceLabel, controls.sourceUrl].forEach((control) => {
    control.addEventListener("input", () => {
      const draft = { ...current(), title: controls.title.value, text: controls.text.value, image: controls.image.value };
      controls.chars.textContent = `${controls.text.value.length} знаков`;
      updatePreview(draft);
      updateAudioStatus();
    });
  });
  controls.preview.addEventListener("click", () => { applyForm(); window.open(`pomocnik.html?lang=${encodeURIComponent(activeLanguage)}&draft=1`, "_blank", "noopener"); });
  controls.copy.addEventListener("click", async () => { applyForm(); await navigator.clipboard.writeText(JSON.stringify(guide, null, 2)); notify("JSON скопирован."); });
  controls.download.addEventListener("click", downloadGuide);
  controls.importButton.addEventListener("click", () => controls.file.click());
  controls.file.addEventListener("change", async () => {
    const file = controls.file.files?.[0];
    if (!file) return;
    try {
      guide = validate(JSON.parse(await file.text()));
      localStorage.setItem(DRAFT_KEY, JSON.stringify(guide));
      activeIndex = 0;
      renderLanguages(); renderChapterList(); renderForm();
      controls.status.textContent = "Импортирован новый черновик";
      notify("JSON импортирован и проверен.");
    } catch (error) { notify(`Ошибка импорта: ${error.message}`); }
    controls.file.value = "";
  });
  controls.reset.addEventListener("click", () => {
    if (!resetArmed) {
      resetArmed = true;
      controls.reset.textContent = "Нажмите ещё раз для сброса";
      notify("Повторное нажатие удалит локальный черновик.");
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        resetArmed = false;
        controls.reset.textContent = "Сбросить черновик";
      }, 3500);
      return;
    }
    resetArmed = false;
    window.clearTimeout(resetTimer);
    controls.reset.textContent = "Сбросить черновик";
    localStorage.removeItem(DRAFT_KEY);
    guide = clone(original);
    activeIndex = 0;
    renderLanguages(); renderChapterList(); renderForm();
    controls.status.textContent = "Открыта опубликованная версия";
    notify("Черновик удалён.");
  });

  load().catch((error) => { controls.status.textContent = "Ошибка загрузки"; notify(error.message); });
})();
