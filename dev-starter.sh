#!/bin/bash

# Copy .env.example into .env
cp .env.example .env

# Start the containers
echo "Starting containers..."
docker compose up -d

# Wait a moment for the containers to start
echo "Waiting for containers to initialize..."
sleep 5

# Apply migrations
echo "Applying database migrations and running the seed file..."
npx prisma db push
npx prisma db seed

# Generate key pairs
./generate-keys.sh