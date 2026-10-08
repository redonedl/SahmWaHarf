import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useGameStore, Cell } from '../store/useGameStore';
import { ClueCell } from './cells/ClueCell';
import { InputCell } from './cells/InputCell';
import { EmptyCell } from './cells/EmptyCell';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

interface FlatCell {
  cell: Cell;
  row: number;
  col: number;
  id: string;
}

export const GameBoard: React.FC = () => {
  const { activeLevel, selectedCell, setSelectedCell, activeWordCells } = useGameStore();

  const flatData: FlatCell[] = useMemo(() => {
    if (!activeLevel) return [];
    const data: FlatCell[] = [];
    activeLevel.cells.forEach((row, rIdx) => {
      // In native RTL, flexDirection: 'row' with flexWrap: 'wrap' will
      // automatically place items from Right to Left.
      // So we can just push them in normal order (col 0 first, col 1 next).
      // This maps perfectly to the LTR JSON layout.
      row.forEach((cell, cIdx) => {
        data.push({
          cell,
          row: rIdx,
          col: cIdx,
          id: `${rIdx}-${cIdx}`,
        });
      });
    });
    return data;
  }, [activeLevel]);

  if (!activeLevel) {
    return <View style={styles.emptyBoard} />;
  }

  // Calculate cell size based on screen width and grid width
  const padding = 16;
  const availableWidth = width - padding * 2;
  const cellSize = Math.floor(availableWidth / activeLevel.grid_width);

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.gridWrapper, 
          { width: cellSize * activeLevel.grid_width }
        ]}
      >
        {flatData.map((item) => {
          const isSelected =
            selectedCell?.row === item.row && selectedCell?.col === item.col;
            
          const isActivePath = activeWordCells.some(
            (coord) => coord.row === item.row && coord.col === item.col
          );

          const handlePress = () => {
            if (item.cell.type === 'input') {
              setSelectedCell(item.row, item.col);
            }
          };

          const handleCluePress = () => {
            if (item.cell.type !== 'clue') return;
            const dir = item.cell.arrowDirection;
            let targetRow = item.row;
            let targetCol = item.col;
            let inputDir: 'left' | 'down' = 'left';
            
            if (dir === 'left' || dir === 'left-down') {
              targetCol -= 1; // Move left
              inputDir = 'left';
            } else if (dir === 'down' || dir === 'down-left') {
              targetRow += 1; // Move down
              inputDir = 'down';
            }
            
            if (
              targetRow >= 0 && 
              targetRow < activeLevel.grid_height && 
              targetCol >= 0 && 
              targetCol < activeLevel.grid_width
            ) {
              setSelectedCell(targetRow, targetCol, inputDir, true);
            }
          };

          return (
            <View key={item.id} style={{ width: cellSize, height: cellSize }}>
              {item.cell.type === 'empty' && <EmptyCell />}
              {item.cell.type === 'clue' && (
                <ClueCell 
                  cell={item.cell} 
                  onPress={handleCluePress}
                />
              )}
              {item.cell.type === 'input' && (
                <InputCell
                  cell={item.cell}
                  isSelected={isSelected}
                  isActivePath={isActivePath}
                  onPress={handlePress}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    width: '100%',
  },
  gridWrapper: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  emptyBoard: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
