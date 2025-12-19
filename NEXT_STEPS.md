# Next Steps - NewsBlogs Setup Guide

## ✅ Completed Steps

1. ✅ Database connection configured
2. ✅ Database tables created (categories, subcategories, news_blogs)
3. ✅ Sample data seeded
4. ✅ Prisma Client generated

## 🚀 Next Steps

### Step 1: Verify Database Connection

Test that your application can connect to the database:

```bash
cd /Users/rupindersingh/manprit-workspace/Services/NewsBlogs
npm run dev
```

Visit: `http://localhost:3000` to see your blog homepage.

### Step 2: Check Your Data

You should now have:
- **7 Categories**: National, State, Politics, Business, Sports, Entertainment, Technology
- **6 Subcategories**: Breaking News, Trending News, Uttar Pradesh, Delhi NCR, Elections, Markets
- **4 Sample Blog Posts**: Ready to display on your site

### Step 3: Access Admin Panel

1. Navigate to: `http://localhost:3000/admin/login`
2. You'll need to create an admin user first (see Step 4)

### Step 4: Create Admin User

Run the admin creation script:

```bash
cd /Users/rupindersingh/manprit-workspace/Services/NewsBlogs
npm run create-admin
```

Or with custom credentials:

```bash
node scripts/create-admin.js admin@newsblogs.com admin123 "Admin User" admin admin
```

**Default credentials:**
- Email: `admin@example.com`
- Password: `admin123`

### Step 5: Start Using Your Application

#### Public Pages:
- **Homepage**: `http://localhost:3000`
- **Blogs List**: `http://localhost:3000/blogs`
- **Individual Blog**: `http://localhost:3000/blog/[slug]`

#### Admin Panel:
- **Login**: `http://localhost:3000/admin/login`
- **Dashboard**: `http://localhost:3000/admin/dashboard`
- **Manage Blogs**: `http://localhost:3000/admin/blogs`
- **Manage Categories**: `http://localhost:3000/admin/categories`

### Step 6: Customize Your Content

1. **Add More Categories**: Use the admin panel or API
2. **Create Blog Posts**: Use the rich text editor in admin panel
3. **Upload Images**: Configure Cloudinary (already in .env)
4. **Customize Styling**: Edit `app/globals.css` and components

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema changes to database
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run prisma:migrate   # Run migrations

# Admin
npm run create-admin     # Create admin user
```

## 🔧 Environment Variables

Your `.env` file is configured with:

```env
DATABASE_URL="postgresql://newsblogs_user:newsblogs2024@72.61.240.156:5432/newsblogs_db?sslmode=require"
DIRECT_URL="postgresql://newsblogs_user:newsblogs2024@72.61.240.156:5432/newsblogs_db?sslmode=require"
SHADOW_DATABASE_URL="postgresql://newsblogs_user:newsblogs2024@72.61.240.156:5432/newsblogs_shadow?sslmode=require"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=dylwallze
CLOUDINARY_API=448792944728376
CLOUDINARY_API_SECRET=pNLvplH25u-YY86oVjcggrPjkdo

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

## 🐛 Troubleshooting

### Database Connection Issues

If you get connection errors:

1. **Check .env file**: Make sure DATABASE_URL is correct
2. **Test connection**: 
   ```bash
   PGPASSWORD=newsblogs2024 psql "postgresql://newsblogs_user:newsblogs2024@72.61.240.156:5432/newsblogs_db?sslmode=require" -c "SELECT 1;"
   ```
3. **Verify server is running**: The PostgreSQL server should be accessible

### Admin Login Issues

If you can't login:

1. **Create admin user**: Run `npm run create-admin`
2. **Check database**: Verify the `admins` table exists (if using shared admin system)
3. **Check JWT_SECRET**: Make sure it's set in .env

### Build Errors

If you get build errors:

1. **Regenerate Prisma Client**: `npm run prisma:generate`
2. **Clear .next folder**: `rm -rf .next`
3. **Reinstall dependencies**: `rm -rf node_modules && npm install`

## 📚 Useful Commands

### View Database in Prisma Studio

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables
- Edit data directly
- See relationships

### Check Database Status

```bash
# Connect to database
PGPASSWORD=newsblogs2024 psql "postgresql://newsblogs_user:newsblogs2024@72.61.240.156:5432/newsblogs_db?sslmode=require"

# Then run:
\dt                    # List all tables
SELECT * FROM categories;
SELECT * FROM news_blogs;
```

## 🎯 What You Can Do Now

1. ✅ **View your blog**: Start the dev server and visit `http://localhost:3000`
2. ✅ **Create admin account**: Run `npm run create-admin`
3. ✅ **Add more content**: Use the admin panel to create blogs
4. ✅ **Customize categories**: Add/edit categories and subcategories
5. ✅ **Upload images**: Use Cloudinary integration for blog images

## 🚀 Deployment (When Ready)

When you're ready to deploy:

1. **Vercel**: Connect your GitHub repo and deploy
2. **Update DATABASE_URL**: Use the same connection string in Vercel environment variables
3. **Set Cloudinary vars**: Add Cloudinary credentials to Vercel
4. **Deploy**: Push to main branch or use Vercel CLI

---

**You're all set!** 🎉 Your NewsBlogs application is ready to use.

