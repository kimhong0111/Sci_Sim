-- ============================================================
-- Sci_Sim Database Schema
-- Matches ERD: Admin, Subject, Topic, Simulations, Sim_Config
-- ============================================================

CREATE DATABASE IF NOT EXISTS science_sim;
USE science_sim;

-- Drop in reverse FK order so re-runs are safe
DROP TABLE IF EXISTS sim_config;
DROP TABLE IF EXISTS simulations;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS admin;

-- ------------------------------------------------------------
-- Admin (created first: referenced by Subject/Topic/Simulations)
-- ------------------------------------------------------------
CREATE TABLE admin (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  pass        VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Subject (e.g. Physics, Chemistry, Biology)
-- ------------------------------------------------------------
CREATE TABLE subjects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(101) NOT NULL UNIQUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by  INT NOT NULL,
  CONSTRAINT fk_subjects_admin
    FOREIGN KEY (created_by) REFERENCES admin(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- Topic (linked to a Subject, e.g. Mechanics under Physics)
-- ------------------------------------------------------------
CREATE TABLE topics (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  subject_id  INT NOT NULL,
  name        VARCHAR(101) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by  INT NOT NULL,
  CONSTRAINT fk_topics_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_topics_admin
    FOREIGN KEY (created_by) REFERENCES admin(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- Simulations (belongs to a Topic and its parent Subject)
-- ------------------------------------------------------------
CREATE TABLE simulations (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(150) NOT NULL,
  description    TEXT,
  thumbnail_url  VARCHAR(500),
  sketch_key     VARCHAR(255),
  topic_id       INT NOT NULL,
  subject_id     INT NOT NULL,
  created_by     INT NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_simulations_topic
    FOREIGN KEY (topic_id) REFERENCES topics(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_simulations_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_simulations_admin
    FOREIGN KEY (created_by) REFERENCES admin(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- Sim_Config (1:1 with Simulations - stores tunable parameters)
-- ------------------------------------------------------------
CREATE TABLE sim_config (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  sim_id      INT NOT NULL UNIQUE,
  parameter   JSON NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_simconfig_simulation
    FOREIGN KEY (sim_id) REFERENCES simulations(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- Indexes for query optimization (FK columns + lookups)
-- ------------------------------------------------------------
CREATE INDEX idx_topics_subject ON topics(subject_id);
CREATE INDEX idx_topics_created_by ON topics(created_by);
CREATE INDEX idx_simulations_topic ON simulations(topic_id);
CREATE INDEX idx_simulations_subject ON simulations(subject_id);
CREATE INDEX idx_simulations_created_by ON simulations(created_by);
CREATE INDEX idx_sim_config_sim ON sim_config(sim_id);
CREATE INDEX idx_subjects_created_by ON subjects(created_by);
