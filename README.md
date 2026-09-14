# Real Estate Marketplace (MERN + JWT + Redux Toolkit)

Pathment "Mega Basic Project" — Option 1.

## Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt password hashing
- **Frontend:** React (Vite), Redux Toolkit, React Router, Axios

## Structure
```
real-estate-marketplace/
├── server/     # Express + MongoDB API
└── client/     # React + Vite + Redux Toolkit app
```

## CRUD Resources (5+)
1. **Properties** — create, read, update, delete listings
2. **Users** — register, login, profile
3. **Favorites** — save/remove favorite properties
4. **Inquiries** — send/view messages to property owners
5. **Reviews** — rate and review properties

## Auth Flow
- Register → password hashed with bcrypt, JWT issued
- Login → JWT issued, stored client-side (localStorage)
- Protected routes → `middleware/auth.js` verifies the JWT and attaches `req.user`
- Protected pages on the frontend → `ProtectedRoute.jsx` redirects to `/login` if not authenticated

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
```
Edit `.env`:
```
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<any long random string>
CLIENT_URL=http://localhost:5173
```
Run it:
```bash
npm run dev
```
API runs on `http://localhost:5000`.

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env
```
Edit `.env` if your backend runs elsewhere:
```
VITE_API_URL=http://localhost:5000/api
```
Run it:
```bash
npm run dev
```
App runs on `http://localhost:5173`.

## MongoDB
Free option: create a free cluster at https://www.mongodb.com/cloud/atlas, get the connection string, and paste it into `server/.env` as `MONGO_URI`. Whitelist your IP (or `0.0.0.0/0` for quick testing).

## Deployment (for the "publicly accessible" requirement)
- **Backend:** Render or Railway — set the same env vars as `.env`, root directory `server`
- **Frontend:** Vercel — root directory `client`, add `VITE_API_URL` pointing to your deployed backend URL, then redeploy

## API Endpoints
| Method | Route | Protected | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/properties | No | List/filter properties |
| GET | /api/properties/:id | No | Get one property |
| POST | /api/properties | Yes | Create property |
| PUT | /api/properties/:id | Yes (owner) | Update property |
| DELETE | /api/properties/:id | Yes (owner) | Delete property |
| GET | /api/favorites | Yes | List my favorites |
| POST | /api/favorites | Yes | Add favorite |
| DELETE | /api/favorites/:id | Yes | Remove favorite |
| GET | /api/inquiries | Yes | Inquiries on my properties |
| POST | /api/inquiries | Yes | Send inquiry |
| DELETE | /api/inquiries/:id | Yes | Delete inquiry |
| GET | /api/reviews/property/:propertyId | No | Reviews for a property |
| POST | /api/reviews | Yes | Create review |
| DELETE | /api/reviews/:id | Yes (owner) | Delete review |

## Suggested build order to hit a Saturday deadline
1. Get the backend running locally + test all routes in Postman/Thunder Client
2. Push MongoDB Atlas connection live, deploy backend to Render
3. Run frontend locally against the deployed backend, fix any CORS/env issues
4. Deploy frontend to Vercel
5. Push final code to GitHub, submit the live URL + repo link

## Author 
 Laiba Azeem