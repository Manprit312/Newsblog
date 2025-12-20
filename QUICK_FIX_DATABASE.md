# Quick Fix: Database Connection

## Current Issue
Your application is trying to connect to the wrong database server (`122.169.167.14` instead of `72.61.240.156`).

## Quick Solution

### 1. Update your `.env` file

Open `NewsBlogs/.env` and update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@72.61.240.156:5432/newsblogs"
```

**Important:** 
- Replace `YOUR_POSTGRES_PASSWORD` with your actual PostgreSQL password
- If your password has special characters, URL-encode them:
  - `&` → `%26`
  - `*` → `%2A`
  - `@` → `%40`

**Example:**
- If PostgreSQL password is `Bharat&ai2025` → Use `Bharat%26ai2025`
- If PostgreSQL password is `manprit*` → Use `manprit%2A`

### 2. Restart your dev server

```bash
# Stop current server (Ctrl+C)
cd NewsBlogs
npm run dev
```

## SSH Access (for server management)

**Host:** `72.61.240.156`  
**Username:** `root`  
**Password:** `Bharat&ai2025`

```bash
ssh root@72.61.240.156
```

## Finding Your PostgreSQL Password

If you don't know the PostgreSQL password:

1. **SSH into the server:**
   ```bash
   ssh root@72.61.240.156
   # Password: Bharat&ai2025
   ```

2. **Check or reset PostgreSQL password:**
   ```bash
   sudo -u postgres psql
   # Then in psql:
   ALTER USER postgres WITH PASSWORD 'your_new_password';
   \q
   ```

3. **Update your `.env` file** with the new password (URL-encoded)

## Complete .env Example

```env
# Database Connection
# Replace YOUR_POSTGRES_PASSWORD with actual password (URL-encoded)
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@72.61.240.156:5432/newsblogs"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"

# Environment
NODE_ENV=development
```

## Test Connection

After updating `.env` and restarting:

```bash
# Test from command line
psql "postgresql://postgres:YOUR_PASSWORD@72.61.240.156:5432/newsblogs" -c "SELECT 1;"

# Or test with Prisma
cd NewsBlogs
npx prisma db pull
```

## Still Having Issues?

See:
- `FIX_DATABASE_CONNECTION.md` - Configure PostgreSQL for remote access
- `VPS_CREDENTIALS.md` - Complete credentials reference



