import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Calculator from './components/Calculator';

export default function App() {
  return (
    <div>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; color: #0f172a; font-size: 16px; line-height: 1.5; }
        h1, h2, h3, h4, p { margin: 0; }
        .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .card { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        .result-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
        label { display: block; font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 6px; }
        input[type="number"], select { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px; color: #0f172a; background: #fff; }
        input[type="range"] { width: 100%; accent-color: #0f766e; }
        button { font-family: inherit; }
        @media (max-width: 480px) { .container { padding: 0 16px; } .card { padding: 16px; } }
      `}</style>
      <Header />
      <Hero />
      <Calculator />
      <footer style={{ padding: '32px 0', textAlign: 'center', color: '#64748b', fontSize: 14, borderTop: '1px solid #e2e8f0', marginTop: 32 }}>
        <div className="container">
          © {new Date().getFullYear()} EcoWeight. Built for automotive engineering teams.
        </div>
      </footer>
    </div>
  );
}
