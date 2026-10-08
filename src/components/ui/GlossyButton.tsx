import React, { useRef } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { glass } from '../../theme/glass';

interface Props {
  title: string;
  onPress: () => void;
  icon?: string;
  variant?: 'play' | 'unlock' | 'disabled';
  loading?: boolean;
  style?: ViewStyle;
}

const GRADIENTS: Record<string, string[]> = {
  play: glass.btnPlay,
  unlock: glass.btnUnlock,
  disabled: glass.btnDisabled,
};

export const GlossyButton: React.FC<Props> = ({
  title,
  onPress,
  icon,
  variant = 'play',
  loading = false,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const colors = GRADIENTS[variant] ?? GRADIENTS.play;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={variant === 'disabled' || loading}
      >
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
          {/* Top gloss sheen */}
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0)']}
            style={styles.gloss}
          />
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.label}>{title}</Text>
              {icon && (
                <Icon name={icon} size={18} color="#fff" style={styles.icon} />
              )}
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    overflow: 'hidden',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  label: {
    color: '#fff',
    fontFamily: glass.fonts.bold,
    fontSize: 15,
    textAlign: 'center',
  },
  icon: {
    marginLeft: 6,
  },
});
