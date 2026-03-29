#!/bin/bash

# Blog Platform - Quick Start Script
# This script sets up the entire project for local development

echo "🚀 Blog Platform - Quick Setup"
echo "================================\n"

# Backend Setup
echo "📦 Setting up Backend..."
cd backend
cp .env.example .env
npm install
echo "✅ Backend setup complete\n"

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../frontend
cp .env.example .env
npm install
echo "✅ Frontend setup complete\n"

# Return to root
cd ..

echo "✅ All setup complete!"
echo "\n📝 Next steps:"
echo "1. Edit backend/.env with your MongoDB URI"
echo "2. In one terminal: cd backend && npm run dev"
echo "3. In another terminal: cd frontend && npm run dev"
echo "4. Optional - seed data: cd backend && npm run seed"
echo "\n🌐 App will be available at http://localhost:3000 when ready\n"
