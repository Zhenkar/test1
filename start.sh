#!/bin/bash

# Exit on any error
set -e

# Paths
FRONTEND_DIST="/home/sat24/Documents/capstone/artgallary/DigitalArtGallery_interface/dist"
NGINX_SITE="/etc/nginx/sites-available/artgallery"

echo "=== Creating Nginx config for Art Gallery ==="

# Write Nginx config
sudo tee $NGINX_SITE > /dev/null <<EOL
server {
    listen 80;
    server_name localhost;

    # Serve React frontend build
    root $FRONTEND_DIST;
    index index.html;

    # Frontend routes (React SPA)
    location / {
        try_files \$uri /index.html;
    }

    # Reverse proxy for backend API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

echo "=== Enabling site ==="
sudo ln -sf $NGINX_SITE /etc/nginx/sites-enabled/artgallery

echo "=== Testing Nginx config ==="
sudo nginx -t

echo "=== Reloading Nginx ==="
sudo systemctl reload nginx

echo "=== Nginx is now serving frontend and reverse proxy for backend ==="
echo "Frontend: http://localhost"
echo "Backend API: http://localhost/api"
