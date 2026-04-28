import express from "express";
import { createServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const SYSTEM_PROMPT = `You are Startup-Lens AI — an elite startup pitch consultant who has helped hundreds of founders raise funding. You think like a seasoned investor and write like a world-class storyteller.

When a user describes their startup idea, you generate a complete, compelling investor pitch deck outline with all the key sections filled in. You never ask follow-up questions — you work with what you're given and fill gaps intelligently.

STRICT RULES:
- Always respond with ONLY valid JSON.
- Never say "I don't know" — make intelligent assumptions based on the idea.
- Keep all language crisp, confident, and jargon-free.
- The tone should feel like a McKinsey consultant wrote it, not a student.
- investor_score must be brutally honest.
- one_liner_pitch must be exceptional.`;

console.log("Server starting...");

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Request Logging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  const apiRouter = express.Router();
  
  apiRouter.get("/health", (req, res) => {
    res.json({ 
      status: "ok"
    });
  });

  apiRouter.post("/generate-pitch", async (req, res) => {
    try {
      const { idea } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!idea) {
        return res.status(400).json({ error: "Idea is required" });
      }

      if (!apiKey || apiKey === "undefined") {
        console.error("ERROR: GEMINI_API_KEY is missing or literal 'undefined'");
        return res.status(500).json({ 
          error: "Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in your environment variables.",
          code: "API_KEY_MISSING"
        });
      }

      const cleanKey = apiKey.trim().replace(/^["']|["']$/g, "");
      
      console.log(`[API] Generating pitch for: ${idea.substring(0, 50)}...`);
      // Removed sensitive key prefix log

      const ai = new GoogleGenAI({ apiKey: cleanKey });

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: idea,
        config: {
          systemInstruction: SYSTEM_PROMPT,
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

      const text = response.text;
      if (!text) {
        throw new Error("The AI model returned an empty response. This can happen if the content is flagged or the model fails.");
      }

      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("[ERROR] Pitch generation failed:", error);
      
      // Better error message for API key issues
      if (error.message?.includes("API key not valid") || error.status === 400) {
         return res.status(error.status || 400).json({ 
           error: "The provided Gemini API key is invalid. Please double check your GEMINI_API_KEY secret in Settings.",
           details: error.message
         });
      }

      res.status(500).json({ error: error.message || "An unexpected error occurred during pitch generation." });
    }
  });

  apiRouter.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    console.log("Contact form Submission:", { name, email, message });
    res.json({ 
      success: true, 
      message: "Thank you for reaching out. Our team will get back to you shortly." 
    });
  });

  app.use("/api", apiRouter);

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
