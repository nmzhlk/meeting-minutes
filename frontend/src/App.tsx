import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './theme/theme';
import { Layout } from './components/Layout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
              Meeting Minutes Setup
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Theme, types, and layout successfully initialized
            </Typography>
          </Box>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
