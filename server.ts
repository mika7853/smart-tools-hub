import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI client lazily or when key is present
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", appName: "SmartToolsHub" });
});

// AI Resume Generator Endpoint
app.post("/api/ai/resume", async (req, res) => {
  try {
    const { name, jobTitle, experience, skills, keyAchievements, section } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is missing",
        fallback: true,
      });
    }

    const prompt = `You are an expert executive resume writer and career coach.
Generate content for an executive-grade, high-impact resume section.
Candidate Name: ${name || "Professional"}
Target Job Title: ${jobTitle || "Software Engineer"}
Years/Level of Experience: ${experience || "Mid-Senior Level"}
Core Skills: ${skills || "Project Management, Communication, Problem Solving"}
Key Achievements or Focus: ${keyAchievements || "Led cross-functional team, optimized operational workflows"}
Requested Section: ${section || "full_resume"}

Please output structured JSON with the following format:
{
  "professionalSummary": "A compelling 3-4 sentence professional summary highlighting impact, leadership, and metrics.",
  "bulletPoints": [
    "Action-oriented achievement bullet point with quantifiable impact (e.g. Increased efficiency by 35%).",
    "Action-oriented achievement bullet point emphasizing domain expertise and problem solving.",
    "Action-oriented achievement bullet point showcasing team collaboration and process improvement.",
    "Action-oriented achievement bullet point describing technical/analytical achievements."
  ],
  "suggestedSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  "headline": "Punchy professional title headline"
}

Respond ONLY with valid JSON. Do not wrap in markdown quotes if possible, or ensure it parses cleanly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error("Error generating resume AI:", err);
    return res.status(500).json({ error: err.message || "Failed to generate resume AI content" });
  }
});

// AI Letter Writer Endpoint
app.post("/api/ai/letter", async (req, res) => {
  try {
    const { letterType, recipient, jobTitle, company, tone, keyPoints, senderName } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is missing",
        fallback: true,
      });
    }

    const prompt = `You are a professional business communication expert. Write a top-tier ${letterType || "Cover Letter"}.
Sender Name: ${senderName || "John Doe"}
Recipient: ${recipient || "Hiring Manager"}
Target Role / Subject: ${jobTitle || "Senior Developer"}
Company / Organization: ${company || "Acme Corp"}
Desired Tone: ${tone || "Professional and Enthusiastic"}
Key Highlights to Include: ${keyPoints || "Relevant experience, strong technical background, passion for innovation"}

Output a JSON object with:
{
  "subject": "Clear, professional email or letter subject line",
  "letterBody": "Full formatted letter body including salutation, body paragraphs with strong action verbs and custom tailored fit, and formal closing with sender name.",
  "keyHighlightsSummary": ["Bullet point summary 1 of letter focus", "Bullet point summary 2 of letter focus"],
  "tips": "1-2 brief professional tips for sending this letter"
}
Respond strictly in JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error("Error generating letter AI:", err);
    return res.status(500).json({ error: err.message || "Failed to generate letter" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartToolsHub Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
