import type { Metadata } from 'next';
import { SudokuGame } from '@/components/sudoku/SudokuGame';

export const metadata: Metadata = {
  title: 'Hysudoku',
  description: 'Play Sudoku, compete for highscores, and challenge yourself!',
};

export default function SudokuPage() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
  return <SudokuGame serverUrl={serverUrl} />;
}
