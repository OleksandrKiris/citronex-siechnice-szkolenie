#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const guidePath = path.join(root, "assets", "content", "presenter-guide.json");
const guide = JSON.parse(fs.readFileSync(guidePath, "utf8"));
const expectedLanguages = ["pl", "en", "ua", "ru", "az", "es", "fil", "id", "ne"];
const expectedSections = ["welcome", "arrival", "warehouse", "greenhouse", "reader", "tablet", "safety", "documents", "help", "finish"];
const errors = [];
const warnings = [];

function normalizeDigits(value) {
  return String(value).replace(/[०-९]/g, (digit) => String("०१२३४५६७८९".indexOf(digit)));
}

function numberTokens(value) {
  return (normalizeDigits(value).match(/\d+(?::\d+)?/g) || []).sort();
}

function sameArray(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

const languageKeys = Object.keys(guide.languages || {});
if (!sameArray([...languageKeys].sort(), [...expectedLanguages].sort())) {
  errors.push(`language set differs: ${languageKeys.join(", ")}`);
}

const reference = guide.languages && guide.languages.pl && guide.languages.pl.sections;
if (!Array.isArray(reference)) errors.push("Polish reference sections are missing");

for (const language of expectedLanguages) {
  const localized = guide.languages && guide.languages[language];
  if (!localized || !Array.isArray(localized.sections)) {
    errors.push(`${language}: sections are missing`);
    continue;
  }
  const ids = localized.sections.map((section) => section.id);
  if (!sameArray(ids, expectedSections)) errors.push(`${language}: section order differs (${ids.join(", ")})`);

  const totalCharacters = localized.sections.reduce((sum, section) => sum + String(section.text || "").length, 0);
  if (totalCharacters > 10000) errors.push(`${language}: ${totalCharacters} characters exceeds the 10,000 limit`);
  if (totalCharacters < 5000) warnings.push(`${language}: briefing is unusually short (${totalCharacters} characters)`);

  localized.sections.forEach((section, index) => {
    if (!section || typeof section.title !== "string" || section.title.trim().length < 3) {
      errors.push(`${language}/${expectedSections[index]}: missing title`);
    }
    if (!section || typeof section.text !== "string" || section.text.trim().length < 120) {
      errors.push(`${language}/${expectedSections[index]}: text is missing or too short`);
    }
    if (/[ÃÂ]|â(?:€|™|œ)|ðŸ/u.test(`${section.title} ${section.text}`)) {
      errors.push(`${language}/${expectedSections[index]}: possible broken UTF-8 text`);
    }
    if (reference && reference[index]) {
      const referenceNumbers = numberTokens(reference[index].text);
      const localizedNumbers = numberTokens(section.text);
      if (!sameArray(referenceNumbers, localizedNumbers)) {
        errors.push(`${language}/${section.id}: numbers differ (${referenceNumbers.join(",")} vs ${localizedNumbers.join(",")})`);
      }
    }

    const audioName = `${String(index + 1).padStart(2, "0")}-${section.id}.mp3`;
    const audioPath = path.join(root, "assets", "audio", "guide", language, audioName);
    if (!fs.existsSync(audioPath)) errors.push(`${language}/${section.id}: audio is missing (${audioName})`);
    else if (fs.statSync(audioPath).size < 4096) errors.push(`${language}/${section.id}: audio file is too small (${audioName})`);
  });
}

console.log("Citronex presenter audit");
console.log(`Languages: ${expectedLanguages.length}`);
console.log(`Sections per language: ${expectedSections.length}`);
console.log(`Expected audio files: ${expectedLanguages.length * expectedSections.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Errors: ${errors.length}`);
warnings.forEach((warning) => console.log(`WARNING: ${warning}`));
errors.forEach((error) => console.error(`ERROR: ${error}`));
if (errors.length) process.exitCode = 1;
