#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const guide = JSON.parse(fs.readFileSync(path.join(root, "assets/content/presenter-guide.json"), "utf8"));
const outputPath = path.join(root, "assets/content/lipsync-cues.json");
const valid = new Set(["closed", "mid", "ah", "oh", "ee", "fv", "l", "mbp"]);

function durationOf(file) {
  const result = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", file], { encoding: "utf8" });
  const duration = Number(String(result.stdout || "").trim());
  if (result.status !== 0 || !Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Cannot read audio duration: ${path.relative(root, file)}`);
  }
  return duration;
}

function visemeFor(character) {
  const value = character.toLocaleLowerCase();
  if (/\s|[.,!?;:…。、！？।]/u.test(value)) return "closed";
  if (/[mbpмбпबपम]/u.test(value)) return "mbp";
  if (/[fvфвफभ]/u.test(value)) return "fv";
  if (/[lłлल]/u.test(value)) return "l";
  if (/[aąáàâäãåæаяआअ]/u.test(value)) return "ah";
  if (/[oóòôöõuúùûüоуўюओउऊ]/u.test(value)) return "oh";
  if (/[eęéèêëiíìîïyыиійэєईइए]/u.test(value)) return "ee";
  return "mid";
}

function buildCues(text, duration) {
  const characters = Array.from(String(text || "").replace(/\s+/g, " ").trim());
  if (!characters.length) return [{ t: 0, v: "closed" }];
  const usable = Math.max(0.2, duration - 0.14);
  const weights = characters.map((character) => /\s|[.,!?;:…。、！？।]/u.test(character) ? 1.8 : 1);
  const total = weights.reduce((sum, value) => sum + value, 0);
  let elapsed = 0.05;
  const cues = [{ t: 0, v: "closed" }];
  characters.forEach((character, index) => {
    const v = visemeFor(character);
    const last = cues[cues.length - 1];
    if (last.v !== v && elapsed - last.t >= 0.035) cues.push({ t: Number(elapsed.toFixed(3)), v });
    elapsed += usable * (weights[index] / total);
  });
  if (cues[cues.length - 1].v !== "closed") cues.push({ t: Number(Math.max(0, duration - 0.06).toFixed(3)), v: "closed" });
  cues.forEach((cue) => {
    if (!valid.has(cue.v)) throw new Error(`Unknown viseme ${cue.v}`);
  });
  return cues;
}

const output = { version: guide.version, visemes: Array.from(valid), languages: {} };
let rendered = 0;
for (const [language, localized] of Object.entries(guide.languages)) {
  output.languages[language] = {};
  localized.sections.forEach((section, index) => {
    const filename = `${String(index + 1).padStart(2, "0")}-${section.id}.mp3`;
    const audioPath = path.join(root, "assets/audio/guide", language, filename);
    const duration = durationOf(audioPath);
    output.languages[language][section.id] = {
      duration: Number(duration.toFixed(3)),
      cues: buildCues(section.text, duration)
    };
    rendered += 1;
  });
}
if (rendered !== 450) throw new Error(`Expected 450 recordings, found ${rendered}`);
fs.writeFileSync(outputPath, `${JSON.stringify(output)}\n`, "utf8");
console.log(`wrote ${outputPath}: ${rendered} recordings, ${output.visemes.length} visemes`);
