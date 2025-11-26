#!/bin/bash
set -e

# ========= SETUP =========
APP_DIR="$(pwd)"
FRONTEND_DIR="${APP_DIR}/myapp-frontend"
BACKEND_DIR="${APP_DIR}/myapp-backend"
echo "🚀 Starting deployment from $(pwd)"

# ========= SYSTEM_UPDATE =========
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y curl git nginx build-essential python3-venv

# ========= NODE_INSTALL =========
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# ========= PM2_INSTALL =========
sudo npm install -g pm2

# ========= BACKEND_SETUP =========
echo "⚙️ Setting up Node.js (Express) backend..."
cd "$BACKEND_DIR" || exit 1
npm install
if [ ! -f .env ]; then echo "❌ .env not found." && exit 1; fi
pm2 start index.js --name myapp-backend --update-env

# ========= FRONTEND_SETUP =========
echo "⚙️ Building React frontend..."
cd "$FRONTEND_DIR" || exit 1
npm install 
npm run build

# ========= NGINX_CONFIG =========
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/
echo "⚙️ Configuring nginx..."
sudo tee /etc/nginx/sites-available/univ_app >/dev/null <<NGINX
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX
sudo ln -sf /etc/nginx/sites-available/univ_app /etc/nginx/sites-enabled/univ_app
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

# ========= PM2_REBOOT_SETUP =========
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# ========= DEPLOYMENT_COMPLETE =========
echo "✅ Deployment completed!"
