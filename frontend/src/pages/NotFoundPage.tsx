import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

export const NotFoundPage: React.FC = () => {
  return (
    <Box sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5 }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
        Page Not Found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        The page you are looking for does not exist or has been moved
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Back to Dashboard
      </Button>
    </Box>
  );
};
