import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { Layout } from './components/Layout';
import { initialMeetings } from './mocks/meetings';
import type { Meeting, ActionItemStatus } from './types/meeting';

import { DashboardPage } from './pages/DashboardPage';
import { CreateMeetingPage } from './pages/CreateMeetingPage';
import { MeetingDetailsPage } from './pages/MeetingDetailsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);

  const handleCreateMeeting = (newMeeting: Meeting) => {
    setMeetings((prev) => [newMeeting, ...prev]);
  };

  const handleActionStatusChange = (
    meetingId: string,
    actionId: string,
    newStatus: ActionItemStatus
  ) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId || !m.actionItems) return m;
        return {
          ...m,
          actionItems: m.actionItems.map((item) =>
            item.id === actionId ? { ...item, status: newStatus } : item
          ),
        };
      })
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage meetings={meetings} />} />
            <Route
              path="/meetings/create"
              element={<CreateMeetingPage onCreate={handleCreateMeeting} />}
            />
            <Route
              path="/meetings/:id"
              element={
                <MeetingDetailsPage
                  meetings={meetings}
                  onActionStatusChange={handleActionStatusChange}
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
