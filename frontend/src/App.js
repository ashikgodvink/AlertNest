import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function StatusBadge() {
  const [status, setStatus] = useState('checking...');
  const [ok, setOk] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/ping')
      .then(res => res.json())
      .then(() => { setStatus('healthy'); setOk(true); })
      .catch(() => { setStatus('unreachable'); setOk(false); });
  }, []);

  return (
    <div className={`mt-6 px-10 py-4 rounded-xl text-center min-w-72 ${ok === true ? 'bg-green-50 border border-green-200 text-green-800' : ok === false ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-gray-50 border border-gray-200 text-gray-500'}`}>
      <p className="font-semibold">Backend Status: {status}</p>
      <p className="text-sm mt-1">{ok === true ? 'API is running' : ok === false ? 'Cannot reach backend' : 'Connecting...'}</p>
    </div>
  );
}

function Home({ onLogin, onSignup }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <h1 className="text-5xl font-bold text-teal-700">AlertNest</h1>
      <p className="text-gray-500 text-lg">AI-Powered Incident Alert Platform</p>
      <StatusBadge />
      <div className="flex gap-4 mt-6">
        <button onClick={onLogin} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded-full font-semibold transition">Login</button>
        <button onClick={onSignup} className="border border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-2 rounded-full font-semibold transition">Sign Up</button>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('home'); // home | login | signup

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>;
  if (user) return <Dashboard />;

  if (page === 'login') return <Login onSwitch={() => setPage('signup')} />;
  if (page === 'signup') return <Signup onSwitch={() => setPage('login')} />;
  return <Home onLogin={() => setPage('login')} onSignup={() => setPage('signup')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
