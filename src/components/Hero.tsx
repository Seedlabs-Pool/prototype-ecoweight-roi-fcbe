import React from 'react';

export default function Hero() {
  const scrollToCalc = () => {
    const el = document.getElementById('calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)', color: '#fff', padding: '64px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, maxWidth: 700 }}>
          Precision ROI for Automotive Lightweighting
        </h1>
        <p style={{ fontSize: 18, opacity: 0.95, maxWidth: 640, marginBottom: 32, lineHeight: 1.6 }}>
          Replace guesswork with physics. Calculate powertrain-specific energy savings from every kilogram saved—so you can justify carbon-fiber and magnesium spend to finance and regulators.
        </p>
        <button
          onClick={scrollToCalc}
          data-cta="primary-cta"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#14b8a6',
            color: '#042f2e',
            border: 'none',
            padding: '14px 28px',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2dd4bf')}
          onMouseLeave={e => (e.currentTarget.style.background = '#14b8a6')}
        >
          Launch Calculator
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
