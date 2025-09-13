#!/bin/bash

# Setup script for BBUI environment

echo "🔧 Setting up BBUI environment..."

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Skipping creation."
else
    # Copy .env.example to .env
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo ""
    echo "📝 Next steps:"
    echo "1. Edit .env and add your Supabase credentials:"
    echo "   - VITE_SUPABASE_URL: Your Supabase project URL"
    echo "   - VITE_SUPABASE_ANON_KEY: Your Supabase anon key"
    echo ""
    echo "2. Get these values from:"
    echo "   https://app.supabase.com/project/_/settings/api"
    echo ""
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "📦 Dependencies already installed."
else
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "✨ Setup complete! Run 'npm run dev' to start the development server."