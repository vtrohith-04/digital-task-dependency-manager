# Digital Task Dependency Manager

A full-stack MERN application that manages tasks with dependency-aware workflows.

## Tech Stack
- Frontend: React.js
- Backend: Node.js + Express
- Database: MongoDB
- State Management: React Hooks
- API Testing: Postman

## Features
- Create tasks with dependencies
- Detect circular dependencies
- Block tasks until dependency completion
- Smart next task suggestion
- Task analytics with donut chart

## Installation

### Backend
cd backend
npm install
npm start

### Frontend
cd frontend
npm install
npm start

## Environment Variables

Create a .env file inside backend:

MONGO_URI=your_mongodb_connection_string
PORT=5000

## Future Improvements
- User authentication (JWT)
- Search & filtering
- Deployment
