import { GoogleGenAI, Type } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini AI Client Initialization (lazy/guarded)
  const getAiClient = () => {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
  });

  // AI Race Engineer & Telemetry Strategy Analyst API
  app.post("/api/engineer/query", async (req, res) => {
    try {
      const { message, circuit, driver, stint, weather, telemetryContext } = req.body;
      const ai = getAiClient();

      const systemInstruction = `You are "Apex-1", an elite Formula 1 Chief Race Engineer & Senior Telemetry Analyst with decades of pit wall experience (combining the sharp precision of GP Lambiase and Peter Bonnington).
Your goal is to provide concise, intense, deeply technical, and realistic F1 pit wall feedback to fans and drivers.
When answering:
- Use authentic F1 engineering terminology (e.g., thermal degradation, delta time, undercut, MGU-K energy harvesting, aero balance, DRS train, graining, blistering, bottoming out, ride height, engine mapping, brake bias).
- Reference current 2025/2026 ground effect aerodynamics, 1.6L V6 turbo hybrids, active aerodynamics, and tire compounds (C1-C5, Intermediate, Wet).
- Maintain an energetic, authentic radio comms vibe when appropriate (e.g., "Box box box", "Copy that", "Pee One", "Tires look solid").
- Provide clear tactical strategy recommendations (e.g. stint targets, pit windows, undercut vs overcut calculations).
- Keep formatting clean with bold key metrics and concise paragraphs.`;

      const promptContext = `
[CURRENT PIT WALL TELEMETRY CONTEXT]
Circuit: ${circuit || "Monaco GP"}
Driver Focus: ${driver || "Max Verstappen"}
Weather / Track Condition: ${weather || "Dry / 38°C Track Temp"}
Current Stint Info: ${stint || "Lap 18/58, Medium C3 Tires (18% wear)"}
Telemetry Data: ${JSON.stringify(telemetryContext || { speed: "298 km/h", throttle: "100%", gear: 7, drs: "ACTIVE", battery: "78%" })}

[USER/DRIVER QUERY]
${message}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptContext,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        reply: response.text || "Radio static... Repeat query, copy?",
      });
    } catch (err: any) {
      console.error("AI Race Engineer error:", err);
      res.status(500).json({
        error: "Pit Wall Radio Interrupted",
        details: err.message || "Failed to establish radio link with AI Engineer.",
      });
    }
  });

  // AI Trivia Generator API for dynamic custom F1 quiz rounds
  app.post("/api/trivia/generate", async (req, res) => {
    try {
      const { category, difficulty } = req.body;
      const ai = getAiClient();

      const prompt = `Generate 5 challenging and exciting Formula 1 trivia questions for topic "${category || "Historical Classics & Tech"}" at difficulty "${difficulty || "Hard Core"}".
Each question must be strictly accurate to F1 history, technical regulations, famous driver rivalries, circuit records, or iconic race moments.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "List of F1 trivia questions",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                funFact: { type: Type.STRING },
              },
              required: ["id", "question", "options", "correctIndex", "explanation"],
            },
          },
        },
      });

      const jsonString = response.text || "[]";
      const questions = JSON.parse(jsonString);
      res.json({ questions });
    } catch (err: any) {
      console.error("Trivia generation error:", err);
      res.status(500).json({
        error: "Failed to generate trivia",
        details: err.message,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
