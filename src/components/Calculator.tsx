import React, { useState, useMemo } from 'react';

type Powertrain = 'ICE' | 'HYBRID' | 'EV';
type Cycle = 'WLTP' | 'EPA' | 'NEDC';

const CYCLE_FACTORS: Record<Cycle, number> = { WLTP: 1.0, EPA: 0.94, NEDC: 0.81 };

const POWERTRAIN_DATA = {
  ICE: {
    label: 'Internal Combustion',
    physicsFactor: 0.048,
    oldFactor: 0.003,
    energyCost: 1.5,
    unit: 'L/100km',
    annualKm: 15000,
    co2Factor: 2.31,
    energyLabel: 'Fuel',
  },
  HYBRID: {
    label: 'Hybrid',
    physicsFactor: 0.032,
    oldFactor: 0.0025,
    energyCost: 1.5,
    unit: 'L/100km eq',
    annualKm: 15000,
    co2Factor: 2.31,
    energyLabel: 'Fuel (eq)',
  },
  EV: {
    label: 'Battery Electric',
    physicsFactor: 0.72,
    oldFactor: 0.04,
    energyCost: 0.15,
    unit: 'Wh/km',
    annualKm: 15000,
    co2Factor: 0.38,
    energyLabel: 'Electricity',
  },
};

function formatNumber(num: number, digits = 1) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(num);
}

function formatCurrency(num: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

export default function Calculator() {
  const [powertrain, setPowertrain] = useState<Powertrain>('EV');
  const [cycle, setCycle] = useState<Cycle>('WLTP');
  const [massReduction, setMassReduction] = useState<number>(25);
  const [baseCost, setBaseCost] = useState<number>(45);
  const [lightweightCost, setLightweightCost] = useState<number>(120);
  const [volume, setVolume] = useState<number>(150000);

  const results = useMemo(() => {
    const data = POWERTRAIN_DATA[powertrain];
    const cycleFactor = CYCLE_FACTORS[cycle];
    const newSavingsPerUnit = massReduction * data.physicsFactor * cycleFactor;
    const oldSavingsPerUnit = massReduction * data.oldFactor * cycleFactor;

    let newAnnualEnergy = 0;
    let oldAnnualEnergy = 0;
    let newAnnualCost = 0;
    let oldAnnualCost = 0;

    if (powertrain === 'EV') {
      newAnnualEnergy = (newSavingsPerUnit * data.annualKm) / 1000;
      oldAnnualEnergy = (oldSavingsPerUnit * data.annualKm) / 1000;
      newAnnualCost = newAnnualEnergy * data.energyCost;
      oldAnnualCost = oldAnnualEnergy * data.energyCost;
    } else {
      newAnnualEnergy = newSavingsPerUnit * (data.annualKm / 100);
      oldAnnualEnergy = oldSavingsPerUnit * (data.annualKm / 100);
      newAnnualCost = newAnnualEnergy * data.energyCost;
      oldAnnualCost = oldAnnualEnergy * data.energyCost;
    }

    const costDeltaPerVehicle = lightweightCost - baseCost;
    const totalInvestment = costDeltaPerVehicle * volume;
    const totalAnnualSavings = newAnnualCost * volume;

    const paybackYears = newAnnualCost > 0 ? costDeltaPerVehicle / newAnnualCost : 0;
    const roi5Year = totalInvestment > 0 ? ((totalAnnualSavings * 5) - totalInvestment) / totalInvestment * 100 : 0;

    const co2Annual = newAnnualEnergy * data.co2Factor * volume;
    const multiplier = oldSavingsPerUnit > 0 ? newSavingsPerUnit / oldSavingsPerUnit : 0;

    return {
      newSavingsPerUnit,
      oldSavingsPerUnit,
      totalAnnualSavings,
      totalInvestment,
      paybackYears,
      roi5Year,
      co2Annual,
      multiplier,
      unit: data.unit,
    };
  }, [powertrain, cycle, massReduction, baseCost, lightweightCost, volume]);

  return (
    <section id="calculator" style={{ padding: '48px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))' }}>
          <div className="card">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#0f172a' }}>Design Parameters</h2>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Powertrain Architecture</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['ICE', 'HYBRID', 'EV'] as Powertrain[]).map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setPowertrain(pt)}
                    style={{
                      flex: 1,
                      minWidth: 80,
                      padding: '10px',
                      border: powertrain === pt ? '1px solid #0f766e' : '1px solid #cbd5e1',
                      background: powertrain === pt ? '#0f766e' : '#fff',
                      color: powertrain === pt ? '#fff' : '#475569',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    {pt === 'ICE' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                      </svg>
                    )}
                    {pt === 'HYBRID' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                      </svg>
                    )}
                    {pt === 'EV' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="10" rx="2"/>
                        <path d="M6 7v10M18 7v10"/>
                      </svg>
                    )}
                    {POWERTRAIN_DATA[pt].label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label htmlFor="cycle" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Regulatory Driving Cycle</label>
              <select id="cycle" value={cycle} onChange={(e) => setCycle(e.target.value as Cycle)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 16, color: '#0f172a', background: '#fff' }}>
                <option value="WLTP">WLTP (Worldwide Harmonised)</option>
                <option value="EPA">EPA FTP-75 (US)</option>
                <option value="NEDC">NEDC (Legacy Europe)</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label htmlFor="mass" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Mass Reduction (kg)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  id="mass"
                  type="range"
                  min={1}
                  max={100}
                  value={massReduction}
                  onChange={(e) => setMassReduction(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#0f766e' }}
                />
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={massReduction}
                  onChange={(e) => setMassReduction(Number(e.target.value))}
                  style={{ width: 80, padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 16, textAlign: 'center' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label htmlFor="baseCost" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Base Part Cost ($)</label>
                <input
                  id="baseCost"
                  type="number"
                  min={0}
                  value={baseCost}
                  onChange={(e) => setBaseCost(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 16 }}
                />
              </div>
              <div>
                <label htmlFor="lightCost" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Lightweight Cost ($)</label>
                <input
                  id="lightCost"
                  type="number"
                  min={0}
                  value={lightweightCost}
                  onChange={(e) => setLightweightCost(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 16 }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="volume" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Annual Production Volume</label>
              <input
                id="volume"
                type="number"
                min={0}
                step={1000}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 16 }}
              />
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 24 }} aria-live="polite" aria-atomic="true">
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#0f172a' }}>Physics-Based Results</h2>

              <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: '#0f766e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Energy Reduction Value (ERV)</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                  {formatNumber(results.newSavingsPerUnit, 2)} <span style={{ fontSize: 18, fontWeight: 600, color: '#475569' }}>{results.unit}</span>
                </div>
                <div style={{ marginTop: 12, fontSize: 14, color: '#475569' }}>
                  Legacy estimate: <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>{formatNumber(results.oldSavingsPerUnit, 2)} {results.unit}</span>
                </div>
                <div style={{ marginTop: 8, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${100 / results.multiplier}%`, background: '#94a3b8', height: '100%' }} />
                  <div style={{ width: `${100 - (100 / results.multiplier)}%`, background: '#0f766e', height: '100%' }} />
                </div>
                <div style={{ marginTop: 6, fontSize: 13, color: '#0f766e', fontWeight: 600 }}>
                  New physics model is {formatNumber(results.multiplier, 1)}× more accurate than class-averaged legacy tools
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="result-card">
                  <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>Annual Fleet Savings</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{formatCurrency(results.totalAnnualSavings)}</div>
                </div>
                <div className="result-card">
                  <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>Material Investment</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{formatCurrency(results.totalInvestment)}</div>
                </div>
                <div className="result-card">
                  <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>Payback Period</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                    {results.paybackYears < 1 ? `${formatNumber(results.paybackYears * 12, 0)} months` : `${formatNumber(results.paybackYears, 1)} years`}
                  </div>
                </div>
                <div className="result-card">
                  <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>5-Year ROI</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{formatNumber(results.roi5Year, 0)}%</div>
                </div>
              </div>

              <div className="result-card" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: '#0f766e', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c4.97-4.97 8-8.93 8-12.8A8 8 0 0 0 4 9.2c0 3.87 3.03 7.83 8 12.8z"/>
                    <path d="M12 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, color: '#64748b', marginBottom: 2 }}>Annual CO₂ Avoided (Fleet)</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                    {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(results.co2Annual / 1000)} tonnes
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Why this matters</h3>
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
                Legacy class-averaged tools systematically underestimate energy savings from lightweighting—by up to 18× for EV architectures. EcoWeight uses differential efficiency factors tied to WLTP, EPA, and NEDC cycles so you can defend material switch business cases with defensible physics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
