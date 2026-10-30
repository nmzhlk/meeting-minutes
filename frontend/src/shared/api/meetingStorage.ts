import type {
  Meeting,
  ActionItem,
  ActionItemStatus,
  CreateMeetingInput,
  CreateActionItemInput,
} from '../types/meeting';

const STORAGE_KEY = 'meeting_minutes_store_v1';
const SIMULATED_DELAY_MS = 300;

const delay = (ms = SIMULATED_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const getInitialDemoData = (): Meeting[] => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return [
    {
      id: '1',
      title: 'Sprint Planning',
      description: 'Planning tasks and feature priorities for the upcoming sprint',
      date: now.toISOString(),
      durationMinutes: 60,
      status: 'PROCESSED',
      participants: [
        { id: 'p1', name: 'John Doe', email: 'john@example.com', role: 'Team Lead' },
        { id: 'p2', name: 'Alice Smith', email: 'alice@example.com', role: 'Developer' },
      ],
      agenda: ['Review backlog', 'Estimate tasks', 'Assign action items'],
      summary:
        'Agreed on sprint scope and main deliverables. Next sync scheduled for Friday. Core focus will be on frontend UI interactivity and client-side state stability.',
      keyDecisions: [
        'Focus on frontend UI for the first milestone',
        'Backend integration scheduled for the next sprint',
        'Adopt Feature-Sliced Design principles for modularity',
      ],
      actionItems: [
        {
          id: 'a1',
          meetingId: '1',
          title: 'Setup repository and base layout',
          assignee: { id: 'p1', name: 'John Doe', email: 'john@example.com', role: 'Team Lead' },
          dueDate: new Date(now.getTime() + 86400000 * 2).toISOString(),
          status: 'DONE',
          priority: 'HIGH',
        },
        {
          id: 'a2',
          meetingId: '1',
          title: 'Implement dashboard and navigation',
          assignee: { id: 'p2', name: 'Alice Smith', email: 'alice@example.com', role: 'Developer' },
          dueDate: new Date(now.getTime() + 86400000 * 5).toISOString(),
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
        },
      ],
    },
    {
      id: '2',
      title: 'AI Pipeline & Architecture Review',
      description: 'Deep dive into LLM summarization pipeline, latency benchmarks, and error handling',
      date: tomorrow.toISOString(),
      durationMinutes: 45,
      status: 'SCHEDULED',
      participants: [
        { id: 'p1', name: 'John Doe', email: 'john@example.com', role: 'Team Lead' },
        { id: 'p3', name: 'Bob Johnson', email: 'bob@example.com', role: 'AI Engineer' },
        { id: 'p4', name: 'Elena Rostova', email: 'elena@example.com', role: 'Product Manager' },
      ],
      agenda: [
        'Review audio ingestion format limitations',
        'Benchmark Whisper and local transcription options',
        'Discuss structured JSON output extraction for action items',
      ],
      actionItems: [],
    },
    {
      id: '3',
      title: 'Product Roadmap Q4 Sync',
      description: 'Aligning release dates and dependencies across engineering and marketing',
      date: nextWeek.toISOString(),
      durationMinutes: 90,
      status: 'SCHEDULED',
      participants: [
        { id: 'p1', name: 'John Doe', email: 'john@example.com', role: 'Team Lead' },
        { id: 'p4', name: 'Elena Rostova', email: 'elena@example.com', role: 'Product Manager' },
      ],
      agenda: [
        'Marketing milestones review',
        'Beta testing feedback analysis',
        'Deployment timeline confirmation',
      ],
      actionItems: [],
    },
  ];
};

const readStorage = (): Meeting[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDemoData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse meetings from localStorage:', error);
    return getInitialDemoData();
  }
};

const writeStorage = (meetings: Meeting[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
  } catch (error) {
    console.error('Failed to write meetings to localStorage:', error);
  }
};

export const meetingStorage = {
  async getMeetings(): Promise<Meeting[]> {
    await delay();
    return readStorage();
  },

  async getMeetingById(id: string): Promise<Meeting | null> {
    await delay();
    const meetings = readStorage();
    return meetings.find((m) => m.id === id) || null;
  },

  async createMeeting(input: CreateMeetingInput): Promise<Meeting> {
    await delay();
    const meetings = readStorage();
    const newMeeting: Meeting = {
      ...input,
      id: Date.now().toString(),
      status: 'SCHEDULED',
      actionItems: [],
    };
    const updated = [newMeeting, ...meetings];
    writeStorage(updated);
    return newMeeting;
  },

  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting> {
    await delay();
    const meetings = readStorage();
    const index = meetings.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`Meeting with ID ${id} not found.`);
    }
    const updatedMeeting = { ...meetings[index], ...updates };
    meetings[index] = updatedMeeting;
    writeStorage(meetings);
    return updatedMeeting;
  },

  async deleteMeeting(id: string): Promise<boolean> {
    await delay();
    const meetings = readStorage();
    const filtered = meetings.filter((m) => m.id !== id);
    if (filtered.length === meetings.length) return false;
    writeStorage(filtered);
    return true;
  },

  async addActionItem(meetingId: string, input: CreateActionItemInput): Promise<ActionItem> {
    await delay();
    const meetings = readStorage();
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) {
      throw new Error(`Meeting with ID ${meetingId} not found.`);
    }

    const newItem: ActionItem = {
      id: `act-${Date.now()}`,
      meetingId,
      title: input.title,
      assignee: input.assignee,
      dueDate: input.dueDate,
      status: 'TODO',
      priority: input.priority || 'MEDIUM',
    };

    if (!meeting.actionItems) {
      meeting.actionItems = [];
    }
    meeting.actionItems.push(newItem);
    writeStorage(meetings);
    return newItem;
  },

  async updateActionItemStatus(
    meetingId: string,
    actionId: string,
    status: ActionItemStatus
  ): Promise<ActionItem> {
    await delay();
    const meetings = readStorage();
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting || !meeting.actionItems) {
      throw new Error(`Action item ${actionId} not found in meeting ${meetingId}.`);
    }

    const item = meeting.actionItems.find((a) => a.id === actionId);
    if (!item) {
      throw new Error(`Action item ${actionId} not found.`);
    }

    item.status = status;
    writeStorage(meetings);
    return item;
  },

  async deleteActionItem(meetingId: string, actionId: string): Promise<boolean> {
    await delay();
    const meetings = readStorage();
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting || !meeting.actionItems) return false;

    meeting.actionItems = meeting.actionItems.filter((a) => a.id !== actionId);
    writeStorage(meetings);
    return true;
  },

  async processMeetingWithAI(meetingId: string): Promise<Meeting> {
    await delay(600);
    const meetings = readStorage();
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) {
      throw new Error(`Meeting with ID ${meetingId} not found.`);
    }

    meeting.status = 'PROCESSED';
    meeting.summary =
      'Key agenda items were comprehensively analyzed. Team members reached consensus on architectural constraints, assigned ownership for integration endpoints, and set up the delivery milestone.';
    meeting.keyDecisions = [
      'Approved technical specifications for asynchronous processing',
      'Confirmed schedule for frontend interactive milestone',
      'Configured automated validation rules across all user inputs',
    ];

    const defaultAssignee = meeting.participants[0] || {
      id: 'p1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Team Lead',
    };

    const newGeneratedTasks: ActionItem[] = [
      {
        id: `ai-act-${Date.now()}-1`,
        meetingId,
        title: 'Review extracted protocol and notify stakeholders',
        assignee: defaultAssignee,
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        status: 'TODO',
        priority: 'HIGH',
      },
      {
        id: `ai-act-${Date.now()}-2`,
        meetingId,
        title: 'Implement feedback loops from user test runs',
        assignee: meeting.participants[1] || defaultAssignee,
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        status: 'TODO',
        priority: 'MEDIUM',
      },
    ];

    meeting.actionItems = [...(meeting.actionItems || []), ...newGeneratedTasks];
    writeStorage(meetings);
    return meeting;
  },

  async resetToDefault(): Promise<Meeting[]> {
    await delay(150);
    const initial = getInitialDemoData();
    writeStorage(initial);
    return initial;
  },
};
