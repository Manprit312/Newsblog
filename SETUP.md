# PostgreSQL Setup Guide

## Local PostgreSQL Setup

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE newsblogs;

# Create user (optional, or use default postgres user)
CREATE USER newsuser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE newsblogs TO newsuser;

# Exit psql
\q
```

### 3. Configure Environment Variables

Update your `.env.local` file:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/newsblogs?schema=public"
```

Or if you created a custom user:
```env
DATABASE_URL="postgresql://newsuser:yourpassword@localhost:5432/newsblogs?schema=public"
```

### 4. Initialize Database Schema

```bash
# Install dependencies (if not already done)
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 5. Verify Setup

You can use Prisma Studio to view and manage your data:

```bash
npm run db:studio
```

This will open a browser interface at `http://localhost:5555` where you can view and edit your database.

## Troubleshooting

### Connection Issues

If you get connection errors:
1. Make sure PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
2. Check your DATABASE_URL format matches: `postgresql://user:password@host:port/database?schema=public`
3. Verify database exists: `psql -l` should list your `newsblogs` database

### Permission Issues

If you get permission errors:
```bash
# Grant necessary permissions
psql postgres
GRANT ALL PRIVILEGES ON DATABASE newsblogs TO your_user;
\q
```

## Production Setup

For production, use a managed PostgreSQL service like:
- **Vercel Postgres**
- **Supabase**
- **Railway**
- **AWS RDS**
- **Heroku Postgres**

Update your `DATABASE_URL` environment variable with the production connection string.







