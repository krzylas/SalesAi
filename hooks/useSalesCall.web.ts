import { useState } from 'react';
import { useCallStore } from '../store/callStore';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface DeepgramConfig {
  DEEPGRAM_API_KEY: string;
}

export const useSalesCall = () => {
  const { setStatus } = useCallStore();
  const [config] = useState<DeepgramConfig | null>(null);
  const [isReady] = useState(true);
  const [error] = useState<string | null>(null);

  const startCall = async (_difficulty: Difficulty = 'medium') => {
    alert('📱 Voice calls only work on mobile!\n\nPlease scan the QR code with Expo Go on your phone.');
  };

  const endCall = () => {
    setStatus('idle');
  };

  return { startCall, endCall, isReady, config, error };
};
