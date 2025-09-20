#!/bin/sh

set -e

echo "Starting database for build..."
docker compose up -d db

docker-compose build next

echo "Running the application build..."
docker compose run --rm next npx prisma generate
docker compose run --rm next npm run deploy
docker compose run --rm next npm run build

echo "Building the final application image..."

echo "Stopping the database..."
docker compose down

echo "Build process completed successfully!"