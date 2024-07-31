#!/bin/bash

# Start the test containers
echo "Starting test containers..."
docker compose -f test-compose.yml up -d

# Wait a moment for the containers to start
echo "Waiting for containers to initialize..."
sleep 5

# Apply migrations
echo "Applying database migrations..."
npx dotenv -e .env.test -- npx prisma db push

# Run test seed
echo "Running seed file..."
npx dotenv -e .env.test -- ts-node prisma/seeds/testSeed.ts