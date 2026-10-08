import React, { useRef, useMemo } from 'react';
import { View, Platform, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../utils/theme';
import { useGameStore, InputCell } from '../store/useGameStore';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { playSfx } from '../utils/AudioManager';

interface CustomArabicKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onHintPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KeyProps {
  label?: string;
  onPress: () => void;
  isIcon?: boolean;
  iconName?: string;
  iconType?: 'Ionicons' | 'FontAwesome5';
  widthMultiplier?: number;
}

const Key: React.FC<KeyProps> = ({ label, onPress, isIcon = false, iconName = '', iconType = 'Ionicons', widthMultiplier = 1 }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.85,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <View style={[styles.keyWrapper, { flex: widthMultiplier }]}>
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1, transform: [{ scale }] }}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(230, 240, 255, 0.85)', 'rgba(200, 220, 255, 0.75)']}
          style={styles.keyBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {isIcon ? (
            iconType === 'Ionicons' ? (
              <Icon name={iconName} size={24} color="#1f2937" />
            ) : (
              <FontAwesome5 name={iconName} size={20} color={theme.colors.coinGold} solid style={{ textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }} />
            )
          ) : (
            <Text style={styles.keyText}>{label}</Text>
          )}
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
};


const hapticOptions = { enableVibrateFallback: true, ignoreAndroidSystemSettings: false };
export const CustomArabicKeyboard: React.FC<CustomArabicKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onHintPress
}) => {
  const activeLevel = useGameStore((state) => state.activeLevel);

  const keyRows = useMemo(() => {
    if (!activeLevel) return [];

    // Extract all unique letters from the grid
    const lettersSet = new Set<string>();
    activeLevel.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.type === 'input' && (cell as InputCell).expectedAnswer) {
          lettersSet.add((cell as InputCell).expectedAnswer);
        }
      });
    });

    // Convert to array and shuffle randomly
    const letters = Array.from(lettersSet);
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    // Split into 2 rows for the keyboard layout
    const mid = Math.ceil(letters.length / 2);
    const row1 = letters.slice(0, mid);
    const row2 = letters.slice(mid);
    
    return [row1, row2];
  }, [activeLevel]);

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(30,41,59,0.95)"
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(30,41,59,0.95)' }]} />
      )}
      <View style={styles.glassOverlay} />
      <View style={styles.keysContainer}>
        {keyRows.map((row, rIndex) => (
          <View key={`row-${rIndex}`} style={styles.row}>
            {/* Top row contains letters only */}
            {row.map((letter, lIndex) => (
              <Key
                key={`letter-${rIndex}-${lIndex}`}
                label={letter}
                onPress={() => {
                  playSfx('tap.mp3');
                  ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
                  onKeyPress(letter);
                }}
              />
            ))}
          </View>
        ))}
        {/* Bottom action row for Backspace and Hint */}
        <View style={styles.row}>
          <Key
            isIcon
            iconName="backspace-outline"
            iconType="Ionicons"
            onPress={() => {
              playSfx('delete.mp3');
              ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
              onBackspace();
            }}
            widthMultiplier={1.5}
          />
          <Key
            isIcon
            iconName="lightbulb"
            iconType="FontAwesome5"
            onPress={onHintPress || (() => {})}
            widthMultiplier={1.5}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  keysContainer: {
    paddingBottom: 35, // extra padding for bottom safe area
    paddingTop: 15,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  keyWrapper: {
    height: 48,
    marginHorizontal: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  keyBackground: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomWidth: 2, // simulated physical depth
    borderBottomColor: 'rgba(150, 180, 220, 0.8)',
  },
  keyText: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: '#1f2937',
  },
});
