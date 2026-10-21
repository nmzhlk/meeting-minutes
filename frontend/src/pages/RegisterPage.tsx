import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  MenuItem,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useAuth } from '../features/auth';

const POPULAR_ROLES = [
  'Team Lead',
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Product Manager',
  'QA Engineer',
  'UI/UX Designer',
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        role: role.trim() || 'Member',
        password,
      });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        py: 4,
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
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
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
              }}
            >
              <PersonAddOutlinedIcon fontSize="medium" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Join Meeting Minutes to manage meetings and action items
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
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />

            <TextField
              margin="normal"
              select
              fullWidth
              id="role"
              label="Role in Team"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitting}
            >
              {POPULAR_ROLES.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password (min 6 chars)"
              id="password"
              autoComplete="new-password"
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

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              id="confirmPassword"
              autoComplete="new-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.25, fontWeight: 600 }}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Typography
                  component={Link}
                  to="/login"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign In
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
          Meeting Minutes &bull; Secure Account Registration
        </Typography>
      </Box>
    </Box>
  );
};
