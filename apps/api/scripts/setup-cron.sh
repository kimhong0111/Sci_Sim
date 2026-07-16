#!/bin/bash
# Adds daily backup cron job at 2:00 AM
# Usage: bash scripts/setup-cron.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CRON_CMD="1 * * * * cd ${PROJECT_DIR} && npm run backup >> ${SCRIPT_DIR}/logs/backup.log 2>&1"

# Check if already exists
if (crontab -l 2>/dev/null | grep -q "backup"); then
  echo "Cron job already exists. Skipping."
  exit 0
fi

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
echo "Cron job added: Daily backup at 2:00 AM"
echo "Log file: ${SCRIPT_DIR}/logs/backup.log"
