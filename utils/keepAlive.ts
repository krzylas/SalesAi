const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const startKeepAlive = () => {
  const pingServer = async () => {
    try {
      await fetch(`${API_URL}/health`);
    } catch (error) {
      console.error('Keep-alive ping failed:', error);
    }
  };

  // Ping every 5 minutes to keep server awake
  const interval = setInterval(pingServer, 5 * 60 * 1000);
  
  // Initial ping
  pingServer();

  return () => clearInterval(interval);
};
