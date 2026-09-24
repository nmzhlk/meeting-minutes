import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Avatar,
  Tooltip,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'text.primary',
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
                }}
              >
                <EventNoteIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                  Meeting Minutes
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Protocol & Action Tracker
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Button
                component={Link}
                to="/"
                startIcon={<DashboardIcon />}
                variant="text"
                sx={{
                  fontWeight: 600,
                  color: isCurrent('/') ? 'primary.main' : 'text.secondary',
                  bgcolor: isCurrent('/') ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  '&:hover': {
                    bgcolor: isCurrent('/') ? 'rgba(37, 99, 235, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                Dashboard
              </Button>

              <Button
                component={Link}
                to="/meetings/create"
                variant={isCurrent('/meetings/create') ? 'outlined' : 'contained'}
                color="primary"
                startIcon={<AddIcon />}
                sx={{ px: { xs: 1.5, sm: 2.5 } }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Schedule a Meeting
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  New
                </Box>
              </Button>

              <Tooltip title="Organizer: John Doe">
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: 'secondary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  JD
                </Avatar>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 2.5, sm: 4 } }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
};
