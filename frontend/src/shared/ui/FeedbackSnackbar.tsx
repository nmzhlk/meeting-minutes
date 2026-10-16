import { createContext, useContext, useState, type ReactNode } from 'react';
import { Snackbar, Alert, type AlertColor, Slide, type SlideProps } from '@mui/material';

interface FeedbackContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showToast = (msg: string, sev: AlertColor) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const showSuccess = (msg: string) => showToast(msg, 'success');
  const showError = (msg: string) => showToast(msg, 'error');
  const showInfo = (msg: string) => showToast(msg, 'info');
  const showWarning = (msg: string) => showToast(msg, 'warning');

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FeedbackContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3500}
        onClose={handleClose}
        slots={{ transition: SlideTransition }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            fontWeight: 500,
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
