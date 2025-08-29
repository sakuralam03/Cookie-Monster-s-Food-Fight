// for integration with the backend API
export interface AnalyzeResponse {
  filename: string;
  sensitivity_score: number;
  status: {
    "too sensitive": number;
    "moderately sensitive": number;
    "not sensitive": number;
  };
  findings: {
    "too sensitive": { text: string; label: string; type: string }[];
    "moderately sensitive": { text: string; label: string; type: string }[];
    "not sensitive": { text: string; label: string; type: string }[];
  };
  message?: string;
}

const API_BASE = "http://localhost:8000";

export async function analyzeDocument(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.statusText}`);
  }

  return res.json();
}
