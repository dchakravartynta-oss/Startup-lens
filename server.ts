import express from "express";
import { createServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are Startup-Lens AI — an elite startup pitch consultant who has helped hundreds of founders raise funding. You think like a seasoned investor and write like a world-class storyteller.

When a user describes their startup idea, you generate a complete, compelling investor pitch deck outline with all the key sections filled in. You never ask follow-up questions — you work with what you're given and fill gaps intelligently.

STRICT RULES:
- Always respond with ONLY valid JSON.
- Never say "I don't know" — make intelligent assumptions based on the idea.
- Keep all language crisp, confident, and jargon-free.
- The tone should feel like a McKinsey consultant wrote it, not a student.
- investor_score must be brutally honest.
- one_liner_pitch must be exceptional.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;
    console.log("Contact form Submission:", { name, email, message });
    res.json({ 
      success: true, 
      message: "Thank you for reaching out. Our team will get back to you shortly." 
    });
  });

  app.post("/api/generate-pitch", async (req, res) => {
    try {
      const { idea } = req.body;
      if (!idea) {
        return res.status(400).json({ error: "Idea is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Server configuration error: Gemini API key is missing" });
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT,
      });

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: idea }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              tagline: { type: SchemaType.STRING },
              problem: {
                type: SchemaType.OBJECT,
                properties: {
                  statement: { type: SchemaType.STRING },
                  who_feels_it: { type: SchemaType.STRING },
                  how_big_is_it: { type: SchemaType.STRING }
                },
                required: ["statement", "who_feels_it", "how_big_is_it"]
              },
              solution: {
                type: SchemaType.OBJECT,
                properties: {
                  what_it_is: { type: SchemaType.STRING },
                  how_it_works: { type: SchemaType.STRING },
                  unique_angle: { type: SchemaType.STRING }
                },
                required: ["what_it_is", "how_it_works", "unique_angle"]
              },
              market: {
                type: SchemaType.OBJECT,
                properties: {
                  target_users: { type: SchemaType.STRING },
                  market_size: { type: SchemaType.STRING },
                  why_now: { type: SchemaType.STRING }
                },
                required: ["target_users", "market_size", "why_now"]
              },
              business_model: {
                type: SchemaType.OBJECT,
                properties: {
                  how_you_make_money: { type: SchemaType.STRING },
                  pricing_idea: { type: SchemaType.STRING },
                  growth_path: { type: SchemaType.STRING }
                },
                required: ["how_you_make_money", "pricing_idea", "growth_path"]
              },
              competition: {
                type: SchemaType.OBJECT,
                properties: {
                  existing_alternatives: { type: SchemaType.STRING },
                  your_edge: { type: SchemaType.STRING }
                },
                required: ["existing_alternatives", "your_edge"]
              },
              traction: {
                type: SchemaType.OBJECT,
                properties: {
                  current_stage: { type: SchemaType.STRING },
                  next_milestone: { type: SchemaType.STRING }
                },
                required: ["current_stage", "next_milestone"]
              },
              ask: {
                type: SchemaType.OBJECT,
                properties: {
                  what_you_need: { type: SchemaType.STRING },
                  what_it_will_be_used_for: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                  }
                },
                required: ["what_you_need", "what_it_will_be_used_for"]
              },
              one_liner_pitch: { type: SchemaType.STRING },
              investor_score: {
                type: SchemaType.OBJECT,
                properties: {
                  score: { type: SchemaType.STRING },
                  strengths: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                  },
                  risks: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                  },
                  verdict: { type: SchemaType.STRING }
                },
                required: ["score", "strengths", "risks", "verdict"]
              }
            },
            required: [
              "tagline", "problem", "solution", "market", 
              "business_model", "competition", "traction", 
              "ask", "one_liner_pitch", "investor_score"
            ]
          }
        }
      });

      const responseText = response.response.text();
      res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error("GenAI Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate pitch" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createServer({
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

startServer().catch(err => {
  console.error("FATAL: Server failed to start", err);
});
