const STATUS_MESSAGES = {
  400: 'The request was invalid. Please check your input and try again.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  500: 'A server error occurred. Please try again later.',
};

export const getApiErrorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
  const status = err?.response?.status;
  const backendMessage = err?.response?.data?.message;

  if (backendMessage) {
    return backendMessage;
  }

  if (status && STATUS_MESSAGES[status]) {
    return STATUS_MESSAGES[status];
  }

  if (err?.message) {
    return err.message;
  }

  return fallback;
};
