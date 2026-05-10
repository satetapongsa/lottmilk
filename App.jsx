import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Settings, Activity, Zap, Target, Brain, Sparkles, ShieldCheck, BookOpen, Info, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const items = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
    { icon: <TrendingUp size={20} />, label: 'Predictions', path: '/predictions' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];
  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Activity className="gradient-text" size={32} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Lotto<span className="gradient-text">Pro</span></h2>
      </div>
      <nav>
        {items.map((item, i) => (
          <Link key={i} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
            {item.icon}<span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

const Dashboard = () => {
  const [sum, setSum] = useState(null);
  const [his, setHis] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8000/api/summary').then(r => r.json()).then(d => setSum(d));
    fetch('http://localhost:8000/api/history').then(r => r.json()).then(d => setHis(d));
  }, []);
  const stats = [
    { t: 'งวดล่าสุด', v: sum?.last_date || '...', s: `รวม ${sum?.total_draws || 0} งวด`, i: <Zap />, c: '#6366f1' },
    { t: '2 ตัวบน', v: sum?.last_top2 || '--', s: 'First Prize (Last 2)', i: <Target />, c: '#a855f7' },
    { t: '2 ตัวล่าง', v: sum?.last_bottom2 || '--', s: 'Two Digit Suffix', i: <Activity />, c: '#10b981' }
  ];
  return (
    <div>
      <header style={{ marginBottom: '3rem' }}><h1 style={{ fontSize: '2.5rem' }}>Intelligence <span className="gradient-text">Dashboard</span></h1></header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: `${s.c}22`, borderRadius: '16px', color: s.c }}>{s.i}</div>
            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{s.t}</p><h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.v}</h2><p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{s.s}</p></div>
          </div>
        ))}
      </div>
      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem' }}>ประวัติการออกรางวัล</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}><th style={{ padding: '1rem' }}>วันที่</th><th style={{ padding: '1rem' }}>2 ตัวบน</th><th style={{ padding: '1rem' }}>2 ตัวล่าง</th></tr></thead>
          <tbody>{his.map((h, i) => (<tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}><td style={{ padding: '1rem' }}>{h.date.split('T')[0]}</td><td style={{ padding: '1rem', fontWeight: 700 }}>{h.top2}</td><td style={{ padding: '1rem', fontWeight: 700 }}>{h.bottom2}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
};

const Predictions = () => {
  const [d, setD] = useState(null);
  const [a, setA] = useState(null);
  useEffect(() => {
    fetch('http://localhost:8000/api/predictions').then(r => r.json()).then(x => setD(x));
    fetch('http://localhost:8000/api/alpha-prediction').then(r => r.json()).then(x => setA(x));
  }, []);
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>AI <span className="gradient-text">Predictions</span></h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div className="glass-card"><h3>Moving Average</h3><p>บน: {d?.ma?.top2} | ล่าง: {d?.ma?.bottom2}</p></div>
        <div className="glass-card"><h3>Prob Fit</h3><p>บน: {d?.prob?.top2?.num} | ล่าง: {d?.prob?.bottom2?.num}</p></div>
      </div>
      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2>LottoPro-Alpha</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
          <div>{a?.top2?.map((item, i) => (<div key={i}>{item.number}: {item.probability}%</div>))}</div>
          <div>{a?.bottom2?.map((item, i) => (<div key={i}>{item.number}: {item.probability}%</div>))}</div>
        </div>
      </div>
    </div>
  );
};

const Settings = () => (
  <div>
    <h1>Settings</h1>
    <div className="glass-card"><p>System: Online | Mode: God-Mode V2</p></div>
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
