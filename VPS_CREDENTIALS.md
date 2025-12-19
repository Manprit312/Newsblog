# VPS Credentials and Connection Information

## SSH Access

**Host:** `72.61.240.156`  
**Username:** `root`  
**Password:** `Bharat&ai2025`

### Connect via SSH:
```bash
ssh root@72.61.240.156
# Enter password when prompted: Bharat&ai2025
```

## PostgreSQL Database Access

**Host:** `72.61.240.156`  
**Port:** `5432`  
**Database:** `newsblogs`  
**Username:** `postgres`  
**Password:** (Check with your database administrator or see below)

### Connection String Format:
```
postgresql://postgres:PASSWORD@72.61.240.156:5432/newsblogs
```

**Important:** If your PostgreSQL password contains special characters, you must URL-encode them:
- `&` → `%26`
- `*` → `%2A`
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`

### Example:
If PostgreSQL password is `Bharat&ai2025`:
```
postgresql://postgres:Bharat%26ai2025@72.61.240.156:5432/newsblogs
```

## Finding PostgreSQL Password

If you don't know the PostgreSQL password, you can reset it:

```bash
# SSH into the server
ssh root@72.61.240.156

# Switch to postgres user
sudo -u postgres psql

# Change password
ALTER USER postgres WITH PASSWORD 'your_new_password';

# Exit
\q
```

## Environment Variables

### For `.env` file in NewsBlogs:

```env
# Database Connection
# Replace YOUR_POSTGRES_PASSWORD with actual password (URL-encoded)
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@72.61.240.156:5432/newsblogs"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"

# Environment
NODE_ENV=development
```

## Quick Connection Test

### Test SSH:
```bash
ssh root@72.61.240.156
```

### Test PostgreSQL (if password is known):
```bash
psql "postgresql://postgres:YOUR_PASSWORD@72.61.240.156:5432/newsblogs" -c "SELECT 1;"
```

### Test from VPS (local):
```bash
ssh root@72.61.240.156
sudo -u postgres psql -d newsblogs -c "SELECT 1;"
```

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit credentials to Git** - Keep `.env` files in `.gitignore`
2. **Use strong passwords** - Especially for production databases
3. **Limit SSH access** - Consider using SSH keys instead of passwords
4. **Restrict database access** - Configure PostgreSQL to only allow necessary IPs
5. **Use SSL for database connections** in production:
   ```
   DATABASE_URL="postgresql://postgres:PASSWORD@72.61.240.156:5432/newsblogs?sslmode=require"
   ```

## Troubleshooting

### Can't SSH?
- Verify IP address is correct
- Check if SSH service is running on VPS
- Verify firewall allows SSH (port 22)

### Can't connect to database?
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check if PostgreSQL accepts remote connections (see `FIX_DATABASE_CONNECTION.md`)
- Verify firewall allows port 5432
- Check password is correct and URL-encoded

