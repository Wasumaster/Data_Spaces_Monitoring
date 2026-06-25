"""
Federated EO Data Space — FastAPI Backend
==========================================
Provides a REST API for browsing, filtering, searching, and comparing
Earth Observation resources in the federated data space catalogue.
"""

import json
import os
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------------------------------
# Application setup
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Federated EO Data Space API",
    description="REST API for discovering and comparing Earth Observation resources for flood monitoring.",
    version="1.0.0",
)

# Allow CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Load metadata at startup
# ---------------------------------------------------------------------------
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "eo_resources.json")

with open(DATA_PATH, "r", encoding="utf-8") as f:
    EO_RESOURCES: list[dict] = json.load(f)

# Build lookup dict for O(1) access by id
RESOURCE_MAP: dict[str, dict] = {r["id"]: r for r in EO_RESOURCES}


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------
def _matches_search(resource: dict, query: str) -> bool:
    """Return True if the query string appears in key text fields."""
    query_lower = query.lower()
    searchable = " ".join([
        resource.get("name", ""),
        resource.get("description", ""),
        resource.get("purpose", ""),
        resource.get("provider", ""),
        " ".join(resource.get("observations", [])),
        " ".join(resource.get("strengths", [])),
    ]).lower()
    return query_lower in searchable


RATING_ORDER = {"high": 3, "medium": 2, "low": 1, "none": 0}


def _matches_flood_capability(resource: dict, capability: str, min_rating: str) -> bool:
    """Check if a resource's flood_relevance for a given capability meets the minimum rating."""
    relevance = resource.get("flood_relevance", {})
    cap = relevance.get(capability)
    if not cap:
        return False
    resource_score = RATING_ORDER.get(cap.get("rating", "none"), 0)
    min_score = RATING_ORDER.get(min_rating, 0)
    return resource_score >= min_score


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/resources", summary="List and filter EO resources")
def list_resources(
    provider: Optional[str] = Query(None, description="Filter by provider name (partial match)"),
    type: Optional[str] = Query(None, description="Filter by resource type: satellite, service, platform"),
    sensor_type: Optional[str] = Query(None, description="Filter by sensor type: SAR, optical, multi, spectrometer"),
    tag: Optional[str] = Query(None, description="Filter by operational tag (e.g. night-capable)"),
    search: Optional[str] = Query(None, description="Full-text search across name, description, purpose"),
    flood_capability: Optional[str] = Query(None, description="Filter by flood relevance category"),
    min_rating: Optional[str] = Query("medium", description="Minimum rating for flood_capability filter: high, medium, low"),
):
    """
    Return a filtered list of EO resources.
    All filters are optional and combined with AND logic.
    """
    results = EO_RESOURCES

    if provider:
        results = [r for r in results if provider.lower() in r.get("provider", "").lower()]

    if type:
        results = [r for r in results if r.get("type", "").lower() == type.lower()]

    if sensor_type:
        results = [r for r in results if r.get("sensor_type", "").lower() == sensor_type.lower()]

    if tag:
        results = [r for r in results if tag.lower() in [t.lower() for t in r.get("operational_tags", [])]]

    if search:
        results = [r for r in results if _matches_search(r, search)]

    if flood_capability:
        results = [r for r in results if _matches_flood_capability(r, flood_capability, min_rating or "medium")]

    return {"count": len(results), "resources": results}


@app.get("/api/resources/{resource_id}", summary="Get a single EO resource by ID")
def get_resource(resource_id: str):
    """Return the full metadata for a specific EO resource."""
    resource = RESOURCE_MAP.get(resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail=f"Resource '{resource_id}' not found")
    return resource


@app.get("/api/providers", summary="List all unique providers")
def list_providers():
    """Return a list of distinct resource providers with their resource counts."""
    provider_counts: dict[str, int] = {}
    for r in EO_RESOURCES:
        p = r.get("provider", "Unknown")
        provider_counts[p] = provider_counts.get(p, 0) + 1
    return {
        "providers": [
            {"name": name, "count": count}
            for name, count in sorted(provider_counts.items())
        ]
    }


@app.get("/api/filters", summary="Get available filter options")
def get_filters():
    """Return all available filter values for the UI to populate dropdowns."""
    types = sorted(set(r.get("type", "") for r in EO_RESOURCES))
    sensor_types = sorted(set(r.get("sensor_type", "") for r in EO_RESOURCES))
    all_tags = sorted(set(tag for r in EO_RESOURCES for tag in r.get("operational_tags", [])))
    providers = sorted(set(r.get("provider", "") for r in EO_RESOURCES))
    flood_capabilities = ["detection", "extent_assessment", "cloudy_conditions", "night_operations", "emergency_response"]

    return {
        "types": types,
        "sensor_types": sensor_types,
        "tags": all_tags,
        "providers": providers,
        "flood_capabilities": flood_capabilities,
        "ratings": ["high", "medium", "low"],
    }


@app.get("/api/compare", summary="Compare multiple EO resources side by side")
def compare_resources(
    ids: str = Query(..., description="Comma-separated resource IDs to compare (e.g. sentinel-1,sentinel-2)")
):
    """
    Return a structured comparison of 2–6 resources.
    Includes a flood capability matrix for easy comparison.
    """
    id_list = [i.strip() for i in ids.split(",") if i.strip()]

    if len(id_list) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 resource IDs to compare")
    if len(id_list) > 6:
        raise HTTPException(status_code=400, detail="Maximum 6 resources can be compared at once")

    resources = []
    for rid in id_list:
        r = RESOURCE_MAP.get(rid)
        if not r:
            raise HTTPException(status_code=404, detail=f"Resource '{rid}' not found")
        resources.append(r)

    # Build comparison matrix
    capabilities = ["detection", "extent_assessment", "cloudy_conditions", "night_operations", "emergency_response"]
    matrix = {}
    for cap in capabilities:
        matrix[cap] = {}
        for r in resources:
            relevance = r.get("flood_relevance", {}).get(cap, {})
            matrix[cap][r["id"]] = {
                "rating": relevance.get("rating", "none"),
                "explanation": relevance.get("explanation", ""),
            }

    return {
        "resources": resources,
        "comparison_matrix": matrix,
        "capabilities": capabilities,
    }


# ---------------------------------------------------------------------------
# Startup event
# ---------------------------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    """Log metadata loading status on startup."""
    print(f"[OK] Loaded {len(EO_RESOURCES)} EO resources from {DATA_PATH}")
