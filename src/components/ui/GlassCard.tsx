import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { glass } from '../../theme/glass';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  locked?: boolean;
  gradientTint?: [string, string];
}

export const GlassCard: React.FC<Props> = ({ children, style, locked, gradientTint }) => {
  const containerStyle = [
    styles.container,
    glass.shadow,
    locked && styles.locked,
    style,
  ];

  if (Platform.OS === 'ios') {
    return (
      <View style={containerStyle}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(30,25,80,0.8)"
        />
        {/* Glass surface overlay */}
        <View style={[StyleSheet.absoluteFill, styles.overlay]} />
        {/* Category gradient tint */}
        {gradientTint && (
          <LinearGradient
            colors={[gradientTint[0] + '40', gradientTint[1] + '40']}
            style={StyleSheet.absoluteFill}
          />
        )}
        {/* Specular top line */}
        <View style={styles.specular} />
        {children}
      </View>
    );
  }

  // Android: skip BlurView inside lists; use semi-transparent gradient instead
  return (
    <View style={containerStyle}>
      <LinearGradient
        colors={glass.glassHighlight}
        style={StyleSheet.absoluteFill}
      />
      {gradientTint && (
        <LinearGradient
          colors={[gradientTint[0] + '40', gradientTint[1] + '40']}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.specular} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: glass.surface.backgroundColor,
    borderRadius: glass.surface.borderRadius,
    borderWidth: glass.surface.borderWidth,
    borderColor: glass.surface.borderColor,
    overflow: 'hidden',
  },
  locked: {
    opacity: 0.7,
  },
  overlay: {
    backgroundColor: glass.surface.backgroundColor,
  },
  specular: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});
