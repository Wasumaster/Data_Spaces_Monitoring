/**
 * FilterSidebar.jsx — Sidebar with search and filter chips
 * Deduplicates providers by normalising names so that e.g.
 * "European Space Agency (ESA)" and "European Space Agency (ESA) / EUMETSAT"
 * don't appear as separate entries.
 */
import { useMemo, useRef } from 'react';

/**
 * Normalise provider list: extract short display names and
 * consolidate duplicates that share the same display prefix.
 * Returns an array of { display, value } objects where:
 *   - display: short label shown in the chip
 *   - value:   the string sent to the backend partial-match filter
 */
function deduplicateProviders(providers) {
  const seen = new Map();
  for (const p of providers) {
    // Use the part before any '(' or '/' as the key for dedup
    const shortKey = p.split(/[(/]/)[0].trim();
    if (!seen.has(shortKey)) {
      seen.set(shortKey, { display: shortKey, value: shortKey });
    }
  }
  return Array.from(seen.values());
}

export default function FilterSidebar({ filters, activeFilters, setActiveFilters }) {
  const searchRef = useRef(null);

  // Deduplicated provider list (memoised)
  const uniqueProviders = useMemo(() => {
    if (!filters?.providers) return [];
    return deduplicateProviders(filters.providers);
  }, [filters?.providers]);

  const handleSearchChange = (e) => {
    setActiveFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }));
  };

  const clearAll = () => {
    setActiveFilters({
      search: '',
      provider: '',
      type: '',
      sensor_type: '',
      tag: '',
      flood_capability: '',
      min_rating: 'medium',
    });
  };

  const hasActiveFilters = Object.entries(activeFilters).some(
    ([k, v]) => v && k !== 'min_rating'
  );

  if (!filters) return null;

  return (
    <aside className="filter-sidebar">
      {/* Search */}
      <div className="filter-section">
        <h3>Search</h3>
        <input
          ref={searchRef}
          type="text"
          className="search-input"
          placeholder="Search resources..."
          value={activeFilters.search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Provider — deduplicated */}
      <div className="filter-section">
        <h3>Provider</h3>
        <div className="filter-chips">
          {uniqueProviders.map((p) => (
            <button
              key={p.value}
              className={`filter-chip ${activeFilters.provider === p.value ? 'active' : ''}`}
              onClick={() => handleFilterChange('provider', p.value)}
            >
              {p.display}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Type */}
      <div className="filter-section">
        <h3>Type</h3>
        <div className="filter-chips">
          {filters.types.map((t) => (
            <button
              key={t}
              className={`filter-chip ${activeFilters.type === t ? 'active' : ''}`}
              onClick={() => handleFilterChange('type', t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Type */}
      <div className="filter-section">
        <h3>Sensor</h3>
        <div className="filter-chips">
          {filters.sensor_types.map((s) => (
            <button
              key={s}
              className={`filter-chip ${activeFilters.sensor_type === s ? 'active' : ''}`}
              onClick={() => handleFilterChange('sensor_type', s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Flood Capability */}
      <div className="filter-section">
        <h3>Flood Capability</h3>
        <div className="filter-chips">
          {filters.flood_capabilities.map((c) => (
            <button
              key={c}
              className={`filter-chip ${activeFilters.flood_capability === c ? 'active' : ''}`}
              onClick={() => handleFilterChange('flood_capability', c)}
            >
              {c.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <button className="filter-clear" onClick={clearAll}>
          ✕ Clear all filters
        </button>
      )}
    </aside>
  );
}
