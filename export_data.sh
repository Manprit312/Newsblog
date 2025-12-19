#!/bin/bash
# Export script for migrating data from newsblogs_prisma to newsblogs_db
# Usage: ./export_data.sh

echo "Exporting data from newsblogs_prisma database..."

# Export Blog data to JSON
sshpass -p 'manprit*' ssh -o StrictHostKeyChecking=no manprit@72.61.240.156 \
  "echo 'manprit*' | sudo -S -u postgres psql -d newsblogs_prisma -t -A -F',' -c \"SELECT id, title, slug, excerpt, content, \"featuredImage\", category, tags, author, published, featured, views, \"createdAt\", \"updatedAt\" FROM \\\"Blog\\\";\" > /tmp/blogs_export.csv"

# Download the export
scp -o StrictHostKeyChecking=no manprit@72.61.240.156:/tmp/blogs_export.csv ./blogs_export.csv

echo "Export complete! Data saved to blogs_export.csv"

