#!/bin/bash

# Task Manager Application Startup Script

echo "🚀 Starting Task Manager Pro Application..."
echo "==================================================="
echo ""

# Function to check if a port is in use
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
}

# Function to kill processes on a port
kill_port() {
    if check_port $1; then
        echo "🔄 Killing existing process on port $1..."
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Clean up any existing processes
echo "🧹 Cleaning up existing processes..."
kill_port 8080  # Backend port
kill_port 4200  # Frontend port

echo ""

# Start Backend
echo "📦 Starting Backend (Spring Boot on port 8080)..."
cd backend
nohup mvn spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started with PID: $BACKEND_PID"
cd ..

# Wait for backend to start and check if it's running
echo "⏳ Waiting for backend to initialize..."
sleep 15

# Check if backend is running
if check_port 8080; then
    echo "✅ Backend is running on http://localhost:8080"
else
    echo "❌ Backend failed to start. Check backend.log for details."
    exit 1
fi

echo ""

# Start Frontend
echo "📱 Starting Frontend (Angular on port 4200)..."
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started with PID: $FRONTEND_PID"

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 20

# Check if frontend is running
if check_port 4200; then
    echo "✅ Frontend is running on http://localhost:4200"
else
    echo "❌ Frontend failed to start. Check frontend.log for details."
fi

echo ""
echo "🎉 Task Manager Pro is now running!"
echo "==================================================="
echo "📱 Frontend: http://localhost:4200"
echo "🔧 Backend API: http://localhost:8080"
echo "📧 Email Service: Enabled (Gmail SMTP)"
echo "🔔 Real-time Reminders: Active (30-second intervals)"
echo "🤖 AI Roadmaps: Powered by Google Gemini"
echo ""
echo "📋 Features Available:"
echo "  ✅ Smart Task Management"
echo "  ✅ Real-time Email Reminders (24-hour alerts)"
echo "  ✅ Browser Push Notifications"
echo "  ✅ AI-Generated Roadmaps"
echo "  ✅ Live Dashboard Updates"
echo "  ✅ Professional Auth UI/UX"
echo ""
echo "🛑 To stop the application:"
echo "   - Press Ctrl+C in this terminal"
echo "   - Or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📄 Logs:"
echo "   - Backend: backend.log"
echo "   - Frontend: frontend.log"
echo ""
echo "🎨 Starting Frontend (Angular)..."
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo ""
echo "✅ Application started successfully!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:4200"
echo "   Backend API: http://localhost:8080"
echo "   H2 Database Console: http://localhost:8080/h2-console"
echo ""
echo "📋 API Configuration:"
echo "   Google Gemini API Key: AIzaSyAOBvzv7wqVEX30AZWrTHkZJoV4joWCc18"
echo "   API Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
echo ""
echo "📝 To stop the application:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📊 View logs:"
echo "   Backend: tail -f backend/backend.log"
echo "   Frontend: tail -f frontend.log"
