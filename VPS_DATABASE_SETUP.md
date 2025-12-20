# NewsBlogs VPS Database Setup Guide

## Prerequisites
- SSH access to VPS: `manprit@72.61.240.156`
- PostgreSQL installed on the VPS
- Password: `manprit*`

## Step 1: Connect to VPS

```bash
ssh manprit@72.61.240.156
# Enter password when prompted: manprit*
```

## Step 2: Transfer SQL File to VPS

From your local machine, copy the SQL file to the VPS:

```bash
# From your local machine (in NewsBlogs directory)
scp scripts/create-newsblogs-tables.sql manprit@72.61.240.156:~/
```

## Step 3: Create Database on VPS

Once connected to the VPS via SSH, run these commands:

```bash
# Connect to PostgreSQL (adjust username if different)
sudo -u postgres psql

# Or if you have a different PostgreSQL user:
psql -U postgres
```

Then in the PostgreSQL prompt:

```sql
-- Create the database
CREATE DATABASE newsblogs;

-- Exit PostgreSQL
\q
```

## Step 4: Run SQL Script

```bash
# Run the SQL script to create tables
psql -U postgres -d newsblogs -f ~/create-newsblogs-tables.sql

# Or if you need to use sudo:
sudo -u postgres psql -d newsblogs -f ~/create-newsblogs-tables.sql
```

## Step 5: Verify Tables Created

```bash
psql -U postgres -d newsblogs -c "\dt"
```

You should see:
- `categories`
- `subcategories`
- `news_blogs`

## Step 6: Update Environment Variables

On your VPS, create or update the `.env` file in your NewsBlogs project:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/newsblogs"
```

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

## Step 7: Generate Prisma Client

```bash
cd /path/to/NewsBlogs
npm install
npx prisma generate
```

## Step 8: Create Admin User

```bash
npm run create-admin
```

## Alternative: Quick Setup Script

If you prefer, you can use the automated setup script:

1. Transfer the script to VPS:
```bash
scp scripts/setup-vps-database.sh manprit@72.61.240.156:~/
```

2. On VPS, make it executable and run:
```bash
chmod +x ~/setup-vps-database.sh
~/setup-vps-database.sh
```

## Troubleshooting

### If PostgreSQL is not installed:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql postgresql-server
```

### If you get permission errors:
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql
```

### To check PostgreSQL version:
```bash
psql --version
```

## Database Connection String Format

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

Example:
```
postgresql://postgres:manprit*@localhost:5432/newsblogs
```

## Next Steps After Setup

1. Update your `.env` file with the correct `DATABASE_URL`
2. Run `npx prisma generate` to generate Prisma client
3. Run `npm run create-admin` to create an admin user
4. Start your application: `npm run dev` or `npm start`





