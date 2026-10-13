// src/actions/grammar.js

const LT_URL = "https://api.languagetool.org/v2/check";

/**
 * Returns an array of grammar issues:
 * [{ message, offset, length, replacements: [{ value }] }]
 */
export async function checkGrammar(text) {
  if (!text || text.trim().length < 20) return [];

  // LanguageTool caps at ~20 KB per request
  const trimmed = text.slice(0, 20000);

  const body = new URLSearchParams({
    text: trimmed,
    language: "en-GB", // IELTS standard; switch to "en-US" if you prefer
  });

  const res = await fetch(LT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error("Grammar check failed");
  const data = await res.json();
  return data.matches ?? [];
}