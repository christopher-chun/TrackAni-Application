# TrackAni

A full-stack web application for tracking anime and manga. Users can browse anime and manga, add them to a favorites list, and manage a personal watchlist/readlist with status tracking.

🔗 **Live Demo**: [TrackAni](https://trackani.onrender.com)

---

## Features

- **Browse Anime & Manga** — Search and explore a large catalog powered by the Kitsu API
- **User Authentication** — Secure sign up and login via Clerk
- **Favorites** — Save anime and manga to a personal favorites list
- **List Management** — Add titles to a personal list with status tracking:
  - Anime: `Watching`, `Plan to Watch`, `Completed`, `On Hold`, `Dropped`
  - Manga: `Reading`, `Plan to Read`, `Completed`, `On Hold`, `Dropped`
- **Detail Pages** — View detailed info including synopsis, episode count, ratings, air dates, and cover art
- **Filter Favorites** — Filter favorites by All, Anime, or Manga
- **Responsive Design** — Works across desktop and mobile

---

## Tech Stack

**Frontend**
- React with Vite
- React Router for client-side routing
- Tailwind CSS v3 for styling
- Clerk for authentication
- Lucide React for icons
- React Hot Toast for notifications

**Backend**
- Node.js with Express
- MongoDB with Mongoose
- Clerk Backend SDK for JWT verification

**External API**
- [Kitsu API](https://kitsu.io/api/edge) for anime and manga data

**Deployment**
- Frontend: Render (Static Site)
- Backend: Render (Web Service)
- Database: MongoDB Atlas

---

## Project Structure

```
TrackAni-Application/
├── client/                         # React frontend
│   ├── public/
│   │   └── _redirects              # Render routing config
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── hooks/                  # Custom hooks for Kitsu API calls
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Anime.jsx           # Anime browse page
│   │   │   ├── AnimeDetails.jsx    # Individual anime detail page
│   │   │   ├── Manga.jsx           # Manga browse page
│   │   │   ├── MangaDetails.jsx    # Individual manga detail page
│   │   │   ├── Favorite.jsx        # User favorites page
│   │   │   └── List.jsx            # User list page
│   │   ├── utils/
│   │   │   └── api.js              # API utility functions for backend calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── server/                         # Express backend
    ├── controllers/
    │   ├── favoriteController.js   # Favorites CRUD logic
    │   └── listController.js       # List CRUD logic
    ├── middleware/
    │   └── auth.js                 # Clerk JWT verification middleware
    ├── models/
    │   ├── Favorite.js             # Mongoose Favorite schema
    │   └── List.js                 # Mongoose List schema
    ├── routes/
    │   ├── favoriteRoutes.js       # Favorites API routes
    │   └── listRoutes.js           # List API routes
    ├── .env
    ├── package.json
    └── server.js                   # Express app entry point
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Clerk account

### 1. Clone the repository

```bash
git clone https://github.com/christopher-chun/TrackAni-Application.git
cd TrackAni-Application
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:

```
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
PORT=5000
NODE_ENV=development
```

Start the backend server:

```bash
node server.js
```

### 3. Set up the frontend

```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## API Endpoints

All endpoints require a valid Clerk JWT passed as a Bearer token in the Authorization header.

**Favorites**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get all user favorites |
| POST | `/api/favorites` | Add a favorite |
| DELETE | `/api/favorites/:itemId/:itemType` | Remove a favorite |
| GET | `/api/favorites/check/:itemId/:itemType` | Check if item is favorited |

**List**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/list` | Get user list (supports `?itemType` and `?status` filters) |
| POST | `/api/list` | Add item to list |
| GET | `/api/list/:itemId/:itemType` | Get single list item |
| PATCH | `/api/list/:itemId/:itemType` | Update list item |
| DELETE | `/api/list/:itemId/:itemType` | Remove item from list |
| GET | `/api/list/stats/:itemType` | Get list statistics |

---

## Deployment

The app is deployed using Render for both frontend and backend, with MongoDB Atlas for the database.

**Environment variables on Render:**

Frontend (Static Site):
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=https://your-backend.onrender.com/api
```

Backend (Web Service):
```
CLERK_SECRET_KEY=sk_test_...
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
PORT=5000
```

---

## Screenshots

*Coming soon*

---
