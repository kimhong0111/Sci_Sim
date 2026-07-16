#!/bin/bash
if crontab -l 2>/dev/null | grep -q "backup"; then
  echo "Backup cron is ACTIVE:"
  crontab -l | grep "backup"
else
  echo "Backup cron is NOT active."
fi
