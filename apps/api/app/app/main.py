from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import ingest, benchmark, analyze

app = FastAPI(title="Cupwise API", version="0.1.0")

origins = [o.strip() for o in (settings.CORS_ORIGINS or "*").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

app.include_router(ingest.router, prefix="/ingest", tags=["ingest"])
app.include_router(benchmark.router, prefix="/benchmark", tags=["benchmark"])
app.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
