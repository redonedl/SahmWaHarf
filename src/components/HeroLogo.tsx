import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { glass } from '../theme/glass';

interface FloatingTileProps {
  letter: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  delay: number;
}

const FloatingTile: React.FC<FloatingTileProps> = ({ letter, top, bottom, left, right, delay }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1800 + delay, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800 + delay, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value }, 
      { rotate: `${delay % 2 === 0 ? 12 : -12}deg` },
      { perspective: 200 },
      { rotateX: '15deg' }
    ],
  }));

  return (
    <Animated.View style={[
      styles.floatingTile, 
      { top, left, right, bottom }, 
      animatedStyle
    ]}>
      <LinearGradient 
        colors={['#7E22CE', '#4C1D95']} 
        style={StyleSheet.absoluteFillObject} 
      />
      <View style={styles.tileInnerShadow} />
      <Text style={styles.floatingText}>{letter}</Text>
    </Animated.View>
  );
};

export const HeroLogo: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Floating Sparkles/Stars */}
      <Icon name="sparkles" size={16} color="#00F2FE" style={[styles.star, { top: 20, left: 70 }]} />
      <Icon name="star" size={24} color="#FFD700" style={[styles.star, { top: 70, right: 10 }]} />
      <Icon name="star" size={18} color="#FFD700" style={[styles.star, { bottom: 60, left: 20 }]} />
      <Icon name="sparkles" size={14} color="#00F2FE" style={[styles.star, { bottom: 30, right: 80 }]} />

      {/* Floating Letters */}
      <FloatingTile letter="ق" top={-10} right={10} delay={0} />
      <FloatingTile letter="م" top={30} left={20} delay={300} />
      <FloatingTile letter="ل" bottom={30} right={0} delay={600} />

      {/* Main Center Box */}
      <View style={styles.centerTileWrapper}>
        <LinearGradient 
          colors={['rgba(0, 242, 254, 0.4)', 'rgba(0, 242, 254, 0.1)']} 
          style={StyleSheet.absoluteFillObject} 
        />
        <View style={styles.centerTileInner}>
          <Text style={styles.centerText}>س</Text>
          <Icon name="return-down-back" size={54} color="#00F2FE" style={styles.arrow} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    zIndex: 10,
  },
  centerTileWrapper: {
    width: 130,
    height: 130,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#00F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  centerTileInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  centerText: {
    fontFamily: glass.fonts.bold,
    fontSize: 80,
    color: '#FBBF24',
    textShadowColor: 'rgba(251, 191, 36, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 20,
    marginTop: -10,
  },
  arrow: {
    position: 'absolute',
    bottom: -15,
    textShadowColor: '#00F2FE',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  floatingTile: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: '#A78BFA',
  },
  tileInnerShadow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
  },
  floatingText: {
    fontFamily: glass.fonts.bold,
    fontSize: 26,
    color: '#FFF',
  },
  star: {
    position: 'absolute',
    opacity: 0.9,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  }
});
