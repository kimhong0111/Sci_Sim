#!/bin/bash
crontab -l 2>/dev/null | grep -v "backup" | crontab -
echo "Backup cron job removed."
