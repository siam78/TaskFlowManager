# TaskFlow Manager — Backend (Express + MongoDB + Mongoose)

Quick start:

```bash
cd taskflow-backend
cp .env.example .env   # optional
npm install
npm run dev
```

The API will run on http://localhost:5000 with the following routes:
- POST /api/tasks
- GET /api/tasks
- DELETE /api/tasks/:id
- PATCH /api/tasks/:id