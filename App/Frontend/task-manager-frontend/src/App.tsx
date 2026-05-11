import { useState } from 'react';
import Login from './components/Login';
import CategoryList from './components/CategoryList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <div className="App">
      <h1>Task Manager</h1>
      {!isLoggedIn ? (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <div>
          <button onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); }}>Wyloguj</button>
          <CategoryList />
        </div>
      )}
    </div>
  );
}

export default App;