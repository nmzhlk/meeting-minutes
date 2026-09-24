# Meeting Minutes

AI-driven meeting assistant for automated agenda planning, discussion transcription, summarization, and action item tracking.

## 1. Project Overview

The service streamlines organizational overhead around business meetings and ensures agreements are clearly documented. It provides tools to structure upcoming meeting agendas, upload discussion recordings or transcripts, extract key decisions and executive summaries via external AI models, and manage task assignments with deadlines in a unified workflow.

## 2. User Scenarios

1. **Agenda Planning & Scheduling:**
   An organizer sets up a new meeting session, defines the topic, date and time, invites participants, and drafts agenda points to provide alignment prior to the meeting
2. **Audio/Transcript Upload & AI Processing:**
   Following the discussion, a team member uploads an audio file or text notes. The system analyzes the input using an AI model to generate a summary, highlight decisions, and identify action items
3. **Action Items Tracking & Deadlines:**
   Participants review the generated meeting minutes, inspect assigned action items, check due dates, and update task progress (ToDo → In Progress → Done)

## 3. Application Screens

- `/` — **Meetings Dashboard:** Aggregated list of all planned and completed sessions with search filters and navigation controls
- `/meetings/create` — **Meeting Creation Form:** Page for scheduling a meeting including date, time, participants and agenda planning
- `/meetings/:id` — **Meeting Protocol & Insights:** Comprehensive view with meeting info, audio and transcript upload field, AI-generated summary, key decisions, and action items table with progress tracking

## 4. Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Material UI

## 5. Local Setup & Execution

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch
1. Clone the repository:
   ```bash
   git clone https://github.com/nmzhlk/meeting-minutes.git
   cd meeting-minutes
   ```
2. Navigate to the client directory and install dependencies:
    ```bash
    cd frontend
    npm install
    ```
3. Start the Vite development server:
    ```bash
    npm run dev
    ```
4. Access the app at http://localhost:5173

## 6. Screenshots
TBD
