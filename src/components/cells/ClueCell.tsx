import React from 'react';
import { View, Platform, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BlurView } from '@react-native-community/blur';
import { ClueCell as ClueCellType, ArrowDirection } from '../../store/useGameStore';
import { theme } from '../../utils/theme';

interface ClueCellProps {
  cell: ClueCellType;
  onPress?: () => void;
}

const SPACING = 6;

// Helper to draw the arrow based on direction
const renderArrow = (direction: ArrowDirection) => {
  const strokeColor = '#ffffff';
  const strokeWidth = 2.5;

  switch (direction) {
    case 'left':
      // Pointing Left visually (moving from right to left)
      return (
        <Svg width="100%" height="100%" viewBox="0 0 24 24">
          <Path d="M20 12 L4 12 M10 6 L4 12 L10 18" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'down':
      return (
        <Svg width="100%" height="100%" viewBox="0 0 24 24">
          <Path d="M12 4 L12 20 M6 14 L12 20 L18 14" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'left-down':
      // Starts left visually, bends down
      return (
        <Svg width="100%" height="100%" viewBox="0 0 24 24">
          <Path d="M20 8 L8 8 L8 20 M2 14 L8 20 L14 14" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'down-left':
      // Starts down visually, bends left
      return (
        <Svg width="100%" height="100%" viewBox="0 0 24 24">
          <Path d="M16 4 L16 16 L4 16 M10 10 L4 16 L10 22" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    default:
      return null;
  }
};

import { TouchableOpacity } from 'react-native';

export const ClueCell: React.FC<ClueCellProps> = ({ cell, onPress }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      {Platform.OS === 'ios' ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(30,41,59,0.9)"
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(30,41,59,0.9)' }]} />
      )}
      <View style={styles.glassOverlay} />
      <View style={styles.textContainer}>
        <Text style={styles.text} numberOfLines={3} adjustsFontSizeToFit>
          {cell.text}
        </Text>
      </View>
      <View style={styles.arrowContainer}>
        {renderArrow(cell.arrowDirection)}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    margin: SPACING / 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopColor: 'rgba(255,255,255,0.6)',
    padding: 2,
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Slightly darken the blur
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
  },
  text: {
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
    color: '#ffffff',
    writingDirection: 'rtl',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  arrowContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 2,
  },
});
