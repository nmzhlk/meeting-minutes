import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useAuth } from '../features/auth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationState = location.state as { from?: { pathname?: string } } | undefined;
  const from = locationState?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid email or password';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123');
    setError(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              }}
            >
              <LockOutlinedIcon fontSize="medium" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Enter your credentials to access Meeting Minutes
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.25, fontWeight: 600 }}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box sx={{ my: 2.5 }}>
              <Divider>
                <Typography variant="caption" color="text.secondary">
                  Quick Demo Accounts
                </Typography>
              </Divider>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  mt: 1.5,
                  flexWrap: 'wrap',
                }}
              >
                <Chip
                  label="John Doe (Team Lead)"
                  size="small"
                  onClick={() => handleFillDemo('john@example.com')}
                  clickable
                  variant="outlined"
                  color="primary"
                />
                <Chip
                  label="Alice Smith (Developer)"
                  size="small"
                  onClick={() => handleFillDemo('alice@example.com')}
                  clickable
                  variant="outlined"
                  color="secondary"
                />
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{' '}
                <Typography
                  component={Link}
                  to="/register"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign Up
                </Typography>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: 3,
          color: 'text.secondary',
        }}
      >
        <EventNoteIcon fontSize="small" />
        <Typography variant="caption">
          Meeting Minutes &bull; JWT Authentication
        </Typography>
      </Box>
    </Box>
  );
};
