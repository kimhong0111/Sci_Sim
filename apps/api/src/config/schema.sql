-- Science Simulation Learning Platform
-- Database Schema

CREATE DATABASE IF NOT EXISTS science_sim;
USE science_sim;

-- Subjects (e.g. Physics, Chemistry, Biology)
CREATE TABLE subjects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics linked to a subject (e.g. Mechanics, Waves under Physics)
CREATE TABLE topics (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  subject_id  INT NOT NULL,
  name        VARCHAR(100) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Simulations linked to a subject and topic
CREATE TABLE simulations (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  subject_id     INT NOT NULL,
  topic_id       INT NOT NULL,
  title          VARCHAR(255) NOT NULL,
  description    TEXT,
  thumbnail_url  VARCHAR(500),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id)   REFERENCES topics(id)   ON DELETE CASCADE
);

-- Configuration metadata for each simulation
CREATE TABLE simulation_configs (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  simulation_id  INT NOT NULL UNIQUE,
  parameters     JSON NOT NULL COMMENT 'Default values, settings, and variables',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (simulation_id) REFERENCES simulations(id) ON DELETE CASCADE
);

-- Users (merged with admins, role determines access level)
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);