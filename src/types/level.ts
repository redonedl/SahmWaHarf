export type ArrowDirection =
  | 'left'
  | 'down'
  | 'left-down'
  | 'down-left'
  | 'left-up'
  | 'up-left'
  | 'none';

export interface WordData {
  answer: string;
  direction: 'horizontal' | 'vertical';
  start_cell: { row: number; col: number };
}

export interface ClueCellData {
  type: 'clue';
  text: string;
  arrowDirection: ArrowDirection;
}

export interface InputCellData {
  type: 'input';
  expectedAnswer: string;
  part_of_words: string[];
  currentValue?: string;
  isCorrect?: boolean;
}

export interface EmptyCellData {
  type: 'empty';
}

export type CellData = ClueCellData | InputCellData | EmptyCellData;

export interface LevelData {
  id: string;
  grid_width: number;
  grid_height: number;
  width?: number;
  height?: number;
  cells: CellData[][];
  words: Record<string, WordData>;
}
