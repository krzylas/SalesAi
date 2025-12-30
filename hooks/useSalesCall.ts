import { useEffect, useState, useRef, useCallback } from 'react';
import { useCallStore } from '../store/callStore';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

// API URL - fetches Deepgram key from secure backend
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

const DEEPGRAM_VOICE_ID = 'aura-asteria-en'; // Deepgram Aura voice

// Deepgram Voice Agent WebSocket endpoint
const DEEPGRAM_AGENT_URL = 'wss://agent.deepgram.com/v1/agent/converse';

export type Difficulty = 'easy' | 'medium' | 'hard';

// System prompts for different difficulty levels
const SYSTEM_PROMPTS: Record<Difficulty, string> = {
  easy: `You are a friendly potential customer who is interested in the product being sold. 
You ask simple questions and are generally receptive to the sales pitch. 
You have a straightforward objection that can be easily overcome.
Be warm, encouraging, and help the salesperson practice basic sales techniques.`,

  medium: `You are a potential customer who is somewhat interested but has reservations.
You ask probing questions about pricing, features, and competitors.
You have 2-3 objections that require thoughtful responses to overcome.
Be professional but skeptical, requiring the salesperson to demonstrate value.`,

  hard: `You are a tough, experienced buyer who has seen many sales pitches.
You are skeptical, ask challenging questions, and push back on claims.
You have multiple strong objections and may try to end the conversation early.
You require excellent rapport building, deep product knowledge, and skilled objection handling.
Only agree to next steps if truly impressed by the salesperson's approach.`
};

interface DeepgramConfig {
  DEEPGRAM_API_KEY: string;
}

export const useSalesCall = () => {
  const { setStatus, setSpeaking } = useCallStore();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<DeepgramConfig | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Fetch API key from secure backend on init
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        console.log('=== Fetching Deepgram config ===');
        console.log('API URL:', API_URL);

        const response = await fetch(`${API_URL}/api/config`);
        console.log('Response status:', response.status);

        if (!response.ok) {
          const text = await response.text();
          console.error('Server response error:', text.substring(0, 200));
          throw new Error(`Server error (${response.status})`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          console.error('Invalid response type:', contentType);
          throw new Error('Server returned invalid response');
        }

        const data = await response.json();

        if (!data.DEEPGRAM_API_KEY) {
          throw new Error('DEEPGRAM_API_KEY not set on server');
        }

        console.log('=== Config loaded successfully ===');
        setConfig({ DEEPGRAM_API_KEY: data.DEEPGRAM_API_KEY });
        setIsReady(true);
        setError(null);
      } catch (err: any) {
        console.error('Config fetch failed:', err.message);
        const errorMsg = err.message.includes('fetch')
          ? 'Cannot reach server - is it running?'
          : err.message;
        setError(errorMsg);
        setIsReady(true);
      }
    };

    fetchConfig();

    return () => {
      cleanupCall();
    };
  }, []);

  const cleanupCall = useCallback(async () => {
    // Stop recording
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (e) {
        console.log('Recording already stopped');
      }
      recordingRef.current = null;
    }

    // Stop media recorder (web)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Close audio context (web)
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Close WebSocket
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const startRecordingNative = async (socket: WebSocket) => {
    try {
      console.log('Requesting audio permissions...');
      const { status } = await Audio.requestPermissionsAsync();

      if (status !== 'granted') {
        throw new Error('Microphone permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      // Create recording with settings compatible with Deepgram
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;

      // Note: Expo Audio doesn't provide real-time audio chunk streaming
      // For now, this captures audio for later processing
      console.log('Recording started');

    } catch (error: any) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  };

  const startRecordingWeb = async (socket: WebSocket) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      // Create AudioContext for processing
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (socket.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          // Convert float32 to int16
          const int16Data = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            int16Data[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
          }
          socket.send(int16Data.buffer);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      console.log('Web audio streaming started');
    } catch (error: any) {
      console.error('Failed to start web recording:', error);
      throw error;
    }
  };

  const playAudioResponse = async (audioData: ArrayBuffer) => {
    try {
      if (Platform.OS === 'web') {
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(audioData);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
      } else {
        // For native, would need to save to temp file and play
        console.log('Audio response received');
      }
    } catch (error) {
      console.error('Error playing audio response:', error);
    }
  };

  const startCall = async (difficulty: Difficulty = 'medium') => {
    console.log('=== Starting Deepgram call ===');
    console.log('Difficulty:', difficulty);

    if (!config?.DEEPGRAM_API_KEY) {
      console.error('Deepgram API key not available');
      setError('Not connected to server');
      return;
    }

    try {
      setStatus('connecting');
      setError(null);

      // Create WebSocket connection to Deepgram Voice Agent
      // Use Sec-WebSocket-Protocol for authentication (required for React Native)
      const socket = new WebSocket(DEEPGRAM_AGENT_URL, ['token', config.DEEPGRAM_API_KEY]);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('=== Deepgram Voice Agent connected ===');

        // Send configuration message
        const configMessage = {
          type: 'SettingsConfiguration',
          audio: {
            input: {
              encoding: 'linear16',
              sample_rate: 16000,
            },
            output: {
              encoding: 'linear16',
              sample_rate: 16000,
              container: 'none',
            },
          },
          agent: {
            listen: {
              model: 'nova-2',
            },
            think: {
              provider: {
                type: 'open_ai',
              },
              model: 'gpt-4o-mini',
              instructions: SYSTEM_PROMPTS[difficulty],
            },
            speak: {
              model: DEEPGRAM_VOICE_ID,
            },
          },
        };

        socket.send(JSON.stringify(configMessage));
        console.log('Configuration sent');

        setStatus('connected');
        setSpeaking(false);

        // Start recording based on platform
        if (Platform.OS === 'web') {
          startRecordingWeb(socket);
        } else {
          startRecordingNative(socket);
        }
      };

      socket.onmessage = async (event) => {
        if (typeof event.data === 'string') {
          const message = JSON.parse(event.data);
          console.log('Deepgram message:', message.type);

          switch (message.type) {
            case 'UserStartedSpeaking':
              setSpeaking(false);
              break;
            case 'AgentStartedSpeaking':
              setSpeaking(true);
              break;
            case 'AgentAudioDone':
              setSpeaking(false);
              break;
            case 'ConversationText':
              console.log(`${message.role}: ${message.content}`);
              break;
            case 'Error':
              console.error('Deepgram error:', message);
              setError(message.message || 'Connection error');
              break;
          }
        } else if (event.data instanceof Blob) {
          const arrayBuffer = await event.data.arrayBuffer();
          playAudioResponse(arrayBuffer);
        }
      };

      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error');
        setStatus('idle');
      };

      socket.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setStatus('ended');
        setSpeaking(false);
      };

    } catch (error: any) {
      console.error('=== Error starting Deepgram call ===');
      console.error('Error:', error);
      setError(error.message || 'Failed to start call');
      setStatus('idle');
    }
  };

  const endCall = async () => {
    console.log('=== Ending Deepgram call ===');

    try {
      await cleanupCall();
      setStatus('ended');
      setSpeaking(false);
      console.log('Call ended successfully');
    } catch (error: any) {
      console.error('Error ending call:', error);
    }
  };

  return { startCall, endCall, isReady, config, error };
};
