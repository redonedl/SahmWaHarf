import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Cell } from '../../store/useGameStore';
import { theme } from '../../utils/theme';
import LinearGradient from 'react-native-linear-gradient';

interface InputCellProps {
  cell: Cell;
  isSelected: boolean;
  isActivePath: boolean;
  onPress: () => void;
}

const SPACING = 6;

export const InputCell: React.FC<InputCellProps> = ({
  cell,
  isSelected,
  isActivePath,
  onPress,
}) => {
  if (cell.type !== 'input') return null;

  // Determine the cell's background styling
  let containerStyle: any = styles.container;
  let textStyle: any = styles.text;
  let gradientColors = ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']; // Default glass white

  if (cell.isCorrect) {
    gradientColors = [theme.colors.wordSuccessBg, '#16a34a'];
    textStyle = [styles.text, styles.textCorrect];
  } else if (isSelected) {
    gradientColors = [theme.colors.cellFocusedBg, '#FFA000'];
    textStyle = [styles.text, styles.textFocused];
  } else if (isActivePath) {
    gradientColors = ['rgba(0, 242, 254, 0.4)', 'rgba(79, 172, 254, 0.2)'];
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.wrapper}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradientColors}
        style={[containerStyle, isSelected && styles.selectedBorder, cell.isCorrect && styles.correctBorder]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={textStyle}>{cell.currentValue || ''}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: SPACING / 2,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  container: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderTopColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBorder: {
    borderColor: '#FFA000',
    borderWidth: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  correctBorder: {
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  text: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: '#000000', // Crisp black for readability
  },
  textFocused: {
    color: '#000000', // Keep dark for contrast against gold
  },
  textCorrect: {
    color: '#ffffff', // White against the neon blue success background
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
