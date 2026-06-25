/**
 * Header.jsx — Sticky navigation header
 * Shows a prominent compare badge when resources are selected
 */
export default function Header({ view, setView, compareCount = 0, onCompare }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="logo-icon">🛰️</div>
          <span>EO Data Space</span>
        </div>
        <nav className="header-nav">
          <button
            className={view === 'catalogue' ? 'active' : ''}
            onClick={() => setView('catalogue')}
          >
            Catalogue
          </button>
          {compareCount >= 2 ? (
            <button
              className="header-compare-badge"
              onClick={onCompare}
              title="View resource comparison"
            >
              Compare {compareCount} Resources
            </button>
          ) : (
            <button
              className={view === 'compare' ? 'active' : ''}
              onClick={() => setView('compare')}
            >
              Compare
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
