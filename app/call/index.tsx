import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { useSalesCall, Difficulty } from '../../hooks/useSalesCall';
import { useCallStore } from '../../store/callStore';
import { VoiceVisualizer } from '../../components/VoiceVisualizer';
import { usePermission } from '../../hooks/usePermission';

export default function CallScreen() {
  const { status, isSpeaking } = useCallStore();
  const { startCall, endCall, isReady, error } = useSalesCall();
  const { hasPermission, requestPermission } = usePermission();

  useEffect(() => {
    // Configure audio session on native platforms
    if (Platform.OS !== 'web') {
      try {
        const { configureAudioSession } = require('../../lib/audioConfig');
        configureAudioSession();
      } catch (e) {
        console.log('Audio config not available');
      }
    }
  }, []);

  const handleStartCall = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        alert("Microphone permission is required.");
        return;
      }
    }

    // Start with medium difficulty by default
    startCall('medium' as Difficulty);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {status === 'connected' && (
          <VoiceVisualizer isSpeaking={isSpeaking} />
        )}

        {(status === 'idle' || status === 'ended') && (
          <TouchableOpacity
            onPress={handleStartCall}
            style={[styles.button, styles.startButton]}
            disabled={!isReady}
          >
            <Text style={styles.buttonText}>
              {isReady ? 'Start Call' : 'Loading...'}
            </Text>
          </TouchableOpacity>
        )}

        {status === 'connected' && (
          <TouchableOpacity
            onPress={endCall}
            style={[styles.button, styles.endButton]}
          >
            <Text style={styles.buttonText}>End Call</Text>
          </TouchableOpacity>
        )}

        {status === 'connecting' && (
          <Text style={styles.statusText}>Connecting...</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
  },
  startButton: {
    backgroundColor: '#22c55e',
  },
  endButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  statusText: {
    color: '#6b7280',
    fontSize: 18,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 16,
  },
});
