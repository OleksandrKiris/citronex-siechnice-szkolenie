#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const guide = JSON.parse(fs.readFileSync(path.join(root, "assets", "content", "presenter-guide.json"), "utf8"));
const expectedLanguages = ["pl", "en", "ua", "ru", "az", "es", "fil", "id", "ne"];
const errors = [];
const warnings = [];
const report = [];
const mojibake = /\uFFFD|Ã.|Â.|Ð.|Ñ.|â.|рџ|а¤/u;
const placeholders = /\b(?:TODO|TBD|MISSING|lorem ipsum)\b/i;

const disclaimerTokens = {
  pl: ["nie zastępuje", "instruktażu"],
  en: ["does not replace", "workplace instruction"],
  ua: ["не замінює", "інструктажу"],
  ru: ["не заменяет", "инструктаж"],
  az: ["əvəz etmir", "təlimat"],
  es: ["no sustituye", "instrucción"],
  fil: ["hindi nito pinapalitan", "pagsasanay"],
  id: ["tidak menggantikan", "pengarahan"],
  ne: ["प्रतिस्थापन गर्दैन", "निर्देशन"]
};

const criticalNumbers = {
  "greenhouse-nave": ["5", "10"],
  "help-emergency": ["112", "800", "190", "590"],
  finish: ["30"]
};

const restartFiveWords = {
  pl: "pięć", en: "five", ua: "п'ять", ru: "пять", az: "beş",
  es: "cinco", fil: "limang", id: "lima", ne: "पाँच"
};

function normalizeDigits(value) {
  return String(value).replace(/[०-९]/g, (digit) => String("०१२३४५६७८९".indexOf(digit)));
}

function scriptRatio(value, expression) {
  const letters = [...String(value)].filter((character) => /\p{L}/u.test(character));
  if (!letters.length) return 0;
  return letters.filter((character) => expression.test(character)).length / letters.length;
}

const reference = guide.languages?.pl?.sections;
if (!Array.isArray(reference) || reference.length !== 50) errors.push("Polish reference must contain exactly 50 chapters");
const referenceIds = Array.isArray(reference) ? reference.map((section) => section.id) : [];

for (const language of expectedLanguages) {
  const localized = guide.languages?.[language];
  if (!localized || !Array.isArray(localized.sections)) {
    errors.push(`${language}: translation is missing`);
    continue;
  }
  const sections = localized.sections;
  const ids = sections.map((section) => section.id);
  if (JSON.stringify(ids) !== JSON.stringify(referenceIds)) errors.push(`${language}: chapter order differs from Polish`);

  let allCopy = "";
  sections.forEach((section, index) => {
    const label = `${language}/${String(index + 1).padStart(2, "0")}-${section.id}`;
    const title = String(section.title || "").trim();
    const text = String(section.text || "").trim();
    allCopy += ` ${title} ${text}`;
    if (title.length < 3) errors.push(`${label}: title is missing`);
    if (text.length < 25) errors.push(`${label}: text is too short`);
    if (mojibake.test(`${title} ${text}`)) errors.push(`${label}: damaged character encoding detected`);
    if (placeholders.test(`${title} ${text}`)) errors.push(`${label}: placeholder text detected`);
    if (!Array.isArray(section.tracks) || !section.tracks.length) errors.push(`${label}: course route is missing`);

    if (section.image && !/^https?:\/\//i.test(section.image)) {
      const imagePath = path.join(root, section.image.replace(/^\.\//, ""));
      if (!fs.existsSync(imagePath)) errors.push(`${label}: visual asset is missing (${section.image})`);
    }

    const expectedNumbers = criticalNumbers[section.id] || [];
    const normalizedText = normalizeDigits(text);
    expectedNumbers.forEach((number) => {
      if (!new RegExp(`(^|\\D)${number}(\\D|$)`).test(normalizedText)) errors.push(`${label}: critical number ${number} is missing`);
    });
    if (section.id === "reader-restart-menu" && !text.toLocaleLowerCase().includes(restartFiveWords[language])) {
      errors.push(`${label}: the instruction to press DOWN five times is missing`);
    }

    const audioName = `${String(index + 1).padStart(2, "0")}-${section.id}.mp3`;
    const audioPath = path.join(root, "assets", "audio", "guide", language, audioName);
    if (!fs.existsSync(audioPath)) errors.push(`${label}: narration is missing (${audioName})`);
    else if (fs.statSync(audioPath).size < 4096) errors.push(`${label}: narration is too small (${audioName})`);
  });

  const finishText = String(sections.find((section) => section.id === "finish")?.text || "").toLocaleLowerCase(language === "ua" ? "uk" : language);
  (disclaimerTokens[language] || []).forEach((token) => {
    if (!finishText.includes(token)) errors.push(`${language}/finish: workplace-instruction disclaimer is incomplete (${token})`);
  });

  const cyrillicRatio = scriptRatio(allCopy, /[\u0400-\u04ff]/u);
  const devanagariRatio = scriptRatio(allCopy, /[\u0900-\u097f]/u);
  if (["ua", "ru"].includes(language) && cyrillicRatio < .45) errors.push(`${language}: too little Cyrillic text (${cyrillicRatio.toFixed(2)})`);
  if (language === "ne" && devanagariRatio < .45) errors.push(`${language}: too little Devanagari text (${devanagariRatio.toFixed(2)})`);
  if (!["ua", "ru"].includes(language) && language !== "ne" && (cyrillicRatio > .01 || devanagariRatio > .01)) {
    errors.push(`${language}: foreign-script leakage detected`);
  }

  const calculatedCharacters = sections.reduce((sum, section) => sum + String(section.text || "").length, 0);
  if (localized.totalCharacters !== calculatedCharacters) errors.push(`${language}: character total is stale`);
  if (calculatedCharacters > 10000) errors.push(`${language}: narration exceeds the 10,000-character limit`);
  report.push(`${language}: ${sections.length} chapters, ${calculatedCharacters} characters, audio ${sections.length}/${sections.length}`);
}

const unknownLanguages = Object.keys(guide.languages || {}).filter((language) => !expectedLanguages.includes(language));
if (unknownLanguages.length) warnings.push(`unexpected languages: ${unknownLanguages.join(", ")}`);

console.log("Citronex language quality audit");
report.forEach((line) => console.log(line));
console.log(`Critical language checks: ${expectedLanguages.length * 50}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Errors: ${errors.length}`);
warnings.forEach((warning) => console.log(`WARNING: ${warning}`));
errors.forEach((error) => console.error(`ERROR: ${error}`));
if (errors.length) process.exitCode = 1;
