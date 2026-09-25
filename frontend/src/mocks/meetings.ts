import type { Meeting } from '../types/meeting';

export const initialMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Sprint Planning',
    description: 'Planning tasks and feature priorities for the upcoming sprint',
    date: new Date(),
    durationMinutes: 60,
    status: 'PROCESSED',
    participants: [
      { id: 'p1', name: 'John Doe', email: 'john@example.com', role: 'Team Lead' },
      { id: 'p2', name: 'Alice Smith', email: 'alice@example.com', role: 'Developer' },
    ],
    agenda: ['Review backlog', 'Estimate tasks', 'Assign action items'],
    summary: 'Agreed on sprint scope and main deliverables. Next sync scheduled for Friday.',
    keyDecisions: [
      'Focus on frontend UI for the first milestone',
      'Backend integration scheduled for the next sprint',
    ],
    actionItems: [
      {
        id: 'a1',
        meetingId: '1',
        title: 'Setup repository and base layout',
        assignee: { id: 'p1', name: 'John Doe', email: 'john@example.com', role: 'Team Lead' },
        dueDate: new Date(Date.now() + 86400000 * 2),
        status: 'DONE',
        priority: 'HIGH',
      },
      {
        id: 'a2',
        meetingId: '1',
        title: 'Implement dashboard and navigation',
        assignee: { id: 'p2', name: 'Alice Smith', email: 'alice@example.com', role: 'Developer' },
        dueDate: new Date(Date.now() + 86400000 * 5),
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
      },
    ],
  },
];
