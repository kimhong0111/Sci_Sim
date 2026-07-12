import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navigation } from '../components/layout/Navigation';
import { Hero } from '../components/layout/Hero';
import { SimulationGrid } from '../components/layout/SimulationGrid';
import { DetailOverlay } from '../components/layout/DetailOverlay';
import { Footer } from '../components/layout/Footer';
import { useSimulations } from '../hooks/useSimulations';
import { simulationService } from '../services/api';

export default function SimulationHub() {
  const { simulations, loading, error } = useSimulations();

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSubFilter, setActiveSubFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  const gridRef = useRef(null);

  useEffect(() => {
    Promise.all([
      simulationService.getSubjects(),
      simulationService.getTopics(),
    ]).then(([subs, tops]) => {
      setSubjects(Array.isArray(subs) ? subs : []);
      setTopics(Array.isArray(tops) ? tops : []);
    }).catch(() => {});
  }, []);

  const subjectKeyToId = useMemo(() => {
    const map = {};
    subjects.forEach((s) => {
      map[s.name.toLowerCase()] = s.id;
    });
    return map;
  }, [subjects]);

  const topicsBySubject = useMemo(() => {
    const map = {};
    topics.forEach((t) => {
      if (!map[t.subject_id]) map[t.subject_id] = [];
      map[t.subject_id].push(t);
    });
    return map;
  }, [topics]);

  const filteredSimulations = useMemo(() => {
    return simulations.filter((sim) => {
      const subjectId = subjectKeyToId[activeFilter];
      const matchesCategory =
        activeFilter === 'all' ||
        sim.subject_id === subjectId;

      const matchesTopic =
        !activeSubFilter || sim.Topic?.name === activeSubFilter;

      const matchesSearch =
        !searchQuery ||
        sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesTopic && matchesSearch;
    });
  }, [simulations, activeFilter, activeSubFilter, searchQuery, subjectKeyToId]);

  const handleFilterChange = (filter, subFilter = null) => {
    setActiveFilter(filter);
    setActiveSubFilter(subFilter);
  };

  const handleSubjectClick = (subjectKey, topic) => {
    handleFilterChange(subjectKey, topic);
    gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSimulationSelect = (simulation) => {
    setSelectedSimulation(simulation);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedSimulation(null);
  };

  const handleExploreClick = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    document.body.style.overflow = detailOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [detailOpen]);

  return (
    <div className="simulation-hub">
      <Navigation
        subjects={subjects}
        topicsBySubject={topicsBySubject}
        onSubjectClick={handleSubjectClick}
        activeFilter={activeFilter}
        activeSubFilter={activeSubFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        simulations={simulations}
        onSimulationSelect={handleSimulationSelect}
      />

      <Hero onExploreClick={handleExploreClick} />

      <div ref={gridRef}>
        {loading && (
          <div className="simulation-hub__status">
            <p>⌛ Loading Experimental Data...</p>
          </div>
        )}
        {error && (
          <div className="simulation-hub__status simulation-hub__status--error">
            <p>⚠ System Error: {error}</p>
          </div>
        )}
        {!loading && !error && (
          <SimulationGrid
            simulations={filteredSimulations}
            onSimulationSelect={handleSimulationSelect}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            subjects={subjects}
          />
        )}
      </div>

      <Footer />

      <DetailOverlay
        isOpen={detailOpen}
        simulation={selectedSimulation}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
