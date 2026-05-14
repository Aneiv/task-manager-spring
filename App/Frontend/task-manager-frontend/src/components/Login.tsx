import React, { useState } from 'react';
import { login } from '../api/authService';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(username, password);
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      setError("Nieprawidłowa nazwa użytkownika lub hasło.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Witaj ponownie</h1>
          <p className="mt-2 text-sm text-slate-400">Zaloguj się do swojego konta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          {/* Input: Username */}
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-medium text-slate-300">Użytkownik</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white transition-all focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 placeholder:text-slate-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="nazwa użytkownika"
            />
          </div>

          {/* Input: Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-slate-300">Hasło</label>
            </div>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white transition-all focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 placeholder:text-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="wpisz haslo"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Przetwarzanie...
              </span>
            ) : (
              "Zaloguj się"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Nie masz konta?{" "}
          <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Zarejestruj się
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;