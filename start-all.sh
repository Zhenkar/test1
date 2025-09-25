#!/bin/bash

# Exit on any error
set -e

echo "=== Starting Nginx ==="
sudo systemctl start nginx

# Optional: check Nginx status
sudo systemctl status nginx | head -n 5

echo "=== Starting Backend (Node.js) ==="
cd /home/sat24/Documents/capstone/artgallary/DigitalArtGallery_Backend
# Use nohup so backend keeps running even after terminal closes
nohup npm start > backend.log 2>&1 &

echo "=== Backend started. Logs: backend.log ==="

echo "=== Starting Frontend (React) ==="
cd /home/sat24/Documents/capstone/artgallary/DigitalArtGallery_Frontend
# Serve build folder using a simple Node static server (if not using Nginx directly)
npx serve -s build -l 5000 &

echo "=== Frontend started on http://localhost:5000 ==="
echo "=== All services are running ==="
