/**
 * ComparePage.jsx — Side-by-side comparison of selected EO resources
 * Displays a structured comparison table with flood capability matrix.
 */
import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const CAPABILITY_LABELS = {
  detection: '🌊 Flood Detection',
  extent_assessment: '📏 Extent Assessment',
  cloudy_conditions: '☁️ Cloudy Conditions',
  night_operations: '🌙 Night Operations',
  emergency_response: '🚨 Emergency Response',
};

export default function ComparePage({ compareIds, allResources, onBack, onViewDetail }) {
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareIds.length < 2) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/compare?ids=${compareIds.join(',')}`
        );
        const data = await res.json();
        setCompareData(data);
      } catch (err) {
        console.error('Compare failed:', err);
      }
      setLoading(false);
    })();
  }, [compareIds]);

  if (compareIds.length < 2) {
    return (
      <>
        <button className="back-btn" onClick={onBack}>← Back to Catalogue</button>
        <div className="empty-state">
          <div className="empty-icon">⚖️</div>
          <h3>Select at least 2 resources to compare</h3>
          <p>Use the checkboxes on resource cards in the catalogue to select resources for comparison.</p>
        </div>
      </>
    );
  }

  if (loading || !compareData) {
    return (
      <>
        <button className="back-btn" onClick={onBack}>← Back to Catalogue</button>
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading comparison…</h3>
        </div>
      </>
    );
  }

  const { resources, comparison_matrix, capabilities } = compareData;

  return (
    <>
      <button className="back-btn" onClick={onBack}>← Back to Catalogue</button>

      <div className="page-header">
        <h1>Resource Comparison</h1>
        <p>Side-by-side comparison of {resources.length} EO resources for flood monitoring suitability.</p>
      </div>

      <div className="compare-page-grid">
        <table className="compare-table">
          <thead>
            <tr>
              <th></th>
              {resources.map((r) => (
                <th key={r.id}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span
                      style={{ cursor: 'pointer', color: 'var(--text-accent)' }}
                      onClick={() => onViewDetail(r)}
                    >
                      {r.name}
                    </span>
                    <span className={`resource-type-badge ${r.type}`}>{r.type}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Basic Info */}
            <tr className="section-header">
              <td colSpan={resources.length + 1}>Basic Information</td>
            </tr>
            <tr>
              <td className="row-label">Provider</td>
              {resources.map((r) => <td key={r.id}>{r.provider}</td>)}
            </tr>
            <tr>
              <td className="row-label">Sensor Type</td>
              {resources.map((r) => <td key={r.id}>{r.sensor_type}</td>)}
            </tr>
            <tr>
              <td className="row-label">Spatial Res.</td>
              {resources.map((r) => <td key={r.id}>{r.spatial_resolution}</td>)}
            </tr>
            <tr>
              <td className="row-label">Temporal Res.</td>
              {resources.map((r) => <td key={r.id}>{r.temporal_resolution}</td>)}
            </tr>
            <tr>
              <td className="row-label">Access</td>
              {resources.map((r) => (
                <td key={r.id}>
                  <a href={r.access_url} target="_blank" rel="noopener noreferrer" className="access-link" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                    🔗 Access
                  </a>
                </td>
              ))}
            </tr>

            {/* Flood Capabilities */}
            <tr className="section-header">
              <td colSpan={resources.length + 1}>Flood Monitoring Capabilities</td>
            </tr>
            {capabilities.map((cap) => (
              <tr key={cap}>
                <td className="row-label">{CAPABILITY_LABELS[cap] || cap.replace(/_/g, ' ')}</td>
                {resources.map((r) => {
                  const entry = comparison_matrix[cap]?.[r.id] || {};
                  return (
                    <td key={r.id}>
                      <span className={`rating-badge ${entry.rating || 'none'}`}>
                        {entry.rating || 'n/a'}
                      </span>
                      <div style={{ fontSize: '0.78rem', marginTop: 6, lineHeight: 1.4, color: 'var(--text-muted)' }}>
                        {entry.explanation || '—'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Strengths & Limitations */}
            <tr className="section-header">
              <td colSpan={resources.length + 1}>Strengths</td>
            </tr>
            <tr>
              <td className="row-label">Key Strengths</td>
              {resources.map((r) => (
                <td key={r.id}>
                  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                    {r.strengths?.slice(0, 4).map((s, i) => (
                      <li key={i} style={{ fontSize: '0.8rem', marginBottom: 4, color: 'var(--text-secondary)' }}>{s}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            <tr className="section-header">
              <td colSpan={resources.length + 1}>Limitations</td>
            </tr>
            <tr>
              <td className="row-label">Key Limitations</td>
              {resources.map((r) => (
                <td key={r.id}>
                  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                    {r.limitations?.slice(0, 4).map((l, i) => (
                      <li key={i} style={{ fontSize: '0.8rem', marginBottom: 4, color: 'var(--text-muted)' }}>{l}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
