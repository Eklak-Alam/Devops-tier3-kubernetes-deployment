'use client';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newReplicas, setNewReplicas] = useState(1);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // --- 1. FETCH DATA (READ) ---
  useEffect(() => {
    fetchDeployments();
  }, []);

  async function fetchDeployments() {
    try {
      const res = await fetch(`${API_URL}/api/deployments`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDeployments(data);
      setLoading(false);
    } catch (err) {
      console.error("Backend Error:", err);
      setError(true);
      setLoading(false);
    }
  }

  // --- 2. CREATE FUNCTION ---
  async function handleCreate(e) {
    e.preventDefault();
    if (!newName) return;
    try {
      const res = await fetch(`${API_URL}/api/deployments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, replicas: newReplicas }),
      });
      const newItem = await res.json();
      setDeployments([newItem, ...deployments]); // Add to UI instantly
      setNewName(''); // Reset form
      setNewReplicas(1);
    } catch (err) {
      alert("Failed to create deployment");
    }
  }

  // --- 3. DELETE FUNCTION ---
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to terminate this pod?")) return;
    try {
      await fetch(`${API_URL}/api/deployments/${id}`, { method: 'DELETE' });
      setDeployments(deployments.filter(d => d.id !== id)); // Remove from UI instantly
    } catch (err) {
      alert("Failed to delete");
    }
  }

  // --- 4. UPDATE FUNCTION (Scale Replicas) ---
  async function handleScale(id, currentReplicas, direction) {
    const newCount = direction === 'up' ? currentReplicas + 1 : currentReplicas - 1;
    if (newCount < 0) return; // Cannot have negative replicas

    try {
      // Optimistic UI Update (Update UI immediately before waiting for server)
      setDeployments(deployments.map(d => d.id === id ? { ...d, replicas: newCount } : d));

      await fetch(`${API_URL}/api/deployments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replicas: newCount }),
      });
    } catch (err) {
      alert("Failed to scale");
      fetchDeployments(); // Revert if failed
    }
  }

  return (
    <main className="min-h-screen pt-20 bg-zinc-950 text-zinc-100 selection:bg-blue-500/30 font-sans">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* --- CONTROL PANEL (CREATE FORM) --- */}
        <div className="mb-12 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-500">➜</span> New Deployment
          </h3>
          <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Service Name (e.g. redis-cache)" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <div className="flex items-center gap-3 bg-black/50 border border-zinc-700 rounded-lg px-4">
              <span className="text-zinc-500 text-sm">Replicas:</span>
              <input 
                type="number" 
                min="1" 
                max="10" 
                value={newReplicas}
                onChange={(e) => setNewReplicas(Number(e.target.value))}
                className="w-16 bg-transparent text-white font-mono focus:outline-none"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20">
              Deploy
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-bold text-white">Active Clusters</h2>
          <div className="flex gap-2 items-center">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-zinc-400 text-sm">Live Connection</span>
          </div>
        </div>

        {/* --- ERROR STATE --- */}
        {error && !loading && (
          <div className="p-6 rounded-xl border border-red-500/20 bg-red-900/10 text-red-400 text-center">
            <p className="font-semibold">⚠ Cannot connect to Backend.</p>
            <p className="text-sm opacity-70">Check if {API_URL} is running.</p>
          </div>
        )}

        {/* --- DATA GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deployments.map((deploy) => (
            <div key={deploy.id} className="group relative p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{deploy.name}</h3>
                    <span className="text-xs text-zinc-500 font-mono">ID: {deploy.id}</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-1 rounded border border-green-500/30 bg-green-500/10 text-green-400">
                      {deploy.status}
                    </span>
                    {/* DELETE BUTTON */}
                    <button 
                        onClick={() => handleDelete(deploy.id)}
                        className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                        title="Terminate Pod"
                    >
                        ✕
                    </button>
                </div>
              </div>

              {/* SCALE CONTROLS */}
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-zinc-800/50">
                <span className="text-zinc-400 text-sm font-medium">Replicas</span>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handleScale(deploy.id, deploy.replicas, 'down')}
                        className="w-8 h-8 rounded bg-zinc-800 text-white hover:bg-zinc-700 transition-colors flex items-center justify-center font-bold"
                    >-</button>
                    
                    <span className="text-xl font-mono text-white min-w-[20px] text-center">{deploy.replicas}</span>
                    
                    <button 
                        onClick={() => handleScale(deploy.id, deploy.replicas, 'up')}
                        className="w-8 h-8 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center justify-center font-bold"
                    >+</button>
                </div>
              </div>

              {/* VISUAL BAR */}
              <div className="mt-4 flex gap-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                 <div style={{ width: `${Math.min(deploy.replicas * 10, 100)}%` }} className="h-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-500"></div>
              </div>

            </div>
          ))}
        </div>
      </section>
    </main>
  );
}