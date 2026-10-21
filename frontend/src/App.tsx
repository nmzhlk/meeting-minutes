import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './shared/theme';
import { Layout, FeedbackProvider, ProtectedRoute } from './shared/ui';
import { meetingStorage } from './shared/api';
import { AuthProvider } from './features/auth';

import { DashboardPage } from './pages/DashboardPage';
import { CreateMeetingPage } from './pages/CreateMeetingPage';
import { MeetingDetailsPage } from './pages/MeetingDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  const handleResetData = async () => {
    await meetingStorage.resetToDefault();
    window.location.href = '/';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FeedbackProvider>
          <BrowserRouter>
            <Layout onResetData={handleResetData}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/meetings/create"
                  element={
                    <ProtectedRoute>
                      <CreateMeetingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/meetings/:id"
                  element={
                    <ProtectedRoute>
                      <MeetingDetailsPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </FeedbackProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
