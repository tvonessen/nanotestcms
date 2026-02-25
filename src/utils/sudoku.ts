export type Board = (number | null)[][];
export type Difficulty = 'easy' | 'medium' | 'hard';

/** Shuffle an array in-place using Fisher-Yates. */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Check if placing `num` at (row, col) is valid. */
function isValid(board: number[][], row: number, col: number, num: number): boolean {
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[boxRow + r][boxCol + c] === num) return false;
    }
  }
  return true;
}

/** Fill the board with a valid sudoku solution using backtracking. */
function fillBoard(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/** Count solutions up to a max of 2 (for uniqueness check). */
function countSolutions(board: (number | null)[][], limit = 2): number {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        let count = 0;
        for (let num = 1; num <= 9; num++) {
          const full = board as number[][];
          full[row][col] = num;
          if (isValid(full, row, col, num)) {
            count += countSolutions(board, limit);
            if (count >= limit) {
              board[row][col] = null;
              return count;
            }
          }
          board[row][col] = null;
        }
        return count;
      }
    }
  }
  return 1;
}

const CLUES: Record<Difficulty, number> = {
  easy: 38,
  medium: 30,
  hard: 24,
};

/** Generate a Sudoku puzzle. Returns [puzzle, solution]. */
export function generateSudoku(difficulty: Difficulty = 'medium'): { puzzle: Board; solution: Board } {
  const sol: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(sol);

  const solution: Board = sol.map((r) => [...r]);
  const puzzle: Board = sol.map((r) => [...r] as (number | null)[]);

  const clues = CLUES[difficulty];
  const cells = shuffle(Array.from({ length: 81 }, (_, i) => i));

  let removed = 0;
  for (const idx of cells) {
    if (81 - removed <= clues) break;
    const row = Math.floor(idx / 9);
    const col = idx % 9;
    const backup = puzzle[row][col];
    puzzle[row][col] = null;
    removed++;
  }

  return { puzzle, solution };
}

/** Check if the board is completely and correctly filled. */
export function isBoardComplete(board: Board, solution: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

/** Check if placing a value at (row, col) conflicts with other cells. */
export function hasConflict(board: Board, row: number, col: number, value: number): boolean {
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === value) return true;
  }
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === value) return true;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (boxRow + r !== row || boxCol + c !== col) {
        if (board[boxRow + r][boxCol + c] === value) return true;
      }
    }
  }
  return false;
}

/** Format seconds to MM:SS string. */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
