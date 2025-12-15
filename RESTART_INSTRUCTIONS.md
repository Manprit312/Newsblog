# Fix: Restart Dev Server to Load New Environment Variables

## The Issue
The Next.js dev server caches environment variables when it starts. Even though we've updated `.env.local` with the correct PostgreSQL connection string, the running server is still using the old cached values.

## Solution

**You need to restart your Next.js development server:**

1. **Stop the current server:**
   - Press `Ctrl + C` in the terminal where `npm run dev` is running

2. **Restart the server:**
   ```bash
   npm run dev
   ```

3. **Verify it's working:**
   - The server should start without the "User `user` was denied access" error
   - You should be able to access `http://localhost:3000`

## Why This Happens
Next.js reads environment variables from `.env.local` when the server starts and caches them. Changes to `.env.local` won't be picked up until you restart the server.

## Current Configuration
Your `.env.local` now has:
```
DATABASE_URL="postgresql://rupindersingh@localhost:5432/newsblogs?schema=public"
```

This is the correct connection string for your local PostgreSQL setup.







