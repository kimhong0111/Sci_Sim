

-- Application runtime user (Express app)
CREATE USER IF NOT EXISTS 'sci_app'@'%' IDENTIFIED BY 'app12345';
GRANT SELECT, INSERT, UPDATE, DELETE ON science_sim.* TO 'sci_app'@'%';

-- Admin user (seed + migrate scripts)
CREATE USER IF NOT EXISTS 'sci_admin'@'%' IDENTIFIED BY 'admin123@';
GRANT ALL PRIVILEGES ON science_sim.* TO 'sci_admin'@'%';

-- Backup user (mariadb-dump)
CREATE USER IF NOT EXISTS 'sci_backup'@'%' IDENTIFIED BY 'backup123@';
GRANT SELECT, LOCK TABLES, SHOW VIEW, TRIGGER ON science_sim.* TO 'sci_backup'@'%';

FLUSH PRIVILEGES;

SELECT 'Database users created successfully' AS status;
