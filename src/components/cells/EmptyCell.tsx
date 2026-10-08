import React from 'react';
import { View, StyleSheet } from 'react-native';

const SPACING = 6;

export const EmptyCell: React.FC = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    margin: SPACING / 2,
    backgroundColor: 'transparent',
  },
});
