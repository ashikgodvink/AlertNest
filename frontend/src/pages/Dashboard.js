import React, { useEffect, useState } from 'react';
import { getIncidents } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getIncidents()
      .then(res => setIncidents(res.data.incidents))
      .catch(err => setError('Failed to load incidents'));
  }, []);

  return (
    <div>
      <h2>Welcome, {user?.name} ({user?.role})</h2>
      <button onClick={logout}>Logout</button>
      <h3>Incidents</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {incidents.length === 0 ? (
        <p>No incidents found.</p>
      ) : (
        <ul>
          {incidents.map(i => (
            <li key={i.id}>
              <strong>{i.title}</strong> — {i.severity} severity — {i.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
