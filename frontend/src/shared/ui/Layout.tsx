import { useState, type ReactNode } from 'react';
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
  IconButton,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ConfirmDialog } from './ConfirmDialog';

interface LayoutProps {
  children: ReactNode;
  onResetData?: () => void;
}

export const Layout = ({ children, onResetData }: LayoutProps) => {
  const location = useLocation();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleConfirmReset = () => {
    setResetDialogOpen(false);
    if (onResetData) {
      onResetData();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', zIndex: 1100 }}
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
                '&:hover .logo-box': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 14px rgba(37, 99, 235, 0.35)',
                },
              }}
            >
              <Box
                className="logo-box"
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
                  transition: 'all 0.2s ease-in-out',
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
                  color: isCurrent('/') && location.pathname === '/' ? 'primary.main' : 'text.secondary',
                  bgcolor:
                    isCurrent('/') && location.pathname === '/' ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  '&:hover': {
                    bgcolor:
                      isCurrent('/') && location.pathname === '/'
                        ? 'rgba(37, 99, 235, 0.12)'
                        : 'rgba(0, 0, 0, 0.04)',
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

              {onResetData && (
                <Tooltip title="Reset data to initial demo state">
                  <IconButton
                    size="small"
                    onClick={() => setResetDialogOpen(true)}
                    sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider' }}
                  >
                    <RestartAltIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Organizer: John Doe (Team Lead)">
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
        <Container maxWidth="lg">{children}</Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            Meeting Minutes Assistant • Fullstack Course Project (Lab #3 Frontend Architecture)
          </Typography>
        </Container>
      </Box>

      <ConfirmDialog
        open={resetDialogOpen}
        title="Reset Demo Data?"
        description="This will restore all meetings and action items to their original initial state. Any newly created or modified meetings will be overwritten."
        confirmLabel="Reset Data"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onClose={() => setResetDialogOpen(false)}
      />
    </Box>
  );
};
