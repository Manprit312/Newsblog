# ⚠️ URGENT: Database Permissions Fix Required

## Current Issue
The database user `geneveda_user` is **denied access** to the `newsblogs_db.public` schema.

**Error:** `User geneveda_user was denied access on the database newsblogs_db.public`

## Quick Fix (For Database Administrator)

A PostgreSQL **SUPERUSER** needs to run these SQL commands:

```sql
\c newsblogs_db;

GRANT ALL ON SCHEMA public TO "geneveda_user";
GRANT USAGE ON SCHEMA public TO "geneveda_user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "geneveda_user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "geneveda_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "geneveda_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "geneveda_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO "geneveda_user";
ALTER SCHEMA public OWNER TO "geneveda_user";
```

**Or run the SQL file:**
```bash
psql -U postgres -d newsblogs_db -f GRANT_PERMISSIONS.sql
```

## Database Details
- **Host:** 40.192.24.24:5432
- **Database:** newsblogs_db
- **User:** geneveda_user
- **Schema:** public

## After Permissions Are Granted

1. Restart your Next.js dev server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. Verify it works by checking if the homepage loads without errors.

## Alternative: If You Have Superuser Access

If you have superuser credentials, temporarily update `.env.local`:

```env
DATABASE_URL="postgresql://postgres:SUPERUSER_PASSWORD@40.192.24.24:5432/newsblogs_db"
```

Then run:
```bash
psql "postgresql://postgres:SUPERUSER_PASSWORD@40.192.24.24:5432/newsblogs_db" -f GRANT_PERMISSIONS.sql
```

**Remember to change it back** to `geneveda_user` after fixing permissions.

