#!/bin/bash

# Test Reply Email Endpoint
# Usage: ./test-reply-endpoint.sh

API_URL="https://afterglow-music-api.afterglowmusic.workers.dev"

echo "Testing Reply Email Endpoint..."
echo "================================"
echo ""

# Test with sample data
curl -X POST "${API_URL}/api/submissions/1/reply" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Re: Test Song - Afterglow Music",
    "message": "Hi there,\n\nThis is a test reply.\n\nBest regards,\nAfterflow Music Team"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "================================"
echo "Check the console output above for:"
echo "1. HTTP Status 200 = Success"
echo "2. Error message if failed"
echo ""
echo "To see worker logs:"
echo "cd workers && npx wrangler tail"
