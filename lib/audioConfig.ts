import { Audio, InterruptionModeIOS } from 'expo-av';

export const configureAudioSession = async () => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false, // Force speaker
  });
};
