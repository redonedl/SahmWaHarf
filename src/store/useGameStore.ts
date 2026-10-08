import { create } from 'zustand';
import AnalyticsManager from '../utils/AnalyticsManager';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from '../storage/mmkv';
import { CATEGORIES } from '../data/categories';
import { DISPLAY_LEVEL_COUNT } from '../assets/levels/index';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ArrowDirection =
  | 'left'
  | 'down'
  | 'left-down'
  | 'down-left'
  | 'left-up'
  | 'up-left'
  | 'none';

export interface ClueCell {
  type: 'clue';
  text: string;
  arrowDirection: ArrowDirection;
}

export interface InputCell {
  type: 'input';
  expectedAnswer: string;
  currentValue?: string;
  isCorrect?: boolean;
  part_of_words: string[];
}

export interface EmptyCell {
  type: 'empty';
}

export type Cell = ClueCell | InputCell | EmptyCell;

export interface WordData {
  answer: string;
  direction: 'horizontal' | 'vertical';
  start_cell: Coordinate;
}

export interface Level {
  id: string;
  grid_width: number;
  grid_height: number;
  width?: number;
  height?: number;
  cells: Cell[][];
  words: Record<string, WordData>;
}

export type LevelProgress = Record<string, Record<string, string>>;
export type InputDirection = 'left' | 'down';

export interface Coordinate {
  row: number;
  col: number;
}

export interface CategoryProgress {
  isUnlocked: boolean;
  unlockedLevels: number[]; // level numbers that are playable, e.g. [1, 2, 3]
  completedLevels: number[]; // level numbers that have been solved, e.g. [1, 2]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a default CategoryProgress for a given category from CATEGORIES. */
const defaultProgress = (categoryId: string): CategoryProgress => {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return { isUnlocked: false, unlockedLevels: [], completedLevels: [] };
  return {
    isUnlocked: !cat.isPremium,
    unlockedLevels: cat.isPremium ? [] : [1],
    completedLevels: [],
  };
};

/** Build the full initial categoryProgress from CATEGORIES. */
const buildInitialProgress = (): Record<string, CategoryProgress> => {
  const result: Record<string, CategoryProgress> = {};
  CATEGORIES.forEach((cat) => {
    result[cat.id] = defaultProgress(cat.id);
  });
  return result;
};

const computeActiveWordCells = (
  grid: Cell[][] | null,
  words: Record<string, WordData> | null,
  selectedCell: Coordinate | null,
  direction: InputDirection,
): Coordinate[] => {
  if (!grid || !words || !selectedCell) return [];
  const { row, col } = selectedCell;
  const cell = grid[row]?.[col];
  if (!cell || cell.type !== 'input') return [];

  const targetDir = direction === 'left' ? 'horizontal' : 'vertical';
  const wordId = cell.part_of_words.find((wid) => words[wid]?.direction === targetDir);

  if (!wordId) return [{ row, col }];

  const word = words[wordId];
  const path: Coordinate[] = [];
  for (let i = 0; i < word.answer.length; i++) {
    if (word.direction === 'horizontal') {
      path.push({ row: word.start_cell.row, col: word.start_cell.col - i });
    } else {
      path.push({ row: word.start_cell.row + i, col: word.start_cell.col });
    }
  }
  return path;
};

// ─── State Interface ──────────────────────────────────────────────────────────

interface GameState {
  // ── Persisted ──
  totalCoins: number;
  categoryProgress: Record<string, CategoryProgress>;
  playlists: Record<string, number[]>; // Maps display level (1-30) to actual file level (1-50)
  currentLevelProgress: LevelProgress;
  levelsPlayedSinceLastAd: number;
  isMusicEnabled: boolean;
  isSfxEnabled: boolean;

  // ── Active session (not persisted) ──
  activeLevel: Level | null;
  activeCategoryId: string | null;
  activeLevelId: number | null;
  selectedCell: Coordinate | null;
  inputDirection: InputDirection;
  isLevelCompleted: boolean;
  showSuccessModal: boolean;
  activeWordCells: Coordinate[];
  wasAlreadyCompleted: boolean; // true if the level was solved before this session

  // ── Category / progress actions ──
  syncCategories: () => void;
  ensurePlaylist: (categoryId: string, maxFiles: number) => void;
  unlockCategory: (
    categoryId: string,
    cost: number,
  ) => { success: boolean; reason?: 'INSUFFICIENT_COINS' | 'ALREADY_UNLOCKED' | 'UNKNOWN_CATEGORY' };
  completeLevel: (categoryId: string, levelId: number, reward?: number) => void;
  addCoins: (amount: number) => void;
  isLevelUnlocked: (categoryId: string, levelId: number) => boolean;
  hasCompletedLevel: (categoryId: string, levelId: number) => boolean;
  resetProgress: () => void;

  // ── Game session actions ──
  loadLevel: (level: Level, categoryId: string, levelId: number) => void;
  setSelectedCell: (row: number, col: number, forceDirection?: InputDirection, autoSkipFilled?: boolean) => void;
  clearSelectedCell: () => void;
  inputLetter: (letter: string) => void;
  backspaceLetter: () => void;
  revealLetter: () => void;
  buyHint: () => boolean;
  earnCoins: () => void;
  checkCorrectWords: () => boolean;
  dismissSuccessModal: () => void;
  incrementLevelsPlayed: () => void;
  resetLevelsPlayed: () => void;
  toggleMusic: () => void;
  toggleSfx: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────────────────
      totalCoins: 200,
      categoryProgress: buildInitialProgress(),
      currentLevelProgress: {},
      levelsPlayedSinceLastAd: 0,
      isMusicEnabled: true,
      isSfxEnabled: true,

      activeLevel: null,
      activeCategoryId: null,
      activeLevelId: null,
      selectedCell: null,
      inputDirection: 'left',
      isLevelCompleted: false,
      showSuccessModal: false,
      activeWordCells: [],
      wasAlreadyCompleted: false,

      // ── Category / progress actions ────────────────────────────────────────

      syncCategories: () => {
        set((state) => {
          const updated = { ...state.categoryProgress };
          let changed = false;
          CATEGORIES.forEach((cat) => {
            if (!updated[cat.id]) {
              updated[cat.id] = defaultProgress(cat.id);
              changed = true;
            }
          });
          return changed ? { categoryProgress: updated } : state;
        });
      },

      ensurePlaylist: (categoryId, maxFiles) => {
        const state = get();
        if (state.playlists && state.playlists[categoryId]) return; // Already exists

        const DISPLAY_COUNT = 30; // Max levels to show in UI
        const progress = state.categoryProgress[categoryId];
        const oldUnlocked = progress?.unlockedLevels ?? [1];
        const highestPinned = Math.max(...oldUnlocked, 0);

        const newPlaylist = [];
        const usedFiles = new Set<number>();

        // Pin levels the user has already seen
        for (let i = 1; i <= DISPLAY_COUNT; i++) {
          if (i <= highestPinned) {
            newPlaylist.push(i);
            usedFiles.add(i);
          } else {
            newPlaylist.push(0);
          }
        }

        // Gather remaining unused files
        let pool = [];
        for (let i = 1; i <= maxFiles; i++) {
          if (!usedFiles.has(i)) {
            pool.push(i);
          }
        }

        // Shuffle the pool
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        // Fill remaining slots
        for (let i = 0; i < DISPLAY_COUNT; i++) {
          if (newPlaylist[i] === 0) {
            newPlaylist[i] = pool.pop() || (i + 1); // fallback if pool is empty
          }
        }

        set((s) => ({
          playlists: {
            ...(s.playlists || {}),
            [categoryId]: newPlaylist,
          },
        }));
      },
      unlockCategory: (categoryId, _cost) => {
        const catalog = CATEGORIES.find((c) => c.id === categoryId);
        if (!catalog) return { success: false, reason: 'UNKNOWN_CATEGORY' };

        const state = get();
        const progress = state.categoryProgress[categoryId];

        if (progress?.isUnlocked) return { success: false, reason: 'ALREADY_UNLOCKED' };

        const cost = catalog.cost; // always use catalog value
        if (state.totalCoins < cost) return { success: false, reason: 'INSUFFICIENT_COINS' };

        AnalyticsManager.logCategoryUnlocked(categoryId, cost);
        set((s) => ({
          totalCoins: s.totalCoins - cost,
          categoryProgress: {
            ...s.categoryProgress,
            [categoryId]: {
              isUnlocked: true,
              unlockedLevels: [1],
              completedLevels: s.categoryProgress[categoryId]?.completedLevels ?? [],
            },
          },
        }));
        return { success: true };
      },

      completeLevel: (categoryId, levelId, reward = 50) => {
        set((state) => {
          const cat = state.categoryProgress[categoryId];
          if (!cat) return state;

          const alreadyCompleted = cat.completedLevels.includes(levelId);
          const coinsToAdd = alreadyCompleted ? 0 : reward;

          const newCompleted = alreadyCompleted
            ? cat.completedLevels
            : [...cat.completedLevels, levelId].sort((a, b) => a - b);

          const nextLevelId = levelId + 1;
          const totalLevels = DISPLAY_LEVEL_COUNT;
          const shouldUnlockNext =
            nextLevelId <= totalLevels && !cat.unlockedLevels.includes(nextLevelId);

          const newUnlocked = shouldUnlockNext
            ? [...cat.unlockedLevels, nextLevelId].sort((a, b) => a - b)
            : cat.unlockedLevels;

          return {
            totalCoins: state.totalCoins + coinsToAdd,
            categoryProgress: {
              ...state.categoryProgress,
              [categoryId]: {
                ...cat,
                completedLevels: newCompleted,
                unlockedLevels: newUnlocked,
              },
            },
          };
        });
      },

      addCoins: (amount) => set((s) => ({ totalCoins: s.totalCoins + amount })),

      isLevelUnlocked: (categoryId, levelId) => {
        const cat = get().categoryProgress[categoryId];
        return cat?.isUnlocked && cat.unlockedLevels.includes(levelId);
      },

      hasCompletedLevel: (categoryId, levelId) => {
        const cat = get().categoryProgress[categoryId];
        return cat?.completedLevels.includes(levelId) ?? false;
      },

      resetProgress: () => {
        if (__DEV__) {
          set({
            totalCoins: 200,
            categoryProgress: buildInitialProgress(),
            currentLevelProgress: {},
      levelsPlayedSinceLastAd: 0,
          });
        }
      },

      // ── Game session actions ───────────────────────────────────────────────

      loadLevel: (level, categoryId, levelId) => {
        const alreadyCompleted = get().hasCompletedLevel(categoryId, levelId);
        if (!alreadyCompleted) {
          AnalyticsManager.logLevelStarted(categoryId, levelId);
        }
        set((state) => {
          let parsedCells2D = level.cells;
          if (level.cells.length > 0 && !Array.isArray(level.cells[0])) {
            parsedCells2D = [];
            for (let r = 0; r < level.height; r++) {
              let rowArray = [];
              for (let c = 0; c < level.width; c++) {
                 const cell = level.cells.find(cell => cell.row === r && cell.col === c);
                 let mappedCell = cell ? { ...cell } : { row: r, col: c, type: 'empty' };
                 if (mappedCell.type === 'empty_block') mappedCell.type = 'empty';
                 if (mappedCell.type === 'input' && mappedCell.answer_char && !mappedCell.expectedAnswer) {
                   mappedCell.expectedAnswer = mappedCell.answer_char;
                 }
                 if (mappedCell.type === 'clue' && mappedCell.arrows && !mappedCell.arrowDirection) {
                   let arrowDirection = 'none';
                   if (mappedCell.arrows.length === 1) {
                     arrowDirection = mappedCell.arrows[0].direction;
                   } else if (mappedCell.arrows.length === 2) {
                     const dirs = mappedCell.arrows.map(a => a.direction).sort();
                     arrowDirection = dirs.join('-');
                     if (arrowDirection === 'down-left') arrowDirection = 'left-down';
                   }
                   mappedCell.arrowDirection = arrowDirection;
                 }
                 rowArray.push(mappedCell);
              }
              parsedCells2D.push(rowArray);
            }
          }

          const loadedCells = parsedCells2D.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              if (cell.type === 'input') {
                const saved = state.currentLevelProgress[`${categoryId}_${levelId}`]?.[`${rIdx}-${cIdx}`];
                const expected = cell.expectedAnswer || cell.answer_char || '';
                return { ...cell, expectedAnswer: expected, currentValue: saved || '', isCorrect: false };
              }
              return { ...cell };
            }),
          );
          return {
            activeLevel: { 
              ...level, 
              cells: loadedCells,
              grid_width: level.grid_width || level.width,
              grid_height: level.grid_height || level.height
            },
            activeCategoryId: categoryId,
            activeLevelId: levelId,
            selectedCell: null,
            inputDirection: 'left',
            isLevelCompleted: alreadyCompleted,
            showSuccessModal: false,
            activeWordCells: [],
            wasAlreadyCompleted: alreadyCompleted,
          };
        });
        get().checkCorrectWords();
      },

      setSelectedCell: (row, col, forceDirection, autoSkipFilled) => {
        set((state) => {
          if (state.isLevelCompleted) return state;
          let newDir = state.inputDirection;
          if (forceDirection) {
            newDir = forceDirection;
          } else if (state.selectedCell?.row === row && state.selectedCell?.col === col) {
            newDir = state.inputDirection === 'left' ? 'down' : 'left';
          }
          const activeWordCells = computeActiveWordCells(
            state.activeLevel?.cells ?? null,
            state.activeLevel?.words ?? null,
            { row, col },
            newDir,
          );

          let targetRow = row;
          let targetCol = col;
          
          if (autoSkipFilled && state.activeLevel) {
            for (const nc of activeWordCells) {
              const cell = state.activeLevel.cells[nc.row]?.[nc.col];
              if (cell && cell.type === 'input') {
                if (!cell.currentValue || cell.currentValue !== cell.expectedAnswer) {
                  targetRow = nc.row;
                  targetCol = nc.col;
                  break;
                }
              }
            }
          }

          return { selectedCell: { row: targetRow, col: targetCol }, inputDirection: newDir, activeWordCells };
        });
      },

      clearSelectedCell: () => set({ selectedCell: null, activeWordCells: [] }),

      inputLetter: (letter) => {
        set((state) => {
          if (state.isLevelCompleted || !state.activeLevel || !state.selectedCell) return state;

          const { row, col } = state.selectedCell;
          const levelId = state.activeLevel.id;
          const levelKey = `${state.activeCategoryId}_${levelId}`;
          
          const coordKey = `${row}-${col}`;

          const newCells = state.activeLevel.cells.map((r, rIdx) =>
            rIdx === row
              ? r.map((c, cIdx) =>
                  cIdx === col && c.type === 'input' ? { ...c, currentValue: letter } : c,
                )
              : r,
          );

          
          const levelProgress = { ...(state.currentLevelProgress[levelKey] ?? {}), [coordKey]: letter };
          let newSelected = state.selectedCell;
          const wordCells = computeActiveWordCells(
            newCells,
            state.activeLevel.words,
            newSelected,
            state.inputDirection,
          );
          const ci = wordCells.findIndex((c) => c.row === row && c.col === col);
          if (ci !== -1 && ci < wordCells.length - 1) {
            for (let ni = ci + 1; ni < wordCells.length; ni++) {
              const nc = wordCells[ni];
              const ncell = newCells[nc.row]?.[nc.col];
              if (ncell?.type === 'input' && !(ncell.currentValue && ncell.currentValue === ncell.expectedAnswer)) {
                newSelected = nc;
                break;
              }
            }
          }

          return {
            activeLevel: { ...state.activeLevel, cells: newCells },
            currentLevelProgress: { ...state.currentLevelProgress, [levelKey]: levelProgress },
            selectedCell: newSelected,
            activeWordCells: wordCells,
          };
        });
        get().checkCorrectWords();
      },

      backspaceLetter: () => {
        set((state) => {
          if (state.isLevelCompleted || !state.activeLevel || !state.selectedCell) return state;

          const { row, col } = state.selectedCell;
          const levelId = state.activeLevel.id;
          const levelKey = `${state.activeCategoryId}_${levelId}`;
          
          const currentCell = state.activeLevel.cells[row]?.[col];
          const hasValue = currentCell?.type === 'input' && !!currentCell.currentValue;

          let newSelected = state.selectedCell;
          let targetRow = row;
          let targetCol = col;
          let newCells = state.activeLevel.cells;
          
          const newProgress = { ...(state.currentLevelProgress[levelKey] ?? {}) };

          const wordCells = computeActiveWordCells(
            newCells,
            state.activeLevel.words,
            newSelected,
            state.inputDirection,
          );

          if (!hasValue) {
            const ci = wordCells.findIndex((c) => c.row === row && c.col === col);
            if (ci > 0) {
              const prev = wordCells[ci - 1];
              targetRow = prev.row;
              targetCol = prev.col;
              newSelected = prev;
            }
          }

          newCells = newCells.map((r, rIdx) =>
            rIdx === targetRow
              ? r.map((c, cIdx) =>
                  cIdx === targetCol && c.type === 'input' ? { ...c, currentValue: '' } : c,
                )
              : r,
          );
          newProgress[`${targetRow}-${targetCol}`] = '';

          return {
            activeLevel: { ...state.activeLevel, cells: newCells },
            currentLevelProgress: { ...state.currentLevelProgress, [levelKey]: newProgress },
            selectedCell: newSelected,
            activeWordCells: wordCells,
          };
        });
        get().checkCorrectWords();
      },

      revealLetter: () => {
        set((state) => {
          if (state.isLevelCompleted || !state.activeLevel || !state.selectedCell) return state;

          const { row, col } = state.selectedCell;
          const levelId = state.activeLevel.id;
          const levelKey = `${state.activeCategoryId}_${levelId}`;
          
          const cell = state.activeLevel.cells[row]?.[col];
          if (cell?.type !== 'input') return state;

          const correctLetter = cell.expectedAnswer;
          const newCells = state.activeLevel.cells.map((r, rIdx) =>
            rIdx === row
              ? r.map((c, cIdx) =>
                  cIdx === col && c.type === 'input' ? { ...c, currentValue: correctLetter } : c,
                )
              : r,
          );
          const levelProgress = {
            ...(state.currentLevelProgress[`${state.activeCategoryId}_${levelId}`] ?? {}),
            [`${row}-${col}`]: correctLetter,
          };

          return {
            activeLevel: { ...state.activeLevel, cells: newCells },
            currentLevelProgress: { ...state.currentLevelProgress, [levelKey]: levelProgress },
          };
        });
        get().checkCorrectWords();
      },

      buyHint: () => {
        const state = get();
        if (state.totalCoins >= 20) {
          set({ totalCoins: state.totalCoins - 20 });
          state.revealLetter();
          if (state.activeCategoryId && state.activeLevelId) {
            AnalyticsManager.logHintUsed(state.activeCategoryId, state.activeLevelId);
          }
          require('../utils/AudioManager').playSfx('buy.mp3');
          return true;
        }
        return false;
      },

      earnCoins: () => set((s) => ({ totalCoins: s.totalCoins + 50 })),

      checkCorrectWords: () => {
        const state = get();
        if (!state.activeLevel) return false;

        const { cells, words, grid_height, grid_width } = state.activeLevel;
        const prevCorrectWordsCount = Object.entries(words).filter(([, w]) => w.answer.split('').every((char, idx) => {
          const r = w.start_cell.row + (w.direction === 'vertical' ? idx : 0);
          const c = w.start_cell.col - (w.direction === 'horizontal' ? idx : 0);
          const cell = state.activeLevel!.cells[r][c];
          return cell.type === 'input' && (cell as InputCell).currentValue === char;
        })).length;
        const newCells = cells.map((row) => row.map((cell) => ({ ...cell })));

        // Reset isCorrect
        newCells.forEach((row) =>
          row.forEach((cell) => {
            if (cell.type === 'input') (cell as InputCell).isCorrect = false;
          }),
        );

        // Mark correct words
        Object.entries(words).forEach(([, word]) => {
          const len = word.answer.length;
          const coords: { r: number; c: number }[] = [];
          let allCorrect = true;

          for (let i = 0; i < len; i++) {
            const r = word.direction === 'vertical' ? word.start_cell.row + i : word.start_cell.row;
            const c = word.direction === 'horizontal' ? word.start_cell.col - i : word.start_cell.col;
            coords.push({ r, c });
            const cell = newCells[r]?.[c];
            if (!cell || cell.type !== 'input' || cell.currentValue?.toUpperCase() !== cell.expectedAnswer.toUpperCase()) {
              allCorrect = false;
            }
          }

          if (allCorrect) {
            coords.forEach(({ r, c }) => {
              const cell = newCells[r]?.[c];
              if (cell?.type === 'input') (cell as InputCell).isCorrect = true;
            });
          }
        });

        // Check if all input cells are correct
        let puzzleComplete = true;
        outer: for (let r = 0; r < grid_height; r++) {
          for (let c = 0; c < grid_width; c++) {
            const cell = newCells[r]?.[c];
            if (cell?.type === 'input' && !(cell as InputCell).isCorrect) {
              puzzleComplete = false;
              break outer;
            }
          }
        }

        set((s) => ({
          activeLevel: { ...s.activeLevel!, cells: newCells as Cell[][] },
          isLevelCompleted: puzzleComplete,
        }));

        // On first completion in this session, record it
        const newCorrectWordsCount = Object.entries(words).filter(([, w]) => w.answer.split('').every((char, idx) => {
          const r = w.start_cell.row + (w.direction === 'vertical' ? idx : 0);
          const c = w.start_cell.col - (w.direction === 'horizontal' ? idx : 0);
          const cell = newCells[r][c];
          return cell.type === 'input' && (cell as InputCell).currentValue === char;
        })).length;
        if (newCorrectWordsCount > prevCorrectWordsCount && !puzzleComplete) {
          require('../utils/AudioManager').playSfx('word_success.mp3');
        }

        if (puzzleComplete && !state.isLevelCompleted) {
          const { activeCategoryId, activeLevelId } = state;
          if (activeCategoryId && activeLevelId !== null) {
            get().completeLevel(activeCategoryId, activeLevelId, 50);
            if (!state.wasAlreadyCompleted) {
              AnalyticsManager.logLevelCompleted(activeCategoryId, activeLevelId);
            }
            set({ showSuccessModal: true });
            require('../utils/AudioManager').playSfx('level_win.mp3');
            const ReactNativeHapticFeedback = require('react-native-haptic-feedback').default;
            ReactNativeHapticFeedback.trigger('notificationSuccess');
          }
        }

        return puzzleComplete;
      },

      dismissSuccessModal: () => set({ showSuccessModal: false }),

      incrementLevelsPlayed: () => set((state) => ({ levelsPlayedSinceLastAd: state.levelsPlayedSinceLastAd + 1 })),
      resetLevelsPlayed: () => set({ levelsPlayedSinceLastAd: 0 }),
      toggleMusic: () => set((state) => ({ isMusicEnabled: !state.isMusicEnabled })),
      toggleSfx: () => set((state) => ({ isSfxEnabled: !state.isSfxEnabled })),
    }),
    {
      name: 'game-store',
      storage: createJSONStorage(() => zustandMMKVStorage),
      version: 2,
      partialize: (s) => ({
        totalCoins: s.totalCoins,
        categoryProgress: s.categoryProgress,
        currentLevelProgress: s.currentLevelProgress,
        levelsPlayedSinceLastAd: s.levelsPlayedSinceLastAd,
        isMusicEnabled: s.isMusicEnabled,
        isSfxEnabled: s.isSfxEnabled,
      }),
      migrate: (persisted: any, version: number) => {
        if (version < 2) {
          // Old schema had flat unlockedLevels / completedLevels arrays
          const oldCoins: number = persisted.totalCoins ?? persisted.coins ?? 200;
          const oldUnlocked: (string | number)[] = persisted.unlockedLevels ?? [];
          const oldCompleted: (string | number)[] = persisted.completedLevels ?? [];

          const toNum = (v: string | number): number =>
            typeof v === 'number' ? v : parseInt(String(v).replace(/\D/g, ''), 10) || 0;

          const generalProgress: CategoryProgress = {
            isUnlocked: true,
            unlockedLevels: oldUnlocked.map(toNum).filter((x) => !!x).sort((a, b) => a - b),
            completedLevels: oldCompleted.map(toNum).filter((x) => !!x).sort((a, b) => a - b),
          };
          if (!generalProgress.unlockedLevels.includes(1)) {
            generalProgress.unlockedLevels = [1, ...generalProgress.unlockedLevels].sort((a, b) => a - b);
          }

          const categoryProgress: Record<string, CategoryProgress> = {
            ...buildInitialProgress(),
            general: generalProgress,
            // Preserve any existing category progress from the old store if present
            ...(persisted.categoryProgress ?? {}),
          };

          return { totalCoins: oldCoins, categoryProgress, currentLevelProgress: persisted.currentLevelProgress ?? {},
            levelsPlayedSinceLastAd: persisted.levelsPlayedSinceLastAd ?? 0,
            isMusicEnabled: persisted.isMusicEnabled ?? true,
            isSfxEnabled: persisted.isSfxEnabled ?? true };
        }
        return persisted;
      },
    },
  ),
);
