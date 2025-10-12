#!/bin/bash
set -e

# -------------------------------
# Update & install dependencies
# -------------------------------
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y curl git nginx

# Install Node.js (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

# Install PM2 globally
sudo npm install -g pm2

# -------------------------------
# Setup Application
# -------------------------------
APP_DIR="/home/ubuntu/app"
FRONTEND_DIR="$APP_DIR/myapp-frontend"
BACKEND_DIR="$APP_DIR/myapp-backend"

# Ensure app folder exists
mkdir -p $APP_DIR
cd $APP_DIR

# (If project is in GitHub, clone it — replace with your repo URL)
# git clone https://github.com/yourusername/your-repo.git $APP_DIR

# -------------------------------
# Backend setup
# -------------------------------
cd $BACKEND_DIR
npm install

# Start backend with PM2 (adjust your backend entry file if different)
cd /home/ubuntu/app/myapp-backend

# Start backend with PM2 (using npm start)
pm2 start npm --name myapp-backend -- start
pm2 save

# -------------------------------
# Frontend setup
# -------------------------------
cd $FRONTEND_DIR
npm install
npm run build

# Copy build to nginx web root
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# -------------------------------
# Nginx setup
# -------------------------------

sudo systemctl restart nginx

echo "---------------------------------"
echo "🚀 Application setup complete!"
echo "Frontend available on http://<EC2-Public-IP>/"
echo "Backend proxied at http://<EC2-Public-IP>/api/"
echo "---------------------------------"
