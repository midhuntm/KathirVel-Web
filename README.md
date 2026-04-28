# Royal Ornaments E-Commerce Platform

This repository contains the full source code for the "Royal Ornaments" e-commerce application—a premium, luxury-themed shopping experience built with React, Redux Toolkit, FastAPI, and MongoDB.

## Features

- **Frontend**: React (Vite), Redux Toolkit (State Management), React Router, Framer Motion (Animations), Stripe Elements (Secure Checkout).
- **Backend**: FastAPI (Python), `passlib` bcrypt (Password Hashing), PyJWT (Authentication), Stripe Python SDK.
- **Database**: MongoDB (Local or Atlas Cloud).
- **Admin**: Dedicated admin dashboard for inviting staff, creating products, and managing users/orders.

## Architecture

The project is structured into two main parts:
- `/` (Root): The frontend Vite application.
- `/backend`: The RESTful FastAPI backend.

---

## Local Development Setup

### 1. Database (MongoDB)
Ensure you have MongoDB running locally on port `27017` or use a MongoDB Atlas connection string.

### 2. Backend Setup
```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```
Start the API:
```bash
uvicorn app.main:app --reload --port 8000
```

#### Python Runtime Note
- Use `Python 3.11` or `3.12` for local backend development.
- `Python 3.14` is not supported by the pinned backend dependency set (notably `pydantic_core==2.27.2`).
- If `.venv` was created in a different folder path and scripts fail with `bad interpreter`, recreate it:
```bash
cd backend
rm -rf .venv
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Frontend Setup
Open a new terminal at the project root.
```bash
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## Production Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Push your code to GitHub.
2. Import the project into Vercel or Netlify.
3. Configure the Build Command: `npm run build`
4. Configure the Output Directory: `dist`
5. Set Environment Variables in the platform:
    - `VITE_API_BASE_URL`: URL of your deployed backend.
    - `VITE_STRIPE_PUBLIC_KEY`: Your Stripe public key.
6. Deploy!

### Backend Deployment (Render / Railway / DigitalOcean)
1. On your preferred platform, point an app to this repository and set the Root Directory to `backend`.
2. Environment: `Python 3.9+`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set Production Environment Variables:
    - `MONGODB_URI`: Production MongoDB Atlas URI.
    - `MONGODB_DB_NAME`: Database name (e.g., `RoyalOrnaments`).
    - `JWT_SECRET`: A secure random string for JWT encoding.
    - `STRIPE_SECRET_KEY`: Your Stripe secret key.
    - `SMTP_*`: Settings for email delivery of Admin Invites.

### Database (MongoDB Atlas)
- Create a cluster on MongoDB Atlas.
- Allowlist your backend's IP address (or `0.0.0.0/0` if necessary).
- Retrieve the connection string and insert it into your backend's `MONGODB_URI`.

---

## Docker Support
You can run the entire application stack using the included `docker-compose.yml`.

```bash
docker-compose up --build
```
This will start:
- MongoDB on port `27017`
- FastAPI Backend on port `8000`
- React Frontend on port `5173`

*(Make sure you update your local environment variables before running docker-compose in production!)*
