import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './shared/theme';
import { Layout, FeedbackProvider } from './shared/ui';
import { meetingStorage } from './shared/api';

import { DashboardPage } from './pages/DashboardPage';
import { CreateMeetingPage } from './pages/CreateMeetingPage';
import { MeetingDetailsPage } from './pages/MeetingDetailsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  const handleResetData = async () => {
    await meetingStorage.resetToDefault();
    window.location.href = '/';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FeedbackProvider>
        <BrowserRouter>
          <Layout onResetData={handleResetData}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/meetings/create" element={<CreateMeetingPage />} />
              <Route path="/meetings/:id" element={<MeetingDetailsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </FeedbackProvider>
    </ThemeProvider>
  );
}

export default App;
