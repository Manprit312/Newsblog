# Fixing Prisma Connection Issues on Vercel

If blogs take time to appear on Vercel, it could be a Prisma connection pooling issue.

## The Problem

On Vercel serverless functions:
- Each function invocation can create a new database connection
- Cold starts can cause connection delays
- Connection limits can be hit if not properly managed
- No connection pooling by default in serverless environments

## Solutions

### Option 1: Use Prisma Data Proxy (Recommended for Production)

Prisma Data Proxy provides connection pooling for serverless:

1. **Set up Prisma Data Proxy**:
   - Go to https://console.prisma.io/
   - Create a project and generate a connection string
   - Use the proxy URL instead of direct database URL

2. **Update DATABASE_URL in Vercel**:
   ```
   DATABASE_URL="prisma://your-proxy-url"
   ```

### Option 2: Use PgBouncer (Connection Pooler)

If using a managed PostgreSQL (like Supabase, Neon, etc.):
- They usually provide a connection pooler
- Use the pooler URL instead of direct connection
- Example: `postgresql://user:pass@pooler-host:6543/db` (port 6543 is typical for PgBouncer)

### Option 3: Optimize Prisma Client (Current Implementation)

The current setup:
- Reuses Prisma client instance via global object
- Handles connections properly
- But may still have delays on cold starts

### Option 4: Add Connection Pooling to DATABASE_URL

If your database provider supports it, add connection pool parameters:

```
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=5&pool_timeout=10"
```

## Check Your Current Setup

1. **Check DATABASE_URL format**:
   - Direct connection: `postgresql://...`
   - Pooled connection: Usually has different port or `?pgbouncer=true`
   - Prisma Proxy: `prisma://...`

2. **Check for connection errors in Vercel logs**:
   - Go to Vercel Dashboard → Deployments → Function Logs
   - Look for "Prisma connection" or "database connection" errors

3. **Monitor connection count**:
   - Check your database dashboard for active connections
   - If hitting limits, you need connection pooling

## Quick Test

Add this to see connection timing:

```typescript
// In lib/api.ts, add timing
const start = Date.now();
const blogs = await getBlogs({ published: true });
const duration = Date.now() - start;
console.log(`getBlogs took ${duration}ms`);
```

If duration is high (>1000ms), it's likely a connection issue.

## Recommended Solution

For Vercel + PostgreSQL, use:
1. **Prisma Data Proxy** (best for production)
2. **PgBouncer** (if your DB provider offers it)
3. **Connection string with pool parameters** (if supported)

The current code changes help, but connection pooling is the real solution for serverless.

