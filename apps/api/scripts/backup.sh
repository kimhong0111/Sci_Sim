#!/bin/bash
# Sci_Sim Database Backup Script
# Usage: bash scripts/backup.sh
# Requires: mysqldump, DB credentials in environment variables

set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
FILENAME="science_sim_backup_${DATE}.sql"

mkdir -p ${BACKUP_DIR}

echo "Starting backup..."

mysqldump \
  -h ${DB_HOST} \
  -P ${DB_PORT} \
  -u ${DB_USER} \
  -p${DB_PASSWORD} \
  --single-transaction \
  --routines \
  --triggers \
  ${DB_NAME} > ${BACKUP_DIR}/${FILENAME}

echo "Backup saved: ${BACKUP_DIR}/${FILENAME}"
echo "Size: $(du -h ${BACKUP_DIR}/${FILENAME} | cut -f1)"
