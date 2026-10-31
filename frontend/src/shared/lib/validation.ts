export const validateMeetingTitle = (title: string): string | null => {
  const trimmed = title.trim();
  if (!trimmed) {
    return 'Meeting title is required';
  }
  if (trimmed.length < 3) {
    return 'Title must be at least 3 characters long';
  }
  if (trimmed.length > 120) {
    return 'Title must not exceed 120 characters';
  }
  return null;
};

export const validateMeetingDuration = (duration: number | string): string | null => {
  const num = Number(duration);
  if (isNaN(num) || !num) {
    return 'Duration is required';
  }
  if (num < 5) {
    return 'Duration must be at least 5 minutes';
  }
  if (num > 480) {
    return 'Duration cannot exceed 8 hours (480 minutes)';
  }
  return null;
};

export const validateMeetingDate = (dateStr: string): string | null => {
  if (!dateStr) {
    return 'Meeting date and time is required';
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }
  return null;
};

export const validateActionItemTitle = (title: string): string | null => {
  const trimmed = title.trim();
  if (!trimmed) {
    return 'Task title is required';
  }
  if (trimmed.length < 3) {
    return 'Task title must be at least 3 characters';
  }
  return null;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
