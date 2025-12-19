# Fix DATABASE_URL in .env File

## Problem
Your application is trying to connect to `122.169.167.14` instead of `72.61.240.156`, causing "User was denied access" errors.

## Quick Fix

### Step 1: Open your `.env` file
The `.env` file should be in the `NewsBlogs` directory.

### Step 2: Update DATABASE_URL

**Current (WRONG):**
```env
DATABASE_URL="postgresql://postgres:password@122.169.167.14:5432/newsblogs"
```

**Correct:**
```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@72.61.240.156:5432/newsblogs"
```

**Important:**
- IP address: `72.61.240.156` (not `122.169.167.14`)
- Username: `postgres` (PostgreSQL user, not SSH user)
- Password: URL-encode special characters (see encoding reference below)
- Database: `newsblogs`
- Port: `5432`

**Note:** The PostgreSQL password is different from your SSH password. If your PostgreSQL password is `Bharat&ai2025`, encode it as `Bharat%26ai2025` (the `&` becomes `%26`).

### Step 3: Restart your dev server

After saving the `.env` file:

1. Stop your current dev server (press `Ctrl+C` in the terminal)
2. Restart it:
   ```bash
   cd NewsBlogs
   npm run dev
   ```

### Step 4: Verify the connection

The errors should stop. You can test by:
- Trying to log in to the admin panel
- Checking if `/api/categories` works
- Looking at the terminal - you should see Prisma queries instead of connection errors

## Complete .env File Example

Your `.env` file should look like this:

```env
# Database Connection - VPS PostgreSQL
# Replace YOUR_POSTGRES_PASSWORD with your actual PostgreSQL password (URL-encoded)
# Example: If password is "Bharat&ai2025", use "Bharat%26ai2025"
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@72.61.240.156:5432/newsblogs"

# JWT Secret (change this to a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"

# Environment
NODE_ENV=development
```

## URL Encoding Reference

If your password has special characters, encode them:
- `*` → `%2A`
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- `:` → `%3A`

## Troubleshooting

### Still getting connection errors?

1. **Check if PostgreSQL is accessible:**
   ```bash
   psql "postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs" -c "SELECT 1;"
   ```

2. **Verify PostgreSQL is configured for remote access:**
   See `FIX_DATABASE_CONNECTION.md` for details.

3. **Check if the database exists:**
   ```bash
   ssh root@72.61.240.156
   # Password: Bharat&ai2025
   sudo -u postgres psql -l | grep newsblogs
   ```

4. **Clear Next.js cache:**
   ```bash
   cd NewsBlogs
   rm -rf .next
   npm run dev
   ```

