export async function submitContactForm(data: { name: string; email: string; message: string }) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit contact form");
  }

  return response.json();
}

export async function generatePitchApi(idea: string) {
  const response = await fetch("/api/generate-pitch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate pitch analysis");
  }

  return response.json();
}
