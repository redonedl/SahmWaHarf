import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing } from 'react-native-reanimated';
import { HeroLogo } from '../components/HeroLogo';
import { glass } from '../theme/glass';

const { width } = Dimensions.get('window');

interface Props {
  isReady: boolean;
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ isReady, onFinish }) => {
  const containerOpacity = useSharedValue(1);
  const progressValue = useSharedValue(0);

  useEffect(() => {
    // Simulate loading progress over 2.5 seconds
    progressValue.value = withTiming(100, { duration: 2500, easing: Easing.out(Easing.quad) });
  }, []);

  useEffect(() => {
    if (isReady) {
      containerOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      });
    }
  }, [isReady, onFinish]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    flex: 1,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, containerAnimatedStyle, { zIndex: 1000, elevation: 1000 }]}>
      <LinearGradient colors={['#1F0B5A', '#0A002A']} style={styles.container}>
        
        <View style={styles.content}>
          <HeroLogo />
          
          <Text style={styles.title}>سهم وحرف</Text>
          <Text style={styles.subtitle}>ألغاز متنوعة للمبتدئين</Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.progressContainer}>
             <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
          </View>
          <Text style={styles.loadingText}>يتم تجهيز الألغاز...</Text>
        </View>

      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
  },
  title: {
    fontFamily: glass.fonts.bold,
    fontSize: 48,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 242, 254, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontFamily: glass.fonts.regular,
    fontSize: 18,
    color: '#E2E8F0',
    marginTop: 5,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: '100%',
  },
  progressContainer: {
    width: width * 0.6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00F2FE', // Cyan matching the gradient glow
    borderRadius: 3,
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  loadingText: {
    fontFamily: glass.fonts.regular,
    fontSize: 14,
    color: '#CBD5E1',
  },
});
