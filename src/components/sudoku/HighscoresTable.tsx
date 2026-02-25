'use client';

import { formatTime } from '@/utils/sudoku';
import { useEffect, useState } from 'react';

interface HighscoreEntry {
  id: string;
  playerName: string;
  time: number;
  difficulty: string;
  completedAt: string;
}

interface HighscoresTableProps {
  serverUrl: string;
}

export function HighscoresTable({ serverUrl }: HighscoresTableProps) {
  const [scores, setScores] = useState<HighscoreEntry[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      try {
        const res = await fetch(
          `${serverUrl}/api/highscores?where[difficulty][equals]=${difficulty}&sort=time&limit=10`,
          { cache: 'no-store' },
        );
        const data = await res.json();
        setScores(data.docs || []);
      } catch {
        setScores([]);
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
  }, [difficulty, serverUrl]);

  const tabs = [
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
  ] as const;

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">🏆 Highscores</h2>
      <div className="flex gap-1 bg-foreground/10 rounded-xl p-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setDifficulty(tab.key)}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              difficulty === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-foreground/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : scores.length === 0 ? (
          <p className="text-center py-8 text-foreground/50 text-sm">No scores yet. Be the first!</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/10">
                <th className="text-left px-4 py-2 text-foreground/50 font-medium w-8">#</th>
                <th className="text-left px-4 py-2 text-foreground/50 font-medium">Player</th>
                <th className="text-right px-4 py-2 text-foreground/50 font-medium">Time</th>
                <th className="text-right px-4 py-2 text-foreground/50 font-medium hidden sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, i) => (
                <tr
                  key={score.id}
                  className={`border-b border-foreground/5 last:border-0 ${
                    i === 0 ? 'bg-primary/10' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-bold">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                  </td>
                  <td className="px-4 py-2.5 font-medium truncate max-w-[120px]">
                    {score.playerName}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-primary font-semibold">
                    {formatTime(score.time)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-foreground/50 hidden sm:table-cell text-xs">
                    {new Date(score.completedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
