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
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate pitch analysis");
    } else {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText.substring(0, 500)}`);
    }
  }

  return response.json();
}
