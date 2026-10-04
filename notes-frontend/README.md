# Notes API Frontend

A modern, responsive, and secure React single-page application built with Vite for the **Notes API** backend.

---

## 🌟 Features

- **User Authentication**: Secure Signup and Login workflows powered by JWT tokens.
- **Protected Routes**: Restricts Dashboard access to authenticated users; automatically redirects unauthorized requests.
- **Session Management**: Automatic logout and state cleanup when tokens expire (HTTP 401 handling).
- **Create Notes**: Interactive modal form to author notes with title and multiline content.
- **View Notes**: Responsive grid of cards displaying titles, content (safely rendered), creation dates, and last update timestamps.
- **Search Notes**: Real-time / on-demand search by title and content using sanitized queries (`encodeURIComponent`).
- **Update Notes**: Edit modal pre-filled with existing note details.
- **Delete Notes**: Confirmation dialog ensuring notes are not removed accidentally.
- **Modern UI & UX**: Clean cards, rounded corners, soft shadows, disabled button states during network calls, and clear user-friendly notifications.

---

## 🛠️ Tech Stack

- **React 18** (Functional components, React Hooks: `useState`, `useEffect`, `useContext`, `useCallback`)
- **Vite** (Next-generation lightning-fast frontend tooling)
- **JavaScript (ES Modules & JSX)**
- **React Router DOM v6** (Declarative client-side routing)
- **Vanilla CSS** (Custom design tokens, CSS variables, zero heavy UI frameworks)

---

## 📁 Project Structure

```text
notes-frontend/
│
├── package.json
├── index.html
├── vite.config.js
├── README.md
│
└── src/
    ├── main.jsx                 # Application entry point
    ├── App.jsx                  # Main router setup & AuthProvider wrapper
    ├── App.css                  # Modern design system & responsive styling
    │
    ├── components/
    │   ├── Navbar.jsx           # Top header with user greeting & logout
    │   ├── NoteCard.jsx         # Card item with safe text & action buttons
    │   ├── NoteForm.jsx         # Reusable modal for Creating and Editing notes
    │   ├── SearchBar.jsx        # Search input with Search and Clear buttons
    │   └── ProtectedRoute.jsx   # Route guards for authenticated & public routes
    │
    ├── pages/
    │   ├── Login.jsx            # Sign-in page
    │   ├── Signup.jsx           # Registration page
    │   └── Dashboard.jsx        # Notes dashboard & management
    │
    ├── services/
    │   └── api.js               # Centralized API service with Bearer token injection
    │
    └── context/
        └── AuthContext.jsx      # Authentication state and storage management
```

---

## 🔌 API Endpoints Consumed

All requests are dispatched to `http://localhost:3000`:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/user/signup` | Register new user (`name`, `email`, `password`) | No |
| `POST` | `/user/login` | Log in user (`email`, `password`) | No |
| `GET` | `/user/dashboard` | Fetch dashboard greeting and user profile | Yes (`Bearer <token>`) |
| `POST` | `/notes` | Create a note (`title`, `content`) | Yes (`Bearer <token>`) |
| `GET` | `/notes` | Fetch all notes for authenticated user | Yes (`Bearer <token>`) |
| `GET` | `/notes?search=<term>` | Search notes by title or content | Yes (`Bearer <token>`) |
| `GET` | `/notes/:id` | Fetch a single note by ID | Yes (`Bearer <token>`) |
| `PUT` | `/notes/:id` | Update note title and/or content | Yes (`Bearer <token>`) |
| `DELETE` | `/notes/:id` | Delete note by ID | Yes (`Bearer <token>`) |

---

## 🚀 Getting Started

### Prerequisites

> [!IMPORTANT]
> The **Notes API backend** must be running at `http://localhost:3000` with MongoDB connected before using the frontend.

### 1. Installation

Navigate into the `notes-frontend` folder and install dependencies:

```bash
cd notes-frontend
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The frontend will run at:
👉 **`http://localhost:5173`**

The backend is expected at:
👉 **`http://localhost:3000`**

### 3. Production Build

To verify and create an optimized production build:

```bash
npm run build
```

---

## ⚠️ Cross-Origin Resource Sharing (CORS) Notice

Because the frontend runs at `http://localhost:5173` and the backend runs on port `3000`, the web browser enforces the Same-Origin Policy.

If your browser console displays an error such as:
> `Access to fetch at 'http://localhost:3000/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

Please configure CORS in your backend by running the following in `backend/`:

```bash
npm install cors
```

And in `backend/server.js`, add:

```javascript
import cors from "cors";

// Enable CORS for all incoming requests (or specify http://localhost:5173)
app.use(cors());
```

*(Note: Per project requirements, the backend has not been modified automatically).*
