/**
 * ResourceDetail.jsx — Full detail modal overlay for a single EO resource
 * Shows all metadata fields, flood relevance table, strengths, limitations,
 * access info, and provider links.
 */
import { useEffect } from 'react';

const CAPABILITY_LABELS = {
  detection: '🌊 Flood Detection',
  extent_assessment: '📏 Extent Assessment',
  cloudy_conditions: '☁️ Cloudy Conditions',
  night_operations: '🌙 Night Operations',
  emergency_response: '🚨 Emergency Response',
};

export default function ResourceDetail({ resource, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!resource) return null;

  const {
    name, provider, provider_url, type, sensor_type,
    description, purpose, observations, access_url,
    access_mechanism, strengths, limitations,
    spatial_resolution, temporal_resolution, flood_relevance,
    operational_tags,
  } = resource;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="detail-panel-header">
          <div>
            <h2>{name}</h2>
            <div className="provider-line" style={{ marginTop: 4 }}>
              🏢{' '}
              <a href={provider_url} target="_blank" rel="noopener noreferrer">
                {provider}
              </a>
            </div>
          </div>
          <button className="detail-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Meta badges */}
        <div className="detail-meta">
          <div className="detail-meta-item">
            <span className="label">Type:</span>
            <span className={`resource-type-badge ${type}`}>{type}</span>
          </div>
          <div className="detail-meta-item">
            <span className="label">Sensor:</span> {sensor_type}
          </div>
          <div className="detail-meta-item">
            <span className="label">Spatial:</span> {spatial_resolution}
          </div>
          <div className="detail-meta-item">
            <span className="label">Temporal:</span> {temporal_resolution}
          </div>
        </div>

        {/* Description */}
        <div className="detail-section">
          <h3>Description</h3>
          <p>{description}</p>
        </div>

        {/* Purpose */}
        <div className="detail-section">
          <h3>Purpose</h3>
          <p>{purpose}</p>
        </div>

        {/* Observations / Products */}
        <div className="detail-section">
          <h3>Observations & Products</h3>
          <ul>
            {observations?.map((obs, i) => <li key={i}>{obs}</li>)}
          </ul>
        </div>

        {/* Flood Relevance Table */}
        <div className="detail-section">
          <h3>Flood Monitoring Relevance</h3>
          <table className="flood-relevance-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Rating</th>
                <th>Explanation</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(CAPABILITY_LABELS).map(([key, label]) => {
                const cap = flood_relevance?.[key] || {};
                return (
                  <tr key={key}>
                    <td className="capability-name">{label}</td>
                    <td>
                      <span className={`rating-badge ${cap.rating || 'none'}`}>
                        {cap.rating || 'n/a'}
                      </span>
                    </td>
                    <td>{cap.explanation || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Strengths */}
        <div className="detail-section">
          <h3>Strengths</h3>
          <ul>
            {strengths?.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        {/* Limitations */}
        <div className="detail-section">
          <h3>Limitations</h3>
          <ul className="limitations">
            {limitations?.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </div>

        {/* Tags */}
        <div className="detail-section">
          <h3>Operational Tags</h3>
          <div className="filter-chips" style={{ padding: 0 }}>
            {operational_tags?.map((tag) => (
              <span key={tag} className="filter-chip">{tag}</span>
            ))}
          </div>
        </div>

        {/* Access Information */}
        <div className="detail-section">
          <h3>Access Information</h3>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Access Mechanism:</strong> {access_mechanism}
          </p>
          <a
            href={access_url}
            target="_blank"
            rel="noopener noreferrer"
            className="access-link"
          >
            🔗 Access this resource →
          </a>
          {provider_url && (
            <a
              href={provider_url}
              target="_blank"
              rel="noopener noreferrer"
              className="access-link"
              style={{ marginLeft: 8 }}
            >
              🏢 Provider Portal →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
