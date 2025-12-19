# Fix DATABASE_URL Configuration

## Problem
The application is trying to connect to `122.169.167.14` instead of `72.61.240.156`, and getting "User was denied access" error.

## Solution

### Step 1: Update your `.env` file

Make sure your `.env` file in the `NewsBlogs` directory has the correct `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs"
```

**Important Notes:**
- The password `manprit*` must be URL-encoded: `manprit%2A` (the `*` becomes `%2A`)
- The host should be `72.61.240.156` (not `122.169.167.14`)
- The database name is `newsblogs`
- The port is `5432`

### Step 2: Verify the connection string format

The correct format is:
```
postgresql://[username]:[password]@[host]:[port]/[database]
```

For your setup:
```
postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs
```

### Step 3: Restart your Next.js dev server

After updating `.env`, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd NewsBlogs
npm run dev
```

### Step 4: Test the connection

You can test if the connection works by running:

```bash
cd NewsBlogs
npx prisma db pull
```

Or test with psql:
```bash
psql "postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs"
```

## Common Issues

### Issue 1: Wrong IP Address
**Error:** Connecting to wrong server (e.g., `122.169.167.14`)

**Fix:** Make sure `DATABASE_URL` uses `72.61.240.156`

### Issue 2: Password Not URL-Encoded
**Error:** Connection fails or authentication error

**Fix:** URL-encode special characters:
- `*` → `%2A`
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`

### Issue 3: User Denied Access
**Error:** "User was denied access on the database"

**Possible causes:**
1. Wrong password
2. Database user doesn't exist
3. User doesn't have permissions on the `newsblogs` database
4. PostgreSQL not configured for remote access (see `FIX_DATABASE_CONNECTION.md`)

**Fix:**
1. Verify password is correct and URL-encoded
2. Check if user exists:
   ```bash
   ssh manprit@72.61.240.156
   sudo -u postgres psql -c "\du"
   ```
3. Grant permissions:
   ```sql
   -- Connect to PostgreSQL
   sudo -u postgres psql
   
   -- Grant all privileges on newsblogs database
   GRANT ALL PRIVILEGES ON DATABASE newsblogs TO postgres;
   
   -- Connect to newsblogs database
   \c newsblogs
   
   -- Grant privileges on all tables
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
   ```

### Issue 4: Database Doesn't Exist
**Error:** "database does not exist"

**Fix:** Create the database:
```bash
ssh manprit@72.61.240.156
sudo -u postgres psql -c "CREATE DATABASE newsblogs;"
```

## Complete .env Example

Here's what your `.env` file should look like:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs"

# JWT Secret (change this to a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"

# Next.js
NODE_ENV=development
```

## Verification Checklist

- [ ] `.env` file exists in `NewsBlogs` directory
- [ ] `DATABASE_URL` uses correct IP: `72.61.240.156`
- [ ] Password is URL-encoded: `manprit%2A`
- [ ] Database name is correct: `newsblogs`
- [ ] Port is correct: `5432`
- [ ] PostgreSQL is running on VPS
- [ ] PostgreSQL accepts remote connections (see `FIX_DATABASE_CONNECTION.md`)
- [ ] Firewall allows port 5432
- [ ] Database user has proper permissions
- [ ] Dev server restarted after `.env` changes

## Quick Test Commands

```bash
# Test connection from command line
psql "postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs" -c "SELECT 1;"

# Test with Prisma
cd NewsBlogs
npx prisma db pull

# Check Prisma connection
npx prisma studio
```

