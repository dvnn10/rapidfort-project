#!/bin/bash

# run-containers.sh

# Variables
BACKEND_IMAGE="your-dockerhub-username/word-to-pdf-backend:latest"
FRONTEND_IMAGE="your-dockerhub-username/word-to-pdf-frontend:latest"

# Pull the latest images
echo "Pulling the latest backend image..."
docker pull $BACKEND_IMAGE

echo "Pulling the latest frontend image..."
docker pull $FRONTEND_IMAGE

# Stop and remove existing containers if they exist
echo "Stopping and removing existing containers if any..."
docker stop word-to-pdf-backend || true
docker rm word-to-pdf-backend || true
docker stop word-to-pdf-frontend || true
docker rm word-to-pdf-frontend || true

# Run the backend container
echo "Running backend container..."
docker run -d \
  --name word-to-pdf-backend \
  -p 5000:5000 \
  $BACKEND_IMAGE

# Run the frontend container, linking to the backend
echo "Running frontend container..."
docker run -d \
  --name word-to-pdf-frontend \
  -p 80:80 \
  --link word-to-pdf-backend:backend \
  $FRONTEND_IMAGE

echo "Containers are up and running."
