# Sci_Sim Database Recovery

## Full Restore from Backup

```bash
mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < backups/science_sim_backup_YYYYMMDD_HHMMSS.sql
```

## Automated Backup (Cron)

Add to crontab for daily backups at 2:00 AM:

```cron
0 2 * * * cd /path/to/apps/api && bash scripts/backup.sh >> logs/backup.log 2>&1
```

## Notes

- **Aiven Cloud MySQL** provides built-in automated daily backups with point-in-time recovery
- `mysqldump` uses `--single-transaction` for consistent backup without locking tables
- Store backups off-server (cloud storage / different region) for disaster recovery
- Test recovery periodically to verify backup integrity
