# Fix Database Permissions

## Problem
The database user `geneveda_user` doesn't have access to the `newsblogs_db.public` schema. This is a **remote database** at `40.192.24.24:5432`.

## Solution Options

### Option 1: Contact Database Administrator (Recommended)
Since this is a remote database, you need to contact your database administrator to grant permissions. Ask them to run:

```sql
-- Connect as superuser (usually postgres or admin)
\c newsblogs_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO "geneveda_user";
GRANT USAGE ON SCHEMA public TO "geneveda_user";

-- Grant privileges on all existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "geneveda_user";

-- Grant privileges on all existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "geneveda_user";

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "geneveda_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "geneveda_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO "geneveda_user";

-- Optional: Make user owner of schema
ALTER SCHEMA public OWNER TO "geneveda_user";
```

### Option 2: Use a Superuser Account
If you have access to a superuser account (like `postgres`), update your `.env.local` temporarily:

```env
DATABASE_URL="postgresql://postgres:SUPERUSER_PASSWORD@40.192.24.24:5432/newsblogs_db"
```

Then run:
```bash
psql "postgresql://postgres:SUPERUSER_PASSWORD@40.192.24.24:5432/newsblogs_db" -f scripts/fix-permissions.sql
```

**Remember to change it back** to the `user` account after fixing permissions.

### Option 3: Check if Tables Need to be Created
If the database is empty, you might need to run Prisma migrations first:

```bash
npx prisma db push
```

This will create the tables and might automatically grant permissions.

### Option 4: Use a Different Database User
If you have access to create a new user with proper permissions, you can:

1. Create a new user with proper permissions
2. Update your `.env.local` with the new user credentials

## Quick Test
To test if permissions are fixed, try:

```bash
psql "postgresql://user:Root@123!@40.192.24.24:5432/newsblogs_db" -c "SELECT * FROM \"Blog\" LIMIT 1;"
```

If this works, permissions are fixed!

## After Fixing Permissions
1. Restart your Next.js dev server (Ctrl+C then `npm run dev`)
2. The errors should be resolved

