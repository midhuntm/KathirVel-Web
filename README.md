# KathirVel Web

This project now has:

- A React frontend with a top-right login button
- A Python `FastAPI` backend
- MongoDB APIs for `users` and `ornaments`
- A frontend dashboard that reads both lists from the backend

## Frontend

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` requests to the Python backend on port `8000`.

## Backend

Create a virtual environment and install requirements:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Set MongoDB configuration:

```bash
cp .env.example .env
```

Then start the API:

```bash
uvicorn app.main:app --reload --port 8000
```

## MongoDB collections

Database name default: `KathirVel`

Collections used:

- `user`
- `ornaments`

Example user document:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

Customer example:

```json
{
  "name": "Sample Customer",
  "email": "customer@example.com",
  "password": "customer123",
  "role": "customer"
}
```

Example ornament document:

```json
{
  "name": "Temple Gold Necklace",
  "price": 2450,
  "category": "Bridal",
  "image": "/hero-ornament.png",
  "description": "Traditional bridal ornament"
}
```

## API endpoints

- `GET /api/health`
- `GET /api/users`
- `POST /api/users`
- `POST /api/login`
- `POST /api/admin/invite`
- `GET /api/ornaments`
- `POST /api/ornaments`

## Notes

- Login currently checks `email` and `password` directly from MongoDB for a simple starter system.
- Public sign up always stores new users as `customer`.
- Only a logged-in `admin` can create an admin invite by email.
- Admin email sending works when `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_SENDER_EMAIL` are set.
- For production, passwords should be hashed before storage.
