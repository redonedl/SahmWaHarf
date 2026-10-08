import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { glass } from '../../theme/glass';

interface Props {
  children: React.ReactNode;
}

export const ScreenBackground: React.FC<Props> = ({ children }) => (
  <LinearGradient colors={glass.bgGradient} style={styles.container}>
    {/* Decorative orbs */}
    <View style={[styles.orb, styles.orb1]} />
    <View style={[styles.orb, styles.orb2]} />
    <View style={[styles.orb, styles.orb3]} />
    <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.18,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: '#7F7FD5',
    top: -60,
    right: -80,
  },
  orb2: {
    width: 220,
    height: 220,
    backgroundColor: '#38EF7D',
    bottom: 120,
    left: -60,
  },
  orb3: {
    width: 180,
    height: 180,
    backgroundColor: '#00C6FF',
    top: '40%',
    right: 20,
    opacity: 0.12,
  },
});
