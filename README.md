# CarWise

CarWise is a full-stack responsive car research and recommendation platform that helps buyers move from confusion to a confident shortlist.

## Tech Stack

- Frontend: React, JavaScript, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express.js, Mongoose, MongoDB Atlas
- Auth: JWT for users and admins
- Deployment: Vercel frontend static build plus serverless Express API

## Features

- Responsive home page with search and buyer assistant entry point
- Car listings with advanced filters for make, model, variant, price, mileage, fuel, transmission, body type, safety, seating, and user rating
- Sorting by price, mileage, safety rating, and user rating
- Car detail pages with images, variants, specs, mileage, safety, pros/cons, and reviews
- Compare up to three cars
- Favorites/shortlist with local support and authenticated API sync
- Recommendation engine with explanations for each ranked car
- User login/register and review submission
- Admin JWT login
- Admin dashboard with total cars, users, reviews, and shortlists
- Admin car CRUD and review moderation

## Project Structure

```text
root/
  frontend/
    src/
      assets/
      components/
      pages/
      layouts/
      routes/
      services/
      hooks/
      utils/
      context/
      App.jsx
      main.jsx
    public/
    package.json
    vite.config.js
    tailwind.config.js
    .env.example

  backend/
    src/
      config/
      controllers/
      models/
      routes/
      middleware/
      utils/
      validators/
      server.js
    api/
      index.js
    package.json
    .env.example

  .gitignore
  README.md
  vercel.json
```

## Local Setup

Install dependencies:

```bash
npm install
```

Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Start the backend:

```bash
npm run dev:backend
```

Seed the database (when `MONGODB_URI` is configured):

```bash
npm run seed
```

Start the frontend in another terminal:

```bash
npm run dev:frontend
```

Open the local site (typically at `http://localhost:5173` or the port displayed in your terminal).

## Environment Variables

Backend:

- `MONGODB_URI`: MongoDB Atlas connection string
- `MONGODB_DB_NAME`: database name
- `MONGODB_TIMEOUT_MS`: MongoDB server selection timeout, default `8000`
- `JWT_SECRET`: long random secret for JWT signing
- `JWT_EXPIRES_IN`: token lifetime, for example `7d`
- `CORS_ORIGIN`: comma-separated allowed frontend URLs
- `FRONTEND_URL`: primary deployed frontend URL
- `ALLOW_VERCEL_PREVIEWS`: set to `true` only when preview deployments should be allowed by CORS
- `SEED_ADMIN_EMAIL`: local demo admin email when no MongoDB URI is configured
- `SEED_ADMIN_PASSWORD`: local demo admin password when no MongoDB URI is configured

Frontend:

- `VITE_API_BASE_URL`: API base URL, usually `http://localhost:5000/api` locally and `https://your-backend.vercel.app/api` when frontend/backend are deployed separately

When `MONGODB_URI` is not set, the backend serves in-memory demo car data so the UI can be tested locally.

## Key API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/cars`
- `GET /api/cars/:id`
- `GET /api/cars/compare?ids=id1,id2`
- `GET /api/filters`
- `POST /api/recommendations`
- `GET /api/reviews/car/:carId`
- `POST /api/reviews`
- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites/:carId`
- `POST /api/admin/login`
- `GET /api/admin/dashboard`
- `GET /api/admin/cars`
- `POST /api/admin/cars`
- `PUT /api/admin/cars/:id`
- `DELETE /api/admin/cars/:id`
- `GET /api/admin/reviews`
- `PUT /api/admin/reviews/:id`
- `DELETE /api/admin/reviews/:id`

## Recommendation Logic

The backend ranks cars using:

- Budget match
- Mileage score
- Safety score
- Review score
- Family suitability
- Fuel type match
- Usage match
- Feature preference match

Each recommendation returns a match percentage and concise reasons explaining why the car made the shortlist.

## Vercel Deployment

For separate frontend and backend deployments, create two Vercel projects from the same repository.

Backend project:

1. Set the Vercel root directory to `backend`.
2. Add backend environment variables in Vercel:
   - `MONGODB_URI`
   - `MONGODB_DB_NAME`
   - `MONGODB_TIMEOUT_MS=8000`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CORS_ORIGIN=https://your-frontend.vercel.app`
   - `FRONTEND_URL=https://your-frontend.vercel.app`
3. Deploy.
4. Verify `https://your-backend.vercel.app/api/health`.

Frontend project:

1. Set the Vercel root directory to `frontend`.
2. Add `VITE_API_BASE_URL=https://your-backend.vercel.app/api`.
3. Deploy.

The backend `vercel.json` routes `/`, `/health`, `/api`, and `/api/*` to the Express serverless function at `backend/api/index.js`. The frontend `vercel.json` rewrites all app routes to `index.html` for React Router.

## Admin Access

With MongoDB configured, the easiest way to create the initial admin user is by running the seed script:

```bash
npm run seed
```

This will create an admin document in the database with:

- Email: `admin@carwise.dev`
- Password: `Admin@1234`

Without MongoDB, the local in-memory fallback uses these same admin credentials. Set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `backend/.env` to override those local demo values.
