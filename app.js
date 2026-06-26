const STORAGE_KEY = 'citronexTrainingState';
const LANG_NAMES = { pl: 'PL', ua: 'UA', ru: 'RU', en: 'EN', az: 'AZ' };

const state = loadState();
let currentLang = state.lang || 'pl';

const els = {
  languageButtons: document.querySelectorAll('[data-lang]'),
  trainingSection: document.getElementById('trainingSection'),
  quizSection: document.getElementById('quizSection'),
  quizList: document.getElementById('quizList'),
  finishBtn: document.getElementById('finishBtn'),
  startBtn: document.getElementById('startBtn'),
  resetBtn: document.getElementById('resetBtn'),
  progressText: document.getElementById('progressText'),
  progressBar: document.getElementById('progressBar'),
  certificateSection: document.getElementById('certificateSection'),
  workerName: document.getElementById('workerName'),
  doneDate: document.getElementById('doneDate'),
  doneLang: document.getElementById('doneLang'),
  copyBtn: document.getElementById('copyBtn'),
  copyMessage: document.getElementById('copyMessage'),
  quizMessage: document.getElementById('quizMessage'),
};

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (_) {
    return {};
  }
}

function saveState(patch) {
  Object.assign(state, patch);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function t(key) {
  const pack = window.TRAINING_DATA?.[currentLang] || window.TRAINING_DATA?.pl;
  return pack?.ui?.[key] || window.TRAINING_DATA?.pl?.ui?.[key] || key;
}

function data() {
  return window.TRAINING_DATA?.[currentLang] || window.TRAINING_DATA?.pl;
}

function setLanguage(lang) {
  currentLang = window.TRAINING_DATA?.[lang] ? lang : 'pl';
  document.documentElement.lang = currentLang === 'ua' ? 'uk' : currentLang;
  saveState({ lang: currentLang });
  render();
}

function renderI18n() {
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  els.workerName.placeholder = t('namePlaceholder');
  els.languageButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

function renderTraining() {
  const sections = data().sections;
  els.trainingSection.innerHTML = sections.map((section, index) => `
    <article class="card training-card" data-training-card="${index}">
      <span class="pill">${index + 1}/${sections.length}</span>
      <h2>${escapeHtml(section.title)}</h2>
      <ul>${section.items.map((item) => `<li>${renderContent(item)}</li>`).join('')}</ul>
      ${section.notice ? `<div class="notice">${renderContent(section.notice)}</div>` : ''}
    </article>
  `).join('');
}

function renderQuiz() {
  const questions = data().quiz;
  els.quizList.innerHTML = questions.map((question, qIndex) => `
    <div class="quiz-item">
      <strong>${qIndex + 1}. ${escapeHtml(question.question)}</strong>
      <div class="quiz-options">
        ${question.options.map((option, oIndex) => `
          <label>
            <input type="radio" name="q${qIndex}" value="${oIndex}">
            <span>${escapeHtml(option)}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function updateProgress() {
  const sectionsCount = data().sections.length || 1;
  const completed = state.completed ? 100 : state.started ? Math.min(85, Math.round((sectionsCount / (sectionsCount + 2)) * 100)) : 0;
  els.progressText.textContent = `${completed}%`;
  els.progressBar.style.width = `${completed}%`;
}

function startTraining() {
  saveState({ started: true });
  els.quizSection.classList.remove('hidden');
  updateProgress();
  document.getElementById('trainingSection').scrollIntoView({ behavior: 'smooth' });
}

function finishTraining() {
  const questions = data().quiz;
  const answers = questions.map((_, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    return selected ? Number(selected.value) : null;
  });
  const allAnswered = answers.every((answer) => answer !== null);
  const allCorrect = answers.every((answer, index) => answer === questions[index].correct);

  if (!allAnswered) {
    els.quizMessage.textContent = t('answerAll');
    return;
  }
  if (!allCorrect) {
    els.quizMessage.textContent = t('tryAgain');
    return;
  }

  const today = new Date().toLocaleDateString('pl-PL');
  saveState({ completed: true, completedAt: today });
  showCertificate();
}

function showCertificate() {
  els.certificateSection.classList.remove('hidden');
  els.doneDate.textContent = state.completedAt || new Date().toLocaleDateString('pl-PL');
  els.doneLang.textContent = LANG_NAMES[currentLang] || currentLang.toUpperCase();
  els.workerName.value = state.workerName || '';
  updateProgress();
  els.certificateSection.scrollIntoView({ behavior: 'smooth' });
}

function buildConfirmation() {
  const name = els.workerName.value.trim() || t('noName');
  return [
    t('confirmHeader'),
    `${t('nameLabel')}: ${name}`,
    `${t('dateLabel')}: ${els.doneDate.textContent}`,
    `${t('langLabel')}: ${LANG_NAMES[currentLang] || currentLang.toUpperCase()}`,
    `${t('placeLabel')}: Siechnice`,
  ].join('\n');
}

async function copyConfirmation() {
  saveState({ workerName: els.workerName.value.trim() });
  const text = buildConfirmation();
  try {
    await navigator.clipboard.writeText(text);
    els.copyMessage.textContent = t('copied');
  } catch (_) {
    els.copyMessage.textContent = text;
  }
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

function renderContent(value) {
  if (typeof value === 'object' && value !== null && value.url) {
    return `<a class="map-link" href="${escapeAttribute(value.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(value.label || value.url)}</a>`;
  }
  return escapeHtml(value).replace(/https?:\/\/[^\s]+/g, (url) => {
    return `<a href="${escapeAttribute(url)}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return String(value).replaceAll('"', '&quot;');
}

function bindEvents() {
  els.languageButtons.forEach((btn) => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
  els.startBtn.addEventListener('click', startTraining);
  els.finishBtn.addEventListener('click', finishTraining);
  els.copyBtn.addEventListener('click', copyConfirmation);
  els.resetBtn.addEventListener('click', resetState);
  els.workerName.addEventListener('input', () => saveState({ workerName: els.workerName.value.trim() }));
}

function render() {
  renderI18n();
  renderTraining();
  renderQuiz();
  updateProgress();
  els.quizSection.classList.toggle('hidden', !state.started);
  els.certificateSection.classList.toggle('hidden', !state.completed);
  if (state.completed) {
    els.doneDate.textContent = state.completedAt || new Date().toLocaleDateString('pl-PL');
    els.doneLang.textContent = LANG_NAMES[currentLang] || currentLang.toUpperCase();
    els.workerName.value = state.workerName || '';
  }
}

bindEvents();
render();
