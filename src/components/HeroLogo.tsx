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
        withTiming(-8, { duration: 1500 + delay, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500 + delay, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value }, 
      { rotate: `${delay % 2 === 0 ? 8 : -8}deg` }
    ],
  }));

  return (
    <Animated.View style={[
      styles.floatingTile, 
      { top, left, right, bottom }, 
      animatedStyle
    ]}>
      <LinearGradient 
        colors={['#FFF5D1', '#F5D399']} 
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
      <Icon name="star" size={16} color="#FFD700" style={[styles.star, { top: 20, left: 70 }]} />
      <Icon name="star" size={24} color="#FFD700" style={[styles.star, { top: 70, right: 20 }]} />
      <Icon name="star" size={18} color="#FFD700" style={[styles.star, { bottom: 60, left: 40 }]} />
      <Icon name="star" size={14} color="#FFD700" style={[styles.star, { bottom: 30, right: 80 }]} />

      {/* Floating Letters */}
      <FloatingTile letter="ق" top={-10} right={20} delay={0} />
      <FloatingTile letter="م" top={0} left={30} delay={300} />
      <FloatingTile letter="ل" bottom={40} left={-5} delay={600} />
      <FloatingTile letter="ر" bottom={50} right={0} delay={900} />

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
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  centerTileWrapper: {
    width: 140,
    height: 140,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#00F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#1E1B4B',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
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
    fontSize: 85,
    color: '#FFE259',
    textShadowColor: 'rgba(255, 226, 89, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 20,
    marginTop: -15,
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
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  tileInnerShadow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
  },
  floatingText: {
    fontFamily: glass.fonts.bold,
    fontSize: 32,
    color: '#1E1B4B',
  },
  star: {
    position: 'absolute',
    opacity: 0.9,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  }
});
