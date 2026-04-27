import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Standard Gemini SDK initialization
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
        return res.status(400).json({ error: "No idea provided" });
      }

      // Using gemini-1.5-flash for stability
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT,
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: idea }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tagline: { type: Type.STRING },
              problem: {
                type: Type.OBJECT,
                properties: {
                  statement: { type: Type.STRING },
                  who_feels_it: { type: Type.STRING },
                  how_big_is_it: { type: Type.STRING }
                },
                required: ["statement", "who_feels_it", "how_big_is_it"]
              },
              solution: {
                type: Type.OBJECT,
                properties: {
                  what_it_is: { type: Type.STRING },
                  how_it_works: { type: Type.STRING },
                  unique_angle: { type: Type.STRING }
                },
                required: ["what_it_is", "how_it_works", "unique_angle"]
              },
              market: {
                type: Type.OBJECT,
                properties: {
                  target_users: { type: Type.STRING },
                  market_size: { type: Type.STRING },
                  why_now: { type: Type.STRING }
                },
                required: ["target_users", "market_size", "why_now"]
              },
              business_model: {
                type: Type.OBJECT,
                properties: {
                  how_you_make_money: { type: Type.STRING },
                  pricing_idea: { type: Type.STRING },
                  growth_path: { type: Type.STRING }
                },
                required: ["how_you_make_money", "pricing_idea", "growth_path"]
              },
              competition: {
                type: Type.OBJECT,
                properties: {
                  existing_alternatives: { type: Type.STRING },
                  your_edge: { type: Type.STRING }
                },
                required: ["existing_alternatives", "your_edge"]
              },
              traction: {
                type: Type.OBJECT,
                properties: {
                  current_stage: { type: Type.STRING },
                  next_milestone: { type: Type.STRING }
                },
                required: ["current_stage", "next_milestone"]
              },
              ask: {
                type: Type.OBJECT,
                properties: {
                  what_you_need: { type: Type.STRING },
                  what_it_will_be_used_for: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["what_you_need", "what_it_will_be_used_for"]
              },
              one_liner_pitch: { type: Type.STRING },
              investor_score: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.STRING },
                  strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  risks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  verdict: { type: Type.STRING }
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

      const response = await result.response;
      const text = response.text();
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Pitch Generation Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate pitch analysis" });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
