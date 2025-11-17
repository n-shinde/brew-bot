"use client";
import { useEffect, useState } from "react";
import { uploadPOS, fetchNearby, getReport, health } from "@/lib/api";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [lat, setLat] = useState("37.7749");
  const [lng, setLng] = useState("-122.4194");
  const [radius, setRadius] = useState("3000");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => { health().then(ok => setStatusMsg(ok ? "API connected" : "API offline")); }, []);

  async function runPipeline() {
    try {
      if (!file) throw new Error("Choose a CSV file first.");
      setLoading(true);
      setStatusMsg("Uploading POS transactions file...");
      await uploadPOS(file);

      setStatusMsg("Finding nearby competitors...");
      await fetchNearby(Number(lat), Number(lng), Number(radius));

      setStatusMsg("Generating report...");
      const data = await getReport();
      setResult(data);
      setStatusMsg("Analysis complete!");
    } catch (e: any) {
      setStatusMsg(`Error: ${e.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{maxWidth: 960, margin: "0 auto", padding: 24}}>
      <h1 style={{fontWeight:700}}>Cupwise — Local Café Coach</h1>
      <div style={{border:"1px solid #e5e7eb", borderRadius:8, padding:16}}>
        <input type="file" accept=".csv" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:12}}>
          <input placeholder="Latitude" value={lat} onChange={e=>setLat(e.target.value)} />
          <input placeholder="Longitude" value={lng} onChange={e=>setLng(e.target.value)} />
          <input placeholder="Radius (m)" value={radius} onChange={e=>setRadius(e.target.value)} />
        </div>
        <button style={{marginTop:16}} onClick={runPipeline} disabled={!file || loading}>
          {loading ? "Analyzing..." : "Analyze & Benchmark"}
        </button>
        <div style={{marginTop:12, fontSize:13, color:"#4b5563"}}>{statusMsg}</div>
      </div>

      {result && (
        <section style={{marginTop:24}}>
          <h2>Results</h2>
          <pre style={{background:"#f9fafb", padding:12, borderRadius:8, overflowX:"auto"}}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}
