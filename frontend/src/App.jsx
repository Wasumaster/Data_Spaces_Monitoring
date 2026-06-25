/**
 * App.jsx — Root application component
 * Manages view routing (catalogue / compare) and shared state.
 * Passes compare count to the Header for prominent CTA display.
 */
import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CataloguePage from './components/CataloguePage';
import ComparePage from './components/ComparePage';
import ResourceDetail from './components/ResourceDetail';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function App() {
  // ── State ──
  const [view, setView] = useState('catalogue');       // 'catalogue' | 'compare'
  const [resources, setResources] = useState([]);       // currently displayed resources
  const [allResources, setAllResources] = useState([]); // unfiltered master list
  const [filters, setFilters] = useState(null);         // available filter options
  const [compareIds, setCompareIds] = useState([]);     // IDs selected for comparison
  const [detailResource, setDetailResource] = useState(null); // resource detail modal
  const [loading, setLoading] = useState(true);

  // Active filters
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    provider: '',
    type: '',
    sensor_type: '',
    tag: '',
    flood_capability: '',
    min_rating: 'medium',
  });

  // ── Data fetching ──
  const fetchResources = useCallback(async (params = {}) => {
    try {
      const url = new URL(`${API_BASE}/api/resources`);
      Object.entries(params).forEach(([k, v]) => {
        if (v) url.searchParams.set(k, v);
      });
      const res = await fetch(url);
      const data = await res.json();
      setResources(data.resources);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    }
  }, []);

  const fetchFilters = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/filters`);
      const data = await res.json();
      setFilters(data);
    } catch (err) {
      console.error('Failed to fetch filters:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchResources(), fetchFilters()]);
      // Also store unfiltered list
      try {
        const res = await fetch(`${API_BASE}/api/resources`);
        const data = await res.json();
        setAllResources(data.resources);
      } catch (e) { /* ignore */ }
      setLoading(false);
    })();
  }, [fetchResources, fetchFilters]);

  // Re-fetch when filters change
  useEffect(() => {
    const params = {};
    if (activeFilters.search) params.search = activeFilters.search;
    if (activeFilters.provider) params.provider = activeFilters.provider;
    if (activeFilters.type) params.type = activeFilters.type;
    if (activeFilters.sensor_type) params.sensor_type = activeFilters.sensor_type;
    if (activeFilters.tag) params.tag = activeFilters.tag;
    if (activeFilters.flood_capability) {
      params.flood_capability = activeFilters.flood_capability;
      params.min_rating = activeFilters.min_rating;
    }
    fetchResources(params);
  }, [activeFilters, fetchResources]);

  // ── Compare helpers ──
  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 6 ? [...prev, id] : prev
    );
  };

  const clearCompare = () => setCompareIds([]);

  const handleCompareNavigation = () => {
    setView('compare');
  };

  // ── Render ──
  return (
    <>
      <Header
        view={view}
        setView={setView}
        compareCount={compareIds.length}
        onCompare={handleCompareNavigation}
      />

      <main className="main-content">
        {view === 'catalogue' ? (
          <CataloguePage
            resources={resources}
            filters={filters}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            compareIds={compareIds}
            toggleCompare={toggleCompare}
            onViewDetail={setDetailResource}
            loading={loading}
          />
        ) : (
          <ComparePage
            compareIds={compareIds}
            allResources={allResources}
            onBack={() => setView('catalogue')}
            onViewDetail={setDetailResource}
          />
        )}
      </main>

      {/* Compare bottom bar — only when resources selected and on catalogue */}
      {compareIds.length > 0 && view === 'catalogue' && (
        <div className="compare-bar">
          <div className="compare-bar-items">
            {compareIds.map((id) => {
              const r = allResources.find((x) => x.id === id);
              return (
                <div key={id} className="compare-bar-item">
                  {r ? r.name : id}
                  <button className="remove-btn" onClick={() => toggleCompare(id)}>✕</button>
                </div>
              );
            })}
          </div>
          <button
            className="compare-action-btn"
            disabled={compareIds.length < 2}
            onClick={handleCompareNavigation}
          >
            Compare ({compareIds.length})
          </button>
          <button className="filter-clear" onClick={clearCompare}>Clear all</button>
        </div>
      )}

      {/* Detail modal */}
      {detailResource && (
        <ResourceDetail
          resource={detailResource}
          onClose={() => setDetailResource(null)}
        />
      )}
    </>
  );
}
