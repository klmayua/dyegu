export type SubmitTable =
  | "subscribers"
  | "enquiries"
  | "volunteers"
  | "community_requests"
  | "rebuilds";

export interface SubmitResponse {
  status?: "ok" | "exists";
  care?: boolean;
  error?: string;
}

export function getCapturedUtm(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = sessionStorage.getItem("dyegu_utm");
    if (existing) return existing;
    const p = new URLSearchParams(window.location.search);
    const parts: string[] = [];
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
      const val = p.get(k);
      if (val) parts.push(`${k.slice(4)}=${val}`);
    }
    if (parts.length) {
      const joined = parts.join("&").slice(0, 300);
      sessionStorage.setItem("dyegu_utm", joined);
      return joined;
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

export async function submitToDyegu(
  table: SubmitTable,
  row: Record<string, unknown>,
  honeypot = ""
): Promise<SubmitResponse> {
  const res = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, row, honeypot }),
  });
  const data: SubmitResponse = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again in a moment.");
  }
  return data;
}
