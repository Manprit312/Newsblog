# Photos Upload & 3-Level Structure Setup

## ✅ What's Been Implemented

### 1. **3-Level Structure for NewsBlogs**

#### **LEVEL 1 → Header Categories (Main Navigation)**
- These appear directly in the header navigation
- Managed in Admin → Categories
- Examples: National, State, Politics, Business, World, Sports, etc.
- Maximum 10-15 categories recommended

#### **LEVEL 2 → Header Dropdown Subcategories**
- These appear when user hovers/clicks a main category
- Managed in Admin → Categories → [Category] → Subcategories
- Examples: 
  - National → Breaking News, Trending News, Big Stories
  - State → Uttar Pradesh, Bihar, Delhi NCR
  - Politics → Elections, Government Policies, Parliament

#### **LEVEL 3 → Editorial Categories (Blog Categories)**
- Content-focused categories for editorial organization
- Selected in Blog Form → "Editorial Category" dropdown
- Pre-defined list:
  - Trending News
  - Breaking News
  - Badi Khabre
  - Rajya Khabre
  - Desh Khabre
  - Election Special
  - Exclusive Report
  - Ground Report
  - Fact Check
  - Explainers
  - Analysis
  - Opinion / Editorial
  - Special Stories
  - Viral News
  - Good News

### 2. **Multiple Photos Upload for Blogs**

- ✅ Added `photos` field to Blog schema (text[] array)
- ✅ Created `MultipleImageUpload` component
- ✅ Updated BlogForm to include photos upload
- ✅ Updated API routes to handle photos
- ✅ Maximum 10 photos per blog

## 📋 Setup Instructions

### Step 1: Add Photos Column to Database

Run this SQL script to add the `photos` column:

```bash
cd NewsBlogs
psql $DATABASE_URL -f scripts/add-photos-column.sql
```

Or manually run:
```sql
ALTER TABLE news_blogs 
ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_news_blogs_photos ON news_blogs USING GIN (photos);
```

### Step 2: Update Prisma Schema

The schema has been updated. Run:

```bash
cd NewsBlogs
npx prisma generate
```

### Step 3: Create Categories (Level 1)

1. Go to Admin → Categories
2. Create main navigation categories:
   - Home
   - National (देश)
   - State (राज्य)
   - Politics
   - Business
   - World
   - Sports
   - Entertainment
   - Technology
   - Lifestyle
   - Education
   - Jobs
   - Opinion
   - Video
   - Photos

### Step 4: Create Subcategories (Level 2)

1. Go to Admin → Categories → [Select Category]
2. Click "Add Subcategory"
3. Add subcategories for each main category

**Example for National:**
- Breaking News
- Trending News
- Big Stories
- Exclusive
- Crime
- Social Issues

**Example for State:**
- Uttar Pradesh
- Bihar
- Delhi NCR
- Maharashtra
- Rajasthan
- Madhya Pradesh

### Step 5: Use in Blog Creation

When creating/editing a blog:

1. **Level 1 & 2**: Select Category and Subcategory (appears in header navigation)
2. **Level 3**: Select Editorial Category from dropdown (for content organization)
3. **Photos**: Upload multiple photos (up to 10) using the "Blog Photos" section

## 🎨 Features

### Multiple Image Upload Component
- Upload up to 10 photos per blog
- Preview all uploaded photos
- Remove individual photos
- Replace individual photos
- Grid layout for photo preview

### Blog Form Updates
- Featured Image (single) - for main blog image
- Blog Photos (multiple) - for additional photos in the blog
- Editorial Category dropdown - Level 3 categorization
- Category & Subcategory selection - Level 1 & 2

## 📝 Notes

- Photos are stored as an array of Cloudinary URLs
- Editorial categories are added to tags automatically
- The 3-level structure allows for:
  - **Level 1**: Main site navigation
  - **Level 2**: Detailed navigation within categories
  - **Level 3**: Content organization and filtering

## 🔄 Next Steps

1. Run the database migration script
2. Create your main categories (Level 1)
3. Add subcategories (Level 2)
4. Start creating blogs with photos and editorial categories!



