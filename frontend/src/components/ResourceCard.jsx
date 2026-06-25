/**
 * ResourceCard.jsx — Summary card for a single EO resource
 * Uniform height cards with truncated descriptions, high-contrast tags,
 * flood capability mini-bar with tooltips, and compare checkbox.
 */

/** Flood capability keys in display order */
const CAPABILITIES = [
  'detection',
  'extent_assessment',
  'cloudy_conditions',
  'night_operations',
  'emergency_response',
];

const CAP_LABELS = {
  detection: 'Detection',
  extent_assessment: 'Extent',
  cloudy_conditions: 'Cloudy',
  night_operations: 'Night',
  emergency_response: 'Emergency',
};

/**
 * Map tag slugs to high-contrast CSS class names.
 * Tags matching known operational keywords get distinctive colours;
 * everything else gets the default neutral styling.
 */
function getTagClass(tag) {
  const t = tag.toLowerCase();
  if (t === 'flood-detection')   return 'tag-flood-detection';
  if (t === 'night-capable')     return 'tag-night-capable';
  if (t === 'cloud-penetrating') return 'tag-cloud-penetrating';
  if (t === 'all-weather')       return 'tag-all-weather';
  if (t === 'emergency')         return 'tag-emergency';
  if (t === 'early-warning')     return 'tag-early-warning';
  if (t === 'authoritative')     return 'tag-authoritative';
  return 'tag-default';
}

export default function ResourceCard({
  resource,
  isCompareSelected,
  onToggleCompare,
  onViewDetail,
}) {
  const { name, provider, description, type, flood_relevance, operational_tags } = resource;

  return (
    <div className="resource-card" onClick={onViewDetail}>
      <div className="resource-card-header">
        <h3>{name}</h3>
        <span className={`resource-type-badge ${type}`}>{type}</span>
      </div>

      <div className="provider-line">🏢 {provider}</div>

      <p className="description">{description}</p>

      {/* Flood capability mini bar with tooltips */}
      <div className="flood-capability-mini">
        {CAPABILITIES.map((cap) => {
          const rating = flood_relevance?.[cap]?.rating || 'none';
          return (
            <div key={cap} className="tooltip-wrapper" style={{ flex: 1 }}>
              <div className={`flood-cap-dot ${rating}`} />
              <span className="tooltip-text">{CAP_LABELS[cap]}: {rating}</span>
            </div>
          );
        })}
      </div>

      {/* High-contrast operational tags */}
      <div className="resource-card-tags">
        {operational_tags?.slice(0, 5).map((tag) => (
          <span key={tag} className={`tag ${getTagClass(tag)}`}>{tag}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="resource-card-footer">
        <label
          className={`compare-checkbox ${isCompareSelected ? 'checked-state' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isCompareSelected}
            onChange={onToggleCompare}
          />
          {isCompareSelected ? 'Selected' : 'Compare'}
        </label>
        <button className="view-details-btn" onClick={(e) => { e.stopPropagation(); onViewDetail(); }}>
          View Details →
        </button>
      </div>
    </div>
  );
}
