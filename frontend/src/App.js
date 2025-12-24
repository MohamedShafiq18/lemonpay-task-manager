import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [view, setView] = useState('login');

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleRegister = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setView('login');
  };

  if (token) {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (view === 'register') {
    return (
      <Register
        onRegister={handleRegister}
        onSwitchToLogin={() => setView('login')}
      />
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      onSwitchToRegister={() => setView('register')}
    />
  );
}