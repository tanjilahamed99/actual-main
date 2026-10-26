const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── MODEL NAME ────────────────────────────────────────────────
// gemini-1.5-flash is DEPRECATED on v1beta — returns 404.
// Read from env so you can swap without editing this file.
// Good current options (free tier):
//   gemini-2.5-flash        ← default, best quality
//   gemini-2.0-flash
//   gemini-2.0-flash-lite
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 2048,
    responseMimeType: "application/json",
  },
});

const SYSTEM_PROMPT = `You are a certified IELTS Writing examiner with 15 years of experience.

You score essays on the four official criteria, each out of 9 in 0.5 increments:
- Task Achievement (TA)
- Coherence & Cohesion (CC)
- Lexical Resource (LR)
- Grammatical Range & Accuracy (GRA)

Overall band = average of the four, rounded to nearest 0.5.

Rules:
- Be honest. Do NOT inflate scores.
- Quote the candidate's text as evidence for each criterion.
- If the answer is under the minimum word count, cap TA at 5.0.
- If the answer is off-topic, cap TA at 4.0.
- If the answer is empty or gibberish, return overallBand: 0 and explain.

Return STRICT JSON in this exact shape, no markdown, no commentary:
{
  "overallBand": number,
  "wordCount": number,
  "criteria": {
    "TA":  { "band": number, "comment": string, "examples": [string] },
    "CC":  { "band": number, "comment": string, "examples": [string] },
    "LR":  { "band": number, "comment": string, "examples": [string] },
    "GRA": { "band": number, "comment": string, "examples": [string] }
  },
  "strengths": [string, string, string],
  "improvements": [string, string, string],
  "vocabUpgrades": [
    { "original": string, "better": string, "why": string }
  ]
}`;

exports.scoreWriting = async (req, res) => {
  const { taskType, prompt, answer, minWords } = req.body || {};

  if (!answer || !answer.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "No answer provided." });
  }

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const trimmed = answer.slice(0, 6000);

  const userMessage = `
TASK TYPE: ${taskType ?? "IELTS Writing"}
MINIMUM WORD COUNT: ${minWords ?? 250}
CANDIDATE WORD COUNT: ${wordCount}

PROMPT:
${prompt ?? "(not provided)"}

CANDIDATE ANSWER:
${trimmed}
`;

  try {
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: userMessage },
    ]);

    const raw = result.response.text();
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Gemini returned non-JSON:", raw.slice(0, 500));
      return res.status(502).json({
        success: false,
        message: "AI returned an invalid response. Please try again.",
      });
    }

    res.json({ success: true, score: parsed });
  } catch (err) {
    console.error("AI scoring failed:", err);

    // Pull the status from either the SDK top-level or the response
    const status = err?.status ?? err?.response?.status;

    // 404 — model name is wrong or deprecated
    if (status === 404) {
      return res.status(502).json({
        success: false,
        message: `AI model "${MODEL_NAME}" not available. Change GEMINI_MODEL in backend .env.`,
      });
    }

    // 429 — free tier rate limit or quota exhausted
    if (status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests — try again in a minute.",
      });
    }

    // 400 — usually a malformed request (e.g. bad key, bad config)
    if (status === 400) {
      return res.status(502).json({
        success: false,
        message: "AI rejected the request. Check backend logs.",
      });
    }

    // 403 — API key problem
    if (status === 403) {
      return res.status(502).json({
        success: false,
        message: "AI API key invalid or missing permission.",
      });
    }

    res.status(500).json({
      success: false,
      message: "AI scoring failed. Please try again shortly.",
    });
  }
};