import { PitchDeck } from "../types";

export async function generatePitch(idea: string): Promise<PitchDeck> {
  const response = await fetch("/api/generate-pitch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown server error" }));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  return response.json();
}
