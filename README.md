# NewsBlogs - A Modern Blog Website

A modern, responsive blog website built with Next.js, TypeScript, and PostgreSQL, featuring a yellow and blue color scheme and a comprehensive admin panel.

## Features

- 🎨 Modern UI with yellow and blue color scheme
- 📝 Rich text editor for blog content
- 🖼️ Cloudinary integration for image management
- 👨‍💼 Full-featured admin panel
- 📱 Fully responsive design
- 🔍 SEO-friendly blog posts
- ⚡ Fast and optimized with Next.js 14

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma
- **Image Storage**: Cloudinary
- **Rich Text Editor**: React Quill

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)
- Cloudinary account

### Installation

1. Clone the repository:
```bash
cd NewsBlogs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/newsblogs?schema=public"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret (optional for future auth)
JWT_SECRET=your_jwt_secret_key_here
```

4. Set up the database:
```bash
# Generate Prisma Client
npm run postinstall

# Push schema to database
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
NewsBlogs/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── api/            # API routes
│   ├── blog/           # Blog detail pages
│   ├── blogs/          # Blog listing page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable components
├── lib/                # Utility functions
├── prisma/             # Prisma schema and migrations
└── public/             # Static assets
```

## Admin Panel

Access the admin panel at `/admin` to:
- View dashboard with blog statistics
- Create, edit, and delete blogs
- Upload images via Cloudinary
- Manage blog categories and tags
- Publish/unpublish blogs
- Mark blogs as featured

## Features in Detail

### Blog Management
- Create and edit blog posts with rich text editor
- Upload featured images via Cloudinary
- Organize blogs by categories
- Add tags to blogs
- Publish/draft functionality
- Featured blog highlighting

### Public Website
- Homepage with featured blog
- Blog listing page
- Individual blog detail pages
- Related blogs section
- Responsive navigation
- SEO-optimized pages

## Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

For deployment on platforms like Vercel, make sure to:
- Set all environment variables in the platform's dashboard
- Ensure PostgreSQL is accessible from the deployment platform
- Run `npm run db:push` or migrations to set up the database schema
- Configure Cloudinary settings correctly

## License

MIT

# Newsblog
