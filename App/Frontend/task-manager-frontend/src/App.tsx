import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';

type View = 'login' | 'register' | 'dashboard';

function App() {
  const hasToken = !!localStorage.getItem('token');
  const [currentView, setCurrentView] = useState<View>(hasToken ? 'dashboard' : 'login');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">

      {/* Header */}
      {(currentView === 'login' || currentView === 'register') && (
        <div
          className="pt-12 text-center flex flex-col items-center justify-center gap-3 select-none animate-fade-in-up"
          style={{
            '--fade-y': '20px',
            '--fade-blur': '18px',
          } as React.CSSProperties}
        >
          <div className="relative z-10 flex flex-col items-center">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-12 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none z-[-1]" />

            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent uppercase font-mono">
              Task<span className="text-emerald-500 font-light">Manager</span>
            </h1>
          </div>

          <div
            className="w-50 h-2 bg-emerald-500/30 rounded-full animate-neon-pulse"
            style={{
              '--glow-blur-max': '18px',
              '--glow-blur-min': '10px',
            } as React.CSSProperties}
          ></div>
        </div>
      )}
      {/* Login view */}
      {currentView === 'login' && (
        <Login
          onLoginSuccess={() => setCurrentView('dashboard')}
          onNavigateToRegister={() => setCurrentView('register')}
        />
      )}

      {/* Register view */}
      {currentView === 'register' && (
        <Register
          onRegisterSuccess={() => setCurrentView('login')}
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}

      {/* Main panel */}
      {currentView === 'dashboard' && (
        <div className="flex flex-col">

          {/* Navbar */}
          <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-2">
                  {/* Logo / Icon */}
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/20">
                    T
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight">Task Manager</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline text-sm text-slate-400">Zalogowano pomyślnie</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all border border-slate-700 hover:border-slate-500"
                  >
                    Wyloguj
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-white">Twoje Zadania</h2>
              <p className="text-slate-400 mt-1">Zarządzaj swoimi zadaniami.</p>
            </header>

            {/* Task list container */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6">
              <TaskList />
            </div>
          </main>

        </div>
      )}
    </div>
  );
}

export default App;