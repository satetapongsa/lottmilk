import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Settings as SettingsIcon, Activity, Zap, Target, Brain, Sparkles, ShieldCheck, BookOpen, Info, HelpCircle, Flame, Snowflake, BarChart3, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const items = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
    { icon: <BarChart3 size={20} />, label: 'Heatmap', path: '/heatmap' },
    { icon: <TrendingUp size={20} />, label: 'AI Predictions', path: '/predictions' },
    { icon: <SettingsIcon size={20} />, label: 'Settings', path: '/settings' },
  ];
  return (
    <aside className="sidebar">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Activity className="gradient-text" size={32} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Lotto<span className="gradient-text">Pro</span></h2>
      </Link>
      <nav>
        {items.map((item, i) => (
          <Link key={i} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
            {item.icon}<span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', fontSize: '0.75rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Engine Version</p>
        <p style={{ fontWeight: 600 }}>God-Mode Alpha V2.5</p>
      </div>
    </aside>
  );
};

const Dashboard = () => {
  const [sum, setSum] = useState(null);
  const [his, setHis] = useState([]);
  useEffect(() => {
    fetch('/api/summary').then(r => r.json()).then(d => setSum(d));
    fetch('/api/history').then(r => r.json()).then(d => setHis(d));
  }, []);
  const stats = [
    { t: 'Latest Draw', v: sum?.last_date || '...', s: `Total ${sum?.total_draws || 0} Draws`, i: <Zap />, c: '#6366f1' },
    { t: 'Top 2 Digits', v: sum?.last_top2 || '--', s: 'Main Prize Ending', i: <Target />, c: '#a855f7' },
    { t: 'Bottom 2 Digits', v: sum?.last_bottom2 || '--', s: 'Government Lottery', i: <Activity />, c: '#10b981' }
  ];
  return (
    <div>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Intelligence <span className="gradient-text">Command Center</span></h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: `${s.c}22`, borderRadius: '16px', color: s.c }}>{s.i}</div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{s.t}</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.v}</h2>
              <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{s.s}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Big Data Statistical Processing</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Our AI has analyzed massive datasets to identify the highest probability trends.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/heatmap" className="glass-card" style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              Heatmap <ChevronRight size={18} />
            </Link>
            <Link to="/predictions" className="glass-card" style={{ padding: '0.75rem 1.5rem', background: 'var(--accent-primary)', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              Predictions <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Draw History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Top 2</th>
              <th style={{ padding: '1rem' }}>Bottom 2</th>
            </tr>
          </thead>
          <tbody>
            {his.map((h, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '1rem' }}>{h.date}</td>
                <td style={{ padding: '1rem', fontWeight: 700 }}>{h.top2}</td>
                <td style={{ padding: '1rem', fontWeight: 700 }}>{h.bottom2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Heatmap = ({ data, color, title }) => {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
        {data.map((item, i) => {
          const intensity = item.count / max;
          return (
            <div 
              key={i} 
              title={`Number: ${item.number}, Count: ${item.count}`}
              style={{ 
                aspectRatio: '1', 
                background: item.count > 0 ? `${color}${Math.floor(intensity * 180 + 75).toString(16).padStart(2, '0')}` : 'rgba(255,255,255,0.02)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: intensity > 0.5 ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                cursor: 'default'
              }}
            >
              {item.number}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HeatmapPage = () => {
  const [s, setS] = useState(null);
  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(x => setS(x));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Statistical <span className="gradient-text">Heatmap</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Density analysis of {s?.total_draws || 0} draws ({s?.total_years || 0} years)</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {s?.top2?.heatmap && <Heatmap title="Top 2 Digits Frequency" data={s.top2.heatmap} color="#6366f1" />}
        {s?.bottom2?.heatmap && <Heatmap title="Bottom 2 Digits Frequency" data={s.bottom2.heatmap} color="#10b981" />}
      </div>
    </div>
  );
};

const Predictions = () => {
  const [d, setD] = useState(null);
  const [a, setA] = useState(null);
  const [s, setS] = useState(null);
  useEffect(() => {
    fetch('/api/predictions').then(r => r.json()).then(x => setD(x));
    fetch('/api/alpha-prediction').then(r => r.json()).then(x => setA(x));
    fetch('/api/stats').then(r => r.json()).then(x => setS(x));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>AI <span className="gradient-text">Predictive Analysis</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Calculated from {s?.total_draws || 0} draws ({s?.total_years || 0} years)</p>
        </div>
        <div className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>Engine: Active</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Activity color="#6366f1" />
            <h3>Moving Average (Trend)</h3>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Top</p><h2 style={{ fontSize: '2rem' }}>{d?.ma?.top2 || '--'}</h2></div>
            <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Bottom</p><h2 style={{ fontSize: '2rem' }}>{d?.ma?.bottom2 || '--'}</h2></div>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <BarChart3 color="#a855f7" />
            <h3>Frequency Peak</h3>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Top</p><h2 style={{ fontSize: '2rem' }}>{d?.prob?.top2?.num || '--'}</h2></div>
            <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Bottom</p><h2 style={{ fontSize: '2rem' }}>{d?.prob?.bottom2?.num || '--'}</h2></div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Brain color="#f472b6" />
          <h2>LottoPro-Alpha (Deep Engine)</h2>
        </div>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Real-time probability weights using Markov Chain Simulation & Alpha Neural Weights</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#a855f7' }}>Top 2 Digits Probabilities</h4>
            {a?.top2?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{item.number}</span>
                <span style={{ color: 'var(--accent-primary)' }}>{item.probability}%</span>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Bottom 2 Digits Probabilities</h4>
            {a?.bottom2?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{item.number}</span>
                <span style={{ color: 'var(--accent-primary)' }}>{item.probability}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Flame color="#ef4444" />
            <h3>Hot Numbers (20 Year History)</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {s?.top2?.hot?.map((item, i) => (
              <div key={i} style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontWeight: 800 }}>{item.number}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>{item.count} Times</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Snowflake color="#60a5fa" />
            <h3>Cold Numbers (Dormant)</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {s?.top2?.cold?.map((item, i) => (
              <div key={i} style={{ padding: '0.5rem 1rem', background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.2)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontWeight: 800 }}>{item.number}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>{item.count} Times</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = () => (
  <div>
    <h1 style={{ marginBottom: '2rem' }}>System Settings</h1>
    
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <BookOpen color="#6366f1" />
        <h2>คู่มือการใช้งาน (User Guide)</h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
          <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>1. การดู Dashboard</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            ใช้สำหรับดูผลรางวัลล่าสุด และสถิติสรุปภาพรวมจากฐานข้อมูลทั้งหมด 400 กว่างวด เพื่อให้เห็นภาพรวมของเลขที่เพิ่งออกไป
          </p>
        </div>
        
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
          <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>2. การใช้ Heatmap</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <b>สีเข้ม:</b> คือเลขที่ "เดินดี" ออกบ่อยมากในรอบ 20 ปี<br/>
            <b>สีอ่อน:</b> คือเลขที่ออกน้อย หรือเลข "อั้น" สถิติ<br/>
            ใช้สำหรับหาเลขเด่น (Hot) หรือเลขดับ (Cold) เพื่อวางแผน
          </p>
        </div>
        
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
          <h4 style={{ color: '#10b981', marginBottom: '0.5rem' }}>3. วิเคราะห์ AI Predictions</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <b>Moving Average:</b> ดูแนวโน้มค่ากลางจากงวดล่าสุด<br/>
            <b>Alpha Engine:</b> ระบบที่ฉลาดที่สุด ใช้การสุ่มจำลองเหตุการณ์ 10,000 ครั้ง เพื่อหาน้ำหนักความเป็นไปได้ที่สูงที่สุด
          </p>
        </div>
      </div>
    </div>

    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <ShieldCheck color="#10b981" />
        <h3>System Integrity</h3>
      </div>
      <p style={{ color: 'var(--text-secondary)' }}>Status: Online | Mode: God-Mode Alpha V2.5</p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '1rem' }}>Comprehensive database covering Thai Government Lottery statistics since 2006.</p>
    </div>
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
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
