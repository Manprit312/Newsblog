#!/bin/bash
# Setup script for newsblogs_db database
# This script will help set up the database with proper permissions

echo "Setting up newsblogs_db database..."

# Connect and grant permissions
sshpass -p 'manprit*' ssh -o StrictHostKeyChecking=no manprit@72.61.240.156 << 'EOF'
echo "manprit*" | sudo -S -u postgres psql -d newsblogs_db << SQL
-- Grant schema permissions
GRANT USAGE ON SCHEMA public TO newsblogs_user;
GRANT CREATE ON SCHEMA public TO newsblogs_user;
ALTER SCHEMA public OWNER TO newsblogs_user;

-- Grant default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO newsblogs_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO newsblogs_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO newsblogs_user;

-- Verify permissions
\du newsblogs_user
\dn
SQL
EOF

echo "Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Set DATABASE_URL=postgresql://newsblogs_user:newsblogs2024@72.61.240.156:5432/newsblogs_db"
echo "2. Run: npx prisma migrate dev"
echo "3. Run: npx prisma generate"










