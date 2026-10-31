# Meeting Minutes

Meeting Minutes is a workspace for organizing discussions, generating meeting summaries, and tracking team action items.

## Key Features

- **Authentication & RBAC:** JWT authentication with refresh token rotation and role-based permissions (Organizer, Attendee).
- **Meeting Management:** Agenda builder, attendee selection, and full ownership control for organizers.
- **Interactive Dashboard:** Filter meetings by status, search by keywords, view summary statistics, and track deadlines.
- **AI Protocol Generation:** Generates meeting minutes, action items, and meeting outcomes from meeting discussions.
- **Action Items Tracker:** Task assignment, priority levels, deadlines, and inline status toggling.

## Screenshots

### Meetings Dashboard (`/`)
![Meetings Dashboard](docs/screenshots/dashboard.png)

### Meeting Details (`/meetings/:id`)
![Meeting Details](docs/screenshots/meeting_details.png)

### Create Meeting Form (`/meetings/create`)
![Create Meeting Form](docs/screenshots/create_meeting.png)

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Material UI v9
- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL, PyJWT, bcrypt
- **Infrastructure:** Docker, Docker Compose

## Architecture & Project Structure

The project follows a decoupled client-server architecture with Feature-Sliced Design (FSD) on the frontend:

```
meeting-minutes/
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers (auth, meetings, action items, users)
│   │   ├── core/         # Settings and security helpers (JWT, bcrypt)
│   │   ├── db/           # Database session, base models, and seed script
│   │   ├── models/       # SQLAlchemy models (User, Meeting, ActionItem, RefreshToken)
│   │   ├── repositories/ # Database query operations
│   │   └── schemas/      # Pydantic request and response schemas
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/          # Root providers and router configuration
    │   ├── pages/        # Route views (Login, Register, Dashboard, Details, Create)
    │   ├── features/     # Feature workflows (auth context, filter, manage items)
    │   ├── entities/     # Domain components (meeting, user, action item)
    │   └── shared/       # Reusable UI, theme, and HTTP client with auto-refresh
    └── package.json
```

## Data Model

- **User:** Team accounts with role, avatar, and credentials.
- **RefreshToken:** Active sessions with revocation support.
- **Meeting:** Agendas, summaries, and decisions linked to owner and attendees.
- **ActionItem:** Follow-up tasks with assignees, priorities, and deadlines.

## Getting Started Locally

### Prerequisites

- Node.js (v18+) & npm (v9+)
- Python (v3.12+)
- Docker & Docker Compose

### 1. Database

Start the PostgreSQL database container:

```bash
docker compose up -d
```

Database connection: `localhost:5432` (`database: meeting_minutes`, `user: postgres`, `password: postgres`).

### 2. Backend

1. Navigate to the backend directory and prepare .env file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create database tables and seed initial demo data:
   ```bash
   python -m app.db.init_db
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite server:
   ```bash
   npm run dev
   ```

App: [http://localhost:5173](http://localhost:5173)

### Demo Accounts

| User | Password | Role | Access Level |
| :--- | :--- | :--- | :--- |
| `john@example.com` | `Password123` | Team Lead | Organizer (create, edit, delete, run AI) |
| `alice@example.com` | `Password123` | Developer | Attendee (view meetings, update assigned tasks) |


## Code Quality

Run static analysis and build checks:

```bash
# Frontend (ESLint & TypeScript build)
cd frontend
npm run lint
npm run build

# Backend (Ruff linter & MyPy type check)
cd backend
ruff check app
mypy app
```
