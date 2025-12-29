import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

interface VoiceVisualizerProps {
  isSpeaking: boolean;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isSpeaking }) => {
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);
  const opacity1 = useSharedValue(0.6);
  const opacity2 = useSharedValue(0.4);
  const opacity3 = useSharedValue(0.2);
  const innerGlow = useSharedValue(1);

  useEffect(() => {
    if (isSpeaking) {
      // Pulsing rings animation
      scale1.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 600, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      );

      scale2.value = withDelay(200, withRepeat(
        withSequence(
          withTiming(1.5, { duration: 800, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      ));

      scale3.value = withDelay(400, withRepeat(
        withSequence(
          withTiming(1.8, { duration: 1000, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      ));

      // Breathing glow effect
      innerGlow.value = withRepeat(
        withTiming(1.15, { duration: 500 }),
        -1,
        true
      );

      // Fading opacity for rings
      opacity1.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 600 }),
          withTiming(0.4, { duration: 600 })
        ),
        -1,
        false
      );
    } else {
      // Reset to calm state
      cancelAnimation(scale1);
      cancelAnimation(scale2);
      cancelAnimation(scale3);
      cancelAnimation(opacity1);
      cancelAnimation(opacity2);
      cancelAnimation(opacity3);
      cancelAnimation(innerGlow);

      scale1.value = withSpring(1);
      scale2.value = withSpring(1);
      scale3.value = withSpring(1);
      opacity1.value = withSpring(0.6);
      opacity2.value = withSpring(0.4);
      opacity3.value = withSpring(0.2);
      innerGlow.value = withSpring(1);
    }
  }, [isSpeaking]);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));

  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
    opacity: opacity3.value,
  }));

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerGlow.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Outer ring */}
      <Animated.View style={[styles.ring, styles.ring3, ring3Style]} />
      {/* Middle ring */}
      <Animated.View style={[styles.ring, styles.ring2, ring2Style]} />
      {/* Inner ring */}
      <Animated.View style={[styles.ring, styles.ring1, ring1Style]} />
      {/* Core */}
      <Animated.View style={[styles.core, innerStyle]}>
        <View style={styles.coreInner} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
  },
  ring1: {
    width: 100,
    height: 100,
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
  },
  ring2: {
    width: 140,
    height: 140,
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  ring3: {
    width: 180,
    height: 180,
    borderColor: '#2563EB',
    backgroundColor: 'rgba(37, 99, 235, 0.02)',
  },
  core: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  coreInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#93C5FD',
  },
});
