import React, { useState, useMemo, useRef, useEffect } from 'react';
import { NavDropdown } from '../features/NavDropdown';

export function Navigation({
  subjects = [],
  topicsBySubject = {},
  onSubjectClick,
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

  const navSubjects = useMemo(() => {
    return subjects.map((s) => {
      const key = s.name.toLowerCase();
      const subjectTopics = topicsBySubject[s.id] || [];
      return {
        key,
        label: s.name,
        items: [
          ...subjectTopics.map((t) => ({
            label: t.name,
            topic: t.name,
          })),
          { label: `All ${s.name}`, topic: null },
        ],
      };
    });
  }, [subjects, topicsBySubject]);

  const suggestions = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return [];
    return simulations
      .filter((sim) =>
        sim.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [simulations, searchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buildDesktopItems = (subject) =>
    subject.items.map((item) => ({
      ...item,
      onClick: () => onSubjectClick(subject.key, item.topic),
    }));

  const handleMobileSubjectClick = (subjectKey) => {
    setExpandedSubject(expandedSubject === subjectKey ? null : subjectKey);
  };

  const handleMobileTopicClick = (subjectKey, topic) => {
    onSubjectClick(subjectKey, topic);
    setMobileMenuOpen(false);
    setExpandedSubject(null);
  };

  return (
    <nav className="navigation">
      <div className="navigation__logo-section" onClick={scrollToTop} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <img src="/logo.png" alt="Science Simulation Logo" style={{ height: '48px', width: 'auto' }} />
      </div>

      <div className="navigation__menu">
        {navSubjects.map((subject) => (
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
                      onSearchChange('');
                    }}
                  >
                    <span className="navigation__search-suggestion-title">{sim.title}</span>
                    <span className="navigation__search-suggestion-subject">
                      {sim.Subject?.name || ''}
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
        {navSubjects.map((subject) => (
          <div
            key={subject.key}
            className={`navigation__mobile-item ${
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
                  onClick={() => handleMobileTopicClick(subject.key, item.topic)}
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
