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
  color: string;
  delay: number;
}

const FloatingTile: React.FC<FloatingTileProps> = ({ letter, top, bottom, left, right, color, delay }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1500 + delay, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500 + delay, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value }, 
      { rotate: `${delay % 2 === 0 ? 12 : -12}deg` }
    ],
  }));

  return (
    <Animated.View style={[
      styles.floatingTile, 
      { top, left, right, bottom, borderColor: color, shadowColor: color }, 
      animatedStyle
    ]}>
      <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.02)']} style={StyleSheet.absoluteFillObject} />
      <Text style={styles.floatingText}>{letter}</Text>
    </Animated.View>
  );
};

export const HeroLogo: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Floating Sparkles/Stars using generic text or icons */}
      <Icon name="star" size={14} color="#FFD700" style={[styles.star, { top: 20, left: 60 }]} />
      <Icon name="star" size={20} color="#FFD700" style={[styles.star, { top: 80, right: 10 }]} />
      <Icon name="star" size={16} color="#FFD700" style={[styles.star, { bottom: 40, left: 30 }]} />
      <Icon name="star" size={12} color="#FFD700" style={[styles.star, { bottom: 10, right: 60 }]} />

      {/* Floating Letters */}
      <FloatingTile letter="ق" top={-10} right={20} color="#A855F7" delay={0} />
      <FloatingTile letter="م" top={0} left={20} color="#3B82F6" delay={300} />
      <FloatingTile letter="ل" bottom={30} left={-10} color="#EC4899" delay={600} />
      <FloatingTile letter="ر" bottom={40} right={-5} color="#F59E0B" delay={900} />

      {/* Main Center Box */}
      <View style={styles.centerTile}>
        <LinearGradient 
          colors={['rgba(0, 242, 254, 0.3)', 'rgba(0, 242, 254, 0.05)']} 
          style={StyleSheet.absoluteFillObject} 
        />
        <Text style={styles.centerText}>س</Text>
        
        {/* Wrapping Arrow Simulation */}
        <Icon name="return-down-back" size={48} color="#00F2FE" style={styles.arrow} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  centerTile: {
    width: 130,
    height: 130,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#00F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  centerText: {
    fontFamily: glass.fonts.bold,
    fontSize: 75,
    color: '#FFE259',
    textShadowColor: 'rgba(255, 226, 89, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
    marginTop: -10,
  },
  arrow: {
    position: 'absolute',
    bottom: -10,
    textShadowColor: '#00F2FE',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  floatingTile: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingText: {
    fontFamily: glass.fonts.bold,
    fontSize: 26,
    color: '#FFF',
  },
  star: {
    position: 'absolute',
    opacity: 0.8,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  }
});
