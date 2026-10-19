# Meeting Minutes

AI-driven meeting assistant for automated agenda planning, discussion transcription, summarization, and action item tracking.

## 1. Project Overview

The service streamlines organizational overhead around business meetings and ensures agreements are clearly documented. It provides tools to structure upcoming meeting agendas, upload discussion recordings or transcripts, extract key decisions and executive summaries via external AI models, and manage task assignments with deadlines in a unified workflow.

## 2. User Scenarios

1. **Agenda Planning & Scheduling:**
   An organizer sets up a new meeting session, defines the topic, date and time, invites participants, and drafts agenda points with real-time validation to provide alignment prior to the meeting.
2. **Interactive Dashboard & Search:**
   Team members view all scheduled and completed meetings, inspect summary statistics, filter meetings by status, search by keywords, and reset filters dynamically.
3. **Audio/Transcript Upload & AI Processing:**
   Following the discussion, a team member initiates AI analysis. The system simulates audio upload, speech transcription, summary generation, key decision extraction, and automated action item assignment through a step-by-step progress indicator.
4. **Action Items Tracking & Deadlines:**
   Participants review the generated meeting minutes, inspect assigned action items, check due dates and priorities, add new tasks, update task progress (ToDo → In Progress → Done), and remove obsolete items.

## 3. Application Screens

- `/` — **Meetings Dashboard:** Aggregated list of all planned and completed sessions with live search, status filtering chips, summary statistics, and loading/empty states.
- `/meetings/create` — **Meeting Creation Form:** Interactive form for scheduling a meeting with live client-side validation, dynamic agenda builder, and participant management.
- `/meetings/:id` — **Meeting Protocol & Insights:** Comprehensive view with meeting info, AI-generated summary, key decisions, interactive action items table, and audio upload/AI processing simulation.

## 4. Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Material UI v9
- **Backend:** Python 3.12+, FastAPI, SQLAlchemy 2.0, PostgreSQL, Docker

## 5. Frontend Structure 

The client application follows the Feature-Sliced Design architectural methodology, ensuring loose coupling, strict unidirectional dependencies, and maintainability across features.

```
frontend/src/
├── app/                      # Application initialization, root providers, routing
│   ├── App.tsx               # Route definitions and global layout wrapping
│   └── providers/            # ThemeProvider, FeedbackProvider (toast notifications)
├── pages/                    # Compositional route views
│   ├── DashboardPage.tsx     # Meetings list, statistics, filters, empty/loading states
│   ├── CreateMeetingPage.tsx # Meeting scheduling workflow
│   ├── MeetingDetailsPage.tsx# Protocol overview, AI insights, action item management
│   └── NotFoundPage.tsx      # 404 fallback page
├── features/                 # User-driven business workflows and actions
│   ├── create-meeting/       # Meeting creation form with dynamic inputs & validation
│   ├── filter-meetings/      # Search bar, status filter chips, filter reset
│   ├── manage-action-items/  # Action item creation modal, status toggling, deletion
│   ├── process-meeting-ai/   # Multi-step audio upload & AI protocol generation simulation
│   └── delete-meeting/       # Safe meeting deletion with confirmation dialog
├── entities/                 # Domain business models and entity-specific UI
│   ├── meeting/              # MeetingCard, MeetingStatusBadge, MeetingStatsCard, types
│   ├── action-item/          # ActionItemRow, ActionItemStatusBadge, PriorityBadge, types
│   └── participant/          # ParticipantAvatar, ParticipantChip, types
└── shared/                   # Generic infrastructure and reusable components
    ├── api/                  # meetingStorage (LocalStorage CRUD + async latency simulation)
    ├── lib/                  # Date formatting (formatDateTime, formatDateOnly), validation rules
    ├── theme/                # MUI dark theme configuration and typography tokens
    └── ui/                   # Layout, EmptyState, Skeleton loaders, ConfirmDialog, FeedbackSnackbar
```

## 6. Data Model

| Entity | Description | Relationships |
| :--- | :--- | :--- |
| **Meeting** | Session details, AI summary, transcript, agenda, decisions | M:N with Participants, 1:N with Action Items |
| **Participant** | Team members (name, email, role, avatar) | M:N with Meetings, 1:N with Action Items |
| **Action Item** | Follow-up task with deadline, priority and status | Belongs to Meeting, optionally assigned to Participant |

## 7. Local Setup & Execution

### Prerequisites
- Node.js (v18+) & npm (v9+)
- Python (v3.12+)
- Docker & Docker Compose

### 1. Database Setup
Start the PostgreSQL container:
```bash
docker compose up -d
```
The database will be available at `localhost:5432` (database: `meeting_minutes`, user: `postgres`).

### 2. Backend Setup
1. Navigate to the backend directory and set up environment variables:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. Create and activate a Python virtual environment:
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
5. Start the backend development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Swagger UI is available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Frontend Setup
1. Navigate to the client directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Access the client app at [http://localhost:5173](http://localhost:5173).

## 8. Screenshots

### Meetings Dashboard (`/`)
![Meetings Dashboard](docs/screenshots/dashboard.png)

### Meeting Creation Form (`/meetings/create`)
![Meeting Creation Form](docs/screenshots/create_meeting.png)

### Meeting Protocol & Action Items (`/meetings/:id`)
![Meeting Protocol & Insights](docs/screenshots/meeting_details.png)
