# 🎬 YewToob — Full-Stack YouTube Clone

A clean, modern YouTube-inspired video platform built with React, Node.js, Express, and MongoDB.

---

## 📁 Project Structure

```
yewtoob/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema (bcrypt password hashing)
│   │   ├── Video.js             # Video schema (text search index)
│   │   └── Comment.js           # Comment schema
│   ├── routes/
│   │   ├── users.js             # POST /signup, POST /login, GET /me
│   │   ├── videos.js            # CRUD + search + like
│   │   └── comments.js          # CRUD + like
│   ├── server.js                # Express app entry point
│   ├── seed.js                  # DB seeder (8 sample videos)
│   ├── .env.example             # Environment variable template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html           # Google Fonts (Bebas Neue + DM Sans)
    └── src/
        ├── App.js               # Router + layout shell
        ├── App.css              # Shell layout styles
        ├── index.js             # React entry point
        ├── index.css            # Design tokens + global reset
        ├── context/
        │   ├── AuthContext.js   # Global auth state (JWT)
        │   └── ThemeContext.js  # Dark/light mode toggle
        ├── utils/
        │   ├── api.js           # Centralised API fetch helpers
        │   └── format.js        # Views, time-ago, placeholder colour
        ├── components/
        │   ├── Navbar.js/.css   # Top bar: logo, search, auth, dark mode
        │   ├── Sidebar.js/.css  # Left nav: Home, Trending, Subs, categories
        │   └── VideoCard.js/.css # Grid card + skeleton loader
        └── pages/
            ├── Home.js/.css     # Video feed with category chips
            ├── Watch.js/.css    # Player, likes, comments
            ├── Search.js/.css   # Horizontal result cards
            ├── Login.js         # JWT login form
            ├── Signup.js        # Registration form
            ├── Auth.css         # Shared auth page styles
            ├── Upload.js/.css   # Upload by URL + metadata
            └── Placeholder.js/.css  # Trending + Subscriptions stubs
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ — https://nodejs.org
- **MongoDB** running locally — https://www.mongodb.com/try/download/community
  ```bash
  # macOS (Homebrew)
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community

  # Ubuntu
  sudo systemctl start mongod

  # Windows — use MongoDB Compass or WSL
  ```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd yewtoob/backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env if needed (defaults work for local MongoDB)

# Seed database with 8 sample videos + demo user
node seed.js

# Start development server (with auto-reload)
npm run dev
# → Running on http://localhost:5000
```

### 2. Frontend

```bash
cd yewtoob/frontend

# Install dependencies
npm install

# Start development server
npm start
# → Opens http://localhost:3000
```

> The frontend proxies all `/api/*` requests to `localhost:5000` via CRA's proxy setting in `package.json`.

---

## 🔑 Demo Account

After running `node seed.js`:

| Field    | Value                  |
|----------|------------------------|
| Email    | admin@yewtoob.com      |
| Password | password123            |

---

## 🌐 API Reference

### Users
| Method | Endpoint           | Auth | Description        |
|--------|--------------------|------|--------------------|
| POST   | /api/users/signup  | No   | Create account     |
| POST   | /api/users/login   | No   | Login, get JWT     |
| GET    | /api/users/me      | Yes  | Get current user   |
| GET    | /api/users/:id     | No   | Get user by ID     |

### Videos
| Method | Endpoint                 | Auth | Description             |
|--------|--------------------------|------|-------------------------|
| GET    | /api/videos              | No   | All videos (newest)     |
| GET    | /api/videos/search?q=    | No   | Search by title/tags    |
| GET    | /api/videos/:id          | No   | Single video (+views)   |
| POST   | /api/videos              | Yes  | Create (URL-based)      |
| POST   | /api/videos/upload       | Yes  | Upload video file       |
| PATCH  | /api/videos/:id/like     | Yes  | Increment likes         |
| DELETE | /api/videos/:id          | Yes  | Delete own video        |

### Comments
| Method | Endpoint                   | Auth | Description          |
|--------|----------------------------|------|----------------------|
| GET    | /api/comments?videoId=     | No   | Get video comments   |
| POST   | /api/comments              | Yes  | Post a comment       |
| DELETE | /api/comments/:id          | Yes  | Delete own comment   |
| PATCH  | /api/comments/:id/like     | Yes  | Like a comment       |

---

## 🎨 Design System

- **Font Display:** Bebas Neue (logo, 404)
- **Font Body:** DM Sans
- **Brand colours:** `--red: #ff2b2b`, white, near-black
- **Dark mode:** CSS `data-theme="dark"` attribute, toggled via `ThemeContext`
- **All colours** use CSS custom properties — swap the palette in `index.css` to rebrand instantly

---

## ✨ Features

- 🎬 **Video feed** — responsive grid, 16:9 thumbnail cards
- ⚡ **Skeleton loaders** — shimmer animation while fetching
- ▶️ **HTML5 video player** — supports direct mp4/webm URLs
- 👍 **Like button** — one-click, persisted in MongoDB
- 💬 **Comments** — post & delete your own comments
- 🔍 **Live search** — regex search across title, description, tags
- 🔐 **JWT auth** — signup, login, persistent session via localStorage
- ⬆️ **Video upload** — submit any public video URL + metadata
- 🌙 **Dark mode** — system-aware default, toggle in navbar
- 📱 **Responsive** — works on mobile (sidebar hidden on small screens)

---

## 🔧 Environment Variables

| Variable    | Default                              | Description               |
|-------------|--------------------------------------|---------------------------|
| PORT        | 5000                                 | Backend port              |
| MONGO_URI   | mongodb://localhost:27017/yewtoob    | MongoDB connection string |
| JWT_SECRET  | yewtoob_super_secret_key_...         | **Change in production!** |
| NODE_ENV    | development                          | Environment               |

---

## 🚢 Production Notes

1. Set a **strong `JWT_SECRET`** in your production `.env`
2. Use **MongoDB Atlas** for a cloud database (just swap `MONGO_URI`)
3. Run `npm run build` in `/frontend` and serve the `build/` folder from Express
4. Add HTTPS via a reverse proxy (nginx / Caddy)
