# Digital Agriculture Support System

A full-stack web application empowering farmers with crop recommendations, government scheme access, complaint management, and weather insights.

## Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion, Recharts, Lucide Icons
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT with bcrypt password hashing
- **DevOps:** Docker, Docker Compose, GitHub Actions CI/CD

## Features

- JWT authentication with role-based access (Farmer / Admin)
- Farmer dashboard with weather info, stats, and notifications
- Crop recommendation engine based on soil type, season, and region
- Complaint/support system with image uploads and status tracking
- Government schemes listing with apply functionality
- Admin panel: manage users, complaints, and schemes
- Responsive design with smooth animations

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Docker)

### Development

```bash
# Backend
cd server
cp .env.example .env
npm install
npm run dev

# Frontend (separate terminal)
cd client
npm install
npm run dev
```

### Docker

```bash
docker compose up --build
```

The app will be available at:
- Frontend: http://localhost (port 80)
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/profile | Yes | Get profile |
| POST | /api/crops/recommend | Yes | Get crop suggestions |
| GET | /api/weather | Yes | Get weather data |
| POST | /api/complaints | Yes | Create complaint |
| GET | /api/complaints/my | Yes | My complaints |
| GET | /api/schemes | Yes | List schemes |
| POST | /api/schemes/:id/apply | Yes | Apply to scheme |
| GET | /api/users | Admin | List all users |
| PATCH | /api/complaints/:id | Admin | Update complaint |
| POST | /api/schemes | Admin | Create scheme |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/digital-agriculture |
| JWT_SECRET | JWT signing secret | (required) |
| NODE_ENV | Environment | development |
