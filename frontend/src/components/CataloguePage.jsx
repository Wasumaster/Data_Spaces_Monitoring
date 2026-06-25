/**
 * CataloguePage.jsx — Main browsing page with filters and resource grid
 */
import FilterSidebar from './FilterSidebar';
import ResourceCard from './ResourceCard';

/** Operational quick-filter presets */
const QUICK_FILTERS = [
  { key: 'night',     label: '🌙 Night-Time Monitoring', tag: 'night-capable' },
  { key: 'cloud',     label: '☁️ Cloudy Conditions',     tag: 'cloud-penetrating' },
  { key: 'emergency', label: '🚨 Emergency Response',    tag: 'emergency' },
  { key: 'flood',     label: '🌊 Flood Detection',       tag: 'flood-detection' },
  { key: 'warning',   label: '⚡ Early Warning',          tag: 'early-warning' },
];

export default function CataloguePage({
  resources,
  filters,
  activeFilters,
  setActiveFilters,
  compareIds,
  toggleCompare,
  onViewDetail,
  loading,
}) {
  const activeQuick = activeFilters.tag;

  const handleQuickFilter = (tag) => {
    setActiveFilters((prev) => ({
      ...prev,
      tag: prev.tag === tag ? '' : tag,
    }));
  };

  return (
    <>
      <div className="page-header">
        <h1>Federated EO Data Space</h1>
        <p>
          Discover, explore, and compare Earth Observation resources for national
          flood monitoring and early warning. Resources from multiple independent
          providers are organised in a common catalogue.
        </p>
      </div>

      {/* Quick operational filters */}
      <div className="quick-filters">
        {QUICK_FILTERS.map((qf) => (
          <button
            key={qf.key}
            className={`quick-filter-btn ${activeQuick === qf.tag ? 'active' : ''}`}
            onClick={() => handleQuickFilter(qf.tag)}
          >
            <span className="qf-icon">{qf.label.slice(0, 2)}</span>
            {qf.label.slice(2)}
          </button>
        ))}
      </div>

      <div className="catalogue-layout">
        <FilterSidebar
          filters={filters}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />

        <div>
          <div className="stats-bar">
            <span className="count">{resources.length}</span> resource{resources.length !== 1 ? 's' : ''} found
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <h3>Loading resources…</h3>
            </div>
          ) : resources.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No resources match your filters</h3>
              <p>Try adjusting or clearing your filters</p>
            </div>
          ) : (
            <div className="resource-grid">
              {resources.map((r) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  isCompareSelected={compareIds.includes(r.id)}
                  onToggleCompare={() => toggleCompare(r.id)}
                  onViewDetail={() => onViewDetail(r)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
