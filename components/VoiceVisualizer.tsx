import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';

interface VoiceVisualizerProps {
  isSpeaking: boolean;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isSpeaking }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isSpeaking) {
      scale.value = withRepeat(withTiming(1.2, { duration: 500 }), -1, true);
    } else {
      cancelAnimation(scale);
      scale.value = withSpring(1);
    }
  }, [isSpeaking]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View className="items-center justify-center">
      <Animated.View
        style={[animatedStyle]}
        className="w-32 h-32 rounded-full bg-blue-500"
      />
    </View>
  );
};
