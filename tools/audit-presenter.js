#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const guidePath = path.join(root, "assets", "content", "presenter-guide.json");
const guide = JSON.parse(fs.readFileSync(guidePath, "utf8"));
const expectedLanguages = ["pl", "en", "ua", "ru", "az", "es", "fil", "id", "ne"];
const errors = [];
const warnings = [];
const rigAssets = ["head-v1.png", "torso-v1.png", "arm-left-v2.png", "arm-right-v3.png"];
const expectedQuizById = {
  welcome: 1, "arrival-wait": 2, "warehouse-no-reader": 0,
  "greenhouse-sides": 19, "greenhouse-nave": 20, "greenhouse-section": 22,
  "reader-charge": 8, "reader-row-exit": 4, "reader-cart-send": 10,
  "reader-break": 26, "reader-change-end": 25, "reader-restart-menu": 12,
  "tablet-login": 17, "tablet-change": 25,
  "safety-food-items": 16, "safety-phone-photo": 18, "safety-personal-data": 17, "safety-zones": 2,
  "help-clinic": 15, "help-emergency": 27
};

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
const expectedSections = Array.isArray(reference) ? reference.map((section) => section.id) : [];
if (guide.chapterCount !== expectedSections.length) errors.push(`chapterCount differs (${guide.chapterCount} vs ${expectedSections.length})`);
if (expectedSections.length < 40) errors.push(`briefing has too few granular chapters (${expectedSections.length})`);

const appSource = fs.readFileSync(path.join(root, "assets", "js", "training-app.js"), "utf8");
const rigCssPath = path.join(root, "assets", "css", "presenter-rig.css");
if (!fs.existsSync(rigCssPath)) errors.push("independent presenter rig stylesheet is missing");
rigAssets.forEach((asset) => {
  if (!fs.existsSync(path.join(root, "assets", "avatar", "cartoon", asset))) errors.push(`rig asset is missing (${asset})`);
  const occurrences = (appSource.match(new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
  if (occurrences !== 2) errors.push(`rig asset must be referenced once in markup and once in preload data (${asset}: ${occurrences})`);
});
if (/guide-pose-whole|data-cartoon-pose/.test(appSource)) errors.push("legacy whole-pose avatar is still rendered");

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
    if (!section || typeof section.text !== "string" || section.text.trim().length < 25) {
      errors.push(`${language}/${expectedSections[index]}: text is missing or too short`);
    }
    if (!section.group || !section.groupTitle || !Array.isArray(section.tracks) || !section.tracks.length) {
      errors.push(`${language}/${expectedSections[index]}: navigation metadata is incomplete`);
    }
    if (section.image && !/^https?:\/\//i.test(section.image)) {
      const visualPath = path.join(root, section.image);
      if (!fs.existsSync(visualPath)) errors.push(`${language}/${section.id}: visual is missing (${section.image})`);
    }
    const focusRequired = /^(?:tablet-|reader-(?:take|personal-tag|work-start|activity|assigned-row|break-start|break-end|work-end|charge))/.test(section.id);
    if (focusRequired && (!Array.isArray(section.focus) || section.focus.length !== 4 || section.focus.some((value) => !Number.isFinite(value) || value < 0 || value > 100))) {
      errors.push(`${language}/${section.id}: visual focus is missing or invalid`);
    }
    if (section.quizIndex != null && (!Number.isInteger(section.quizIndex) || section.quizIndex < 0 || section.quizIndex >= 30)) {
      errors.push(`${language}/${section.id}: quizIndex is invalid (${section.quizIndex})`);
    }
    const expectedQuiz = expectedQuizById[section.id];
    if (expectedQuiz != null && section.quizIndex !== expectedQuiz) {
      errors.push(`${language}/${section.id}: quizIndex ${section.quizIndex} does not match expected ${expectedQuiz}`);
    }
    if (section.quizIndex != null && expectedQuiz == null) {
      errors.push(`${language}/${section.id}: unexpected quizIndex ${section.quizIndex}`);
    }
    if (/[ÃÂ]|â(?:€|™|œ)|ðŸ/u.test(`${section.title} ${section.text}`)) {
      errors.push(`${language}/${expectedSections[index]}: possible broken UTF-8 text`);
    }
    if (reference && reference[index]) {
      const referenceNumbers = numberTokens(reference[index].text);
      const localizedNumbers = numberTokens(section.text);
      if (section.id !== "help-dental" && !sameArray(referenceNumbers, localizedNumbers)) {
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
console.log(`Granular chapters per language: ${expectedSections.length}`);
console.log(`Expected audio files: ${expectedLanguages.length * expectedSections.length}`);
console.log(`Independent rig layers: ${rigAssets.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Errors: ${errors.length}`);
warnings.forEach((warning) => console.log(`WARNING: ${warning}`));
errors.forEach((error) => console.error(`ERROR: ${error}`));
if (errors.length) process.exitCode = 1;
