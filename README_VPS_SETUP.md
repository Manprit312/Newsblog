# Quick VPS Database Setup

## 🚀 Quick Start

### 1. Connect to VPS
```bash
ssh manprit@72.61.240.156
# Password: manprit*
```

### 2. Transfer Files (from local machine)
```bash
# From your local NewsBlogs directory
scp scripts/create-newsblogs-tables.sql manprit@72.61.240.156:~/
scp scripts/setup-vps-database.sh manprit@72.61.240.156:~/
```

### 3. Run Setup on VPS
```bash
# On VPS
chmod +x ~/setup-vps-database.sh
~/setup-vps-database.sh
```

The script will:
- Create `newsblogs` database
- Create all tables (categories, subcategories, news_blogs)
- Show you the connection string

### 4. Update .env File

After setup, update your `.env` file with:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@72.61.240.156:5432/newsblogs"
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

### 6. Create Admin User
```bash
npm run create-admin
```

## 📋 Manual Setup (Alternative)

If the script doesn't work, see `VPS_LIVE_DATABASE_SETUP.md` for manual SQL commands.

## ✅ Verify Setup

```bash
psql "postgresql://postgres:YOUR_PASSWORD@72.61.240.156:5432/newsblogs" -c "\dt"
```

Should show: `categories`, `subcategories`, `news_blogs`





