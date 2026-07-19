const path = require("path");

global.window = {};
require(path.join(__dirname, "..", "assets", "js", "training-data.js"));

const DATA = global.window.CX_DATA;
const errors = [];
const warnings = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};
const isHttps = (value) => {
  try { return new URL(value).protocol === "https:"; } catch (error) { return false; }
};
const value = (entry, lang = "pl") => typeof entry === "string" ? entry : entry?.[lang] || "";

assert(/^\d{4}-\d{2}-\d{2}$/.test(DATA.meta?.externalInformationReviewed || ""), "Missing external-information review date.");
assert(Array.isArray(DATA.meta?.externalInformationSources) && DATA.meta.externalInformationSources.length >= 6, "External source register is incomplete.");
(DATA.meta?.externalInformationSources || []).forEach((url) => assert(isHttps(url), `External source is not HTTPS: ${url}`));

const medical = DATA.medical || [];
assert(medical.length === 3, `Expected 3 medical information groups, found ${medical.length}.`);
medical.forEach((item) => {
  assert(isHttps(item.sourceUrl), `Medical group has no verified HTTPS source: ${value(item.title)}.`);
  assert(Boolean(value(item.sourceLabel)), `Medical group has no localized source label: ${value(item.title)}.`);
});

const clinic = medical.find((item) => item.tone === "blue");
const emergency = medical.find((item) => item.tone === "red");
const dental = medical.find((item) => item.tone === "yellow");
assert(clinic?.phones?.some((item) => item.phone === "+48713115517"), "GOZ registration number is missing or changed.");
assert((clinic?.body || []).some((item) => value(item).includes("8:00-18:00")), "Official GOZ registration hours are missing.");
assert((emergency?.body || []).some((item) => value(item).includes("112")), "Emergency guidance does not name 112.");
assert((emergency?.body || []).some((item) => value(item).includes("800 190 590")), "Emergency guidance does not name the NFZ alternative.");
assert((emergency?.maps || []).length === 2, "Expected two verified SOR locations.");
(emergency?.maps || []).forEach((item) => {
  assert(Boolean(item.address), `SOR location has no explicit address: ${item.label}.`);
  assert(isHttps(item.sourceUrl), `SOR location has no official HTTPS source: ${item.label}.`);
});
assert(dental?.phones?.length === 1 && dental.phones[0].phone === "800190590", "Dental guidance must use the current NFZ helpline instead of unverified private duty listings.");

const allMedicalPolish = JSON.stringify(medical.map((item) => (item.body || []).map((entry) => value(entry))));
["Q-Clinic", "Dental-Art", "ArtMedis", "Estomedica"].forEach((name) => {
  assert(!allMedicalPolish.includes(name), `Unverified private medical listing remains in guidance: ${name}.`);
});

const duw = (DATA.city || []).find((item) => value(item.title).startsWith("DUW"));
assert(duw?.address === "pl. Powstańców Warszawy 1, 50-153 Wrocław", "DUW official address is missing or different.");
assert((duw?.links || []).some((item) => /gov\.pl\/web\/dolnoslaski-uw\/pobyt-czasowy/.test(item.url)), "DUW current procedure link is missing.");

const expectedNumbers = ["112", "800 190 590", "8:00", "18:00"];
for (const lang of DATA.languages.map((item) => item.id)) {
  const localized = JSON.stringify(medical.map((item) => (item.body || []).map((entry) => value(entry, lang))));
  expectedNumbers.forEach((number) => assert(localized.includes(number), `${lang}: medical text is missing ${number}.`));
}

if (!Array.isArray(DATA.contacts?.coordinators) || !DATA.contacts.coordinators.length) warnings.push("Internal coordinator list is empty.");

console.log("Citronex information audit");
console.log(`External review: ${DATA.meta.externalInformationReviewed}`);
console.log(`Registered official sources: ${DATA.meta.externalInformationSources.length}`);
console.log(`Medical groups: ${medical.length}`);
console.log(`Verified SOR locations: ${(emergency?.maps || []).length}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Errors: ${errors.length}`);
warnings.forEach((message) => console.log(`WARN: ${message}`));
errors.forEach((message) => console.log(`ERROR: ${message}`));
process.exit(errors.length ? 1 : 0);
