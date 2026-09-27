import type { AnalysisResult } from "./types";

type AnalyzeResponse = AnalysisResult & {
  error?: string;
  details?: string;
};

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.details ||
        data?.error ||
        "Unable to analyze the document.",
    );
  }

  return data as AnalyzeResponse;
}

export async function analyzeText(
  text: string,
): Promise<AnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  return parseResponse(response);
}

export async function analyzeFile(
  file: File,
): Promise<AnalysisResult> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}