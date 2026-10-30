import { useState, type ReactNode, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Chip,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { ConfirmDialog } from './ConfirmDialog';
import { useAuth } from '../../features/auth';

interface LayoutProps {
  children: ReactNode;
  onResetData?: () => void;
}

const getInitials = (name?: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const Layout = ({ children, onResetData }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

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

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    navigate('/login', { replace: true });
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
              {isAuthenticated && (
                <>
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
                </>
              )}

              {onResetData && (
                <Tooltip title="Reset to demo data">
                  <IconButton
                    size="small"
                    onClick={() => setResetDialogOpen(true)}
                    sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider' }}
                  >
                    <RestartAltIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {isAuthenticated && user ? (
                <>
                  <Tooltip title={`${user.name} (${user.role})`}>
                    <Avatar
                      onClick={handleOpenUserMenu}
                      src={user.avatarUrl || undefined}
                      sx={{
                        width: 38,
                        height: 38,
                        bgcolor: 'secondary.main',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.08)' },
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>
                  </Tooltip>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleCloseUserMenu}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                      paper: {
                        sx: {
                          mt: 1,
                          minWidth: 220,
                          borderRadius: 2,
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
                        {user.email}
                      </Typography>
                      <Chip
                        label={user.role}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 1, height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1 }}>
                      <ListItemIcon sx={{ color: 'error.main' }}>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={Link}
                    to="/login"
                    variant="text"
                    startIcon={<LoginIcon />}
                    size="small"
                  >
                    Sign In
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    size="small"
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 2.5, sm: 4 } }}>
        <Container maxWidth="lg">{children}</Container>
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
