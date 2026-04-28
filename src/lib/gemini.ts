import { GoogleGenAI, Type } from "@google/genai";
import { PitchDeck } from "../types";

const SYSTEM_PROMPT = `You are Startup-Lens AI — an elite startup pitch consultant who has helped hundreds of founders raise funding. You think like a seasoned investor and write like a world-class storyteller.

When a user describes their startup idea, you generate a complete, compelling investor pitch deck outline with all the key sections filled in. You never ask follow-up questions — you work with what you're given and fill gaps intelligently.

STRICT RULES:
- Always respond with ONLY valid JSON.
- Never say "I don't know" — make intelligent assumptions based on the idea.
- Keep all language crisp, confident, and jargon-free.
- The tone should feel like a McKinsey consultant wrote it, not a student.
- investor_score must be brutally honest.
- one_liner_pitch must be exceptional.`;

export async function generatePitch(idea: string): Promise<PitchDeck> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please set it in your environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
      throw new Error("Empty response from AI");
    }

    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    if (error.message?.includes("API key not valid") || error.status === 400 || error.message?.includes("403")) {
       throw new Error("INVALID_API_KEY: Your Gemini API key is invalid or revoked. Since it was exposed on GitHub, please generate a NEW key in AI Studio and update your Secrets.");
    }
    
    throw error;
  }
}

