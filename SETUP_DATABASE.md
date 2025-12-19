# Database Setup Guide for NewsBlogs

Since NewsBlogs shares the same database with geneveda-biosciences, you need to set up the database schema first.

## Step 1: Set up geneveda-biosciences Database Schema

The `admins` table and other shared tables are defined in the geneveda-biosciences Prisma schema. You need to create them first:

```bash
cd ../geneveda-biosciences
npm install
npm run prisma:generate
npm run prisma:push
```

Or if you prefer migrations:
```bash
npm run prisma:migrate
```

**Important**: Make sure your `DATABASE_URL` environment variable in geneveda-biosciences `.env` file points to the correct database.

## Step 2: Set up NewsBlogs Database Schema

After the geneveda-biosciences schema is created, set up the NewsBlogs-specific tables:

```bash
cd ../NewsBlogs
npm install
npm run prisma:generate
npm run prisma:push
```

This will create:
- `categories` table
- `subcategories` table  
- `blogs` table (updated to reference categories)

## Step 3: Create Admin User

Once both schemas are set up, you can create an admin user:

```bash
npm run create-admin
```

Or with custom parameters:
```bash
npm run create-admin <email> <password> <name> <username> <role>
```

Example:
```bash
npm run create-admin admin@newsblogs.com mypassword "Admin User" adminuser admin
```

## Troubleshooting

### Error: "relation 'admins' does not exist"
- Make sure you've run `prisma:push` in the geneveda-biosciences project first
- Verify your `DATABASE_URL` is correct in both projects
- Check that both projects are pointing to the same database

### Error: "Can't reach database server"
- Verify your database server is running
- Check your `DATABASE_URL` connection string
- Ensure network access is allowed (if using a remote database)

### Error: "enum type does not exist"
- The `admins_role` enum should be created when you push the geneveda-biosciences schema
- Make sure you've completed Step 1 before proceeding

## Database Connection

Both projects should use the same `DATABASE_URL` in their `.env` files:

```env
DATABASE_URL=postgresql://username:password@host:port/database?schema=public
```

For the shared database on server 40.192.24.24, your connection string should look like:
```env
DATABASE_URL=postgresql://username:password@40.192.24.24:5432/database_name?schema=public
```




