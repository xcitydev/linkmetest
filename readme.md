# Task Management Application

A full-stack task management system with user authentication and CRUD operations, built with Next.js (frontend) and Node.js/Express (backend).

![Application Preview]()

## Features

### Core Features
- **User Authentication**
  - Secure JWT-based registration/login
  - Password hashing with bcrypt
  - HTTP-only cookie storage for tokens
- **Task Management**
  - Create, Read, Update, Delete tasks
  - View task details (Title, Description, Date)
  - User-specific task isolation
- **Security**
  - Protected API routes
  - Input validation middleware
  - Secure cookie configuration

### Bonus Features
- Password reset functionality via email
- Task completion status tracking
- Responsive UI design

## Technologies

### Frontend
- **Next.js 15** (React framework)
- TypeScript
- Context API for state management
- Axios for API communication
- React Testing Library

### Backend
- **Node.js** (v18+)
- **Express.js** REST API
- MongoDB (Mongoose ODM)
- JWT authentication
- Nodemailer for email services
- Jest/Supertest for testing

## Prerequisites

- Node.js v18+
- MongoDB Atlas account
- PNPM package manager
- Git

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/task-management-app.git
cd task-management-app
```

### 2. Install Dependencies (Frontend)
```bash
cd linkmetest
pnpm install
```

### 3. Install Dependencies (Backend)
```bash
cd server
npm install
```

### 4. Configure Environment Variables (Backend)
```bash
cp .env.example .env

PORT
MONGO_URI
FRONTEND_URL
JWT_SECRET
EMAIL_USER
EMAIL_PASS

```


### 5. Start the Application (Frontend)
```bash
cd linkmetest
pnpm dev
```

### 6. Start the Application (Backend)
```bash
cd server
node index.js
```


note: the application backend is running on port 3000 while the frontend is running on port 3001



