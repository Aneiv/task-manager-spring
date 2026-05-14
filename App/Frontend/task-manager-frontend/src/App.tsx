import { useState } from 'react';
import Login from './components/Login';
import TaskList from './components/TaskList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    // Main container
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">

      {!isLoggedIn ? (
        // Login view
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        // Logged in view
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

          {/* Main content*/}
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