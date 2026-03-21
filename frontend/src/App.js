import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import './App.css';

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
    <div className={`status-badge ${ok === true ? 'ok' : ok === false ? 'err' : ''}`}>
      <strong>Backend Status: {status}</strong>
      <p>{ok === true ? 'API is running' : ok === false ? 'Cannot reach backend' : 'Connecting...'}</p>
    </div>
  );
}

function Home() {
  return (
    <div className="home">
      <h1>AlertNest</h1>
      <p className="subtitle">AI-Powered Incident Alert Platform</p>
      <StatusBadge />
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return user ? <Dashboard /> : <Home />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
