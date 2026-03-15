# SyntecxHub Expense Tracker

A full-stack personal finance tracker for managing income, expenses, categories, and user settings.

## Live App

- https://syntecxhub-expense-tracker-fu54.vercel.app/

## Project Structure

- backend: Express + MongoDB API (auth, transactions, categories, settings)
- frontend: React + Vite client app

## Tech Stack

### Frontend

- React 19
- Vite 8
- MUI (Material UI)
- Axios
- Recharts
- XLSX

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS + Morgan

## Features

- User signup and login with JWT authentication
- Income and expense transaction management
- Category management
- User settings management
- Dashboard charts and summaries
- Export support (XLSX)

## Local Development Setup

## 1) Clone and Install

```bash
git clone https://github.com/shakib-mehrab/Syntecxhub_expenseTracker.git
cd Syntecxhub_expenseTracker

npm install --prefix backend
npm install --prefix frontend
```

## 2) Environment Variables

Create a file named `.env` inside `backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLIENT_URL_PROD=https://syntecxhub-expense-tracker-fu54.vercel.app
```

Optional: create `.env` inside `frontend`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_DEMO_MODE=true
```

If `VITE_API_URL` is not set, frontend defaults to `/api`.

## 3) Run the App

Start backend:

```bash
npm run dev --prefix backend
```

Start frontend:

```bash
npm run dev --prefix frontend
```

Frontend default URL: http://localhost:5173

## Production Build

Build frontend:

```bash
npm run build --prefix frontend
```

Run backend in production mode:

```bash
npm run start --prefix backend
```

## API Health Check

- GET /api/health

Example local URL:

- http://localhost:5000/api/health

## Scripts

### Backend

- `npm run dev` - start backend with nodemon
- `npm run start` - start backend with node

### Frontend

- `npm run dev` - start Vite dev server
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Deployment

- Frontend and backend are deployed on Vercel.
- The frontend communicates with API routes under `/api`.
