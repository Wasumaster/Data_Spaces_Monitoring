# 🛰️ Federated EO Data Space for National Flood Monitoring

A lightweight, web-based **Federated EO Data Space** that organises Earth Observation (EO) resources from multiple independent providers into a searchable, filterable, and comparable catalogue — designed to support a National Flood Monitoring and Early Warning Service.

![Architecture](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=flat-square&logo=docker)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start (Docker)](#quick-start-docker)
- [Manual Setup (Development)](#manual-setup-development)
- [API Documentation](#api-documentation)
- [EO Resources Included](#eo-resources-included)
- [Project Structure](#project-structure)

---

## Overview

This project implements a **Simple Federated EO Data Space** as defined in the mini-project specification for the course *"Data Spaces and Federated Data Engineering for Orbital and Space Observations"* at AGH University of Krakow.

The system addresses the need for a National Flood Monitoring Agency to understand which EO resources are available, how they can be accessed, and which are most relevant for flood monitoring and early warning — across multiple independent data providers.

### What it does:
- **Organises** 10 EO resources from 6+ independent providers in a common catalogue
- **Preserves** information about resource origin and access mechanisms
- **Enables** resource discovery through filtering, searching, and operational scenario quick-filters
- **Supports** side-by-side comparison of resources based on flood monitoring capabilities
- **Provides** access links and references to original data sources

---

## Features

| Feature | Description |
|---|---|
| 🔍 **Resource Discovery** | Full-text search, filter by provider, type, sensor, and operational tags |
| ☁️ **Operational Quick-Filters** | One-click filters: Night-Time, Cloudy Conditions, Emergency, Flood Detection, Early Warning |
| ⚖️ **Resource Comparison** | Select 2–6 resources and compare side-by-side with flood capability matrix |
| 📊 **Flood Relevance Ratings** | Each resource rated on 5 capabilities: detection, extent, cloudy, night, emergency |
| 🏢 **Provider Tracking** | Every resource shows its provider with links to original portals |
| 🔗 **Access Links** | Direct links to data access portals for each resource |
| 🌙 **Premium Dark UI** | Glassmorphism-styled responsive interface with smooth animations |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Docker Compose                │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────────┐ │
│  │  React Frontend  │  │  FastAPI Backend      │ │
│  │  (Vite + nginx)  │──│  (Python 3.12)       │ │
│  │  Port 3000       │  │  Port 8000           │ │
│  └──────────────────┘  │                      │ │
│                        │  ┌────────────────┐  │ │
│                        │  │ eo_resources   │  │ │
│                        │  │   .json        │  │ │
│                        │  │ (metadata)     │  │ │
│                        │  └────────────────┘  │ │
│                        └──────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## Quick Start (Docker)

> **Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

```bash
# 1. Clone the repository
git clone <repository-url>
cd Data_Space

# 2. Build and start both services
docker compose up --build

# 3. Open in browser
#    Frontend:  http://localhost:3000
#    API docs:  http://localhost:8000/docs
```

That's it! The application will be running at **http://localhost:3000**.

---

## Manual Setup (Development)

### Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```

The API will be available at **http://localhost:8000** and auto-generated docs at **http://localhost:8000/docs**.

### Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at **http://localhost:5173** (Vite default port).

> **Note:** In development mode, the frontend expects the backend at `http://localhost:8000`. You can override this by setting the `VITE_API_BASE` environment variable.

---

## API Documentation

The FastAPI backend provides auto-generated interactive documentation at `/docs` (Swagger UI).

### Key Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/resources` | GET | List all resources with optional filters |
| `/api/resources/{id}` | GET | Get single resource details |
| `/api/providers` | GET | List distinct providers |
| `/api/filters` | GET | Get available filter options |
| `/api/compare?ids=a,b` | GET | Compare 2–6 resources side-by-side |

### Filter Parameters (for `/api/resources`)

| Parameter | Description | Example |
|---|---|---|
| `search` | Full-text search | `search=SAR` |
| `provider` | Provider name (partial match) | `provider=ESA` |
| `type` | Resource type | `type=satellite` |
| `sensor_type` | Sensor type | `sensor_type=SAR` |
| `tag` | Operational tag | `tag=night-capable` |
| `flood_capability` | Flood relevance category | `flood_capability=cloudy_conditions` |
| `min_rating` | Minimum rating for capability | `min_rating=high` |

---

## EO Resources Included

| # | Resource | Provider | Type | Key Capability |
|---|---|---|---|---|
| 1 | **Sentinel-1 (SAR)** | ESA | Satellite | All-weather flood detection |
| 2 | **Sentinel-2 (Optical)** | ESA | Satellite | High-res flood mapping |
| 3 | **Sentinel-3 (Ocean/Land)** | ESA / EUMETSAT | Satellite | Wide-swath monitoring |
| 4 | **Sentinel-5P (Atmospheric)** | ESA | Satellite | Cloud/atmosphere data |
| 5 | **Copernicus EMS** | EC / JRC | Service | Emergency rapid mapping |
| 6 | **CLMS** | EEA | Service | Baseline water/land data |
| 7 | **CDSE** | EC / ESA | Platform | Unified data access |
| 8 | **EUMETSAT H SAF** | EUMETSAT | Service | Precipitation/soil moisture |
| 9 | **EUMETView** | EUMETSAT | Platform | Real-time satellite viewer |
| 10 | **GloFAS** | ECMWF | Service | Probabilistic flood forecasts |

---

## Project Structure

```
Data_Space/
├── backend/
│   ├── data/
│   │   └── eo_resources.json    # EO metadata catalogue (10 resources)
│   ├── main.py                  # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   └── Dockerfile               # Backend container
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Navigation header
│   │   │   ├── CataloguePage.jsx    # Main browsing page
│   │   │   ├── FilterSidebar.jsx    # Filter controls
│   │   │   ├── ResourceCard.jsx     # Resource summary card
│   │   │   ├── ResourceDetail.jsx   # Full detail modal
│   │   │   └── ComparePage.jsx      # Side-by-side comparison
│   │   ├── App.jsx              # Root component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Design system (dark theme)
│   ├── index.html               # HTML template
│   ├── nginx.conf               # Production nginx config
│   ├── Dockerfile               # Frontend container
│   └── package.json             # Node dependencies
├── docker-compose.yml           # Container orchestration
├── README.md                    # This file
└── VIDEO_SCRIPT.md              # Video recording script
```

---

## Technology Stack

| Component | Technology | Rationale |
|---|---|---|
| Backend | Python 3.12 + FastAPI | Required Python; FastAPI provides async API with auto-docs |
| Frontend | React 18 + Vite | Modern, fast bundler; component-based UI architecture |
| Metadata | JSON file | Lightweight, no DB setup; easy to review and extend |
| Containerisation | Docker + Compose | One-command deployment; reproducible environment |
| Styling | Vanilla CSS | Full control; no framework dependencies |

---

## Author

Built for the mini-project *"Designing a Federated EO Data Space for National Flood Monitoring"* — Data Spaces and Federated Data Engineering for Orbital and Space Observations, AGH University of Krakow, June 2026.
