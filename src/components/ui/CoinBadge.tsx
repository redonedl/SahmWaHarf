import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useGameStore } from '../../store/useGameStore';
import { glass } from '../../theme/glass';

export const CoinBadge: React.FC = () => {
  const totalCoins = useGameStore((s) => s.totalCoins);
  const scale = useRef(new Animated.Value(1)).current;
  const prevCoins = useRef(totalCoins);

  useEffect(() => {
    if (totalCoins !== prevCoins.current) {
      prevCoins.current = totalCoins;
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.25, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [totalCoins, scale]);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <Icon name="logo-bitcoin" size={18} color={glass.gold} />
      <Text style={styles.text}>{totalCoins}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: glass.gold + '66',
    gap: 6,
  },
  text: {
    color: glass.gold,
    fontFamily: glass.fonts.bold,
    fontSize: 16,
  },
});
