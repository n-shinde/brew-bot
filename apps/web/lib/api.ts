export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function uploadPOS(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/ingest/pos`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchNearby(lat: number, lng: number, radius_m = 3000) {
  const res = await fetch(`${API_BASE}/benchmark/nearby?lat=${lat}&lng=${lng}&radius_m=${radius_m}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getReport() {
  const res = await fetch(`${API_BASE}/analyze/report`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function health() {
  const res = await fetch(`${API_BASE}/health`);
  return res.ok;
}
