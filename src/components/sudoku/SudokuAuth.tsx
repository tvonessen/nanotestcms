'use client';

import { Button } from '@heroui/button';
import { useState } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface SudokuAuthProps {
  user: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
}

type AuthMode = 'login' | 'register';

export function SudokuAuth({ user, onLogin, onLogout }: SudokuAuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await fetch(`${serverUrl}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.errors?.[0]?.message || data?.message || 'Registration failed');
          return;
        }
        // Auto-login after register
        const loginRes = await fetch(`${serverUrl}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.user) {
          onLogin({ id: loginData.user.id, name: loginData.user.name, email: loginData.user.email });
          setShowForm(false);
        }
      } else {
        const res = await fetch(`${serverUrl}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.user) {
          setError(data?.errors?.[0]?.message || data?.message || 'Login failed');
          return;
        }
        onLogin({ id: data.user.id, name: data.user.name, email: data.user.email });
        setShowForm(false);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
    await fetch(`${serverUrl}/api/users/logout`, { method: 'POST', credentials: 'include' });
    onLogout();
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 flex-wrap justify-end">
        <span className="text-sm text-foreground/70">
          Signed in as <strong className="text-foreground">{user.name}</strong>
        </span>
        <Button size="sm" variant="flat" color="danger" onPress={handleLogout}>
          Sign out
        </Button>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <span className="text-sm text-foreground/60">Sign in to save your score</span>
        <Button
          size="sm"
          variant="flat"
          color="primary"
          onPress={() => { setMode('login'); setShowForm(true); }}
        >
          Sign in
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="secondary"
          onPress={() => { setMode('register'); setShowForm(true); }}
        >
          Register
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-foreground/5 rounded-2xl p-5 shadow-lg">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
            mode === 'login'
              ? 'bg-primary text-white'
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
            mode === 'register'
              ? 'bg-primary text-white'
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Register
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-foreground/10 text-foreground placeholder:text-foreground/40 outline-none focus:ring-2 ring-primary text-sm"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg bg-foreground/10 text-foreground placeholder:text-foreground/40 outline-none focus:ring-2 ring-primary text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-3 py-2 rounded-lg bg-foreground/10 text-foreground placeholder:text-foreground/40 outline-none focus:ring-2 ring-primary text-sm"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <div className="flex gap-2 mt-1">
          <Button
            type="button"
            variant="flat"
            size="sm"
            className="flex-1"
            onPress={() => { setShowForm(false); setError(''); }}
          >
            Cancel
          </Button>
          <Button type="submit" color="primary" size="sm" className="flex-1" isLoading={loading}>
            {mode === 'login' ? 'Sign in' : 'Register'}
          </Button>
        </div>
      </form>
    </div>
  );
}
