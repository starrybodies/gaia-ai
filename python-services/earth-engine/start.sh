#!/bin/bash
# Start the Earth Engine Python API service

# Load environment variables
if [ -f "../../.env.local" ]; then
    export $(grep -v '^#' ../../.env.local | xargs)
fi

# Activate virtual environment
source venv/bin/activate

# Start Flask app
echo "[EARTH ENGINE SERVICE] Starting on port 5001..."
python3 app.py
