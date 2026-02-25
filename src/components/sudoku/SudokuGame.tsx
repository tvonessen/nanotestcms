'use client';

import { Button } from '@heroui/button';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HighscoresTable } from './HighscoresTable';
import { SudokuAuth } from './SudokuAuth';
import {
  type Board,
  type Difficulty,
  formatTime,
  generateSudoku,
  hasConflict,
  isBoardComplete,
} from '@/utils/sudoku';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

interface SudokuGameProps {
  serverUrl: string;
}

export function SudokuGame({ serverUrl }: SudokuGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [puzzle, setPuzzle] = useState<Board | null>(null);
  const [solution, setSolution] = useState<Board | null>(null);
  const [userBoard, setUserBoard] = useState<Board | null>(null);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check session on mount
  useEffect(() => {
    fetch(`${serverUrl}/api/users/me`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) setUser({ id: d.user.id, name: d.user.name, email: d.user.email });
      })
      .catch(() => {});
  }, [serverUrl]);

  const startGame = useCallback(() => {
    const { puzzle: p, solution: s } = generateSudoku(difficulty);
    setPuzzle(p);
    setSolution(s);
    setUserBoard(p.map((r) => [...r]));
    setSelected(null);
    setTime(0);
    setWon(false);
    setScoreSaved(false);
    setRunning(true);
  }, [difficulty]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (running && !won) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, won]);

  function handleCellClick(row: number, col: number) {
    if (won) return;
    setSelected([row, col]);
  }

  function handleNumberInput(num: number | null) {
    if (!selected || !userBoard || !puzzle || won) return;
    const [row, col] = selected;
    if (puzzle[row][col] !== null) return; // preset cell

    const newBoard = userBoard.map((r) => [...r]);
    newBoard[row][col] = num;
    setUserBoard(newBoard);

    if (num !== null && solution && isBoardComplete(newBoard, solution)) {
      setWon(true);
      setRunning(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!selected) return;
    if (e.key >= '1' && e.key <= '9') handleNumberInput(Number(e.key));
    else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') handleNumberInput(null);
    else if (e.key === 'ArrowUp')
      setSelected((prev) => prev ? [Math.max(0, prev[0] - 1), prev[1]] : prev);
    else if (e.key === 'ArrowDown')
      setSelected((prev) => prev ? [Math.min(8, prev[0] + 1), prev[1]] : prev);
    else if (e.key === 'ArrowLeft')
      setSelected((prev) => prev ? [prev[0], Math.max(0, prev[1] - 1)] : prev);
    else if (e.key === 'ArrowRight')
      setSelected((prev) => prev ? [prev[0], Math.min(8, prev[1] + 1)] : prev);
  }

  async function saveScore() {
    if (!user || scoreSaved) return;
    setSavingScore(true);
    try {
      await fetch(`${serverUrl}/api/highscores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user: user.id,
          playerName: user.name,
          time,
          difficulty,
          completedAt: new Date().toISOString(),
        }),
      });
      setScoreSaved(true);
    } catch {
      // Silently fail
    } finally {
      setSavingScore(false);
    }
  }

  function getCellClass(row: number, col: number): string {
    if (!userBoard || !puzzle) return '';
    const isSelected = selected?.[0] === row && selected?.[1] === col;
    const isPreset = puzzle[row][col] !== null;
    const val = userBoard[row][col];
    const isConflict = val !== null && hasConflict(userBoard, row, col, val);
    const isSameNum =
      selected &&
      userBoard[selected[0]][selected[1]] !== null &&
      val === userBoard[selected[0]][selected[1]];
    const isRelated =
      selected &&
      (selected[0] === row ||
        selected[1] === col ||
        (Math.floor(selected[0] / 3) === Math.floor(row / 3) &&
          Math.floor(selected[1] / 3) === Math.floor(col / 3)));

    let cls =
      'flex items-center justify-center text-base sm:text-lg font-semibold cursor-pointer select-none transition-colors ';
    cls += 'aspect-square w-full ';

    if (isSelected) {
      cls += 'bg-primary text-white ';
    } else if (isConflict) {
      cls += 'bg-red-500/20 text-red-500 ';
    } else if (isSameNum) {
      cls += 'bg-primary/20 ';
    } else if (isRelated) {
      cls += 'bg-foreground/8 ';
    } else {
      cls += 'hover:bg-foreground/10 ';
    }

    if (isPreset) {
      cls += 'font-extrabold ';
    } else {
      cls += isConflict ? 'text-red-500 ' : 'text-primary ';
    }

    return cls;
  }

  function getBorderClass(row: number, col: number): string {
    let cls = 'border border-foreground/15 ';
    if (col % 3 === 0) cls += 'border-l-2 border-l-foreground/40 ';
    if (col === 8) cls += 'border-r-2 border-r-foreground/40 ';
    if (row % 3 === 0) cls += 'border-t-2 border-t-foreground/40 ';
    if (row === 8) cls += 'border-b-2 border-b-foreground/40 ';
    return cls;
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-6 gap-6"
      onKeyDown={handleKeyDown}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard input needed
      tabIndex={0}
    >
      {/* Header */}
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center tracking-tight mb-1">
          <span className="text-primary">Hy</span>sudoku
        </h1>
        <p className="text-center text-foreground/50 text-sm">A modern Sudoku experience</p>
      </div>

      {/* Auth */}
      <div className="w-full max-w-md">
        <SudokuAuth user={user} onLogin={setUser} onLogout={() => setUser(null)} />
      </div>

      {/* Difficulty selector */}
      <div className="w-full max-w-md flex gap-1 bg-foreground/10 rounded-xl p-1">
        {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDifficulty(d)}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              difficulty === d
                ? 'bg-primary text-white shadow-sm'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Timer + New Game */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div className="font-mono text-2xl font-bold tracking-widest">
          {formatTime(time)}
        </div>
        <Button color="primary" size="sm" variant="flat" onPress={startGame}>
          New Game
        </Button>
      </div>

      {/* Win banner */}
      {won && (
        <div className="w-full max-w-md bg-green-500/15 border border-green-500/30 rounded-2xl p-4 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            Puzzle solved in {formatTime(time)}!
          </p>
          {user && !scoreSaved && (
            <Button
              color="primary"
              size="sm"
              className="mt-3"
              isLoading={savingScore}
              onPress={saveScore}
            >
              Save score
            </Button>
          )}
          {!user && (
            <p className="text-sm text-foreground/60 mt-2">Sign in to save your score!</p>
          )}
          {scoreSaved && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">✓ Score saved!</p>
          )}
        </div>
      )}

      {/* Sudoku board */}
      {userBoard && puzzle && (
        <div className="w-full max-w-md">
          <div className="grid grid-cols-9 border-2 border-foreground/40 rounded-xl overflow-hidden shadow-lg">
            {userBoard.map((row, ri) =>
              row.map((val, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  className={`${getBorderClass(ri, ci)} ${getCellClass(ri, ci)}`}
                  onClick={() => handleCellClick(ri, ci)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCellClick(ri, ci);
                  }}
                  role="button"
                  tabIndex={-1}
                >
                  {val ?? ''}
                </div>
              )),
            )}
          </div>
        </div>
      )}

      {/* Number pad */}
      <div className="w-full max-w-md grid grid-cols-9 gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handleNumberInput(n)}
            className="aspect-square flex items-center justify-center text-base font-bold rounded-lg bg-foreground/10 hover:bg-primary hover:text-white active:scale-95 transition-all"
          >
            {n}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => handleNumberInput(null)}
        className="w-full max-w-md py-2 text-sm font-semibold rounded-xl bg-foreground/10 hover:bg-foreground/20 active:scale-95 transition-all"
      >
        ✕ Erase
      </button>

      {/* Highscores */}
      <div className="w-full max-w-md mt-4">
        <HighscoresTable serverUrl={serverUrl} key={scoreSaved ? 'saved' : 'initial'} />
      </div>
    </div>
  );
}
