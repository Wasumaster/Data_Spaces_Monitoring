# 🎬 Video Script — Federated EO Data Space for National Flood Monitoring

> **Duration:** ~8–12 minutes  
> **Format:** Screen recording with narration  
> **Tip:** Share your screen showing the running application and switch to slides/diagrams where indicated.

---

## PART 1: Introduction (1–2 minutes)

### [Show: Title slide or project README]

> Hello, my name is [YOUR NAME], and this is my presentation for the mini-project *"Designing a Federated EO Data Space for National Flood Monitoring"* for the course on Data Spaces and Federated Data Engineering for Orbital and Space Observations at AGH University of Krakow.

> The objective of this project was twofold. First, to investigate Earth Observation resources that could support a national flood monitoring and early warning service. And second, to organise selected resources into a simple Federated EO Data Space that supports resource discovery across multiple providers.

> The operational requirements we needed to address are: flood detection, flood extent assessment, monitoring during cloudy conditions, monitoring during night-time operations, and support for emergency response activities.

> Let me start by presenting the EO resources I investigated.

---

## PART 2: EO Resource Investigation (3–4 minutes)

### [Show: The application's catalogue page or a summary table]

> I investigated a total of 10 Earth Observation resources from 6 independent providers. Let me walk through the most important ones and explain their role in flood monitoring.

---

### Sentinel-1 (SAR) — ESA

> Sentinel-1 is arguably the most important resource for flood monitoring. It is a C-band Synthetic Aperture Radar satellite. SAR is an active sensor — it sends out its own microwave pulses and records the reflections. This has two critical implications:

> First, SAR penetrates clouds, rain, and fog completely. During active flood events, when heavy rainfall creates extensive cloud cover, Sentinel-1 can still acquire usable imagery. This is essential because floods typically occur precisely when optical sensors are blinded by clouds.

> Second, SAR operates day and night. It does not depend on sunlight. This means we can detect and map floods during night-time, which is crucial for 24/7 operational monitoring.

> Water surfaces appear dark in SAR imagery due to specular reflection — the radar pulse bounces away from the sensor rather than back to it. This makes flood water clearly distinguishable from surrounding land, enabling reliable flood extent delineation.

> For these reasons, Sentinel-1 receives a **high** rating across all five operational requirements.

---

### Sentinel-2 (Optical Multispectral) — ESA

> Sentinel-2 provides high-resolution optical imagery with 13 spectral bands at up to 10 metres resolution. From these bands, we can derive water indices like NDWI and MNDWI, which are excellent for identifying water bodies and flooded areas.

> Sentinel-2 produces very intuitive, high-resolution flood maps. The SWIR bands can even detect water beneath vegetation canopy, which SAR sometimes struggles with.

> However, Sentinel-2 has two significant limitations: it cannot see through clouds, and it requires sunlight. This means during active flood events with heavy rain and cloud cover — which is extremely common — Sentinel-2 is often unusable. And it cannot operate at night.

> So Sentinel-2 is **high** for flood detection and extent assessment in clear conditions, but **low** for cloudy conditions and **none** for night operations.

---

### Sentinel-3 (Ocean & Land Monitoring) — ESA / EUMETSAT

> Sentinel-3 carries multiple instruments including an optical imager, a thermal sensor, and importantly, a radar altimeter called SRAL. The altimeter can measure river and lake water levels, which is valuable for flood early warning — rising water levels precede flooding.

> However, the spatial resolution is much coarser — 300 metres for the optical sensor and 1 kilometre for the thermal. So while it provides a good wide-area overview, it's not suitable for detailed local flood mapping.

---

### Sentinel-5P (Atmospheric) — ESA

> Sentinel-5P is an atmospheric monitoring satellite carrying the TROPOMI spectrometer. It measures trace gases, aerosols, and cloud properties. It is not designed for direct flood detection.

> However, I included it because it provides cloud fraction data that can support operational planning — helping operators know when and where optical sensors can acquire usable data. It can also detect post-flood methane emissions from damaged infrastructure.

> Its flood monitoring relevance is rated **low** across most categories.

---

### Copernicus Emergency Management Service (EMS)

> Copernicus EMS is the primary European emergency response service for natural disasters, managed by the Joint Research Centre. It has two key components relevant to flood monitoring.

> First, the **Rapid Mapping** service, which produces expert-validated flood delineation maps within hours of activation. These are the most authoritative flood mapping products available.

> Second, the **Global Flood Monitoring** system (GFM), which provides continuous near-real-time flood detection globally, based on Sentinel-1 SAR data.

> EMS also includes EFAS — the European Flood Awareness System — which provides probabilistic flood forecasts up to 10 days ahead.

> EMS is rated **high** across all five operational requirements. It is specifically designed for emergency flood response.

---

### Copernicus Land Monitoring Service (CLMS) — EEA

> CLMS provides baseline land and water data — including the EU-Hydro river network database, high-resolution water and wetness layers, and CORINE Land Cover. These products are not real-time, but they provide critical reference data.

> During a flood event, you need to know where water *normally* is in order to identify where the flooding has *actually* occurred. CLMS provides this baseline.

---

### Copernicus Data Space Ecosystem (CDSE)

> CDSE is the unified access platform for all Copernicus data. It provides a single entry point for discovering, visualising, and downloading data from all Sentinel missions and Copernicus Services.

> I included it because it demonstrates the federated access concept — one platform providing access to resources from multiple providers.

---

### EUMETSAT H SAF and EUMETView

> From EUMETSAT, I included two resources. The **H SAF** provides satellite-derived precipitation estimates and soil moisture products. Near real-time precipitation monitoring from geostationary satellites helps assess rainfall intensity, while soil moisture indicates how saturated the ground is — saturated soils lead to more severe flooding.

> **EUMETView** is a web-based viewer providing near-real-time satellite imagery, updated every 15 minutes from geostationary orbit. It provides immediate situational awareness during emergencies.

> Both operate 24/7 and function through cloud cover using microwave and thermal infrared channels.

---

### GloFAS — ECMWF

> Finally, GloFAS — the Global Flood Awareness System — provides probabilistic flood forecasts up to 30 days ahead based on ECMWF weather forecasts and hydrological modelling. It is the early warning backbone of the system, detecting potential flood events before they occur.

---

## PART 3: Resource Selection Rationale (1–2 minutes)

### [Show: Comparison table from the application]

> Let me now explain why these specific resources were selected and how they map to the operational requirements.

> For **flood detection**, the primary resources are Sentinel-1, Copernicus EMS (particularly GFM), GloFAS for forecasting, and Sentinel-2 for clear-sky conditions.

> For **flood extent assessment**, Sentinel-1 and Sentinel-2 provide the highest resolution maps, while EMS Rapid Mapping delivers authoritative validated products.

> For **monitoring during cloudy conditions** — which is the most challenging requirement — Sentinel-1 SAR is indispensable because it penetrates clouds. GloFAS operates independently of clouds because it's model-based. H SAF microwave products also function through clouds.

> For **night-time operations**, Sentinel-1, H SAF, EUMETView (thermal channels), and GloFAS all operate 24/7.

> For **emergency response**, Copernicus EMS is the dedicated service, GloFAS provides lead time for preparedness, and CDSE provides rapid access to the latest satellite data.

> The selection covers all five operational requirements with multiple complementary resources, ensuring that even if one resource is unavailable, alternatives exist.

---

## PART 4: Data Space Implementation Walkthrough (3–4 minutes)

### [Show: Running application at http://localhost:3000]

> Now let me demonstrate the implemented Federated EO Data Space.

> The solution is a web-based application with a **FastAPI** Python backend serving a REST API, and a **React** frontend providing the user interface. Everything is containerised with Docker for easy deployment.

---

### Browsing Resources

> On the main catalogue page, you can see all 10 EO resources displayed as cards. Each card shows the resource name, its provider — preserving the origin information — a description, the resource type badge — satellite, service, or platform — and a flood capability mini-bar showing the rating for each operational requirement at a glance.

> The five coloured dots on each card represent, from left to right: flood detection, extent assessment, cloudy conditions, night operations, and emergency response. Green means high capability, amber means medium, orange means low, and grey means none.

---

### Identifying Providers

> In the filter sidebar on the left, you can see the **Provider** section listing all the independent providers in the data space: ESA, EUMETSAT, Copernicus / European Commission, the EEA, and ECMWF.

> Clicking on a provider filters the catalogue to show only resources from that provider. For example, clicking "EUMETSAT" shows the H SAF and EUMETView resources.

> This demonstrates the federated nature of the data space — resources come from multiple independent organisations but are organised in a common catalogue.

---

### Filtering and Discovery

> The sidebar also allows filtering by **resource type** — satellite, service, or platform — by **sensor type** — SAR, optical, multi, spectrometer — and by **flood capability** categories.

> For example, if I select "cloudy_conditions" under Flood Capability, the catalogue filters to show only resources with at least medium capability for monitoring during cloudy conditions. This directly supports the operational requirement.

---

### Quick Filters for Operational Situations

> At the top, there are **operational quick-filter buttons**. These are designed for the specific scenarios defined in the project requirements.

> Clicking "Night-Time Monitoring" immediately shows only the resources that are tagged as night-capable — Sentinel-1, EMS, CDSE, H SAF, EUMETView, and GloFAS. An operator needing to monitor floods at night can instantly identify the relevant resources.

> Similarly, "Cloudy Conditions" shows cloud-penetrating resources, and "Emergency Response" shows resources suitable for crisis situations.

---

### Resource Details

> Clicking on any resource card opens a detailed view showing all metadata: the full description, purpose, list of observation products, the flood relevance table with ratings and explanations for each of the five operational capabilities, strengths, limitations, operational tags, and access information with direct links to the data portals.

> This fulfils the requirement to provide access information and references to the original resource source.

---

### Comparing Resources

> Finally, the comparison feature. I can select multiple resources using the checkboxes on the cards. A comparison bar appears at the bottom showing my selection.

> Let me select Sentinel-1, Sentinel-2, and Copernicus EMS, then click "Compare."

> The comparison page shows a structured side-by-side table. At the top, basic information — provider, sensor type, spatial and temporal resolution, and access links. Below that, the **flood monitoring capabilities matrix** — showing the rating and detailed explanation for each of the five operational requirements, for each selected resource.

> This makes it immediately clear, for example, that Sentinel-1 is rated high for cloudy conditions while Sentinel-2 is rated low, or that all three are rated high for flood detection but for different reasons.

> Below the capabilities, key strengths and limitations are listed side by side for easy comparison.

> This comparison feature is essential for operators making decisions about which resources to use in specific operational scenarios.

---

## PART 5: Meeting Operational Requirements (1 minute)

### [Show: Comparison page or summary]

> To summarise how this solution meets the operational requirements:

> **Flood detection** is supported by Sentinel-1 SAR imagery, Sentinel-2 optical indices, EMS rapid mapping, and GloFAS forecasts.

> **Flood extent assessment** uses Sentinel-1 and Sentinel-2 high-resolution products, complemented by EMS validated maps and CLMS baseline data.

> **Cloudy conditions** — the most critical challenge — are addressed by Sentinel-1 SAR, GloFAS model-based forecasts, and H SAF microwave products, all of which operate independently of cloud cover.

> **Night-time operations** are supported by Sentinel-1 SAR, H SAF, EUMETView thermal imagery, and GloFAS, all operating 24/7.

> **Emergency response** is directly served by Copernicus EMS rapid mapping, GloFAS early warning, and CDSE providing rapid data access.

> The data space ensures that for every operational situation, at least 3–4 complementary resources are available, providing resilience and redundancy.

---

## PART 6: Conclusion (30 seconds)

> In conclusion, I have investigated 10 EO resources from 6 independent providers, assessed their suitability for flood monitoring against five operational requirements, and implemented a Federated EO Data Space that organises these resources in a common catalogue with full support for browsing, filtering, searching, and comparing resources.

> The solution is implemented as a Python FastAPI backend with a React frontend, containerised with Docker for easy deployment. The source code and documentation are available in the project repository.

> Thank you for watching.

---

## 📝 Notes for Recording

1. **Screen share** the running application throughout Parts 4–5
2. **Demonstrate** each filter and the comparison feature live
3. **Click through** at least 2–3 resource detail views
4. **Show** the API documentation at `http://localhost:8000/docs` briefly
5. Keep a **natural pace** — aim for 8–12 minutes total
6. You can skip or shorten any section if pressed for time, but ensure Parts 2, 4, and 5 are covered
