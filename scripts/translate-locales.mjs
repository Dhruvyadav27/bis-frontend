#!/usr/bin/env node
/**
 * Generates the UI translation files with Sarvam AI (model sarvam-translate:v1, formal style).
 *
 *   SARVAM_API_KEY=xxxx npm run i18n:translate             every language in src/i18n/languages.js
 *   SARVAM_API_KEY=xxxx npm run i18n:translate -- bn ta    only these language codes
 *   npm run i18n:translate -- --force                      re-translate everything (overwrites hand edits!)
 *   npm run i18n:translate -- --dry                        no network calls; only reports what would be translated
 *
 * - English (src/i18n/locales/en.json) is the source of truth.
 * - Keys that already exist in a language file are kept, so after adding new English strings just
 *   re-run: only the missing ones are translated. That also protects hand-corrected translations
 *   (e.g. the existing hi.json).
 * - Strings containing {{placeholders}} are left in English (machine translation can mangle them)
 *   and listed at the end so you can translate those few by hand.
 * - The API key is only read here in Node — it never goes into the browser bundle.
 * - Please have a native speaker skim the legal/technical wording before launch.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LANGUAGES } from "../src/i18n/languages.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.resolve(__dirname, "../src/i18n/locales");
const ENDPOINT =
  (process.env.SARVAM_BASE_URL || "https://api.sarvam.ai") + "/translate";
const CONCURRENCY = 1;

const args = process.argv.slice(2);
const force = args.includes("--force");
const dry = args.includes("--dry");
const requested = args.filter((a) => !a.startsWith("--"));
const apiKey = process.env.SARVAM_API_KEY;

if (!dry && !apiKey) {
  console.error(
    "Set SARVAM_API_KEY first, e.g.  SARVAM_API_KEY=xxxx npm run i18n:translate",
  );
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function flatten(obj, prefix = []) {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object") out.push(...flatten(v, [...prefix, k]));
    else out.push([[...prefix, k].join("."), v]);
  }
  return out;
}

function setDeep(obj, dotted, value) {
  const parts = dotted.split(".");
  let cur = obj;
  parts.slice(0, -1).forEach((p) => {
    cur[p] = cur[p] || {};
    cur = cur[p];
  });
  cur[parts.at(-1)] = value;
}

async function translate(text, targetCode) {
  const body = {
    input: text, // sarvam-translate:v1 accepts up to 2000 characters; UI strings are far shorter
    source_language_code: "en-IN",
    target_language_code: targetCode,
    model: "sarvam-translate:v1",
    mode: "formal",
    numerals_format: "international",
  };
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) return (await res.json()).translated_text;
    if (res.status === 429 || res.status >= 500) {
      await sleep(1000 * attempt * attempt); // 1s, 4s, 9s
      continue;
    }
    throw new Error(`Sarvam API ${res.status}: ${await res.text()}`);
  }
  throw new Error("Sarvam API kept failing after 4 attempts");
}

async function pool(items, worker) {
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < items.length) await worker(items[next++]);
    }),
  );
}

const en = JSON.parse(
  await fs.readFile(path.join(LOCALES_DIR, "en.json"), "utf8"),
);
const enEntries = flatten(en);

const targets = LANGUAGES.filter(
  (l) =>
    l.code !== "en" && (requested.length === 0 || requested.includes(l.code)),
);
const unknown = requested.filter((c) => !LANGUAGES.some((l) => l.code === c));
if (unknown.length) {
  console.error(
    `Unknown language code(s): ${unknown.join(", ")}. Add them to src/i18n/languages.js first.`,
  );
  process.exit(1);
}

const leftInEnglish = [];

for (const lang of targets) {
  const file = path.join(LOCALES_DIR, `${lang.code}.json`);
  let existing = {};
  try {
    existing = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    /* no file yet */
  }
  const have = new Map(flatten(existing));

  const result = new Map();
  const todo = [];
  for (const [key, value] of enEntries) {
    const current = have.get(key);
    if (!force && typeof current === "string" && current.trim())
      result.set(key, current);
    else if (typeof value !== "string" || !value.trim()) result.set(key, value);
    else if (value.includes("{{")) {
      result.set(key, value);
      leftInEnglish.push(`${lang.code}: ${key}`);
    } else todo.push([key, value]);
  }

  if (dry) {
    console.log(
      `[dry] ${lang.code} (${lang.sarvam}): ${todo.length} to translate, ${result.size} kept`,
    );
    continue;
  }

  process.stdout.write(
    `${lang.code} (${lang.sarvam}): translating ${todo.length} strings… `,
  );
  await pool(todo, async ([key, value]) => {
    result.set(key, await translate(value, lang.sarvam));
  });

  const out = {};
  for (const [key] of enEntries) setDeep(out, key, result.get(key)); // same key order as en.json
  await fs.writeFile(file, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log("done");
}

if (leftInEnglish.length) {
  console.log(
    "\nLeft in English (contain {{placeholders}} — translate by hand):",
  );
  leftInEnglish.forEach((l) => console.log("  " + l));
}
