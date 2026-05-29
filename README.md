# Task Manager Application

A production-ready MERN-style task manager for authenticated users. Users can register, log in, and manage private tasks across Todo, In Progress, and Done stages with search, filtering, pagination, dark mode, toast notifications, and drag-and-drop movement.

## Features

- JWT authentication with persistent login
- Password hashing with bcrypt
- Protected frontend routes and protected API endpoints
- Create, read, update, delete, and move tasks
- Task ownership enforcement on every backend query
- Three-column responsive dashboard
- Drag-and-drop task movement with `@hello-pangea/dnd`
- Search, stage filtering, and API pagination
- Loading, empty, and error states
- React Hook Form validation
- Axios auth interceptor
- Dark mode
- Vercel and Render deployment configuration

## Tech Stack

Frontend: React, Vite, TypeScript, Tailwind CSS, React Router DOM, Axios, React Hook Form, Context API, React Toastify, Lucide React, `@hello-pangea/dnd`

Backend: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs, dotenv, cors

Deployment: Vercel for frontend, Render for backend, MongoDB Atlas for database

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
  package.json

frontend/
  src/
    components/
      auth/
      common/
      tasks/
    context/
    hooks/
    layouts/
    pages/
    routes/
    services/
    types/
    utils/
    App.tsx
  package.json
```

## Local Setup

1. Install backend dependencies:

```bash
cd backend
npm install
cp .env.example .env
```

2. Configure `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/task-manager?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>
CLIENT_URL=http://localhost:5173
```

3. Start the backend:

```bash
npm run dev
```

4. Install frontend dependencies:

```bash
cd ../frontend
npm install
cp .env.example .env
```

5. Configure `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

6. Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Testing

Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm test
```

Run the production frontend build:

```bash
cd frontend
npm run build
```

## API Endpoints

### Auth

`POST /api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "123456"
}
```

`POST /api/auth/login`

```json
{
  "email": "john@gmail.com",
  "password": "123456"
}
```

`GET /api/auth/profile`

Protected route. Requires `Authorization: Bearer <token>`.

### Tasks

All task routes are protected.

- `GET /api/tasks?search=&stage=&page=1&limit=30`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/stage`

Task payload:

```json
{
  "title": "Build dashboard",
  "description": "Create the three-column task board.",
  "stage": "Todo"
}
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account.
2. Create a new project and free cluster.
3. Create a database user with read/write access.
4. Add your current IP for local development or `0.0.0.0/0` for hosted providers.
5. Copy the Node.js connection string.
6. Replace `<username>`, `<password>`, and cluster details in `MONGO_URI`.

## Deployment

### Backend on Render

1. Push the repository to GitHub.
2. Create a new Render Web Service.
3. Use `backend` as the root directory.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=<MongoDB Atlas URI>`
   - `JWT_SECRET=<long-random-secret>`
   - `CLIENT_URL=<Vercel frontend URL>`

The root `render.yaml` can also be used as a Render blueprint.

### Frontend on Vercel

1. Import the repository in Vercel.
2. Set the project root to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL=<Render backend URL>/api`

The `frontend/vercel.json` rewrite supports React Router browser routes.

## Technical Decisions

- Context API is used for auth because the state surface is small and focused.
- JWT is stored in `localStorage` for assignment simplicity and persistent login.
- Backend controllers always query tasks by both `_id` and `userId` to prevent cross-user access.
- Custom request validation keeps the API lightweight while still returning clear errors.
- The board fetches from the API after mutations to keep frontend state aligned with MongoDB.
- Pagination is implemented on the API and exposed in the dashboard for scalability.

## Assumptions

- Email is unique for each user.
- Task stages are fixed to `Todo`, `In Progress`, and `Done`.
- The frontend and backend are deployed separately.
- The assignment prefers clarity and portability over adding more infrastructure.

## Tradeoffs

- `localStorage` persistence is straightforward, but an httpOnly cookie would be stronger for high-security production systems.
- Custom validation is simple, but a schema library such as Zod or Joi would be preferable as the API grows.
- Drag-and-drop updates stage only, not manual ordering inside a column.

## Future Improvements

- Add refresh tokens and httpOnly cookies.
- Add task due dates, priority, labels, and assignees.
- Add column ordering persistence.
- Add broader end-to-end coverage with Playwright or Cypress.
- Add rate limiting and centralized request logging.
- Add OpenAPI documentation.
