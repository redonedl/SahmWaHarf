import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const LockOverlay: React.FC = () => (
  <View style={styles.container}>
    <Icon name="lock-closed" size={14} color="rgba(255,255,255,0.6)" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 6,
    right: 6, // Matches checkIcon placement
    zIndex: 10,
  },
});
