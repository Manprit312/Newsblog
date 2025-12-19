#!/bin/bash

# PostgreSQL Configuration Checker
# Run this on the VPS: ssh root@72.61.240.156
# Password: Bharat&ai2025

echo "=========================================="
echo "PostgreSQL Configuration Checker"
echo "=========================================="
echo ""

# Check if PostgreSQL is running
echo "1. Checking PostgreSQL service status..."
if systemctl is-active --quiet postgresql; then
    echo "   ✅ PostgreSQL is running"
    systemctl status postgresql --no-pager -l | head -5
else
    echo "   ❌ PostgreSQL is NOT running"
    echo "   Run: sudo systemctl start postgresql"
fi
echo ""

# Find PostgreSQL config file
echo "2. Finding PostgreSQL configuration files..."
CONFIG_FILE=$(sudo -u postgres psql -t -c "SHOW config_file;" 2>/dev/null | xargs)
HBA_FILE=$(sudo -u postgres psql -t -c "SHOW hba_file;" 2>/dev/null | xargs)

if [ -n "$CONFIG_FILE" ]; then
    echo "   ✅ Config file: $CONFIG_FILE"
else
    echo "   ⚠️  Could not find config file (might need sudo)"
    CONFIG_FILE="/etc/postgresql/14/main/postgresql.conf"
    echo "   Trying common location: $CONFIG_FILE"
fi

if [ -n "$HBA_FILE" ]; then
    echo "   ✅ HBA file: $HBA_FILE"
else
    echo "   ⚠️  Could not find HBA file (might need sudo)"
    HBA_FILE="/etc/postgresql/14/main/pg_hba.conf"
    echo "   Trying common location: $HBA_FILE"
fi
echo ""

# Check listen_addresses
echo "3. Checking listen_addresses configuration..."
if [ -f "$CONFIG_FILE" ]; then
    LISTEN_ADDR=$(sudo grep -E "^listen_addresses" "$CONFIG_FILE" | grep -v "^#" | awk '{print $3}' | tr -d "'")
    if [ "$LISTEN_ADDR" = "*" ]; then
        echo "   ✅ listen_addresses = '*' (accepting remote connections)"
    else
        echo "   ❌ listen_addresses = '$LISTEN_ADDR' (NOT accepting remote connections)"
        echo "   Fix: Change to listen_addresses = '*' in $CONFIG_FILE"
    fi
else
    echo "   ⚠️  Cannot read config file (need sudo access)"
fi
echo ""

# Check port
echo "4. Checking port configuration..."
if [ -f "$CONFIG_FILE" ]; then
    PORT=$(sudo grep -E "^port" "$CONFIG_FILE" | grep -v "^#" | awk '{print $3}')
    if [ -n "$PORT" ]; then
        echo "   ✅ Port: $PORT"
    else
        echo "   ⚠️  Port not explicitly set (default: 5432)"
    fi
else
    echo "   ⚠️  Cannot read config file"
fi
echo ""

# Check pg_hba.conf for remote access
echo "5. Checking pg_hba.conf for remote access rules..."
if [ -f "$HBA_FILE" ]; then
    REMOTE_RULES=$(sudo grep -E "^host" "$HBA_FILE" | grep -v "^#" | wc -l)
    if [ "$REMOTE_RULES" -gt 0 ]; then
        echo "   ✅ Found $REMOTE_RULES remote access rule(s):"
        sudo grep -E "^host" "$HBA_FILE" | grep -v "^#" | while read line; do
            echo "      $line"
        done
    else
        echo "   ❌ No remote access rules found"
        echo "   Fix: Add 'host all all 0.0.0.0/0 md5' to $HBA_FILE"
    fi
else
    echo "   ⚠️  Cannot read HBA file (need sudo access)"
fi
echo ""

# Check if PostgreSQL is listening on the right interface
echo "6. Checking network listeners..."
LISTENING=$(sudo netstat -tlnp 2>/dev/null | grep 5432 || sudo ss -tlnp | grep 5432)
if echo "$LISTENING" | grep -q "0.0.0.0:5432\|:::5432"; then
    echo "   ✅ PostgreSQL is listening on all interfaces (0.0.0.0:5432)"
    echo "$LISTENING" | grep 5432
elif echo "$LISTENING" | grep -q "127.0.0.1:5432"; then
    echo "   ❌ PostgreSQL is ONLY listening on localhost (127.0.0.1:5432)"
    echo "   Fix: Set listen_addresses = '*' in postgresql.conf and restart"
else
    echo "   ⚠️  Could not determine listening interface"
    echo "$LISTENING"
fi
echo ""

# Check firewall
echo "7. Checking firewall status..."
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status | grep -i "Status:")
    echo "   $UFW_STATUS"
    if sudo ufw status | grep -q "5432"; then
        echo "   ✅ Port 5432 is allowed in UFW"
    else
        echo "   ❌ Port 5432 is NOT allowed in UFW"
        echo "   Fix: sudo ufw allow 5432/tcp"
    fi
elif command -v firewall-cmd &> /dev/null; then
    if sudo firewall-cmd --list-ports | grep -q "5432"; then
        echo "   ✅ Port 5432 is allowed in firewalld"
    else
        echo "   ❌ Port 5432 is NOT allowed in firewalld"
        echo "   Fix: sudo firewall-cmd --permanent --add-port=5432/tcp && sudo firewall-cmd --reload"
    fi
else
    echo "   ⚠️  No firewall tool detected (ufw/firewalld)"
fi
echo ""

# Test local connection
echo "8. Testing local database connection..."
if sudo -u postgres psql -d newsblogs -c "SELECT 1;" &> /dev/null; then
    echo "   ✅ Can connect to newsblogs database locally"
    DB_EXISTS=$(sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -w newsblogs | wc -l)
    if [ "$DB_EXISTS" -eq 1 ]; then
        echo "   ✅ newsblogs database exists"
    else
        echo "   ❌ newsblogs database does NOT exist"
    fi
else
    echo "   ❌ Cannot connect to database locally"
fi
echo ""

# Summary
echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""
echo "To fix remote connection issues:"
echo ""
echo "1. Edit postgresql.conf:"
echo "   sudo nano $CONFIG_FILE"
echo "   Set: listen_addresses = '*'"
echo ""
echo "2. Edit pg_hba.conf:"
echo "   sudo nano $HBA_FILE"
echo "   Add: host all all 0.0.0.0/0 md5"
echo ""
echo "3. Restart PostgreSQL:"
echo "   sudo systemctl restart postgresql"
echo ""
echo "4. Allow firewall port:"
echo "   sudo ufw allow 5432/tcp"
echo "   # or"
echo "   sudo firewall-cmd --permanent --add-port=5432/tcp && sudo firewall-cmd --reload"
echo ""
echo "5. Test connection from your local machine:"
echo "   psql -h 72.61.240.156 -U postgres -d newsblogs"
echo ""


