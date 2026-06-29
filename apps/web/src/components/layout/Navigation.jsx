import React, { useState, useMemo, useRef, useEffect } from 'react';
import { NavDropdown } from '../features/NavDropdown';

const SUBJECT_ID_MAP = {
  physics: 1,
  chemistry: 2,
  biology: 3,
};

export function Navigation({
  onPhysicsClick,
  onChemistryClick,
  onBiologyClick,
  activeFilter,
  searchQuery,
  onSearchChange,
  simulations = [],
  onSimulationSelect,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const subjects = [
    {
      key: 'physics',
      label: 'Physics',
      handler: onPhysicsClick,
      items: [
        { label: 'Mechanics', topic: 'Mechanics' },
        { label: 'Thermodynamics', topic: 'Thermodynamics' },
        { label: 'Electromagnetism', topic: 'Electromagnetism' },
        { label: 'All Physics', topic: null },
      ],
    },
    {
      key: 'chemistry',
      label: 'Chemistry',
      handler: onChemistryClick,
      items: [
        { label: 'Organic', topic: 'Organic' },
        { label: 'Inorganic', topic: 'Inorganic' },
        { label: 'Physical', topic: 'Physical' },
        { label: 'All Chemistry', topic: null },
      ],
    },
    {
      key: 'biology',
      label: 'Biology',
      handler: onBiologyClick,
      items: [
        { label: 'Cellular', topic: 'Cellular' },
        { label: 'Genetics', topic: 'Genetics' },
        { label: 'Ecology', topic: 'Ecology' },
        { label: 'All Biology', topic: null },
      ],
    },
  ];

  // Suggestions filtering (limit to 5)
  const suggestions = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return [];
    return simulations
      .filter((sim) =>
        sim.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [simulations, searchQuery]);

  // Click outside suggestions container handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build desktop dropdown items with onClick handlers
  const buildDesktopItems = (subject) =>
    subject.items.map((item) => ({
      ...item,
      onClick: () => subject.handler(item.topic),
    }));

  const handleMobileSubjectClick = (subjectKey) => {
    setExpandedSubject(expandedSubject === subjectKey ? null : subjectKey);
  };

  const handleMobileTopicClick = (handler, topic) => {
    handler(topic);
    setMobileMenuOpen(false);
    setExpandedSubject(null);
  };

  return (
    <nav className="navigation">
      <div className="navigation__logo-section" onClick={scrollToTop} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <img src="/logo.png" alt="Science Simulation Logo" style={{ height: '48px', width: 'auto' }} />
      </div>

      {/* Desktop menu (hidden on mobile via CSS) */}
      <div className="navigation__menu">
        {subjects.map((subject) => (
          <NavDropdown
            key={subject.key}
            label={subject.label}
            items={buildDesktopItems(subject)}
            isActive={activeFilter === subject.key}
          />
        ))}
      </div>

      <div className="navigation__search-container" ref={suggestionsRef}>
        <div className="navigation__search-wrapper">
          <input
            className="navigation__search"
            type="text"
            placeholder="Search simulations..."
            aria-label="Search simulations"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="navigation__search-suggestions">
              {suggestions.map((sim) => (
                <li key={sim.id} className="navigation__search-suggestion-item">
                  <button
                    className="navigation__search-suggestion-btn"
                    onClick={() => {
                      onSimulationSelect(sim);
                      setShowSuggestions(false);
                      onSearchChange(''); // Reset search text after clicking
                    }}
                  >
                    <span className="navigation__search-suggestion-title">{sim.title}</span>
                    <span className="navigation__search-suggestion-subject">
                      {sim.Subject?.name || SUBJECT_ID_MAP[sim.subject_id] || 'Science'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="navigation__search-actions">
        <button
          className="navigation__hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="navigation__hamburger-line" />
        </button>
      </div>

      <div className={`navigation__mobile-menu ${mobileMenuOpen ? 'navigation__mobile-menu--open' : ''}`}>
        {subjects.map((subject) => (
          <div
            key={subject.key}
            className={`navigation__mobile-item navigation__mobile-item--${subject.key} ${
              activeFilter === subject.key ? 'navigation__mobile-item--active' : ''
            } ${expandedSubject === subject.key ? 'navigation__mobile-item--expanded' : ''}`}
          >
            <button
              className="navigation__mobile-item-header"
              onClick={() => handleMobileSubjectClick(subject.key)}
            >
              {subject.label}
              <span>{expandedSubject === subject.key ? '▲' : '▼'}</span>
            </button>
            <div className="navigation__mobile-subitems">
              {subject.items.map((item) => (
                <button
                  key={item.label}
                  className="navigation__mobile-subitem"
                  onClick={() => handleMobileTopicClick(subject.handler, item.topic)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
