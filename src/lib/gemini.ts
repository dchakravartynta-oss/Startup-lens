/// <reference types="vite/client" />
import { generatePitchApi } from "./api";
import { PitchDeck } from "../types";

export async function generatePitch(idea: string): Promise<PitchDeck> {
  return generatePitchApi(idea);
}
