import { create } from 'zustand';

type CallStatus = 'idle' | 'connecting' | 'connected' | 'ended';

interface CallState {
  status: CallStatus;
  isSpeaking: boolean;
  setStatus: (status: CallStatus) => void;
  setSpeaking: (isSpeaking: boolean) => void;
}

export const useCallStore = create<CallState>((set) => ({
  status: 'idle',
  isSpeaking: false,
  setStatus: (status) => set({ status }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
}));
